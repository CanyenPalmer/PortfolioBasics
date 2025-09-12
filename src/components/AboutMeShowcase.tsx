"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { profile } from "@/content/profile";

const CYAN = "#00e5ff";

export default function AboutMeShowcase() {
  const poses = profile.about.poses;
  return (
    <section id="about" className="relative w-full">
      {/* render poses just like before, but using `poses` */}
    </section>
  );
}
