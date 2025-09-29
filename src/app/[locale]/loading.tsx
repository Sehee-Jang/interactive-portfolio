import LoadingScreen from "@/components/common/LoadingScreen";

export default function LocaleRootLoading() {
  // 메시지는 간단하게. 다국어가 필요하면 getTranslations 사용 가능.
  return <LoadingScreen message='페이지를 불러오는 중…' fullscreen />;
}
