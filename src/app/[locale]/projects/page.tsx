import { getTranslations } from "next-intl/server";
import type { AppLocale } from "@/i18n/routing";
import FullpageClient from "@/components/projects/FullpageClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Project | Sehee Jang Portfolio",
};

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  // 네비게이션 라벨
  const navLabels = [
    t("ch1.nav"),
    t("ch2.nav"),
    t("ch3.nav"),
    t("ch4.nav"),
    t("ch5.nav"),
  ] as const;

  return (
    <main className='relative'>
      <FullpageClient navLabels={navLabels} />
    </main>
  );
}
