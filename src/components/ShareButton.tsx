"use client";

import type { MemoBlock } from "@/data/memos";
import { IconButton } from "./IconButton";
import { IconShare } from "./icons";

/** 공유할 글: 제목 + 본문을 서식 표시 없이 평문으로 만든다. */
function toShareText(title: string, blocks: MemoBlock[]): string {
  const lines = blocks.map((block) =>
    block.type === "list" ? block.items.map((item) => `• ${item}`).join("\n") : block.text,
  );
  return [title, ...lines].join("\n\n").replaceAll("**", "");
}

/**
 * 상세 화면의 공유 버튼(Button/Share).
 * 누르면 기기의 공유 시트(안드로이드는 공유 시트)를 띄운다.
 * 공유 시트를 쓸 수 없는 브라우저에서는 글을 클립보드에 복사한다.
 */
export function ShareButton({ title, blocks }: { title: string; blocks: MemoBlock[] }) {
  async function share() {
    const text = toShareText(title, blocks);
    try {
      if (typeof navigator.share === "function") {
        await navigator.share({ title, text });
      } else {
        await navigator.clipboard.writeText(text);
        window.alert("메모를 복사했어요.");
      }
    } catch {
      // 공유 시트를 닫으면 AbortError가 난다. 취소는 오류가 아니므로 넘어간다.
    }
  }

  return (
    <IconButton label="공유" onClick={share}>
      <IconShare />
    </IconButton>
  );
}
