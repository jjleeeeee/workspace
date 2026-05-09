# Web 특화 규칙

Web 플랫폼 코드 생성 시 이 파일의 모든 규칙을 SKILL.md 공통 규칙과 함께 적용한다.

---

## DS 토큰 → CSS 변수 매핑

### Color (TokenRef)

| DSL TokenRef 형식 | CSS 표현 |
|--------------|---------|
| `'token:system.color.*'` | `var(--wds-system-color-<kebab-case>)` |
| `'token:system.color.button.default'` | `var(--wds-system-color-button-default)` |
| `'token:system.color.brand.primary'` | `var(--wds-system-color-brand-primary)` |
| `'hardcoded:rgba(255,255,255,0)'` | `rgba(255,255,255,0)` + `/* FIXME: hardcoded */` |
| `'unresolved:#484848'` | `#484848` + `/* TODO: 토큰 매칭 필요 */` |

- CSS 변수 이름: `--wds-` prefix + dotted-path를 kebab-case로(점→하이픈).

### Typography

| DSL TokenRef | CSS 표현 |
|--------------|---------|
| `'textStyle:body-lg/system-700'` | `.wds-text-body-lg-system-700` 클래스 또는 매핑 테이블 |
| `'token:typography.default.base.lineheight.text-lineheight-100'` | `var(--wds-typography-default-base-lineheight-text-lineheight-100)` |

폰트 관련 CSS 변수 prefix: `--wds-typography-*`, `--wds-font-size-*`, `--wds-font-weight-*`, `--wds-line-height-*`, `--wds-letter-spacing-*`.

### Size / Spacing

| DSL TokenRef | CSS 표현 |
|--------------|---------|
| `'token:system.size.spacing.200'` | `var(--wds-system-size-spacing-200)` |
| `'token:system.size.padding.box.300'` | `var(--wds-system-size-padding-box-300)` |
| `'token:system.size.button-height.large'` | `var(--wds-system-size-button-height-large)` |

### Shadow / Effects

`Style.effects` 배열의 `{ type: 'shadow', offset, spread, blur, color }` →
- `box-shadow: <x>px <y>px <blur>px <spread>px <color>` (color는 TokenRef → `var(--wds-...)`)
- Inner shadow: `box-shadow: inset ...`
- 매핑 테이블 있으면 `var(--wds-shadow-elevation-N)` 우선

---

## 레이아웃 매핑 (Layout v2)

| `Layout.kind` + `axis` | CSS |
|-------------|-----|
| `kind='stack'`, `axis='horizontal'` | `display: flex; flex-direction: row;` |
| `kind='stack'`, `axis='vertical'` | `display: flex; flex-direction: column;` |
| `kind='box'` | `display: block;` (또는 flex 단일 자식) |
| `kind='overlay'` | `position: relative;` + 자식 `position: absolute` |
| `kind='absolute'` | `position: relative;` + 자식 `position: absolute; top:<y>px; left:<x>px;` |
| `kind='scroll'` | `overflow: auto;` (또는 axis 별 `overflow-x`/`overflow-y`) |

- `layout.spacing` → `gap: <n>px` 또는 `var(--wds-system-size-*)`
- `layout.padding.{top,right,bottom,left}` → `padding: <t>px <r>px <b>px <l>px`
- `layout.alignment.main` → `justify-content` (`flex-start|center|flex-end|space-between|space-around|space-evenly`)
- `layout.alignment.cross` → `align-items` (`flex-start|center|flex-end|stretch|baseline`)

---

## SizePolicy 매핑

| DSL `layout.size.<axis>.mode` | CSS |
|-------|-----|
| `'fill'` (width) | `width: 100%` 또는 `flex: 1 1 auto` |
| `'fill'` (height) | `height: 100%` 또는 `flex: 1 1 auto` |
| `'hug'` (width) | `width: fit-content` |
| `'hug'` (height) | `height: fit-content` 또는 `auto` |
| `'fixed'` + `value: 48` | `width: 48px` / `height: 48px` |

---

## WDS 컴포넌트 사용

HTML 구조에서 WDS BEM 클래스를 사용:
```html
<button class="wds-text-button wds-text-button--primary wds-text-button--md">
  구매하기
</button>
```

토큰 없이 직접 구현이 필요한 경우 CSS 변수 사용:
```css
.my-button {
  background-color: var(--wds-color-brand-primary);
  height: 48px;
  padding: var(--wds-size-padding-box-300) var(--wds-size-padding-box-400);
}
```

---

## 코드 구조 가이드

단일 파일(`index.html`) 기준:
```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><ComponentName></title>
  <style>
    /* WDS CSS 변수 정의 (환경에 토큰 파일이 없는 경우 fallback) */
    :root {
      --wds-color-brand-primary: #<fallback>;
      /* ... */
    }
    /* 컴포넌트 스타일 */
  </style>
</head>
<body>
  <!-- DSL 구조 그대로 HTML 트리로 -->
</body>
</html>
```

CSS 파일 분리 시: `<component>.css` + `index.html` (link rel="stylesheet").

---

## Lint 명령

```bash
prettier --check "<generated-file-path>"
```

CSS별도 lint:
```bash
stylelint "<generated-css-path>"
```

`prettier`/`stylelint` 없는 환경: "lint 도구 없음 — lint SKIP" 기록 후 SKIP 처리.

---

## Build 명령

Web은 별도 빌드 단계 없음 → `harness.json.build` = `null`.

번들러(Vite/webpack) 환경이면:
```bash
npm run build
```

---

## Screenshot 명령

```bash
mkdir -p "<output-dir>"
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --headless=new \
  --screenshot="<output-dir>/screenshot_N.png" \
  --window-size=390,800 \
  --force-device-scale-factor=2 \
  "file://<generated-html-path>" 2>/dev/null
```

**주의 — Headless Chrome viewport 제약**:
> `--window-size=390,800`을 줘도 최소 CSS viewport = **500px** (`window.innerWidth = 500`).  
> 이미지는 780×1600px이지만 CSS 기준은 500px.  
> 레이아웃 정밀 검증은 JS `getBoundingClientRect()`로 직접 확인.

JS 위치 검증 스니펫 (필요 시 HTML에 삽입):
```js
window.addEventListener('load', () => {
  const results = {};
  document.querySelectorAll('[class]').forEach(el => {
    const cls = el.className.split(' ')[0];
    if (cls) results[cls] = { w: el.offsetWidth, h: el.offsetHeight, left: el.getBoundingClientRect().left };
  });
  results.viewport = window.innerWidth;
  document.body.insertAdjacentHTML('beforeend', '<pre style="font-size:11px">' + JSON.stringify(results, null, 2) + '</pre>');
});
```

Chrome이 없는 환경: "Chrome 없음 — Screenshot SKIP" 기록 후 SKIP 처리.

---

## 주의사항

- `color: #XXXXXX` 직접 사용 금지. 반드시 `var(--wds-color-*)` 사용.
- `font-size: 14px` 직접 사용 금지. 반드시 CSS 변수 또는 wds 클래스 사용.
- 인라인 `style=""` 속성에 raw 토큰 값 사용 금지.
- CSS viewport 500px 제약 인지 하에 레이아웃 설계. 390px 기준 비율이 필요하면 JS 검증 스니펫 사용.
- Dark mode는 별도 요청이 없으면 light mode만 구현.
