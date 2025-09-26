import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");
  return (
    <footer>
      <div>
        {/* 개인정보 */}
        <div>
          <p>이름: </p>
          <p>Github: </p>
          <p>Email: </p>
        </div>
      </div>

      {/* 저작권 */}
      <div>
        <span>SEHEE JANG © 2025. All rights reserved.</span>
      </div>
    </footer>
  );
}
