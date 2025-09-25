import { getRequestConfig } from "next-intl/server";
import { routing, type AppLocale } from "@/i18n/routing";

// locale 런타임 가드
function isAppLocale(v: unknown): v is AppLocale {
  return (
    typeof v === "string" && (routing.locales as readonly string[]).includes(v)
  );
}

export default getRequestConfig(async ({ locale }) => {
  const loc: AppLocale = isAppLocale(locale) ? locale : routing.defaultLocale;

  // request.ts가 src/i18n 아래 있을 때의 상대경로 (루트 ./messages 기준)
  const messages = (await import(`../../messages/${loc}.json`)).default;

  return {
    locale: loc,
    messages,
  };
});
