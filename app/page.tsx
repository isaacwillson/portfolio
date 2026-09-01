import SiteHeader from "@/components/SiteHeader";
import Hero from "@/components/Hero";
import SiteFooter from "@/components/SiteFooter";

/*
  Redesign in progress. Approach, Work, Toolkit and About still carry the old
  dark identity, so they are held back rather than shown half-converted. They
  come back section by section.
*/
export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <Hero />
      </main>
      <SiteFooter />
    </>
  );
}
