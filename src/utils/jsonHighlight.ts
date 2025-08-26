/* ------------------------------------------------------------------ */
/* Real-time, color-as-you-type tokenizer for React element rendering */
/* ------------------------------------------------------------------ */

export type JsonToken = {
  text: string;        // raw, UNESCAPED JSON text (React will escape safely)
  className?: string;  // tailwind class for color, if any
};

export function tokenizeJson(json: string): JsonToken[] {
  // IMPORTANT: do NOT escape here. We render React text nodes (safe by default).
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

      push(strText, isKey ? "text-sky-300" : "text-emerald-300");
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
      // Guard against matching the dash in an en–dash date range – JSON dates here are strings, so numbers are safe.
      push(s.slice(i, j), "text-amber-300");
      i = j;
      continue;
    }

    // Booleans / null
    if (s.startsWith("true", i)) {
      push("true", "text-fuchsia-300");
      i += 4;
      continue;
    }
    if (s.startsWith("false", i)) {
      push("false", "text-fuchsia-300");
      i += 5;
      continue;
    }
    if (s.startsWith("null", i)) {
      push("null", "text-fuchsia-300");
      i += 4;
      continue;
    }

    // Fallback: single char
    push(ch);
    i++;
  }

  return tokens;
}
