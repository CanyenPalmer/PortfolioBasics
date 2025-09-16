"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * ProjectsGate — allows entry only if user came from the Projects collage:
 * - We set sessionStorage.cameFromProjects = "1" on tile click.
 * - We also pass ?via=projects as a backup.
 * - If neither is present, redirect to "/#projects".
 */
export default function ProjectsGate({ children }: { children: React.ReactNode }) {
  const [ok, setOk] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const hasWindow = typeof window !== "undefined";
    const via =
      hasWindow ? new URLSearchParams(window.location.search).get("via") : null;
    const came = hasWindow ? window.sessionStorage.getItem("cameFromProjects") : null;

    if (via === "projects") {
      window.sessionStorage.setItem("cameFromProjects", "1");
      setOk(true);
      return;
    }
    if (came === "1") {
      setOk(true);
      return;
    }
    router.replace("/#projects");
  }, [router]);

  if (!ok) return null;
  return <>{children}</>;
}
