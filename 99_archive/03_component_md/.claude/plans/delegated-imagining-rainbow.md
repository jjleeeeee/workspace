# TEMPLATE.md 생성 플랜

## Context

Avatar / Badge / Button 3개 컴포넌트 MD가 100/100 검증 완료됐다.
3개 문서 분석 결과 섹션 구조가 완전히 동일함을 확인했다.
이 공통 구조를 `components/TEMPLATE.md`로 추출해 앞으로 만들 컴포넌트의 작성 기준으로 삼는다.
템플릿은 "현재까지 발견된 최선의 구조"이며, 새 컴포넌트를 추가할 때 필요시 업데이트한다.

---

## 출력 파일

`components/TEMPLATE.md`

---

## 구조 (3개 컴포넌트에서 추출한 공통 구조)

### 최상단 헤더
```
# {ComponentName}
> {한 줄 설명}
```

### 섹션 9개 (필수)

| # | 섹션 | 내용 |
|---|------|------|
| 1 | Role & Usage | 언제 쓰고 언제 안 쓰는지. 유사 컴포넌트와의 차이 |
| 2 | Visual Character | 시각적 인상, 밀도, 강조 수준 |
| 3 | Anatomy | root + 파트 목록 (label, icon slot, badge 등) |
| 4 | Component Styling | 타입별 색상/스타일 설명 |
| 5 | States & Interactions | 상태 목록 + State Matrix 표 |
| 6 | Layout & Responsive Rules | 크기별 padding/gap/radius. 화면 배치 규칙 |
| 7 | Do's and Don'ts | AI가 흔히 틀리는 오용 방지 |
| 8 | Agent Prompt Guide | 재사용 가능한 생성 지시문 |
| 9 | Implementation Contract | Public API / Variant Constraints / State Matrix / Token Mapping / Layout Contract / Accessibility / Figma Source Notes |

### Implementation Contract 서브섹션 7개 (필수)

```
### Public API / Props
### Variant Constraints
### State Matrix
### Token Mapping
### Layout Contract
### Accessibility
### Figma Source Notes
```

---

## 템플릿 업데이트 기준

TEMPLATE.md에 섹션을 추가하는 조건:
> **새 패턴이 앞으로 만들 컴포넌트의 30% 이상에 해당하는가?**
> - Yes → TEMPLATE.md에 optional 섹션으로 추가
> - No → 해당 컴포넌트 MD에만 기재

각 섹션은 **Required** / **Optional** 로 표시한다.
현재 9개 섹션은 모두 Required.

---

## 검증

- `components/TEMPLATE.md` 생성 후 avatar/badge/button MD와 섹션 구조 일치 확인
- 하네스(`eval.sh`)가 TEMPLATE.md를 입력으로 받으면 structure 체크만 PASS해야 함 (fixture 없으므로 variants/tokens/sources는 N/A)

---

## 전체 흐름

```
[Step 1] Component MD 보강 (Figma → layout/typography 추출)
[Step 2] 아이콘 카탈로그 생성 (REST API → components/icons.md)
[Step 3] DESIGN.md typography 보완 (fontWeight, letterSpacing 추가)
[Step 4] 코드 생성 (3 컴포넌트 × 3 플랫폼 = 9개 파일)
```

---

## Step 1. Component MD 보강

**도구:** `figma_get_component_for_development_deep`
- Button 컴포넌트 세트: `52753:39618` (Text Button)
- Badge 컴포넌트 세트: `8451:112783` (Badge_Dot), `8451:113030` (Badge_Number)
- Avatar 컴포넌트 세트: 기존 추출 로그에서 node ID 확인 필요

**추출 대상:**
- 내부 padding (상하/좌우)
- 아이콘-텍스트 gap
- 버튼 라벨에 사용된 typography token (fontSize, fontWeight)
- Border-radius token 참조 (`rounded/full` 등)

**각 component MD에 추가할 섹션:**
```markdown
## Layout

| Size | Padding (H) | Padding (V) | Gap | Border-radius | Label Typography |
|------|-------------|-------------|-----|---------------|-----------------|
| XLarge(52) | 20px | - | 6px | rounded/full | text-200 / semibold |
| Large(44)  | 16px | - | 6px | rounded/full | text-150 / semibold |
...
```

---

## Step 2. 아이콘 카탈로그 생성

**도구:** Figma REST API (이미 확인됨)
- 전체 2,904개 컴포넌트에서 `ic_` 패턴 필터링
- 174개 고유 아이콘 이름 추출
- 크기별 variant: tiny(10)~4xlarge(64)

**출력 파일:** `components/icons.md`
```markdown
# Icons

> Chord Design System 아이콘 카탈로그. 네이밍: ic_{name}, 크기 10~64px.

## 아이콘 목록
| 아이콘 이름 | 사용 가능 크기 |
```

---

## Step 3. DESIGN.md typography 보완

현재 `typography` 섹션에 `fontSize`+`lineHeight`만 있음.
rubric.im 스펙(Ch.7) 기준으로 `fontWeight`·`letterSpacing` 추가.

---

## Step 4. 코드 생성

**출력 디렉토리:** `generated/{platform}/`

### React (TypeScript)
- `generated/react/{ComponentName}.tsx`
- CSS custom properties로 DESIGN.md 토큰 매핑
- Props: component MD Properties → TypeScript union type
- 색상: `var(--color-roles-primary)` 형태
- 아이콘: `<Icon name="ic_search" size={24} />` 추상 참조

### Swift (SwiftUI)
- `generated/swift/{ComponentName}.swift`
- SwiftUI View + enum으로 variant 표현
- 색상: `Color("roles/primary")` (Asset Catalog 방식)
- 아이콘: `Image("ic_search")`

### Kotlin (Jetpack Compose)
- `generated/kotlin/{ComponentName}.kt`
- Composable function + sealed class로 variant
- 색상: 커스텀 토큰 또는 MaterialTheme
- 아이콘: `painterResource(R.drawable.ic_search)`

---

## 생성될 파일 목록

```
03_component_md/
├── components/
│   ├── avatar.md       ← Layout 섹션 추가
│   ├── badge.md        ← Layout 섹션 추가
│   ├── button.md       ← Layout 섹션 추가
│   └── icons.md        ← 신규
├── DESIGN.md           ← typography 보완
└── generated/
    ├── react/   Button.tsx, Badge.tsx, Avatar.tsx
    ├── swift/   Button.swift, Badge.swift, Avatar.swift
    └── kotlin/  Button.kt, Badge.kt, Avatar.kt
```

---

## 검증 기준

- 코드에 하드코딩된 색상값(hex) 없을 것 — 모두 토큰 참조
- 각 컴포넌트 props가 component MD Properties와 1:1 대응
- Layout 수치가 Figma 추출값과 일치
