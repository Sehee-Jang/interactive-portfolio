import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/routing";

export default async function LocaleLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <html lang={locale}>
      <body>{props.children}</body>
    </html>
  );
}
