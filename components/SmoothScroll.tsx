"use client";

import { useEffect } from "react";

type LenisLike = {
  raf: (t: number) => void;
  destroy: () => void;
  on: (event: string, cb: () => void) => void;
  scrollTo: (
    target: string | HTMLElement | number,
    opts?: { offset?: number; duration?: number; onComplete?: () => void }
  ) => void;
};

/**
 * Lenis smooth scrolling, the class that arms the staged reveals, and smooth
 * in-page anchor navigation.
 *
 * All three are gated on prefers-reduced-motion. Someone who has asked their
 * machine to stop moving things gets native scrolling, sections already at rest,
 * and instant anchor jumps -- not slower versions of the same animation.
 *
 * Lenis and GSAP are imported dynamically so neither lands in the initial
 * bundle, and ScrollTrigger runs off Lenis' tick rather than a second RAF loop.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let lenis: LenisLike | null = null;
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

      /*
        Armed only once GSAP is actually here. Setting it before the import
        resolves means a failed import (offline, blocked, CSP) leaves every
        .stage element hidden with nothing left to reveal it.
      */
      document.documentElement.classList.add("js-reveal");

      lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1 }) as unknown as LenisLike;
      lenis.on("scroll", () => ScrollTrigger.update());

      // one clock, not two
      const tick = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      /*
        Lenis owns the wheel but not anchor clicks, so without this every nav
        link snaps to its section while the rest of the page glides. Intercept
        same-page hashes and hand them to Lenis instead.
      */
      const onClick = (event: MouseEvent) => {
        if (event.defaultPrevented || event.button !== 0) return;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

        const link = (event.target as HTMLElement | null)?.closest?.("a");
        if (!link) return;

        const href = link.getAttribute("href");
        if (!href || !href.startsWith("#") || href === "#") return;

        const target = document.querySelector<HTMLElement>(href);
        if (!target) return;

        // no Lenis, no interception: let the browser do its ordinary jump
        // rather than swallowing the click and going nowhere
        if (!lenis) return;

        event.preventDefault();

        // clear the fixed masthead
        const header = document.querySelector<HTMLElement>("header");
        const offset = -((header?.offsetHeight ?? 0) + 12);

        lenis?.scrollTo(target, {
          offset,
          onComplete: () => {
            /*
              Smooth scrolling without this strands keyboard and screen-reader
              users: the view moves but focus does not, so the next Tab carries
              on from wherever they were.
            */
            const hadTabIndex = target.hasAttribute("tabindex");
            if (!hadTabIndex) target.setAttribute("tabindex", "-1");
            target.focus({ preventScroll: true });
            if (!hadTabIndex) target.removeAttribute("tabindex");
          },
        });

        history.pushState(null, "", href);
      };

      document.addEventListener("click", onClick);

      cleanup = () => {
        document.removeEventListener("click", onClick);
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
