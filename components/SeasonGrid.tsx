"use client";

import { useEffect, useRef, useState } from "react";
import { SEASON, SEASON_STATS, formatDay } from "@/lib/season";
import { ZERO_COLOR, arrivalColor, rampSwatches } from "@/lib/thermal";
import { formatHour } from "@/lib/model";

const GRID_HOURS = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
const CELL = 18;

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
    delay: dayIndex * 22 + hourIndex * 6,
  }));
});

export default function SeasonGrid() {
  // hover is real interaction state; the fill-in animation is not, so it is
  // driven by a data attribute the observer sets directly on the node.
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
    <div>
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <span className="label">Arrivals per open hour</span>
        <span className="min-h-5 font-mono text-[12px] tabular-nums">
          {hovered ? (
            <>
              <span className="text-ink">{formatDay(hovered.date)}</span>
              <span className="text-muted"> &middot; {formatHour(hovered.hour)} &middot; </span>
              {hovered.arrivals === null ? (
                <span className="text-muted">not recorded</span>
              ) : (
                <span className="text-ember">
                  {hovered.arrivals} arrival{hovered.arrivals === 1 ? "" : "s"}
                </span>
              )}
            </>
          ) : (
            <span className="text-muted">
              Jul 8 &mdash; Aug 16, 2026 &middot; hover a cell
            </span>
          )}
        </span>
      </div>

      <div className="overflow-x-auto pb-1">
        <div
          ref={gridRef}
          data-shown="false"
          className="season-grid grid w-max grid-flow-col grid-rows-10 gap-1"
          style={{ gridAutoColumns: `${CELL}px` }}
          onPointerLeave={() => setHovered(null)}
        >
          {CELLS.map((cell) => {
            const missing = cell.arrivals === null;
            const hot = !missing && (cell.arrivals as number) >= 16;
            const color = missing
              ? undefined
              : arrivalColor(cell.arrivals as number, SEASON_STATS.maxArrivals);
            return (
              <div
                key={cell.key}
                onPointerEnter={() => setHovered(cell)}
                className="season-cell rounded-[3px]"
                style={{
                  height: CELL,
                  width: CELL,
                  background: missing ? "none" : color,
                  boxShadow: missing
                    ? "inset 0 0 0 1px rgba(255,255,255,.07)"
                    : hovered?.key === cell.key
                      ? "0 0 0 2px var(--color-ink)"
                      : hot
                        ? `0 0 14px ${color}`
                        : undefined,
                  transitionDelay: `${cell.delay}ms`,
                }}
              />
            );
          })}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
        <Legend
          swatch={
            <span className="block h-3 w-3 rounded-[3px] shadow-[inset_0_0_0_1px_rgba(255,255,255,.14)]" />
          }
        >
          Never recorded
        </Legend>
        <Legend
          swatch={
            <span
              className="block h-3 w-3 rounded-[3px]"
              style={{ background: ZERO_COLOR }}
            />
          }
        >
          Open, nobody came
        </Legend>
        <Legend
          swatch={
            <span className="flex items-center gap-[3px]">
              {rampSwatches().map((c) => (
                <span
                  key={c}
                  className="block h-3 w-3.5 rounded-[3px]"
                  style={{ background: c }}
                />
              ))}
            </span>
          }
        >
          1 &mdash; {SEASON_STATS.maxArrivals} arrivals
        </Legend>
      </div>
    </div>
  );
}

function Legend({
  swatch,
  children,
}: {
  swatch: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <span className="flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
      {swatch}
      {children}
    </span>
  );
}
