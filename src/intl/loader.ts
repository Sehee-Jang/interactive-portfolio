import type { AppLocale } from "@/i18n/routing";

const cache = new Map<AppLocale, Record<string, unknown>>();

export async function loadMessages(locale: AppLocale) {
  if (cache.has(locale)) return cache.get(locale)!;
  const mod = await import(`@/messages/${locale}.json`);
  // as const 유지: TS 추론 품질 향상
  cache.set(locale, mod as unknown as Record<string, unknown>);
  return cache.get(locale)!;
}
