/**
 * Arrivals encoded as ink density, the way a printed figure would do it.
 *
 * One hue, light to dark. A single-hue sequential ramp is the honest choice for
 * a quantity that only goes up, and it keeps the whole site on one accent
 * instead of smuggling a second palette in through the charts.
 */

const STOPS = [
  "#E9D3BF", // barely inked
  "#DCB394",
  "#CB8B60",
  "#B96A3B",
  "#A54A24", // the accent itself
  "#7E3419", // deepest
];

/** Open, logged, and nobody came. Present on the page, but only just. */
export const ZERO_COLOR = "#EDE6DB";

function hex(c: string): [number, number, number] {
  return [
    parseInt(c.slice(1, 3), 16),
    parseInt(c.slice(3, 5), 16),
    parseInt(c.slice(5, 7), 16),
  ];
}

const RGB = STOPS.map(hex);

export function ramp(t: number): string {
  const clamped = Math.max(0, Math.min(1, t));
  const f = clamped * (RGB.length - 1);
  const i = Math.min(RGB.length - 2, Math.floor(f));
  const k = f - i;
  const a = RGB[i];
  const b = RGB[i + 1];
  return `rgb(${Math.round(a[0] + (b[0] - a[0]) * k)}, ${Math.round(
    a[1] + (b[1] - a[1]) * k
  )}, ${Math.round(a[2] + (b[2] - a[2]) * k)})`;
}

/**
 * Most hours sit in the single digits, so a linear scale would leave the whole
 * season looking blank. A mild power curve spends more of the ramp where the
 * data actually lives.
 */
export function arrivalRamp(value: number, max: number): number {
  return Math.pow(Math.min(1, value / max), 0.6);
}

export function arrivalColor(value: number, max: number): string {
  if (value === 0) return ZERO_COLOR;
  return ramp(arrivalRamp(value, max));
}

export function rampSwatches(n = 6): string[] {
  return Array.from({ length: n }, (_, i) => ramp(i / (n - 1)));
}
