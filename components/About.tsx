import Image from "next/image";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { ABOUT, EDUCATION, EXPERIENCE, SITE } from "@/lib/content";

/*
  Kept small and down here rather than in the hero: the work should introduce you
  first. The source file is 399x397, which covers the 132px slot on a 2x display
  with room to spare -- if this ever gets rendered larger, replace it with a
  bigger original rather than scaling this one up.
*/
const PORTRAIT_SRC = "/portrait.jpg";

export default function About() {
  return (
    <section
      id="about"
      className="border-t border-[var(--line)] px-5 py-20 sm:px-8 sm:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading eyebrow="About" title="Who is doing all this." />
        </Reveal>

        <Reveal>
          <div className="grid gap-8 md:grid-cols-[auto_minmax(0,1fr)] md:gap-12">
            <Image
              src={PORTRAIT_SRC}
              alt={SITE.name}
              width={132}
              height={132}
              className="h-[132px] w-[132px] rounded-xl border border-[var(--line)] object-cover"
            />
            <div className="flex max-w-[62ch] flex-col gap-3.5">
              {ABOUT.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 32)}
                  className="text-[15.5px] leading-relaxed text-dim"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={70}>
          <div className="mt-14 grid gap-10 border-t border-[var(--line)] pt-9 md:grid-cols-2 md:gap-14">
            <div>
              <h3 className="act mb-5">Education</h3>
              <p className="font-display text-[1.05rem] font-bold tracking-[-0.025em]">
                {EDUCATION.school}
              </p>
              <p className="mt-1.5 text-[14.5px] text-dim">{EDUCATION.degree}</p>
              <p className="label mt-2">
                {EDUCATION.detail} &middot; {EDUCATION.dates}
              </p>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {EDUCATION.coursework.map((course) => (
                  <li
                    key={course}
                    className="rounded-full border border-[var(--line)] px-3 py-1 font-mono text-[10px] tracking-[0.06em] text-muted"
                  >
                    {course}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="act mb-5">Experience</h3>
              <div className="flex flex-col gap-6">
                {EXPERIENCE.map((job) => (
                  <div key={job.org}>
                    <p className="font-display text-[1.05rem] font-bold tracking-[-0.025em]">
                      {job.role}
                    </p>
                    <p className="label mt-1.5">
                      {job.org} &middot; {job.place} &middot; {job.dates}
                    </p>
                    <p className="mt-2 max-w-[46ch] text-[14px] leading-relaxed text-dim">
                      {job.note}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={110}>
          <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-[var(--line)] pt-8">
            <a
              href={`mailto:${SITE.email}`}
              className="group inline-flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink transition-colors hover:text-ember"
            >
              {SITE.email}
              <span
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              >
                &rarr;
              </span>
            </a>
            <a
              href={SITE.resume}
              download
              className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted transition-colors hover:text-ink"
            >
              Resume
            </a>
            <a
              href={SITE.github}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted transition-colors hover:text-ink"
            >
              GitHub
            </a>
            <a
              href={SITE.linkedin}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted transition-colors hover:text-ink"
            >
              LinkedIn
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
