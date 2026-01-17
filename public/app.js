const noteForm = document.getElementById("note-form");
const noteList = document.getElementById("note-list");
const reviewList = document.getElementById("review-list");
const refreshNotesBtn = document.getElementById("refresh-notes");
const refreshReviewsBtn = document.getElementById("refresh-reviews");
const pdfCanvas = document.getElementById("pdf-canvas");
const pdfEmpty = document.getElementById("pdf-empty");

let pdfDoc = null;

async function requestJson(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || "Request failed");
  }
  return response.json();
}

async function uploadPdf(file) {
  if (!file) {
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
        ${note.pdfPath ? `<button data-preview="${note.pdfPath}">预览 PDF</button>` : ""}
        <button data-review="${note.id}">完成复习</button>
        <button data-delete="${note.id}">删除</button>
      </div>
    </div>
  `;
}

async function loadNotes() {
  const data = await requestJson("/api/notes");
  noteList.innerHTML = data.notes.map(noteTemplate).join("");
}

async function loadReviews() {
  const data = await requestJson("/api/reviews");
  reviewList.innerHTML = data.notes.map(noteTemplate).join("");
}

async function handleFormSubmit(event) {
  event.preventDefault();
  const formData = new FormData(noteForm);
  const pdfFile = formData.get("pdf");
  const pdfPath = await uploadPdf(pdfFile);

  const payload = {
    title: formData.get("title"),
    tags: formData.get("tags") || "",
    content: formData.get("content") || "",
    pdfPath,
  };

  await requestJson("/api/notes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  noteForm.reset();
  await loadNotes();
  await loadReviews();
}

async function handleListClick(event) {
  const previewPath = event.target.dataset.preview;
  const reviewId = event.target.dataset.review;
  const deleteId = event.target.dataset.delete;

  if (previewPath) {
    await renderPdf(previewPath);
  }

  if (reviewId) {
    await requestJson(`/api/notes/${reviewId}/review`, {
      method: "POST",
    });
    await loadNotes();
    await loadReviews();
  }

  if (deleteId) {
    await requestJson(`/api/notes/${deleteId}`, {
      method: "DELETE",
    });
    await loadNotes();
    await loadReviews();
  }
}

async function renderPdf(path) {
  pdfEmpty.style.display = "none";
  const loadingTask = window["pdfjsLib"].getDocument(path);
  pdfDoc = await loadingTask.promise;
  const page = await pdfDoc.getPage(1);
  const viewport = page.getViewport({ scale: 1.2 });
  const context = pdfCanvas.getContext("2d");
  pdfCanvas.height = viewport.height;
  pdfCanvas.width = viewport.width;
  await page.render({ canvasContext: context, viewport }).promise;
}

noteForm.addEventListener("submit", handleFormSubmit);
noteList.addEventListener("click", handleListClick);
reviewList.addEventListener("click", handleListClick);
refreshNotesBtn.addEventListener("click", loadNotes);
refreshReviewsBtn.addEventListener("click", loadReviews);

loadNotes();
loadReviews();
