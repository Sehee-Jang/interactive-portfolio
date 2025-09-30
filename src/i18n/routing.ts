import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ko", "ja", "en", "zh"] as const,
  defaultLocale: "ko" as const,
  localePrefix: "always",
  pathnames: {
    "/": "/",
    "/why": "/why",
    "/projects": "/projects",
    "/impact": "/impact",
    "/feedback": "/feedback",
    "/epilogue": "/epilogue",
  },
});

export type AppLocale = (typeof routing.locales)[number];
