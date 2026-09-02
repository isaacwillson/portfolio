import Stagger from "@/components/Stagger";
import SectionHeading from "@/components/SectionHeading";
import SeasonGrid from "@/components/SeasonGrid";
import WhatIf from "@/components/WhatIf";
import { PROJECTS, type Project } from "@/lib/content";
import { MODEL } from "@/lib/model";
import { SEASON_STATS } from "@/lib/season";

export default function Work() {
  const [featured, ...rest] = PROJECTS;

  return (
    <section id="work" className="px-6 py-24 sm:px-10 sm:py-32">
      <Stagger className="mx-auto max-w-[1180px]">
        <SectionHeading
          index="02"
          eyebrow="Selected work"
          title="Three things I shipped."
          lede="Everything here is deployed and the source is public. The first one you can run without leaving this page."
        />
      </Stagger>

      <Stagger className="mx-auto mt-20 max-w-[1180px]">
        <FeaturedProject project={featured} />
      </Stagger>

      <div className="mx-auto max-w-[1180px]">
        {rest.map((project) => (
          <Stagger key={project.slug} className="mt-24 sm:mt-28">
            <ProjectEntry project={project} />
          </Stagger>
        ))}
      </div>
    </section>
  );
}

/** The one project deep enough to walk through in full. */
function FeaturedProject({ project }: { project: Project }) {
  return (
    <article>
      <ProjectHead project={project} />

      <div className="mt-14 grid gap-x-10 gap-y-8 lg:grid-cols-12">
        <p className="label stage lg:col-span-3">Try it</p>
        <div className="stage lg:col-span-9">
          <WhatIf />
          <p className="mt-8 max-w-[62ch] border-l border-rust pl-4 font-mono text-[0.7rem] leading-[1.9] text-ink-muted">
            A ridge approximation of the deployed model, fit on the same 250 hours.
            MAE {MODEL.mae.toFixed(2)}/hr against the deployed model&rsquo;s{" "}
            {MODEL.deployedMae} under leave-one-day-out CV. Close, but not the same
            thing, so this page says so rather than pretending.
          </p>
        </div>
      </div>

      <div className="mt-20 grid gap-x-10 gap-y-8 lg:grid-cols-12">
        <p className="label stage lg:col-span-3">The data behind it</p>
        <div className="stage lg:col-span-9">
          <p className="mb-10 max-w-[68ch] text-[1.05rem] leading-[1.62] text-ink-muted">
            The pool recorded arrivals on paper and nothing else — no database, no
            counter, no export. Inked squares were recorded, the palest are hours the
            pool was open and{" "}
            <strong className="font-medium text-ink">nobody came</strong>, and empty
            outlines were never logged. Keeping those zeros is the whole point: they
            are where the bad-weather signal lives.
          </p>
          <SeasonGrid />
        </div>
      </div>

      <dl className="stage mt-16 grid grid-cols-2 gap-x-10 gap-y-8 border-t border-ink pt-6 sm:grid-cols-4">
        <Stat value={SEASON_STATS.days.toString()} label="Days observed" />
        <Stat value={SEASON_STATS.observedHours.toString()} label="Hours transcribed" />
        <Stat
          value={SEASON_STATS.arrivals.toLocaleString("en-US")}
          label="Arrivals logged"
        />
        <Stat value="23%" label="Below baseline MAE" accent />
      </dl>

      <ProjectFoot project={project} />
    </article>
  );
}

function ProjectEntry({ project }: { project: Project }) {
  return (
    <article>
      <ProjectHead project={project} />
      <div className="mt-10 grid gap-x-10 gap-y-8 lg:grid-cols-12">
        <dl className="stage flex flex-col gap-6 lg:col-span-3">
          {project.metrics.map((metric) => (
            <div key={metric.label}>
              <dd className="numeral text-[1.9rem] leading-none text-rust">
                {metric.value}
              </dd>
              <dt className="label mt-2">{metric.label}</dt>
            </div>
          ))}
        </dl>

        <div className="stage lg:col-span-9">
          <div className="flex flex-col gap-4">
            {project.body.map((paragraph) => (
              <p
                key={paragraph.slice(0, 32)}
                className="max-w-[68ch] text-[1.05rem] leading-[1.62] text-ink-muted"
              >
                {paragraph}
              </p>
            ))}
          </div>
          <ProjectFoot project={project} />
        </div>
      </div>
    </article>
  );
}

function ProjectHead({ project }: { project: Project }) {
  return (
    <div className="rule-section grid gap-x-10 gap-y-4 pt-5 lg:grid-cols-12">
      <p className="label stage lg:col-span-3">{project.period}</p>
      <div className="lg:col-span-9">
        <h3 className="display stage text-[clamp(1.7rem,3.6vw,2.6rem)]">
          {project.name}
        </h3>
        <p className="stage mt-3 max-w-[52ch] text-[1.05rem] leading-[1.55] text-ink-muted">
          {project.tagline}
        </p>
      </div>
    </div>
  );
}

function ProjectFoot({ project }: { project: Project }) {
  return (
    <div className="stage mt-10 flex flex-wrap items-baseline justify-between gap-x-10 gap-y-5 border-t border-rule pt-4">
      {/* a running mono line, not a row of pills */}
      <p className="runlist max-w-[60ch]">
        {project.stack.map((tech) => (
          <span key={tech}>{tech}</span>
        ))}
      </p>
      <div className="flex flex-wrap gap-x-8 gap-y-3">
        {project.links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="link-arrow inline-flex items-center gap-2"
          >
            {link.label} <span className="arrow">→</span>
          </a>
        ))}
      </div>
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
        className={`numeral text-[clamp(1.6rem,3vw,2.1rem)] leading-none ${
          accent ? "text-rust" : ""
        }`}
      >
        {value}
      </dd>
      <dt className="label mt-2.5">{label}</dt>
    </div>
  );
}
