type ChipProps = {
  label: string;
  selected?: boolean;
  onClick?: () => void;
};

/** 분류 칩. 고른 칩은 selected. */
export function Chip({ label, selected = false, onClick }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`label-md flex h-[36px] shrink-0 items-center rounded-full px-space-16 ${
        selected
          ? "bg-primary text-text-on-primary"
          : "bg-surface-card text-text-secondary"
      }`}
    >
      {label}
    </button>
  );
}
