import type { MemoLabel } from "@/data/memos";
import { labelDot } from "./labelColor";

type ColorDotProps = {
  color: MemoLabel;
  /** 스크린 리더용 색 이름 */
  name: string;
  selected?: boolean;
  onClick?: () => void;
};

/** 색 라벨 고르기. 고른 색은 바깥에 파란 테두리(2px)가 생긴다. */
export function ColorDot({ color, name, selected = false, onClick }: ColorDotProps) {
  return (
    <button
      type="button"
      aria-label={name}
      aria-pressed={selected}
      onClick={onClick}
      className={`flex size-[32px] items-center justify-center rounded-full ${
        selected ? "ring-2 ring-primary ring-inset" : ""
      }`}
    >
      <span className={`size-[22px] rounded-full ${labelDot[color]}`} />
    </button>
  );
}
