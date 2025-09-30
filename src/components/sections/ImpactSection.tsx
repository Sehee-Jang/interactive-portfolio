"use client";

import { motion } from "framer-motion";
import { BarChart2 } from "lucide-react";
import { useTranslations } from "next-intl";

/* 지표 카드 입력 타입: i18n 키 + 전/후 수치 + 단위 선택 */
type MetricCard = {
  labelKey: `metricLabels.${string}`;
  before: number;
  after: number;
  unitKey?: `units.${string}`;
};

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

export default function ImpactSection() {
  const t = useTranslations("ch3");

  return (
    <section className='relative mx-auto max-w-5xl px-6 py-24'>
      {/* 타이틀 & 메시지 */}
      <div className='mb-16 text-center'>
        <h2 className='text-3xl font-bold'>{t("title")}</h2>
        <p className='mt-2 text-muted-foreground'>{t("messageHeadline")}</p>
      </div>

      {/* 성과 지표 (Before/After) */}
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
    </section>
  );
}
