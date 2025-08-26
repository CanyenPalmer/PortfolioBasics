/**
 * JSON highlighting utils
 * - escapeHtml
 * - highlightJson (batch highlighting for full strings)
 * - buildExperienceJson (controls printed fields)
 * - NEW: tokenizeJson() for real-time, color-while-typing rendering
 */

export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (m) => {
    switch (m) {
      case "&": return "&amp;";
      case "<": return "&lt;";
      case ">": return "&gt;";
      case '"': return "&quot;";
      case "'": return "&#39;";
      default:  return m;
    }
  });
}

export function highlightJson(json: string): string {
  let esc = escapeHtml(json);

  // Keys: "key":
  esc = esc.replace(
    /(^|[\r\n])(\s*)(".*?")(\s*):/g,
    (_, br, ws, key, after) =>
      `${br}${ws}<span class="text-sky-300">${key}</span>${after}:`
  );

  // String values
  esc = esc.replace(
    /(:\s*)(".*?")/g,
    (_, pre, val) => `${pre}<span class="text-emerald-300">${val}</span>`
  );

  // Numbers (incl. scientific)
  esc = esc.replace(
    /(:\s*)(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g,
    (_, pre, num) => `${pre}<span class="text-amber-300">${num}</span>`
  );

  // Booleans & null
  esc = esc.replace(
    /(:\s*)(true|false|null)/g,
    (_, pre, kw) => `${pre}<span class="text-fuchsia-300">${kw}</span>`
  );

  return esc;
}

export function buildExperienceJson(exp: {
  title: string;
  company: string;
  location?: string;
  context?: string;
  dates: string;
  tech?: string[];
  skills?: string[];
  highlights: string[];
  creations?: { name: string; details: string[] }[];
}): string {
  const printable = {
    title: exp.title,
    company: exp.company,
    ...(exp.location ? { location: exp.location } : {}),
    ...(exp.context ? { context: exp.context } : {}),
    dates: exp.dates,
    ...(exp.tech?.length ? { tech: exp.tech } : {}),
    ...(exp.skills?.length ? { skills: exp.skills } : {}),
    highlights: exp.highlights,
    ...(exp.creations?.length ? { creations: exp.creations } : {}),
  };
  return JSON.stringify(printable, null, 2);
}

/* ------------------------------------------------------------------ */
/* NEW: Tokenizer for real-time, color-as-you-type JSON               */
/* ------------------------------------------------------------------ */

export type JsonToken = {
  text: string;        // raw token text (already HTML-escaped)
  className?: string;  // tailwind class for color, if any
};

export function tokenizeJson(json: string): JsonToken[] {
  // We have the full JSON string; we can scan and tag tokens safely.
  // Strategy:
  // - Walk the JSON char by char
  // - Recognize strings, numbers, booleans, null, punctuation and whitespace
  // - Distinguish "key" strings from "value" strings (a string directly followed by : is a key)
  const s = escapeHtml(json);
  const tokens: JsonToken[] = [];

  let i = 0;
  const N = s.length;

  const push = (text: string, className?: string) => {
    if (!text) return;
    tokens.push({ text, className });
  };

  while (i < N) {
    const ch = s[i];

    // Whitespace
    if (/\s/.test(ch)) {
      let j = i + 1;
      while (j < N && /\s/.test(s[j])) j++;
      push(s.slice(i, j));
      i = j;
      continue;
    }

    // Punctuation / braces / commas / colons / brackets
    if (/[{}\[\],:]/.test(ch)) {
      push(ch);
      i++;
      continue;
    }

    // String: starts with double-quote (escaped HTML, so still a ")
    if (ch === '"') {
      let j = i + 1;
      let escaped = false;
      while (j < N) {
        const cj = s[j];
        if (cj === "\\") {
          escaped = !escaped;
          j++;
          continue;
        }
        if (cj === '"' && !escaped) {
          j++;
          break;
        }
        escaped = false;
        j++;
      }
      const strText = s.slice(i, j);

      // Lookahead to see if this string is a key (next non-space chars include optional spaces then :)
      let k = j;
      while (k < N && /\s/.test(s[k])) k++;
      const isKey = s[k] === ":";

      push(strText, isKey ? "text-sky-300" : "text-emerald-300");
      i = j;
      continue;
    }

    // Numbers: -?\d+(\.\d+)?([eE][+-]?\d+)?
    if (/-|\d/.test(ch)) {
      let j = i;
      // Sign
      if (s[j] === "-") j++;
      // Integer
      while (j < N && /\d/.test(s[j])) j++;
      // Fraction
      if (j < N && s[j] === ".") {
        j++;
        while (j < N && /\d/.test(s[j])) j++;
      }
      // Exponent
      if (j < N && (s[j] === "e" || s[j] === "E")) {
        j++;
        if (s[j] === "+" || s[j] === "-") j++;
        while (j < N && /\d/.test(s[j])) j++;
      }
      push(s.slice(i, j), "text-amber-300");
      i = j;
      continue;
    }

    // Booleans / null
    if (s.startsWith("true", i) || s.startsWith("false", i) || s.startsWith("null", i)) {
      if (s.startsWith("true", i)) {
        push("true", "text-fuchsia-300");
        i += 4;
      } else if (s.startsWith("false", i)) {
        push("false", "text-fuchsia-300");
        i += 5;
      } else {
        push("null", "text-fuchsia-300");
        i += 4;
      }
      continue;
    }

    // Fallback: any other char as plain
    push(ch);
    i++;
  }

  return tokens;
}
