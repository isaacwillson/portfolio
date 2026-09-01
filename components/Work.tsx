import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import SeasonGrid from "@/components/SeasonGrid";
import WhatIf from "@/components/WhatIf";
import { PROJECTS, type Project } from "@/lib/content";
import { MODEL } from "@/lib/model";
import { SEASON_STATS } from "@/lib/season";

export default function Work() {
  const [featured, ...rest] = PROJECTS;

  return (
    <section
      id="work"
      className="border-t border-[var(--line)] px-5 py-20 sm:px-8 sm:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            eyebrow="Selected work"
            title="Three things I shipped."
            lede="Everything here is deployed, and the source is public. The first one you can try without leaving this page."
          />
        </Reveal>

        <Reveal>
          <FeaturedProject project={featured} />
        </Reveal>

        <div className="mt-24 flex flex-col gap-20 sm:mt-28 sm:gap-24">
          {rest.map((project, i) => (
            <Reveal key={project.slug} delay={i * 70}>
              <ProjectEntry project={project} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/** The one project deep enough to be worth walking through in full. */
function FeaturedProject({ project }: { project: Project }) {
  return (
    <article className="rounded-2xl border border-[var(--line)] bg-panel/40 p-6 sm:p-9">
      <ProjectHeader project={project} />

      <div className="mt-7 grid gap-3.5 md:max-w-[74ch]">
        {project.body.map((paragraph) => (
          <p
            key={paragraph.slice(0, 32)}
            className="text-[15px] leading-relaxed text-dim"
          >
            {paragraph}
          </p>
        ))}
      </div>

      <SubHeading
        title="Try the model"
        note="Drag the temperature, turn on rain, flip it to a weekend."
      />
      <WhatIf />
      <p className="mt-8 max-w-[62ch] border-l-2 border-flame/60 py-1 pl-4 font-mono text-[10px] leading-[1.9] tracking-[0.06em] text-muted">
        A ridge approximation of the deployed model, fit on the same 250 hours.
        MAE {MODEL.mae.toFixed(2)}/hr against the deployed model&rsquo;s{" "}
        {MODEL.deployedMae} under leave-one-day-out CV. Close, but not the same
        thing, so this page says so rather than pretending.
      </p>

      <SubHeading
        title="The data behind it"
        note="Every square is one hour the pool was open."
      />
      <p className="mb-7 max-w-[70ch] text-[15px] leading-relaxed text-dim">
        The pool recorded arrivals on paper and nothing else &mdash; no database, no
        counter, no export. Lit squares were recorded, dark squares are hours the
        pool was open and{" "}
        <strong className="font-medium text-ink">nobody came</strong>, and empty
        outlines were never logged. Keeping those zeros is the whole point: they are
        where the bad-weather signal lives.
      </p>
      <SeasonGrid />

      <dl className="mt-9 grid grid-cols-2 gap-6 border-t border-[var(--line)] pt-7 sm:grid-cols-4">
        <Stat value={SEASON_STATS.days.toString()} label="Days observed" />
        <Stat value={SEASON_STATS.observedHours.toString()} label="Hours transcribed" />
        <Stat
          value={SEASON_STATS.arrivals.toLocaleString("en-US")}
          label="Arrivals logged"
        />
        <Stat value="23.2%" label="Better than baseline" accent />
      </dl>

      <ProjectFooter project={project} />
    </article>
  );
}

function ProjectEntry({ project }: { project: Project }) {
  return (
    <article className="grid gap-7 border-t border-[var(--line)] pt-8 md:grid-cols-[minmax(0,0.75fr)_minmax(0,1.6fr)] md:gap-12">
      <ProjectHeader project={project} />
      <div>
        <div className="flex flex-col gap-3.5">
          {project.body.map((paragraph) => (
            <p
              key={paragraph.slice(0, 32)}
              className="max-w-[68ch] text-[15px] leading-relaxed text-dim"
            >
              {paragraph}
            </p>
          ))}
        </div>
        <ProjectFooter project={project} />
      </div>
    </article>
  );
}

function ProjectHeader({ project }: { project: Project }) {
  return (
    <div>
      <p className="label mb-2.5">{project.period}</p>
      <h3 className="font-display text-[clamp(1.5rem,3.2vw,2.25rem)] font-bold tracking-[-0.04em]">
        {project.name}
      </h3>
      <p className="mt-2.5 max-w-[46ch] text-[15px] leading-relaxed text-muted">
        {project.tagline}
      </p>
    </div>
  );
}

function ProjectFooter({ project }: { project: Project }) {
  return (
    <div className="mt-7">
      <ul className="flex flex-wrap gap-1.5">
        {project.stack.map((tech) => (
          <li
            key={tech}
            className="rounded-full border border-[var(--line)] px-3 py-1 font-mono text-[9.5px] uppercase tracking-[0.1em] text-muted"
          >
            {tech}
          </li>
        ))}
      </ul>

      <div className="mt-5 flex flex-wrap gap-5">
        {project.links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.11em] text-ink transition-colors hover:text-ember"
          >
            {link.label}
            <span
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            >
              &rarr;
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

function SubHeading({ title, note }: { title: string; note: string }) {
  return (
    <div className="mb-6 mt-14 flex flex-wrap items-baseline gap-x-4 gap-y-1 border-t border-[var(--line)] pt-7">
      <h4 className="font-display text-[1.05rem] font-bold tracking-[-0.025em]">
        {title}
      </h4>
      <p className="text-[13.5px] text-muted">{note}</p>
    </div>
  );
}

function Stat({
  value,
  label,
  accent = false,
}: {
  value: string;
  label: string;
  accent?: boolean;
}) {
  return (
    <div>
      <dd
        className={`numeral text-[clamp(1.5rem,3vw,2rem)] leading-none ${
          accent ? "text-ember" : ""
        }`}
      >
        {value}
      </dd>
      <dt className="label mt-2">{label}</dt>
    </div>
  );
}
