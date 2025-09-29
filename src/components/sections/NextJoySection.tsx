"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

/**
 * NextJoySection
 * - ch4 네임스페이스의 i18n 문구를 사용해 타이틀/메시지/CTA/서명을 표시
 * - framer-motion으로 순차 등장 애니메이션 적용
 * - 페이지 하단 근처에서도 충분한 공간을 확보하도록 min-h-svh 사용
 */
export default function NextJoySection() {
  const t = useTranslations("ch4");

  return (
    // 화면 중앙 정렬 + 위아래 여백, 다크/라이트 상관없이 텍스트 중앙 정렬
    <section className='min-h-svh relative flex flex-col items-center justify-center py-24 text-center'>
      {/* 타이틀: 아래에서 위로 부드럽게 등장 */}
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className='text-3xl font-bold md:text-5xl'
      >
        {t("title")}
      </motion.h2>

      {/* 메시지: 타이틀보다 약간 늦게 페이드 인 */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        viewport={{ once: true }}
        className='mt-6 max-w-xl text-lg text-muted-foreground md:text-xl'
      >
        {t("message")}
      </motion.p>

      {/* CTA 버튼: 살짝 아래에서 올라오며 등장 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        viewport={{ once: true }}
        className='mt-10'
      >
        <Link
          href='/epilogue'
          className='rounded-2xl bg-primary px-8 py-3 text-lg font-medium text-white shadow-md transition hover:bg-primary-hover'
        >
          {t("cta")}
        </Link>
      </motion.div>

      {/* 서명: 가장 늦게 페이드 인 */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 1 }}
        viewport={{ once: true }}
        className='mt-16 text-sm italic text-muted-foreground'
      >
        {t("signature")}
      </motion.p>
    </section>
  );
}
