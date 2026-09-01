"use client";

import { useEffect, useRef } from "react";

/**
 * Fades a block in the first time it scrolls into view.
 *
 * The observer writes a data attribute straight onto the node rather than going
 * through React state -- there is nothing else on the page that needs to know
 * whether this block has appeared, and it keeps one observer from re-rendering
 * a whole section.
 */
export default function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (!("IntersectionObserver" in window)) {
      node.dataset.shown = "true";
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            node.dataset.shown = "true";
            observer.disconnect();
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      data-shown="false"
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
