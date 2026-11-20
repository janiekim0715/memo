"use client";

import { useMemoById } from "@/lib/memoApi";
import { PrimaryButton } from "./Button";
import { DeleteButton } from "./DeleteButton";
import { IconButton, IconLink } from "./IconButton";
import { IconChevronLeft, IconPin, IconShare, IconTrash } from "./icons";
import { MemoArticleView } from "./MemoArticleView";
import { PinButton } from "./PinButton";

/** 위쪽 막대: 뒤로가기, 고정, 공유, 삭제. 메모를 읽기 전에는 고정·삭제 버튼이 눌리지 않는다. */
export function DetailNav({ memo }: { memo?: { id: string; title: string; pinned: boolean } }) {
  return (
    <nav className="flex items-center justify-between">
      <IconLink label="뒤로가기" href="/">
        <IconChevronLeft />
      </IconLink>
      <div className="flex">
        {memo ? (
          <PinButton key={`pin-${memo.id}`} id={memo.id} initialPinned={memo.pinned} />
        ) : (
          <IconButton label="고정" disabled>
            <IconPin />
          </IconButton>
        )}
        <IconButton label="공유">
          <IconShare />
        </IconButton>
        {memo ? (
          <DeleteButton key={`delete-${memo.id}`} id={memo.id} title={memo.title} />
        ) : (
          <IconButton label="삭제" disabled>
            <IconTrash />
          </IconButton>
        )}
      </div>
    </nav>
  );
}

export const detailSkeleton = (
  <div aria-hidden className="min-h-[200px] rounded-xl bg-surface-card" />
);

function Notice({ title, body }: { title: string; body: string }) {
  return (
    <section className="flex flex-col items-center gap-space-8 rounded-xl bg-surface-card px-space-20 py-space-24 text-center">
      <h1 className="title-lg text-text-primary">{title}</h1>
      <p className="body-md text-text-secondary">{body}</p>
    </section>
  );
}

/** 메모 상세 화면의 내용. Supabase에서 이 메모를 읽어 보여 준다. */
export function MemoDetail({ id }: { id: string }) {
  const result = useMemoById(id);
  const memo = result.status === "ready" ? result.memo : undefined;

  return (
    <>
      <DetailNav memo={memo} />
      <div className="flex flex-1 flex-col">
        {result.status === "loading" && detailSkeleton}
        {memo && <MemoArticleView memo={memo} />}
        {result.status === "missing" && (
          <Notice title="메모를 찾을 수 없어요" body="지워졌거나 없는 메모예요." />
        )}
        {result.status === "error" && (
          <Notice title="메모를 불러오지 못했어요" body="인터넷 연결을 확인해 주세요." />
        )}
      </div>
      <div className="sticky bottom-space-34">
        {memo ? (
          <PrimaryButton href={`/memo/${id}/edit`}>수정하기</PrimaryButton>
        ) : (
          <PrimaryButton disabled>수정하기</PrimaryButton>
        )}
      </div>
    </>
  );
}
