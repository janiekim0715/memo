type FormatButtonProps = {
  label: string;
  /** 스크린 리더용 이름 (예: B -> 굵게) */
  ariaLabel?: string;
  /** 커서가 있는 글자의 서식이면 State=Active */
  active?: boolean;
  onClick: () => void;
};

/** 서식 버튼: 굵게(B)·제목·소제목·목록. 눌러도 입력 칸의 커서가 풀리지 않는다. */
export function FormatButton({ label, ariaLabel, active = false, onClick }: FormatButtonProps) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      aria-pressed={active}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      className={`label-md flex h-[36px] items-center justify-center rounded-sm px-space-12 ${
        active ? "bg-label-blue-soft text-primary" : "text-text-secondary"
      }`}
    >
      {label}
    </button>
  );
}
