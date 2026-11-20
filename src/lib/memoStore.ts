"use client";

import { useSyncExternalStore } from "react";
import type { MemoLabel } from "@/data/memos";

/*
 * 이 브라우저의 localStorage에는 작성 중인 글만 자동 저장한다.
 * (메모 자체는 Supabase에 저장한다. memoApi.ts 참고)
 * - memo-app:draft     : 작성 중인 새 글
 * - memo-app:draft:<id>: 수정 중인 글
 */
const DRAFT_KEY = "memo-app:draft";

const LABELS: MemoLabel[] = ["blue", "green", "orange", "pink"];

function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // 저장소를 못 쓰는 브라우저에서는 조용히 넘어간다.
  }
}

function remove(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {
    // 저장소를 못 쓰는 브라우저에서는 조용히 넘어간다.
  }
}

function parseJson(raw: string | null): unknown {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

const noopSubscribe = () => () => {};

/** 브라우저에서 화면이 준비됐는지. 서버 렌더링 때는 false. */
export function useHydrated(): boolean {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

export type Draft = {
  title: string;
  category: string;
  color: MemoLabel;
  body: string;
};

// id가 없으면 새 글의 보관본, 있으면 그 메모를 수정 중인 글의 보관본
const draftKey = (id?: string) => (id ? `${DRAFT_KEY}:${id}` : DRAFT_KEY);

export function loadDraft(id?: string): Draft | null {
  const data = parseJson(read(draftKey(id))) as Partial<Draft> | null;
  if (!data || typeof data.title !== "string" || typeof data.body !== "string") return null;
  return {
    title: data.title,
    body: data.body,
    category: typeof data.category === "string" ? data.category : "",
    color: LABELS.includes(data.color as MemoLabel) ? (data.color as MemoLabel) : "blue",
  };
}

export function saveDraft(draft: Draft, id?: string) {
  write(draftKey(id), JSON.stringify(draft));
}

export function clearDraft(id?: string) {
  remove(draftKey(id));
}
