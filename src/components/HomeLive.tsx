"use client";

import type { Memo } from "@/data/memos";
import { useMemoOverrides, useSavedMemos } from "@/lib/memoStore";
import { MemoCard } from "./MemoCard";

/** "128개" 처럼 남긴 메모 수. 이 브라우저에서 새로 쓴 메모만큼 늘어난다. */
export function MemoCount({ base }: { base: number }) {
  const saved = useSavedMemos();
  return <>{base + saved.length}개</>;
}

/** 고정한 메모 카드. 고친 메모는 고친 내용으로 보인다. */
export function PinnedMemoCard({ memos }: { memos: Memo[] }) {
  const overrides = useMemoOverrides();
  return (
    <MemoCard title="고정한 메모" memos={memos.map((memo) => overrides[memo.id] ?? memo)} pin />
  );
}

/** 최근 메모 카드. 이 브라우저에서 새로 쓴 메모가 맨 위에 보이고, 고친 메모는 고친 내용으로 보인다. */
export function RecentMemoCard({ memos }: { memos: Memo[] }) {
  const saved = useSavedMemos();
  const overrides = useMemoOverrides();
  return (
    <MemoCard
      title="최근 메모"
      memos={[...saved, ...memos.map((memo) => overrides[memo.id] ?? memo)]}
      action
    />
  );
}
