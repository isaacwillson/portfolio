import HeroPlot from "@/components/HeroPlot";
import { SITE } from "@/lib/content";

export default function Hero() {
  return (
    <section id="top" className="px-6 pb-20 pt-28 sm:px-10 sm:pb-28 sm:pt-36">
      <div className="mx-auto max-w-[1180px]">
        {/* asymmetric: the headline holds the left seven columns, the figure the
            right five, centred against it so the plot doesn't strand whitespace
            below itself when the text column runs taller */}
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
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
              science at Rutgers. I build full stack projects with real users. And if the
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
      </div>
    </section>
  );
}
