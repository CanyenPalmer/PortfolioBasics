import fs from "fs/promises";
import path from "path";
import React from "react";
import Link from "next/link";
import { orderedProjects, findBySlug, prevNext } from "@/lib/projects";
import { imageForSlug } from "@/content/projectImages";
import ProjectsGate from "@/components/ProjectsGate";
import ProjectTopBar from "@/components/ProjectTopBar";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const revalidate = 60 * 60 * 24; // daily

export function generateStaticParams() {
  return orderedProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const p = findBySlug(params.slug);
  return {
    title: p ? `${p.title} • Project` : "Project",
    description: p?.title ?? "Project details",
    robots: { index: false, follow: false }, // keep these pages internal-only
  };
}

async function readLocalReadme(slug: string): Promise<string | null> {
  try {
    const file = path.join(process.cwd(), "src", "content", "readmes", `${slug}.md`);
    const buf = await fs.readFile(file, "utf8");
    return buf;
  } catch {
    return null;
  }
}

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const project = findBySlug(params.slug);
  if (!project) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-24">
        <h1 className="text-2xl font-semibold">Project not found</h1>
        <p className="mt-4 text-white/70">We couldn’t find that project.</p>
        <Link href="/#projects" className="mt-6 inline-block text-cyan-300 hover:underline">
          Back to Projects
        </Link>
      </div>
    );
  }

  const { prev, next } = prevNext(project.slug);
  const prevHref = `/projects/${prev.slug}?via=projects`;
  const nextHref = `/projects/${next.slug}?via=projects`;
  const readme = await readLocalReadme(project.slug);
  const hero = imageForSlug(project.slug);

  return (
    <ProjectsGate>
      <ProjectTopBar prevHref={prevHref} nextHref={nextHref} />
      <section className="relative py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-6">
          <header className="mb-8">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">{project.title}</h1>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left: sticky hero image */}
            <aside className="lg:col-span-4">
              <div className="lg:sticky lg:top-24">
                <img src={hero.src} alt={hero.alt} className="w-full h-auto object-contain select-none" />
              </div>
            </aside>

            {/* Middle+Right: README content */}
            <main className="lg:col-span-8">
              {/* Tech chips (subtle) */}
              {project.tech && project.tech.length > 0 && (
                <div className="mb-6 flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 text-white/70">
                      {t}
                    </span>
                  ))}
                </div>
              )}

              <div className="min-h-[200px] text-white/90 leading-relaxed">
                {readme ? (
                  // Styled Markdown without needing @tailwindcss/typography
                  <div className="space-y-4 [&_h1]:text-2xl [&_h1]:font-semibold [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:text-lg [&_h3]:font-semibold [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_code]:bg-white/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded">
                    {/* On xl, flow in two columns to emulate middle+right */}
                    <div className="columns-1 xl:columns-2 xl:gap-12 whitespace-pre-wrap">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {readme}
                      </ReactMarkdown>
                    </div>
                  </div>
                ) : (
                  <p className="text-white/70">README not found for this project.</p>
                )}
              </div>

              {/* Bottom-right GitHub button */}
              {project.github && (
                <div className="mt-10 flex justify-end">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-md border border-white/10 px-3 py-2 text-sm text-white/90 hover:bg-white/5"
                  >
                    View on GitHub
                    <svg width="16" height="16" viewBox="0 0 24 24" className="opacity-75">
                      <path fill="currentColor" d="M14 3h7v7h-2V6.414l-9.293 9.293-1.414-1.414L17.586 5H14V3z" />
                      <path fill="currentColor" d="M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2v7z" />
                    </svg>
                  </a>
                </div>
              )}
            </main>
          </div>
        </div>
      </section>
    </ProjectsGate>
  );
}
