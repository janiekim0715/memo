import type { ReactNode } from "react";
import type { DetailedMemo, MemoBlock } from "@/data/memos";
import { Badge } from "./Badge";

/** 문단 안의 **굵게** 를 굵은 글씨(body-md-bold)로 바꾼다. */
function RichText({ text }: { text: string }): ReactNode {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="body-md-bold text-text-primary">
        {part}
      </strong>
    ) : (
      part
    ),
  );
}

function Block({ block }: { block: MemoBlock }) {
  switch (block.type) {
    case "heading":
      return <h2 className="title-lg text-text-primary">{block.text}</h2>;
    case "subheading":
      return <h3 className="title-md text-text-primary">{block.text}</h3>;
    case "paragraph":
      return (
        <p className="body-md text-text-secondary">
          <RichText text={block.text} />
        </p>
      );
    case "list":
      return (
        <ul className="flex flex-col gap-space-4">
          {block.items.map((item, i) => (
            <li key={i} className="body-md flex gap-space-8 text-text-secondary">
              <span aria-hidden>•</span>
              <span className="flex-1">
                <RichText text={item} />
              </span>
            </li>
          ))}
        </ul>
      );
  }
}

/** 메모 상세의 흰 카드: 분류 배지·날짜, 제목, 구분선, 본문 */
export function MemoArticleView({ memo }: { memo: DetailedMemo }) {
  return (
    <article className="flex flex-col gap-space-12 rounded-xl bg-surface-card px-space-20 py-space-24">
      <div className="flex items-center gap-space-8">
        <Badge label={memo.detail.category} color={memo.label} />
        <time className="caption-sm text-text-muted">{memo.detail.createdAt}</time>
      </div>
      <h1 className="heading-lg text-text-primary">{memo.title}</h1>
      <hr className="h-px border-0 bg-border-default" />
      <div className="flex flex-col gap-space-12">
        {memo.detail.blocks.map((block, i) => (
          <Block key={i} block={block} />
        ))}
      </div>
    </article>
  );
}
