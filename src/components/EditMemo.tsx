"use client";

import Link from "next/link";
import { useMemoById } from "@/lib/memoApi";
import { WriteForm } from "./WriteForm";

const frameClass =
  "mx-auto flex min-h-dvh w-full max-w-[390px] flex-col gap-space-16 px-space-16 pt-space-48 pb-space-34";

/** 메모 수정 화면. Supabase에서 읽은 그 메모의 지금 내용을 작성 화면에 채워서 보여 준다. */
export function EditMemo({ id }: { id: string }) {
  const result = useMemoById(id);

  if (result.status === "ready") return <WriteForm key={result.memo.id} memo={result.memo} />;
  if (result.status === "loading") return <main className={frameClass} />;
  const missing = result.status === "missing";
  return (
    <main className={`${frameClass} items-center justify-center text-center`}>
      <h1 className="heading-lg text-text-primary">
        {missing ? "메모를 찾을 수 없어요" : "메모를 불러오지 못했어요"}
      </h1>
      <p className="body-md text-text-secondary">
        {missing ? "지워졌거나 없는 메모예요." : "인터넷 연결을 확인해 주세요."}
      </p>
      <Link
        href="/"
        className="button-md flex h-[56px] items-center rounded-md bg-primary px-space-24 text-text-on-primary"
      >
        홈으로 가기
      </Link>
    </main>
  );
}
