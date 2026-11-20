export type MemoLabel = "blue" | "green" | "orange" | "pink";

/** 본문 블록. 문단 안의 **굵게**는 굵은 글씨로 보여 준다. */
export type MemoBlock =
  | { type: "heading"; text: string }
  | { type: "subheading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] };

/*
 * 메모 자체는 Supabase의 memos 표에 있다 (src/lib/memoApi.ts).
 * 여기에는 화면에서 쓰는 메모의 모양만 둔다.
 */
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

/** 상세 화면이 있는 메모 (Supabase에서 읽은 메모는 모두 여기에 속한다) */
export type DetailedMemo = Memo & { detail: NonNullable<Memo["detail"]> };
