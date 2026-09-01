import { SITE } from "@/lib/content";

export default function SiteFooter() {
  return (
    <footer className="border-t border-rule px-6 py-8 sm:px-10">
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-baseline justify-between gap-4">
        <p className="label">
          {SITE.name} — {SITE.city}
        </p>
        <p className="label">Set in Fraunces, Alegreya Sans and IBM Plex Mono</p>
      </div>
    </footer>
  );
}
