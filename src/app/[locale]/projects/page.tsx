import { getTranslations } from "next-intl/server";
import InPageNav from "@/components/projects/InPageNav";
import WhySection from "@/components/sections/WhySection";
import ProjectsShowcaseSection from "@/components/sections/ProjectsShowcaseSection";
import ImpactSection from "@/components/sections/ImpactSection";
import { AppLocale } from "@/i18n/routing";
import NextJoySection from "@/components/sections/NextJoySection";

export default async function ProjectsOnePage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  // 프로젝트 별 실제 수치
  const metrics = [
    {
      labelKey: "metricLabels.duplicateBookings",
      before: 50,
      after: 10,
      unitKey: "units.count",
    },
    {
      labelKey: "metricLabels.opsInterventionMinutes",
      before: 120,
      after: 48,
      unitKey: "units.minutes",
    },
  ] as const;

  return (
    <main className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8'>
      {/* 헤더  */}
      <header className='mb-4'>
        <h1 className='text-2xl md:text-3xl font-semibold tracking-tight'>
          {t("projects.title")}
        </h1>
        <p className='mt-2 opacity-80'>{t("projects.subtitle")}</p>
      </header>

      <InPageNav
        sections={[
          { id: "ch1", labelKey: "ch1.title" },
          { id: "ch2", labelKey: "ch2.title" },
          { id: "ch3", labelKey: "ch3.title" },
          { id: "ch4", labelKey: "ch4.title" },
        ]}
      />

      <section id='ch1' className='scroll-mt-24'>
        <WhySection />
      </section>
      <section id='ch2' className='scroll-mt-24'>
        <ProjectsShowcaseSection />
      </section>
      <section id='ch3' className='scroll-mt-24'>
        <ImpactSection metrics={[...metrics]} />
      </section>
      <section id='ch4' className='scroll-mt-24'>
        <NextJoySection />
      </section>
    </main>
  );
}
