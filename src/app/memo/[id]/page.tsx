import { Suspense } from "react";
import { PrimaryButton } from "@/components/Button";
import { DetailNav, MemoDetail, detailSkeleton } from "@/components/MemoDetail";

// 메모마다 달라지는 부분(params)은 Suspense 안에서 읽는다. 메모 내용은 Supabase에서 읽는다.
async function MemoContent({ params }: { params: PageProps<"/memo/[id]">["params"] }) {
  const { id } = await params;
  return <MemoDetail id={id} />;
}

export default function MemoDetailPage({ params }: PageProps<"/memo/[id]">) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[390px] flex-col gap-space-16 px-space-16 pt-space-48 pb-space-34">
      <Suspense
        fallback={
          <>
            <DetailNav />
            <div className="flex flex-1 flex-col">{detailSkeleton}</div>
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
