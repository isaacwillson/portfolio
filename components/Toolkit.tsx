import Stagger from "@/components/Stagger";
import SectionHeading from "@/components/SectionHeading";
import { TOOLKIT } from "@/lib/content";

/**
 * Deliberately just an inventory, set as ruled rows of running text. How I work
 * is the Approach section and the proof is the Work section; repeating evidence
 * here only made the page say the same thing three times.
 */
export default function Toolkit() {
  return (
    <section id="toolkit" className="px-6 py-24 sm:px-10 sm:py-32">
      <Stagger className="mx-auto max-w-[1180px]">
        <SectionHeading
          index="03"
          eyebrow="Toolkit"
          title="What I reach for."
          lede="No percentages and no star ratings. If you want to know how well I use any of it, the work above is the evidence."
        />

        <dl className="mt-16">
          {TOOLKIT.map((group) => (
            <div
              key={group.group}
              className="stage grid gap-x-10 gap-y-2 border-t border-rule py-5 lg:grid-cols-12"
            >
              <dt className="label lg:col-span-3">{group.group}</dt>
              <dd className="runlist lg:col-span-9">
                {group.items.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </Stagger>
    </section>
  );
}
