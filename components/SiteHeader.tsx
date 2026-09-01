import { SITE } from "@/lib/content";

const NAV = [
  { label: "Approach", href: "#approach" },
  { label: "Work", href: "#work" },
  { label: "Toolkit", href: "#toolkit" },
  { label: "About", href: "#about" },
];

export default function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-[var(--line)] bg-ground/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
        <a
          href="#top"
          className="font-display text-sm font-bold tracking-[-0.025em] transition-colors hover:text-ember"
        >
          {SITE.name}
        </a>

        <nav aria-label="Sections" className="hidden gap-7 md:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="label transition-colors hover:text-ink"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <span className="label flex items-center gap-2">
          <span
            className="block h-1.5 w-1.5 rounded-full bg-ember shadow-[0_0_10px_rgba(255,216,77,0.9)]"
            aria-hidden="true"
          />
          {SITE.availability}
        </span>
      </div>
    </header>
  );
}
