"use client";

import type { Memo } from "@/data/memos";
import { useSavedMemos } from "@/lib/memoStore";
import { MemoCard } from "./MemoCard";

/** "128개" 처럼 남긴 메모 수. 이 브라우저에서 저장한 메모만큼 늘어난다. */
export function MemoCount({ base }: { base: number }) {
  const saved = useSavedMemos();
  return <>{base + saved.length}개</>;
}

/** 최근 메모 카드. 이 브라우저에서 저장한 메모가 맨 위에 보인다. */
export function RecentMemoCard({ memos }: { memos: Memo[] }) {
  const saved = useSavedMemos();
  return <MemoCard title="최근 메모" memos={[...saved, ...memos]} action />;
}
