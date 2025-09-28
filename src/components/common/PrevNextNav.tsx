"use client";

import { usePathname } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { routing, type AppLocale } from "@/i18n/routing";

type PathKey = "/" | "/projects" | "/epilogue";

/** 페이지 진행 순서와 i18n 라벨 키 매핑 */
const ORDER = [
  { path: "/" as const, labelKey: "prologue" },
  { path: "/projects" as const, labelKey: "projects" },
  { path: "/epilogue" as const, labelKey: "epilogue" },
] as const;

interface PrevNextNavProps {
  /** 푸터에는 "compact", 페이지 본문에는 "full" 추천 */
  variant?: "full" | "compact";
  className?: string;
}

/**
 * 현재 URL에서 로케일 접두어(예: /ko, /ja)를 제거해 기준 경로로 변환
 * 예) /ko/projects → /projects
 */
function stripLocale(pathname: string): PathKey {
  // 프로젝트에서 허용하는 로케일 집합 생성
  const locales = new Set(routing.locales as readonly AppLocale[]);

  // /를 제거한 경로 조각 배열 예) ["ko","projects"] 또는 ["projects"]
  const parts = pathname.split("/").filter(Boolean);

  // 첫 번째 조각이 로케일인지 판별
  const isLocalePrefixed =
    parts.length > 0 && locales.has(parts[0] as AppLocale);

  // 로케일이 있으면 두 번째 조각, 없으면 첫 번째 조각을 기준 경로로 사용
  const base = isLocalePrefixed ? `/${parts[1] ?? ""}` : `/${parts[0] ?? ""}`;

  // 루트 경로 보정
  return base === "/" || base === "//" ? "/" : (base as PathKey);
}

/**
 * 이전/다음 내비게이션 컴포넌트
 * - 현재 경로를 ORDER에서 찾아 이전(prev), 다음(next) 페이지를 계산
 * - variant가 "compact"이면 푸터용 간단 UI, "full"이면 넉넉한 버튼 UI 렌더링
 */
export default function PrevNextNav({
  variant = "full",
  className,
}: PrevNextNavProps) {
  const pathname = usePathname(); // 현재 경로
  const t = useTranslations("nav");

  // 로케일 접두어 제거 후 기준 경로 산출
  const basePath = stripLocale(pathname);

  // 진행 순서에서 현재 인덱스 찾기
  const idx = ORDER.findIndex((o) => o.path === basePath);

  // 이전/다음 대상 계산
  const prev = idx > 0 ? ORDER[idx - 1] : null;
  const next = idx >= 0 && idx < ORDER.length - 1 ? ORDER[idx + 1] : null;

  // 둘 다 없으면 렌더링 생략
  if (!prev && !next) return null;

  if (variant === "compact") {
    // 푸터용: 좌우에 작게 배치
    return (
      <nav
        aria-label={t("aria.pageNav")}
        className={["flex items-center justify-between gap-2", className]
          .filter(Boolean)
          .join(" ")}
      >
        <div>
          {prev && (
            <Link
              href={{ pathname: prev.path }}
              className='inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-muted'
              aria-label={t("aria.goPrev", {
                page: t(`pages.${prev.labelKey}`),
              })}
            >
              <ChevronLeft size={14} />
              {t(`pages.${prev.labelKey}`)}
            </Link>
          )}
        </div>
        <div>
          {next && (
            <Link
              href={{ pathname: next.path }}
              className='inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-muted'
              aria-label={t("aria.goNext", {
                page: t(`pages.${next.labelKey}`),
              })}
            >
              {t(`pages.${next.labelKey}`)}
              <ChevronRight size={14} />
            </Link>
          )}
        </div>
      </nav>
    );
  }

  // 기본(full): 페이지 하단에 쓰기 좋은 넓은 버튼 스타일
  return (
    <nav
      aria-label={t("aria.pageNav")}
      className={["mt-12 flex items-center justify-between", className]
        .filter(Boolean)
        .join(" ")}
    >
      <div>
        {prev && (
          <Link
            href={{ pathname: prev.path }}
            className='inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm hover:bg-muted'
            aria-label={t("aria.goPrev", { page: t(`pages.${prev.labelKey}`) })}
          >
            <ChevronLeft size={16} />
            {t(`pages.${prev.labelKey}`)}
          </Link>
        )}
      </div>
      <div>
        {next && (
          <Link
            href={{ pathname: next.path }}
            className='inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm hover:bg-muted'
            aria-label={t("aria.goNext", { page: t(`pages.${next.labelKey}`) })}
          >
            {t(`pages.${next.labelKey}`)}
            <ChevronRight size={16} />
          </Link>
        )}
      </div>
    </nav>
  );
}
