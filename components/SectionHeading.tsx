/**
 * One heading treatment for every section, so the page has a predictable rhythm
 * instead of five different ideas about what a section looks like.
 */
export default function SectionHeading({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
}) {
  return (
    <div className="mb-14 sm:mb-16">
      <p className="act mb-4">{eyebrow}</p>
      <h2 className="display max-w-[16ch] text-[clamp(1.9rem,4.6vw,3.1rem)]">
        {title}
      </h2>
      {lede ? (
        <p className="mt-5 max-w-[58ch] text-[16px] leading-relaxed text-dim">
          {lede}
        </p>
      ) : null}
    </div>
  );
}
