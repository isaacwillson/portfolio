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
import { arrivalRamp, ramp } from "@/lib/thermal";

const BAR_HEIGHT = 220;

/**
 * Counts a number toward its target, writing straight to the DOM node.
 *
 * Animating through React state would re-render the whole widget every frame.
 * This node's text belongs to the hook: React renders the first value and then
 * leaves it alone.
 */
function useCountUp(target: number) {
  const ref = useRef<HTMLSpanElement>(null);
  const displayed = useRef(target);
  const [initial] = useState(() => Math.round(target));

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      displayed.current = target;
      node.textContent = String(Math.round(target));
      return;
    }

    const from = displayed.current;
    const start = performance.now();
    const duration = 420;
    let frame = requestAnimationFrame(function step(now) {
      const k = Math.min(1, (now - start) / duration);
      displayed.current = from + (target - from) * (1 - Math.pow(1 - k, 3));
      node.textContent = String(Math.round(displayed.current));
      if (k < 1) frame = requestAnimationFrame(step);
    });

    // background tabs throttle rAF, so make sure the final number lands anyway
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

  const bandLeft = ((MODEL.observedMin - TEMP_MIN) / (TEMP_MAX - TEMP_MIN)) * 100;
  const bandWidth =
    ((MODEL.observedMax - MODEL.observedMin) / (TEMP_MAX - TEMP_MIN)) * 100;

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)] lg:gap-14">
      <div>
        <div className="flex items-baseline justify-between gap-4 border-b border-rule pb-3">
          <label htmlFor="temperature" className="label">
            Temperature
          </label>
          <output htmlFor="temperature" className="numeral text-[1.6rem] text-ink">
            {temperature}°F
          </output>
        </div>

        <div className="relative mt-5 flex h-6 items-center">
          <div
            className="pointer-events-none absolute top-[11px] h-[2px]"
            style={{
              left: `${bandLeft}%`,
              width: `${bandWidth}%`,
              background: "var(--color-rust)",
              opacity: 0.35,
            }}
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

        <p className="mt-3 font-mono text-[0.7rem] leading-[1.7] text-ink-muted">
          Marked span is the {MODEL.observedMin}–{MODEL.observedMax}°F observed while
          training.
          <span
            className="block text-rust transition-opacity duration-200"
            style={{ opacity: extrapolating ? 1 : 0 }}
          >
            Past it — this is extrapolation.
          </span>
        </p>

        <div className="mt-7 flex gap-3">
          <Toggle pressed={isWeekend} onChange={setIsWeekend}>
            Weekend
          </Toggle>
          <Toggle pressed={isRaining} onChange={setIsRaining}>
            Rain
          </Toggle>
        </div>

        <dl className="mt-9 grid grid-cols-2 gap-6 border-t border-ink pt-5">
          <div>
            <dd className="numeral text-[2.4rem] leading-none text-rust">
              <span ref={totalRef} suppressHydrationWarning>
                {totalInitial}
              </span>
            </dd>
            <dt className="label mt-2.5">Arrivals that day</dt>
          </div>
          <div>
            <dd className="numeral text-[2.4rem] leading-none">{formatHour(peak)}</dd>
            <dt className="label mt-2.5">Busiest hour</dt>
          </div>
        </dl>
      </div>

      <figure className="m-0">
        <div
          className="flex items-end gap-[3px] border-b border-ink sm:gap-1.5"
          style={{ height: BAR_HEIGHT }}
          role="img"
          aria-label={`Predicted arrivals by hour: ${HOURS.map(
            (h, i) => `${formatHour(h)}, ${values[i].toFixed(1)}`
          ).join("; ")}`}
        >
          {values.map((v, i) => (
            <div
              key={HOURS[i]}
              className="group relative min-h-[2px] flex-1 transition-[height,background-color] duration-500 ease-out"
              style={{
                height: `${Math.max(2, (v / SCALE_MAX) * BAR_HEIGHT)}px`,
                background: ramp(arrivalRamp(v, SCALE_MAX)),
              }}
            >
              <span className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 font-mono text-[0.7rem] tabular-nums text-ink opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                {v.toFixed(1)}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-2.5 flex gap-[3px] sm:gap-1.5">
          {HOURS.map((h) => (
            <span
              key={h}
              className="flex-1 text-center font-mono text-[0.62rem] text-ink-muted"
            >
              {formatHour(h)}
            </span>
          ))}
        </div>

        <figcaption className="label mt-5">
          Fig. 1 — Predicted arrivals per open hour
        </figcaption>
      </figure>
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
      className={`cursor-pointer border px-4 py-2.5 font-mono text-[0.72rem] uppercase tracking-[0.11em] transition-colors duration-200 ${
        pressed
          ? "border-ink bg-ink text-paper"
          : "border-rule text-ink-muted hover:border-ink hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}
