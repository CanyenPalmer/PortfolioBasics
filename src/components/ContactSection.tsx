"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function ContactSection() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="contact"
      className="relative bg-[#0b1016] text-white pt-24 pb-0"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 lg:grid-cols-3 lg:gap-8">
        {/* Contact info */}
        <div className="space-y-4">
          <p className="text-xl font-light leading-relaxed">
            I’d love to get in touch through my links! Currently open to{" "}
            <span className="text-cyan-400 font-medium">freelance</span> or{" "}
            <span className="text-cyan-400 font-medium">full-time</span> work.
          </p>
          <div className="mt-6 space-y-1 text-sm text-gray-300">
            <p className="uppercase text-xs tracking-widest text-gray-400">
              Contact
            </p>
            <a
              href="mailto:Canyen2019@gmail.com"
              className="hover:underline block"
            >
              Canyen2019@gmail.com
            </a>
            <p>Greenfield, IN • United States</p>
          </div>
          <p className="mt-4 text-xs text-gray-400 max-w-sm">
            Always open to collaborate on projects that blend data science, ML,
            and design.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <p className="text-xs uppercase tracking-widest text-gray-400">
            Navigation
          </p>
          <ul className="mt-4 space-y-4">
            <li>
              <Link
                href="#hero"
                className="block text-3xl font-semibold hover:text-cyan-400 transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="#about"
                className="block text-3xl font-semibold hover:text-cyan-400 transition-colors"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="#experience"
                className="block text-3xl font-semibold hover:text-cyan-400 transition-colors"
              >
                Experience
              </Link>
            </li>
            <li>
              <Link
                href="#projects"
                className="block text-3xl font-semibold hover:text-cyan-400 transition-colors"
              >
                Projects
              </Link>
            </li>
            <li>
              <Link
                href="#education"
                className="block text-3xl font-semibold hover:text-cyan-400 transition-colors"
              >
                Education
              </Link>
            </li>
            <li>
              <Link
                href="#testimonials"
                className="block text-3xl font-semibold hover:text-cyan-400 transition-colors"
              >
                Testimonials
              </Link>
            </li>
          </ul>
        </div>

        {/* Connect */}
        <div>
          <p className="text-xs uppercase tracking-widest text-gray-400">
            Connect
          </p>
          <ul className="mt-4 space-y-3">
            <li>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-xl font-medium hover:text-cyan-400 transition-colors"
              >
                LinkedIn
              </a>
            </li>
            <li>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-xl font-medium hover:text-cyan-400 transition-colors"
              >
                GitHub
              </a>
            </li>
          </ul>
          <p className="mt-6 text-xs text-gray-500">{time}</p>
        </div>
      </div>

      {/* Footer meta above echo */}
      <div className="mx-auto mt-16 mb-4 flex max-w-7xl items-center justify-between px-6 text-xs text-gray-500">
        <span>©2025 CANYEN PALMER</span>
        <span>THANK YOU FOR VISITING</span>
        <span>DATA • DESIGN • SYSTEMS</span>
      </div>

      {/* Echo stripes */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 h-[240px]">
          <div className="absolute bottom-24 w-full flex justify-center echo-top">
            <span className="echo-word">CANYEN PALMER</span>
          </div>
          <div className="absolute bottom-12 w-full flex justify-center echo-mid">
            <span className="echo-word">CANYEN PALMER</span>
          </div>
          <div className="absolute bottom-0 w-full flex justify-center echo-bottom">
            <span className="echo-word">CANYEN PALMER</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .echo-word {
          font-size: 6rem;
          font-weight: 900;
          line-height: 1;
          letter-spacing: -0.05em;
          color: white;
          text-transform: uppercase;
          mix-blend-mode: overlay;
        }
        .echo-top::before,
        .echo-mid::before,
        .echo-bottom::before {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          height: 1.1em;
          z-index: -1;
        }
        .echo-top::before {
          background: #0b1016;
        }
        .echo-mid::before {
          background: #0a0d13;
        }
        .echo-bottom::before {
          background: #070b10;
        }
      `}</style>
    </section>
  );
}

