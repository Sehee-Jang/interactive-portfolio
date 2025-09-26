"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useTranslations } from "next-intl";
import type { AppLocale } from "@/i18n/routing";
import { ChevronsDown } from "lucide-react";

interface PrologueProps {
  locale: AppLocale;
}

type Particle = {
  id: number;
  size: number;
  delay: number;
  duration: number;
  dx: number;
  dy: number;
  rotate: number;
};

export default function Prologue({ locale }: PrologueProps) {
  const t = useTranslations("prologue");
  const tg = useTranslations("prologue.glyphs");

  // 이름 의미(칩에서만 사용)
  const glyphs = [
    {
      char: tg("jang.char"),
      heading: tg("jang.heading"),
      line: tg("jang.line"),
    },
    { char: tg("se.char"), heading: tg("se.heading"), line: tg("se.line") },
    { char: tg("hee.char"), heading: tg("hee.heading"), line: tg("hee.line") },
  ] as const;

  const copy = {
    storytelling: t("nameMeaning.description"),
    outro: t("ending"),
    cta: t("cta"),
  };

  // 효과
  const prefersReducedMotion = useReducedMotion();

  // 아주 은은한 파티클(라이트/다크 모두 자연스럽게)
  const [showParticles, setShowParticles] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setShowParticles(true), 400);
    return () => clearTimeout(id);
  }, []);
  const particles = useMemo<Particle[]>(() => {
    const list: Particle[] = [];
    const count = 24;
    for (let i = 0; i < count; i++) {
      list.push({
        id: i,
        size: 2 + (i % 3),
        delay: (i % 8) * 0.05,
        duration: 0.9 + (i % 6) * 0.06,
        dx: (Math.random() - 0.5) * 160,
        dy: -60 - Math.random() * 100,
        rotate: Math.random() * 360,
      });
    }
    return list;
  }, []);

  // 스크롤 등장 공통
  const fadeUp = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  } as const;

  return (
    <section className='relative w-full min-h-[100svh] bg-[var(--bg)] text-[var(--fg)]'>
      {/* ── Hero: 이름 중심 ───────────────────────────────────────── */}
      <div className='relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-6'>
        {/* 가벼운 파티클 */}
        {/* {showParticles && !prefersReducedMotion && (
          <div
            aria-hidden
            className='pointer-events-none absolute inset-0 flex items-center justify-center'
          >
            {particles.map((p) => (
              <motion.span
                key={p.id}
                initial={{ x: 0, y: 0, opacity: 0, rotate: 0 }}
                animate={{ x: p.dx, y: p.dy, opacity: 1, rotate: p.rotate }}
                transition={{
                  delay: p.delay,
                  duration: p.duration,
                  ease: "easeOut",
                }}
                className='absolute block rounded-full'
                style={{
                  width: p.size,
                  height: p.size,
                  backgroundColor:
                    p.id % 3 === 0
                      ? "var(--primary)"
                      : "color-mix(in srgb, var(--fg) 25%, transparent)",
                }}
              />
            ))}
          </div>
        )} */}

        {/* 이름(한글) */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className='
          relative z-10 text-center font-semibold tracking-[-0.015em]
          text-[clamp(36px,7vw,88px)] leading-[0.98]
        '
        >
          장세희
        </motion.h1>

        {/* 영문 표기 */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          className='mt-4 text-center text-[color:var(--muted)] text-[clamp(14px,1.4vw,18px)]'
        >
          Sehee Jang
        </motion.p>

        {/* 의미 칩 */}
        <div className='mt-6 grid gap-1.5 text-center text-[15px] md:text-base text-[var(--muted)]'>
          {glyphs.map((g, i) => (
            <motion.p
              key={g.heading}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.45,
                ease: "easeOut",
                delay: 0.15 + i * 0.05,
              }}
            >
              <span
                className='
                relative inline-flex items-center gap-2 rounded-full px-3 py-1
                border border-[var(--border)_50%]
                bg-[color-mix(in_srgb,var(--bg)_95%,var(--primary)_5%)]
                shadow-[0_1px_6px_-5px_color-mix(in_srgb,var(--primary)_25%,transparent)]
                *
                after:absolute after:inset-0 after:-z-10 after:rounded-full
                after:bg-[radial-gradient(circle_at_22%_50%,color-mix(in_srgb,var(--primary)_55%,transparent),transparent_55%)]
            after:blur-[8px] after:opacity-35
              '
              >
                {/* 전구 코어(작은 불빛 점) */}
                {prefersReducedMotion ? (
                  <span
                    className='h-1.5 w-1.5 rounded-full bg-[var(--primary)]
                       shadow-[0_0_8px_color-mix(in_srgb,var(--primary)_70%,transparent)]'
                    aria-hidden
                  />
                ) : (
                  <motion.span
                    className='h-1.5 w-1.5 rounded-full
                       bg-[var(--primary)]
                       shadow-[0_0_10px_color-mix(in_srgb,var(--primary)_80%,transparent),0_0_18px_color-mix(in_srgb,var(--primary)_40%,transparent)]'
                    aria-hidden
                    animate={{ opacity: [0.7, 1, 0.7], scale: [1, 1.15, 1] }}
                    transition={{
                      duration: 2.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                )}

                {/* heading */}
                <span className='opacity-85 [text-shadow:0_0_6px_color-mix(in_srgb,var(--primary)_28%,transparent)]'>
                  {g.heading}
                </span>

                {/* line */}
                <span className='opacity-75 [text-shadow:0_0_8px_color-mix(in_srgb,var(--primary)_20%,transparent)]'>
                  {g.line}
                </span>
              </span>
            </motion.p>
          ))}
        </div>

        {/* 서브 타이틀(한 줄 카피) */}
        <motion.p
          className='
            mt-14 mx-auto max-w-screen-lg px-6 text-center
            text-[clamp(16px,2vw,24px)] font-medium tracking-[-0.01em]
            text-[color:var(--fg)]/95
            relative before:block before:h-[3px] before:w-14 before:rounded-full
            before:bg-[var(--primary)] before:mx-auto before:mb-8
          '
          variants={fadeUp}
          initial='hidden'
          whileInView='show'
          viewport={{ once: true, amount: 0.6 }}
        >
          {t.rich("nameMeaning.title", {
            name: (chunks) => (
              <span className='text-[var(--primary)]'>{chunks}</span>
            ),
          })}
        </motion.p>

        {/* 스크롤 인디케이터 */}
        <div className='absolute bottom-8 left-0 right-0 flex justify-center'>
          <motion.div
            initial={
              prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 0 }
            }
            animate={
              prefersReducedMotion
                ? { opacity: 1, y: 0 }
                : { opacity: 1, y: [0, 8, 0] }
            }
            transition={{
              duration: 1.6,
              repeat: prefersReducedMotion ? 0 : Infinity,
              ease: "easeInOut",
            }}
            className='z-20 text-[var(--muted)] pointer-events-none'
            aria-hidden
          >
            <ChevronsDown className='h-5 w-5' />
          </motion.div>
        </div>
      </div>

      {/* ── 본문 섹션들: 스크롤 시 나타남 ────────────────────────── */}
      <div className='mx-auto max-w-3xl px-6 py-16'>
        <motion.blockquote
          className='whitespace-pre-line text-[16px] md:text-[18px] leading-7 md:leading-8 text-[var(--fg)]/90 text-center'
          variants={fadeUp}
          initial='hidden'
          whileInView='show'
          viewport={{ once: true, amount: 0.6 }}
          transition={{ delay: 0.05 }}
        >
          {copy.storytelling}
        </motion.blockquote>
      </div>

      <div className='mx-auto max-w-3xl px-6 pb-28 text-center'>
        <motion.p
          className='text-[18px] md:text-[20px] text-[var(--fg)]'
          variants={fadeUp}
          initial='hidden'
          whileInView='show'
          viewport={{ once: true, amount: 0.6 }}
          transition={{ delay: 0.05 }}
        >
          {copy.outro}
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial='hidden'
          whileInView='show'
          viewport={{ once: true, amount: 0.6 }}
          transition={{ delay: 0.12 }}
          className='mt-10'
        >
          <Link
            href='/projects'
            as={`/${locale}/projects`}
            className='inline-flex items-center justify-center rounded-lg px-5 py-3
                       bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]
                       focus:outline-none focus-visible:ring-2'
          >
            {copy.cta}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
