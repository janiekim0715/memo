import Link from "next/link";
import type { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  /** 글자 앞에 붙는 아이콘 (색은 글자색을 따른다) */
  icon?: ReactNode;
  /** 주면 버튼 대신 이 주소로 가는 링크가 된다 */
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
};

const className =
  "button-md flex h-[56px] w-full items-center justify-center gap-space-8 rounded-md bg-primary px-space-24 text-text-on-primary disabled:opacity-40";

/** 화면의 주 버튼. 화면마다 하나만 두고 아래쪽에 가로로 꽉 차게 둔다. */
export function PrimaryButton({ children, icon, href, onClick, disabled }: ButtonProps) {
  if (href) {
    return (
      <Link href={href} className={className}>
        {icon}
        {children}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={className}>
      {icon}
      {children}
    </button>
  );
}
