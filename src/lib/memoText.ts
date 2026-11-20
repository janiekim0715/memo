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

/** parseBody의 반대: 저장된 블록을 입력 칸에서 고칠 수 있는 글(서식 표시 포함)로 되돌린다. */
export function blocksToBody(blocks: MemoBlock[]): string {
  const lines: string[] = [];
  blocks.forEach((block, i) => {
    switch (block.type) {
      case "heading":
        lines.push(`# ${block.text}`);
        break;
      case "subheading":
        lines.push(`## ${block.text}`);
        break;
      case "paragraph":
        lines.push(block.text);
        break;
      case "list":
        // 목록 둘이 붙어 있으면 한 목록으로 합쳐지지 않게 빈 줄을 둔다.
        if (blocks[i - 1]?.type === "list") lines.push("");
        for (const item of block.items) lines.push(`- ${item}`);
        break;
    }
  });
  return lines.join("\n");
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
