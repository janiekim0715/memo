import type { Memo } from "@/data/memos";
import { IconChevronRight, IconPinSmall } from "./icons";
import { MemoItem } from "./MemoItem";

type MemoCardProps = {
  title: string;
  memos: Memo[];
  /** 고정한 메모 표시 */
  pin?: boolean;
  /** 오른쪽 위 "전체 보기" */
  action?: boolean;
};

/** 머리글(CardHeader) + 메모 줄(MemoItem)을 묶은 흰 카드 */
export function MemoCard({ title, memos, pin = false, action = false }: MemoCardProps) {
  return (
    <section className="overflow-clip rounded-xl bg-surface-card py-space-8">
      <header className="flex h-[40px] items-center gap-space-4 pt-space-12 pr-space-16 pb-space-4 pl-space-20">
        {pin && <IconPinSmall className="shrink-0 text-primary" />}
        <h2 className="label-md flex-1 text-text-primary">{title}</h2>
        {action && (
          <button
            type="button"
            className="caption-md flex shrink-0 items-center gap-space-4 text-text-muted"
          >
            전체 보기
            <IconChevronRight />
          </button>
        )}
      </header>
      <ul>
        {memos.map((memo) => (
          <li key={memo.id}>
            <MemoItem memo={memo} />
          </li>
        ))}
      </ul>
    </section>
  );
}
