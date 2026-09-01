import { SITE } from "@/lib/content";

export default function SiteFooter() {
  return (
    <footer className="border-t border-[var(--line)] px-5 py-9 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
        <p className="label">
          {SITE.name} &middot; {SITE.location}
        </p>
        <p className="label">
          Built with Next.js. Weather data from Open-Meteo.
        </p>
      </div>
    </footer>
  );
}
