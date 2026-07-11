"use client";

// ============================================================
// PDF Study Guide Generator
// Builds a printable HTML document from a course's lessons,
// key terms, and review questions, then opens a new window and
// triggers the browser's print dialog (user can "Save as PDF").
// ============================================================

import { getAllCoursesFromStore, slugify } from "./course-store";
import type { ContentBlock, CourseData, Lesson } from "./types";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderBlockToHtml(block: ContentBlock): string {
  switch (block.type) {
    case "heading": {
      const lvl = block.level || 3;
      return `<h${lvl}>${escapeHtml(block.text)}</h${lvl}>`;
    }
    case "paragraph":
      return `<p>${escapeHtml(block.text)}</p>`;
    case "callout":
      return `<div class="callout callout-${block.variant}"><strong>${escapeHtml(block.title || "")}</strong><p>${escapeHtml(block.text)}</p></div>`;
    case "list":
      if (block.ordered) {
        return `<ol>${block.items.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</ol>`;
      }
      return `<ul>${block.items.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</ul>`;
    case "table": {
      const head = `<tr>${block.headers.map((h) => `<th>${escapeHtml(h)}</th>`).join("")}</tr>`;
      const body = block.rows
        .map((r) => `<tr>${r.map((c) => `<td>${escapeHtml(c)}</td>`).join("")}</tr>`)
        .join("");
      return `<table>${head}${body}</table>`;
    }
    case "definition":
      return `<div class="definition"><strong>${escapeHtml(block.term)}</strong>: ${escapeHtml(block.definition)}</div>`;
    case "image":
      return `<figure><img src="${escapeHtml(block.src)}" alt="${escapeHtml(block.alt || block.caption || "")}" />${block.caption ? `<figcaption>${escapeHtml(block.caption)}</figcaption>` : ""}</figure>`;
    case "video":
      return `<p class="muted">[Video: ${escapeHtml(block.src)}${block.caption ? ` — ${escapeHtml(block.caption)}` : ""}]</p>`;
    case "keyTerms":
      return `<div class="key-terms"><h4>Key Terms</h4><dl>${block.terms
        .map((t) => `<dt>${escapeHtml(t.term)}</dt><dd>${escapeHtml(t.definition)}</dd>`)
        .join("")}</dl></div>`;
    case "svg":
      return `<figure><img src="${escapeHtml(block.src)}" alt="${escapeHtml(block.caption || "Diagram")}" />${block.caption ? `<figcaption>${escapeHtml(block.caption)}</figcaption>` : ""}</figure>`;
    case "knowledgeCheck":
      return `<div class="knowledge-check"><strong>Check:</strong> ${escapeHtml(block.question)}<ol>${block.options
        .map((o, i) => `<li>${escapeHtml(o)}${i === block.correctAnswer ? " ✓" : ""}</li>`)
        .join("")}</ol><p class="muted">${escapeHtml(block.explanation)}</p></div>`;
    case "clickToReveal":
      return `<div class="callout callout-info"><strong>${escapeHtml(block.title)}</strong><p>${escapeHtml(block.content)}</p></div>`;
    case "matching":
      return `<div class="callout callout-info"><strong>${escapeHtml(block.title)}</strong><p>Left: ${block.left.join(", ")}</p><p>Right: ${block.right.join(", ")}</p></div>`;
    case "sequence":
      return `<div class="callout callout-info"><strong>${escapeHtml(block.title)}</strong><ol>${block.steps
        .map((s) => `<li>${escapeHtml(s)}</li>`)
        .join("")}</ol></div>`;
    default:
      return "";
  }
}

function renderLesson(lesson: Lesson, idx: number): string {
  const body = lesson.content.map(renderBlockToHtml).join("\n");
  const keyTerms = lesson.keyTerms && lesson.keyTerms.length > 0
    ? `<div class="key-terms"><h4>Key Terms</h4><dl>${lesson.keyTerms
        .map((t) => `<dt>${escapeHtml(t.term)}</dt><dd>${escapeHtml(t.definition)}</dd>`)
        .join("")}</dl></div>`
    : "";
  const summary = lesson.summary && lesson.summary.length > 0
    ? `<div class="summary"><h4>Summary</h4><ul>${lesson.summary.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}</ul></div>`
    : "";
  const review = lesson.reviewQuestions && lesson.reviewQuestions.length > 0
    ? `<div class="review"><h4>Review Questions</h4><ol>${lesson.reviewQuestions.map((q) => `<li>${escapeHtml(q)}</li>`).join("")}</ol></div>`
    : "";
  const objectives = lesson.objectives && lesson.objectives.length > 0
    ? `<div class="objectives"><strong>Learning Objectives</strong><ul>${lesson.objectives.map((o) => `<li>${escapeHtml(o)}</li>`).join("")}</ul></div>`
    : "";
  return `
    <section class="lesson">
      <h2 class="lesson-title">${idx}. ${escapeHtml(lesson.title)}</h2>
      <div class="lesson-meta">Code: ${escapeHtml(lesson.code)} • ${lesson.duration} minutes</div>
      ${objectives}
      <div class="content">${body}</div>
      ${keyTerms}
      ${summary}
      ${review}
    </section>
  `;
}

export function generateStudyGuide(courseId: string): void {
  if (typeof window === "undefined") return;
  const courses = getAllCoursesFromStore();
  const course = courses.find((c) => slugify(c.title) === courseId) || courses[0];
  if (!course) return;
  openStudyGuideWindow(course);
}

function openStudyGuideWindow(course: CourseData): void {
  const toc = course.modules
    .map((m, mi) => {
      const items = m.lessons
        .map((l, li) => `<li>${mi + 1}.${li + 1} ${escapeHtml(l.title)} <span class="muted">(${l.duration} min)</span></li>`)
        .join("");
      return `<li class="toc-module"><strong>Module ${mi + 1}: ${escapeHtml(m.title)}</strong><ol>${items}</ol></li>`;
    })
    .join("");

  const lessonsHtml = course.modules
    .map((m, mi) => {
      const header = `<h1 class="module-title">Module ${mi + 1}: ${escapeHtml(m.title)}</h1><p class="module-desc">${escapeHtml(m.description)}</p>`;
      const lessons = m.lessons.map((l, li) => renderLesson(l, mi + 1 + (li + 1) / 10)).join("\n");
      return header + lessons;
    })
    .join("\n");

  const totalLessons = course.modules.reduce((a, m) => a + m.lessons.length, 0);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${escapeHtml(course.title)} — Study Guide</title>
<style>
  @page { size: A4; margin: 18mm; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1f2937; line-height: 1.55; font-size: 11pt; }
  h1 { font-size: 22pt; color: #0f172a; border-bottom: 3px solid #0ea5e9; padding-bottom: 8px; margin-top: 0; }
  h2 { font-size: 16pt; color: #0c4a6e; margin-top: 24px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; page-break-after: avoid; }
  h3, h4 { font-size: 13pt; color: #075985; margin-top: 18px; page-break-after: avoid; }
  h4 { font-size: 11.5pt; color: #0369a1; }
  p { margin: 8px 0; }
  ul, ol { margin: 6px 0 6px 22px; }
  li { margin: 3px 0; }
  table { border-collapse: collapse; width: 100%; margin: 12px 0; font-size: 10pt; }
  th, td { border: 1px solid #cbd5e1; padding: 6px 8px; text-align: left; }
  th { background: #f1f5f9; font-weight: 600; }
  .cover { text-align: center; padding: 60px 20px; page-break-after: always; }
  .cover .badge { display: inline-block; padding: 6px 14px; border: 1px solid #0ea5e9; color: #0ea5e9; border-radius: 999px; font-size: 10pt; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 18px; }
  .cover h1 { font-size: 28pt; border: none; padding: 0; }
  .cover .subtitle { font-size: 14pt; color: #475569; margin-top: 8px; }
  .cover .meta { margin-top: 36px; color: #64748b; font-size: 11pt; }
  .toc { page-break-after: always; }
  .toc h2 { border-bottom: 2px solid #0ea5e9; }
  .toc ol { list-style: none; margin-left: 0; }
  .toc-module { margin: 10px 0; }
  .toc-module ol { margin-left: 22px; }
  .muted { color: #64748b; font-size: 9.5pt; }
  .module-title { font-size: 18pt; color: #0c4a6e; margin-top: 28px; page-break-before: always; page-break-after: avoid; }
  .module-desc { color: #475569; font-style: italic; margin-bottom: 16px; }
  .lesson { page-break-inside: avoid; margin-bottom: 18px; padding-bottom: 12px; border-bottom: 1px dashed #e2e8f0; }
  .lesson-title { font-size: 14pt; color: #0f172a; margin-top: 18px; }
  .lesson-meta { color: #64748b; font-size: 9.5pt; margin-bottom: 8px; }
  .objectives { background: #f0f9ff; padding: 8px 12px; border-left: 3px solid #0ea5e9; margin: 8px 0; }
  .summary { background: #f0fdf4; padding: 8px 12px; border-left: 3px solid #16a34a; margin: 8px 0; }
  .review { background: #fefce8; padding: 8px 12px; border-left: 3px solid #eab308; margin: 8px 0; }
  .key-terms { background: #faf5ff; padding: 8px 12px; border-left: 3px solid #9333ea; margin: 8px 0; }
  .key-terms dl { margin: 4px 0; }
  .key-terms dt { font-weight: 600; color: #7e22ce; }
  .key-terms dd { margin-left: 16px; margin-bottom: 4px; }
  .callout { padding: 8px 12px; margin: 10px 0; border-left: 3px solid #94a3b8; background: #f8fafc; }
  .callout-warning { border-left-color: #f59e0b; background: #fffbeb; }
  .callout-danger { border-left-color: #ef4444; background: #fef2f2; }
  .callout-tip { border-left-color: #10b981; background: #ecfdf5; }
  .callout-info { border-left-color: #0ea5e9; background: #f0f9ff; }
  .definition { margin: 8px 0; padding: 6px 12px; background: #f8fafc; border-left: 3px solid #64748b; }
  .knowledge-check { background: #fff7ed; padding: 8px 12px; border-left: 3px solid #ea580c; margin: 8px 0; }
  figure { margin: 12px 0; text-align: center; page-break-inside: avoid; }
  img { max-width: 100%; height: auto; border: 1px solid #e2e8f0; border-radius: 4px; }
  figcaption { font-size: 9pt; color: #64748b; margin-top: 4px; font-style: italic; }
  .footer { margin-top: 32px; padding-top: 12px; border-top: 1px solid #e2e8f0; text-align: center; color: #94a3b8; font-size: 9pt; }
  @media print {
    .no-print { display: none; }
  }
</style>
</head>
<body>
  <div class="cover">
    <div class="badge">Study Guide</div>
    <h1>${escapeHtml(course.title)}</h1>
    <div class="subtitle">${escapeHtml(course.subtitle)}</div>
    <div class="meta">
      ${escapeHtml(course.edition)} • Difficulty: ${escapeHtml(course.difficulty)}<br/>
      ${course.modules.length} modules • ${totalLessons} lessons • ${Math.floor(course.duration / 60)}h ${course.duration % 60}m<br/>
      Instructor: ${escapeHtml(course.instructor)}
    </div>
    <p class="muted" style="margin-top:40px;">Generated ${new Date().toLocaleDateString()} • DGR Aviation Academy</p>
  </div>

  <div class="toc">
    <h2>Table of Contents</h2>
    <ol>
      ${toc}
    </ol>
  </div>

  <h1>${escapeHtml(course.title)}</h1>
  <p>${escapeHtml(course.description)}</p>

  ${course.objectives && course.objectives.length > 0 ? `
    <div class="objectives">
      <strong>Course Objectives</strong>
      <ul>${course.objectives.map((o) => `<li>${escapeHtml(o)}</li>`).join("")}</ul>
    </div>
  ` : ""}

  ${lessonsHtml}

  ${course.glossary && course.glossary.length > 0 ? `
    <section class="key-terms" style="page-break-before: always;">
      <h2>Glossary</h2>
      <dl>
        ${course.glossary.map((g) => `<dt>${escapeHtml(g.term)}</dt><dd>${escapeHtml(g.definition)}</dd>`).join("")}
      </dl>
    </section>
  ` : ""}

  <div class="footer">
    ${escapeHtml(course.title)} — Study Guide • Generated by DGR Aviation Academy eLearning Platform
  </div>

  <script>
    window.onload = function() { setTimeout(function() { window.print(); }, 500); };
  </script>
</body>
</html>`;

  const w = window.open("", "_blank", "width=900,height=700");
  if (!w) {
    alert("Please allow pop-ups to generate the study guide.");
    return;
  }
  w.document.open();
  w.document.write(html);
  w.document.close();
}
