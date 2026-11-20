import type { SVGProps } from "react";

/*
 * 선 아이콘. 색은 따로 주지 않고 글자색(currentColor)을 따른다.
 * 색을 바꾸려면 아이콘 또는 감싸는 쪽에 text-* 클래스를 쓴다.
 */
type IconProps = Omit<SVGProps<SVGSVGElement>, "width" | "height">;

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

export function IconPlus(props: IconProps) {
  return (
    <svg {...base} width={20} height={20} viewBox="0 0 20 20" strokeWidth={1.66667} {...props}>
      <path d="M10 4.16667V15.8333M4.16667 10H15.8333" />
    </svg>
  );
}

export function IconNote(props: IconProps) {
  return (
    <svg {...base} width={22} height={22} viewBox="0 0 22 22" strokeWidth={1.83333} {...props}>
      <path d="M6.41667 3.66667H12.8333L16.5 7.33333V18.3333H6.41667V3.66667Z" />
      <path d="M12.8333 3.66667V7.33333H16.5M9.16667 11H13.75M9.16667 14.6667H13.75" />
    </svg>
  );
}

/** 카드 머리글용 작은 핀 (16px) */
export function IconPinSmall(props: IconProps) {
  return (
    <svg {...base} width={16} height={16} viewBox="0 0 16 16" strokeWidth={1.33333} {...props}>
      <path d="M6 2.33333H10L9.4 5.8L11.3333 8H4.66667L6.6 5.8L6 2.33333Z" />
      <path d="M8 8V13.3333" />
    </svg>
  );
}

export function IconPin(props: IconProps) {
  return (
    <svg {...base} width={24} height={24} viewBox="0 0 24 24" strokeWidth={2} {...props}>
      <path d="M9 3.5H15L14.1 8.7L17 12H7L9.9 8.7L9 3.5Z" />
      <path d="M12 12V20" />
    </svg>
  );
}

export function IconShare(props: IconProps) {
  return (
    <svg {...base} width={24} height={24} viewBox="0 0 24 24" strokeWidth={2} {...props}>
      <path d="M12 4V15M16 8L12 4L8 8M5 14V18C5 18.5304 5.21071 19.0391 5.58579 19.4142C5.96086 19.7893 6.46957 20 7 20H17C17.5304 20 18.0391 19.7893 18.4142 19.4142C18.7893 19.0391 19 18.5304 19 18V14" />
    </svg>
  );
}

export function IconTrash(props: IconProps) {
  return (
    <svg {...base} width={24} height={24} viewBox="0 0 24 24" strokeWidth={2} {...props}>
      <path d="M4.5 7H19.5" />
      <path d="M9 7V5.5C9 4.67 9.67 4 10.5 4H13.5C14.33 4 15 4.67 15 5.5V7" />
      <path d="M6.5 7L7.4 18.6C7.46 19.4 8.12 20 8.92 20H15.08C15.88 20 16.54 19.4 16.6 18.6L17.5 7" />
      <path d="M10 11V16M14 11V16" />
    </svg>
  );
}

export function IconChevronLeft(props: IconProps) {
  return (
    <svg {...base} width={24} height={24} viewBox="0 0 24 24" strokeWidth={2} {...props}>
      <path d="M15 18L9 12L15 6" />
    </svg>
  );
}

export function IconChevronRight(props: IconProps) {
  return (
    <svg {...base} width={16} height={16} viewBox="0 0 16 16" strokeWidth={1.33333} {...props}>
      <path d="M6 4L10 8L6 12" />
    </svg>
  );
}
