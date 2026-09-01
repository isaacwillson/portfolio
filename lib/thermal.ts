/**
 * The one color decision on this site: arrivals are encoded as heat.
 *
 * Deep violet for a dead hour, bright yellow for a packed one, through magenta
 * and orange in between. It is an inferno-style ramp, the same family of
 * colormap you would reach for on any real heat map, which is why it is allowed
 * to be this loud. It is carrying information, not decorating.
 */

const STOPS = [
  "#1A0B3D", // deep violet, a quiet hour
  "#5B21A8", // purple
  "#C0267E", // magenta
  "#F4562F", // vivid orange-red
  "#FF9A1F", // orange
  "#FFD84D", // bright yellow, a packed hour
];

/** An hour that was open and logged, but nobody came. Deliberately near-ground. */
export const ZERO_COLOR = "#181231";

function hex(c: string): [number, number, number] {
  return [
    parseInt(c.slice(1, 3), 16),
    parseInt(c.slice(3, 5), 16),
    parseInt(c.slice(5, 7), 16),
  ];
}

const RGB = STOPS.map(hex);

/** t in [0,1] along the ramp. */
export function thermalRgb(t: number): [number, number, number] {
  const clamped = Math.max(0, Math.min(1, t));
  const f = clamped * (RGB.length - 1);
  const i = Math.min(RGB.length - 2, Math.floor(f));
  const k = f - i;
  const a = RGB[i];
  const b = RGB[i + 1];
  return [
    Math.round(a[0] + (b[0] - a[0]) * k),
    Math.round(a[1] + (b[1] - a[1]) * k),
    Math.round(a[2] + (b[2] - a[2]) * k),
  ];
}

export function thermal(t: number): string {
  const [r, g, b] = thermalRgb(t);
  return "rgb(" + r + ", " + g + ", " + b + ")";
}

/**
 * Arrivals are compressed with a mild power curve. Most hours sit in the single
 * digits, and a linear scale would leave the whole season looking violet.
 */
export function arrivalRamp(value: number, max: number): number {
  return Math.pow(Math.min(1, value / max), 0.6);
}

/** Color for an arrival count. A recorded zero gets its own near-ground tone. */
export function arrivalColor(value: number, max: number): string {
  if (value === 0) return ZERO_COLOR;
  return thermal(arrivalRamp(value, max));
}

/** Evenly spaced swatches, for legends. */
export function rampSwatches(n = 7): string[] {
  return Array.from({ length: n }, (_, i) => thermal(i / (n - 1)));
}
