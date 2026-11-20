"use client";

import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import type { MemoLabel } from "@/data/memos";
import {
  getFormatState,
  toggleBold,
  toggleLineFormat,
  type EditResult,
  type LineFormat,
} from "@/lib/editorFormat";
import { addMemo, clearDraft, loadDraft, saveDraft, useHydrated } from "@/lib/memoStore";
import { formatCreatedAt, parseBody, previewOf } from "@/lib/memoText";
import { PrimaryButton } from "./Button";
import { Chip } from "./Chip";
import { ColorDot } from "./ColorDot";
import { FormatButton } from "./FormatButton";
import { IconLink } from "./IconButton";
import { IconChevronLeft } from "./icons";

const CATEGORIES = ["업무", "개인", "아이디어"];
const COLORS: { color: MemoLabel; name: string }[] = [
  { color: "blue", name: "파랑" },
  { color: "green", name: "초록" },
  { color: "orange", name: "주황" },
  { color: "pink", name: "분홍" },
];

const frameClass =
  "mx-auto flex min-h-dvh w-full max-w-[390px] flex-col gap-space-16 px-space-16 pt-space-48 pb-space-34";

/** 메모 작성 화면. 저장소는 브라우저에만 있어서 화면이 준비된 뒤에 그린다. */
export function WriteForm() {
  const hydrated = useHydrated();
  return hydrated ? <WriteScreen /> : <main className={frameClass} />;
}

function WriteScreen() {
  const router = useRouter();
  const [draft] = useState(loadDraft);
  const [title, setTitle] = useState(draft?.title ?? "");
  const [category, setCategory] = useState(
    CATEGORIES.includes(draft?.category ?? "") ? (draft?.category ?? CATEGORIES[0]) : CATEGORIES[0],
  );
  const [color, setColor] = useState<MemoLabel>(draft?.color ?? "blue");
  const [body, setBody] = useState(draft?.body ?? "");
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [failed, setFailed] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const pendingSelection = useRef<{ start: number; end: number } | null>(null);

  // 서식 버튼으로 글이 바뀌면 커서(선택 영역)를 새 위치로 옮긴다.
  useLayoutEffect(() => {
    const pending = pendingSelection.current;
    const textarea = textareaRef.current;
    if (!pending || !textarea) return;
    pendingSelection.current = null;
    textarea.focus();
    textarea.setSelectionRange(pending.start, pending.end);
  }, [body]);

  // 작성 중인 글은 바로바로 이 브라우저에 보관한다 (비우면 지운다).
  const hasContent = title.trim() !== "" || body.trim() !== "";
  useEffect(() => {
    if (title === "" && body === "") clearDraft();
    else saveDraft({ title, category, color, body });
  }, [title, category, color, body]);

  const format = getFormatState(body, selection.start, selection.end);

  function syncSelection() {
    const textarea = textareaRef.current;
    if (textarea) setSelection({ start: textarea.selectionStart, end: textarea.selectionEnd });
  }

  function apply(edit: (text: string, start: number, end: number) => EditResult) {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const result = edit(body, textarea.selectionStart, textarea.selectionEnd);
    pendingSelection.current = { start: result.start, end: result.end };
    setBody(result.text);
    setSelection({ start: result.start, end: result.end });
  }

  const applyLine = (lineFormat: LineFormat) =>
    apply((text, start, end) => toggleLineFormat(text, start, end, lineFormat));

  // 목록 줄에서 Enter: 다음 줄도 목록으로 잇고, 빈 목록 줄이면 목록을 끝낸다.
  function continueList(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== "Enter" || event.shiftKey || event.nativeEvent.isComposing) return;
    const { selectionStart: pos, selectionEnd } = event.currentTarget;
    if (pos !== selectionEnd) return;
    const from = pos === 0 ? 0 : body.lastIndexOf("\n", pos - 1) + 1;
    const lineBeforeCaret = body.slice(from, pos);
    if (!lineBeforeCaret.startsWith("- ")) return;

    event.preventDefault();
    const result: EditResult =
      lineBeforeCaret === "- "
        ? { text: body.slice(0, from) + body.slice(pos), start: from, end: from }
        : { text: body.slice(0, pos) + "\n- " + body.slice(pos), start: pos + 3, end: pos + 3 };
    pendingSelection.current = { start: result.start, end: result.end };
    setBody(result.text);
    setSelection({ start: result.start, end: result.end });
  }

  function save() {
    if (title.trim() === "") return;
    const ok = addMemo({
      id: `m-${Date.now().toString(36)}`,
      title: title.trim(),
      preview: previewOf(body),
      date: "오늘",
      label: color,
      detail: {
        category,
        createdAt: formatCreatedAt(new Date()),
        blocks: parseBody(body),
      },
    });
    if (!ok) {
      setFailed(true);
      return;
    }
    clearDraft();
    router.push("/");
  }

  return (
    <main className={frameClass}>
      <nav className="flex items-center justify-between">
        <IconLink label="뒤로가기" href="/">
          <IconChevronLeft />
        </IconLink>
        <span className={`caption-sm text-text-muted ${hasContent ? "" : "invisible"}`}>
          자동 저장됨
        </span>
      </nav>

      <div className="flex flex-1 flex-col gap-space-12">
        <label className="flex flex-col gap-space-4 rounded-lg bg-surface-card px-space-20 py-space-16 focus-within:ring-2 focus-within:ring-primary focus-within:ring-inset">
          <span className="caption-sm text-text-muted">제목</span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="제목을 입력해요"
            className="title-md bg-transparent text-text-primary outline-none placeholder:text-text-muted"
          />
        </label>

        <div className="flex flex-col gap-space-12 px-space-8 py-space-4">
          <div className="flex items-center gap-space-8">
            <span className="caption-sm text-text-muted">분류</span>
            {CATEGORIES.map((name) => (
              <Chip
                key={name}
                label={name}
                selected={name === category}
                onClick={() => setCategory(name)}
              />
            ))}
          </div>
          <div className="flex items-center gap-space-8">
            <span className="caption-sm text-text-muted">색</span>
            {COLORS.map((item) => (
              <ColorDot
                key={item.color}
                color={item.color}
                name={item.name}
                selected={item.color === color}
                onClick={() => setColor(item.color)}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col overflow-clip rounded-lg bg-surface-card ring-2 ring-primary ring-inset">
          <div role="toolbar" aria-label="서식" className="flex h-[52px] items-center gap-space-4 px-space-12">
            <FormatButton
              label="B"
              ariaLabel="굵게"
              active={format.bold}
              onClick={() => apply(toggleBold)}
            />
            <FormatButton label="제목" active={format.heading} onClick={() => applyLine("heading")} />
            <FormatButton
              label="소제목"
              active={format.subheading}
              onClick={() => applyLine("subheading")}
            />
            <FormatButton label="목록" active={format.list} onClick={() => applyLine("list")} />
          </div>
          <hr className="h-px border-0 bg-border-default" />
          <textarea
            ref={textareaRef}
            value={body}
            onChange={(event) => {
              setBody(event.target.value);
              syncSelection();
            }}
            onSelect={syncSelection}
            onKeyDown={continueList}
            aria-label="본문"
            placeholder="여기에 메모를 써요"
            className="body-md min-h-[176px] w-full resize-none bg-transparent px-space-20 py-space-16 text-text-secondary outline-none [field-sizing:content] placeholder:text-text-muted"
          />
        </div>
      </div>

      <div className="sticky bottom-space-34 flex flex-col gap-space-8">
        {failed && (
          <p role="alert" className="caption-sm text-center text-text-muted">
            이 브라우저에 저장하지 못했어요. 저장 공간이 막혀 있는지 확인해 주세요.
          </p>
        )}
        <PrimaryButton onClick={save} disabled={title.trim() === ""}>
          저장하기
        </PrimaryButton>
      </div>
    </main>
  );
}
