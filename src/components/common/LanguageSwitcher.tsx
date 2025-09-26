"use client";

import React, { useState, useTransition } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { AppLocale } from "@/i18n/routing";
import { usePathname, useRouter } from "@/i18n/navigation";

export default function LanguageSwitcher() {
  const t = useTranslations("lang");
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const syncLocale = async (next: AppLocale) => {
    // 1) URL locale 변경 (UI 즉시 반응)
    startTransition(() => {
      router.replace(pathname, { locale: next });
      setOpen(false);
    });

    // 2) 쿠키 동기화 (next-intl의 "마지막 언어 기억" 시나리오 대비)
    document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=31536000; samesite=lax`;
  };

  const changeLanguage = (next: AppLocale) => {
    if (next === locale) {
      setOpen(false);
      return;
    }
    void syncLocale(next);
  };

  return (
    <DropdownMenu>
      {/* 트리거 */}
      <DropdownMenuTrigger asChild>
        <button
          className='inline-flex h-10 w-10 items-center justify-center rounded-full
                 border border-[var(--border)] bg-[var(--bg)] text-[var(--fg)]
                 hover:brightness-[.98] focus:outline-none focus-visible:ring-2'
        >
          <Globe className='h-5 w-5' />
        </button>
      </DropdownMenuTrigger>

      {/* 콘텐츠 */}
      <DropdownMenuContent>
        <DropdownMenuLabel> {t("select")}</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => changeLanguage("ko")}
            disabled={isPending}
          >
            {t("ko")}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => changeLanguage("en")}
            disabled={isPending}
          >
            {t("en")}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => changeLanguage("ja")}
            disabled={isPending}
          >
            {t("ja")}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => changeLanguage("zh")}
            disabled={isPending}
          >
            {t("zh")}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
