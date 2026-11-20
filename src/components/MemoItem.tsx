import Link from "next/link";
import type { Memo } from "@/data/memos";
import { IconNote } from "./icons";
import { labelColor } from "./labelColor";

const rowClass =
  "flex h-[72px] items-center gap-space-16 px-space-20 py-space-12";

/** 메모 목록의 한 줄. 상세가 있는 메모는 누르면 상세 화면으로 이동한다. */
export function MemoItem({ memo }: { memo: Memo }) {
  const content = (
    <>
      <span
        className={`flex size-[44px] shrink-0 items-center justify-center rounded-sm ${labelColor[memo.label]}`}
      >
        <IconNote />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-space-4">
        <span className="title-md truncate text-text-primary">{memo.title}</span>
        <span className="body-sm truncate text-text-secondary">{memo.preview}</span>
      </span>
      <span className="caption-sm shrink-0 text-text-muted">{memo.date}</span>
    </>
  );

  if (memo.detail) {
    return (
      <Link
        href={`/memo/${memo.id}`}
        className={`${rowClass} focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary`}
      >
        {content}
      </Link>
    );
  }
  return <div className={rowClass}>{content}</div>;
}
