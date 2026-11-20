import { Suspense } from "react";
import { EditMemo } from "@/components/EditMemo";
import { allMemos } from "@/data/memos";

// 처음부터 있던 메모 중 상세가 있는 것만 미리 만든다. 그 밖의 주소는 이 브라우저에 저장한 메모를 찾는다.
export function generateStaticParams() {
  return allMemos.filter((memo) => memo.detail).map((memo) => ({ id: memo.id }));
}

async function EditLoader({ params }: { params: PageProps<"/memo/[id]/edit">["params"] }) {
  const { id } = await params;
  return <EditMemo id={id} />;
}

export default function EditMemoPage({ params }: PageProps<"/memo/[id]/edit">) {
  return (
    <Suspense fallback={<main className="min-h-dvh" />}>
      <EditLoader params={params} />
    </Suspense>
  );
}
