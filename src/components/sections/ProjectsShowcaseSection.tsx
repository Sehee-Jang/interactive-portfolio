"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Wand2,
  PartyPopper,
  Clock3,
  Mail,
  CheckCircle2,
  ChevronRight,
  X,
  ChevronLeft,
  Maximize2,
  Clock,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/* -------- 공용 타입 -------- */
type SlideItem = Readonly<{
  text: string;
  image?: { src: string; alt?: string };
}>;

// 타입
type TimelineItemKey = "availability" | "dedup" | "notify" | "prep";

const timelineItems: ReadonlyArray<TimelineItemKey> = [
  "availability",
  "dedup",
  "notify",
  "prep",
];
/* ------------------------ 유틸 훅 ------------------------ */
// 최초 1회만 in-view 판정하여 등장 애니메이션 트리거
function useInViewOnce<T extends HTMLElement>(threshold = 0.35) {
  const ref = useRef<T | null>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || shown) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) setShown(true);
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [shown, threshold]);
  return { ref, shown } as const;
}
// 기본 좌↔우 스와이프 제스처 처리
function useSwipe(onLeft: () => void, onRight: () => void) {
  const startX = useRef<number | null>(null);
  const onPointerDown = (e: React.PointerEvent<HTMLElement>) =>
    (startX.current = e.clientX);
  const onPointerUp = (e: React.PointerEvent<HTMLElement>) => {
    if (startX.current === null) return;
    const dx = e.clientX - startX.current;
    if (Math.abs(dx) > 40) dx > 0 ? onRight() : onLeft();
    startX.current = null;
  };
  return { onPointerDown, onPointerUp };
}
const isVideo = (src: string) => /\.(mp4|webm|ogg|mov)$/i.test(src);
type MediaSrc = string | { thumb: string; full: string; alt?: string };
const toFull = (m?: MediaSrc) =>
  !m ? null : typeof m === "string" ? m : m.full;
const toThumb = (m?: MediaSrc) =>
  !m ? null : typeof m === "string" ? m : m.thumb;
const toAlt = (m?: MediaSrc, fallback?: string) =>
  typeof m === "object" && m?.alt ? m.alt : fallback;

/* ------------------------ 섹션 ------------------------ */

export default function ProjectsShowcaseSection() {
  const t = useTranslations("ch2");

  /* 1. 문제 슬라이드 */
  const problems = [
    { key: "tutorHoursVisibility", media: "/images/problems/old-1.webp" },
    { key: "bookingOverview", media: "/images/problems/old-2.webp" },
    { key: "splitSlotsConfusion", media: "/images/problems/old-3.webp" },
    { key: "offdaysNotReflected", media: "/images/problems/old-4.webp" },
    { key: "noRealtimeDupRisk", media: "/images/problems/old-5.webp" },
    { key: "manualOpsDelay", media: "/images/problems/old-6.webp" },
  ] as const;

  const normalizedSlides: ReadonlyArray<SlideItem> = problems.map((p) => ({
    text: t(`problems.${p.key}`),
    image: { src: p.media, alt: t(`problems.${p.key}`) },
  }));

  /* 2. 접근 단계 카드(GIF 기본 경로) */
  const steps = [
    { key: "chooseTutor", media: "/images/demo/choose-tutor.gif" },
    { key: "chooseTime", media: "/images/demo/choose-time.gif" },
    { key: "fillForm", media: "/images/demo/fill-form.gif" },
    { key: "liveStatus", media: "/images/demo/live-status.gif" },
    { key: "editReservation", media: "/images/demo/edit-reservation.gif" },
    { key: "email", media: "/images/demo/email.gif" },
  ] as const;

  /* 3. 결과 타임라인 */
  const timeline = {
    beforeKey: "timeline.ops.before",
    afterKey: "timeline.ops.after",
  } as const;

  /* 4. 결과 타임라인 */
  const results = [
    { icon: Clock3, id: "sync" },
    { icon: Mail, id: "mail" },
    { icon: CheckCircle2, id: "ops" },
  ] as const;

  /* 5. 결과 섹션 데모 */
  const demoLive: MediaSrc = {
    thumb: "/images/demo/user-preview-thumb.gif",
    full: "/images/demo/user-preview.mp4",
  };
  const demoTutor: MediaSrc = {
    thumb: "/images/demo/tutor-preview-thumb.gif",
    full: "/images/demo/tutor-preview.mp4",
  };

  /* 5) 기술 스택 */
  const techStack = ["Next.js", "React", "Firebase", "EmailJS"];

  return (
    <div className='grid place-items-center overflow-x-hidden'>
      <div className='w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-10'>
        <header className='mb-6 sm:mb-8'>
          <h2 className='text-[22px] sm:text-3xl font-semibold tracking-tight'>
            {t("title")}
          </h2>
          <p className='mt-2 text-sm sm:text-base text-black/60 dark:text-white/60'>
            {t("messageHeadline")}
          </p>
        </header>

        {/* 스냅 캐러셀: 문제 -> 접근 -> 결과 */}
        <div
          className='relative -mx-4 px-4 flex snap-x snap-mandatory overflow-x-auto gap-3 sm:gap-4 pb-4 max-w-[100vw] no-scrollbar scroll-px-4 sm:mx-0 sm:px-0 sm:scroll-px-0 overscroll-x-contain'
          aria-label='프로젝트 여정 슬라이드'
        >
          {/* 1) 문제 제기 */}
          <Slide ariaLabel='문제 제기'>
            <SlideHeader
              icon={AlertTriangle}
              title={t("problem")}
              badge='Chapter 2-1'
            />
            <div className='flex-1 min-h-0 overflow-hidden'>
              <ProblemSlidesCarousel items={normalizedSlides} fillHeight />
            </div>
          </Slide>

          {/* 2) 나의 접근 */}
          <Slide ariaLabel='나의 접근'>
            <SlideHeader
              icon={Wand2}
              title={t("approach")}
              badge='Chapter 2-2'
            />
            <div className='min-h-0 flex-1 overflow-y-auto pr-2 overscroll-contain [scrollbar-gutter:stable] js-scrollable'>
              <div className='grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6'>
                {steps.map((s, i) => (
                  <StepCard
                    key={s.key}
                    index={i + 1}
                    title={t(`steps.${s.key}`)}
                    media={s.media}
                  />
                ))}
              </div>
            </div>
          </Slide>

          {/* 3) 결과/영향 */}
          <Slide ariaLabel='결과와 영향'>
            <SlideHeader
              icon={PartyPopper}
              title={t("result")}
              badge='Chapter 2-3'
            />
            <div className='min-h-0 flex-1 overflow-y-auto pr-2 overscroll-contain js-scrollable'>
              <div className='relative pl-6'>
                <div className='absolute left-0 top-0 bottom-0 w-px bg-black/10 dark:bg-white/10' />
                {timelineItems.map((id) => (
                  <div key={id} className='relative mb-7 last:mb-0'>
                    {/* Before */}
                    <span className='absolute -left-3 top-3 block size-3 rounded-full bg-neutral-400' />
                    <p className='mb-1 text-xs font-medium text-neutral-500'>
                      {t("timeline.beforeLabel")}
                    </p>
                    <div className='rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-neutral-900/70 px-3.5 py-3'>
                      <p className='text-sm sm:text-base font-semibold'>
                        {t(`timeline.items.${id}.before`)}
                      </p>
                    </div>

                    {/* After */}
                    <div className='relative mt-4'>
                      <span className='absolute -left-3 top-3 block size-3 rounded-full bg-emerald-500' />
                      <p className='mb-1 text-xs font-medium text-emerald-600'>
                        {t("timeline.afterLabel")}
                      </p>
                      <div className='rounded-xl border border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-900/10 px-3.5 py-3'>
                        <p className='text-sm sm:text-base font-semibold'>
                          {t(`timeline.items.${id}.after`)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Slide>

          {/* 4) 미리보기 데모 */}
          <Slide ariaLabel='데모 미리보기'>
            <SlideHeader
              icon={CheckCircle2}
              title={t("demos.title")}
              badge='Chapter 2-4'
            />

            {/* 결과/영향 데모: 실시간 예약 현황 + 튜터 페이지 미리보기 */}
            <div className='min-h-0 flex-1 overflow-y-auto pr-2 overscroll-contain js-scrollable'>
              <div className='mt-6 grid sm:grid-cols-2 gap-4 sm:gap-6'>
                {demoLive && (
                  <DemoPanel title={t("demos.liveStatus")} media={demoLive} />
                )}
                {demoTutor && (
                  <DemoPanel
                    title={t("demos.tutorPreview")}
                    media={demoTutor}
                  />
                )}
              </div>
            </div>

            <div className='mt-6 flex flex-wrap items-center gap-3'>
              <span className='inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium'>
                <CheckCircle2 className='size-4' />
                Chapter Cleared
              </span>
              <ChevronRight className='size-4 opacity-60' />
              <div className='flex flex-wrap gap-2'>
                {techStack.map((t) => (
                  <span
                    key={t}
                    className='inline-flex items-center rounded-full border px-2.5 py-1 text-xs sm:text-sm text-black/70 dark:text-white/70'
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </Slide>
        </div>

        <p className='mt-2 text-xs text-black/50 dark:text-white/50'>
          좌우로 스크롤해 챕터를 넘겨보세요.
        </p>
      </div>
    </div>
  );
}

/* ------------------------ 하위 컴포넌트 ------------------------ */
// 개별 슬라이드 래퍼: 스냅 대상, 반응형 높이/여백/테두리
function Slide({
  children,
  ariaLabel,
}: {
  children: React.ReactNode;
  ariaLabel: string;
}) {
  return (
    <section
      role='group'
      aria-label={ariaLabel}
      className='
        snap-start sm:snap-center shrink-0 min-w-0
        basis-[86%] sm:basis-[92%] lg:basis-[88%]
        w-[calc(100%-2rem)] sm:w-[92%] lg:w-[88%]
        rounded-2xl border border-black/10 dark:border-white/10
        bg-white/60 dark:bg-neutral-900/60
        p-4 sm:p-5 lg:p-6
        flex flex-col min-h-0
        h-[50svh] sm:h-[56svh] lg:h-[60svh]
        overflow-hidden
      '
    >
      {children}
    </section>
  );
}

// 슬라이드 상단 타이틀+뱃지
function SlideHeader({
  icon: Icon,
  title,
  badge,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  badge: string;
}) {
  return (
    <div className='mb-6 sm:mb-8 flex items-center justify-between'>
      <h3 className='text-lg sm:text-xl font-semibold flex items-center gap-2 leading-tight'>
        <Icon className='size-5' aria-hidden />
        {title}
      </h3>
      <span className='rounded-full border px-2 py-[2px] text-[11px] opacity-70'>
        {badge}
      </span>
    </div>
  );
}

// 인터섹션 진입 시 점진적 표시
function Appear({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const { ref, shown } = useInViewOnce<HTMLDivElement>(0.45);
  return (
    <div
      ref={ref}
      style={{
        transition: "opacity 420ms ease, transform 420ms ease",
        transitionDelay: `${delay}ms`,
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(8px)",
      }}
    >
      {children}
    </div>
  );
}

// 접근 단계 카드(미디어 확대 버튼 포함)
function StepCard({
  index,
  title,
  media,
}: {
  index: number;
  title: string;
  media?: string;
}) {
  const { ref, shown } = useInViewOnce<HTMLDivElement>(0.4);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // 단일 이미지이므로 Lightbox items는 1개 배열
  const lbItems = media
    ? [{ src: media, alt: `${title} 미리보기` }]
    : ([] as Array<{ src: string; alt?: string }>);

  return (
    <div
      ref={ref}
      className={`
        rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900
        p-4 flex flex-col gap-3 transition
        ${shown ? "shadow-md" : "opacity-80"}
      `}
    >
      <div className='flex items-center gap-2'>
        <span className='inline-flex size-7 items-center justify-center rounded-full border border-black/10 dark:border-white/10 text-xs'>
          {index}
        </span>
        <p className='text-sm sm:text-base font-medium'>{title}</p>
      </div>

      <div className='relative rounded-xl overflow-hidden border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-neutral-800 aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] min-h-[8rem] sm:min-h-[9.5rem] md:min-h-[11rem]'>
        {media ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={media}
              alt={`${title} 미리보기`}
              className='w-full h-full object-cover'
              onClick={() => setOpenIndex(0)} // 이미지 클릭으로도 확대
            />
            <button
              type='button'
              aria-label='이미지 확대'
              title='이미지 확대'
              onClick={() => setOpenIndex(0)}
              className='absolute right-2 top-2 inline-flex size-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/75 ring-1 ring-white/25'
            >
              <Maximize2 className='size-4' />
            </button>
          </>
        ) : (
          <div className='w-full h-full grid place-items-center text-xs text-neutral-500'>
            미디어
          </div>
        )}
      </div>

      {/* 기존 Lightbox 재사용 (단일 아이템) */}
      <Lightbox
        openIndex={openIndex}
        items={lbItems}
        onClose={() => setOpenIndex(null)}
        onPrev={() => setOpenIndex((i) => (i === null ? null : 0))}
        onNext={() => setOpenIndex((i) => (i === null ? null : 0))}
      />
    </div>
  );
}

// 데모 패널
function DemoPanel({ title, media }: { title: string; media?: MediaSrc }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const thumb = toThumb(media);
  const full = toFull(media);
  const alt = toAlt(media, `${title} 미리보기`);
  const lbItems = full ? [{ src: full, alt }] : [];

  return (
    <div className='rounded-2xl border bg-white dark:bg-neutral-900 p-4 sm:p-5'>
      <p className='text-sm sm:text-base font-medium'>{title}</p>
      <div className='relative mt-3 rounded-xl overflow-hidden border h-36 sm:h-40'>
        {thumb ? (
          isVideo(thumb) ? (
            <video
              src={thumb}
              className='w-full h-full object-cover'
              muted
              playsInline
              loop
              autoPlay
              onClick={() => full && setOpenIndex(0)}
            />
          ) : (
            <img
              src={thumb}
              alt={alt}
              className='w-full h-full object-cover'
              onClick={() => full && setOpenIndex(0)}
            />
          )
        ) : (
          <div className='w-full h-full grid place-items-center text-xs text-neutral-500'>
            미디어
          </div>
        )}

        {full && (
          <button
            type='button'
            aria-label='확대'
            onClick={() => setOpenIndex(0)}
            className='absolute right-2 top-2 inline-flex size-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/75 ring-1 ring-white/25'
          >
            <Maximize2 className='size-4' />
          </button>
        )}
      </div>

      <Lightbox
        openIndex={openIndex}
        items={lbItems}
        onClose={() => setOpenIndex(null)}
        onPrev={() => setOpenIndex((i) => (i === null ? null : 0))}
        onNext={() => setOpenIndex((i) => (i === null ? null : 0))}
      />
    </div>
  );
}

/* ------------------------ 라이트박스 ------------------------ */
// 단순 라이트박스: 오버레이 클릭 닫기, 이미지 컨테인이며 키보드는 상위에서 처리
function Lightbox({
  openIndex,
  items,
  onClose,
  onPrev,
  onNext,
}: {
  openIndex: number | null;
  items: ReadonlyArray<{ src: string; alt?: string }>;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  if (openIndex === null) return null;
  const current = items[openIndex];
  const video = isVideo(current.src);

  const overlay = (
    <div
      role='dialog'
      aria-modal='true'
      className='fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm grid place-items-center p-4'
      onClick={onClose}
    >
      <div
        className='relative w-full max-w-5xl max-h-[85vh]'
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type='button'
          onClick={onClose}
          className='absolute -top-10 right-0 inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-3 py-1.5 text-white backdrop-blur transition hover:bg-white/20'
          aria-label='닫기'
        >
          <X className='size-4' /> 닫기
        </button>

        <div className='relative w-full h-[70vh] rounded-xl overflow-hidden border border-white/20 bg-black'>
          {video ? (
            <video
              className='absolute inset-0 w-full h-full object-contain'
              controls
              muted
              playsInline
              loop
              autoPlay
            >
              <source src={current.src} />
            </video>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={current.src}
              alt={current.alt ?? "확대 미디어"}
              className='absolute inset-0 w-full h-full object-contain'
            />
          )}
        </div>

        {items.length > 1 && (
          <div className='mt-3 flex items-center justify-between text-white'>
            <button
              type='button'
              onClick={onPrev}
              className='inline-flex items-center gap-1 rounded-lg border border-white/30 bg-white/10 px-3 py-1.5 backdrop-blur hover:bg-white/20'
              aria-label='이전'
            >
              <ChevronLeft className='size-4' /> 이전
            </button>
            <span className='text-white/80 text-sm'>
              {openIndex + 1} / {items.length}
            </span>
            <button
              type='button'
              onClick={onNext}
              className='inline-flex items-center gap-1 rounded-lg border border-white/30 bg-white/10 px-3 py-1.5 backdrop-blur hover:bg-white/20'
              aria-label='다음'
            >
              다음 <ChevronRight className='size-4' />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(overlay, document.body);
}
/* ------------------------ 이미지 캐러셀 ------------------------ */
// 문제 슬라이드 캐러셀: 키보드/스와이프/클릭 확대, 인디케이터 포함
function ProblemSlidesCarousel({
  items,
  fillHeight = false,
  showLabel = true,
  showArrows = true,
  showIndicators = true,
}: {
  items: ReadonlyArray<SlideItem>;
  fillHeight?: boolean;
  showLabel?: boolean;
  showArrows?: boolean;
  showIndicators?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [lbIndex, setLbIndex] = useState<number | null>(null);
  const total = items.length;

  const prev = () => setIndex((i) => (i + total - 1) % total);
  const next = () => setIndex((i) => (i + 1) % total);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Enter" || e.key === " ") setLbIndex(index);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, total]);

  const { onPointerDown, onPointerUp } = useSwipe(next, prev);
  const current = items[index];

  return (
    <>
      <div
        className={`relative overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 ${
          fillHeight ? "h-full" : ""
        }`}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        {/* 뷰포트 */}
        <div
          className={`${
            fillHeight ? "h-full" : "h-64 sm:h-72 lg:h-80"
          } relative bg-transparent`}
        >
          {current.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={current.image.src}
              alt={current.image.alt ?? "문제 화면"}
              className='absolute inset-0 h-full w-full object-cover'
              onClick={() => setLbIndex(index)}
            />
          ) : (
            <div className='grid h-full w-full place-items-center text-xs text-neutral-500'>
              이미지 없음
            </div>
          )}

          {/* 라벨 */}
          {showLabel && (
            <div className='pointer-events-none absolute left-4 top-4 max-w-[92%]'>
              <span className='inline-block rounded-xl bg-black/80 text-white px-3.5 py-2 text-[13px] sm:text-[15px] font-semibold leading-snug shadow-[0_4px_14px_rgba(0,0,0,0.35)] ring-1 ring-white/20 backdrop-blur-sm'>
                {current.text}
              </span>
            </div>
          )}

          {/* 확대 아이콘 */}
          {current.image && (
            <button
              type='button'
              aria-label='이미지 확대'
              title='이미지 확대'
              onClick={() => setLbIndex(index)}
              className='absolute right-3 top-3 inline-flex size-9 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/75 ring-1 ring-white/25'
            >
              <Maximize2 className='size-4' aria-hidden />
            </button>
          )}

          {/* 화살표 (항상 보이도록 z-index 업) */}
          {showArrows && total > 1 && (
            <>
              <button
                type='button'
                aria-label='이전'
                onClick={prev}
                className='absolute left-3 top-1/2 -translate-y-1/2 inline-flex size-9 items-center justify-center rounded-full bg-black/55 text-white hover:bg-black/70 z-20 shadow-md'
              >
                <ChevronRight className='-scale-x-100 size-5' />
              </button>
              <button
                type='button'
                aria-label='다음'
                onClick={next}
                className='absolute right-3 top-1/2 -translate-y-1/2 inline-flex size-9 items-center justify-center rounded-full bg-black/55 text-white hover:bg-black/70 z-20 shadow-md'
              >
                <ChevronRight className='size-5' />
              </button>
            </>
          )}

          {/* 인디케이터: 전 해상도 공통(모바일과 동일한 오버레이) */}
          {showIndicators && total > 1 && (
            <>
              <div className='pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/55 via-black/25 to-transparent backdrop-blur-[2px]' />
              <div
                className='absolute inset-x-0 bottom-2 flex items-center justify-center gap-3'
                aria-live='polite'
              >
                <span className='px-2 py-0.5 rounded text-[11px] text-white/95 bg-black/60 ring-1 ring-white/20'>
                  {index + 1} / {total}
                </span>
                <div className='flex items-center gap-2'>
                  {items.map((_, i) => (
                    <button
                      key={i}
                      type='button'
                      aria-label={`${i + 1}번 보기`}
                      onClick={() => setIndex(i)}
                      className='inline-flex items-center justify-center rounded-full transition-all ring-1 ring-white/30'
                      style={{ width: 20, height: 20 }}
                    >
                      <span
                        className='block rounded-full transition-transform'
                        style={{
                          width: 8,
                          height: 8,
                          backgroundColor:
                            i === index
                              ? "rgba(255,255,255,1)"
                              : "rgba(255,255,255,0.55)",
                          transform: i === index ? "scale(1.25)" : "scale(1)",
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 라이트박스 */}
      <Lightbox
        openIndex={lbIndex}
        items={items
          .map((it) => it.image)
          .filter((v): v is { src: string; alt?: string } => !!v)}
        onClose={() => setLbIndex(null)}
        onPrev={() =>
          setLbIndex((v) =>
            v === null
              ? null
              : (v + items.filter((it) => it.image).length - 1) %
                items.filter((it) => it.image).length
          )
        }
        onNext={() =>
          setLbIndex((v) =>
            v === null ? null : (v + 1) % items.filter((it) => it.image).length
          )
        }
      />
    </>
  );
}
