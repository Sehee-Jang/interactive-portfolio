import InPageNav from "@/components/projects/InPageNav";
import WhySection from "@/components/sections/WhySection";
import ProjectsShowcaseSection from "@/components/sections/ProjectsShowcaseSection";
import ImpactSection from "@/components/sections/ImpactSection";
import NextJoySection from "@/components/sections/NextJoySection";

export default async function ProjectsOnePage() {
  return (
    <main className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8'>
      <InPageNav />
      <section id='ch1' className='scroll-mt-24'>
        <WhySection />
      </section>
      <section id='ch2' className='scroll-mt-24'>
        <ProjectsShowcaseSection />
      </section>
      <section id='ch3' className='scroll-mt-24'>
        <ImpactSection />
      </section>
      <section id='ch4' className='scroll-mt-24'>
        <NextJoySection />
      </section>
    </main>
  );
}
