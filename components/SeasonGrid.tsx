"use client";

import { useEffect, useRef, useState } from "react";
import { SEASON, SEASON_STATS, formatDay } from "@/lib/season";
import { ZERO_COLOR, arrivalColor, rampSwatches } from "@/lib/thermal";
import { formatHour } from "@/lib/model";

const GRID_HOURS = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
const CELL = 16;

type Cell = {
  key: string;
  date: string;
  hour: number;
  arrivals: number | null;
  delay: number;
};

/** Flattened once at module scope; the season never changes. */
const CELLS: Cell[] = SEASON.flatMap((day, dayIndex) => {
  const lookup = new Map(day.hours);
  return GRID_HOURS.map((hour, hourIndex) => ({
    key: `${day.date}-${hour}`,
    date: day.date,
    hour,
    arrivals: lookup.has(hour) ? (lookup.get(hour) as number) : null,
    delay: dayIndex * 18 + hourIndex * 5,
  }));
});

export default function SeasonGrid() {
  // hover is real interaction state; the fill-in is not, so an observer sets
  // that straight on the node rather than re-rendering 290 cells.
  const [hovered, setHovered] = useState<Cell | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = gridRef.current;
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
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <figure className="m-0">
      <figcaption className="mb-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-rule pb-3">
        <span className="label">Fig. 2 — Arrivals per open hour</span>
        <span className="min-h-5 font-mono text-[0.75rem] tabular-nums">
          {hovered ? (
            <>
              <span className="text-ink">{formatDay(hovered.date)}</span>
              <span className="text-ink-muted">
                {" · "}
                {formatHour(hovered.hour)}
                {" · "}
              </span>
              {hovered.arrivals === null ? (
                <span className="text-ink-muted">not recorded</span>
              ) : (
                <span className="text-rust">
                  {hovered.arrivals} arrival{hovered.arrivals === 1 ? "" : "s"}
                </span>
              )}
            </>
          ) : (
            <span className="text-ink-muted">
              Jul 8 – Aug 16, 2026 · hover a cell
            </span>
          )}
        </span>
      </figcaption>

      <div className="overflow-x-auto pb-1">
        <div
          ref={gridRef}
          data-shown="false"
          className="season-grid grid w-max grid-flow-col grid-rows-10 gap-[3px]"
          style={{ gridAutoColumns: `${CELL}px` }}
          onPointerLeave={() => setHovered(null)}
        >
          {CELLS.map((cell) => {
            const missing = cell.arrivals === null;
            return (
              <div
                key={cell.key}
                onPointerEnter={() => setHovered(cell)}
                className="season-cell"
                style={{
                  height: CELL,
                  width: CELL,
                  background: missing
                    ? "none"
                    : arrivalColor(cell.arrivals as number, SEASON_STATS.maxArrivals),
                  boxShadow: missing
                    ? "inset 0 0 0 1px var(--color-rule)"
                    : hovered?.key === cell.key
                      ? "inset 0 0 0 1.5px var(--color-ink)"
                      : undefined,
                  transitionDelay: `${cell.delay}ms`,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* a ruled key, not a row of pills */}
      <div className="mt-5 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-rule pt-3">
        <span className="flex items-center gap-2.5 font-mono text-[0.7rem] uppercase tracking-[0.1em] text-ink-muted">
          <span
            className="block h-3 w-3"
            style={{ boxShadow: "inset 0 0 0 1px var(--color-rule)" }}
          />
          Never recorded
        </span>
        <span className="flex items-center gap-2.5 font-mono text-[0.7rem] uppercase tracking-[0.1em] text-ink-muted">
          <span className="block h-3 w-3" style={{ background: ZERO_COLOR }} />
          Open, nobody came
        </span>
        <span className="flex items-center gap-2.5 font-mono text-[0.7rem] uppercase tracking-[0.1em] text-ink-muted">
          <span className="flex">
            {rampSwatches().map((c) => (
              <span key={c} className="block h-3 w-4" style={{ background: c }} />
            ))}
          </span>
          1 – {SEASON_STATS.maxArrivals} arrivals
        </span>
      </div>
    </figure>
  );
}
