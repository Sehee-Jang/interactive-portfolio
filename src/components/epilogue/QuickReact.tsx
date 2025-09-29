"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

// 의도 키: 채용/인터뷰/피드백
type QuickIntentKey = "hire" | "interview" | "feedback";

// 버튼 옵션: 아이콘은 선택
export type QuickReactOption = {
  key: QuickIntentKey;
  icon?: React.ReactNode;
};

// 사용자 정의 옵션/핸들러/API 엔드포인트
type QuickReactProps = {
  options?: ReadonlyArray<QuickReactOption>;
  onSelect?: (intent: QuickIntentKey) => Promise<void> | void;
  apiEndpoint?: string; // 제공 시 POST 호출
};

export default function QuickReact({
  options,
  onSelect,
  apiEndpoint,
}: QuickReactProps) {
  const t = useTranslations("epilogue.quick");
  const [pending, setPending] = useState<QuickIntentKey | null>(null);
  const [doneKey, setDoneKey] = useState<QuickIntentKey | null>(null);
  const [error, setError] = useState<string>("");

  // 기본 버튼 3종
  const items: ReadonlyArray<QuickReactOption> = options ?? [
    { key: "hire" },
    { key: "interview" },
    { key: "feedback" },
  ];

  // 클릭 처리: onSelect → API POST(옵션) → 완료/오류 처리
  async function handleSelect(k: QuickIntentKey) {
    setError("");
    setPending(k);
    try {
      await onSelect?.(k);
      if (apiEndpoint) {
        const res = await fetch(apiEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ intent: k }),
        });
        if (!res.ok) throw new Error("bad_response");
      }
      setDoneKey(k);
      setTimeout(() => setDoneKey(null), 1500);
    } catch {
      setError(t("error"));
    } finally {
      setPending(null);
    }
  }

  return (
    <section
      aria-labelledby='quick-react-title'
      className='rounded-2xl border border-border bg-card p-6'
    >
      <h3 id='quick-react-title' className='text-lg font-semibold'>
        {t("title")}
      </h3>
      <p className='mt-1 text-sm text-muted-foreground'>{t("desc")}</p>

      {/* 오류 알림 박스 */}
      {error && (
        <div
          role='alert'
          className='mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700'
        >
          {error}
        </div>
      )}

      {/* 의사표시 버튼들 */}
      <div className='mt-4 grid gap-3 sm:grid-cols-3'>
        {items.map(({ key, icon }) => {
          const isPending = pending === key;
          const isDone = doneKey === key;
          return (
            <button
              key={key}
              type='button'
              data-intent={key}
              aria-pressed={isDone}
              disabled={isPending}
              onClick={() => handleSelect(key)}
              className='flex items-center justify-center gap-2 rounded-2xl border border-border px-4 py-3 transition hover:bg-muted disabled:opacity-60'
            >
              {icon}
              <span>
                {isDone
                  ? t("done")
                  : isPending
                  ? t("sending")
                  : t(`labels.${key}`)}
              </span>
            </button>
          );
        })}
      </div>

      <p className='mt-3 text-xs text-muted-foreground'>{t("note")}</p>
    </section>
  );
}
