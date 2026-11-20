"use client";

import { useSyncExternalStore } from "react";
import type { DetailedMemo, MemoLabel } from "@/data/memos";
import type { PinState, Pins } from "./memoLists";

/*
 * 이 브라우저의 localStorage에 메모를 저장한다.
 * - memo-app:memos     : 이 브라우저에서 새로 쓴 메모 목록 (새 메모가 맨 앞)
 * - memo-app:overrides : 처음부터 있던 메모를 고친 내용 (메모 id -> 고친 메모)
 * - memo-app:pins      : 고정/해제 버튼을 누른 메모의 상태 (메모 id -> {pinned, at})
 * - memo-app:draft     : 작성 중인 새 글 (자동 저장)
 * - memo-app:draft:<id>: 수정 중인 글 (자동 저장)
 */
const MEMOS_KEY = "memo-app:memos";
const OVERRIDES_KEY = "memo-app:overrides";
const DRAFT_KEY = "memo-app:draft";
const PINS_KEY = "memo-app:pins";
const CHANGE_EVENT = "memo-app:change";

const LABELS: MemoLabel[] = ["blue", "green", "orange", "pink"];

export type MemoOverrides = Record<string, DetailedMemo>;

const EMPTY_MEMOS: DetailedMemo[] = [];
const EMPTY_OVERRIDES: MemoOverrides = {};
const EMPTY_PINS: Pins = {};

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

function notifyChange() {
  window.dispatchEvent(new Event(CHANGE_EVENT));
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

function parseJson(raw: string | null): unknown {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function parseMemos(raw: string | null): DetailedMemo[] {
  const data = parseJson(raw);
  return Array.isArray(data) ? data.filter(isDetailedMemo) : EMPTY_MEMOS;
}

function parseOverrides(raw: string | null): MemoOverrides {
  const data = parseJson(raw);
  if (typeof data !== "object" || data === null || Array.isArray(data)) return EMPTY_OVERRIDES;
  const result: MemoOverrides = {};
  for (const [id, value] of Object.entries(data)) {
    if (isDetailedMemo(value) && value.id === id) result[id] = value;
  }
  return result;
}

/**
 * localStorage의 한 항목을 useSyncExternalStore로 읽는 저장소.
 * 같은 값이면 같은 참조를 돌려줘야 해서, 문자열이 같을 땐 풀어 둔 결과를 재사용한다.
 */
function createStore<T>(key: string, empty: T, parse: (raw: string | null) => T) {
  let cachedRaw: string | null | undefined;
  let cached = empty;

  const getSnapshot = (): T => {
    const raw = read(key);
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      cached = parse(raw);
    }
    return cached;
  };
  const getServerSnapshot = (): T => empty;
  const subscribe = (onChange: () => void) => {
    window.addEventListener("storage", onChange);
    window.addEventListener(CHANGE_EVENT, onChange);
    return () => {
      window.removeEventListener("storage", onChange);
      window.removeEventListener(CHANGE_EVENT, onChange);
    };
  };
  return { getSnapshot, getServerSnapshot, subscribe };
}

function parsePins(raw: string | null): Pins {
  const data = parseJson(raw);
  if (typeof data !== "object" || data === null || Array.isArray(data)) return EMPTY_PINS;
  const result: Pins = {};
  for (const [id, value] of Object.entries(data)) {
    const pin = value as Partial<PinState> | null;
    if (pin && typeof pin.pinned === "boolean" && typeof pin.at === "number") {
      result[id] = { pinned: pin.pinned, at: pin.at };
    }
  }
  return result;
}

const memosStore = createStore(MEMOS_KEY, EMPTY_MEMOS, parseMemos);
const overridesStore = createStore(OVERRIDES_KEY, EMPTY_OVERRIDES, parseOverrides);
const pinsStore = createStore(PINS_KEY, EMPTY_PINS, parsePins);

/** 이 브라우저에서 새로 쓴 메모 (새 메모가 맨 앞). 서버 렌더링 때는 빈 목록. */
export function useSavedMemos(): DetailedMemo[] {
  return useSyncExternalStore(
    memosStore.subscribe,
    memosStore.getSnapshot,
    memosStore.getServerSnapshot,
  );
}

/** 처음부터 있던 메모를 고친 내용 (메모 id -> 고친 메모). 서버 렌더링 때는 빈 객체. */
export function useMemoOverrides(): MemoOverrides {
  return useSyncExternalStore(
    overridesStore.subscribe,
    overridesStore.getSnapshot,
    overridesStore.getServerSnapshot,
  );
}

/** 고정/해제 버튼을 누른 메모의 상태 (메모 id -> 상태). 서버 렌더링 때는 빈 객체. */
export function usePins(): Pins {
  return useSyncExternalStore(
    pinsStore.subscribe,
    pinsStore.getSnapshot,
    pinsStore.getServerSnapshot,
  );
}

const noopSubscribe = () => () => {};

/** 브라우저에서 화면이 준비됐는지. 서버 렌더링 때는 false. */
export function useHydrated(): boolean {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

/** 새 메모를 맨 앞에 저장한다. 저장소를 못 쓰면 false. */
export function addMemo(memo: DetailedMemo): boolean {
  const ok = write(MEMOS_KEY, JSON.stringify([memo, ...memosStore.getSnapshot()]));
  if (ok) notifyChange();
  return ok;
}

/**
 * 고친 메모를 저장한다. 이 브라우저에서 새로 쓴 메모는 그 자리에서 바꾸고,
 * 처음부터 있던 메모는 고친 내용을 따로 보관해 원래 내용 대신 보여 준다.
 */
export function saveEdit(memo: DetailedMemo): boolean {
  const saved = memosStore.getSnapshot();
  const ok = saved.some((item) => item.id === memo.id)
    ? write(MEMOS_KEY, JSON.stringify(saved.map((item) => (item.id === memo.id ? memo : item))))
    : write(OVERRIDES_KEY, JSON.stringify({ ...overridesStore.getSnapshot(), [memo.id]: memo }));
  if (ok) notifyChange();
  return ok;
}

/** 메모를 "고정한 메모"로 옮기거나(true) "최근 메모"로 되돌린다(false). 저장소를 못 쓰면 false. */
export function setPinned(id: string, pinned: boolean): boolean {
  const ok = write(
    PINS_KEY,
    JSON.stringify({ ...pinsStore.getSnapshot(), [id]: { pinned, at: Date.now() } }),
  );
  if (ok) notifyChange();
  return ok;
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
