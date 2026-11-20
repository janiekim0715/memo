"use client";

import type { Memo } from "@/data/memos";
import { buildMemoLists } from "@/lib/memoLists";
import { useMemoOverrides, usePins, useSavedMemos } from "@/lib/memoStore";
import { MemoCard } from "./MemoCard";

/** "128개" 처럼 남긴 메모 수. 이 브라우저에서 새로 쓴 메모만큼 늘어난다. */
export function MemoCount({ base }: { base: number }) {
  const saved = useSavedMemos();
  return <>{base + saved.length}개</>;
}

/**
 * 홈의 "고정한 메모"와 "최근 메모" 카드.
 * 이 브라우저에서 새로 쓴 메모, 고친 내용, 고정 버튼으로 옮긴 결과를 합쳐서 보여 준다.
 * 메모가 하나도 없는 카드는 숨긴다.
 */
export function MemoSections({
  pinnedBase,
  recentBase,
}: {
  pinnedBase: Memo[];
  recentBase: Memo[];
}) {
  const saved = useSavedMemos();
  const overrides = useMemoOverrides();
  const pins = usePins();
  const { pinned, recent } = buildMemoLists({ pinnedBase, recentBase, saved, overrides, pins });

  return (
    <>
      {pinned.length > 0 && <MemoCard title="고정한 메모" memos={pinned} pin />}
      {recent.length > 0 && <MemoCard title="최근 메모" memos={recent} action />}
    </>
  );
}
