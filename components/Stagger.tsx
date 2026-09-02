"use client";

import { useEffect, useRef } from "react";

/**
 * Resolves a section's parts in sequence when it scrolls into view.
 *
 * Mark the parts with `.stage` in document order — heading, then body, then
 * metadata — and they arrive in that order rather than all at once. The resting
 * state is the default in CSS, and `html.js-reveal` (set only when motion is
 * allowed) is what hides them to begin with, so no-JS and reduced-motion both
 * render the finished section with nothing to undo.
 */
export default function Stagger({
  children,
  start = "top 78%",
  gap = 0.09,
  className,
}: {
  children: React.ReactNode;
  start?: string;
  gap?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let ctx: { revert: () => void } | undefined;

    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);

        ctx = gsap.context(() => {
          const parts = gsap.utils.toArray<HTMLElement>(".stage", el);
          if (!parts.length) return;

          gsap.to(parts, {
            opacity: 1,
            y: 0,
            duration: 0.62,
            ease: "power2.out",
            stagger: gap,
            scrollTrigger: { trigger: el, start, once: true },
          });
        }, el);
      }
    );

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [start, gap]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
