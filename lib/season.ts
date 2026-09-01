/**
 * The real training season: every hour the Pondview pool was open and logged,
 * transcribed from paper sign-in sheets.
 *
 * Source: model/data/processed/hourly.csv in isaacwillson/pondview-forecaster.
 * 29 days, 250 observed hours, 1,589 arrivals, 2026-07-08 to 2026-08-16.
 *
 * Hours missing from a day were never recorded — the pool's posted hours changed
 * partway through the season, and days whose sheet was lost are left out entirely.
 * A recorded zero is kept as a genuine zero-turnout hour, because dropping those
 * would delete the bad-weather signal the model exists to learn.
 */

export type SeasonDay = {
  date: string;
  isWeekend: boolean;
  /** [hour, arrivals] for hours that were actually recorded */
  hours: [number, number][];
};

export const SEASON: SeasonDay[] = [
  { date: "2026-07-08", isWeekend: false, hours: [[10,8],[11,13],[12,14],[13,11],[14,8],[15,9],[16,11],[17,12],[18,12],[19,3]] },
  { date: "2026-07-09", isWeekend: false, hours: [[10,3],[11,1],[12,0],[13,0]] },
  { date: "2026-07-10", isWeekend: false, hours: [[10,2],[11,5],[12,2],[13,6],[14,2],[15,2],[16,2],[17,8],[18,3],[19,1]] },
  { date: "2026-07-11", isWeekend: true,  hours: [[10,3],[11,1],[12,0],[13,4],[14,3],[15,7],[16,4],[17,7],[18,3],[19,0]] },
  { date: "2026-07-12", isWeekend: true,  hours: [[10,11],[11,22],[12,20],[13,22],[14,13],[15,11],[16,12],[17,8],[18,3],[19,2]] },
  { date: "2026-07-13", isWeekend: false, hours: [[10,3],[11,2],[12,11],[13,6],[14,5],[15,7],[16,10],[17,7],[18,7],[19,1]] },
  { date: "2026-07-14", isWeekend: false, hours: [[10,5],[11,10],[12,13],[13,8],[14,6],[15,6],[16,14],[17,16],[18,8],[19,3]] },
  { date: "2026-07-15", isWeekend: false, hours: [[10,11],[11,11],[12,10],[13,7],[14,8],[15,5],[16,7],[17,9],[18,5],[19,2]] },
  { date: "2026-07-19", isWeekend: true,  hours: [[10,5],[11,18],[12,5],[13,8],[14,7],[15,9],[16,6]] },
  { date: "2026-07-20", isWeekend: false, hours: [[10,3],[11,4],[12,9],[13,12],[14,10],[15,7],[16,6],[17,17],[18,7],[19,1]] },
  { date: "2026-07-22", isWeekend: false, hours: [[10,1],[11,3],[12,4],[13,6],[14,8],[15,3],[16,7],[17,12],[18,2],[19,1]] },
  { date: "2026-07-23", isWeekend: false, hours: [[10,2],[11,9],[12,3],[13,14],[14,6],[15,6],[16,7],[17,5],[18,2],[19,1]] },
  { date: "2026-07-24", isWeekend: false, hours: [[10,5],[11,8],[12,6],[13,15],[14,7],[15,5],[16,5],[17,13],[18,6],[19,0]] },
  { date: "2026-07-25", isWeekend: true,  hours: [[10,11],[11,14],[12,9],[13,14],[14,12],[15,13],[16,11],[17,2],[18,4],[19,0]] },
  { date: "2026-07-26", isWeekend: true,  hours: [[10,10],[11,14],[12,14],[13,14],[14,9],[15,14],[16,7],[17,7],[18,4],[19,0]] },
  { date: "2026-07-29", isWeekend: false, hours: [[10,0],[11,0],[12,0],[13,0],[14,1],[15,0],[16,0],[17,2],[18,2],[19,0]] },
  { date: "2026-08-01", isWeekend: true,  hours: [[11,20],[12,10],[13,6],[14,9],[15,6],[16,8],[17,9],[18,2]] },
  { date: "2026-08-02", isWeekend: true,  hours: [[11,1],[12,0],[13,4],[14,5],[15,2],[16,3]] },
  { date: "2026-08-04", isWeekend: false, hours: [[11,12],[12,5],[13,10],[14,5],[15,6],[16,16],[17,12],[18,4]] },
  { date: "2026-08-05", isWeekend: false, hours: [[11,0],[12,0],[13,1],[14,0],[15,1],[16,3]] },
  { date: "2026-08-06", isWeekend: false, hours: [[11,2],[12,0],[13,3],[14,2],[15,6],[16,6],[17,6],[18,5]] },
  { date: "2026-08-07", isWeekend: false, hours: [[11,9],[12,13],[13,6],[14,8],[15,7],[16,3],[17,0]] },
  { date: "2026-08-08", isWeekend: true,  hours: [[11,13],[12,13],[13,18],[14,6],[15,4],[16,4],[17,6],[18,0]] },
  { date: "2026-08-09", isWeekend: true,  hours: [[11,22],[12,5],[13,16],[14,20],[15,9],[16,14],[17,10],[18,0]] },
  { date: "2026-08-10", isWeekend: false, hours: [[11,5],[12,2],[13,4],[14,6],[15,1],[16,2],[17,0],[18,0]] },
  { date: "2026-08-11", isWeekend: false, hours: [[11,6],[12,1],[13,1],[14,7],[15,2],[16,2],[17,0],[18,0]] },
  { date: "2026-08-12", isWeekend: false, hours: [[11,15],[12,13],[13,5],[14,6],[15,4],[16,6],[17,12],[18,3]] },
  { date: "2026-08-15", isWeekend: true,  hours: [[11,18],[12,15],[13,9],[14,6],[15,11],[16,7],[17,7],[18,1]] },
  { date: "2026-08-16", isWeekend: true,  hours: [[11,3],[12,1],[13,1],[14,0],[15,0],[16,0],[17,0],[18,0]] },
];

export const SEASON_STATS = {
  days: 29,
  observedHours: 250,
  arrivals: 1589,
  maxArrivals: 22,
  firstDate: "2026-07-08",
  lastDate: "2026-08-16",
} as const;

/** Formats an ISO date as "Sun Jul 12" without pulling in a date library. */
export function formatDay(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()];
  const month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][m - 1];
  return `${weekday} ${month} ${d}`;
}
