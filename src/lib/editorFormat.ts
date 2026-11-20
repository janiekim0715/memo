/*
 * 본문 입력 칸의 서식 버튼 동작.
 * 글자 위치(selection)와 글을 받아 바뀐 글과 새 위치를 돌려주는 순수 함수들이다.
 */

export type LineFormat = "heading" | "subheading" | "list";
export type FormatState = { bold: boolean } & Record<LineFormat, boolean>;
export type EditResult = { text: string; start: number; end: number };

const PREFIX: Record<LineFormat, string> = {
  heading: "# ",
  subheading: "## ",
  list: "- ",
};

function lineStart(text: string, pos: number) {
  return pos === 0 ? 0 : text.lastIndexOf("\n", pos - 1) + 1;
}

function lineEnd(text: string, pos: number) {
  const index = text.indexOf("\n", pos);
  return index === -1 ? text.length : index;
}

function lineFormatOf(line: string): LineFormat | null {
  if (line.startsWith("## ")) return "subheading";
  if (line.startsWith("# ")) return "heading";
  if (line.startsWith("- ")) return "list";
  return null;
}

/** 커서가 있는 줄·글자의 서식 (State=Active로 보일 버튼) */
export function getFormatState(text: string, start: number, end: number): FormatState {
  const from = lineStart(text, start);
  const line = text.slice(from, lineEnd(text, start));
  const current = lineFormatOf(line);

  const wrapped =
    start !== end &&
    start >= 2 &&
    text.slice(start - 2, start) === "**" &&
    text.slice(end, end + 2) === "**";
  const insideBold = (text.slice(from, start).split("**").length - 1) % 2 === 1;

  return {
    bold: wrapped || insideBold,
    heading: current === "heading",
    subheading: current === "subheading",
    list: current === "list",
  };
}

/** 커서가 있는 줄의 제목/소제목/목록 표시를 켜고 끈다. */
export function toggleLineFormat(
  text: string,
  start: number,
  end: number,
  format: LineFormat,
): EditResult {
  const from = lineStart(text, start);
  const line = text.slice(from, lineEnd(text, start));
  const current = lineFormatOf(line);
  const currentLength = current ? PREFIX[current].length : 0;
  const next = current === format ? "" : PREFIX[format];
  const delta = next.length - currentLength;
  // 줄 맨 앞에 있던 커서도 새로 생긴 표시 뒤로 옮긴다 (그래야 이어서 쓴 글이 표시 뒤에 붙는다).
  const move = (pos: number) =>
    pos < from ? pos : Math.max(from + next.length, pos + delta);

  return {
    text: text.slice(0, from) + next + text.slice(from + currentLength),
    start: move(start),
    end: move(end),
  };
}

/** 고른 글자를 굵게 하거나 되돌린다. 고른 글자가 없으면 **** 를 넣고 가운데에 둔다. */
export function toggleBold(text: string, start: number, end: number): EditResult {
  if (start === end) {
    return {
      text: text.slice(0, start) + "****" + text.slice(end),
      start: start + 2,
      end: start + 2,
    };
  }
  const selected = text.slice(start, end);

  if (start >= 2 && text.slice(start - 2, start) === "**" && text.slice(end, end + 2) === "**") {
    return {
      text: text.slice(0, start - 2) + selected + text.slice(end + 2),
      start: start - 2,
      end: end - 2,
    };
  }
  if (selected.length >= 4 && selected.startsWith("**") && selected.endsWith("**")) {
    const inner = selected.slice(2, -2);
    return {
      text: text.slice(0, start) + inner + text.slice(end),
      start,
      end: start + inner.length,
    };
  }
  return {
    text: text.slice(0, start) + "**" + selected + "**" + text.slice(end),
    start: start + 2,
    end: end + 2,
  };
}
