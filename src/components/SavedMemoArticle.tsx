"use client";

import { useHydrated, useSavedMemos } from "@/lib/memoStore";
import { MemoArticleView } from "./MemoArticleView";

/** 이 브라우저에 저장한 메모의 상세. 저장소는 브라우저에만 있어서 화면이 준비된 뒤에 찾는다. */
export function SavedMemoArticle({ id }: { id: string }) {
  const memo = useSavedMemos().find((saved) => saved.id === id);
  const hydrated = useHydrated();

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
