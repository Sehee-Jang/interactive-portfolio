"use client";

import React, { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import ThemeButton from "../common/ThemeButton";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
  // 사운드: 기본 off, 사용자가 토글 시 짧은 벨
  const [soundEnabled, setSoundEnabled] = useState(false);

  return (
    <div>
      {/* 테마/사운드 토글 영역 */}
      <div className='fixed top-6 right-6 z-20 flex items-center gap-2'>
        <ThemeButton />
        {/* 사운드 토글 */}
        <button
          onClick={() => setSoundEnabled((s) => !s)}
          className='inline-flex h-10 w-10 items-center justify-center rounded-full
           border border-[var(--border)] bg-[var(--bg)] text-[var(--fg)]
           hover:brightness-[.98] focus:outline-none focus-visible:ring-2'
          aria-pressed={soundEnabled}
          title={soundEnabled ? "Sound Off" : "Sound On"}
          aria-label={soundEnabled ? "Sound Off" : "Sound On"}
        >
          {soundEnabled ? (
            <VolumeX className='h-5 w-5' />
          ) : (
            <Volume2 className='h-5 w-5' />
          )}
          <span className='sr-only'>
            {soundEnabled ? "Sound Off" : "Sound On"}
          </span>
        </button>

        {/* 언어 변경 */}
        <LanguageSwitcher />
      </div>
    </div>
  );
}
