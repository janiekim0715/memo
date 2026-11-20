import { Chip } from "@/components/Chip";
import { PrimaryButton } from "@/components/Button";
import { MemoCount, RecentMemoCard } from "@/components/HomeLive";
import { IconPlus } from "@/components/icons";
import { MemoCard } from "@/components/MemoCard";
import { pinnedMemos, recentMemos } from "@/data/memos";

// 처음부터 있던 메모 수 (시안의 값). 이 브라우저에서 저장한 메모는 여기에 더해진다.
const baseMemoCount = 128;

export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[390px] flex-col gap-space-16 px-space-16 pt-space-64 pb-space-34">
      <div className="flex flex-1 flex-col gap-space-16">
        <header className="flex flex-col gap-space-8 px-space-8">
          <p className="caption-md text-text-muted">10월 30일 금요일</p>
          <h1 className="heading-xl text-text-primary">
            오늘까지 메모를
            <br />
            <span className="text-primary">
              <MemoCount base={baseMemoCount} />
            </span>{" "}
            남겼어요
          </h1>
        </header>
        <nav aria-label="분류" className="flex gap-space-8 px-space-4">
          <Chip label="전체" selected />
          <Chip label="업무" />
          <Chip label="개인" />
          <Chip label="아이디어" />
        </nav>
        <MemoCard title="고정한 메모" memos={pinnedMemos} pin />
        <RecentMemoCard memos={recentMemos} />
      </div>
      <div className="sticky bottom-space-34">
        <PrimaryButton href="/write" icon={<IconPlus />}>
          새 메모 쓰기
        </PrimaryButton>
      </div>
    </main>
  );
}
