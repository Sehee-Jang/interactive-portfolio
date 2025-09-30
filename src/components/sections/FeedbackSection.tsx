"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Star } from "lucide-react";
import { useMemo } from "react";

type FeedbackRole = "student" | "tutor";
type FeedbackItem = Readonly<{
  author?: string;
  role: FeedbackRole;
  text: string;
}>;

const RAW_FEEDBACKS: ReadonlyArray<FeedbackItem> = [
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
  {
    author: "신지민",
    role: "student",
    text: "필요한 시간에 누구나 공평하게 기회를 얻을 수 있는 구조라 긍정적으로 느꼈다.",
  },
  {
    author: "정기식",
    role: "tutor",
    text: "예전에는 학생들이 갑자기 찾아오면 준비가 부족한 상태에서 상담을 시작해야 할 때가 많았는데, 이제는 예약을 미리 확인하고 준비할 수 있어서 상담이 훨씬 알차졌습니다. 덕분에 학생들에게 더 깊이 있는 피드백을 줄 수 있게 됐어요.",
  },
  {
    author: "남궁찬양",
    role: "tutor",
    text: "예약 정보를 미리 확인할 수 있으니까, 어떤 주제나 질문이 들어올지 예상할 수 있고 그에 맞게 준비할 수 있어요. 그래서 피드백의 질도 높아지고, 학생 입장에서도 훨씬 도움이 된다고 느낄 것 같아요.",
  },
  {
    author: "홍윤정",
    role: "tutor",
    text: "학생들이 언제, 어떤 주제로 찾아올지를 예측할 수 있다는 게 큰 장점이에요. 덕분에 그냥 즉흥적으로 답하는 게 아니라, 사전에 고민하고 준비해서 훨씬 더 만족스러운 상담을 만들어줄 수 있게 됐습니다.",
  },
  {
    author: "김다희",
    role: "tutor",
    text: "가장 큰 변화는 학생들이 어떤 질문을 준비해 오는지 미리 알 수 있다는 점이에요. 예전에는 갑작스럽게 질문이 들어오면 바로 답변하기 힘들 때도 있었는데, 지금은 미리 내용을 보고 정리해둘 수 있어서 훨씬 안정적으로 피드백을 줄 수 있습니다.",
  },
  {
    author: "송조해",
    role: "tutor",
    text: "학생들이 언제 올지 미리 스케줄을 확인할 수 있으니까 제 시간 관리가 훨씬 수월해졌어요. 튜터링 시간에 맞춰 다른 일정을 조율할 수 있어서 저도 효율적이고, 학생들도 더 안정적으로 시간을 보낼 수 있게 됐습니다.",
  },
  {
    author: "박소연",
    role: "tutor",
    text: "기존 시스템보다 훨씬 보기 편하고 체계적으로 관리가 되다 보니, 튜터링을 진행하는 과정이 한결 여유로워졌습니다. 학생들도 더 명확하게 예약하고 오는 것 같아서, 서로에게 긍정적인 효과가 있는 것 같아요.",
  },
] as const;

/** 작성자 마스킹: 박소정 → 박** */
function maskAuthor(name: string): string {
  if (!name) return "";
  const [first, ...rest] = name;
  return `${first}${"*".repeat(Math.max(1, rest.length))}`;
}
const roleLabel = (r: FeedbackRole) => (r === "student" ? "수강생" : "튜터");

/** 무한 세로 마키(컬럼) – 위/아래 번갈아 이동 */
function MarqueeColumn({
  items,
  reverse = false,
  speed = 28, // 초 단위(컬럼 이동 주기)
}: {
  items: FeedbackItem[];
  reverse?: boolean;
  speed?: number;
}) {
  // 끊김 없이 루프시키기 위해 2배로 렌더
  const loop = useMemo(() => items.concat(items), [items]);

  return (
    <div className='relative h-[62svh] sm:h-[66svh] overflow-hidden'>
      {/* 상/하단 페이드 마스크 */}
      <div
        aria-hidden
        className='pointer-events-none absolute inset-0'
        style={{
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, black 8%, black 92%, transparent)",
          maskImage:
            "linear-gradient(to bottom, transparent, black 8%, black 92%, transparent)",
        }}
      />
      {/* 호버 시 일시정지하려고 부모에 group 사용 */}
      <div className='group/col h-full'>
        <div
          className={[
            "flex flex-col gap-4",
            reverse ? "animate-marquee-up" : "animate-marquee-down",
            "group-hover/col:[animation-play-state:paused]",
            "motion-reduce:animate-none", // 접근성: 모션 최소화
          ].join(" ")}
          style={{ animationDuration: `${speed}s` }}
        >
          {loop.map((fb, i) => (
            <motion.article
              key={`${fb.role}-${fb.author ?? i}-${i}`}
              className='rounded-2xl border border-border bg-card/90 p-4 shadow-sm hover:shadow-md transition-shadow break-inside-avoid'
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 0.25 }}
            >
              <div className='mb-2 flex items-center justify-between'>
                <div className='inline-flex items-center gap-1.5 text-primary'>
                  <Star className='size-4 fill-current' aria-hidden />
                  <span className='text-[13px] font-semibold'>5.0</span>
                </div>
                <div className='text-[12px] text-muted-foreground'>
                  {fb.author ? maskAuthor(fb.author) : "익명"} ·{" "}
                  {roleLabel(fb.role)}
                </div>
              </div>
              <p className='text-[14px] leading-relaxed'>“{fb.text}”</p>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function FeedbackSection() {
  const t = useTranslations("ch4");

  // 3개 레인으로 나눠서 컬럼별 독립 루프
  const lanes = useMemo(() => {
    const a: FeedbackItem[] = [];
    const b: FeedbackItem[] = [];
    const c: FeedbackItem[] = [];
    RAW_FEEDBACKS.forEach((fb, i) => {
      (i % 3 === 0 ? a : i % 3 === 1 ? b : c).push(fb);
    });
    return [a, b, c] as const;
  }, []);

  return (
    <section className='relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20'>
      {/* 헤드라인 – 살짝 페이드인 */}
      <motion.header
        className='mb-10 sm:mb-12 text-center'
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35 }}
      >
        <p className='text-sm font-medium text-primary/80'>{t("title")}</p>
        <h2 className='mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight'>
          {t("headline")}
        </h2>
      </motion.header>

      {/* 3-컬럼 무한 스크롤(마키) – 가운데 컬럼은 반대 방향/다른 속도 */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <MarqueeColumn items={lanes[0]} speed={30} />
        <MarqueeColumn items={lanes[1]} reverse speed={34} />
        <MarqueeColumn items={lanes[2]} speed={32} />
      </div>

      {/* 전체 섹션 Hover 시 일시정지 원하면 아래 주석 해제
      <div className="mt-4 text-center text-xs text-muted-foreground">
        마우스를 올리면 흐름이 멈춥니다.
      </div> */}
    </section>
  );
}
