import SiteHeader from "@/components/SiteHeader";
import Hero from "@/components/Hero";
import Approach from "@/components/Approach";
import Work from "@/components/Work";
import Toolkit from "@/components/Toolkit";
import About from "@/components/About";
import SiteFooter from "@/components/SiteFooter";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <Hero />
        <Approach />
        <Work />
        <Toolkit />
        <About />
      </main>
      <SiteFooter />
    </>
  );
}
