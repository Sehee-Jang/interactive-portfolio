import { Suspense } from "react";
import Prologue from "@/components/Prologue/Prologue";
import type { AppLocale } from "@/i18n/routing";
import LoadingScreen from "@/components/common/LoadingScreen";
import { getTranslations } from "next-intl/server";

export default async function Page(props: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await props.params;
  const loc = isAppLocale(locale) ? locale : "ko";
  const t = await getTranslations({ locale });

  return (
    <main className='min-h-[100svh]'>
      <Suspense
        fallback={
          <div className='px-4 py-8'>
            <LoadingScreen message={t("loading.message")} fullscreen={false} />
          </div>
        }
      >
        <Prologue locale={loc} />
      </Suspense>
    </main>
  );
}

function isAppLocale(v: unknown): v is AppLocale {
  return (
    typeof v === "string" &&
    (["ko", "ja", "en", "zh"] as const).includes(v as AppLocale)
  );
}
