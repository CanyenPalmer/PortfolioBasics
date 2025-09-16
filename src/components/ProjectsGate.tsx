"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * ProjectsGate — allows entry only if user came from the Projects collage:
 * - We set sessionStorage.cameFromProjects = "1" on tile click.
 * - We also pass ?via=projects as a backup.
 * - If neither is present, redirect to "/#projects".
 */
export default function ProjectsGate({ children }: { children: React.ReactNode }) {
  const [ok, setOk] = useState(false);
  const router = useRouter();
  const sp = useSearchParams();

  useEffect(() => {
    const via = sp.get("via");
    const came =
      typeof window !== "undefined"
        ? window.sessionStorage.getItem("cameFromProjects")
        : null;

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
  }, [router, sp]);

  if (!ok) return null;
  return <>{children}</>;
}

