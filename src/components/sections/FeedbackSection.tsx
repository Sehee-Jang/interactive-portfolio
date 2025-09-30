"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useState } from "react";

type FeedbackRole = "student" | "tutor";

/* 말풍선 피드백 고정 목록: 텍스트 키와 역할 키 */
type FeedbackItem = Readonly<{
  author?: string; // 익명/집단 의견은 생략 가능
  role: FeedbackRole;
  text: string;
}>;

const feedbacks: ReadonlyArray<FeedbackItem> = [
  {
    author: "박소정",
    role: "student",
    text: "튜터님 예약 시스템 진짜 신의 한수라 생각합니다 최고에요 1시간동안 튜터님 기다려본 적이 있다보니 시간 활용을 잘 할 수 있어서 정말 도움이 많이 되었고 감사드립니다.",
  },
  {
    author: "최지원",
    role: "student",
    text: "아침에 사기를 북돋기 위해서 라디오나 음악을 틀어주시는 등 노력해주셔서 감사했습니다. 또한 매니저님들께 무언가를 요청하면 바로바로 수행을 해주셔서 좋았습니다. 튜터링 예약 시스템을 만들어주시거나 노션 및 일정관리 등 체계적으로 학습할 수 있도록 많은 도움을 주셨습니다. 그동안 감사했습니다.",
  },
  {
    author: "박경희",
    role: "student",
    text: "예약 가능한 시간이 명확하게 보임, 실시간 예약 현황이 보기 쉬움, 예약 수정·취소가 쉬웠어요.",
  },
  {
    author: "배유림",
    role: "student",
    text: "너무 좋아요~ 예약 가능한 시간이나 현황을 한눈에 파악할 수 있고, 수정까지 돼서 너무 좋아요.",
  },
  {
    author: "조하음",
    role: "student",
    text: "정해진 시간에 기다림 없이 튜터링 가능해서 스케줄 관리에 좋다",
  },
  {
    author: "이재민",
    role: "student",
    text: "예전처럼 문 앞에서 오래 기다릴 필요가 없어져 편리했다.",
  },
  {
    author: "성가은",
    role: "student",
    text: "예약 현황을 한눈에 확인할 수 있어 좋다",
  },
  { author: "정기식", role: "tutor", text: "상담 준비가 더 철저히 가능해짐" },
  {
    author: "남궁찬양",
    role: "tutor",
    text: "예약 정보를 미리 알고 준비할 수 있어, 피드백의 질이 높아졌습니다.",
  },
  {
    author: "신지민",
    role: "student",
    text: "필요한 시간에 누구나 공평하게 기회를 얻을 수 있는 구조라 긍정적으로 느꼈다.",
  },
  {
    author: "홍윤정",
    role: "tutor",
    text: "수강생들이 언제 무슨 내용으로 찾아 올건지 예측할 수 있는 부분이 좋습니다.",
  },
  {
    author: "김다희",
    role: "tutor",
    text: "가장 큰 도움이되는 부분은 어떤 내용을 가지고 오는지 미리 파악하고 피드백해줄 내용을 정리해볼 수 있어서 좋습니다. 갑자기 질문을 하면 당황스러운데 질문을 미리 볼 수 있어서 좋습니다.",
  },
  {
    author: "송조해",
    role: "tutor",
    text: "학생들이 언제 튜터링을 하러올지 미리 스케쥴을 파악할 수 있어서 시간관리하기 좋습니다.",
  },
  {
    author: "박소연",
    role: "tutor",
    text: "기존 시스템보다 보기가 훨씬 좋고 체계적으로 튜터링을 할 수 있어서 좋습니다.",
  },
] as const;

export default function FeedbackSection() {
  const t = useTranslations("ch4");

  return (
    <section className='relative mx-auto max-w-5xl px-6 py-24'>
      {/* 타이틀 & 메시지 */}
      <div className='mb-16 text-center'>
        <h2 className='text-3xl font-bold'>{t("title")}</h2>
        <p className='mt-2 text-muted-foreground'>{t("headline")}</p>
      </div>

      {/* 레이아웃: 데스크톱 2~3열, 카드 간격 확대 */}
      <div className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3'>
        {feedbacks.map((fb, i) => (
          <motion.div
            key={`${fb.role}-${fb.author ?? i}`}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, delay: i * 0.03 }}
            viewport={{ once: true }}
          >
            <FeedbackCard author={fb.author} role={fb.role} text={fb.text} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
/* 카드 컴포넌트: 접기/펼치기 + 대비 강화 */
function FeedbackCard({
  author,
  role,
  text,
}: Readonly<{ author?: string; role: FeedbackRole; text: string }>) {
  const [open, setOpen] = useState(false);
  const isLong = text.length > 140;

  // 역할 뱃지 색상
  const roleBadge =
    role === "student"
      ? "bg-emerald-600/15 text-emerald-500 border-emerald-600/30"
      : "bg-indigo-600/15 text-indigo-500 border-indigo-600/30";

  return (
    <figure className='rounded-2xl border border-border bg-card/90 px-5 py-4 shadow-sm hover:shadow-md transition-shadow'>
      {/* 본문: 기본 3줄, 더 보기로 확장 */}
      <blockquote
        className={`text-[15px] leading-relaxed ${open ? "" : "line-clamp-3"}`}
      >
        “{text}”
      </blockquote>

      {/* 그라데이션 오버레이로 '더 보기' 유도 */}
      {!open && isLong && (
        <div className='pointer-events-none -mt-6 h-6 bg-gradient-to-t from-card to-transparent' />
      )}

      {/* 작성자/역할 */}
      <figcaption className='mt-3 flex items-center justify-between gap-3'>
        <div className='text-xs text-muted-foreground'>
          — {author ? `${author} · ` : ""}
          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 ${roleBadge}`}
          >
            {role === "student" ? "수강생" : "튜터"}
          </span>
        </div>

        {/* 더 보기 토글 */}
        {isLong && (
          <button
            type='button'
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className='text-xs font-medium text-primary hover:underline'
          >
            {open ? "접기" : "더 보기"}
          </button>
        )}
      </figcaption>
    </figure>
  );
}
