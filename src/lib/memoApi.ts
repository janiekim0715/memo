"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import type { DetailedMemo, MemoBlock, MemoLabel } from "@/data/memos";
import { formatCreatedAt } from "./memoText";
import { getSupabase } from "./supabase";

/*
 * 메모는 Supabase의 memos 표에 저장한다. 어느 기기에서 열어도 같은 메모가 보인다.
 * (작성 중인 글의 자동 저장만 이 브라우저에 남는다. memoStore.ts 참고)
 */

/** 화면에서 쓰는 메모 + 고정 여부 */
export type StoredMemo = DetailedMemo & { pinned: boolean };

/** 작성·수정 화면에서 저장하는 값 */
export type MemoInput = {
  title: string;
  preview: string;
  category: string;
  label: MemoLabel;
  blocks: MemoBlock[];
};

type MemoRow = MemoInput & {
  id: string;
  pinned: boolean;
  pinned_at: string | null;
  created_at: string;
};

const COLUMNS = "id,title,preview,blocks,category,label,pinned,pinned_at,created_at";

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

/** 목록에 보이는 날짜: 오늘, 어제, 10월 28일 (올해가 아니면 2025년 10월 28일) */
function listDate(date: Date, now = new Date()): string {
  const days = Math.round((startOfDay(now) - startOfDay(date)) / 86_400_000);
  if (days === 0) return "오늘";
  if (days === 1) return "어제";
  const monthDay = `${date.getMonth() + 1}월 ${date.getDate()}일`;
  return date.getFullYear() === now.getFullYear() ? monthDay : `${date.getFullYear()}년 ${monthDay}`;
}

function toMemo(row: MemoRow): StoredMemo {
  const createdAt = new Date(row.created_at);
  return {
    id: row.id,
    title: row.title,
    preview: row.preview,
    date: listDate(createdAt),
    label: row.label,
    pinned: row.pinned,
    detail: {
      category: row.category,
      createdAt: formatCreatedAt(createdAt),
      blocks: Array.isArray(row.blocks) ? row.blocks : [],
    },
  };
}

// 고정/해제를 누른 메모는 누른 시각, 아니면 만든 시각이 최근일수록 위로 간다.
const sortTime = (row: MemoRow) => Date.parse(row.pinned_at ?? row.created_at);

export async function fetchMemos(): Promise<StoredMemo[]> {
  const { data, error } = await getSupabase().from("memos").select(COLUMNS);
  if (error) throw error;
  return (data as MemoRow[]).sort((a, b) => sortTime(b) - sortTime(a)).map(toMemo);
}

/** 없는 메모면 null */
export async function fetchMemo(id: string): Promise<StoredMemo | null> {
  const { data, error } = await getSupabase()
    .from("memos")
    .select(COLUMNS)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? toMemo(data as MemoRow) : null;
}

/** 새 메모를 저장하고 그 id를 돌려준다. */
export async function createMemo(input: MemoInput): Promise<string> {
  const { data, error } = await getSupabase().from("memos").insert(input).select("id").single();
  if (error) throw error;
  return (data as { id: string }).id;
}

export async function updateMemo(id: string, input: MemoInput): Promise<void> {
  const { data, error } = await getSupabase()
    .from("memos")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("id");
  if (error) throw error;
  if (!data?.length) throw new Error("메모를 찾을 수 없어요.");
}

/** 메모를 "고정한 메모"로 옮기거나(true) "최근 메모"로 되돌린다(false). */
export async function setMemoPinned(id: string, pinned: boolean): Promise<void> {
  const { error } = await getSupabase()
    .from("memos")
    .update({ pinned, pinned_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

/* ---------- 홈 목록: 홈의 여러 부분(메모 수, 카드)이 같은 결과를 함께 쓴다 ---------- */

export type MemoListState = {
  status: "loading" | "ready" | "error";
  /** 다시 읽는 중이거나 실패해도 마지막으로 읽은 목록은 남겨 둔다. */
  memos: StoredMemo[];
};

const INITIAL_LIST: MemoListState = { status: "loading", memos: [] };
let listState = INITIAL_LIST;
let loading: Promise<void> | null = null;
const listeners = new Set<() => void>();

function setListState(next: MemoListState) {
  listState = next;
  listeners.forEach((listener) => listener());
}

function subscribeList(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** 목록을 Supabase에서 다시 읽는다. 이미 읽는 중이면 그 결과를 같이 기다린다. */
export function reloadMemos(): Promise<void> {
  loading ??= fetchMemos()
    .then(
      (memos) => setListState({ status: "ready", memos }),
      () => setListState({ status: "error", memos: listState.memos }),
    )
    .finally(() => {
      loading = null;
    });
  return loading;
}

/** 홈의 메모 목록. 화면에 들어올 때마다 새로 읽는다. 서버 렌더링 때는 읽는 중 상태. */
export function useMemoList(): MemoListState {
  const state = useSyncExternalStore(subscribeList, () => listState, () => INITIAL_LIST);
  useEffect(() => {
    void reloadMemos();
  }, []);
  return state;
}

/* ---------- 메모 하나: 상세·수정 화면 ---------- */

export type MemoResult =
  | { status: "loading" }
  | { status: "ready"; memo: StoredMemo }
  | { status: "missing" }
  | { status: "error" };

export function useMemoById(id: string): MemoResult {
  const [result, setResult] = useState<{ id: string; value: MemoResult } | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchMemo(id).then(
      (memo) => {
        if (!cancelled) {
          setResult({ id, value: memo ? { status: "ready", memo } : { status: "missing" } });
        }
      },
      () => {
        if (!cancelled) setResult({ id, value: { status: "error" } });
      },
    );
    return () => {
      cancelled = true;
    };
  }, [id]);

  return result?.id === id ? result.value : { status: "loading" };
}
