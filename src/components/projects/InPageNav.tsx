"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";

type SectionDef = { id: string; labelKey: string };

interface InPageNavProps {
  sections: readonly SectionDef[];
  top?: number; // sticky 위치 미세 조정 (px), 기본 16px
}

export default function InPageNav({ sections, top = 16 }: InPageNavProps) {
  const t = useTranslations();

  // 현재 활성화된 섹션 id
  const [active, setActive] = useState<string>(sections[0]?.id ?? "");

  // 하단 활성 인디케이터(left/width)
  const [indicator, setIndicator] = useState<{ left: number; width: number }>({
    left: 0,
    width: 0,
  });

  // 각 탭 앵커 요소를 id별로 보관
  const refs = useRef<Record<string, HTMLAnchorElement | null>>({});

  // 각 섹션의 교차 상태(비율, 화면상단까지의 거리)를 저장
  const visibleMapRef = useRef<Record<string, { ratio: number; top: number }>>(
    {}
  );

  // 섹션을 관찰하여 화면 상단에 가장 가까운 섹션을 active로 지정
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          // 화면 상단 기준 거리와 교차 비율을 저장
          visibleMapRef.current[id] = {
            ratio: entry.isIntersecting ? entry.intersectionRatio : 0,
            top: entry.boundingClientRect.top,
          };
        }

        // 1순위: 화면 상단과의 거리(topDist) 최소, 2순위: 교차 비율(ratio) 최대
        const next = sections
          .map((s) => {
            const v = visibleMapRef.current[s.id];
            return {
              id: s.id,
              // 상단보다 아래(>=0)에 있으면 그 값을, 위로 지나가면 큰 양수로 보정
              topDist:
                v?.top !== undefined
                  ? v.top >= 0
                    ? v.top
                    : Number.POSITIVE_INFINITY // 위로 지나간 섹션은 뒤로 밀기
                  : Number.POSITIVE_INFINITY,
              ratio: v?.ratio ?? 0,
            };
          })
          // 1순위: topDist가 가장 작은 것(화면 상단에 가장 가까움)
          // 2순위: 교차 비율이 큰 것
          .sort((a, b) =>
            a.topDist !== b.topDist ? a.topDist - b.topDist : b.ratio - a.ratio
          )[0];

        if (next && next.id && next.id !== active) {
          setActive(next.id);
        }
      },
      {
        // sticky 높이를 고려해 상단 여백을 넉넉히 빼줌
        rootMargin: `-${Math.max(0, top + 32)}px 0px -60% 0px`,
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      }
    );

    // 관찰 대상 섹션 요소 수집 후 observe
    const targets = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => !!el);

    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [sections, top, active]);

  // active 변경 시 URL 해시 동기화(#section-id)
  useEffect(() => {
    if (!active) return;
    if (window.location.hash.replace("#", "") !== active) {
      history.replaceState(null, "", `#${active}`);
    }
  }, [active]);

  // active 변경/리사이즈 시 하이라이트 인디케이터 위치/폭 갱신 + 탭 가시 범위로 스크롤
  useEffect(() => {
    const update = () => {
      const el = refs.current[active];
      if (!el) return;
      const parent = el.offsetParent as HTMLElement | null;
      const left = el.offsetLeft - (parent?.offsetLeft ?? 0);
      setIndicator({ left, width: el.offsetWidth });
      el.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [active]);

  // 렌더링 최적화: sections 참조 동일성 유지
  const items = useMemo(() => sections, [sections]);

  // 앵커 ref 등록 헬퍼
  const setRef =
    (id: string) =>
    (el: HTMLAnchorElement | null): void => {
      refs.current[id] = el;
    };

  return (
    <nav
      aria-label='섹션 내비게이션'
      className='sticky z-30 mb-6'
      style={{ top }}
    >
      <div
        className='
          relative rounded-xl border border-black/10 dark:border-white/10
          bg-white/70 dark:bg-neutral-900/60
          px-2 py-2
        '
      >
        {/* 가로 스크롤 리스트 */}
        <div
          className='relative flex gap-2 overflow-x-auto no-scrollbar scroll-px-2'
          role='tablist'
          aria-orientation='horizontal'
        >
          {/* 액티브 인디케이터 */}
          <div
            className='pointer-events-none absolute bottom-1 h-0.5 rounded-full bg-[--ring] transition-all duration-300'
            style={{
              left: indicator.left + 8,
              width: Math.max(0, indicator.width - 16),
            }}
            aria-hidden
          />
          {items.map((s) => {
            const isActive = active === s.id;
            return (
              <a
                key={s.id}
                href={`#${s.id}`}
                ref={setRef(s.id)}
                role='tab'
                aria-selected={isActive}
                aria-controls={s.id}
                className={`
                  relative shrink-0 rounded-full border border-transparent
                  px-3.5 py-1.5 text-sm transition
                  ${
                    isActive
                      ? "font-medium text-black dark:text-white"
                      : "text-black/60 hover:text-black/80 dark:text-white/60 dark:hover:text-white/80"
                  }
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--ring]
                `}
                onClick={(e) => {
                  e.preventDefault();
                  const target = document.getElementById(s.id);
                  if (target) {
                    // 먼저 active를 즉시 반영해 해시/인디케이터가 바로 바뀌도록
                    setActive(s.id);
                    target.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }
                }}
              >
                {t(s.labelKey)}
              </a>
            );
          })}
        </div>
        {/* 좌/우 페이드(오버플로우 힌트) */}
        <div className='pointer-events-none absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-white/70 dark:from-neutral-900/60 to-transparent rounded-l-xl' />
        <div className='pointer-events-none absolute inset-y-0 right-0 w-4 bg-gradient-to-l from-white/70 dark:from-neutral-900/60 to-transparent rounded-r-xl' />
      </div>
    </nav>
  );
}
