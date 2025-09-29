import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Github, Mail, Linkedin } from "lucide-react";
import PrevNextNav from "./PrevNextNav";

export default async function Footer() {
  const t = await getTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer
      aria-label={t("ariaLabel")}
      className='border-t border-border bg-card'
    >
      <div className='mx-auto max-w-6xl px-4 py-12 md:px-6'>
        {/* 상단: 브랜드/소개 + 내비게이션 */}
        <div className='grid gap-10 md:grid-cols-3'>
          {/* 브랜드 블록: 홈 링크 + 태그라인 + 소셜 아이콘 + 이전/다음 내비 */}
          <div>
            <Link
              href='/'
              className='text-xl font-semibold tracking-tight hover:opacity-90'
            >
              {t("brand")}
            </Link>
            <p className='mt-3 text-sm text-muted-foreground'>{t("tagline")}</p>

            {/* 소셜: GitHub / 이메일 / LinkedIn */}
            <div className='mt-4 flex items-center gap-3'>
              <a
                href='https://github.com/Sehee-Jang'
                target='_blank'
                rel='noreferrer'
                aria-label='GitHub'
                className='rounded-lg p-2 hover:bg-muted'
              >
                <Github size={18} />
              </a>
              <a
                href='mailto:seheejang.korea@gmail.com'
                aria-label={t("contactEmail")}
                className='rounded-lg p-2 hover:bg-muted'
              >
                <Mail size={18} />
              </a>
              <a
                href='https://www.linkedin.com/in/seheejang'
                target='_blank'
                rel='noreferrer'
                aria-label='LinkedIn'
                className='rounded-lg p-2 hover:bg-muted'
              >
                <Linkedin size={18} />
              </a>
            </div>

            {/* 페이지 간 이전/다음 네비게이션 */}
            <div className='mt-8'>
              <PrevNextNav variant='compact' />
            </div>
          </div>

          {/* 사이트 섹션 내비게이션: 프로젝트 내 앵커로 이동 */}
          <nav className='grid grid-cols-2 gap-6 md:col-span-2 md:grid-cols-4'>
            <div>
              <h3 className='text-sm font-medium'>{t("sections.title")}</h3>
              <ul className='mt-3 space-y-2 text-sm text-muted-foreground'>
                <li>
                  <Link
                    className='hover:text-foreground'
                    href={{ pathname: "/projects", hash: "ch1" }}
                  >
                    {t("sections.why")}
                  </Link>
                </li>
                <li>
                  <Link
                    className='hover:text-foreground'
                    href={{ pathname: "/projects", hash: "ch2" }}
                  >
                    {t("sections.projects")}
                  </Link>
                </li>
                <li>
                  <Link
                    className='hover:text-foreground'
                    href={{ pathname: "/projects", hash: "ch3" }}
                  >
                    {t("sections.impact")}
                  </Link>
                </li>
                <li>
                  <Link
                    className='hover:text-foreground'
                    href={{ pathname: "/projects", hash: "ep" }}
                  >
                    {t("sections.contact")}
                  </Link>
                </li>
              </ul>
            </div>

            {/* 리소스: 소스/배포 링크 (외부) */}
            <div>
              <h3 className='text-sm font-medium'>{t("resources.title")}</h3>
              <ul className='mt-3 space-y-2 text-sm text-muted-foreground'>
                <li>
                  <a
                    className='hover:text-foreground'
                    href='https://github.com/Sehee-Jang/tutoring-schedule'
                    target='_blank'
                    rel='noreferrer'
                  >
                    {t("resources.source")}
                  </a>
                </li>
                <li>
                  <a
                    className='hover:text-foreground'
                    href='https://tutoring-schedule.vercel.app/'
                    target='_blank'
                    rel='noreferrer'
                  >
                    {t("resources.deploy")}
                  </a>
                </li>
              </ul>
            </div>

            {/* 연락 섹션: 에필로그(컨택트)로 이동 */}
            <div>
              <h3 className='text-sm font-medium'>{t("contact.title")}</h3>
              <ul className='mt-3 space-y-2 text-sm text-muted-foreground'>
                <li>
                  <Link className='hover:text-foreground' href='/epilogue'>
                    {t("contact.cta")}
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        {/* 하단: 카피라이트 */}
        <div className='mt-10 border-t border-border pt-6 text-xs text-muted-foreground'>
          <p>
            © {year} {t("brand")}. {t("rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
