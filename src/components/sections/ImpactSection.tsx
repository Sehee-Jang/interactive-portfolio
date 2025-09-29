"use client";

import { motion } from "framer-motion";
import { BarChart2, Clock, Smile } from "lucide-react";
import { useTranslations } from "next-intl";

/* 지표 카드 입력 타입: i18n 키 + 전/후 수치 + 단위 선택 */
type MetricCard = {
  labelKey: `metricLabels.${string}`;
  before: number;
  after: number;
  unitKey?: `units.${string}`;
};

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
    text: "예약 가능한 시간이 명확하게 보임, 실시간 예약 현황이 보기 쉬움, 예약 수정·취소가 쉬웠다는 의견 다수",
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

const roleLabel: Record<FeedbackRole, string> = {
  student: "수강생",
  tutor: "튜터",
};

export default function ImpactSection() {
  const t = useTranslations("ch3");

  // 프로젝트 별 실제 수치
  const metrics: ReadonlyArray<MetricCard> = [
    {
      labelKey: "metricLabels.duplicateBookings",
      before: 48,
      after: 2,
      unitKey: "units.count",
    },
    {
      labelKey: "metricLabels.opsInterventionMinutes",
      before: 98,
      after: 12,
      unitKey: "units.minutes",
    },
  ] satisfies ReadonlyArray<MetricCard>;

  return (
    <section className='relative mx-auto max-w-5xl px-6 py-24'>
      {/* 타이틀 & 메시지 */}
      <div className='mb-16 text-center'>
        <h2 className='text-3xl font-bold'>{t("title")}</h2>
        <p className='mt-2 text-muted-foreground'>{t("messageHeadline")}</p>
      </div>

      {/* 1) 성과 지표 (Before/After) */}
      <div className='mb-24'>
        <h3 className='mb-6 flex items-center gap-2 text-xl font-semibold'>
          <BarChart2 className='h-5 w-5' />
          {t("metrics")}
        </h3>

        {/* 지표 카드를 2열(모바일 1열) 그리드로 출력 */}
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          {metrics.map((m, idx) => {
            // 개선 여부/증감폭/부호/퍼센트 계산
            const improved = m.after < m.before;
            const delta = m.before - m.after;
            const sign = improved ? "↓" : "↑";
            const percent =
              m.before > 0 ? Math.round((Math.abs(delta) / m.before) * 100) : 0;

            // 라벨 및 단위 i18n
            const label = t(m.labelKey);
            const unit = m.unitKey ? t(m.unitKey) : "";

            return (
              <motion.div
                key={m.labelKey + idx.toString()}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: idx * 0.05 }}
                viewport={{ once: true }}
                className='rounded-2xl border border-border bg-card p-6 shadow'
              >
                {/* 보조 라벨 */}
                <p className='text-sm font-medium text-muted-foreground'>
                  {t("metricsLabel")}
                </p>

                {/* 지표명 + 증감 퍼센트 뱃지 */}
                <div className='mt-2 flex items-baseline justify-between'>
                  <h4 className='text-lg font-bold'>{label}</h4>
                  <span
                    className={`text-sm ${
                      improved ? "text-blue-600" : "text-rose-600"
                    }`}
                  >
                    {sign} {percent}%
                  </span>
                </div>

                {/* 미니 바 차트: before/after를 가로 막대로 표현 */}
                <div className='mt-4 space-y-3'>
                  {/* Before 막대 */}
                  <div>
                    <p className='text-xs text-muted-foreground'>
                      {t("beforeLabel")}
                    </p>
                    <div className='mt-1 h-2 rounded bg-muted/30'>
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${Math.min(100, m.before)}%` }}
                        transition={{ duration: 0.7 }}
                        viewport={{ once: true }}
                        className='h-2 rounded bg-muted'
                        aria-label='before-bar'
                      />
                    </div>
                    <span className='mt-1 block text-xs'>
                      {m.before}
                      {unit}
                    </span>
                  </div>

                  {/* After 막대 */}
                  <div>
                    <p className='text-xs text-muted-foreground'>
                      {t("afterLabel")}
                    </p>
                    <div className='mt-1 h-2 rounded bg-muted'>
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${Math.min(100, m.after)}%` }}
                        transition={{ duration: 0.7, delay: 0.15 }}
                        viewport={{ once: true }}
                        className='h-2 rounded bg-blue-500'
                        aria-label='after-bar'
                      />
                    </div>
                    <span className='mt-1 block text-xs'>
                      {m.after}
                      {unit}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 2) 사용자 피드백 (말풍선) */}
      <div className='mb-24'>
        <h3 className='mb-6 flex items-center gap-2 text-xl font-semibold'>
          <Smile className='h-5 w-5' />
          {t("feedback")}
        </h3>

        {/* 고정 배열을 순회하여 말풍선 렌더링 */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          {feedbacks.map((fb, i) => (
            <motion.figure
              key={`${fb.role}-${fb.author ?? i}`}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
              viewport={{ once: true }}
              className='rounded-2xl bg-muted px-4 py-3 shadow'
            >
              {/* 본문: 너무 길 경우 3줄로 클램프 */}
              <blockquote className='text-sm leading-relaxed line-clamp-3'>
                {fb.text}
              </blockquote>

              {/* 작성자/역할 라벨 */}
              <figcaption className='mt-2 text-xs text-muted-foreground'>
                — {fb.author ? `${fb.author} · ` : ""}
                {roleLabel[fb.role]}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>

      {/* 3) 조직 임팩트 (타임라인) */}
      <div>
        <h3 className='mb-6 flex items-center gap-2 text-xl font-semibold'>
          <Clock className='h-5 w-5' />
          {t("impact")}
        </h3>

        {/* 좌측 라인 타임라인 레이아웃 */}
        <div className='relative border-l border-border pl-6'>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
            viewport={{ once: true }}
            className='mb-10'
          >
            {/* 타임라인 노드 */}
            <span className='absolute -left-3 top-1.5 h-3 w-3 rounded-full bg-gray-400' />
            <p className='text-sm font-medium text-muted-foreground'>
              {t("beforeLabel")}
            </p>
            <p className='font-bold'>{t("ops.before")}</p>
          </motion.div>

          {/* After 상태 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
            viewport={{ once: true }}
          >
            <span className='absolute -left-3 top-1.5 h-3 w-3 rounded-full bg-green-500' />
            <p className='text-sm font-medium text-green-600'>
              {t("afterLabel")}
            </p>
            <p className='font-bold'>{t("ops.after")}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
