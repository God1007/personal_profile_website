#include <drogon/drogon.h>
#include <filesystem>
#include <optional>
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

std::string nowIso8601() {
    auto now = std::chrono::system_clock::now();
    std::time_t nowTime = std::chrono::system_clock::to_time_t(now);
    std::tm utcTm{};
    gmtime_r(&nowTime, &utcTm);
    char buffer[32];
    std::strftime(buffer, sizeof(buffer), "%Y-%m-%dT%H:%M:%SZ", &utcTm);
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
        const char *sql = "DELETE FROM notes WHERE id = ?";
        sqlite3_stmt *stmt = nullptr;
        if (sqlite3_prepare_v2(db_, sql, -1, &stmt, nullptr) != SQLITE_OK) {
            return false;
        }
        sqlite3_bind_int(stmt, 1, id);
        bool ok = sqlite3_step(stmt) == SQLITE_DONE;
        sqlite3_finalize(stmt);
        return ok;
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

private:
    void initSchema() {
        const char *sql =
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
        char *err = nullptr;
        if (sqlite3_exec(db_, sql, nullptr, nullptr, &err) != SQLITE_OK) {
            std::string message = err ? err : "Failed to init schema";
            sqlite3_free(err);
            throw std::runtime_error(message);
        }
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
        note.title = reinterpret_cast<const char *>(sqlite3_column_text(stmt, 1));
        note.content = reinterpret_cast<const char *>(sqlite3_column_text(stmt, 2));
        note.tags = reinterpret_cast<const char *>(sqlite3_column_text(stmt, 3));
        note.createdAt = reinterpret_cast<const char *>(sqlite3_column_text(stmt, 4));
        note.nextReviewAt = reinterpret_cast<const char *>(sqlite3_column_text(stmt, 5));
        note.reviewStage = sqlite3_column_int(stmt, 6);
        note.pdfPath = reinterpret_cast<const char *>(sqlite3_column_text(stmt, 7));
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
                note.title = (*json)["title"].asString();
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
            if (request->method() == drogon::Put) {
                auto json = request->getJsonObject();
                if (!json) {
                    Value error;
                    error["error"] = "Missing body";
                    callback(jsonResponse(error, HttpStatusCode::k400BadRequest));
                    return;
                }
                auto existing = db.getNoteById(id);
                if (!existing) {
                    Value error;
                    error["error"] = "Not found";
                    callback(jsonResponse(error, HttpStatusCode::k404NotFound));
                    return;
                }
                Note note = *existing;
                if (json->isMember("title")) {
                    note.title = (*json)["title"].asString();
                }
                if (json->isMember("content")) {
                    note.content = (*json)["content"].asString();
                }
                if (json->isMember("tags")) {
                    note.tags = (*json)["tags"].asString();
                }
                if (json->isMember("pdfPath")) {
                    note.pdfPath = (*json)["pdfPath"].asString();
                }
                auto updated = db.updateNote(id, note);
                if (!updated) {
                    Value error;
                    error["error"] = "Failed to update";
                    callback(jsonResponse(error, HttpStatusCode::k500InternalServerError));
                    return;
                }
                callback(jsonResponse(noteToJson(*updated)));
                return;
            }
            if (request->method() == drogon::Delete) {
                if (!db.deleteNote(id)) {
                    Value error;
                    error["error"] = "Failed to delete";
                    callback(jsonResponse(error, HttpStatusCode::k500InternalServerError));
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
        {drogon::Put, drogon::Delete});

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
            auto now = nowIso8601();
            Value payload;
            payload["notes"] = Value(Json::arrayValue);
            for (const auto &note : db.listReviewsDue(now)) {
                payload["notes"].append(noteToJson(note));
            }
            callback(jsonResponse(payload));
        },
        {drogon::Get});

    drogon::app().registerHandler(
        "/api/upload", [&uploadDir](const drogon::HttpRequestPtr &request, std::function<void(const HttpResponsePtr &)> &&callback) {
            if (request->method() != drogon::Post) {
                auto resp = HttpResponse::newHttpResponse();
                resp->setStatusCode(HttpStatusCode::k405MethodNotAllowed);
                callback(resp);
                return;
            }
            const auto &files = request->getUploadedFiles();
            if (files.empty()) {
                Value error;
                error["error"] = "No file uploaded";
                callback(jsonResponse(error, HttpStatusCode::k400BadRequest));
                return;
            }
            const auto &file = files.front();
            std::string filename = file.getFileName();
            std::string destPath = fs::path(uploadDir) / filename;
            file.saveAs(destPath);
            Value payload;
            payload["path"] = "/uploads/" + filename;
            callback(jsonResponse(payload, HttpStatusCode::k201Created));
        },
        {drogon::Post});

    drogon::app().registerHandler(
        "/uploads/{1}", [&uploadDir](const drogon::HttpRequestPtr &request, std::function<void(const HttpResponsePtr &)> &&callback, const std::string &filename) {
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
