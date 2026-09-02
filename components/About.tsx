import Image from "next/image";
import Stagger from "@/components/Stagger";
import SectionHeading from "@/components/SectionHeading";
import { ABOUT, EDUCATION, EXPERIENCE, SITE } from "@/lib/content";

/*
  Portrait stays small and stays down here: the work should introduce you first.
  Source file is 399x397, which covers this slot on a 2x display with room to
  spare. If it ever renders larger, swap in a bigger original.
*/
const PORTRAIT_SRC = "/portrait.jpg";

export default function About() {
  return (
    <section id="about" className="px-6 py-24 sm:px-10 sm:py-32">
      <Stagger className="mx-auto max-w-[1180px]">
        <SectionHeading index="04" eyebrow="About" title="Who is doing all this." />

        {/*
          Three columns rather than two: portrait, the bio, and a pull quote in
          the outer third. The old layout left that outer third empty and the
          section read as a stranded paragraph.
        */}
        <div className="mt-16 grid gap-x-10 gap-y-12 lg:grid-cols-12">
          <div className="stage lg:col-span-3">
            <Image
              src={PORTRAIT_SRC}
              alt={SITE.name}
              width={150}
              height={150}
              className="h-[150px] w-[150px] object-cover"
            />
            <dl className="mt-6 flex flex-col gap-3 border-t border-rule pt-4">
              <div>
                <dt className="label">Based in</dt>
                <dd className="mt-1 text-[0.95rem]">{SITE.city}</dd>
              </div>
              <div>
                <dt className="label">Reachable at</dt>
                <dd className="mt-1">
                  <a href={`mailto:${SITE.email}`} className="link-arrow text-[0.7rem]">
                    {SITE.email}
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          <div className="stage flex flex-col gap-5 lg:col-span-6">
            {ABOUT.map((paragraph) => (
              <p
                key={paragraph.slice(0, 32)}
                className="max-w-[60ch] text-[1.08rem] leading-[1.65] text-ink-muted"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <blockquote className="stage border-t border-ink pt-5 lg:col-span-3">
            <p className="display text-[1.55rem] italic leading-[1.24] text-rust">
              There was nobody else to check the work.
            </p>
            <footer className="label mt-5">On learning it alone</footer>
          </blockquote>
        </div>
      </Stagger>
    </section>
  );
}

export function AboutRecord() {
  return (
    <section className="px-6 pb-24 sm:px-10 sm:pb-32">
      <Stagger className="mx-auto max-w-[1180px]">
        <div className="grid gap-x-10 gap-y-12 lg:grid-cols-12">
          <div className="stage lg:col-span-6">
            <h3 className="label mb-6 border-b border-rule pb-3">Education</h3>
            <p className="display text-[1.3rem]">{EDUCATION.school}</p>
            <p className="mt-2 text-[1rem] text-ink-muted">{EDUCATION.degree}</p>
            <p className="label mt-3">
              {EDUCATION.detail} · {EDUCATION.dates}
            </p>
            <p className="runlist mt-5 border-t border-rule pt-3">
              {EDUCATION.coursework.map((course) => (
                <span key={course}>{course}</span>
              ))}
            </p>
          </div>

          <div className="stage lg:col-span-6">
            <h3 className="label mb-6 border-b border-rule pb-3">Experience</h3>
            <div className="flex flex-col gap-8">
              {EXPERIENCE.map((job) => (
                <div key={job.org}>
                  <p className="display text-[1.3rem]">{job.role}</p>
                  <p className="label mt-2">
                    {job.org} · {job.place} · {job.dates}
                  </p>
                  <p className="mt-3 max-w-[46ch] text-[0.98rem] leading-[1.6] text-ink-muted">
                    {job.note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="stage mt-16 flex flex-wrap items-center gap-x-10 gap-y-4 border-t border-ink pt-6">
          <a href={SITE.resume} download className="btn-outline inline-block">
            Download résumé
          </a>
          <a
            href={SITE.github}
            target="_blank"
            rel="noreferrer"
            className="link-arrow inline-flex items-center gap-2"
          >
            GitHub <span className="arrow">→</span>
          </a>
          <a
            href={SITE.linkedin}
            target="_blank"
            rel="noreferrer"
            className="link-arrow inline-flex items-center gap-2"
          >
            LinkedIn <span className="arrow">→</span>
          </a>
        </div>
      </Stagger>
    </section>
  );
}
