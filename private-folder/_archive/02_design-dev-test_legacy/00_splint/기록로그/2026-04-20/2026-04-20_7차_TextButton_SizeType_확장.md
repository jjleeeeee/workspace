# 2026-04-20 — 7차 · Text Button Size×Type 매트릭스 확장

> 상위 문서: [../figma_ds_structure_audit_260420.md](../figma_ds_structure_audit_260420.md)
> 이전 사이클: [2026-04-20_6차_Button카탈로그_파일럿.md](2026-04-20_6차_Button카탈로그_파일럿.md)

**목표:** 6차에서 XLarge/Filled/Default 기준 1 variant만 토큰까지 resolve된 Text Button fixture를 **Size 6종 × Type 4종 매트릭스**로 확장한다. 사용자 지시 범위: Figma 노드 `52753:39618` 한 건만.

## 사용 도구/방법

- Framelink `get_figma_data` (fileKey=`DWEduE6GfxYMlyxKPNJ8jA`, nodeId=`52753:39618`) — 1.48MB raw yaml 재덤프
- figma-console `figma_analyze_component_set(52753:39618)` — axes/componentProps/stateNames 재확인 (defaultVariant·cssMap·signatures 모두 null 재현)
- figma-console `figma_get_variables(format=filtered, namePattern="button-height|box\b|button/|line/outlined|text/default|text/secondary|border-radius|corner", resolveAliases=true)` — 단일 호출로 padding/height/radius/color 토큰 일괄 resolve
- awk/grep로 yaml에서 variant별 subtree + globalVars.styles 섹션 pinpoint 추출

## 진행 과정

### 1. Size/Type 대표 variant nodeId 8개 픽
Framelink yaml을 `Mode=Default, *, *, Button Color=Default (Gray Ghost 단일컬러), Status=Default, Radius=off` 패턴으로 grep:

| axis | nodeId |
|---|---|
| Size=XLarge/Type=Filled (6차 baseline) | 52753:39619 |
| Size=Large(44)/Type=Filled | 52753:39788 |
| Size=Medium(40)/Type=Filled | 52753:39957 |
| Size=Small(36)/Type=Filled | 52753:40126 |
| Size=XSmall(32)/Type=Filled | 52753:40310 |
| Size=XXSmall(24)/Type=Filled | 52753:40490 |
| Type=Outlined_color (XLarge) | 52753:41783 |
| Type=Outlined_gray (XLarge) | 52753:42863 |
| Type=Ghost (XLarge) | 52753:43943 |

### 2. variant subtree + globalVars.styles에서 hex/padding/textStyle 추출
- globalVars.styles (line 34095~) 내 `fill_*` → hex, `layout_*` → padding/sizing 직접 resolve.
- Framelink는 여전히 **fills/strokes를 raw hex로만** 노출 (boundVariables 없음) — 6차의 `source-gap:framelink-hex-only` 재현.

### 3. figma-console로 hex → 토큰 이름 resolve
단일 `figma_get_variables` 호출(filter regex 포괄)로 48 variable resolve. 핵심 매핑:

| hex | 토큰 | VariableID |
|---|---|---|
| #00CBD5 | system/color/button/default | 53589:38209 |
| #000000 (BC=Black) | system/color/button/black | 53589:38210 |
| #DEDEDE | system/color/button/outlined_gray | 53589:38248 |
| #0000000A | system/color/button/hover | 53589:38252 |
| #0000001A | system/color/button/disabled | 53589:38253 |
| #FFFFFF (Filled text) | system/color/text/default-reverse | 1287:14155 |
| #000000 (Outlined_gray text) | system/color/text/default | 512:14926 |
| #484848 (Ghost text) | **미해결** | — |
| #00B8C1 (Outlined_color trailing-text) | **미해결** | — |
| rgba(255,255,255,0) (Ghost fill) | **하드코드** (토큰 없음) | — |

padding box/0·25·50·75·100·150·200·250·300 · radius box/75·100·150·200·250·300 · button-height xxsmall~xxlarge 전부 토큰 확보.

## 발견/결과

### Size → padding 매트릭스 (Filled 기준, horizontal)

| Size | 값 | 토큰 |
|---|---|---|
| XLarge(52) | 24px | padding.box.300 |
| Large(44) | 20px | padding.box.250 |
| Medium(40) | 16px | padding.box.200 |
| Small(36) | **16px** | padding.box.200 ← Medium과 동일 |
| XSmall(32) | 12px | padding.box.150 |
| XXSmall(24) | 8px | padding.box.100 |

**인사이트:** Size는 6단계인데 padding은 5단계. Medium·Small이 같은 16px을 공유 → 의도성 불명, Size grid가 평평한 구간 존재.

### Size → textStyle 매트릭스

XLarge→body-lg/700, Large→body-m/700, Medium→body-s/700, Small→body-xs/700, XSmall→caption-m/700, XXSmall→caption-s/700. **Ghost/XLarge만 weight=500** (body-lg/system-500) — Type이 font-weight에 개입하는 유일한 위치.

### Size → cornerRadius

XLarge~XSmall은 8px (`radius.box.100`), **XXSmall만 6px** (`radius.box.75`). Size-계단 내 corner 불일치.

### Type → container 구성 매트릭스

| Type | container | stroke | label color |
|---|---|---|---|
| Filled | fill = button.default/black | — | text.default-reverse (#FFF) |
| Outlined_color | — (fill 없음) | 1px button.default/black | button.default/black (stroke와 동색) |
| Outlined_gray | — | 1px button.outlined_gray (#DEDEDE) | text.default (#000) |
| Ghost | fill = **rgba(255,255,255,0) 하드코드** | — | **#484848 미해결** |

### 6차 잘못된 매핑 정정

6차 fixture의 Hover state notes에 `overlayFill=system/color/button/hover, …light: #0000000A`는 값은 맞았지만, **6차 매핑표의 `53589:38252→hover=#00B8C1` 문장은 오기**. 실제 `button/hover` = `#0000000A` (black-50a 오버레이). `#00B8C1`은 Outlined_color variant의 **trailing-text** fill에만 등장하며 식별 실패. 7차 fixture에서 state.diffFromDefault.notes로 정정 기록.

### token-binding 결과

`tokenBindings` 11 → **30건**으로 확장. 구성: Type별 container(fill/stroke) 7 + state overlay 2 + label.color 4 + padding 6(Size별) + height 6(Size별) + radius 2 + 기타 3.

- `token-binding:unresolved` — 2건 (Ghost label #484848, Outlined_color trailing-text #00B8C1)
- `token-binding:hardcoded` — 1건 (Ghost transparent fill)

### ajv 검증
```
✅ PASS: components.textbutton.sample.json conforms to components.v1.json
   components: 11 (detailed: 1, inventory: 10) · diagnostics: 11
```
(diagnostics 9→11: `token-binding:unresolved`, `token-binding:hardcoded` 추가)

## 실패 및 원인

- **#00B8C1 식별 실패** — `namePattern`에 legacy mint-600 / accent / trailing 관련 키워드 누락. 다음 사이클에 `base/color/light/mint-600` 또는 collection 전체 dump로 재시도.
- **#484848 식별 실패** — `text/secondary` 매치 없음. `gray-700` 계열일 가능성, base-layer 토큰까지 내려가 확인 필요.
- **XXSmall 6px corner 이상치** — 현 DiagnosticCode enum에 직접 대응 코드 없어 notes에만 기록. enum 후보: `token-binding:inconsistent-across-axis`.

## 해결 방법

- Framelink globalVars.styles 섹션을 활용해 Framelink 단독으로 수치 resolve (hex/padding/textStyle) → figma-console 의존 축소.
- figma-console `figma_get_variables`의 포괄 regex 1회 호출로 padding/height/radius/color 토큰을 한 번에 수집 — 6차의 variant별 drill-down 대비 1/8 호출 수.
- Token Catalog의 이중 구조(`tokens[]` + `diagnostics[]`)와 동일하게 per-component `diagnostics: []` 배열에 `token-binding:hardcoded` 추가 반영.

## 다음 사이클 이슈

1. **Mode=Fixed** — `Fixed` vs `Default` raw 차이 검증 (layout sizing? fixed-color collection 매핑?). `system/fixed_color/*` 토큰이 이미 존재 → Mode axis가 토큰 collection 스위치일 가능성.
2. **#484848 · #00B8C1 정체 확인** — 전체 collection dump 또는 `base/color/*` 전범위 namePattern scan.
3. **XXSmall 6px corner 의도성 확인** — 디자인 팀 결정 필요 (일관성 교정 vs 의도된 과장).
4. **Ghost transparent 토큰화** — `system/color/button/transparent` 또는 `system/opacity/0` 토큰 신설 제안.
5. **Size=Small이 Medium과 padding 공유하는 현상** — Size grid 리뷰 필요.
6. **Ghost/XLarge만 font-weight=500** — TYPO_tokens의 `system-500` 파생과 연결 후 schema에 textStyle 바인딩을 Size×Type 2D로 표현.
7. **Radius=on variant의 실제 값** — 현재 `Radius=off`만 probed. `on`일 때 cornerRadius가 어떤 토큰으로 바뀌는지 미확인 (pill/circle 여부).
8. **Status=Loading의 spinner 슬롯** — 여전히 anatomy 미반영, 다음 사이클 필수.

## 산출물

- `fixtures/components.textbutton.sample.json` — v0.1-draft → **v0.2-draft**. tokenBindings 11→30, diagnostics(catalog) 9→11, component.diagnostics에 `token-binding:hardcoded` 추가.
- 스키마 변경 없음(`schemas/components.v1.json` 그대로).
- 이 로그 파일.
