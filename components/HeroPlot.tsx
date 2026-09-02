"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SEASON } from "@/lib/season";

/*
  The hero art is a real figure, not texture that happens to be made of data.

  Every observed day sits back as context, split by weekday and weekend tone,
  and the finding sits on top: weekend turnout peaks late morning, weekday
  turnout peaks after work. Two mean curves, directly labelled.

  It reads as well as it draws: trace across it and a rule follows the nearest
  hour with both means resolving in the margin, so the picture is also an
  instrument. Arrow keys do the same thing for anyone not using a pointer.

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

/** Mean arrivals for each hour, or null where that split never recorded one. */
function meanByHour(weekend: boolean): (number | null)[] {
  return HOURS.map((hour) => {
    const vals: number[] = [];
    SEASON.forEach((day) => {
      if (day.isWeekend !== weekend) return;
      day.hours.forEach(([h, a]) => {
        if (h === hour) vals.push(a);
      });
    });
    return vals.length ? vals.reduce((s, v) => s + v, 0) / vals.length : null;
  });
}

const WEEKEND = meanByHour(true);
const WEEKDAY = meanByHour(false);

const asPoints = (means: (number | null)[]) =>
  means
    .map((v, hi) => [hi, v] as [number, number | null])
    .filter((p): p is [number, number] => p[1] !== null);

const WEEKEND_POINTS = asPoints(WEEKEND);
const WEEKDAY_POINTS = asPoints(WEEKDAY);

const peakOf = (pts: [number, number][]) =>
  pts.reduce((best, p) => (p[1] > best[1] ? p : best), pts[0]);

const WEEKEND_PEAK = peakOf(WEEKEND_POINTS);
const WEEKDAY_PEAK = peakOf(WEEKDAY_POINTS);

const Y_TICKS = [0, 10, 20];
const X_TICKS = [0, 3, 6, 9];
const hourLabel = (h: number) => `${h % 12 === 0 ? 12 : h % 12}${h < 12 ? "am" : "pm"}`;
const fmt = (v: number | null) => (v === null ? "—" : v.toFixed(1));

export default function HeroPlot() {
  const ref = useRef<SVGSVGElement>(null);
  const [active, setActive] = useState<number | null>(null);

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

  /** Nearest hour to a pointer, in viewBox space rather than screen pixels. */
  const hourFromPointer = useCallback((clientX: number) => {
    const svg = ref.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    if (!rect.width) return null;
    const vbX = ((clientX - rect.left) / rect.width) * VB.w;
    const ratio = (vbX - X0) / (X1 - X0);
    const index = Math.round(ratio * (HOURS.length - 1));
    return Math.max(0, Math.min(HOURS.length - 1, index));
  }, []);

  const track = useCallback(
    (clientX: number) => {
      const next = hourFromPointer(clientX);
      // only re-render when the hour actually changes, not every pointer event
      setActive((prev) => (prev === next ? prev : next));
    },
    [hourFromPointer]
  );

  const onKeyDown = (event: React.KeyboardEvent<SVGSVGElement>) => {
    if (event.key === "Escape") {
      setActive(null);
      return;
    }
    const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    setActive((prev) => {
      const from = prev ?? (step > 0 ? -1 : HOURS.length);
      return Math.max(0, Math.min(HOURS.length - 1, from + step));
    });
  };

  const readingHour = active === null ? null : HOURS[active];

  return (
    <figure className="m-0">
      {/* the margin readout: the figure's own scale, in words */}
      <div className="mb-3 flex min-h-6 items-baseline justify-between gap-4 border-b border-rule pb-2 font-mono text-[0.72rem]">
        {readingHour === null ? (
          <span className="text-ink-muted">
            <span className="pointer-hover">Trace the figure</span>
            <span className="pointer-tap">Drag across the figure</span>
            <span> to read any hour</span>
          </span>
        ) : (
          <span className="text-ink tabular-nums">{hourLabel(readingHour)}</span>
        )}

        <span className="flex gap-5 tabular-nums" aria-live="polite">
          {readingHour === null ? null : (
            <>
              <span className="text-rust">Weekends {fmt(WEEKEND[active as number])}</span>
              <span className="text-ink">Weekdays {fmt(WEEKDAY[active as number])}</span>
            </>
          )}
        </span>
      </div>

      <svg
        ref={ref}
        viewBox={`0 0 ${VB.w} ${VB.h}`}
        className="h-auto w-full touch-pan-y"
        role="img"
        tabIndex={0}
        aria-label="Average pool arrivals per hour across 29 recorded days. Weekend turnout peaks at 11am with about 13 arrivals an hour; weekday turnout peaks at 5pm with about 8. Use the arrow keys to read each hour."
        onPointerMove={(e) => track(e.clientX)}
        onPointerDown={(e) => track(e.clientX)}
        onPointerLeave={() => setActive(null)}
        onBlur={() => setActive(null)}
        onKeyDown={onKeyDown}
      >
        {Y_TICKS.map((t) => (
          <g key={t} className="hp-frame">
            <line x1={X0} x2={X1} y1={y(t)} y2={y(t)} stroke="var(--color-rule)" strokeWidth={1} />
            <text x={X0 - 10} y={y(t) + 3.5} textAnchor="end" className="fill-ink-muted font-mono" fontSize={10}>
              {t}
            </text>
          </g>
        ))}

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

        <path className="hp-mean" d={toPath(WEEKDAY_POINTS)} fill="none" stroke="var(--color-ink)" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
        <path className="hp-mean" d={toPath(WEEKEND_POINTS)} fill="none" stroke="var(--color-rust)" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />

        {/* the trace: a plain rule and two readings, no transition to chase */}
        {active !== null ? (
          <g aria-hidden="true">
            <line x1={x(active)} x2={x(active)} y1={Y0 - 6} y2={Y1} stroke="var(--color-ink)" strokeWidth={1} strokeDasharray="2 3" />
            {WEEKEND[active] !== null ? (
              <circle cx={x(active)} cy={y(WEEKEND[active] as number)} r={4} fill="var(--color-rust)" />
            ) : null}
            {WEEKDAY[active] !== null ? (
              <circle cx={x(active)} cy={y(WEEKDAY[active] as number)} r={4} fill="var(--color-ink)" />
            ) : null}
          </g>
        ) : null}

        {/* direct labels beat a legend, but they duck out while you are reading */}
        <g style={{ opacity: active === null ? 1 : 0.18 }}>
          <PeakNote point={WEEKEND_PEAK} color="var(--color-rust)" text="Weekends · 11am" />
          <PeakNote point={WEEKDAY_PEAK} color="var(--color-ink)" text="Weekdays · 5pm" anchor="end" />
        </g>

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
    </figure>
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
  return (
    <g className="hp-note">
      <circle cx={px} cy={py} r={3} fill={color} />
      <text
        x={px + (anchor === "end" ? -7 : 7)}
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
