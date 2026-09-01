"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  HOURS,
  MODEL,
  SCALE_MAX,
  TEMP_MAX,
  TEMP_MIN,
  busiestHour,
  formatHour,
  isExtrapolating,
  predict,
} from "@/lib/model";
import { arrivalRamp, thermal } from "@/lib/thermal";

const BAR_HEIGHT = 260;

/**
 * Counts a number toward its target, writing straight to the DOM node.
 *
 * Animating through React state would re-render the whole widget every frame.
 * This node's text is owned entirely by the hook: React renders the first value
 * and then leaves it alone.
 */
function useCountUp(target: number) {
  const ref = useRef<HTMLSpanElement>(null);
  const displayed = useRef(target);
  const [initial] = useState(() => Math.round(target));

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      displayed.current = target;
      node.textContent = String(Math.round(target));
      return;
    }

    const from = displayed.current;
    const start = performance.now();
    const duration = 460;
    let frame = requestAnimationFrame(function step(now) {
      const k = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - k, 3);
      displayed.current = from + (target - from) * eased;
      node.textContent = String(Math.round(displayed.current));
      if (k < 1) frame = requestAnimationFrame(step);
    });

    // background tabs throttle rAF, so guarantee the final number lands anyway
    const settle = setTimeout(() => {
      cancelAnimationFrame(frame);
      displayed.current = target;
      node.textContent = String(Math.round(target));
    }, duration + 90);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(settle);
    };
  }, [target]);

  return [ref, initial] as const;
}

export default function WhatIf() {
  const [temperature, setTemperature] = useState(82);
  const [isWeekend, setIsWeekend] = useState(false);
  const [isRaining, setIsRaining] = useState(false);

  const values = useMemo(
    () => predict({ temperature, isWeekend, isRaining }),
    [temperature, isWeekend, isRaining]
  );

  const [totalRef, totalInitial] = useCountUp(values.reduce((a, b) => a + b, 0));
  const peak = busiestHour(values);
  const extrapolating = isExtrapolating(temperature);

  const observedLeft = ((MODEL.observedMin - TEMP_MIN) / (TEMP_MAX - TEMP_MIN)) * 100;
  const observedWidth =
    ((MODEL.observedMax - MODEL.observedMin) / (TEMP_MAX - TEMP_MIN)) * 100;

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:gap-16">
      {/* controls */}
      <div className="flex flex-col gap-8">
        <div>
          <div className="mb-3 flex items-baseline justify-between gap-4">
            <label htmlFor="temperature" className="label">
              Temperature
            </label>
            <output
              htmlFor="temperature"
              className="numeral text-[clamp(1.75rem,3.4vw,2.5rem)] leading-none"
              style={{ color: temperature >= 84 ? "var(--color-flame)" : undefined }}
            >
              {temperature}&deg;
            </output>
          </div>

          <div className="relative flex h-[26px] items-center">
            <div
              className="pointer-events-none absolute top-[10px] h-1.5 rounded-full bg-ember/25"
              style={{ left: `${observedLeft}%`, width: `${observedWidth}%` }}
              aria-hidden="true"
            />
            <input
              id="temperature"
              className="temp-range"
              type="range"
              min={TEMP_MIN}
              max={TEMP_MAX}
              step={1}
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
            />
          </div>

          <p className="mt-3 font-mono text-[10px] leading-[1.7] tracking-[0.07em] text-muted">
            The lit band is the {MODEL.observedMin}&ndash;{MODEL.observedMax}&deg;F
            actually observed while training.
            <span
              className="block text-flame transition-opacity duration-200"
              style={{ opacity: extrapolating ? 1 : 0 }}
            >
              You are past it &mdash; this is extrapolation.
            </span>
          </p>
        </div>

        <div className="flex gap-2.5">
          <Toggle pressed={isWeekend} onChange={setIsWeekend}>
            Weekend
          </Toggle>
          <Toggle pressed={isRaining} onChange={setIsRaining}>
            Rain
          </Toggle>
        </div>

        <div className="flex gap-10 border-t border-[var(--line)] pt-6">
          <div>
            <span
              ref={totalRef}
              suppressHydrationWarning
              className="numeral block text-[clamp(2.5rem,5.5vw,3.75rem)] leading-none text-ember"
            >
              {totalInitial}
            </span>
            <span className="label mt-2.5 block">Arrivals that day</span>
          </div>
          <div>
            <span className="numeral block text-[clamp(2.5rem,5.5vw,3.75rem)] leading-none">
              {formatHour(peak)}
            </span>
            <span className="label mt-2.5 block">Busiest hour</span>
          </div>
        </div>
      </div>

      {/* prediction */}
      <div>
        <div
          className="flex items-end gap-1.5 sm:gap-2"
          style={{ height: BAR_HEIGHT }}
          role="img"
          aria-label={`Predicted arrivals by hour: ${HOURS.map(
            (h, i) => `${formatHour(h)}, ${values[i].toFixed(1)}`
          ).join("; ")}`}
        >
          {values.map((v, i) => {
            const t = arrivalRamp(v, SCALE_MAX);
            const color = thermal(t);
            return (
              <div
                key={HOURS[i]}
                className="group relative min-h-[3px] flex-1 rounded-t-md transition-[height,background-color,box-shadow] duration-500 ease-out"
                style={{
                  height: `${Math.max(3, (v / SCALE_MAX) * BAR_HEIGHT)}px`,
                  backgroundColor: color,
                  boxShadow: `0 0 ${18 + t * 34}px ${color.replace("rgb", "rgba").replace(")", `, ${0.16 + t * 0.4})`)}`,
                }}
              >
                <span className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 font-mono text-[10px] tabular-nums text-ink opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  {v.toFixed(1)}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-2.5 flex gap-1.5 border-t border-[var(--line)] pt-2.5 sm:gap-2">
          {HOURS.map((h) => (
            <span
              key={h}
              className="flex-1 text-center font-mono text-[9px] tracking-[0.04em] text-muted sm:text-[10px]"
            >
              {formatHour(h)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Toggle({
  pressed,
  onChange,
  children,
}: {
  pressed: boolean;
  onChange: (v: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={() => onChange(!pressed)}
      className={`cursor-pointer rounded-full border px-5 py-2.5 font-mono text-[10.5px] uppercase tracking-[0.12em] transition-all duration-200 ${
        pressed
          ? "border-flame/60 bg-flame/15 text-ember shadow-[0_0_24px_rgba(255,122,47,0.28)]"
          : "border-[var(--line)] text-muted hover:border-[var(--line-strong)] hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}
