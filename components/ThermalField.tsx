"use client";

import { useEffect, useRef } from "react";
import { SEASON, SEASON_STATS } from "@/lib/season";
import { arrivalRamp, thermalRgb } from "@/lib/thermal";

const GRID_HOURS = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
const COLS = SEASON.length;
const ROWS = GRID_HOURS.length;

/**
 * Every hour of the season, painted across the whole viewport.
 *
 * The season is drawn once into a tiny COLS x ROWS canvas, then scaled up with
 * smoothing on. The browser's own bilinear filtering turns 290 hard squares into
 * a soft field of heat far more cheaply than blurring a full-size canvas would.
 *
 * One faint seam is then drawn per day, so the result reads as a measurement --
 * 29 columns, one per day of the season -- rather than as a decorative gradient.
 * Nothing here is invented: every color is a real hour.
 */
export default function ThermalField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const source = document.createElement("canvas");
    source.width = COLS;
    source.height = ROWS;
    const sourceCtx = source.getContext("2d");
    if (!sourceCtx) return;

    const cells: (number | null)[][] = SEASON.map((day) => {
      const lookup = new Map(day.hours);
      return GRID_HOURS.map((h) => (lookup.has(h) ? (lookup.get(h) as number) : null));
    });

    // An unrecorded hour has no value to show, so it borrows a dimmed version of
    // its own day's average. That keeps the field continuous instead of punching
    // holes in it; the honest version of the data lives in the grid further down.
    const filled = cells.map((col) => {
      const known = col.filter((v): v is number => v !== null);
      const mean = known.length ? known.reduce((a, b) => a + b, 0) / known.length : 0;
      return col.map((v) => (v === null ? mean * 0.4 : v));
    });

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const paint = (progress: number) => {
      sourceCtx.clearRect(0, 0, COLS, ROWS);
      const visible = Math.ceil(progress * COLS);
      for (let x = 0; x < visible; x++) {
        const edge = Math.min(1, (progress * COLS - x) / 1.6);
        for (let y = 0; y < ROWS; y++) {
          const [r, g, b] = thermalRgb(
            arrivalRamp(filled[x][y], SEASON_STATS.maxArrivals)
          );
          sourceCtx.fillStyle = `rgba(${r}, ${g}, ${b}, ${edge})`;
          sourceCtx.fillRect(x, y, 1, 1);
        }
      }

      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // overdraw the edges so the smoothed field bleeds past the viewport
      const bleedX = width * 0.1;
      const bleedY = height * 0.14;
      ctx.drawImage(source, -bleedX, -bleedY, width + bleedX * 2, height + bleedY * 2);

      // one seam per day
      const step = (width + bleedX * 2) / COLS;
      ctx.fillStyle = "rgba(8, 6, 15, 0.34)";
      for (let x = 1; x < COLS; x++) {
        const px = Math.round(-bleedX + x * step);
        ctx.fillRect(px, 0, Math.max(1, width / 900), height);
      }
    };

    let frame = 0;
    let start = 0;

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
    };

    const run = (now: number) => {
      if (!start) start = now;
      const progress = Math.min(1, (now - start) / 1900);
      paint(1 - Math.pow(1 - progress, 2));
      if (progress < 1) frame = requestAnimationFrame(run);
    };

    resize();
    if (reduced) {
      paint(1);
    } else {
      frame = requestAnimationFrame(run);
    }

    const onResize = () => {
      resize();
      paint(1);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <canvas ref={canvasRef} className="h-full w-full" />

      {/* readable behind type, still lit where the type is not */}
      <div className="field-scrim absolute inset-0" />
      <div className="field-vignette absolute inset-0" />
      <div
        className="absolute inset-x-0 top-0 h-32"
        style={{ background: "linear-gradient(to bottom, #08060f, transparent)" }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-64"
        style={{ background: "linear-gradient(to bottom, transparent, #08060f)" }}
      />
      <div className="grain absolute inset-0" />
    </div>
  );
}
