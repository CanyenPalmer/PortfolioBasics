"use client";

import * as React from "react";
import { forwardRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import MetricTile, { Metric } from "./MetricTile";
import styles from "./experience.module.css";

/**
 * ExperienceCard
 * - Receives motion styles (x/scale/opacity/zIndex) from parent to create right→left flow
 * - Auto-expands when `isExpanded` is true (centered)
 * - Hover-scrub metrics when focused but not expanded; autoplay when expanded
 * - Shows highlights and creations (with details) when expanded
 */

type Props = {
  experience: any;
  index: number;
  isFocused: boolean;
  isExpanded: boolean;
  metrics?: Metric[];
  x: number;
  scale: number;
  opacity: number;
  zIndex: number;
};

function deriveCreationLabel(c: any): string {
  const direct = c?.label ?? c?.title ?? c?.name ?? c?.id ?? "";
  if (direct) return String(direct);

  const href = c?.href ?? c?.link ?? "";
  if (href && typeof href === "string") {
    try {
      const u = new URL(href);
      const last = u.pathname.split("/").filter(Boolean).pop() || u.hostname;
      return decodeURIComponent(last).replace(/[-_]/g, " ");
    } catch {
      const last = href.split("/").pop() || href;
      return decodeURIComponent(String(last)).replace(/[-_]/g, " ");
    }
  }

  const desc = c?.desc ?? c?.description ?? "";
  if (desc) {
    const first = String(desc).split(/[.?!]/)[0] ?? String(desc);
    return first.length > 64 ? first.slice(0, 61) + "…" : first;
  }

  return "Creation";
}

/** Normalize possible "details" shapes into string lines */
function getCreationDetails(c: any): string[] {
  const raw =
    c?.details ??
    c?.bullets ??
    c?.points ??
    c?.items ??
    c?.highlights ??
    c?.summary ??
    c?.desc ??
    c?.description ??
    null;

  if (Array.isArray(raw)) {
    return raw.filter(Boolean).map((s) => String(s));
  }
  if (typeof raw === "string") {
    const split = raw
      .split(/\r?\n|(?<=[.?!])\s+(?=[A-Z(])/)
      .map((s) => s.trim());
    const lines = split.filter(Boolean);
    return lines.length ? lines : [raw];
  }
  return [];
}

const ExperienceCard = forwardRef<HTMLDivElement, Props>(function ExperienceCard(
  { experience, isFocused, isExpanded, metrics = [], x, scale, opacity, zIndex },
  _ref
) {
  // Safe content access
  const company = experience?.company ?? "";
  const role = experience?.role ?? experience?.title ?? "";
  const dates = [experience?.start, experience?.end].filter(Boolean).join(" — ");
  const location = experience?.location ?? "";
  const highlights: string[] = Array.isArray(experience?.highlights) ? experience.highlights : [];
  const creations: any[] = Array.isArray(experience?.creations) ? experience.creations : [];

  return (
    <motion.div
      className={`${styles.card} ${isExpanded ? styles.cardExpanded : isFocused ? styles.cardFocused : styles.cardCollapsed}`}
      style={{ x, scale, opacity, zIndex }}
      transition={{ type: "spring", stiffness: 300, damping: 32, mass: 0.4 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold tracking-wide">{role}</h3>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-sm opacity-80">
            <span className="font-medium">{company}</span>
            {location && <span>· {location}</span>}
            {dates && <span>· {dates}</span>}
          </div>
        </div>
        {/* No manual View/Close buttons — auto expands when centered */}
      </div>

      {/* Metric Tiles */}
      {!!metrics.length && (
        <div className={`${styles.metricsGrid} mt-4`}>
          {metrics.map((m, i) => (
            <MetricTile
              key={`${m.label}-${i}`}
              metric={m}
              preview={isFocused && !isExpanded}
              autoplay={isExpanded}
            />
          ))}
        </div>
      )}

      {/* Details (highlights + creations) — visible when expanded (center) */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="details"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="mt-5"
          >
            {!!highlights.length && (
              <ul className="space-y-2 text-sm leading-6 opacity-90">
                {highlights.map((h, idx) => (
                  <li key={idx} className={styles.bulletLine}>
                    {h}
                  </li>
                ))}
              </ul>
            )}

            {!!creations.length && (
              <div className="mt-5">
                <div className="mb-2 text-xs font-semibold tracking-widest opacity-70">
                  CREATIONS
                </div>
                <ul className="space-y-3">
                  {creations.map((c: any, i: number) => {
                    if (typeof c === "string") {
                      return (
                        <li key={i} className="text-sm opacity-90">
                          <span className="font-medium">{c}</span>
                        </li>
                      );
                    }
                    const label = deriveCreationLabel(c);
                    const href = c?.href ?? c?.link ?? "";
                    const details = getCreationDetails(c);

                    return (
                      <li key={i} className="text-sm opacity-90">
                        {href ? (
                          <a
                            href={href}
                            target="_blank"
                            rel="noreferrer"
                            className={styles.pillLink}
                          >
                            {label}
                          </a>
                        ) : (
                          <span className="font-medium">{label}</span>
                        )}
                        {!!details.length && (
                          <ul className="mt-2 space-y-1">
                            {details.map((line, di) => (
                              <li key={di} className={styles.bulletLine}>
                                {line}
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

export default ExperienceCard;
