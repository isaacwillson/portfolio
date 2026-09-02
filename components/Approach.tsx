import Stagger from "@/components/Stagger";
import SectionHeading from "@/components/SectionHeading";
import { PILLARS } from "@/lib/content";

export default function Approach() {
  return (
    <section id="approach" className="px-6 py-24 sm:px-10 sm:py-32">
      <Stagger className="mx-auto max-w-[1180px]">
        <SectionHeading
          index="01"
          eyebrow="How I work"
          title="I finish things, and I show my working."
          lede="Most of what I know came from picking a problem in front of me and refusing to stop before it was deployed and someone was using it. Three habits came out of that."
        />

        <ol className="mt-20 grid gap-x-10 gap-y-14 lg:grid-cols-3">
          {PILLARS.map((pillar, i) => (
            <li key={pillar.title} className="stage rule-top pt-6">
              <p className="label mb-5">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="display text-[1.45rem]">{pillar.title}</h3>
              <p className="mt-4 text-[1rem] leading-[1.62] text-ink-muted">
                {pillar.body}
              </p>
              <p className="mt-6 border-t border-rule pt-3 font-mono text-[0.7rem] uppercase leading-[1.7] tracking-[0.1em] text-ink-muted">
                {pillar.evidence}
              </p>
            </li>
          ))}
        </ol>
      </Stagger>
    </section>
  );
}
