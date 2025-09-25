import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ko", "ja", "en", "zh"] as const,
  defaultLocale: "ko" as const,
  pathnames: {
    "/": "/",
    "/why": "/why",
    "/projects": "/projects",
    "/impact": "/impact",
    "/contact": "/contact",
  },
});

export type AppLocale = (typeof routing.locales)[number];
