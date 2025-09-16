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

async function tryRead(filePath: string): Promise<string | null> {
  try {
    return await fs.readFile(filePath, "utf8");
  } catch {
    return null;
  }
}

// Fallback names for legacy README filenames (so LR works even if misnamed)
const README_FALLBACKS: Record<string, string[]> = {
  "logistic-regression-and-tree-based-ml": ["logistic-regression-tree-based-ml"],
};

async function readLocalReadme(slug: string): Promise<string | null> {
  const baseDir = path.join(process.cwd(), "src", "content", "readmes");
  // primary attempt
  const primary = await tryRead(path.join(baseDir, `${slug}.md`));
  if (primary) return primary;

  // try fallbacks (e.g., legacy logistic file without "and")
  const altNames = README_FALLBACKS[slug] ?? [];
  for (const alt of altNames) {
    const altContent = await tryRead(path.join(baseDir, `${alt}.md`));
    if (altContent) return altContent;
  }
  return null;
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

  // 1) Make Logistic Regression hero image larger (wider left column on lg+)
  const isLR = project.slug === "logistic-regression-and-tree-based-ml";
  const leftCols = isLR ? "lg:col-span-5" : "lg:col-span-4";
  const rightCols = isLR ? "lg:col-span-7" : "lg:col-span-8";

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
            <aside className={["lg:col-span-4", "lg:col-span-5", leftCols].join(" ")}>
              <div className="lg:sticky lg:top-24">
                <img
                  src={hero.src}
                  alt={hero.alt}
                  className="w-full h-auto object-contain select-none"
                />
              </div>
            </aside>

            {/* Middle+Right: README content */}
            <main className={["lg:col-span-8", "lg:col-span-7", rightCols].join(" ")}>
              {/* Tech chips (subtle) */}
              {project.tech && project.tech.length > 0 && (
                <div className="mb-6 flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 text-white/70"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}

              <div className="min-h-[200px] text-white/90 leading-relaxed">
                {readme ? (
                  // 3) Clean, aligned Markdown rendering
                  // - Proper list padding + list-outside markers
                  // - Prevent lists from breaking across columns: break-inside: avoid
                  // - No whitespace-pre-wrap (lets markdown wrap naturally)
                  <div className="space-y-5">
                    {/* On xl, flow in two columns; lists won't split thanks to break-inside guards */}
                    <div className="columns-1 xl:columns-2 xl:gap-12">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          h1: ({ node, ...props }) => (
                            <h1 className="text-2xl font-semibold mt-2 mb-3" {...props} />
                          ),
                          h2: ({ node, ...props }) => (
                            <h2 className="text-xl font-semibold mt-2 mb-3" {...props} />
                          ),
                          h3: ({ node, ...props }) => (
                            <h3 className="text-lg font-semibold mt-2 mb-2" {...props} />
                          ),
                          p: ({ node, ...props }) => (
                            <p className="my-3 leading-relaxed" {...props} />
                          ),
                          ul: ({ node, ...props }) => (
                            <ul
                              className="list-disc list-outside pl-6 my-3 [break-inside:avoid]"
                              {...props}
                            />
                          ),
                          ol: ({ node, ...props }) => (
                            <ol
                              className="list-decimal list-outside pl-6 my-3 [break-inside:avoid]"
                              {...props}
                            />
                          ),
                          li: ({ node, ...props }) => (
                            <li className="my-1 leading-relaxed" {...props} />
                          ),
                          code: ({ inline, className, children, ...props }) =>
                            inline ? (
                              <code
                                className="bg-white/10 px-1.5 py-0.5 rounded text-white/90"
                                {...props}
                              >
                                {children}
                              </code>
                            ) : (
                              <pre className="bg-white/10 rounded p-3 overflow-x-auto my-4">
                                <code className="text-white/90" {...props}>
                                  {children}
                                </code>
                              </pre>
                            ),
                          blockquote: ({ node, ...props }) => (
                            <blockquote
                              className="border-l-2 border-white/20 pl-4 my-3 text-white/80"
                              {...props}
                            />
                          ),
                          hr: ({ node, ...props }) => (
                            <hr className="my-8 border-white/10" {...props} />
                          ),
                          a: ({ node, ...props }) => (
                            <a
                              className="text-cyan-300 hover:underline"
                              target="_blank"
                              rel="noreferrer"
                              {...props}
                            />
                          ),
                        }}
                      >
                        {readme}
                      </ReactMarkdown>
                    </div>
                  </div>
                ) : (
                  <p className="text-white/70">
                    README not found for this project.
                  </p>
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
                      <path
                        fill="currentColor"
                        d="M14 3h7v7h-2V6.414l-9.293 9.293-1.414-1.414L17.586 5H14V3z"
                      />
                      <path
                        fill="currentColor"
                        d="M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2v7z"
                      />
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
