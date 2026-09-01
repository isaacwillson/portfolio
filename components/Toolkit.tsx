import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { TOOLKIT } from "@/lib/content";

/**
 * Deliberately just an inventory. "How I work" is the Approach section and the
 * proof is the Work section, so repeating evidence here only made the page say
 * the same thing three times.
 */
export default function Toolkit() {
  return (
    <section
      id="toolkit"
      className="border-t border-[var(--line)] px-5 py-20 sm:px-8 sm:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            eyebrow="Toolkit"
            title="What I reach for."
            lede="No percentages and no star ratings. If you want to know how well I use any of it, the work above is the evidence."
          />
        </Reveal>

        <div className="grid gap-x-12 gap-y-9 sm:grid-cols-2">
          {TOOLKIT.map((group, i) => (
            <Reveal key={group.group} delay={i * 60}>
              <div className="grid gap-3 border-t border-[var(--line)] pt-5 sm:grid-cols-[minmax(0,150px)_minmax(0,1fr)] sm:gap-6">
                <h3 className="label pt-0.5">{group.group}</h3>
                <ul className="flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-[var(--line)] px-3 py-1 font-mono text-[10px] tracking-[0.06em] text-dim"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
