# CLAUDE.md

## 프로젝트 개요
연습용 정적 웹 페이지 모음. 빌드 도구, 패키지, 서버 없이 HTML 파일을 브라우저에서 바로 연다.

## 파일 구성
- `memory-game.html`: 4x4 이모지 메모리 게임 (동물 4종 + 음식 4종, 8쌍)
- `mini/landing.html`: Lumo(AI 메모 앱) 정적 랜딩페이지
- `.env`: 테스트용 더미 값(`DEMO_KEY`). 실제 키를 넣지 않는다.
- `.claude/settings.json`: 민감 파일 읽기를 막는 `permissions.deny` 규칙

## 작업 규칙
- 응답은 항상 한국어로 쓴다. 코드, 명령어, 경로는 원문 그대로 둔다.
- 존댓말로 답한다. 불필요한 미사여구는 쓰지 않고 핵심만 간결하게 말한다.
- 색상은 `:root`의 CSS 변수(`--accent` 등)로 관리한다. 포인트 컬러는 `color/primary` 하나만 쓴다. `color/secondary`는 포인트 컬러로 쓰지 않는다.
- 모바일에서는 세로로 쌓이거나 화면 폭에 맞게 줄어들게 만든다.

## 디자인 토큰 (Figma)

### 색 (Colors)
| 이름 | Light | Dark |
|---|---|---|
| `color/primary` | `#3182F6` | `#4D94FF` |
| `color/secondary` | `#01B2A9` | `#01B2A9` |
| `surface/page` | `#F2F4F6` | `#101014` |
| `surface/card` | `#FFFFFF` | `#1C1C22` |
| `text/primary` | `#191F28` | `#F1F3F5` |
| `text/secondary` | `#4E5968` | `#B3BAC2` |
| `text/muted` | `#8B95A1` | `#6E7783` |
| `text/on-primary` | `#FFFFFF` | `#FFFFFF` |
| `border/default` | `#E5E8EB` | `#2A2A33` |
| `label/blue` | `#3182F6` | `#6AA6FF` |
| `label/blue-soft` | `#E8F3FF` | `#1D2A40` |
| `label/green` | `#12A150` | `#3CCB7F` |
| `label/green-soft` | `#E3F8EC` | `#17302A` |
| `label/orange` | `#F76808` | `#FF9446` |
| `label/orange-soft` | `#FFF1E5` | `#3A2817` |
| `label/pink` | `#E5397A` | `#FF6FA2` |
| `label/pink-soft` | `#FFEAF1` | `#3B1D2A` |

### 간격 (Spacing)
| 이름 | 값 |
|---|---|
| `space/4` | 4px |
| `space/8` | 8px |
| `space/12` | 12px |
| `space/16` | 16px |
| `space/20` | 20px |
| `space/24` | 24px |
| `space/34` | 34px |
| `space/48` | 48px |
| `space/64` | 64px |

### 모서리 (Radius)
| 이름 | 값 |
|---|---|
| `radius/sm` | 12px |
| `radius/md` | 16px |
| `radius/lg` | 20px |
| `radius/xl` | 24px |
| `radius/full` | 999px |

### 텍스트 스타일 (Noto Sans KR)
| 이름 | 굵기 | 크기 | 행간 | 자간 |
|---|---|---|---|---|
| `heading/xl` | Bold | 28px | 38px | -0.8px |
| `heading/lg` | Bold | 26px | 36px | -0.8px |
| `title/lg` | Bold | 20px | 28px | -0.4px |
| `title/md` | Bold | 17px | 24px | -0.3px |
| `label/md` | Bold | 15px | 22px | -0.2px |
| `body/md` | Regular | 16px | 28px | -0.2px |
| `body/md-bold` | Bold | 16px | 28px | -0.2px |
| `body/sm` | Regular | 14px | 20px | -0.1px |
| `caption/md` | Medium | 15px | 22px | -0.2px |
| `caption/sm` | Medium | 13px | 18px | 0px |
| `button/md` | Bold | 17px | 24px | -0.2px |

## 디자인 규칙
- 위 디자인 토큰에 없는 색·간격·모서리 값은 쓰지 않는다. 새 값이 필요하면 먼저 물어본다.
- 코드에서는 디자인 토큰 이름만 쓰고(`src/app/globals.css`의 변수·클래스, 예: `bg-surface-card`, `p-space-16`, `rounded-md`, `heading-xl`), 아이콘 색은 글자색을 따른다(`currentColor`).
- 같은 모양의 UI는 기존 컴포넌트를 재사용한다.
- 한글은 Noto Sans KR로 쓰고, 단어 중간에서 줄을 바꾸지 않는다.

## 민감 파일
- `.env`, `*credential*`, `*secret*`, `*.pem`, `*.key` 등은 읽지 않는다. 내용을 확인해야 하면 사용자에게 직접 확인해 달라고 요청한다.
- 위 규칙을 셸 명령(`cat`, `Get-Content` 등)으로 우회하지 않는다.

## 확인 방법
- 브라우저에서 파일을 열어 동작을 확인한다. 예: `Start-Process chrome "$PWD\memory-game.html"`
