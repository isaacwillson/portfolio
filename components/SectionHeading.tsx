/**
 * One heading treatment for every section, so the page keeps a predictable
 * rhythm. The number is the section's place in the argument, not decoration —
 * this site reads in order.
 */
export default function SectionHeading({
  index,
  eyebrow,
  title,
  lede,
}: {
  index: string;
  eyebrow: string;
  title: string;
  lede?: string;
}) {
  return (
    <div className="rule-section grid gap-x-10 gap-y-6 pt-6 lg:grid-cols-12">
      <p className="label stage lg:col-span-3">
        <span className="text-rust">{index}</span>
        <span className="ml-3">{eyebrow}</span>
      </p>

      <div className="lg:col-span-9">
        <h2 className="display stage max-w-[15ch] text-[clamp(1.9rem,4.4vw,3.1rem)]">
          {title}
        </h2>
        {lede ? (
          <p className="stage mt-6 max-w-[54ch] text-[1.05rem] leading-[1.6] text-ink-muted">
            {lede}
          </p>
        ) : null}
      </div>
    </div>
  );
}
