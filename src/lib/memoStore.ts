"use client";

import { useSyncExternalStore } from "react";
import type { DetailedMemo, MemoLabel } from "@/data/memos";

/*
 * 이 브라우저의 localStorage에 메모를 저장한다.
 * - memo-app:memos : 저장한 메모 목록 (새 메모가 맨 앞)
 * - memo-app:draft : 작성 중인 글 (자동 저장)
 */
const MEMOS_KEY = "memo-app:memos";
const DRAFT_KEY = "memo-app:draft";
const CHANGE_EVENT = "memo-app:change";

const EMPTY: DetailedMemo[] = [];
const LABELS: MemoLabel[] = ["blue", "green", "orange", "pink"];

function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function remove(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {
    // 저장소를 못 쓰는 브라우저에서는 조용히 넘어간다.
  }
}

function isDetailedMemo(value: unknown): value is DetailedMemo {
  if (typeof value !== "object" || value === null) return false;
  const memo = value as Record<string, unknown>;
  return (
    typeof memo.id === "string" &&
    typeof memo.title === "string" &&
    typeof memo.preview === "string" &&
    typeof memo.date === "string" &&
    LABELS.includes(memo.label as MemoLabel) &&
    typeof memo.detail === "object" &&
    memo.detail !== null &&
    Array.isArray((memo.detail as Record<string, unknown>).blocks)
  );
}

function parseMemos(raw: string | null): DetailedMemo[] {
  if (!raw) return EMPTY;
  try {
    const data: unknown = JSON.parse(raw);
    return Array.isArray(data) ? data.filter(isDetailedMemo) : EMPTY;
  } catch {
    return EMPTY;
  }
}

// useSyncExternalStore는 같은 값이면 같은 참조를 돌려줘야 해서 문자열이 같을 땐 결과를 재사용한다.
let cachedRaw: string | null | undefined;
let cachedMemos: DetailedMemo[] = EMPTY;

function getSnapshot(): DetailedMemo[] {
  const raw = read(MEMOS_KEY);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedMemos = parseMemos(raw);
  }
  return cachedMemos;
}

function getServerSnapshot(): DetailedMemo[] {
  return EMPTY;
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

/** 이 브라우저에 저장된 메모 (새 메모가 맨 앞). 서버 렌더링 때는 빈 목록. */
export function useSavedMemos(): DetailedMemo[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

const noopSubscribe = () => () => {};

/** 브라우저에서 화면이 준비됐는지. 서버 렌더링 때는 false. */
export function useHydrated(): boolean {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

/** 메모를 맨 앞에 저장한다. 저장소를 못 쓰면 false. */
export function addMemo(memo: DetailedMemo): boolean {
  const ok = write(MEMOS_KEY, JSON.stringify([memo, ...getSnapshot()]));
  if (ok) window.dispatchEvent(new Event(CHANGE_EVENT));
  return ok;
}

export type Draft = {
  title: string;
  category: string;
  color: MemoLabel;
  body: string;
};

export function loadDraft(): Draft | null {
  const raw = read(DRAFT_KEY);
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as Partial<Draft>;
    if (typeof data.title !== "string" || typeof data.body !== "string") return null;
    return {
      title: data.title,
      body: data.body,
      category: typeof data.category === "string" ? data.category : "",
      color: LABELS.includes(data.color as MemoLabel) ? (data.color as MemoLabel) : "blue",
    };
  } catch {
    return null;
  }
}

export function saveDraft(draft: Draft) {
  write(DRAFT_KEY, JSON.stringify(draft));
}

export function clearDraft() {
  remove(DRAFT_KEY);
}
