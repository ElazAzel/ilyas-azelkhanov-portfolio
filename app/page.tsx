import { CinematicHero } from "@/components/motion/CinematicHero";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { ServiceGrid } from "@/components/site/ServiceGrid";
import { Marquee } from "@/components/site/Marquee";
import { CtaBand } from "@/components/site/CtaBand";
import { ProjectPlayground } from "@/components/site/ProjectPlayground";
import { homeCopy } from "@/content/home";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <main className="flex flex-col gap-9 pb-8 lg:gap-10">
        <CinematicHero />

        <Marquee />

        <section
          id="services"
          className="container-page flex scroll-mt-8 flex-col gap-6"
        >
          <div className="section-heading">
            <div>
              <p className="t-label text-slate mb-4">{homeCopy.servicesNote}</p>
              <h2 className="t-display-xl">{homeCopy.services}</h2>
            </div>
            <p className="t-body-l text-slate">{homeCopy.servicesLead}</p>
          </div>
          <ServiceGrid />
        </section>

        <div className="container-page">
          <ProjectPlayground />
        </div>

        <div className="container-page">
          <CtaBand />
        </div>
      </main>
    </>
  );
}
