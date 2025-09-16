import { profile } from "@/content/profile";
import { slugify } from "./slug";

export type ProjectMeta = {
  title: string;
  slug: string;
  github?: string;
  tech?: string[];
};

export function orderedProjects(): ProjectMeta[] {
  const items = ((profile as any)?.projects ?? []) as Array<{
    title: string;
    links?: { label?: string; href: string }[];
    tech?: string[];
  }>;
  return items.map((p) => ({
    title: p.title,
    slug: slugify(p.title),
    github: p.links?.find((l) => /github\.com/i.test(l.href || ""))?.href,
    tech: p.tech ?? [],
  }));
}

export function findBySlug(slug: string): ProjectMeta | undefined {
  return orderedProjects().find((p) => p.slug === slug);
}

export function prevNext(slug: string): { prev: ProjectMeta; next: ProjectMeta } {
  const list = orderedProjects();
  const idx = Math.max(0, list.findIndex((p) => p.slug === slug));
  const prev = list[(idx - 1 + list.length) % list.length];
  const next = list[(idx + 1) % list.length];
  return { prev, next };
}
