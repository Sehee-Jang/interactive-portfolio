"use client";

import React from "react";
import ThemeButton from "../common/ThemeButton";
import LanguageSwitcher from "./LanguageSwitcher";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function Header() {
  const t = useTranslations();
  return (
    <header
      className='sticky top-0 z-40 h-14 border-b border-border
                 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60'
      style={{ height: "var(--appbar-h, 56px)" }}
    >
      <div className='mx-auto max-w-6xl h-full px-4 sm:px-6 lg:px-8'>
        {/* 좌: 브랜드 / 우: 컨트롤 */}
        <div className='flex h-full items-center justify-between'>
          <Link
            href='/'
            className='flex flex-row font-semibold tracking-tight items-center'
          >
            <h1 className='text-l md:text-xl'>{t("projects.title")}</h1>
            <p className='text-sm opacity-80 border-l ml-4 pl-4'>
              {t("projects.subtitle")}
            </p>
          </Link>

          <div className='flex items-center gap-2'>
            <ThemeButton />
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
