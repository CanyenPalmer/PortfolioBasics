"use client";
import * as React from "react";

/**
 * Renders escaped HTML with:
 * - **bold**, *italic*, and `code`
 * - auto-emphasis for numbers, $, and % tokens
 */
function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (m) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[m]!));
}

export function RichText({ text }: { text: string }) {
  // 1) escape
  let t = escapeHtml(text);

  // 2) inline code first (so internals don't get styled)
  t = t.replace(/`([^`]+)`/g, (_m, code) =>
    `<code class="px-1 rounded bg-white/10 border border-white/10 text-white/90">${code}</code>`
  );

  // 3) bold and italic
  t = t
    .replace(/\*\*([^*]+)\*\*/g, (_m, b) => `<strong class="font-semibold text-white">${b}</strong>`)
    .replace(/\*([^*]+)\*/g,   (_m, i) => `<em class="italic text-white/90">${i}</em>`);

  // 4) auto-emphasize numbers, $, and % tokens
  t = t.replace(
    /(\$-?\d{1,3}(?:,\d{3})*(?:\.\d+)?|-?\d+(?:\.\d+)?%?)/g,
    (_m, num) => `<span class="text-amber-300 font-semibold">${num}</span>`
  );

  // eslint-disable-next-line react/no-danger
  return <span dangerouslySetInnerHTML={{ __html: t }} />;
}
