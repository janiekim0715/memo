import { Suspense } from "react";
import { PrimaryButton } from "@/components/Button";
import { IconButton, IconLink } from "@/components/IconButton";
import { IconChevronLeft, IconPin, IconShare } from "@/components/icons";
import { LiveMemoArticle } from "@/components/LiveMemoArticle";
import { allMemos, findMemo } from "@/data/memos";

// 처음부터 있던 메모 중 상세가 있는 것만 미리 만든다.
// 그 밖의 주소는 이 브라우저에 저장한 메모를 찾아 보여 준다.
export function generateStaticParams() {
  return allMemos.filter((memo) => memo.detail).map((memo) => ({ id: memo.id }));
}

const skeleton = <div aria-hidden className="min-h-[200px] rounded-xl bg-surface-card" />;

// 메모마다 달라지는 부분(params)은 Suspense 안에서 읽고, 위쪽 막대는 먼저 보여 준다.
async function MemoContent({ params }: { params: PageProps<"/memo/[id]">["params"] }) {
  const { id } = await params;
  const memo = findMemo(id);
  return (
    <>
      <div className="flex flex-1 flex-col">
        <LiveMemoArticle id={id} base={memo?.detail ? { ...memo, detail: memo.detail } : undefined} />
      </div>
      <div className="sticky bottom-space-34">
        <PrimaryButton href={`/memo/${id}/edit`}>수정하기</PrimaryButton>
      </div>
    </>
  );
}

export default function MemoDetail({ params }: PageProps<"/memo/[id]">) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[390px] flex-col gap-space-16 px-space-16 pt-space-48 pb-space-34">
      <nav className="flex items-center justify-between">
        <IconLink label="뒤로가기" href="/">
          <IconChevronLeft />
        </IconLink>
        <div className="flex">
          <IconButton label="고정">
            <IconPin />
          </IconButton>
          <IconButton label="공유">
            <IconShare />
          </IconButton>
        </div>
      </nav>
      <Suspense
        fallback={
          <>
            <div className="flex flex-1 flex-col">{skeleton}</div>
            <div className="sticky bottom-space-34">
              <PrimaryButton disabled>수정하기</PrimaryButton>
            </div>
          </>
        }
      >
        <MemoContent params={params} />
      </Suspense>
    </main>
  );
}
