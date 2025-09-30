"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

type LoadingScreenProps = {
  /** 화면 중앙에 작은 문구를 보일지 여부 */
  message?: string;
  /** true면 화면 전체 고정 오버레이, false면 컨테이너 내부 표시 */
  fullscreen?: boolean;
};

export default function LoadingScreen({
  message,
  fullscreen = true,
}: LoadingScreenProps) {
  const t = useTranslations();
  // prop이 없으면 i18n 키를 사용
  const label = message ?? t("loading.message");

  // 레이아웃 프리셋: 전체 오버레이 vs 일반 컨테이너
  const wrapperClass = fullscreen
    ? "fixed inset-0 grid place-items-center bg-background/70 backdrop-blur-sm z-[60]"
    : "grid place-items-center py-10";

  return (
    // 스크린리더에 로딩 상태를 알려줌
    <div className={wrapperClass} aria-live='polite' aria-busy='true'>
      <div className='flex flex-col items-center gap-4'>
        {/* 점 3개 점프 애니메이션: 가벼운 로딩 피드백 */}
        <div className='flex items-end gap-2 h-8' role='status'>
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className='inline-block size-2.5 rounded-full bg-primary'
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.12,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* 진행 바 느낌의 쉼머 */}
        <div className='w-56 h-1.5 overflow-hidden rounded-full bg-border'>
          <motion.span
            className='block h-full w-1/3 rounded-full bg-primary/80'
            initial={{ x: "-100%" }}
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* 보조 문구 */}
        <p className='text-sm text-muted-foreground'>{label}</p>
      </div>
    </div>
  );
}
