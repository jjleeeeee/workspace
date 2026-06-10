---
name: platform-web
description: "Web React(TSX) 플랫폼 구현 규칙. WDS CSS 변수 토큰 사용, 하네스 평가 기준, QA 도구를 정의한다."
trigger: "react, tsx, web ui, next.js, css module, web 플랫폼, web react"
---

# Web React 플랫폼 규칙

`figma_impl_orchestration` 스킬의 web 플랫폼 sub-rule이다.  
`web_ui_implementor` 에이전트가 이 규칙을 참조해 React TSX 코드를 생성한다.

---

## 전제 조건 (구현 전 체크)

**`src/tokens/wds-tokens.css` 파일이 존재해야 한다.**

- 파일 없으면: `web_ui_implementor` Step 0 또는 `/impl-tokens --platform=web`으로 생성 후 진행
- 토큰 소스: `weversecorp/cds-catalogs` GitHub 레포 `catalogs/tokens/*.json`
- 변환 규칙: `name.replace('/', '-')` → `--wds-<kebab>` CSS 변수
- 반드시 `src/main.tsx`에 import 되어 있어야 한다

---

## 출력 형식

- 컴포넌트 파일: `<ComponentName>.tsx`
- 스타일 파일: `<ComponentName>.module.css` (CSS Module 기본)
  - Tailwind가 이미 프로젝트에 있으면 Tailwind 클래스 사용 허용
- 타입 파일 (복잡한 props가 있을 때): `<ComponentName>.types.ts`

---

## 컴포넌트 우선순위

1. 기존 프로젝트 공통 컴포넌트 (`components/common/`, `components/shared/` 등)
2. WDS CSS 클래스 (`.wds-text-button`, `.wds-chip` 등)
3. WDS CSS 변수로 직접 스타일링
4. Custom 구현

---

## 토큰 규칙 (하드코딩 금지)

### 색상
```css
/* ✅ GOOD */
color: var(--wds-system-color-text-primary);
background-color: var(--wds-system-color-surface-secondary);

/* ❌ BAD */
color: #1A1A1A;
background-color: rgba(0, 0, 0, 0.05);
```

### 타이포그래피
```css
/* ✅ GOOD */
font-size: var(--wds-typography-default-size-body-lg);
font-weight: var(--wds-typography-default-weight-system-700);
line-height: var(--wds-typography-default-lineheight-text-lineheight-140);

/* ❌ BAD */
font-size: 16px;
font-weight: 700;
```

### 사이즈 / 스페이싱
```css
/* ✅ GOOD */
padding: var(--wds-system-size-padding-box-200) var(--wds-system-size-padding-box-300);
gap: var(--wds-system-size-spacing-200);
border-radius: var(--wds-system-size-radius-box-100);

/* ❌ BAD */
padding: 8px 16px;
gap: 8px;
```

### 폴백 처리 (토큰 없을 때)
토큰 변수가 `wds-tokens.css`에 없는 경우:
```css
/* 폴백 주석으로 명시 */
color: var(--wds-system-color-text-primary, #1A1A1A); /* TODO: 토큰 확인 필요 */
```

---

## 레이아웃 매핑 (Figma → CSS)

| Figma Layout | CSS |
|---|---|
| `Horizontal` Auto Layout | `display: flex; flex-direction: row;` |
| `Vertical` Auto Layout | `display: flex; flex-direction: column;` |
| `Wrap` | `flex-wrap: wrap;` |
| `Align: Space between` | `justify-content: space-between;` |
| `Align: Center` | `justify-content: center; align-items: center;` |
| Absolute position | `position: absolute; top: <y>px; left: <x>px;` |
| Scroll container | `overflow: auto;` (또는 축 별도) |
| Fill width | `width: 100%;` 또는 `flex: 1 1 auto;` |
| Hug width | `width: fit-content;` |
| Fixed width | `width: <n>px;` |

---

## QA 도구

QA 자동화는 `ui_qa` 에이전트가 수행. 본 SKILL 은 web 플랫폼에서 사용 가능한 도구만 명시한다.

### 빌드·기동
- 개발 서버: `npm run dev` (Vite 기본 포트 5173. Next.js 기본 3000 등 프레임워크에 따라 상이 — handoff 에서 명시)
- 미실행 시 `ui_qa` 가 백그라운드로 먼저 기동 후 캡처

### 스크린샷 (single-frame-qa)
```bash
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --headless=new \
  --screenshot="<output-dir>/qa_<scenario>.png" \
  --window-size=390,844 \
  --force-device-scale-factor=2 \
  "http://localhost:5173?state=<scenario>" 2>/dev/null
```
Chrome 없는 환경: "Chrome 없음 — Screenshot SKIP" 기록.

### Sequence 자동화 (sequence-qa)
- **Primary: Playwright** (`npx playwright`)
  - `page.click()`, `page.evaluate('window.scrollTo(...)')`, `page.keyboard.press()` 로 상태 전이
  - 각 상태마다 `page.screenshot({ path: ... })`
- **Fallback: Chrome DevTools Protocol** — `chrome --remote-debugging-port=9222` + `Input.dispatchMouseEvent` 등으로 동등 시퀀스 수행
- 둘 다 사용 불가: 단일 프레임 + `manual-pending` (사유 1줄)

### 상태 전이 증명
- DOM snapshot (`page.content()`) 또는 `aria-*` 라벨 / `data-testid` 어서션
- 예: `aria-label="Carousel slide 2 of 10"` 노출 확인

### Figma 비교
- Figma MCP `get_screenshot` 으로 비교 대상 확보
- 미연결 시 fileKey + nodeId + 캡처 PNG 경로 명시

### 비율/레이아웃 검증 (선택)
- JS `getBoundingClientRect()` 스니펫을 `page.evaluate()` 로 주입 (필요 시)

---

## 금지 사항

- `style=""` 속성에 raw 색상값 직접 입력
- `font-size: <n>px` 하드코딩
- `color: #XXXXXX` 하드코딩
- `import React from 'react'` (React 17+ 프로젝트에서 불필요한 경우 생략)
- 비즈니스 로직 수정 (prototype fidelity scope만)
- `any` 타입 남용
