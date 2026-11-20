import { PrimaryButton } from "@/components/Button";
import { CategoryTabs, MemoCount, MemoSections } from "@/components/HomeLive";
import { IconPlus } from "@/components/icons";

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
              <MemoCount />
            </span>{" "}
            남겼어요
          </h1>
        </header>
        <CategoryTabs />
        <MemoSections />
      </div>
      <div className="sticky bottom-space-34">
        <PrimaryButton href="/write" icon={<IconPlus />}>
          새 메모 쓰기
        </PrimaryButton>
      </div>
    </main>
  );
}
