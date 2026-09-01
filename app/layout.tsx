import type { Metadata } from "next";
import { Archivo, Inter, Geist_Mono } from "next/font/google";
import { SITE } from "@/lib/content";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: `${SITE.name} — ${SITE.role}`,
  description:
    "I transcribed a summer of paper pool sign-in sheets into 250 observed hours, trained a forecaster on them, and shipped it. Try the model on the homepage.",
  openGraph: {
    title: `${SITE.name} — ${SITE.role}`,
    description:
      "A summer of paper sign-in sheets, turned into a deployed model you can play with.",
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
    <html lang="en">
      <body
        className={`${archivo.variable} ${inter.variable} ${geistMono.variable} antialiased`}
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-panel focus:px-4 focus:py-2 focus:text-sm"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
