import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { PILLARS } from "@/lib/content";

export default function Approach() {
  return (
    <section
      id="approach"
      className="border-t border-[var(--line)] px-5 py-20 sm:px-8 sm:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            eyebrow="How I work"
            title="I finish things, and I show my working."
            lede="Most of what I know came from picking a problem in front of me and refusing to stop before it was deployed and someone was using it. Three habits came out of that."
          />
        </Reveal>

        <div className="grid gap-10 md:grid-cols-3 md:gap-8">
          {PILLARS.map((pillar, i) => (
            <Reveal key={pillar.title} delay={i * 70}>
              <div className="border-t border-[var(--line)] pt-6">
                <h3 className="font-display text-[1.15rem] font-bold tracking-[-0.03em]">
                  {pillar.title}
                </h3>
                <p className="mt-3 text-[14.5px] leading-relaxed text-dim">
                  {pillar.body}
                </p>
                <p className="mt-4 font-mono text-[10px] uppercase leading-[1.7] tracking-[0.1em] text-muted">
                  {pillar.evidence}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
