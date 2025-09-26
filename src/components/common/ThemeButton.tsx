"use clinet";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeButton() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const ready = mounted && typeof resolvedTheme === "string";
  const next = ready && resolvedTheme === "dark" ? "light" : "dark";
  const label = ready
    ? resolvedTheme === "dark"
      ? "라이트 모드"
      : "다크 모드"
    : "테마 전환";

  return (
    <button
      onClick={() => ready && setTheme(next)}
      className='inline-flex h-10 w-10 items-center justify-center rounded-full
                 border border-[var(--border)] bg-[var(--bg)] text-[var(--fg)]
                 hover:brightness-[.98] focus:outline-none focus-visible:ring-2'
      aria-label={label}
      title={label}
    >
      {ready ? (
        resolvedTheme === "dark" ? (
          <Sun className='h-5 w-5' />
        ) : (
          <Moon className='h-5 w-5' />
        )
      ) : (
        // SSR과 동일 마크업 유지: 초기엔 빈 아이콘처럼 보이게
        <Moon className='h-5 w-5 opacity-0' aria-hidden />
      )}
    </button>
  );
}
