import { Suspense } from "react";
import { EditMemo } from "@/components/EditMemo";

// 메모 내용은 Supabase에서 읽는다 (EditMemo).
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
