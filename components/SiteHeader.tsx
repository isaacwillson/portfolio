import { SITE } from "@/lib/content";

const NAV = [
  { label: "Approach", href: "#approach" },
  { label: "Work", href: "#work" },
  { label: "Toolkit", href: "#toolkit" },
  { label: "About", href: "#about" },
];

export default function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-rule bg-paper/92 backdrop-blur-[2px]">
      <div className="mx-auto flex max-w-[1180px] items-baseline justify-between gap-6 px-6 py-4 sm:px-10">
        <a
          href="#top"
          className="font-display text-[1.05rem] font-medium tracking-[-0.02em] transition-colors hover:text-rust"
        >
          {SITE.name}
        </a>

        <nav aria-label="Sections" className="hidden gap-8 md:flex">
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

        {/* plain ruled label, no dot, no glow */}
        <p className="label border border-rule px-2.5 py-1">{SITE.availability}</p>
      </div>
    </header>
  );
}
