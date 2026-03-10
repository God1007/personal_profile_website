const noteForm = document.getElementById("note-form");
const interviewForm = document.getElementById("interview-form");
const timelineForm = document.getElementById("timeline-form");
const noteContentInput = document.getElementById("note-content-input");
const liveMdPreview = document.getElementById("live-md-preview");

const noteList = document.getElementById("note-list");
const reviewList = document.getElementById("review-list");
const interviewList = document.getElementById("interview-list");
const timelineList = document.getElementById("timeline-list");
const calendar = document.getElementById("calendar");

const refreshNotesBtn = document.getElementById("refresh-notes");
const refreshReviewsBtn = document.getElementById("refresh-reviews");
const refreshInterviewsBtn = document.getElementById("refresh-interviews");
const refreshTimelineBtn = document.getElementById("refresh-timeline");

const pdfCanvas = document.getElementById("pdf-canvas");
const pdfContainer = document.getElementById("pdf-container");
const mdPreview = document.getElementById("md-preview");
const previewEmpty = document.getElementById("preview-empty");


function renderLiveMarkdown() {
  const value = noteContentInput.value || "";
  if (!value.trim()) {
    liveMdPreview.innerHTML = '<span class="muted">在上方输入 Markdown，这里会实时渲染。</span>';
    return;
  }

  if (window.marked && typeof window.marked.parse === "function") {
    liveMdPreview.innerHTML = window.marked.parse(value);
    return;
  }

  liveMdPreview.textContent = value;
}

function getFileExt(path = "") {
  const lastDot = path.lastIndexOf(".");
  if (lastDot < 0) return "";
  return path.slice(lastDot).toLowerCase();
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || "Request failed");
  }
  return response.json().catch(() => ({}));
}

async function uploadAttachment(file) {
  if (!(file instanceof File) || file.size === 0) {
    return "";
  }
  const formData = new FormData();
  formData.append("file", file);
  const response = await requestJson("/api/upload", {
    method: "POST",
    body: formData,
  });
  return response.path || "";
}

function renderTags(tags) {
  if (!tags) return "";
  return tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .map((tag) => `<span class="tag">${tag}</span>`)
    .join(" ");
}

function noteTemplate(note) {
  return `
    <div class="list-item">
      <strong>${note.title}</strong>
      <div class="muted">${note.createdAt} · 下次复习: ${note.nextReviewAt}</div>
      <div>${note.content || ""}</div>
      <div>${renderTags(note.tags)}</div>
      <div class="list-actions">
        ${note.pdfPath ? `<button data-preview="${note.pdfPath}">预览附件</button>` : ""}
        <button data-review="${note.id}">完成复习</button>
        <button data-delete="${note.id}">删除</button>
      </div>
    </div>
  `;
}

function interviewTemplate(item) {
  return `
    <div class="list-item">
      <strong>${item.company} - ${item.role}</strong>
      <div class="muted">面试日期: ${item.interviewDate}</div>
      <div>${item.summary || ""}</div>
      <div class="list-actions"><button data-delete-interview="${item.id}">删除</button></div>
    </div>
  `;
}

function timelineTemplate(event) {
  return `
    <div class="list-item">
      <strong>${event.eventDate} · ${event.title}</strong>
      <div>${event.detail || ""}</div>
      <div class="list-actions"><button data-delete-timeline="${event.id}">删除</button></div>
    </div>
  `;
}

function renderCalendar(events) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const monthStart = new Date(year, month, 1);
  const monthEnd = new Date(year, month + 1, 0);
  const days = monthEnd.getDate();

  const eventDays = new Set(events.map((e) => e.eventDate).filter((d) => d.startsWith(`${year}-${String(month + 1).padStart(2, "0")}`)));

  const cells = [];
  for (let i = 0; i < monthStart.getDay(); i += 1) {
    cells.push(`<div class="calendar-cell"></div>`);
  }
  for (let day = 1; day <= days; day += 1) {
    const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const hasEvent = eventDays.has(date);
    cells.push(`<div class="calendar-cell ${hasEvent ? "has-event" : ""}">${day}</div>`);
  }
  calendar.innerHTML = cells.join("");
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
  timelineList.innerHTML = data.events.map(timelineTemplate).join("");
  renderCalendar(data.events);
}

async function renderAttachment(path) {
  previewEmpty.style.display = "none";
  const ext = getFileExt(path);

  if (ext === ".md") {
    const response = await fetch(path);
    if (!response.ok) throw new Error("Markdown 文件加载失败");
    const text = await response.text();
    mdPreview.style.display = "block";
    pdfContainer.style.display = "none";
    mdPreview.textContent = text;
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
    const attachment = formData.get("attachment");
    const pdfPath = await uploadAttachment(attachment);

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
    await Promise.all([loadNotes(), loadReviews()]);
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
    alert(`保存时间线失败：${error.message}`);
  }
}

async function handleCommonListClick(event) {
  const previewPath = event.target.dataset.preview;
  const reviewId = event.target.dataset.review;
  const deleteId = event.target.dataset.delete;

  try {
    if (previewPath) await renderAttachment(previewPath);
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

async function handleTimelineListClick(event) {
  const id = event.target.dataset.deleteTimeline;
  if (!id) return;
  try {
    await requestJson(`/api/timeline/${id}`, { method: "DELETE" });
    await loadTimeline();
  } catch (error) {
    alert(`删除时间线失败：${error.message}`);
  }
}

noteForm.addEventListener("submit", handleNoteSubmit);
noteContentInput.addEventListener("input", renderLiveMarkdown);
interviewForm.addEventListener("submit", handleInterviewSubmit);
timelineForm.addEventListener("submit", handleTimelineSubmit);
noteList.addEventListener("click", handleCommonListClick);
reviewList.addEventListener("click", handleCommonListClick);
interviewList.addEventListener("click", handleInterviewListClick);
timelineList.addEventListener("click", handleTimelineListClick);
refreshNotesBtn.addEventListener("click", loadNotes);
refreshReviewsBtn.addEventListener("click", loadReviews);
refreshInterviewsBtn.addEventListener("click", loadInterviews);
refreshTimelineBtn.addEventListener("click", loadTimeline);

renderLiveMarkdown();

Promise.all([loadNotes(), loadReviews(), loadInterviews(), loadTimeline()]).catch((error) => {
  alert(`初始化失败：${error.message}`);
});
