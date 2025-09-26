"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute='class' // html에 class로 light/dark 부착
      defaultTheme='system' // 시스템 기본
      enableSystem
      disableTransitionOnChange // 토글 시 플래시 방지
    >
      {children}
    </NextThemesProvider>
  );
}
