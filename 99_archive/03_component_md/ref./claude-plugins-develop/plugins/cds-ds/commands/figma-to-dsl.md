---
name: figma-to-dsl
description: "Figma URL을 Weverse DS DSL(cds-ds/dsl/v2)로 변환합니다. 예: /figma-to-dsl https://figma.com/design/..."
---

Figma URL `$ARGUMENTS` 를 받아 Weverse DS DSL v2로 변환한다.
아래 순서를 반드시 지킨다.

## 실행 순서

1. **매니페스트 로드 (선택)**
   현재 작업 디렉터리(DS module 루트)의 `ds-manifest.json`을 `Read` 도구로 읽는다.
   - 파일 존재 → JSON 파싱 후 `manifest` 변수에 저장
   - 파일 없음 → `manifest = null` 로 설정하고 계속 진행

2. **`figma_fetch_design("$ARGUMENTS")`** 호출
   루트 `nodes[]` 트리(FRAME/TEXT/INSTANCE/GROUP/IMAGE)와 `frame`·`source`를 수집한다. 각 노드에 layout·style·text·boundVariables·componentProperties(INSTANCE)가 v2 정규화 형태로 포함된다.

3. **`ds_list(manifest=<manifest>)`** 호출
   cds-catalogs에서 사용 가능한 DS 컴포넌트(atoms)와 토큰 컬렉션 목록을 확인한다. manifest 가 있으면 해당 플랫폼에서 선언된 항목만 반환된다.

4. **이름 기반 매핑 결정**
   Figma 컴포넌트 이름과 `ds_list().components`를 비교한다.
   - 경로 형식(`Button/Primary/Medium`)이면 마지막/첫 세그먼트로 매칭
   - 대소문자 무시, kebab/연속소문자 정규화 후 비교
   - 확신 없으면 억지 매핑 금지 — `catalog` 필드 생략하고 `Node.type = 'frame'/'group'` + `style` 직접 기술

5. **`ds_get(matched_ids, manifest=<manifest>)`** 호출
   매핑된 DS 컴포넌트·토큰 카탈로그를 fetch해 axes·props·slots·tokenBindings 정의를 확인한다.

6. **`ds_dsl_schema()`** 호출
   DSL 출력 스킴(cds-ds/dsl/v2)을 로드한다. `fields`, `rules`, `types`, `examples`, `enums` 섹션을 출력 형식 결정에 반드시 참조한다.

7. **DSL 생성 및 출력**
   수집한 데이터를 조합해 v2 DSL JSON을 생성하고 코드블록으로 출력한다.
   manifest 가 있으면 root에 `platform`, `dsManifest` 필드를 포함한다.

## 매핑 규칙

### 노드 타입 결정 (Node.type)

| Figma | Node.type | 추가 필수 |
|---|---|---|
| FRAME (auto-layout 있음) | `stack` | `layout.kind='stack'`, `layout.axis` |
| FRAME (auto-layout 없음, 절대 좌표) | `frame` | `layout.kind='absolute'` 또는 `'box'` |
| INSTANCE / COMPONENT | `component` | `catalog` 필드 |
| TEXT | `text` | `text.value` |
| RECTANGLE(image fill) / VECTOR | `image` 또는 `icon` | `asset` |
| GROUP | `group` | — |

### Catalog 매핑 (Node.type = 'component')

- `catalog.id`: `ds_list().components` 반환값(예: `'textbutton'`) — 소문자, 공백 없음
- `catalog.componentId`: 카탈로그 파일 내부 id(예: `'component:text-button'`) — 명확할 때만
- `catalog.variant`: Figma `componentProperties` 객체. **카탈로그 axes 값을 byte-exact 보존** — 공백·괄호·한국어·언더스코어·숫자 그대로(예: `'Large(44)'`, `'Default (Gray Ghost 단일컬러)'`, `'Outlined_color'`). 카탈로그 axes에 없는 키는 드롭, 정확히 일치하지 않으면 해당 axis 생략.
- `catalog.props`: 카탈로그 정의의 prop 이름을 그대로 사용(예: `'Button Text'`, `'Option-Leading'`). 표준 키(label/title/...)는 카탈로그에 정의된 이름이 없을 때만 hint로 활용.
- `catalog.slots`: `{ ref: '<자식 node id>' }` 또는 `{ text: '<값>' }` 형태. 카탈로그 slot 이름 우선(예: `'leading-icon'`, `'label'`). required slot이 비면 카탈로그 default로 채움.
- `catalog.state`: `'default'|'enabled'|'disabled'|'hover'|'pressed'|'focused'|'loading'|'selected'`

### Layout

- `layout.kind`: `'stack'|'box'|'overlay'|'absolute'|'scroll'`
- `layout.axis`: `'vertical'|'horizontal'` (kind='stack'에서만)
- `layout.size`: `{ width: { mode, value? }, height: { mode, value? } }` — mode는 `'fixed'|'hug'|'fill'`. Figma `layoutSizingHorizontal/Vertical` 매핑.
- `layout.padding`: `{ top, right, bottom, left }` 객체
- `layout.spacing`: Figma `itemSpacing` (number)
- `layout.alignment`: `{ main, cross }` — Figma `primaryAxisAlignItems`/`counterAxisAlignItems` 매핑
- `layout.frame`: 절대 좌표(`{x,y,width,height}`)는 디버깅·오버라이드용. positioning='flow'면 생략 가능.

### Style + Token 참조

- `style.fills`/`strokes`/`effects`/`cornerRadius`/`opacity`
- 모든 색·치수 값은 `TokenRef` 형태 — **4가지 형식**:
  1. `'token:<dotted.path>'` — DS 토큰 (예: `'token:system.color.button.default'`)
  2. `'hardcoded:<literal>'` — 리터럴 (예: `'hardcoded:rgba(255,255,255,0)'`)
  3. `'unresolved:<literal>'` — 토큰 매칭 실패 raw 값 (예: `'unresolved:#484848'`)
  4. `'textStyle:<name>'` — 복합 텍스트 스타일 (예: `'textStyle:body-lg/system-700'`)
- Figma `boundVariables`에서 토큰 id → `'token:...'` 형식으로 우선 변환. 실패 시 `'unresolved:...'`.

### Text (Node.type = 'text')

- `text.value`: Figma `characters` 그대로
- `text.textStyle`: `'textStyle:...'` 또는 `'token:typography.<...>'`
- `text.typography`: textStyle이 없을 때 `{ fontFamily, fontSize, fontWeight, lineHeight, letterSpacing }` 폴백
- `text.color`: TokenRef
- `text.maxLines`, `text.overflow`(`'clip'|'ellipsis'|'visible'`), `text.textAlign`

### Asset (Node.type = 'image' | 'icon')

- `asset.kind`: `'image'|'icon'|'lottie'|'video'`
- `asset.ref`: DS 에셋 참조 키(예: `'Icon/size=small(20)'`)
- `asset.url`: 원격 URL (있을 때)
- `asset.format`: `'png'|'jpg'|'svg'|'webp'|'json'`
- `asset.tint`: 아이콘 컬러 TokenRef
- `asset.alt`: 대체 텍스트

## 출력 형식

```json
{
  "schemaVersion": "2.0.0",
  "metadata": {
    "generatedAt": "<ISO 8601>",
    "generator": "cds-ds@<version>",
    "sourceFile": { "fileKey": "...", "fileName": "...", "nodeId": "..." }
  },
  "coordinateSystem": { "unit": "px", "origin": "topLeft", "scope": "relativeToParent", "scale": 1.0 },
  "themes": ["light", "dark"],
  "platform": "<ios|android|web>",
  "dsManifest": {
    "platform": "<ios|android|web>",
    "tokens": ["tokens.color.v1.0", "..."],
    "components": ["textbutton", "..."]
  },
  "nodes": [
    {
      "id": "n1",
      "type": "component",
      "name": "Buy Button",
      "source": { "figmaNodeId": "1:235", "componentId": "C:100", "instanceId": "I:200" },
      "catalog": {
        "id": "textbutton",
        "componentId": "component:text-button",
        "variant": { "Type": "Filled", "Size": "Large(44)", "Status": "Default" },
        "props": { "Button Text": "구매하기", "Option-Leading": false },
        "slots": { "label": { "text": "구매하기" } },
        "state": "default"
      },
      "layout": {
        "kind": "box",
        "size": { "width": { "mode": "fill" }, "height": { "mode": "fixed", "value": 44 } },
        "padding": { "top": 12, "right": 16, "bottom": 12, "left": 16 },
        "alignment": { "main": "center", "cross": "center" }
      },
      "style": {
        "fills": [{ "type": "solid", "color": "token:system.color.button.default" }],
        "cornerRadius": 8
      }
    }
  ]
}
```

## 검증

- 출력 직전에 `ds_dsl_schema()` 의 `enums` 섹션과 대조해 모든 enum 값(Node.type, Layout.kind, Alignment.main 등)이 허용 목록 안에 있는지 확인.
- `catalog.variant` 값이 `ds_get()` 으로 가져온 카탈로그 axes 배열 원소와 정확히 일치하는지 byte 단위 대조.
- token 참조(`token:...`)가 `ds_get()` tokens 결과의 id 와 매칭되는지 확인. 실패 시 `'unresolved:...'`로 표기.
