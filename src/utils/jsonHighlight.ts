/**
 * JSON highlighting utils
 * - escapeHtml
 * - highlightJson (batch highlighting for full strings via innerHTML)
 * - buildExperienceJson (controls printed fields)
 * - tokenizeJson (for real-time, color-while-typing React rendering)
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

/** Batch highlighter (use only if rendering via dangerouslySetInnerHTML) */
export function highlightJson(json: string): string {
  let esc = escapeHtml(json);

  // Keys: "key":
  esc = esc.replace(
    /(^|[\r\n])(\s*)(".*?")(\s*):/g,
    (_, br, ws, key, after) =>
      `${br}${ws}<span class="text-sky-400">${key}</span>${after}:`
  );

  // String values
  esc = esc.replace(
    /(:\s*)(".*?")/g,
    (_, pre, val) => `${pre}<span class="text-emerald-400">${val}</span>`
  );

  // Numbers (incl. scientific)
  esc = esc.replace(
    /(:\s*)(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g,
    (_, pre, num) => `${pre}<span class="text-amber-400">${num}</span>`
  );

  // Booleans & null
  esc = esc.replace(
    /(:\s*)(true|false|null)/g,
    (_, pre, kw) => `${pre}<span class="text-fuchsia-400">${kw}</span>`
  );

  return esc;
}

/** Controls which fields from an Experience are printed to JSON */
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
/* Real-time, color-as-you-type tokenizer for React element rendering */
/* ------------------------------------------------------------------ */
export type JsonToken = {
  text: string;        // raw, UNESCAPED JSON text (React escapes safely)
  className?: string;  // tailwind class for color, if any
};

export function tokenizeJson(json: string): JsonToken[] {
  // IMPORTANT: do NOT escape here. We render React text nodes.
  const s = json;
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

    // String starting with "
    if (ch === '"') {
      let j = i + 1;
      let backslash = false;
      while (j < N) {
        const cj = s[j];
        if (backslash) {
          backslash = false;
          j++;
          continue;
        }
        if (cj === "\\") {
          backslash = true;
          j++;
          continue;
        }
        if (cj === '"') {
          j++; // include closing quote
          break;
        }
        j++;
      }

      const strText = s.slice(i, j);

      // Is this a key? Lookahead for optional whitespace then :
      let k = j;
      while (k < N && /\s/.test(s[k])) k++;
      const isKey = s[k] === ":";

      push(strText, isKey ? "text-sky-400" : "text-emerald-400");
      i = j;
      continue;
    }

    // Numbers: -?\d+(\.\d+)?([eE][+-]?\d+)?
    if (/-|\d/.test(ch)) {
      let j = i;
      if (s[j] === "-") j++;
      while (j < N && /\d/.test(s[j])) j++;
      if (j < N && s[j] === ".") {
        j++;
        while (j < N && /\d/.test(s[j])) j++;
      }
      if (j < N && (s[j] === "e" || s[j] === "E")) {
        j++;
        if (s[j] === "+" || s[j] === "-") j++;
        while (j < N && /\d/.test(s[j])) j++;
      }
      push(s.slice(i, j), "text-amber-400");
      i = j;
      continue;
    }

    // Booleans / null
    if (s.startsWith("true", i)) {
      push("true", "text-fuchsia-400");
      i += 4;
      continue;
    }
    if (s.startsWith("false", i)) {
      push("false", "text-fuchsia-400");
      i += 5;
      continue;
    }
    if (s.startsWith("null", i)) {
      push("null", "text-fuchsia-400");
      i += 4;
      continue;
    }

    // Fallback: single char
    push(ch);
    i++;
  }

  return tokens;
}
