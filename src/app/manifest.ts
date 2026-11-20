import type { MetadataRoute } from "next";

// 웹 앱 매니페스트: 휴대폰 홈 화면에 추가하면 이 정보로 앱처럼 열린다.
// 매니페스트에는 CSS 변수를 쓸 수 없어서 색은 값으로 적는다.
//   surface/page Light = #F2F4F6 (시작 화면 배경, 상단 바 색)
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "메모",
    short_name: "메모",
    description: "간단한 메모 앱",
    lang: "ko",
    dir: "ltr",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#F2F4F6",
    theme_color: "#F2F4F6",
    categories: ["productivity", "utilities"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    // 홈 화면 아이콘을 길게 누르면 나오는 바로가기
    shortcuts: [
      {
        name: "새 메모 쓰기",
        short_name: "새 메모",
        url: "/write",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
      },
    ],
  };
}
