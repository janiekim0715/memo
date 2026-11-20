import type { Memo } from "@/data/memos";

/** 사용자가 고정/해제를 누른 메모의 상태. at은 누른 시각(밀리초). */
export type PinState = { pinned: boolean; at: number };
export type Pins = Record<string, PinState>;

type Input = {
  /** 처음부터 "고정한 메모"에 있던 메모 */
  pinnedBase: Memo[];
  /** 처음부터 "최근 메모"에 있던 메모 */
  recentBase: Memo[];
  /** 이 브라우저에서 새로 쓴 메모 (새 메모가 앞) */
  saved: Memo[];
  /** 처음부터 있던 메모를 고친 내용 */
  overrides: Record<string, Memo>;
  pins: Pins;
};

/**
 * 홈의 두 카드에 들어갈 메모를 정한다.
 * - 기본: 처음부터 고정돼 있던 메모는 "고정한 메모", 나머지는 "최근 메모"
 * - 고정 버튼을 누른 메모는 그 상태를 따른다 (방금 고정한 메모가 고정한 메모 맨 위,
 *   방금 해제한 메모가 최근 메모 맨 위)
 */
export function buildMemoLists({ pinnedBase, recentBase, saved, overrides, pins }: Input): {
  pinned: Memo[];
  recent: Memo[];
} {
  const candidates = [
    ...saved.map((memo) => ({ memo, byDefault: false })),
    ...pinnedBase.map((memo) => ({ memo: overrides[memo.id] ?? memo, byDefault: true })),
    ...recentBase.map((memo) => ({ memo: overrides[memo.id] ?? memo, byDefault: false })),
  ];

  const isPinned = (id: string, byDefault: boolean) => pins[id]?.pinned ?? byDefault;
  const newestFirst = (a: Memo, b: Memo) => (pins[b.id]?.at ?? 0) - (pins[a.id]?.at ?? 0);

  const inPinned = candidates.filter((c) => isPinned(c.memo.id, c.byDefault));
  const inRecent = candidates.filter((c) => !isPinned(c.memo.id, c.byDefault));

  // 눌러서 옮겨진 메모는 위로, 나머지는 원래 순서대로
  const touched = (list: typeof candidates) =>
    list.filter((c) => pins[c.memo.id] !== undefined).map((c) => c.memo).sort(newestFirst);
  const untouched = (list: typeof candidates) =>
    list.filter((c) => pins[c.memo.id] === undefined).map((c) => c.memo);

  return {
    pinned: [...touched(inPinned), ...untouched(inPinned)],
    recent: [...touched(inRecent), ...untouched(inRecent)],
  };
}
