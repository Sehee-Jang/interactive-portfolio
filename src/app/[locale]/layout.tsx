import { getMessages, setRequestLocale } from "next-intl/server";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { routing, type AppLocale } from "@/i18n/routing";
import { notFound } from "next/navigation";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";


function isAppLocale(v: unknown): v is AppLocale {
  return (
    typeof v === "string" &&
    (["ko", "ja", "en", "zh"] as const).includes(v as AppLocale)
  );
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

   if (!isAppLocale(locale) || !hasLocale(routing.locales, locale)) {
     notFound();
   }

  // 요청 컨텍스트에 로케일 설정 (middleware와 연동)
  setRequestLocale(locale);

  // 현재 locale에 대응하는 messages 로드
  const messages = await getMessages({ locale });

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Header />
      {children}
      <Footer />
    </NextIntlClientProvider>
  );
}
