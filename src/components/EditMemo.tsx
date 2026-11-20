"use client";

import Link from "next/link";
import { findMemo, type DetailedMemo } from "@/data/memos";
import { useHydrated, useMemoOverrides, useSavedMemos } from "@/lib/memoStore";
import { WriteForm } from "./WriteForm";

const frameClass =
  "mx-auto flex min-h-dvh w-full max-w-[390px] flex-col gap-space-16 px-space-16 pt-space-48 pb-space-34";

/** 메모 수정 화면. 작성 화면에 그 메모의 지금 내용을 채워서 보여 준다. */
export function EditMemo({ id }: { id: string }) {
  const saved = useSavedMemos();
  const overrides = useMemoOverrides();
  const hydrated = useHydrated();

  const original = findMemo(id);
  const memo: DetailedMemo | undefined =
    saved.find((item) => item.id === id) ??
    overrides[id] ??
    (original?.detail ? { ...original, detail: original.detail } : undefined);

  if (memo) return <WriteForm key={memo.id} memo={memo} />;
  if (!hydrated) return <main className={frameClass} />;
  return (
    <main className={`${frameClass} items-center justify-center text-center`}>
      <h1 className="heading-lg text-text-primary">메모를 찾을 수 없어요</h1>
      <p className="body-md text-text-secondary">지워졌거나 이 브라우저에 없는 메모예요.</p>
      <Link
        href="/"
        className="button-md flex h-[56px] items-center rounded-md bg-primary px-space-24 text-text-on-primary"
      >
        홈으로 가기
      </Link>
    </main>
  );
}
