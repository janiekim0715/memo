"use client";

import { ALL_CATEGORY, CATEGORIES } from "@/data/categories";
import { setCategoryFilter, useCategoryFilter } from "@/lib/categoryFilter";
import { useMemoList } from "@/lib/memoApi";
import { Chip } from "./Chip";
import { MemoCard } from "./MemoCard";

/** 분류 탭(전체·업무·개인·아이디어). 고른 탭의 메모만 아래 카드에 보인다. */
export function CategoryTabs() {
  const category = useCategoryFilter();
  return (
    <nav aria-label="분류" className="flex gap-space-8 px-space-4">
      {[ALL_CATEGORY, ...CATEGORIES].map((name) => (
        <Chip
          key={name}
          label={name}
          selected={name === category}
          onClick={() => setCategoryFilter(name)}
        />
      ))}
    </nav>
  );
}

/** "5개" 처럼 Supabase에 있는 메모 수. 읽는 동안에는 자리만 잡아 둔다. */
export function MemoCount() {
  const { status, memos } = useMemoList();
  if (status === "loading" && memos.length === 0) {
    return <span className="invisible">0개</span>;
  }
  return <>{memos.length}개</>;
}

/** 홈의 "최근 메모" 카드에 보이는 메모 수. 나머지는 "전체 보기"(/memos)에서 본다. */
const RECENT_LIMIT = 3;

const skeleton = <div aria-hidden className="min-h-[200px] rounded-xl bg-surface-card" />;

/**
 * 홈의 "고정한 메모"와 "최근 메모" 카드. Supabase에서 읽은 메모 중 고른 분류의 메모를
 * 고정 여부로 나눈다. 메모가 하나도 없는 카드는 숨긴다.
 */
export function MemoSections() {
  const { status, memos } = useMemoList();
  const category = useCategoryFilter();

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

  const visible =
    category === ALL_CATEGORY ? memos : memos.filter((memo) => memo.detail.category === category);
  if (visible.length === 0) {
    return (
      <section className="flex flex-col items-center gap-space-8 rounded-xl bg-surface-card px-space-20 py-space-24 text-center">
        <h2 className="title-lg text-text-primary">{category} 메모가 없어요</h2>
        <p className="body-md text-text-secondary">다른 분류를 눌러 보세요.</p>
      </section>
    );
  }

  const pinned = visible.filter((memo) => memo.pinned);
  const recent = visible.filter((memo) => !memo.pinned);
  return (
    <>
      {pinned.length > 0 && <MemoCard title="고정한 메모" memos={pinned} pin />}
      {recent.length > 0 && (
        <MemoCard
          title="최근 메모"
          memos={recent.slice(0, RECENT_LIMIT)}
          action={recent.length > RECENT_LIMIT}
        />
      )}
    </>
  );
}
