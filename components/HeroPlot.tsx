"use client";

import { useEffect, useRef } from "react";
import { SEASON } from "@/lib/season";

/*
  The hero art is a real figure, not texture that happens to be made of data.

  An earlier version drew all 29 days as one rust-coloured tangle. It looked
  like a chart and said nothing. This version keeps every observed day as faint
  context but puts the actual finding on top: weekend turnout peaks late
  morning, weekday turnout peaks after work. Two curves, directly labelled.

  SVG rather than canvas on purpose. The static plot is the finished artwork, so
  no JS and reduced motion both give you the whole figure; GSAP only draws it on.
  Nothing loops, so there is no frame budget to blow and no battery cost.
*/

const HOURS = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
const MAX = 22;

const VB = { w: 640, h: 400 };
const PAD = { left: 42, right: 22, top: 30, bottom: 62 };
const X0 = PAD.left;
const X1 = VB.w - PAD.right;
const Y0 = PAD.top;
const Y1 = VB.h - PAD.bottom;

const x = (hourIndex: number) => X0 + ((X1 - X0) * hourIndex) / (HOURS.length - 1);
const y = (arrivals: number) => Y1 - ((Y1 - Y0) * arrivals) / MAX;

const toPath = (points: [number, number][]) =>
  points
    .map(([hi, v], i) => `${i === 0 ? "M" : "L"}${x(hi).toFixed(1)},${y(v).toFixed(1)}`)
    .join(" ");

/** Every observed day, kept as honest context behind the finding. */
const DAY_LINES = SEASON.map((day) => ({
  isWeekend: day.isWeekend,
  d: toPath(
    day.hours
      .map(([hour, arrivals]) => [HOURS.indexOf(hour), arrivals] as [number, number])
      .filter(([hi]) => hi !== -1)
  ),
})).filter((line) => line.d.length > 0);

/** Mean arrivals per hour, split the way the data actually splits. */
function meanCurve(weekend: boolean) {
  const points: [number, number][] = [];
  HOURS.forEach((hour, hi) => {
    const vals: number[] = [];
    SEASON.forEach((day) => {
      if (day.isWeekend !== weekend) return;
      day.hours.forEach(([h, a]) => {
        if (h === hour) vals.push(a);
      });
    });
    if (vals.length) {
      points.push([hi, vals.reduce((s, v) => s + v, 0) / vals.length]);
    }
  });
  return points;
}

const WEEKEND = meanCurve(true);
const WEEKDAY = meanCurve(false);

const peakOf = (pts: [number, number][]) =>
  pts.reduce((best, p) => (p[1] > best[1] ? p : best), pts[0]);

const WEEKEND_PEAK = peakOf(WEEKEND);
const WEEKDAY_PEAK = peakOf(WEEKDAY);

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
        const frame = gsap.utils.toArray<SVGElement>(".hp-frame");
        const days = gsap.utils.toArray<SVGPathElement>(".hp-day");
        const means = gsap.utils.toArray<SVGPathElement>(".hp-mean");
        const notes = gsap.utils.toArray<SVGElement>(".hp-note");

        gsap.set([...days, ...means], { strokeDasharray: 2000, strokeDashoffset: 2000 });
        gsap.set([...frame, ...notes], { opacity: 0 });

        gsap
          .timeline({ defaults: { ease: "power2.out" } })
          .to(frame, { opacity: 1, duration: 0.45, stagger: 0.05 })
          .to(days, { strokeDashoffset: 0, duration: 0.9, stagger: 0.022 }, "-=0.2")
          .to(means, { strokeDashoffset: 0, duration: 1.1, stagger: 0.14 }, "-=0.75")
          .to(notes, { opacity: 1, duration: 0.5, stagger: 0.1 }, "-=0.35");
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
      aria-label="Average pool arrivals per hour across 29 recorded days. Weekend turnout peaks at 11am with about 13 arrivals an hour; weekday turnout peaks at 5pm with about 8."
    >
      {Y_TICKS.map((t) => (
        <g key={t} className="hp-frame">
          <line x1={X0} x2={X1} y1={y(t)} y2={y(t)} stroke="var(--color-rule)" strokeWidth={1} />
          <text x={X0 - 10} y={y(t) + 3.5} textAnchor="end" className="fill-ink-muted font-mono" fontSize={10}>
            {t}
          </text>
        </g>
      ))}

      {/* every observed day, held back so the finding can sit on top of it */}
      <g aria-hidden="true">
        {DAY_LINES.map((line, i) => (
          <path
            key={i}
            className="hp-day"
            d={line.d}
            fill="none"
            stroke={line.isWeekend ? "var(--color-rust)" : "var(--color-ink)"}
            strokeOpacity={line.isWeekend ? 0.26 : 0.17}
            strokeWidth={1}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
      </g>

      <path className="hp-mean" d={toPath(WEEKDAY)} fill="none" stroke="var(--color-ink)" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
      <path className="hp-mean" d={toPath(WEEKEND)} fill="none" stroke="var(--color-rust)" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />

      {/* direct labels beat a legend: no colour key to decode */}
      <PeakNote point={WEEKEND_PEAK} color="var(--color-rust)" text="Weekends · 11am" />
      <PeakNote point={WEEKDAY_PEAK} color="var(--color-ink)" text="Weekdays · 5pm" anchor="end" />

      <line className="hp-frame" x1={X0} x2={X1} y1={Y1} y2={Y1} stroke="var(--color-ink)" strokeWidth={1} />

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

      <text className="hp-frame fill-ink-muted font-mono" x={X0} y={Y1 + 42} fontSize={9.5} letterSpacing={1.3}>
        MEAN ARRIVALS PER OPEN HOUR · 29 DAYS · JUL–AUG 2026
      </text>
    </svg>
  );
}

function PeakNote({
  point,
  color,
  text,
  anchor = "start",
}: {
  point: [number, number];
  color: string;
  text: string;
  anchor?: "start" | "end";
}) {
  const px = x(point[0]);
  const py = y(point[1]);
  const offset = anchor === "end" ? -7 : 7;
  return (
    <g className="hp-note">
      <circle cx={px} cy={py} r={3} fill={color} />
      <text
        x={px + offset}
        y={py - 13}
        textAnchor={anchor}
        fontSize={11}
        className="font-mono"
        fill={color}
        stroke="var(--color-paper)"
        strokeWidth={3.5}
        paintOrder="stroke fill"
        letterSpacing={0.3}
      >
        {text}
      </text>
    </g>
  );
}
