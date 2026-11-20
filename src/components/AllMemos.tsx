"use client";

import { useMemoList } from "@/lib/memoApi";
import { IconLink } from "./IconButton";
import { IconChevronLeft } from "./icons";
import { MemoCard } from "./MemoCard";

/** 전체 목록 화면의 위쪽 막대: 뒤로가기와 제목 */
export function AllMemosNav() {
  return (
    <nav className="flex items-center gap-space-8">
      <IconLink label="뒤로가기" href="/">
        <IconChevronLeft />
      </IconLink>
      <h1 className="title-lg text-text-primary">전체 메모</h1>
    </nav>
  );
}

const skeleton = <div aria-hidden className="min-h-[200px] rounded-xl bg-surface-card" />;

/** 분류와 상관없이 Supabase에 있는 모든 메모. 고정한 메모가 위에 온다. */
export function AllMemosList() {
  const { status, memos } = useMemoList();

  if (memos.length === 0) {
    if (status === "loading") return skeleton;
    return (
      <section className="flex flex-col items-center gap-space-8 rounded-xl bg-surface-card px-space-20 py-space-24 text-center">
        <h2 className="title-lg text-text-primary">
          {status === "error" ? "메모를 불러오지 못했어요" : "아직 메모가 없어요"}
        </h2>
        <p className="body-md text-text-secondary">
          {status === "error" ? "인터넷 연결을 확인해 주세요." : "첫 메모를 남겨 보세요."}
        </p>
      </section>
    );
  }

  const pinned = memos.filter((memo) => memo.pinned);
  const recent = memos.filter((memo) => !memo.pinned);
  return (
    <>
      {pinned.length > 0 && <MemoCard title="고정한 메모" memos={pinned} pin />}
      {recent.length > 0 && <MemoCard title="최근 메모" memos={recent} />}
    </>
  );
}
