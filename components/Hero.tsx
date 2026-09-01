import ThermalField from "@/components/ThermalField";
import { EDUCATION, SITE } from "@/lib/content";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[92svh] flex-col justify-between overflow-hidden"
    >
      {/* ambience only -- the data itself is evidence, and it lives in the work section */}
      <ThermalField />

      <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-5 pt-28 pb-12 sm:px-8">
        <h1 className="display max-w-[14ch] text-[clamp(2.75rem,10vw,7rem)]">
          Hi, my name is <span className="text-ember">Isaac</span>.
        </h1>

        <p className="mt-8 max-w-[48ch] text-[clamp(1.05rem,1.9vw,1.4rem)] leading-relaxed text-dim">
          I&rsquo;m a {SITE.role.toLowerCase()} in {SITE.location}, studying computer
          science and data science at Rutgers. I build things that need real data
          &mdash; and when the data doesn&rsquo;t exist yet, I go and collect it.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <a
            href={SITE.resume}
            download
            className="group inline-flex items-center gap-2.5 rounded-full border border-flame/60 bg-flame/15 px-5 py-3 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ember shadow-[0_0_28px_rgba(255,122,47,0.22)] transition-colors duration-200 hover:bg-flame/25"
          >
            Download resume
            <span
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-y-0.5"
            >
              &darr;
            </span>
          </a>
          <a
            href={`mailto:${SITE.email}`}
            className="inline-flex items-center rounded-full border border-[var(--line)] px-5 py-3 font-mono text-[10.5px] uppercase tracking-[0.14em] text-dim transition-colors duration-200 hover:border-[var(--line-strong)] hover:text-ink"
          >
            Get in touch
          </a>
        </div>
      </div>

      <div className="relative border-t border-[var(--line)] bg-ground/40 backdrop-blur-[2px]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <a
            href="#work"
            className="group inline-flex items-center gap-2.5 font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink transition-colors hover:text-ember"
          >
            See the work
            <span
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-y-0.5"
            >
              &darr;
            </span>
          </a>
          <p className="label">
            {SITE.availability} &middot; Rutgers {EDUCATION.dates.replace("Expected ", "")}
          </p>
        </div>
      </div>
    </section>
  );
}
