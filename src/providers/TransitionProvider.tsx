// src/providers/TransitionProvider.tsx
"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";

type Mode = "idle" | "mach" | "nav";

type TransitionContextValue = {
  mode: Mode;
  isActive: boolean;
  beginNav: () => void;
  endNow: () => void;
  prefersReduced: boolean;
};

const TransitionContext = createContext<TransitionContextValue | null>(null);

export function useTransitionOverlay() {
  const ctx = useContext(TransitionContext);
  if (!ctx) throw new Error("useTransitionOverlay must be used within <TransitionProvider>");
  return ctx;
}

function getPrefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

export default function TransitionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mode, setMode] = useState<Mode>("idle");
  const [isActive, setActive] = useState(false);
  const [prefersReduced, setPrefersReduced] = useState<boolean>(false);
  const prevPathRef = useRef<string | null>(null);

  // On mount: compute motion pref
  useEffect(() => {
    setPrefersReduced(getPrefersReducedMotion());
  }, []);

  // MACH loader: run once per session and remove SSR boot overlay/class
  useEffect(() => {
    if (typeof window === "undefined") return;

    const dropBoot = () => {
      try {
        document.documentElement.classList.remove("mach-booting");
        const boot = document.getElementById("boot-overlay");
        if (boot) boot.parentElement?.removeChild(boot);
      } catch {}
    };

    // If we've already played this session, just drop the boot overlay immediately.
    if (sessionStorage.getItem("machLoaded")) {
      dropBoot();
      return;
    }

    // Start the client overlay immediately on hydration
    setMode("mach");
    setActive(true);

    // Wait until the hydrated overlay is actually in the DOM.
    // Then give it one frame to paint on top, and only then drop the SSR boot cover.
    const start = performance.now();
    const waitForOverlay = () => {
      const el = document.getElementById("mach-overlay-live");
      if (el) {
        requestAnimationFrame(() => {
          dropBoot();
        });
      } else if (performance.now() - start < 2000) {
        requestAnimationFrame(waitForOverlay);
      } else {
        // Fallback safety: don't block indefinitely if something unusual happens
        dropBoot();
      }
    };
    requestAnimationFrame(waitForOverlay);


    const dur = prefersReduced ? 150 : 1900; // ms (your longer, smoother timing)
    const tt = setTimeout(() => {
      setActive(false);
      setMode("idle");
      sessionStorage.setItem("machLoaded", "1");
    }, dur);

    return () => clearTimeout(tt);
  }, [prefersReduced]);

  // Track previous pathname for nav completion
  useEffect(() => {
    if (prevPathRef.current === null) {
      prevPathRef.current = pathname;
      return;
    }
    // If overlay in "nav" and the path changed, finish the animation
    if (mode === "nav" && isActive && pathname !== prevPathRef.current) {
      const t = setTimeout(() => {
        setActive(false);
        setMode("idle");
      }, prefersReduced ? 90 : 320);
      prevPathRef.current = pathname;
      return () => clearTimeout(t);
    }
    prevPathRef.current = pathname;
  }, [pathname, mode, isActive, prefersReduced]);

  const beginNav = useCallback(() => {
    setMode("nav");
    setActive(true);
  }, []);

  const endNow = useCallback(() => {
    setActive(false);
    setMode("idle");
  }, []);

  const value = useMemo(
    () => ({ mode, isActive, beginNav, endNow, prefersReduced }),
    [mode, isActive, beginNav, endNow, prefersReduced]
  );

  return <TransitionContext.Provider value={value}>{children}</TransitionContext.Provider>;
}
