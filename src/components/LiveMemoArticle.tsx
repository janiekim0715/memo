"use client";

import type { DetailedMemo } from "@/data/memos";
import { useHydrated, useMemoOverrides, useSavedMemos } from "@/lib/memoStore";
import { MemoArticleView } from "./MemoArticleView";

/**
 * 메모 상세의 흰 카드. 이 브라우저에서 새로 쓴 메모나 고친 내용이 있으면 그것을 보여 주고,
 * 없으면 처음부터 있던 내용(base)을 보여 준다. 저장소는 브라우저에만 있어서 화면이 준비된 뒤에 찾는다.
 */
export function LiveMemoArticle({ id, base }: { id: string; base?: DetailedMemo }) {
  const saved = useSavedMemos();
  const overrides = useMemoOverrides();
  const hydrated = useHydrated();

  const memo = saved.find((item) => item.id === id) ?? overrides[id] ?? base;

  if (memo) return <MemoArticleView memo={memo} />;
  if (!hydrated) {
    return <div aria-hidden className="min-h-[200px] rounded-xl bg-surface-card" />;
  }
  return (
    <section className="flex flex-col items-center gap-space-8 rounded-xl bg-surface-card px-space-20 py-space-24 text-center">
      <h1 className="title-lg text-text-primary">메모를 찾을 수 없어요</h1>
      <p className="body-md text-text-secondary">지워졌거나 이 브라우저에 없는 메모예요.</p>
    </section>
  );
}
