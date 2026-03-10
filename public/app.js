const pageButtons = Array.from(document.querySelectorAll(".nav-item"));
const pages = Array.from(document.querySelectorAll(".page"));

const noteForm = document.getElementById("note-form");
const interviewForm = document.getElementById("interview-form");
const timelineForm = document.getElementById("timeline-form");
const dayPlanForm = document.getElementById("day-plan-form");

const noteContentInput = document.getElementById("note-content-input");
const liveMdPreview = document.getElementById("live-md-preview");

const noteList = document.getElementById("note-list");
const reviewList = document.getElementById("review-list");
const interviewList = document.getElementById("interview-list");
const calendar = document.getElementById("calendar");
const dayPlanList = document.getElementById("day-plan-list");
const selectedDateTitle = document.getElementById("selected-date-title");
const dayEventDateInput = document.getElementById("day-event-date");
const uploadList = document.getElementById("upload-list");

const refreshNotesBtn = document.getElementById("refresh-notes");
const refreshReviewsBtn = document.getElementById("refresh-reviews");
const refreshInterviewsBtn = document.getElementById("refresh-interviews");
const refreshTimelineBtn = document.getElementById("refresh-timeline");
const refreshUploadsBtn = document.getElementById("refresh-uploads");

const pdfCanvas = document.getElementById("pdf-canvas");
const pdfContainer = document.getElementById("pdf-container");
const mdPreview = document.getElementById("md-preview");
const previewEmpty = document.getElementById("preview-empty");

let timelineEvents = [];
let selectedDate = new Date().toISOString().slice(0, 10);

function getFileExt(path = "") {
  const i = path.lastIndexOf(".");
  return i >= 0 ? path.slice(i).toLowerCase() : "";
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || "Request failed");
  }
  return response.json().catch(() => ({}));
}

function switchPage(pageId) {
  pageButtons.forEach((btn) => btn.classList.toggle("active", btn.dataset.page === pageId));
  pages.forEach((page) => page.classList.toggle("active", page.id === pageId));
}

function setupTopNav() {
  pageButtons.forEach((btn) => {
    btn.addEventListener("click", () => switchPage(btn.dataset.page));
  });
}

function renderLiveMarkdown() {
  const value = noteContentInput.value || "";
  if (!value.trim()) {
    liveMdPreview.innerHTML = '<span class="muted">在上方输入 Markdown，这里会实时渲染。</span>';
    return;
  }
  if (window.marked?.parse) {
    liveMdPreview.innerHTML = window.marked.parse(value);
    return;
  }
  liveMdPreview.textContent = value;
}

async function uploadAttachment(file) {
  if (!(file instanceof File) || file.size === 0) return "";
  const ext = getFileExt(file.name || "");
  if (![".pdf", ".md"].includes(ext)) throw new Error("仅支持上传 .pdf 或 .md 文件");
  const formData = new FormData();
  formData.append("attachment", file);
  const data = await requestJson("/api/upload", { method: "POST", body: formData });
  return data.path || "";
}

function renderTags(tags) {
  if (!tags) return "";
  return tags.split(",").map((x) => x.trim()).filter(Boolean).map((x) => `<span class="tag">${x}</span>`).join(" ");
}

function noteTemplate(note) {
  return `<div class="list-item">
    <strong>${note.title}</strong>
    <div class="muted">${note.createdAt} · 下次复习: ${note.nextReviewAt}</div>
    <div>${note.content || ""}</div>
    <div>${renderTags(note.tags)}</div>
    <div class="list-actions">
      ${note.pdfPath ? `<button data-preview="${note.pdfPath}">预览附件</button>` : ""}
      <button data-review="${note.id}">完成复习</button>
      <button data-delete="${note.id}">删除</button>
    </div>
  </div>`;
}

function interviewTemplate(item) {
  return `<div class="list-item">
    <strong>${item.company} - ${item.role}</strong>
    <div class="muted">面试日期: ${item.interviewDate}</div>
    <div>${item.summary || ""}</div>
    <div class="list-actions"><button data-delete-interview="${item.id}">删除</button></div>
  </div>`;
}

function dayEventTemplate(event) {
  return `<div class="list-item">
    <strong>${event.title}</strong>
    <div>${event.detail || ""}</div>
    <div class="muted">创建时间: ${event.createdAt}</div>
    <div class="list-actions">
      <button data-edit-day-event="${event.id}">编辑</button>
      <button data-delete-day-event="${event.id}">删除</button>
    </div>
  </div>`;
}

function uploadTemplate(file) {
  return `<div class="list-item">
    <strong>${file.name}</strong>
    <div class="muted">大小: ${file.size} bytes · 修改: ${file.lastModified}</div>
    <div class="list-actions">
      <button data-preview="${file.path}">预览</button>
      <button data-delete-upload="${file.name}">删除</button>
    </div>
  </div>`;
}

function renderCalendar(events) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);
  const days = end.getDate();

  const monthPrefix = `${year}-${String(month + 1).padStart(2, "0")}`;
  const dayCount = new Map();
  events.filter((e) => e.eventDate.startsWith(monthPrefix)).forEach((e) => {
    dayCount.set(e.eventDate, (dayCount.get(e.eventDate) || 0) + 1);
  });

  const cells = [];
  for (let i = 0; i < start.getDay(); i += 1) cells.push('<div class="calendar-cell"></div>');

  for (let day = 1; day <= days; day += 1) {
    const date = `${monthPrefix}-${String(day).padStart(2, "0")}`;
    const count = dayCount.get(date) || 0;
    const activeClass = selectedDate === date ? "active" : "";
    cells.push(`<button class="calendar-cell ${count ? "has-event" : ""} ${activeClass}" data-date="${date}">
      <span>${day}</span>
      <span class="calendar-count">${count ? `${count}项` : ""}</span>
    </button>`);
  }
  calendar.innerHTML = cells.join("");
}

function renderDayPlans() {
  selectedDateTitle.textContent = `${selectedDate} 当日安排`;
  dayEventDateInput.value = selectedDate;
  const rows = timelineEvents.filter((e) => e.eventDate === selectedDate);
  dayPlanList.innerHTML = rows.length ? rows.map(dayEventTemplate).join("") : '<p class="muted">该日期暂无安排。</p>';
}

async function loadNotes() {
  const data = await requestJson("/api/notes");
  noteList.innerHTML = data.notes.map(noteTemplate).join("");
}

async function loadReviews() {
  const data = await requestJson("/api/reviews");
  reviewList.innerHTML = data.notes.map(noteTemplate).join("");
}

async function loadInterviews() {
  const data = await requestJson("/api/interviews");
  interviewList.innerHTML = data.records.map(interviewTemplate).join("");
}

async function loadTimeline() {
  const data = await requestJson("/api/timeline");
  timelineEvents = data.events || [];
  renderCalendar(timelineEvents);
  renderDayPlans();
}

async function loadUploads() {
  const data = await requestJson("/api/uploads");
  uploadList.innerHTML = (data.files || []).map(uploadTemplate).join("") || '<p class="muted">暂无附件。</p>';
}

async function renderAttachment(path) {
  previewEmpty.style.display = "none";
  const ext = getFileExt(path);
  if (ext === ".md") {
    const response = await fetch(path);
    if (!response.ok) throw new Error("Markdown 文件加载失败");
    mdPreview.style.display = "block";
    pdfContainer.style.display = "none";
    mdPreview.textContent = await response.text();
    return;
  }

  mdPreview.style.display = "none";
  pdfContainer.style.display = "block";
  const loadingTask = window.pdfjsLib.getDocument(path);
  const pdfDoc = await loadingTask.promise;
  const page = await pdfDoc.getPage(1);
  const viewport = page.getViewport({ scale: 1.2 });
  const context = pdfCanvas.getContext("2d");
  pdfCanvas.height = viewport.height;
  pdfCanvas.width = viewport.width;
  await page.render({ canvasContext: context, viewport }).promise;
}

async function handleNoteSubmit(event) {
  event.preventDefault();
  try {
    const formData = new FormData(noteForm);
    const pdfPath = await uploadAttachment(formData.get("attachment"));
    await requestJson("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: (formData.get("title") || "").trim(),
        tags: formData.get("tags") || "",
        content: formData.get("content") || "",
        pdfPath,
      }),
    });
    noteForm.reset();
    renderLiveMarkdown();
    await Promise.all([loadNotes(), loadReviews(), loadUploads()]);
  } catch (error) {
    alert(`保存笔记失败：${error.message}`);
  }
}

async function handleInterviewSubmit(event) {
  event.preventDefault();
  try {
    const formData = new FormData(interviewForm);
    await requestJson("/api/interviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company: formData.get("company") || "",
        role: formData.get("role") || "",
        interviewDate: formData.get("interviewDate") || "",
        summary: formData.get("summary") || "",
      }),
    });
    interviewForm.reset();
    await loadInterviews();
  } catch (error) {
    alert(`保存面试记录失败：${error.message}`);
  }
}

async function handleTimelineSubmit(event) {
  event.preventDefault();
  try {
    const formData = new FormData(timelineForm);
    await requestJson("/api/timeline", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventDate: formData.get("eventDate") || "",
        title: formData.get("title") || "",
        detail: formData.get("detail") || "",
      }),
    });
    timelineForm.reset();
    await loadTimeline();
  } catch (error) {
    alert(`保存日程失败：${error.message}`);
  }
}

async function handleDayPlanSubmit(event) {
  event.preventDefault();
  try {
    const formData = new FormData(dayPlanForm);
    await requestJson("/api/timeline", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventDate: formData.get("eventDate") || selectedDate,
        title: formData.get("title") || "",
        detail: formData.get("detail") || "",
      }),
    });
    dayPlanForm.reset();
    dayEventDateInput.value = selectedDate;
    await loadTimeline();
  } catch (error) {
    alert(`新增当日日程失败：${error.message}`);
  }
}

async function handleNotesOrReviewsClick(event) {
  const previewPath = event.target.dataset.preview;
  const reviewId = event.target.dataset.review;
  const deleteId = event.target.dataset.delete;
  try {
    if (previewPath) {
      switchPage("page-uploads");
      await renderAttachment(previewPath);
    }
    if (reviewId) {
      await requestJson(`/api/notes/${reviewId}/review`, { method: "POST" });
      await Promise.all([loadNotes(), loadReviews()]);
    }
    if (deleteId) {
      await requestJson(`/api/notes/${deleteId}`, { method: "DELETE" });
      await Promise.all([loadNotes(), loadReviews()]);
    }
  } catch (error) {
    alert(`操作失败：${error.message}`);
  }
}

async function handleInterviewListClick(event) {
  const id = event.target.dataset.deleteInterview;
  if (!id) return;
  try {
    await requestJson(`/api/interviews/${id}`, { method: "DELETE" });
    await loadInterviews();
  } catch (error) {
    alert(`删除面试记录失败：${error.message}`);
  }
}

async function handleDayPlanListClick(event) {
  const deleteId = event.target.dataset.deleteDayEvent;
  const editId = event.target.dataset.editDayEvent;
  try {
    if (deleteId) {
      await requestJson(`/api/timeline/${deleteId}`, { method: "DELETE" });
      await loadTimeline();
      return;
    }
    if (editId) {
      const current = timelineEvents.find((item) => String(item.id) === String(editId));
      if (!current) return;
      const nextTitle = prompt("修改标题", current.title);
      if (nextTitle === null) return;
      const nextDetail = prompt("修改详情", current.detail || "") ?? "";
      await requestJson(`/api/timeline/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventDate: current.eventDate,
          title: nextTitle,
          detail: nextDetail,
        }),
      });
      await loadTimeline();
    }
  } catch (error) {
    alert(`日程操作失败：${error.message}`);
  }
}

async function handleUploadListClick(event) {
  const previewPath = event.target.dataset.preview;
  const deleteUpload = event.target.dataset.deleteUpload;
  try {
    if (previewPath) await renderAttachment(previewPath);
    if (deleteUpload) {
      await requestJson(`/api/uploads/${encodeURIComponent(deleteUpload)}`, { method: "DELETE" });
      previewEmpty.style.display = "block";
      mdPreview.style.display = "none";
      pdfContainer.style.display = "none";
      await loadUploads();
    }
  } catch (error) {
    alert(`附件操作失败：${error.message}`);
  }
}

function handleCalendarClick(event) {
  const date = event.target.closest("[data-date]")?.dataset.date;
  if (!date) return;
  selectedDate = date;
  renderCalendar(timelineEvents);
  renderDayPlans();
}

setupTopNav();
renderLiveMarkdown();

noteForm.addEventListener("submit", handleNoteSubmit);
interviewForm.addEventListener("submit", handleInterviewSubmit);
timelineForm.addEventListener("submit", handleTimelineSubmit);
dayPlanForm.addEventListener("submit", handleDayPlanSubmit);
noteContentInput.addEventListener("input", renderLiveMarkdown);

noteList.addEventListener("click", handleNotesOrReviewsClick);
reviewList.addEventListener("click", handleNotesOrReviewsClick);
interviewList.addEventListener("click", handleInterviewListClick);
calendar.addEventListener("click", handleCalendarClick);
dayPlanList.addEventListener("click", handleDayPlanListClick);
uploadList.addEventListener("click", handleUploadListClick);

refreshNotesBtn.addEventListener("click", loadNotes);
refreshReviewsBtn.addEventListener("click", loadReviews);
refreshInterviewsBtn.addEventListener("click", loadInterviews);
refreshTimelineBtn.addEventListener("click", loadTimeline);
refreshUploadsBtn.addEventListener("click", loadUploads);

Promise.all([loadNotes(), loadReviews(), loadInterviews(), loadTimeline(), loadUploads()]).catch((error) => {
  alert(`初始化失败：${error.message}`);
});
