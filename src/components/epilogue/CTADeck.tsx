"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

// CTA 카드에 필요한 필수 링크/라벨
type CTADeckProps = {
  email: string;
  mailtoHref: string;
  resumeHref: string;
  resumeViewHref: string;
  githubHref: string;
  linkedinHref: string;
  githubLabel: string;
  linkedinLabel: string;
};

export default function CTADeck({
  email,
  mailtoHref,
  resumeHref,
  resumeViewHref,
  githubHref,
  linkedinHref,
  githubLabel,
  linkedinLabel,
}: CTADeckProps) {
  const t = useTranslations("epilogue.cta");
  const [copied, setCopied] = useState<boolean>(false);

  // 이메일 복사: 실패 시 번역된 경고 사용
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      alert(t("copyFallback"));
    }
  }

  return (
    <div className='grid gap-6 md:grid-cols-3'>
      {/* 1) 이력서 */}
      <article className='rounded-2xl border border-border bg-card p-6'>
        <h3 className='text-lg font-semibold'>{t("resume.title")}</h3>
        <p className='mt-2 text-sm text-muted-foreground'>{t("resume.desc")}</p>

        <div className='mt-4 flex flex-wrap gap-2'>
          {/* 다운로드 */}
          <a
            href={resumeHref}
            download
            className='rounded-2xl bg-primary px-4 py-2 text-white shadow transition hover:bg-primary-hover'
          >
            {t("resume.download")}
          </a>

          {/* 바로가기(노션 등) */}
          <a
            href={resumeViewHref}
            target='_blank'
            rel='noreferrer noopener'
            className='rounded-2xl border border-border px-4 py-2 transition hover:bg-muted'
          >
            {t("resume.view")}
          </a>
        </div>

        <p className='mt-2 text-xs text-muted-foreground'>{t("resume.note")}</p>
      </article>

      {/* 2) 이메일 */}
      <article className='rounded-2xl border border-border bg-card p-6'>
        <h3 className='text-lg font-semibold'>{t("emailCard.title")}</h3>
        <p className='mt-2 text-sm text-muted-foreground'>
          {t("emailCard.desc")}
        </p>
        <div className='mt-4 flex items-center gap-2'>
          {/* mailto: 사전 작성된 제목/본문 포함 */}
          <a
            href={mailtoHref}
            className='rounded-2xl bg-primary px-4 py-2 text-white shadow transition hover:bg-primary-hover'
          >
            {t("emailCard.button")}
          </a>
          {/* 이메일 주소 복사 버튼 */}
          <button
            onClick={copyEmail}
            className='rounded-2xl border border-border px-4 py-2 transition hover:bg-muted'
            type='button'
          >
            {copied ? t("emailCard.copied") : t("emailCard.copyEmail")}
          </button>
        </div>
        <p className='mt-2 text-xs text-muted-foreground'>{email}</p>
      </article>

      {/* 3) 프로필 */}
      <article className='rounded-2xl border border-border bg-card p-6'>
        <h3 className='text-lg font-semibold'>{t("profile.title")}</h3>
        <p className='mt-2 text-sm text-muted-foreground'>
          {t("profile.desc")}
        </p>
        <div className='mt-4 flex flex-wrap gap-2'>
          <a
            href={githubHref}
            target='_blank'
            rel='noreferrer'
            className='rounded-2xl border border-border px-4 py-2 transition hover:bg-muted'
          >
            {githubLabel}
          </a>
          <a
            href={linkedinHref}
            target='_blank'
            rel='noreferrer'
            className='rounded-2xl border border-border px-4 py-2 transition hover:bg-muted'
          >
            {linkedinLabel}
          </a>
        </div>
      </article>
    </div>
  );
}
