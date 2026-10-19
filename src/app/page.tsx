import { SiteHeader } from "@/components/sections/site-header";
import { FilmStage } from "@/components/film/film-stage";
import { Intro } from "@/components/sections/intro";
import { Proof } from "@/components/sections/proof";
import { SelectedWork } from "@/components/sections/selected-work";
import { Experience } from "@/components/sections/experience";
import { Projects } from "@/components/sections/projects";
import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { SiteFooter } from "@/components/sections/site-footer";

// The film carries the feeling at the top; plain sections below carry the proof.
export default function Home() {
  return (
    <>
      <SiteHeader />
      <FilmStage />
      <main id="main" tabIndex={-1}>
        <Intro />
        <Proof />
        <SelectedWork />
        <Experience />
        <Projects />
        <About />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
