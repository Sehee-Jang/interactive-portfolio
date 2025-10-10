"use client";

import React, { useState } from "react";
import ReactFullpage from "@fullpage/react-fullpage";
import WhySection from "@/components/sections/WhySection";
import ProjectsShowcaseSection from "@/components/sections/ProjectsShowcaseSection";
import ImpactSection from "@/components/sections/ImpactSection";
import NextJoySection from "@/components/sections/NextJoySection";
import FeedbackSection from "../sections/FeedbackSection";

/* fullpage 앵커(주소 해시) 상수 + 유니온 타입 */
const ANCHORS = ["ch1", "ch2", "ch3", "ch4", "ch5"] as const;
export type AnchorId = (typeof ANCHORS)[number];

type Labels = readonly [string, string, string, string, string];

interface FullpageClientProps {
  navLabels: Labels; // 서버에서 번역된 네비 라벨
  paddingTop?: number; // 고정 헤더 높이 보정(px)
}

export default function FullpageClient({
  navLabels,
  paddingTop = 0,
}: FullpageClientProps) {
  // fullPage 초기화 완료 여부 -> 초기 깜밖임 방지용 클래스 전환
  const [ready, setReady] = useState(false);

  return (
    // 초기엔 fp-initializing로 레이아웃 고정, afterRender 이후 fp-ready
    <div className={ready ? "fp-ready" : "fp-initializing"}>
      <ReactFullpage
        anchors={[...ANCHORS]} // 해시와 섹션 동기화
        navigation // 우측 점 네비 및 툴팁
        navigationTooltips={[...navLabels]}
        showActiveTooltip
        scrollingSpeed={700} // 스크롤 속도
        lockAnchors={false} // 해시를 잠그지 않음(수동 변경 가능)
        paddingTop={`${paddingTop}px`} // 고정 헤더가 있다면 겹침 방지용 상단 보정
        verticalCentered={true} // 중앙 정렬 여부 (true: 콘텐츠를 수직 중앙에 배치)
        licenseKey={
          process.env.NEXT_PUBLIC_FULLPAGE_LICENSE_KEY ?? "gplv3-license"
        }
        credits={{
          // 표시/위치/라벨
          enabled: true,
          label: "Made with fullPage.js",
          position: "right",
        }}
        normalScrollElements={".js-scrollable"} // 스크롤 가능한 요소 지정
        afterLoad={(_, dest) => {
          // 섹션 집입 시 해시 동기화
          const id = dest.anchor;
          if (id && window.location.hash !== `#${id}`) {
            history.replaceState(null, "", `#${id}`); // 스크롤 점프 없음
          }
        }}
        afterRender={() => {
          // 초기화 완료 시 깜빡임 방지용
          setReady(true);
        }}
        // 렌더 프로프: 각 섹션은 .section을 반드시 포함
        render={() => (
          <ReactFullpage.Wrapper>
            <section className='section'>
              <WhySection />
            </section>
            <section className='section'>
              <ProjectsShowcaseSection />
            </section>
            <section className='section'>
              <ImpactSection />
            </section>
            <section className='section'>
              <FeedbackSection />
            </section>
            <section className='section'>
              <NextJoySection />
            </section>
          </ReactFullpage.Wrapper>
        )}
      />
    </div>
  );
}
