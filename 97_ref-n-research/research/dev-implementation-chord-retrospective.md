# Chord DS × 개발 구현 — 같은 실수가 코드에서 일어나면

> `figma-mcp-chord-retrospective.md`의 3가지 실수(primitive 사용, default variant, 디스커버리 과소비)를 **개발 구현** 맥락으로 옮기면 어떤 함정이 생기는지에 대한 기록.
> Figma 그리기보다 더 치명적인 부분도 있다.

## TL;DR

회고문서의 3가지 실수는 코드에서 거의 1:1로 대응되는 함정이 있다. 차이는 **흔적이 영구적으로 남는다**는 것 — Figma는 다시 그리면 되지만, 코드는 a11y·번들 사이즈·타입 안전성에 영구적인 흔적이 남는다.

| 영역 | Figma 실수 | 개발 실수 |
|---|---|---|
| 1 | `createRectangle`로 직접 그림 | `<div>` + 클래스로 직접 조립 (a11y·상태 누락) |
| 2 | `defaultVariant` 신뢰 | props 안 넘기고 컴포넌트 import만 |
| 3 | `get_libraries` + 4회 search | `node_modules` grep + Storybook 풀로딩 |

---

## 실수 1 (primitive로 그림) → 개발에선 "div로 직접 만듦"

### 일어나는 상황

- shadcn/ui · Radix · MUI 같은 라이브러리 컴포넌트 무시하고 `<div className="...">` 로 직접 조립
- 토큰 CSS 변수(`bg-primary-500`)만 쓰고 `<Button>` 컴포넌트는 import 안 함
- HTML `<input type="checkbox">` 위에 absolute로 SVG 얹어서 자기만의 체크박스 만듦

```tsx
// ❌ 토큰은 따랐지만 컴포넌트는 안 씀
<div className="flex items-center gap-1.5">
  <div className="h-4 w-4 rounded-md border-2 border-outline-default" />
  <span className="text-gray-700">위 약관에 동의합니다</span>
</div>

// ✅ DS 컴포넌트 사용
<Checkbox
  type="Circle"
  status={isChecked ? "Enabled" : "Default"}
  label="위 약관에 동의합니다"
  onChange={setIsChecked}
/>
```

### Figma보다 더 나쁜 점

- **a11y가 통째로 빠진다**: Radix `<Checkbox>`는 `role`, `aria-checked`, 키보드 Space 토글, 포커스 링이 공짜다. div로 만들면 이게 다 없다.
- **상태 머신이 사라진다**: focus-visible, hover, active, disabled, indeterminate 분기를 직접 작성해야 하고 보통 빠뜨린다.
- **DS 업데이트 전파 불가**: design token bump는 따라오지만 *컴포넌트 동작 패치*(예: 키보드 트랩 수정)는 안 따라온다.
- **검수 비용**: PR 리뷰어가 "왜 `<Checkbox>` 안 썼지?"부터 물어야 함.

### 핵심 오해 (Figma 케이스와 동일)

> "토큰 = 디자인 시스템"
> "Tailwind 클래스 = 컴포넌트"

토큰 일치는 **시각적 결과**만 같게 만든다. 동작·접근성·상태 관리는 컴포넌트가 들고 있다.

### 올바른 흐름

```
1. DS 패키지가 설치돼 있는가? (package.json 확인)
2. 만들 화면에 필요한 컴포넌트 목록화
3. DS 패키지의 exports에서 매칭 컴포넌트 import
4. props 명시적으로 다 넘기기
5. DS에 매칭이 없는 부분만 토큰을 써서 직접 작성
```

---

## 실수 2 (default variant) → 개발에선 "props 안 넘김"

### 일어나는 상황

```tsx
// ❌ default variant가 뭔지 모르고 그냥 import
<Button>전송</Button>
// → 실제 default가 'ghost'였고, 의도는 'primary'였음

<Dialog>...</Dialog>
// → default가 non-modal sheet였는데, 의도는 modal이었음

<Checkbox />
// → default가 Square(List Item 전용)였는데, 본문에 독립 사용
```

### Figma보다 더 나쁜 점

- **TypeScript는 안 막아준다**: optional prop이라 컴파일 통과. 런타임에 시각적으로만 다름.
- **테스트가 못 잡는다**: 단위 테스트는 prop 넘긴 상태로 작성하니까, prop 누락은 visual regression이나 e2e만 잡음.
- **prop-constraints 위반**: `checkbox_v2.md`의 `"type = Square → List Item 내부에서만"` 같은 제약은 타입으로 표현 안 되는 경우가 많아서 잘못 써도 빨간 줄 안 뜸.

### 막는 방법

- 컴포넌트 props를 **명시적**으로 다 넘기기

  ```tsx
  <Button variant="primary" size="md" type="submit">전송</Button>
  ```

- DS가 ESLint plugin 제공하면 무조건 켜기 (예: `@chord/eslint-plugin`이 default variant 사용 금지 규칙 제공 시)
- prop-constraints는 TypeScript discriminated union으로 강제

  ```ts
  type CheckboxProps =
    | { type: "Circle"; status: "Default" | "Enabled" | "Disabled" }
    | { type: "Square"; parent: "ListItem"; status: "Default" | "Enabled" | "Disabled" };
  ```

---

## 실수 3 (디스커버리 과소비) → 개발에선 "탐색 폭주"

### 일어나는 상황

- `node_modules` 통째로 grep, 모든 export 다 찾아봄
- Storybook 페이지 풀로딩, MDX docs까지 다 읽음
- variant 확인하려고 라이브러리 source code 열어서 파일 단위로 읽음
- 한 번에 import 끝낼 일을 *"먼저 docs 읽고 → 다음 턴에 예제 보고 → 그 다음 turn에 type 보고"* 로 쪼갬
- npm registry까지 가서 README 통째로 받음

### Figma보다 더 나쁜 점

- **컨텍스트 폭증이 더 심하다**: 패키지 하나의 type definition만 수만 줄. node_modules grep은 토큰 폭탄.
- **번들에도 흔적이 남는다**: 잘못된 deep import(`import {x} from 'lib/dist/internal/x'`)를 하면 tree-shaking 깨져 번들 사이즈 폭증. Figma 그리기는 결과물에 흔적이 안 남는데 코드는 남는다.
- **중복 구현 위험**: 라이브러리에 이미 있는 utility(`cn`, `clsx`, debounce 등)를 못 찾고 직접 짜는 경우가 흔함.

### 줄이는 방법

| 잘못된 방식 | 개선 방식 |
|---|---|
| `node_modules` 전체 grep | 패키지 `package.json`의 `exports` 필드 먼저 확인 |
| Storybook 다 열기 | `.d.ts` 한 파일만 읽어 props 추출 |
| 단어 하나 grep | `"Button variant primary"`처럼 좁은 query |
| 여러 턴에 걸쳐 탐색 | 한 턴에 import + props 확인 + 사용 동시 처리 |
| 라이브러리 source 통째로 읽기 | 컴포넌트 md(checkbox_v2.md 같은) 한 파일만 읽기 |

---

## 개발에만 있는 추가 함정

Figma에는 없지만 개발 구현에는 있는 것들.

### 1. 타입 우회

```tsx
// ❌ prop-constraints를 타입 안전성으로 무력화
<Checkbox type={"Square" as any} />  // List Item 외 사용
// @ts-ignore
<Button variant="legacy-primary" />
```

`as any`, `// @ts-ignore`는 DS의 의도를 우회한다. 코드 리뷰에서 잡지 않으면 그대로 들어감.

### 2. CSS 우선순위 전쟁

```tsx
// ❌ DS 컴포넌트 썼지만 토큰 외 색상 덮어씀
<Button variant="primary" className="!bg-[#FF6B6B]" />
```

"컴포넌트는 썼지만 토큰은 안 따름" — Figma 실수 1의 정반대 패턴. DS가 무엇을 위해 존재하는지 무력화.

### 3. 버전 드리프트

`package.json`에 `^1.0.0`으로 잡혀있어 같은 코드가 환경마다 다른 컴포넌트를 사용할 수 있다. lockfile 관리 안 되면 "내 로컬에선 됐는데"가 발생.

### 4. SSR/CSR 차이

Radix처럼 portal 쓰는 컴포넌트는 SSR에서 hydration mismatch가 발생할 수 있다. Figma에는 없는 차원의 문제.

### 5. 번들 분기 누락

모바일 전용 variant(`Checkbox/mobile`)가 있는데 web 빌드에 그대로 들어가는 경우. tree-shaking이 variant 단위로 안 되면 모든 variant가 번들에 포함됨.

---

## 잘 정리된 컴포넌트 md(checkbox_v2.md 같은)가 있었다면?

Figma 회고문서 부록 C와 동일한 분석을 코드 맥락에서 다시.

### 실수 1 (div로 직접 만듦) — Figma보다 더 잘 막힘

- ✅ 도움: frontmatter의 `figma.design` URL은 코드에서는 의미 없지만, **컴포넌트 이름이 명시**되어 있으면 (`name: Checkbox`) `import { Checkbox } from "@chord/react"` 경로가 자명해진다.
- ✅ Platform Implementation 섹션이 있다 → React/iOS/Android별로 어떤 컴포넌트를 어떻게 import해서 어떤 props로 써야 하는지 예제 코드가 박혀 있음. div로 직접 만들 명분이 사라진다.
- ⚠️ 단, md에 토큰만 있고 Platform Implementation 섹션이 없다면 Figma 케이스와 똑같이 *"여기 다 있으니 직접 짜자"* 함정이 더 깊어진다.

### 실수 2 (props 안 넘김) — 거의 확실히 막힘

- `props` 섹션에 모든 prop과 default 명시 → 어떤 prop을 넘겨야 하는지 명확
- `prop-constraints` 명시 → 잘못된 조합 사전 차단
- TypeScript 타입 정의를 md에서 바로 추출 가능

### 실수 3 (탐색 폭주) — 크게 줄어듦

- 컴포넌트 md 한 파일만 읽으면 됨 (Storybook도, .d.ts도 안 봐도 됨)
- import 경로, props, variants, 예제 코드, a11y 규칙, Do/Don't가 한 곳에 있음

### 정리

| 실수 | checkbox_v2.md급 문서가 막아주는가? |
|---|---|
| 1. div로 직접 만듦 | ✅ Platform Implementation 섹션이 있으면 거의 막음 |
| 2. props 안 넘김 | ✅ 거의 확실히 막음. props·prop-constraints가 명시됨 |
| 3. 탐색 폭주 | ✅ 크게 줄임. md 한 파일에 모든 정보 |

**핵심 차이**: Figma에서는 잘 정리된 md가 실수 1을 *오히려 위험하게 만들 수* 있었지만, 코드에서는 **Platform Implementation 섹션 덕분에 실수 1도 잘 막는다**. md에 React/iOS/Android 예제 코드가 박혀 있으면 div로 직접 만들 이유가 없어진다.

---

## 정리: 다음에 같은 작업을 할 때

### Pre-flight 체크리스트

- [ ] DS 패키지가 설치돼 있는가? (`package.json` 확인)
- [ ] 만들 화면에 어떤 컴포넌트가 필요한지 목록화 완료?
- [ ] 컴포넌트 md(checkbox_v2.md 같은)가 있는가? 있으면 이것만 읽기

### Build 단계

1. 컴포넌트 md에서 import 경로·props·prop-constraints 확인
2. 명시적으로 모든 props 넘겨서 컴포넌트 사용
3. DS에 없는 부분만 토큰(CSS 변수)으로 직접 작성
4. `as any`, `// @ts-ignore`, `!important` 같은 우회 패턴 사용 금지
5. visual regression 또는 Storybook 스냅샷으로 결과 검증

### Anti-patterns (피해야 할 것)

- ❌ 토큰만 있다고 div로 컴포넌트 재구현
- ❌ 컴포넌트 import만 하고 props 누락 (default variant 신뢰)
- ❌ `node_modules` grep, Storybook 풀로딩, source code 통째로 읽기
- ❌ `as any` / `// @ts-ignore`로 prop-constraints 우회
- ❌ DS 컴포넌트 위에 `className`으로 토큰 외 색상 덮어쓰기

### Pro-patterns (지향)

- ✅ 컴포넌트 md 한 파일만 읽고 import → 명시적 props로 사용
- ✅ DS에 없는 부분만 토큰으로 작성, 그 외엔 무조건 컴포넌트
- ✅ TypeScript discriminated union으로 prop-constraints 강제
- ✅ ESLint plugin으로 default variant 사용 금지 룰 적용
- ✅ 번들 사이즈와 a11y를 PR 체크리스트에 포함

---

## 한 줄 요약

> **"토큰을 따랐다"는 "DS를 썼다"가 아니다.**
> 코드에서는 더 무겁게 적용된다 — a11y·번들 사이즈·타입 안전성에 영구적인 흔적이 남기 때문이다.
> DS 패키지가 설치돼 있으면, div 짜기 전에 무조건 컴포넌트 md → 명시적 props로 import한다.
