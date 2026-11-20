import type { MemoLabel } from "@/data/memos";

/** 메모 색 라벨 -> 배경(soft) + 글자·아이콘 색 */
export const labelColor: Record<MemoLabel, string> = {
  blue: "bg-label-blue-soft text-label-blue",
  green: "bg-label-green-soft text-label-green",
  orange: "bg-label-orange-soft text-label-orange",
  pink: "bg-label-pink-soft text-label-pink",
};

/** 메모 색 라벨 -> 색 고르기 점의 색 */
export const labelDot: Record<MemoLabel, string> = {
  blue: "bg-label-blue",
  green: "bg-label-green",
  orange: "bg-label-orange",
  pink: "bg-label-pink",
};
