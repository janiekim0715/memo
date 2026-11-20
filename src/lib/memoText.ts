import type { MemoBlock } from "@/data/memos";

/*
 * 작성 화면의 본문은 간단한 표시로 서식을 담는다.
 *   # 제목   ## 소제목   - 목록   **굵게**
 * 저장할 때 이 글을 상세 화면이 읽는 블록(MemoBlock)으로 바꾼다.
 */

const stripBold = (text: string) => text.replaceAll("**", "");

export function parseBody(text: string): MemoBlock[] {
  const blocks: MemoBlock[] = [];
  let list: string[] | null = null;

  const flushList = () => {
    if (list && list.length > 0) blocks.push({ type: "list", items: list });
    list = null;
  };

  for (const raw of text.split("\n")) {
    const line = raw.trim();
    // 서식 버튼만 눌러 표시("- ", "# ")만 남은 줄은 빈 줄로 본다.
    if (!line || /^(##|#|-) +$/.test(raw.replace(/\r$/, ""))) {
      flushList();
    } else if (line.startsWith("## ")) {
      flushList();
      const content = stripBold(line.slice(3).trim());
      if (content) blocks.push({ type: "subheading", text: content });
    } else if (line.startsWith("# ")) {
      flushList();
      const content = stripBold(line.slice(2).trim());
      if (content) blocks.push({ type: "heading", text: content });
    } else if (line.startsWith("- ")) {
      const content = line.slice(2).trim();
      if (content) (list ??= []).push(content);
    } else {
      flushList();
      blocks.push({ type: "paragraph", text: line });
    }
  }
  flushList();
  return blocks;
}

/** 목록에 보일 한 줄 미리보기: 첫 줄에서 서식 표시를 뺀 글 */
export function previewOf(text: string): string {
  for (const line of text.split("\n")) {
    const preview = stripBold(line.trim().replace(/^(##|#|-)(\s+|$)/, "")).trim();
    if (preview) return preview;
  }
  return "";
}

/** 예) 10월 30일 오전 9:12 */
export function formatCreatedAt(date: Date): string {
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const period = hours < 12 ? "오전" : "오후";
  return `${date.getMonth() + 1}월 ${date.getDate()}일 ${period} ${hours % 12 || 12}:${minutes}`;
}
