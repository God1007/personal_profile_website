#include <drogon/drogon.h>
#include <algorithm>
#include <chrono>
#include <cctype>
#include <cstdlib>
#include <filesystem>
#include <optional>
#include <sstream>
#include <sqlite3.h>

namespace fs = std::filesystem;
using drogon::HttpResponse;
using drogon::HttpResponsePtr;
using drogon::HttpStatusCode;
using Json::Value;

namespace {
constexpr int kReviewIntervalsDays[] = {1, 3, 7, 14, 30};

std::string getEnvOrDefault(const char *key, const std::string &fallback) {
    if (const char *value = std::getenv(key)) {
        return value;
    }
    return fallback;
}

std::string trim(const std::string &value) {
    auto start = std::find_if_not(value.begin(), value.end(), [](unsigned char c) { return std::isspace(c) != 0; });
    auto end = std::find_if_not(value.rbegin(), value.rend(), [](unsigned char c) { return std::isspace(c) != 0; }).base();
    if (start >= end) {
        return "";
    }
    return std::string(start, end);
}

std::string sanitizeFilename(const std::string &filename) {
    std::string result;
    result.reserve(filename.size());
    for (unsigned char c : filename) {
        if (std::isalnum(c) || c == '.' || c == '_' || c == '-') {
            result.push_back(static_cast<char>(c));
        } else {
            result.push_back('_');
        }
    }
    if (result.empty()) {
        result = "upload";
    }
    return result;
}

bool hasAllowedUploadExtension(const std::string &filename) {
    auto ext = fs::path(filename).extension().string();
    std::transform(ext.begin(), ext.end(), ext.begin(), [](unsigned char c) { return static_cast<char>(std::tolower(c)); });
    return ext == ".pdf" || ext == ".md";
}

std::string makeUniqueUploadName(const std::string &originalName) {
    const auto safeName = sanitizeFilename(originalName);
    const auto stem = fs::path(safeName).stem().string();
    auto ext = fs::path(safeName).extension().string();
    if (ext.empty()) {
        ext = ".md";
    }
    auto now = std::chrono::duration_cast<std::chrono::milliseconds>(std::chrono::system_clock::now().time_since_epoch()).count();
    std::ostringstream oss;
    oss << (stem.empty() ? "upload" : stem) << "_" << now << ext;
    return oss.str();
}

std::string nowIso8601() {
    auto now = std::chrono::system_clock::now();
    std::time_t nowTime = std::chrono::system_clock::to_time_t(now);
    std::tm utcTm{};
    gmtime_r(&nowTime, &utcTm);
    char buffer[32];
    std::strftime(buffer, sizeof(buffer), "%Y-%m-%dT%H:%M:%SZ", &utcTm);
    return buffer;
}

std::string todayDate() {
    auto now = std::chrono::system_clock::now();
    std::time_t nowTime = std::chrono::system_clock::to_time_t(now);
    std::tm utcTm{};
    gmtime_r(&nowTime, &utcTm);
    char buffer[16];
    std::strftime(buffer, sizeof(buffer), "%Y-%m-%d", &utcTm);
    return buffer;
}

std::string addDaysIso8601(int days) {
    auto now = std::chrono::system_clock::now();
    auto next = now + std::chrono::hours(24 * days);
    std::time_t nextTime = std::chrono::system_clock::to_time_t(next);
    std::tm utcTm{};
    gmtime_r(&nextTime, &utcTm);
    char buffer[32];
    std::strftime(buffer, sizeof(buffer), "%Y-%m-%dT%H:%M:%SZ", &utcTm);
    return buffer;
}

std::string safeColumnText(sqlite3_stmt *stmt, int index) {
    const auto *text = sqlite3_column_text(stmt, index);
    return text ? reinterpret_cast<const char *>(text) : "";
}

struct Note {
    int id = 0;
    std::string title;
    std::string content;
    std::string tags;
    std::string createdAt;
    std::string nextReviewAt;
    int reviewStage = 0;
    std::string pdfPath;
};

struct InterviewRecord {
    int id = 0;
    std::string company;
    std::string role;
    std::string interviewDate;
    std::string summary;
    std::string createdAt;
};

struct TimelineEvent {
    int id = 0;
    std::string eventDate;
    std::string title;
    std::string detail;
    std::string createdAt;
};

class Database {
public:
    explicit Database(std::string path)
        : path_(std::move(path)) {
        fs::create_directories(fs::path(path_).parent_path());
        if (sqlite3_open(path_.c_str(), &db_) != SQLITE_OK) {
            throw std::runtime_error("Failed to open SQLite database");
        }
        initSchema();
    }

    ~Database() {
        if (db_) {
            sqlite3_close(db_);
        }
    }

    std::vector<Note> listNotes() {
        return queryNotes("SELECT id, title, content, tags, created_at, next_review_at, review_stage, pdf_path FROM notes ORDER BY created_at DESC");
    }

    std::vector<Note> listReviewsDue(const std::string &nowIso) {
        const char *sql = "SELECT id, title, content, tags, created_at, next_review_at, review_stage, pdf_path FROM notes WHERE next_review_at <= ? ORDER BY next_review_at ASC";
        sqlite3_stmt *stmt = nullptr;
        std::vector<Note> notes;
        if (sqlite3_prepare_v2(db_, sql, -1, &stmt, nullptr) == SQLITE_OK) {
            sqlite3_bind_text(stmt, 1, nowIso.c_str(), -1, SQLITE_TRANSIENT);
            while (sqlite3_step(stmt) == SQLITE_ROW) {
                notes.push_back(rowToNote(stmt));
            }
        }
        sqlite3_finalize(stmt);
        return notes;
    }

    std::optional<Note> createNote(const Note &note) {
        const char *sql = "INSERT INTO notes (title, content, tags, created_at, next_review_at, review_stage, pdf_path) VALUES (?, ?, ?, ?, ?, ?, ?)";
        sqlite3_stmt *stmt = nullptr;
        if (sqlite3_prepare_v2(db_, sql, -1, &stmt, nullptr) != SQLITE_OK) {
            return std::nullopt;
        }
        sqlite3_bind_text(stmt, 1, note.title.c_str(), -1, SQLITE_TRANSIENT);
        sqlite3_bind_text(stmt, 2, note.content.c_str(), -1, SQLITE_TRANSIENT);
        sqlite3_bind_text(stmt, 3, note.tags.c_str(), -1, SQLITE_TRANSIENT);
        sqlite3_bind_text(stmt, 4, note.createdAt.c_str(), -1, SQLITE_TRANSIENT);
        sqlite3_bind_text(stmt, 5, note.nextReviewAt.c_str(), -1, SQLITE_TRANSIENT);
        sqlite3_bind_int(stmt, 6, note.reviewStage);
        sqlite3_bind_text(stmt, 7, note.pdfPath.c_str(), -1, SQLITE_TRANSIENT);
        bool ok = sqlite3_step(stmt) == SQLITE_DONE;
        sqlite3_finalize(stmt);
        if (!ok) {
            return std::nullopt;
        }
        int id = static_cast<int>(sqlite3_last_insert_rowid(db_));
        return getNoteById(id);
    }

    std::optional<Note> updateNote(int id, const Note &note) {
        const char *sql = "UPDATE notes SET title = ?, content = ?, tags = ?, next_review_at = ?, review_stage = ?, pdf_path = ? WHERE id = ?";
        sqlite3_stmt *stmt = nullptr;
        if (sqlite3_prepare_v2(db_, sql, -1, &stmt, nullptr) != SQLITE_OK) {
            return std::nullopt;
        }
        sqlite3_bind_text(stmt, 1, note.title.c_str(), -1, SQLITE_TRANSIENT);
        sqlite3_bind_text(stmt, 2, note.content.c_str(), -1, SQLITE_TRANSIENT);
        sqlite3_bind_text(stmt, 3, note.tags.c_str(), -1, SQLITE_TRANSIENT);
        sqlite3_bind_text(stmt, 4, note.nextReviewAt.c_str(), -1, SQLITE_TRANSIENT);
        sqlite3_bind_int(stmt, 5, note.reviewStage);
        sqlite3_bind_text(stmt, 6, note.pdfPath.c_str(), -1, SQLITE_TRANSIENT);
        sqlite3_bind_int(stmt, 7, id);
        bool ok = sqlite3_step(stmt) == SQLITE_DONE;
        sqlite3_finalize(stmt);
        if (!ok) {
            return std::nullopt;
        }
        return getNoteById(id);
    }

    bool deleteNote(int id) {
        return executeDelete("DELETE FROM notes WHERE id = ?", id);
    }

    std::optional<Note> getNoteById(int id) {
        const char *sql = "SELECT id, title, content, tags, created_at, next_review_at, review_stage, pdf_path FROM notes WHERE id = ?";
        sqlite3_stmt *stmt = nullptr;
        std::optional<Note> result;
        if (sqlite3_prepare_v2(db_, sql, -1, &stmt, nullptr) == SQLITE_OK) {
            sqlite3_bind_int(stmt, 1, id);
            if (sqlite3_step(stmt) == SQLITE_ROW) {
                result = rowToNote(stmt);
            }
        }
        sqlite3_finalize(stmt);
        return result;
    }

    std::optional<Note> advanceReview(int id) {
        auto noteOpt = getNoteById(id);
        if (!noteOpt) {
            return std::nullopt;
        }
        Note note = *noteOpt;
        if (note.reviewStage < static_cast<int>(std::size(kReviewIntervalsDays))) {
            note.reviewStage += 1;
        }
        int stageIndex = std::min(note.reviewStage, static_cast<int>(std::size(kReviewIntervalsDays)) - 1);
        note.nextReviewAt = addDaysIso8601(kReviewIntervalsDays[stageIndex]);
        return updateNote(note.id, note);
    }

    std::vector<InterviewRecord> listInterviews() {
        const char *sql = "SELECT id, company, role, interview_date, summary, created_at FROM interview_records ORDER BY interview_date DESC, created_at DESC";
        sqlite3_stmt *stmt = nullptr;
        std::vector<InterviewRecord> rows;
        if (sqlite3_prepare_v2(db_, sql, -1, &stmt, nullptr) == SQLITE_OK) {
            while (sqlite3_step(stmt) == SQLITE_ROW) {
                InterviewRecord row;
                row.id = sqlite3_column_int(stmt, 0);
                row.company = safeColumnText(stmt, 1);
                row.role = safeColumnText(stmt, 2);
                row.interviewDate = safeColumnText(stmt, 3);
                row.summary = safeColumnText(stmt, 4);
                row.createdAt = safeColumnText(stmt, 5);
                rows.push_back(row);
            }
        }
        sqlite3_finalize(stmt);
        return rows;
    }

    std::optional<InterviewRecord> createInterview(const InterviewRecord &record) {
        const char *sql = "INSERT INTO interview_records (company, role, interview_date, summary, created_at) VALUES (?, ?, ?, ?, ?)";
        sqlite3_stmt *stmt = nullptr;
        if (sqlite3_prepare_v2(db_, sql, -1, &stmt, nullptr) != SQLITE_OK) {
            return std::nullopt;
        }
        sqlite3_bind_text(stmt, 1, record.company.c_str(), -1, SQLITE_TRANSIENT);
        sqlite3_bind_text(stmt, 2, record.role.c_str(), -1, SQLITE_TRANSIENT);
        sqlite3_bind_text(stmt, 3, record.interviewDate.c_str(), -1, SQLITE_TRANSIENT);
        sqlite3_bind_text(stmt, 4, record.summary.c_str(), -1, SQLITE_TRANSIENT);
        sqlite3_bind_text(stmt, 5, record.createdAt.c_str(), -1, SQLITE_TRANSIENT);
        bool ok = sqlite3_step(stmt) == SQLITE_DONE;
        sqlite3_finalize(stmt);
        if (!ok) {
            return std::nullopt;
        }
        int id = static_cast<int>(sqlite3_last_insert_rowid(db_));
        return getInterviewById(id);
    }

    std::optional<InterviewRecord> getInterviewById(int id) {
        const char *sql = "SELECT id, company, role, interview_date, summary, created_at FROM interview_records WHERE id = ?";
        sqlite3_stmt *stmt = nullptr;
        std::optional<InterviewRecord> row;
        if (sqlite3_prepare_v2(db_, sql, -1, &stmt, nullptr) == SQLITE_OK) {
            sqlite3_bind_int(stmt, 1, id);
            if (sqlite3_step(stmt) == SQLITE_ROW) {
                InterviewRecord r;
                r.id = sqlite3_column_int(stmt, 0);
                r.company = safeColumnText(stmt, 1);
                r.role = safeColumnText(stmt, 2);
                r.interviewDate = safeColumnText(stmt, 3);
                r.summary = safeColumnText(stmt, 4);
                r.createdAt = safeColumnText(stmt, 5);
                row = r;
            }
        }
        sqlite3_finalize(stmt);
        return row;
    }

    bool deleteInterview(int id) {
        return executeDelete("DELETE FROM interview_records WHERE id = ?", id);
    }

    std::vector<TimelineEvent> listTimelineEvents() {
        const char *sql = "SELECT id, event_date, title, detail, created_at FROM timeline_events ORDER BY event_date DESC, created_at DESC";
        sqlite3_stmt *stmt = nullptr;
        std::vector<TimelineEvent> rows;
        if (sqlite3_prepare_v2(db_, sql, -1, &stmt, nullptr) == SQLITE_OK) {
            while (sqlite3_step(stmt) == SQLITE_ROW) {
                TimelineEvent row;
                row.id = sqlite3_column_int(stmt, 0);
                row.eventDate = safeColumnText(stmt, 1);
                row.title = safeColumnText(stmt, 2);
                row.detail = safeColumnText(stmt, 3);
                row.createdAt = safeColumnText(stmt, 4);
                rows.push_back(row);
            }
        }
        sqlite3_finalize(stmt);
        return rows;
    }

    std::optional<TimelineEvent> createTimelineEvent(const TimelineEvent &record) {
        const char *sql = "INSERT INTO timeline_events (event_date, title, detail, created_at) VALUES (?, ?, ?, ?)";
        sqlite3_stmt *stmt = nullptr;
        if (sqlite3_prepare_v2(db_, sql, -1, &stmt, nullptr) != SQLITE_OK) {
            return std::nullopt;
        }
        sqlite3_bind_text(stmt, 1, record.eventDate.c_str(), -1, SQLITE_TRANSIENT);
        sqlite3_bind_text(stmt, 2, record.title.c_str(), -1, SQLITE_TRANSIENT);
        sqlite3_bind_text(stmt, 3, record.detail.c_str(), -1, SQLITE_TRANSIENT);
        sqlite3_bind_text(stmt, 4, record.createdAt.c_str(), -1, SQLITE_TRANSIENT);
        bool ok = sqlite3_step(stmt) == SQLITE_DONE;
        sqlite3_finalize(stmt);
        if (!ok) {
            return std::nullopt;
        }
        int id = static_cast<int>(sqlite3_last_insert_rowid(db_));
        return getTimelineEventById(id);
    }

    std::optional<TimelineEvent> getTimelineEventById(int id) {
        const char *sql = "SELECT id, event_date, title, detail, created_at FROM timeline_events WHERE id = ?";
        sqlite3_stmt *stmt = nullptr;
        std::optional<TimelineEvent> row;
        if (sqlite3_prepare_v2(db_, sql, -1, &stmt, nullptr) == SQLITE_OK) {
            sqlite3_bind_int(stmt, 1, id);
            if (sqlite3_step(stmt) == SQLITE_ROW) {
                TimelineEvent r;
                r.id = sqlite3_column_int(stmt, 0);
                r.eventDate = safeColumnText(stmt, 1);
                r.title = safeColumnText(stmt, 2);
                r.detail = safeColumnText(stmt, 3);
                r.createdAt = safeColumnText(stmt, 4);
                row = r;
            }
        }
        sqlite3_finalize(stmt);
        return row;
    }

    std::optional<TimelineEvent> updateTimelineEvent(int id, const TimelineEvent &record) {
        const char *sql = "UPDATE timeline_events SET event_date = ?, title = ?, detail = ? WHERE id = ?";
        sqlite3_stmt *stmt = nullptr;
        if (sqlite3_prepare_v2(db_, sql, -1, &stmt, nullptr) != SQLITE_OK) {
            return std::nullopt;
        }
        sqlite3_bind_text(stmt, 1, record.eventDate.c_str(), -1, SQLITE_TRANSIENT);
        sqlite3_bind_text(stmt, 2, record.title.c_str(), -1, SQLITE_TRANSIENT);
        sqlite3_bind_text(stmt, 3, record.detail.c_str(), -1, SQLITE_TRANSIENT);
        sqlite3_bind_int(stmt, 4, id);
        bool ok = sqlite3_step(stmt) == SQLITE_DONE;
        sqlite3_finalize(stmt);
        if (!ok) {
            return std::nullopt;
        }
        return getTimelineEventById(id);
    }

    bool deleteTimelineEvent(int id) {
        return executeDelete("DELETE FROM timeline_events WHERE id = ?", id);
    }

private:
    void initSchema() {
        const char *sqlNotes =
            "CREATE TABLE IF NOT EXISTS notes ("
            "id INTEGER PRIMARY KEY AUTOINCREMENT,"
            "title TEXT NOT NULL,"
            "content TEXT NOT NULL,"
            "tags TEXT NOT NULL,"
            "created_at TEXT NOT NULL,"
            "next_review_at TEXT NOT NULL,"
            "review_stage INTEGER NOT NULL,"
            "pdf_path TEXT NOT NULL"
            ");";

        const char *sqlInterviews =
            "CREATE TABLE IF NOT EXISTS interview_records ("
            "id INTEGER PRIMARY KEY AUTOINCREMENT,"
            "company TEXT NOT NULL,"
            "role TEXT NOT NULL,"
            "interview_date TEXT NOT NULL,"
            "summary TEXT NOT NULL,"
            "created_at TEXT NOT NULL"
            ");";

        const char *sqlTimeline =
            "CREATE TABLE IF NOT EXISTS timeline_events ("
            "id INTEGER PRIMARY KEY AUTOINCREMENT,"
            "event_date TEXT NOT NULL,"
            "title TEXT NOT NULL,"
            "detail TEXT NOT NULL,"
            "created_at TEXT NOT NULL"
            ");";

        char *err = nullptr;
        if (sqlite3_exec(db_, sqlNotes, nullptr, nullptr, &err) != SQLITE_OK ||
            sqlite3_exec(db_, sqlInterviews, nullptr, nullptr, &err) != SQLITE_OK ||
            sqlite3_exec(db_, sqlTimeline, nullptr, nullptr, &err) != SQLITE_OK) {
            std::string message = err ? err : "Failed to init schema";
            sqlite3_free(err);
            throw std::runtime_error(message);
        }
    }

    bool executeDelete(const char *sql, int id) {
        sqlite3_stmt *stmt = nullptr;
        if (sqlite3_prepare_v2(db_, sql, -1, &stmt, nullptr) != SQLITE_OK) {
            return false;
        }
        sqlite3_bind_int(stmt, 1, id);
        bool ok = sqlite3_step(stmt) == SQLITE_DONE;
        int changes = sqlite3_changes(db_);
        sqlite3_finalize(stmt);
        return ok && changes > 0;
    }

    std::vector<Note> queryNotes(const std::string &sql) {
        sqlite3_stmt *stmt = nullptr;
        std::vector<Note> notes;
        if (sqlite3_prepare_v2(db_, sql.c_str(), -1, &stmt, nullptr) == SQLITE_OK) {
            while (sqlite3_step(stmt) == SQLITE_ROW) {
                notes.push_back(rowToNote(stmt));
            }
        }
        sqlite3_finalize(stmt);
        return notes;
    }

    static Note rowToNote(sqlite3_stmt *stmt) {
        Note note;
        note.id = sqlite3_column_int(stmt, 0);
        note.title = safeColumnText(stmt, 1);
        note.content = safeColumnText(stmt, 2);
        note.tags = safeColumnText(stmt, 3);
        note.createdAt = safeColumnText(stmt, 4);
        note.nextReviewAt = safeColumnText(stmt, 5);
        note.reviewStage = sqlite3_column_int(stmt, 6);
        note.pdfPath = safeColumnText(stmt, 7);
        return note;
    }

    std::string path_;
    sqlite3 *db_ = nullptr;
};

Value noteToJson(const Note &note) {
    Value json;
    json["id"] = note.id;
    json["title"] = note.title;
    json["content"] = note.content;
    json["tags"] = note.tags;
    json["createdAt"] = note.createdAt;
    json["nextReviewAt"] = note.nextReviewAt;
    json["reviewStage"] = note.reviewStage;
    json["pdfPath"] = note.pdfPath;
    return json;
}

Value interviewToJson(const InterviewRecord &record) {
    Value json;
    json["id"] = record.id;
    json["company"] = record.company;
    json["role"] = record.role;
    json["interviewDate"] = record.interviewDate;
    json["summary"] = record.summary;
    json["createdAt"] = record.createdAt;
    return json;
}

Value timelineToJson(const TimelineEvent &event) {
    Value json;
    json["id"] = event.id;
    json["eventDate"] = event.eventDate;
    json["title"] = event.title;
    json["detail"] = event.detail;
    json["createdAt"] = event.createdAt;
    return json;
}

HttpResponsePtr jsonResponse(const Value &json, HttpStatusCode status = HttpStatusCode::k200OK) {
    auto resp = HttpResponse::newHttpJsonResponse(json);
    resp->setStatusCode(status);
    return resp;
}

} // namespace

int main() {
    const std::string dbPath = getEnvOrDefault("PLH_DB_PATH", "./data/app.db");
    const std::string uploadDir = getEnvOrDefault("PLH_UPLOAD_DIR", "./data/uploads");
    const std::string portValue = getEnvOrDefault("PLH_PORT", "8080");

    fs::create_directories(uploadDir);

    Database db(dbPath);

    drogon::app().setDocumentRoot("./public");

    drogon::app().registerHandler(
        "/api/notes", [&db](const drogon::HttpRequestPtr &request, std::function<void(const HttpResponsePtr &)> &&callback) {
            if (request->method() == drogon::Get) {
                Value payload;
                payload["notes"] = Value(Json::arrayValue);
                for (const auto &note : db.listNotes()) {
                    payload["notes"].append(noteToJson(note));
                }
                callback(jsonResponse(payload));
                return;
            }
            if (request->method() == drogon::Post) {
                auto json = request->getJsonObject();
                if (!json || !json->isMember("title")) {
                    Value error;
                    error["error"] = "Missing title";
                    callback(jsonResponse(error, HttpStatusCode::k400BadRequest));
                    return;
                }
                Note note;
                note.title = trim((*json)["title"].asString());
                if (note.title.empty()) {
                    Value error;
                    error["error"] = "Title cannot be empty";
                    callback(jsonResponse(error, HttpStatusCode::k400BadRequest));
                    return;
                }
                note.content = (*json)["content"].asString();
                note.tags = (*json)["tags"].asString();
                note.createdAt = nowIso8601();
                note.reviewStage = 0;
                note.nextReviewAt = addDaysIso8601(kReviewIntervalsDays[0]);
                note.pdfPath = (*json)["pdfPath"].asString();
                auto created = db.createNote(note);
                if (!created) {
                    Value error;
                    error["error"] = "Failed to create note";
                    callback(jsonResponse(error, HttpStatusCode::k500InternalServerError));
                    return;
                }
                callback(jsonResponse(noteToJson(*created), HttpStatusCode::k201Created));
                return;
            }
            auto resp = HttpResponse::newHttpResponse();
            resp->setStatusCode(HttpStatusCode::k405MethodNotAllowed);
            callback(resp);
        },
        {drogon::Get, drogon::Post});

    drogon::app().registerHandler(
        "/api/notes/{1}", [&db](const drogon::HttpRequestPtr &request, std::function<void(const HttpResponsePtr &)> &&callback, int id) {
            if (request->method() == drogon::Delete) {
                if (!db.deleteNote(id)) {
                    Value error;
                    error["error"] = "Not found";
                    callback(jsonResponse(error, HttpStatusCode::k404NotFound));
                    return;
                }
                Value response;
                response["ok"] = true;
                callback(jsonResponse(response));
                return;
            }
            auto resp = HttpResponse::newHttpResponse();
            resp->setStatusCode(HttpStatusCode::k405MethodNotAllowed);
            callback(resp);
        },
        {drogon::Delete});

    drogon::app().registerHandler(
        "/api/notes/{1}/review", [&db](const drogon::HttpRequestPtr &request, std::function<void(const HttpResponsePtr &)> &&callback, int id) {
            if (request->method() != drogon::Post) {
                auto resp = HttpResponse::newHttpResponse();
                resp->setStatusCode(HttpStatusCode::k405MethodNotAllowed);
                callback(resp);
                return;
            }
            auto updated = db.advanceReview(id);
            if (!updated) {
                Value error;
                error["error"] = "Not found";
                callback(jsonResponse(error, HttpStatusCode::k404NotFound));
                return;
            }
            callback(jsonResponse(noteToJson(*updated)));
        },
        {drogon::Post});

    drogon::app().registerHandler(
        "/api/reviews", [&db](const drogon::HttpRequestPtr &request, std::function<void(const HttpResponsePtr &)> &&callback) {
            Value payload;
            payload["notes"] = Value(Json::arrayValue);
            for (const auto &note : db.listReviewsDue(nowIso8601())) {
                payload["notes"].append(noteToJson(note));
            }
            callback(jsonResponse(payload));
        },
        {drogon::Get});

    drogon::app().registerHandler(
        "/api/interviews", [&db](const drogon::HttpRequestPtr &request, std::function<void(const HttpResponsePtr &)> &&callback) {
            if (request->method() == drogon::Get) {
                Value payload;
                payload["records"] = Value(Json::arrayValue);
                for (const auto &item : db.listInterviews()) {
                    payload["records"].append(interviewToJson(item));
                }
                callback(jsonResponse(payload));
                return;
            }
            if (request->method() == drogon::Post) {
                auto json = request->getJsonObject();
                if (!json) {
                    Value error;
                    error["error"] = "Missing body";
                    callback(jsonResponse(error, HttpStatusCode::k400BadRequest));
                    return;
                }
                InterviewRecord record;
                record.company = trim((*json)["company"].asString());
                record.role = trim((*json)["role"].asString());
                record.interviewDate = trim((*json)["interviewDate"].asString());
                record.summary = trim((*json)["summary"].asString());
                record.createdAt = nowIso8601();
                if (record.company.empty() || record.role.empty()) {
                    Value error;
                    error["error"] = "Company and role are required";
                    callback(jsonResponse(error, HttpStatusCode::k400BadRequest));
                    return;
                }
                if (record.interviewDate.empty()) {
                    record.interviewDate = todayDate();
                }
                auto created = db.createInterview(record);
                if (!created) {
                    Value error;
                    error["error"] = "Failed to create interview record";
                    callback(jsonResponse(error, HttpStatusCode::k500InternalServerError));
                    return;
                }
                callback(jsonResponse(interviewToJson(*created), HttpStatusCode::k201Created));
                return;
            }
            auto resp = HttpResponse::newHttpResponse();
            resp->setStatusCode(HttpStatusCode::k405MethodNotAllowed);
            callback(resp);
        },
        {drogon::Get, drogon::Post});

    drogon::app().registerHandler(
        "/api/interviews/{1}", [&db](const drogon::HttpRequestPtr &request, std::function<void(const HttpResponsePtr &)> &&callback, int id) {
            if (request->method() != drogon::Delete) {
                auto resp = HttpResponse::newHttpResponse();
                resp->setStatusCode(HttpStatusCode::k405MethodNotAllowed);
                callback(resp);
                return;
            }
            if (!db.deleteInterview(id)) {
                Value error;
                error["error"] = "Not found";
                callback(jsonResponse(error, HttpStatusCode::k404NotFound));
                return;
            }
            Value payload;
            payload["ok"] = true;
            callback(jsonResponse(payload));
        },
        {drogon::Delete});

    drogon::app().registerHandler(
        "/api/timeline", [&db](const drogon::HttpRequestPtr &request, std::function<void(const HttpResponsePtr &)> &&callback) {
            if (request->method() == drogon::Get) {
                Value payload;
                payload["events"] = Value(Json::arrayValue);
                for (const auto &item : db.listTimelineEvents()) {
                    payload["events"].append(timelineToJson(item));
                }
                callback(jsonResponse(payload));
                return;
            }
            if (request->method() == drogon::Post) {
                auto json = request->getJsonObject();
                if (!json) {
                    Value error;
                    error["error"] = "Missing body";
                    callback(jsonResponse(error, HttpStatusCode::k400BadRequest));
                    return;
                }
                TimelineEvent event;
                event.eventDate = trim((*json)["eventDate"].asString());
                event.title = trim((*json)["title"].asString());
                event.detail = trim((*json)["detail"].asString());
                event.createdAt = nowIso8601();
                if (event.title.empty()) {
                    Value error;
                    error["error"] = "Title is required";
                    callback(jsonResponse(error, HttpStatusCode::k400BadRequest));
                    return;
                }
                if (event.eventDate.empty()) {
                    event.eventDate = todayDate();
                }
                auto created = db.createTimelineEvent(event);
                if (!created) {
                    Value error;
                    error["error"] = "Failed to create timeline event";
                    callback(jsonResponse(error, HttpStatusCode::k500InternalServerError));
                    return;
                }
                callback(jsonResponse(timelineToJson(*created), HttpStatusCode::k201Created));
                return;
            }
            auto resp = HttpResponse::newHttpResponse();
            resp->setStatusCode(HttpStatusCode::k405MethodNotAllowed);
            callback(resp);
        },
        {drogon::Get, drogon::Post});

    drogon::app().registerHandler(
        "/api/timeline/{1}", [&db](const drogon::HttpRequestPtr &request, std::function<void(const HttpResponsePtr &)> &&callback, int id) {
            if (request->method() == drogon::Delete) {
                if (!db.deleteTimelineEvent(id)) {
                    Value error;
                    error["error"] = "Not found";
                    callback(jsonResponse(error, HttpStatusCode::k404NotFound));
                    return;
                }
                Value payload;
                payload["ok"] = true;
                callback(jsonResponse(payload));
                return;
            }

            if (request->method() == drogon::Put) {
                auto json = request->getJsonObject();
                if (!json) {
                    Value error;
                    error["error"] = "Missing body";
                    callback(jsonResponse(error, HttpStatusCode::k400BadRequest));
                    return;
                }
                TimelineEvent event;
                event.eventDate = trim((*json)["eventDate"].asString());
                event.title = trim((*json)["title"].asString());
                event.detail = trim((*json)["detail"].asString());
                if (event.title.empty()) {
                    Value error;
                    error["error"] = "Title is required";
                    callback(jsonResponse(error, HttpStatusCode::k400BadRequest));
                    return;
                }
                if (event.eventDate.empty()) {
                    event.eventDate = todayDate();
                }
                auto updated = db.updateTimelineEvent(id, event);
                if (!updated) {
                    Value error;
                    error["error"] = "Not found";
                    callback(jsonResponse(error, HttpStatusCode::k404NotFound));
                    return;
                }
                callback(jsonResponse(timelineToJson(*updated)));
                return;
            }

            auto resp = HttpResponse::newHttpResponse();
            resp->setStatusCode(HttpStatusCode::k405MethodNotAllowed);
            callback(resp);
        },
        {drogon::Delete, drogon::Put});

    drogon::app().registerHandler(
        "/api/upload", [&uploadDir](const drogon::HttpRequestPtr &request, std::function<void(const HttpResponsePtr &)> &&callback) {
            if (request->method() != drogon::Post) {
                auto resp = HttpResponse::newHttpResponse();
                resp->setStatusCode(HttpStatusCode::k405MethodNotAllowed);
                callback(resp);
                return;
            }
            drogon::MultiPartParser parser;
            if (parser.parse(request) != 0) {
                Value error;
                error["error"] = "Failed to parse upload";
                callback(jsonResponse(error, HttpStatusCode::k400BadRequest));
                return;
            }
            const auto &files = parser.getFiles();
            if (files.empty()) {
                Value error;
                error["error"] = "No file uploaded";
                callback(jsonResponse(error, HttpStatusCode::k400BadRequest));
                return;
            }
            const auto &file = files.front();
            std::string filename = file.getFileName();
            if (filename.empty() || !hasAllowedUploadExtension(filename)) {
                Value error;
                error["error"] = "Only .pdf or .md files are supported";
                callback(jsonResponse(error, HttpStatusCode::k400BadRequest));
                return;
            }
            filename = makeUniqueUploadName(filename);
            fs::create_directories(uploadDir);
            std::string destPath = (fs::path(uploadDir) / filename).string();
            if (file.saveAs(destPath) != 0) {
                Value error;
                error["error"] = "Failed to save uploaded file";
                callback(jsonResponse(error, HttpStatusCode::k500InternalServerError));
                return;
            }
            Value payload;
            payload["path"] = "/uploads/" + filename;
            callback(jsonResponse(payload, HttpStatusCode::k201Created));
        },
        {drogon::Post});

    drogon::app().registerHandler(
        "/api/uploads", [&uploadDir](const drogon::HttpRequestPtr &request, std::function<void(const HttpResponsePtr &)> &&callback) {
            if (request->method() != drogon::Get) {
                auto resp = HttpResponse::newHttpResponse();
                resp->setStatusCode(HttpStatusCode::k405MethodNotAllowed);
                callback(resp);
                return;
            }
            fs::create_directories(uploadDir);
            Value payload;
            payload["files"] = Value(Json::arrayValue);
            std::error_code ec;
            for (const auto &entry : fs::directory_iterator(uploadDir, ec)) {
                if (ec || !entry.is_regular_file()) {
                    continue;
                }
                Value file;
                const auto name = entry.path().filename().string();
                file["name"] = name;
                file["path"] = "/uploads/" + name;
                file["size"] = static_cast<Json::Int64>(entry.file_size());
                auto ticks = entry.last_write_time().time_since_epoch().count();
                file["lastModified"] = std::to_string(ticks);
                payload["files"].append(file);
            }
            callback(jsonResponse(payload));
        },
        {drogon::Get});

    drogon::app().registerHandler(
        "/api/uploads/{1}", [&uploadDir](const drogon::HttpRequestPtr &request, std::function<void(const HttpResponsePtr &)> &&callback, const std::string &filename) {
            if (request->method() != drogon::Delete) {
                auto resp = HttpResponse::newHttpResponse();
                resp->setStatusCode(HttpStatusCode::k405MethodNotAllowed);
                callback(resp);
                return;
            }
            if (filename.find('/') != std::string::npos || filename.find("..") != std::string::npos) {
                auto resp = HttpResponse::newHttpResponse();
                resp->setStatusCode(HttpStatusCode::k400BadRequest);
                callback(resp);
                return;
            }
            auto filePath = fs::path(uploadDir) / filename;
            if (!fs::exists(filePath)) {
                Value error;
                error["error"] = "Not found";
                callback(jsonResponse(error, HttpStatusCode::k404NotFound));
                return;
            }
            std::error_code ec2;
            fs::remove(filePath, ec2);
            if (ec2) {
                Value error;
                error["error"] = "Failed to delete upload";
                callback(jsonResponse(error, HttpStatusCode::k500InternalServerError));
                return;
            }
            Value payload;
            payload["ok"] = true;
            callback(jsonResponse(payload));
        },
        {drogon::Delete});

    drogon::app().registerHandler(
        "/uploads/{1}", [&uploadDir](const drogon::HttpRequestPtr &request, std::function<void(const HttpResponsePtr &)> &&callback, const std::string &filename) {
            if (filename.find('/') != std::string::npos || filename.find("..") != std::string::npos) {
                auto resp = HttpResponse::newHttpResponse();
                resp->setStatusCode(HttpStatusCode::k400BadRequest);
                callback(resp);
                return;
            }
            auto filePath = fs::path(uploadDir) / filename;
            if (!fs::exists(filePath)) {
                auto resp = HttpResponse::newHttpResponse();
                resp->setStatusCode(HttpStatusCode::k404NotFound);
                callback(resp);
                return;
            }
            auto resp = HttpResponse::newFileResponse(filePath.string());
            callback(resp);
        },
        {drogon::Get});

    drogon::app().addListener("0.0.0.0", std::stoi(portValue));
    drogon::app().run();
}
