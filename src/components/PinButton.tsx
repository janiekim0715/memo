"use client";

import { pinnedMemos } from "@/data/memos";
import { setPinned, usePins } from "@/lib/memoStore";
import { IconButton } from "./IconButton";
import { IconPin } from "./icons";

/**
 * 상세 화면의 고정 버튼(Button/Pin).
 * 누르면 이 메모가 "고정한 메모"로 옮겨지고, 고정된 메모에서 다시 누르면 "최근 메모"로 돌아간다.
 */
export function PinButton({ id }: { id: string }) {
  const pins = usePins();
  const pinned = pins[id]?.pinned ?? pinnedMemos.some((memo) => memo.id === id);

  return (
    <IconButton
      label={pinned ? "고정 해제" : "고정"}
      pressed={pinned}
      onClick={() => setPinned(id, !pinned)}
    >
      <IconPin />
    </IconButton>
  );
}
