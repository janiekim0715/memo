import Link from "next/link";
import type { ReactNode } from "react";

const className =
  "flex size-[40px] items-center justify-center rounded-sm text-text-primary";

/** 40×40 누르는 영역 가운데에 아이콘을 둔 버튼 */
export function IconButton({ label, children }: { label: string; children: ReactNode }) {
  return (
    <button type="button" aria-label={label} className={className}>
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
    <Link href={href} aria-label={label} className={className}>
      {children}
    </Link>
  );
}
