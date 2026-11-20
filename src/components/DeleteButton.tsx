"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { deleteMemo } from "@/lib/memoApi";
import { clearDraft } from "@/lib/memoStore";
import { IconButton } from "./IconButton";
import { IconTrash } from "./icons";

/**
 * 상세 화면의 삭제 버튼(Button/Delete).
 * 누르면 한 번 더 물어보고, 확인하면 Supabase에서 이 메모를 지운 뒤 홈으로 돌아간다.
 */
export function DeleteButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [failed, setFailed] = useState(false);

  function open() {
    setFailed(false);
    dialogRef.current?.showModal();
  }

  function close() {
    if (!deleting) dialogRef.current?.close();
  }

  async function confirm() {
    setDeleting(true);
    setFailed(false);
    try {
      await deleteMemo(id);
      clearDraft(id); // 이 메모를 고치다 만 글이 남아 있으면 같이 지운다.
      // 이동한 뒤에도 이 화면이 잠깐 남아 있을 수 있어서, 확인 창은 닫고 버튼은 눌리지 않게 해 둔다.
      dialogRef.current?.close();
      setDeleted(true);
      router.replace("/");
    } catch {
      setFailed(true);
      setDeleting(false);
    }
  }

  return (
    <>
      <IconButton label="삭제" onClick={open} disabled={deleted}>
        <IconTrash />
      </IconButton>
      <dialog
        ref={dialogRef}
        aria-labelledby="delete-memo-title"
        // 지우는 중에는 Esc나 바깥 누르기로 닫히지 않게 한다.
        onCancel={(event) => {
          if (deleting) event.preventDefault();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
        className="m-auto w-[min(358px,calc(100vw-32px))] rounded-xl bg-surface-card p-0 text-text-primary backdrop:bg-text-primary/40"
      >
        <div className="flex flex-col gap-space-16 px-space-20 py-space-24">
          <div className="flex flex-col gap-space-8">
            <h2 id="delete-memo-title" className="title-lg text-text-primary">
              이 메모를 삭제할까요?
            </h2>
            <p className="body-md break-words text-text-secondary">
              “{title}” 메모를 삭제하면 되돌릴 수 없어요.
            </p>
          </div>
          {failed && (
            <p role="alert" className="caption-sm text-text-muted">
              삭제하지 못했어요. 인터넷 연결을 확인하고 다시 해 주세요.
            </p>
          )}
          <div className="flex gap-space-8">
            <button
              type="button"
              onClick={close}
              disabled={deleting}
              className="button-md flex h-[52px] flex-1 items-center justify-center rounded-md bg-surface-page text-text-primary disabled:opacity-40"
            >
              취소
            </button>
            <button
              type="button"
              onClick={confirm}
              disabled={deleting}
              className="button-md flex h-[52px] flex-1 items-center justify-center rounded-md bg-primary text-text-on-primary disabled:opacity-40"
            >
              {deleting ? "삭제하는 중" : "삭제"}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
