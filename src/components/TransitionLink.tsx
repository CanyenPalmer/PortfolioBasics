// src/components/TransitionLink.tsx
"use client";

import React from "react";
import Link, { LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import { useTransitionOverlay } from "@/providers/TransitionProvider";

type AnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & { children?: React.ReactNode };

type Props = LinkProps & AnchorProps & {
  /** Disable the transition overlay for this link */
  disableTransition?: boolean;
};

function isExternal(href: string) {
  return /^https?:\/\//i.test(href);
}

function isHashOnly(href: string) {
  return href.startsWith("#");
}

export default function TransitionLink({
  href,
  onClick,
  disableTransition,
  ...rest
}: Props) {
  const router = useRouter();
  const { beginNav, prefersReduced } = useTransitionOverlay();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(e);
    if (e.defaultPrevented) return;

    const url = typeof href === "string" ? href : (href as any).pathname || "";

    // Allow middle-click or modifier keys to open in new tab normally
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;

    // External or hash-only → let Link handle as usual (no overlay)
    if (disableTransition || isExternal(url) || isHashOnly(url)) {
      return;
    }

    // Prevent Next from navigating immediately; start overlay first
    e.preventDefault();
    beginNav();

    // Small lead-in so the overlay is visible before route swap
    const lead = prefersReduced ? 30 : 160;
    setTimeout(() => {
      if (typeof href === "string") router.push(href);
      else router.push(href);
    }, lead);
  };

  return <Link href={href} onClick={handleClick} {...rest} />;
}
