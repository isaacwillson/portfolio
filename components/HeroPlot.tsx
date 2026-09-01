"use client";

import { useEffect, useRef } from "react";
import { SEASON } from "@/lib/season";

/*
  The hero art is a printed figure of the real training set: 29 days of pool
  arrivals, one thin rust line each, with the hourly mean struck through in ink.

  It is SVG rather than canvas on purpose. The static plot is the real artwork,
  so there is nothing to fall back to -- no JS gives you the finished figure,
  reduced motion gives you the finished figure, and GSAP only adds the draw-on.
  Nothing here loops, so there is no frame budget to blow and no battery drain.
*/

const HOURS = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
const MAX = 22;

const VB = { w: 640, h: 400 };
const PAD = { left: 42, right: 20, top: 34, bottom: 58 };
const X0 = PAD.left;
const X1 = VB.w - PAD.right;
const Y0 = PAD.top;
const Y1 = VB.h - PAD.bottom;

const x = (hourIndex: number) => X0 + ((X1 - X0) * hourIndex) / (HOURS.length - 1);
const y = (arrivals: number) => Y1 - ((Y1 - Y0) * arrivals) / MAX;

/** One polyline per day. Straight segments, because this is a figure, not a flourish. */
const DAY_PATHS: string[] = SEASON.map((day) =>
  day.hours
    .map(([hour, arrivals], i) => {
      const hi = HOURS.indexOf(hour);
      if (hi === -1) return "";
      return `${i === 0 ? "M" : "L"}${x(hi).toFixed(1)},${y(arrivals).toFixed(1)}`;
    })
    .join(" ")
    .trim()
).filter((d) => d.length > 0);

/** The hourly mean across every day that recorded that hour. */
const MEAN_PATH = (() => {
  const sums = HOURS.map(() => ({ total: 0, count: 0 }));
  SEASON.forEach((day) =>
    day.hours.forEach(([hour, arrivals]) => {
      const hi = HOURS.indexOf(hour);
      if (hi !== -1) {
        sums[hi].total += arrivals;
        sums[hi].count += 1;
      }
    })
  );
  return sums
    .map((s, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(s.total / s.count).toFixed(1)}`)
    .join(" ");
})();

const Y_TICKS = [0, 10, 20];
const X_TICKS = [0, 3, 6, 9];
const hourLabel = (h: number) => `${h % 12 === 0 ? 12 : h % 12}${h < 12 ? "am" : "pm"}`;

export default function HeroPlot() {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let ctx: { revert: () => void } | undefined;

    import("gsap").then(({ gsap }) => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        const days = gsap.utils.toArray<SVGPathElement>(".hp-day");
        const mean = svg.querySelector<SVGPathElement>(".hp-mean");
        const frame = gsap.utils.toArray<SVGElement>(".hp-frame");

        gsap.set([...days, mean], { strokeDasharray: 2000, strokeDashoffset: 2000 });
        gsap.set(frame, { opacity: 0 });

        gsap
          .timeline({ defaults: { ease: "power2.out" } })
          .to(frame, { opacity: 1, duration: 0.5, stagger: 0.04 })
          .to(
            days,
            { strokeDashoffset: 0, duration: 1.15, stagger: 0.028 },
            "-=0.25"
          )
          .to(mean, { strokeDashoffset: 0, duration: 1.1 }, "-=0.7");
      }, svg);
    });

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${VB.w} ${VB.h}`}
      className="h-auto w-full"
      role="img"
      aria-label="A plot of pool arrivals per hour across 29 recorded days, with the hourly mean drawn through it."
    >
      {/* horizontal rules, drawn like a ruled figure */}
      {Y_TICKS.map((t) => (
        <g key={t} className="hp-frame">
          <line
            x1={X0}
            x2={X1}
            y1={y(t)}
            y2={y(t)}
            stroke="var(--color-rule)"
            strokeWidth={1}
          />
          <text
            x={X0 - 10}
            y={y(t) + 3.5}
            textAnchor="end"
            className="fill-ink-muted font-mono"
            fontSize={10}
          >
            {t}
          </text>
        </g>
      ))}

      {/*
        Riso misregistration: the same 29 lines printed twice, the under-layer
        nudged a hair down and right. It is what gives the plot its printed feel.
      */}
      <g transform="translate(1.6, 1.6)" opacity={0.28} aria-hidden="true">
        {DAY_PATHS.map((d, i) => (
          <path
            key={i}
            className="hp-day"
            d={d}
            fill="none"
            stroke="var(--color-rust)"
            strokeWidth={0.9}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
      </g>

      <g opacity={0.42}>
        {DAY_PATHS.map((d, i) => (
          <path
            key={i}
            className="hp-day"
            d={d}
            fill="none"
            stroke="var(--color-rust)"
            strokeWidth={0.9}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
      </g>

      <path
        className="hp-mean"
        d={MEAN_PATH}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* baseline */}
      <line
        className="hp-frame"
        x1={X0}
        x2={X1}
        y1={Y1}
        y2={Y1}
        stroke="var(--color-ink)"
        strokeWidth={1}
      />

      {X_TICKS.map((i) => (
        <text
          key={i}
          className="hp-frame fill-ink-muted font-mono"
          x={x(i)}
          y={Y1 + 20}
          textAnchor={i === 0 ? "start" : i === HOURS.length - 1 ? "end" : "middle"}
          fontSize={10}
        >
          {hourLabel(HOURS[i])}
        </text>
      ))}

      <text
        className="hp-frame fill-ink-muted font-mono"
        x={X0}
        y={Y1 + 40}
        fontSize={9.5}
        letterSpacing={1.4}
      >
        ARRIVALS PER OPEN HOUR · 29 DAYS · JUL–AUG 2026
      </text>
    </svg>
  );
}
