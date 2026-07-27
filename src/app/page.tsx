import { SiteHeader } from "@/components/sections/site-header";
import { Hero } from "@/components/sections/hero";
import { StatBand } from "@/components/sections/stat-band";
import { About } from "@/components/sections/about";
import { Agentic } from "@/components/sections/agentic";
import { Work } from "@/components/sections/work";
import { Experience } from "@/components/sections/experience";
import { Contact } from "@/components/sections/contact";
import { SiteFooter } from "@/components/sections/site-footer";

export default function Home() {
  return (
    <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
      <SiteHeader />
      <main style={{ position: "relative", zIndex: 1 }}>
        <Hero />
        <StatBand />
        <About />
        <Agentic />
        <Work />
        <Experience />
        <Contact />
        <SiteFooter />
      </main>
    </div>
  );
}
