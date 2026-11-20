import type { Metadata, Viewport } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "메모",
  description: "간단한 메모 앱",
  applicationName: "메모",
  // iOS: 홈 화면에서 열면 주소창 없이 앱처럼 열리고, 아이콘 아래 이름은 "메모"
  appleWebApp: {
    capable: true,
    title: "메모",
    statusBarStyle: "default",
  },
};

// 상단 바 색은 페이지 배경(surface/page)을 따른다. 메타 태그에는 CSS 변수를 못 써서 값으로 적는다.
//   Light #F2F4F6 / Dark #101014
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F2F4F6" },
    { media: "(prefers-color-scheme: dark)", color: "#101014" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${notoSansKr.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
