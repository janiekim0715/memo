export type MemoLabel = "blue" | "green" | "orange" | "pink";

/** 본문 블록. 문단 안의 **굵게**는 굵은 글씨로 보여 준다. */
export type MemoBlock =
  | { type: "heading"; text: string }
  | { type: "subheading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] };

export type Memo = {
  id: string;
  title: string;
  preview: string;
  /** 목록에 보이는 날짜 */
  date: string;
  label: MemoLabel;
  /** 상세 화면이 있는 메모만 채운다 */
  detail?: {
    category: string;
    /** 상세 화면 위쪽에 보이는 날짜 */
    createdAt: string;
    blocks: MemoBlock[];
  };
};

/** 상세 화면이 있는 메모 (이 브라우저에서 저장한 메모는 모두 여기에 속한다) */
export type DetailedMemo = Memo & { detail: NonNullable<Memo["detail"]> };

export const pinnedMemos: Memo[] = [
  {
    id: "design-review",
    title: "디자인 리뷰 회의록",
    preview: "검수 기준과 다음 할 일 정리",
    date: "오늘",
    label: "blue",
    detail: {
      category: "업무",
      createdAt: "10월 30일 오전 9:12",
      blocks: [
        { type: "heading", text: "회의 요약" },
        {
          type: "paragraph",
          text: "시안 검수 기준을 팀 규칙으로 정리했다. 목표는 **AI가 구현해도 깨지지 않는 시안**이다.",
        },
        { type: "subheading", text: "결정한 것" },
        {
          type: "list",
          items: [
            "묶음은 오토레이아웃, 늘어날 것은 Fill",
            "색과 간격은 변수로 연결",
            "시안은 프레임 링크로 넘기기",
          ],
        },
        { type: "subheading", text: "다음 할 일" },
        {
          type: "paragraph",
          text: "**금요일까지** 각자 맡은 화면을 채점해 온다. 점수보다 깎인 이유를 먼저 본다.",
        },
        { type: "subheading", text: "남은 질문" },
        {
          type: "paragraph",
          text: "다크 모드 색은 누가 정할지, 아이콘은 직접 그릴지 다음 회의에서 정한다.",
        },
      ],
    },
  },
  {
    // 내용은 Figma 글쓰기 화면(완성 예시/Write)의 "주말 등산 준비"
    id: "weekend-hiking",
    title: "주말 등산 준비",
    preview: "물 두 병, 간식, 바람막이 챙기기",
    date: "어제",
    label: "green",
    detail: {
      category: "개인",
      createdAt: "어제",
      blocks: [
        { type: "heading", text: "준비물" },
        { type: "list", items: ["물 두 병", "간식과 바람막이", "보조 배터리"] },
        { type: "subheading", text: "출발" },
        { type: "paragraph", text: "**토요일 오전 7시**에 집 앞에서 출발한다." },
      ],
    },
  },
];

export const recentMemos: Memo[] = [
  {
    id: "grocery-list",
    title: "장보기 목록",
    preview: "우유, 계란, 사과, 커피 원두",
    date: "오늘",
    label: "pink",
    // Figma에 상세 시안이 없어 목록의 미리보기 글에서 만든 내용
    detail: {
      category: "개인",
      createdAt: "오늘",
      blocks: [
        { type: "heading", text: "장 볼 것" },
        { type: "list", items: ["우유", "계란", "사과", "커피 원두"] },
      ],
    },
  },
  {
    id: "app-icon-idea",
    title: "앱 아이콘 아이디어",
    preview: "메모지 모서리가 접힌 모양",
    date: "오늘",
    label: "orange",
    detail: {
      category: "아이디어",
      createdAt: "오늘",
      blocks: [
        { type: "heading", text: "아이콘 방향" },
        { type: "paragraph", text: "메모지 모서리가 접힌 모양" },
      ],
    },
  },
  {
    id: "reading-list",
    title: "읽을 책",
    preview: "디자인 시스템 책 두 권",
    date: "어제",
    label: "green",
    detail: {
      category: "개인",
      createdAt: "어제",
      blocks: [
        { type: "heading", text: "읽을 책" },
        { type: "list", items: ["디자인 시스템 책 두 권"] },
      ],
    },
  },
];

export const allMemos: Memo[] = [...pinnedMemos, ...recentMemos];

export function findMemo(id: string): Memo | undefined {
  return allMemos.find((memo) => memo.id === id);
}
