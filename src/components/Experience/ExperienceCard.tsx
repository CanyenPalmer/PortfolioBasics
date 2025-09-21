"use client";

import * as React from "react";
import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import MetricTile, { Metric } from "./MetricTile";
import styles from "./experience.module.css";

/**
 * ExperienceCard — presentation and interaction for a single experience.
 * - Three visual states: collapsed, focused, expanded
 * - Metrics: preview hover when focused; autoplay when expanded
 * - No layout shifts: fixed internal grid heights
 */

type Props = {
  refCallback: (el: HTMLDivElement | null) => void;
  experience: any;
  index: number;
  isFocused: boolean;
  isExpanded: boolean;
  metrics?: Metric[];
  onExpand: () => void;
  onCollapse: () => void;
};

const ExperienceCard = forwardRef<HTMLDivElement, Props>(function ExperienceCard(
  { refCallback, experience, index, isFocused, isExpanded, metrics, onExpand, onCollapse },
  _ref
) {
  const localRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    refCallback(localRef.current);
  }, [refCallback]);

  // Safe content access
  const company = experience?.company ?? "";
  const role = experience?.role ?? experience?.title ?? "";
  const dates = [experience?.start, experience?.end].filter(Boolean).join(" — ");
  const location = experience?.location ?? "";
  const highlights: string[] = Array.isArray(experience?.highlights) ? experience.highlights : [];
  const links: { label?: string; href: string }[] = Array.isArray(experience?.links) ? experience.links : [];
  const creations: { label?: string; href: string }[] = Array.isArray(experience?.creations) ? experience.creations : [];

  // Visual state classes
  const stateClass = isExpanded
    ? styles.cardExpanded
    : isFocused
    ? styles.cardFocused
    : styles.cardCollapsed;

  // Hover preview enabled only when focused and not expanded
  const enablePreview = isFocused && !isExpanded;

  return (
    <motion.div
      ref={localRef}
      className={`${styles.card} ${stateClass}`}
      layout
      transition={{ type: "spring", stiffness: 300, damping: 30, mass: 0.4 }}
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

        {/* Expand / Collapse */}
        <div className="shrink-0">
          {!isExpanded ? (
            <button
              type="button"
              onClick={onExpand}
              className={`${styles.ghostBtn} px-3 py-1 text-sm`}
              aria-expanded="false"
              aria-label="Expand experience details"
            >
              View
            </button>
          ) : (
            <button
              type="button"
              onClick={onCollapse}
              className={`${styles.ghostBtn} px-3 py-1 text-sm`}
              aria-expanded="true"
              aria-label="Collapse experience details"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* Metric Tiles (preview or full) */}
      {!!metrics?.length && (
        <div className={`${styles.metricsGrid} mt-4`}>
          {metrics.map((m, i) => (
            <MetricTile
              key={`${m.label}-${i}`}
              metric={m}
              preview={enablePreview}
              autoplay={isExpanded}
            />
          ))}
        </div>
      )}

      {/* Details (highlights + creations) — only fully visible when expanded */}
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

            {(!!links.length || !!creations.length) && (
              <div className="mt-4 flex flex-wrap gap-3">
                {links.map((l, idx) => (
                  <a
                    key={`link-${idx}`}
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.pillLink}
                  >
                    {l.label ?? "Link"}
                  </a>
                ))}
                {creations.map((c, idx) => (
                  <a
                    key={`creation-${idx}`}
                    href={c.href}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.pillLink}
                  >
                    {c.label ?? "Creation"}
                  </a>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

export default ExperienceCard;
