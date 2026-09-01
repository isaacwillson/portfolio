import HeroPlot from "@/components/HeroPlot";
import { EDUCATION, SITE } from "@/lib/content";

export default function Hero() {
  return (
    <section id="top" className="px-6 pb-16 pt-28 sm:px-10 sm:pb-24 sm:pt-36">
      <div className="mx-auto max-w-[1180px]">
        {/* asymmetric: the headline holds the left seven columns, the figure the right five */}
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7 lg:pt-6">
            <p className="label mb-8">
              {SITE.name} — {SITE.city}
            </p>

            <h1 className="display text-[clamp(2.9rem,7.4vw,5.5rem)]">
              Hi, my name is{" "}
              <span className="display-wonk italic text-rust">Isaac</span>.
            </h1>

            <p className="mt-9 max-w-[38ch] text-[1.1rem] leading-[1.62] text-ink-muted">
              I&rsquo;m a {SITE.role.toLowerCase()} studying computer science and data
              science at Rutgers. I build things that need real data — and when the
              data doesn&rsquo;t exist yet, I go and collect it.
            </p>

            <div className="mt-11 flex flex-wrap items-center gap-x-8 gap-y-4">
              <a href={SITE.resume} download className="btn-outline inline-block">
                Download résumé
              </a>
              <a href="#work" className="link-arrow inline-flex items-center gap-2">
                See the work <span className="arrow">→</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-5">
            <HeroPlot />
          </div>
        </div>

        {/* the figure's caption doubles as the hero's footer rule */}
        <div className="rule-section mt-16 grid gap-6 pt-5 sm:grid-cols-2 lg:grid-cols-4">
          <Meta label="Available" value={SITE.availability} />
          <Meta label="Studying" value="CS + Data Science, Rutgers" />
          <Meta label="Graduating" value={EDUCATION.dates.replace("Expected ", "")} />
          <Meta label="Figure 1" value="250 hours, transcribed by hand" />
        </div>
      </div>
    </section>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="label">{label}</p>
      <p className="mt-1.5 text-[0.95rem] text-ink">{value}</p>
    </div>
  );
}
