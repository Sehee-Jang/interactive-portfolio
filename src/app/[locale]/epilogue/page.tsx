import { getTranslations } from "next-intl/server";
import type { AppLocale } from "@/i18n/routing";
import QuickReact from "@/components/epilogue/QuickReact";
import CTADeck from "@/components/epilogue/CTADeck";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Epilogue | Sehee Jang Portfolio",
};

type PageParams = { locale: AppLocale };

export default async function EpiloguePage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ namespace: "epilogue", locale });

  // 연락/이력서 관련 정적 리소스
  const email = "seheejang.korea@gmail.com";
  const resumeHref = "/cv/SeheeJang_CV_ko.pdf";
  const resumeViewHref =
    "https://www.notion.so/Frontend-Developer-React-Next-js-257689e8be268084ba72ce91e9495467";

  // 메일 제목/본문 i18n 적용 + URL 인코딩
  const subject = encodeURIComponent(t("cta.mailto.subject"));
  const body = encodeURIComponent(t("cta.mailto.body"));
  const mailtoHref = `mailto:${email}?subject=${subject}&body=${body}`;

  return (
    <section className='mx-auto max-w-3xl px-4 py-20'>
      <header className='text-center'>
        <h1 className='text-3xl font-bold md:text-5xl'>{t("title")}</h1>
        <p className='mt-4 text-muted-foreground md:text-lg'>{t("subtitle")}</p>
      </header>

      {/* CTA 묶음: 이력서/이메일/프로필 */}
      <div className='mt-12'>
        <CTADeck
          email={email}
          mailtoHref={mailtoHref}
          resumeHref={resumeHref}
          resumeViewHref={resumeViewHref}
          githubHref={t("cta.profile.github.url")}
          linkedinHref={t("cta.profile.linkedin.url")}
          githubLabel={t("cta.profile.github.label")}
          linkedinLabel={t("cta.profile.linkedin.label")}
        />
      </div>

      {/* 원클릭 의사 표시: API 연동 예정 */}
      <div className='mt-10'>
        <QuickReact
          apiEndpoint='/api/quick-react'
          collect={{
            hire: ["name", "email", "company", "message"],
            interview: ["name", "email", "company", "message"],
            // feedback 은 폼 없음 → 원클릭 전송
          }}
        />
      </div>

      {/* 시그니처 */}
      <footer className='mt-16 text-center text-sm text-muted-foreground'>
        장세희 – {t("signatureSuffix")}
      </footer>
    </section>
  );
}
