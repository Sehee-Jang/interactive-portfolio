"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useTranslations } from "next-intl";

/* 네비가 제어할 섹션 id 타입 고정 */
type SectionId = "ch1" | "ch2" | "ch3" | "ch4";
/* 섹션 정의: id와 i18n 라벨 키(축약 네비 라벨) */
type Section = { id: SectionId; labelKey: `ch${1 | 2 | 3 | 4}.nav` };

export default function InPageNav() {
  const t = useTranslations();

  /* 네비용 섹션 목록: 재생성 방지 */
  const sections: readonly Section[] = useMemo(
    () => [
      { id: "ch1", labelKey: "ch1.nav" },
      { id: "ch2", labelKey: "ch2.nav" },
      { id: "ch3", labelKey: "ch3.nav" },
      { id: "ch4", labelKey: "ch4.nav" },
    ],
    []
  );

  /* 초기 활성 섹션: 주소 해시 우선, 없으면 첫 섹션 */
  const [active, setActive] = useState<string>(() => {
    if (typeof window === "undefined") return sections[0]?.id ?? "";
    const hash = window.location.hash.slice(1);
    return (hash || sections[0]?.id) ?? "";
  });

  /* 스티키 위치: 전역 CSS 변수(--appbar-h) 기반으로 계산 */
  const appbarH =
    typeof window !== "undefined"
      ? parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--appbar-h"
          ) || "56"
        ) || 56
      : 56;
  const topPx = appbarH + 12;

  /* refs: 옵저버 인스턴스 / 섹션 DOM 캐시 / 최근 활성 id */
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sectionElsRef = useRef<HTMLElement[]>([]);
  const lastActiveRef = useRef<string>(active);

  /* 탭 클릭: 헤더 높이만큼 보정하여 스무스 스크롤 + pushState */
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, id: SectionId) => {
      e.preventDefault();
      if (typeof window === "undefined") return;

      const el = document.getElementById(id);
      if (!el) return;

      const y = el.getBoundingClientRect().top + window.scrollY - (topPx + 4);
      window.history.pushState(null, "", `#${id}`);
      window.scrollTo({ top: y, behavior: "smooth" });
      lastActiveRef.current = id;
      setActive(id);
    },
    [topPx]
  );

  /* 스크롤 연동: IntersectionObserver로 현재 섹션 감지 후 해시/활성 동기화 */
  useEffect(() => {
    if (typeof window === "undefined") return;

    // 섹션 DOM을 1회 수집 후 캐시
    sectionElsRef.current = sections
      .map(({ id }) => document.getElementById(id) as HTMLElement | null)
      .filter((el): el is HTMLElement => Boolean(el));

    // 기존 옵저버 정리
    observerRef.current?.disconnect();

    // 옵저버 생성
    const io = new IntersectionObserver(
      (entries) => {
        // 뷰포트에 걸린 항목 중 상단에 가까운 섹션 우선
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length === 0) return;

        const id = (visible[0].target as HTMLElement).id;
        if (id && id !== lastActiveRef.current) {
          // 스크롤 유발 없는 해시 교체
          window.history.replaceState(null, "", `#${id}`);
          lastActiveRef.current = id;
          setActive(id);
        }
      },
      {
        // 스티키 헤더 높이만큼 상단을 음수 마진 처리, 하단 60%는 제외해 과도한 전환 방지
        root: null,
        rootMargin: `-${topPx}px 0px -60% 0px`,
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      }
    );
    // 관찰 시작
    sectionElsRef.current.forEach((el) => io.observe(el));
    observerRef.current = io;

    return () => io.disconnect();
  }, [sections, topPx]);

  // 해시/브라우저 내비게이션 동기화
  useEffect(() => {
    if (typeof window === "undefined") return;
    const syncByHash = () => {
      const id = window.location.hash.slice(1);
      if (id && id !== lastActiveRef.current) {
        lastActiveRef.current = id;
        setActive(id);
      }
    };
    window.addEventListener("hashchange", syncByHash);
    window.addEventListener("popstate", syncByHash);
    return () => {
      window.removeEventListener("hashchange", syncByHash);
      window.removeEventListener("popstate", syncByHash);
    };
  }, []);

  return (
    <nav
      aria-label='섹션 내비게이션'
      className='sticky z-30 mb-6'
      style={{ top: topPx }}
    >
      <div className='mx-auto max-w-6xl'>
        <div
          className='relative flex gap-2 overflow-x-auto no-scrollbar px-1.5'
          role='tablist'
        >
          {sections.map(({ id, labelKey }) => {
            const selected = active === id;
            const fullTitle = t(`${id}.title` as const);

            return (
              <a
                key={id}
                href={`#${id}`}
                onClick={(e) => handleClick(e, id)}
                role='tab'
                aria-selected={selected}
                title={fullTitle}
                className={`h-9 px-3 text-sm leading-none rounded-md transition
                  ${
                    selected
                      ? "font-semibold underline underline-offset-8"
                      : "text-foreground/70 hover:text-foreground hover:bg-foreground/5"
                  }
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--ring]`}
              >
                <span className='block max-w-[10rem] truncate'>
                  {t(labelKey)}
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
