"use client";

import { useTranslations } from "next-intl";
import type { LucideIcon } from "lucide-react";
import { Sparkles, SlidersHorizontal, BookOpen } from "lucide-react";

type KeywordKey = "creative" | "interactive" | "storytelling";
type KeywordItem = { key: KeywordKey; Icon: LucideIcon };

export default function WhySection() {
  const t = useTranslations();

  // 키워드-아이콘 매핑 (3개 카드)
  const items: KeywordItem[] = [
    { key: "creative", Icon: Sparkles },
    { key: "interactive", Icon: SlidersHorizontal },
    { key: "storytelling", Icon: BookOpen },
  ];

  return (
    <div className='min-h-svh grid place-items-center'>
      <div className='w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16'>
        <header className='mb-8 sm:mb-10'>
          <h2 className='text-[22px] sm:text-3xl font-semibold tracking-tight'>
            {t("ch1.title")}
          </h2>
          <p className='mt-2 text-sm sm:text-base text-black/60 dark:text-white/60'>
            {t("ch1.question")}
          </p>
        </header>

        {/* 3열 반응형 카드 그리드 */}
        <div className='grid gap-4 sm:gap-6 md:grid-cols-3'>
          {items.map(({ key, Icon }) => (
            <FlipCard
              key={key}
              icon={
                <Icon
                  aria-hidden
                  className='size-5 sm:size-6 text-black/70 dark:text-white/70'
                />
              }
              frontTitle={t(`ch1.keywords.${key}.text`)}
              backText={t(`ch1.keywords.${key}.example`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/** 미니멀 3D 플립 카드 */
function FlipCard(props: {
  icon: React.ReactNode;
  frontTitle: string;
  backText: string;
}) {
  const { icon, frontTitle, backText } = props;

  return (
    <div className='group relative h-44 sm:h-56 md:h-60 [perspective:1200px]'>
      {/* 회전 컨테이너: hover/focus 시 Y축 180도 회전 */}
      <div
        className='
          relative h-full w-full transition-transform duration-500 will-change-transform
          [transform-style:preserve-3d]
          group-hover:[transform:rotateY(180deg)]
          group-focus-within:[transform:rotateY(180deg)]
          motion-reduce:transition-none motion-reduce:[transform:none]
        '
      >
        {/* 앞면: 아이콘 + 키워드 텍스트 */}
        <div
          className='
            absolute inset-0 rounded-2xl border border-black/10 dark:border-white/10
            bg-white dark:bg-neutral-900 shadow-[0_1px_0_0_rgba(0,0,0,0.04)]
            p-5 sm:p-6 flex flex-col justify-center gap-3
            [backface-visibility:hidden] [-webkit-backface-visibility:hidden] [transform:rotateY(0deg)]
            group-hover:shadow-md group-hover:scale-[1.01] transition
          '
        >
          <div className='flex items-center gap-3'>
            <span className='inline-flex size-8 items-center justify-center rounded-full border border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.05]'>
              {icon}
            </span>
            <h3 className='text-sm sm:text-base font-medium leading-snug'>
              {frontTitle}
            </h3>
          </div>
        </div>

        {/* 뒷면: 예시 문장 */}
        <div
          className='
            absolute inset-0 rounded-2xl border border-black/10 dark:border-white/10
            bg-white dark:bg-neutral-900 p-5 sm:p-6
            flex items-center justify-center text-center
            [backface-visibility:hidden] [-webkit-backface-visibility:hidden] [transform:rotateY(180deg)]
            shadow-md
          '
        >
          <p className='text-sm sm:text-[15px] leading-relaxed text-black/80 dark:text-white/80'>
            {backText}
          </p>
        </div>
      </div>

      {/* 접근성/포커스 영역: 키보드 포커스 시에도 플립 동작 */}
      <button
        className='absolute inset-0 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-[--ring]'
        aria-label={`${frontTitle} 예시 보기`}
      />
    </div>
  );
}
