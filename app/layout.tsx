import type { Metadata } from "next";
import { Fraunces, Alegreya_Sans, IBM_Plex_Mono } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import { SITE } from "@/lib/content";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
});

const alegreyaSans = Alegreya_Sans({
  variable: "--font-alegreya-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: `${SITE.name} — ${SITE.role}`,
  description:
    "I transcribed a summer of paper pool sign-in sheets into 250 observed hours, trained a forecaster on them, and shipped it.",
  openGraph: {
    title: `${SITE.name} — ${SITE.role}`,
    description:
      "A summer of paper sign-in sheets, turned into a deployed model you can try.",
    url: SITE.url,
    siteName: SITE.name,
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    /*
      The font variables go on <html>, not <body>. Tailwind declares its theme
      tokens on :root, and a custom property resolves its var() references
      against the element it is declared on -- so --font-display referencing
      --font-fraunces only works if both live at the same level. On <body> the
      whole chain silently computes to invalid and every face falls back.
    */
    <html
      lang="en"
      className={`${fraunces.variable} ${alegreyaSans.variable} ${plexMono.variable}`}
    >
      <body>
        <SmoothScroll />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:border focus:border-ink focus:bg-paper focus:px-4 focus:py-2"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
