"use client";

import { useState } from "react";
import { setMemoPinned } from "@/lib/memoApi";
import { IconButton } from "./IconButton";
import { IconPin } from "./icons";

/**
 * 상세 화면의 고정 버튼(Button/Pin).
 * 누르면 이 메모가 "고정한 메모"로 옮겨지고, 고정된 메모에서 다시 누르면 "최근 메모"로 돌아간다.
 * 누르자마자 모양을 바꾸고, Supabase에 저장하지 못하면 되돌린다.
 */
export function PinButton({ id, initialPinned }: { id: string; initialPinned: boolean }) {
  const [pinned, setPinned] = useState(initialPinned);
  const [saving, setSaving] = useState(false);

  async function toggle() {
    const next = !pinned;
    setPinned(next);
    setSaving(true);
    try {
      await setMemoPinned(id, next);
    } catch {
      setPinned(!next);
    } finally {
      setSaving(false);
    }
  }

  return (
    <IconButton
      label={pinned ? "고정 해제" : "고정"}
      pressed={pinned}
      onClick={toggle}
      disabled={saving}
    >
      <IconPin />
    </IconButton>
  );
}
