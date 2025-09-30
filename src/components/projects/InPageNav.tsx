"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import type { AnchorId } from "./FullpageClient";

type Section = { id: AnchorId; labelKey: `ch${1 | 2 | 3 | 4}.nav` };

export default function InPageNav() {
  const t = useTranslations();

  // 네비 섹션 정의
  const sections: readonly Section[] = useMemo(
    () => [
      { id: "ch1", labelKey: "ch1.nav" },
      { id: "ch2", labelKey: "ch2.nav" },
      { id: "ch3", labelKey: "ch3.nav" },
      { id: "ch4", labelKey: "ch4.nav" },
    ],
    []
  );

  // 초기 활성
  const [active, setActive] = useState<string>(() => {
    if (typeof window === "undefined") return sections[0]?.id ?? "";
    const hash = window.location.hash.slice(1);
    return (hash || sections[0]?.id) ?? "";
  });

  // 스티키 top 계산
  const appbarH =
    typeof window !== "undefined"
      ? parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--appbar-h"
          ) || "56"
        ) || 56
      : 56;
  const topPx = appbarH + 12;

  // refs
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sectionElsRef = useRef<HTMLElement[]>([]);
  const lastActiveRef = useRef<string>(active);

  // fullpage 이동 헬퍼(폴백 포함)
  const moveTo = useCallback((id: AnchorId) => {
    const api = (
      window as unknown as { fullpage_api?: { moveTo: (a: string) => void } }
    ).fullpage_api;
    if (api?.moveTo) api.moveTo(id);
    else location.hash = `#${id}`;
  }, []);

  // 탭 클릭
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, id: AnchorId) => {
      e.preventDefault();
      moveTo(id);
      lastActiveRef.current = id;
      setActive(id);
    },
    [moveTo]
  );

  // 스크롤 연동(풀페이지 없이도 동작하도록 안전망 유지)
  useEffect(() => {
    if (typeof window === "undefined") return;

    sectionElsRef.current = sections
      .map(({ id }) => document.getElementById(id) as HTMLElement | null)
      .filter((el): el is HTMLElement => Boolean(el));

    observerRef.current?.disconnect();

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length === 0) return;

        const id = (visible[0].target as HTMLElement).id;
        if (id && id !== lastActiveRef.current) {
          history.replaceState(null, "", `#${id}`);
          lastActiveRef.current = id;
          setActive(id);
        }
      },
      {
        root: null,
        rootMargin: `-${topPx}px 0px -60% 0px`,
        threshold: [0, 0.5, 1],
      }
    );

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
