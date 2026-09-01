"use client";

import { useEffect } from "react";

/**
 * Lenis smooth scrolling, plus the class that arms the staged reveals.
 *
 * Both are gated on prefers-reduced-motion. If someone has asked their machine
 * to stop moving things, they get native scrolling and every section already
 * at its resting state -- not a slower version of the same animation.
 *
 * Lenis and GSAP are imported dynamically so neither lands in the initial
 * bundle, and ScrollTrigger is driven from Lenis' own tick rather than running
 * a second RAF loop of its own.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    document.documentElement.classList.add("js-reveal");

    let lenis: { raf: (t: number) => void; destroy: () => void } | null = null;
    let cleanup: (() => void) | undefined;
    let cancelled = false;

    (async () => {
      const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([
        import("lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1 });

      const onScroll = () => ScrollTrigger.update();
      (lenis as unknown as { on: (e: string, cb: () => void) => void }).on(
        "scroll",
        onScroll
      );

      // one clock, not two
      const tick = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      cleanup = () => {
        gsap.ticker.remove(tick);
        ScrollTrigger.getAll().forEach((t) => t.kill());
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
      lenis?.destroy();
      document.documentElement.classList.remove("js-reveal");
    };
  }, []);

  return null;
}
