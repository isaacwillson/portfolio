import { readFile } from "node:fs/promises";
import { ImageResponse } from "next/og";
import { SEASON } from "@/lib/season";
import { SITE } from "@/lib/content";

/*
  The share card is rendered, not screenshotted: same paper ground, same rust
  accent, same Fraunces, and the same figure the hero is built from. Satori
  (which powers next/og) cannot read the woff2 next/font ships, so the two faces
  are loaded here as TTFs from app/og.
*/

export const alt = "Isaac Willson — software engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PAPER = "#FAF6F0";
const INK = "#1F1B17";
const INK_MUTED = "#6B6055";
const RULE = "#DDD5C9";
const RUST = "#A54A24";

const HOURS = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
const MAX = 22;

/** The plot, as an SVG string so it can be dropped in as an <img>. */
function plotSvg(): string {
  const W = 440;
  const H = 300;
  const L = 8;
  const R = W - 8;
  const T = 10;
  const B = H - 26;
  const x = (i: number) => L + ((R - L) * i) / (HOURS.length - 1);
  const y = (v: number) => B - ((B - T) * v) / MAX;

  const line = (pts: [number, number][]) =>
    pts.map(([i, v], k) => `${k ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");

  const dayLines = SEASON.map((day) => {
    const pts = day.hours
      .map(([h, a]) => [HOURS.indexOf(h), a] as [number, number])
      .filter(([i]) => i !== -1);
    return `<path d="${line(pts)}" fill="none" stroke="${
      day.isWeekend ? RUST : INK
    }" stroke-opacity="${day.isWeekend ? 0.22 : 0.14}" stroke-width="1"/>`;
  }).join("");

  const mean = (weekend: boolean): [number, number][] =>
    HOURS.map((hour, i) => {
      const vals: number[] = [];
      SEASON.forEach((d) => {
        if (d.isWeekend !== weekend) return;
        d.hours.forEach(([h, a]) => h === hour && vals.push(a));
      });
      return [i, vals.length ? vals.reduce((s, v) => s + v, 0) / vals.length : 0] as [number, number];
    }).filter((_, i) => {
      const hour = HOURS[i];
      return SEASON.some((d) => d.isWeekend === weekend && d.hours.some(([h]) => h === hour));
    });

  const grid = [0, 10, 20]
    .map((v) => `<line x1="${L}" x2="${R}" y1="${y(v)}" y2="${y(v)}" stroke="${RULE}" stroke-width="1"/>`)
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
    ${grid}
    ${dayLines}
    <path d="${line(mean(false))}" fill="none" stroke="${INK}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="${line(mean(true))}" fill="none" stroke="${RUST}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
    <line x1="${L}" x2="${R}" y1="${B}" y2="${B}" stroke="${INK}" stroke-width="1"/>
  </svg>`;
}

export default async function Image() {
  // readFile, not fetch: fetching a file: URL is unimplemented during the
  // static build. A URL relative to this module is traced and bundled by
  // Turbopack, so the fonts ship with the route.
  const [fraunces, mono] = await Promise.all([
    readFile(new URL("./og/fraunces-600.ttf", import.meta.url)),
    readFile(new URL("./og/plexmono-500.ttf", import.meta.url)),
  ]);

  const plot = `data:image/svg+xml,${encodeURIComponent(plotSvg())}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: PAPER,
          color: INK,
          fontFamily: "Fraunces",
          padding: "68px 72px",
          justifyContent: "space-between",
        }}
      >
        {/* eyebrow */}
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "Plex", fontSize: 21, letterSpacing: 2, textTransform: "uppercase", color: INK_MUTED }}>
          <span>Isaac Willson</span>
          <span>Portfolio</span>
        </div>

        {/* body: headline left, figure right. Three narrow lines keep the type
            clear of the plot; two lines overran into it. */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 34 }}>
          <div style={{ display: "flex", flexDirection: "column", width: 540 }}>
            <div style={{ display: "flex", fontSize: 70, lineHeight: 1.08, letterSpacing: -1.6, color: INK }}>
              I build things
            </div>
            <div style={{ display: "flex", fontSize: 70, lineHeight: 1.08, letterSpacing: -1.6, color: INK }}>
              that need
            </div>
            <div style={{ display: "flex", fontSize: 70, lineHeight: 1.08, letterSpacing: -1.6 }}>
              <span style={{ color: RUST }}>real data</span>
              <span style={{ color: INK }}>.</span>
            </div>
            <div style={{ display: "flex", fontFamily: "Plex", fontSize: 23, lineHeight: 1.5, color: INK_MUTED, marginTop: 30, width: 520 }}>
              Software engineer at Rutgers. When the data doesn&rsquo;t exist yet, I go and collect it.
            </div>
          </div>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={plot} width={440} height={300} alt="" style={{ marginTop: 6 }} />
        </div>

        {/* footer rule + caption */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", height: 1, background: INK, width: "100%" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "Plex", fontSize: 19, letterSpacing: 1, color: INK_MUTED, marginTop: 18 }}>
            <span>Mean pool arrivals per hour · 29 days, transcribed by hand</span>
            <span style={{ color: INK }}>{SITE.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Fraunces", data: fraunces, weight: 600, style: "normal" },
        { name: "Plex", data: mono, weight: 500, style: "normal" },
      ],
    }
  );
}
