"use client";

import { useSyncExternalStore } from "react";
import { ALL_CATEGORY, CATEGORIES } from "@/data/categories";

/*
 * 홈에서 고른 분류 탭. 상세에 들어갔다가 돌아와도 같은 탭이 남도록
 * 이 브라우저 탭의 sessionStorage에 둔다 (탭을 닫으면 "전체"로 돌아간다).
 */
const KEY = "memo-app:category-filter";
const CHANGE_EVENT = "memo-app:category-filter-change";

// sessionStorage를 못 쓰는 브라우저에서도 화면을 떠나기 전까지는 고른 탭을 기억한다.
let fallback = ALL_CATEGORY;

const isCategory = (value: string | null): value is string =>
  value !== null && (value === ALL_CATEGORY || CATEGORIES.includes(value));

function getSnapshot(): string {
  try {
    const stored = sessionStorage.getItem(KEY);
    return isCategory(stored) ? stored : ALL_CATEGORY;
  } catch {
    return fallback;
  }
}

const getServerSnapshot = () => ALL_CATEGORY;

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => window.removeEventListener(CHANGE_EVENT, onChange);
}

/** 지금 고른 분류 탭 ("전체" 또는 분류 이름). 서버 렌더링 때는 "전체". */
export function useCategoryFilter(): string {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function setCategoryFilter(value: string) {
  if (!isCategory(value)) return;
  fallback = value;
  try {
    sessionStorage.setItem(KEY, value);
  } catch {
    // 저장소를 못 쓰면 위의 fallback으로 버틴다.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}
