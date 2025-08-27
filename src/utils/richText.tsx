"use client";
import * as React from "react";

// NOTE: we intentionally do NOT escape the single quote (')
// to avoid double-encoding like &#39; appearing in UI for developer-controlled text.
function escapeHtml(s: string) {
  return s.replace(/[&<>"]/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
  }[m]!));
}

// Apply markup only to plain (non-HTML) text
function formatPlainText(t: string) {
  // **bold**, *italic*
  t = t
    .replace(/\*\*([^*]+)\*\*/g, (_m, b) => `<strong class="font-semibold text-white">${b}</strong>`)
    .replace(/\*([^*]+)\*/g,   (_m, i) => `<em class="italic text-white/90">${i}</em>`);

  // auto-emphasize numbers, $, and % tokens
  t = t.replace(
    /(\$-?\d{1,3}(?:,\d{3})*(?:\.\d+)?|-?\d+(?:\.\d+)?%?)/g,
    (_m, num) => `<span class="text-amber-300 font-semibold">${num}</span>`
  );

  return t;
}

export function RichText({ text }: { text: string }) {
  // 1) Escape everything (except single quotes)
  let safe = escapeHtml(text);

  // 2) Convert inline code FIRST (protect its internals from further regex)
  safe = safe.replace(/`([^`]+)`/g, (_m, code) =>
    `<code class="px-1 rounded bg-white/10 border border-white/10 text-white/90">${code}</code>`
  );

  // 3) Split by code tags so we don't style inside <code>...</code>
  const segments = safe.split(/(<code[^>]*>.*?<\/code>)/g);

  // 4) Format only non-code segments
  const processed = segments
    .map(seg => seg.startsWith("<code") ? seg : formatPlainText(seg))
    .join("");

  // 5) Render as HTML
  // eslint-disable-next-line react/no-danger
  return <span dangerouslySetInnerHTML={{ __html: processed }} />;
}
