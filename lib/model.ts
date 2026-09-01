/**
 * A ridge approximation of the deployed Pondview forecaster, small enough to run
 * in the browser so the hero can answer immediately.
 *
 * Fit on the same 250 observed hours as the real model (29 days, 2026-07-08 to
 * 2026-08-16). Separate hour profiles for weekdays and weekends, plus temperature,
 * a squared temperature term, and a rain indicator.
 *
 * In-sample MAE 3.00 arrivals/hour. The deployed gradient-boosting model scores
 * 2.97 under leave-one-day-out cross-validation, so this is close but not the same
 * thing — the page says so rather than implying the real model runs client-side.
 *
 * To refit: see model/train.py in isaacwillson/pondview-forecaster.
 */

export const HOURS = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19] as const;

export const MODEL = {
  // arrivals/hour at the seasonal mean temperature, dry
  weekdayBase: [4.343, 6.804, 6.548, 6.28, 4.628, 4.797, 6.471, 9.115, 4.941, 1.823],
  weekendBase: [8.466, 12.75, 8.591, 10.181, 8.624, 8.241, 7.062, 6.19, 2.263, 1.748],
  temp: 1.8042,
  temp2: 1.1072,
  rain: -4.0611,
  tempMean: 77.7,
  tempScale: 10,
  /** observed temperature range in the training data — outside this we are extrapolating */
  observedMin: 67,
  observedMax: 90.2,
  mae: 3.0,
  deployedMae: 2.97,
} as const;

/** Slider bounds, deliberately wider than the observed range so extrapolation is reachable. */
export const TEMP_MIN = 60;
export const TEMP_MAX = 98;

/** Upper bound used to scale the bars, a little above the hottest weekend prediction. */
export const SCALE_MAX = 18;

export type Conditions = {
  temperature: number;
  isWeekend: boolean;
  isRaining: boolean;
};

/** Predicted family arrivals for each open hour, 10AM through 7PM. */
export function predict({ temperature, isWeekend, isRaining }: Conditions): number[] {
  const z = (temperature - MODEL.tempMean) / MODEL.tempScale;
  const base = isWeekend ? MODEL.weekendBase : MODEL.weekdayBase;
  const adjust = MODEL.temp * z + MODEL.temp2 * z * z + (isRaining ? MODEL.rain : 0);
  return base.map((b) => Math.max(0, b + adjust));
}

export function isExtrapolating(temperature: number): boolean {
  return temperature < MODEL.observedMin || temperature > MODEL.observedMax;
}

export function busiestHour(values: number[]): number {
  let best = 0;
  values.forEach((v, i) => {
    if (v > values[best]) best = i;
  });
  return HOURS[best];
}

export function formatHour(hour: number): string {
  const h = hour % 12 === 0 ? 12 : hour % 12;
  return `${h}${hour < 12 ? "AM" : "PM"}`;
}
