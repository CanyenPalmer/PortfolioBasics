/**
 * Minimal, dependency-free JSON syntax highlighter.
 * Produces HTML spans with Tailwind color classes expected by your theme.
 * Usage:
 *   const html = highlightJson(JSON.stringify(obj, null, 2));
 *   <code dangerouslySetInnerHTML={{ __html: html }} />
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
  // Escape first to keep output safe
  let esc = escapeHtml(json);

  // Order matters: colorize keys first so we don't re-match them as generic strings
  // Keys:   "key":
  esc = esc.replace(
    /(^|[\r\n])(\s*)(".*?")(\s*):/g,
    (_, br, ws, key, after) =>
      `${br}${ws}<span class="text-blue-400">${key}</span>${after}:`
  );

  // String values (anything in quotes not already colored as keys)
  esc = esc.replace(
    /(:\s*)(".*?")/g,
    (_, pre, val) => `${pre}<span class="text-green-400">${val}</span>`
  );

  // Numbers
  esc = esc.replace(
    /(:\s*)(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g,
    (_, pre, num) => `${pre}<span class="text-amber-300">${num}</span>`
  );

  // Booleans & null
  esc = esc.replace(
    /(:\s*)(true|false|null)/g,
    (_, pre, kw) => `${pre}<span class="text-purple-300">${kw}</span>`
  );

  // Braces/brackets can stay default; your monospace + overall color handles it nicely.
  return esc;
}

/**
 * Helper to build a “printable” version of your Experience item,
 * controlling which fields appear in the typed JSON.
 */
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
