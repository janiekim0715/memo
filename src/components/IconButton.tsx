import Link from "next/link";
import type { ReactNode } from "react";

const className = "flex size-[40px] items-center justify-center rounded-sm";

type IconButtonProps = {
  label: string;
  children: ReactNode;
  /** 켜져 있는 상태(예: 고정됨). 켜지면 아이콘이 포인트 색이 된다. */
  pressed?: boolean;
  onClick?: () => void;
  disabled?: boolean;
};

/** 40×40 누르는 영역 가운데에 아이콘을 둔 버튼 */
export function IconButton({ label, children, pressed, onClick, disabled }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      onClick={onClick}
      disabled={disabled}
      className={`${className} ${pressed ? "text-primary" : "text-text-primary"}`}
    >
      {children}
    </button>
  );
}

/** 같은 모양의 링크 (뒤로가기 등) */
export function IconLink({
  label,
  href,
  children,
}: {
  label: string;
  href: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} aria-label={label} className={`${className} text-text-primary`}>
      {children}
    </Link>
  );
}
