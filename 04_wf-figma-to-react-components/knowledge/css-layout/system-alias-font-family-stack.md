# system-alias 폰트는 CSS에 명시적으로 써야 한다

## 핵심 규칙

Figma에서 폰트 타입이 `system-alias`라도 CSS `font-family`의 첫 번째 값으로 반드시 명시한다.

## 이유

브라우저는 "system-alias"라는 개념을 모른다. `font-family` 목록을 위에서부터 순서대로 시도할 뿐이다.

WeGothicSans를 생략하면 브라우저는 목록의 다음 항목인 token var로 바로 넘어간다.
token var 폴백은 Pretendard 등 일반 폰트로 이어져 **macOS에서도 Figma 렌더링과 달라진다.**

## 올바른 스택 순서

```css
font-family:
  "WeGothicSans",               /* DS 폰트 이름 — 먼저 시도 */
  -apple-system,                /* macOS 브라우저 시스템 폰트 키워드 */
  BlinkMacSystemFont,           /* Chrome on macOS */
  "Apple SD Gothic Neo",        /* 한글 시스템 폰트 명시 */
  var(--cds-typography-default-font-family-body, Pretendard, ui-sans-serif, system-ui, sans-serif);
```

## 실제 사례

- TextButton 최초 구현 시 `"WeGothicSans"` prefix 없이 token var만 사용했다가 버그로 수정됨 (2026-05-09).
- Tooltip, Chips 등 나머지 컴포넌트는 올바르게 작성되어 있었다.
- 크로스 컴포넌트 비교로 불일치를 발견할 수 있었다.

## 감사 방법

```bash
grep -n "font-family" src/components/*/\*.css
```

결과에서 `"WeGothicSans"`가 빠진 줄이 있으면 수정 대상.

## 관련 source note 섹션

Font Mapping Notes의 `decision: use-system-alias` + `CSS font-family order` 필드가 이 스택을 명시한다.
