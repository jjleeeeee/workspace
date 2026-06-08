---
component:
  name: "[V2] Checkbox"
  description: "단일 또는 복수 항목 선택에 사용합니다."
  figma_file: "DWEduE6GfxYMlyxKPNJ8jA"
  node_id: "60365:40276"
  component_set_key: "80eebb7d094726a1a9e864931f4347d76008ca25"
  last_synced: "2026-05-02"

axes:
  Mode: ["Default", "Fixed"]
  Type: ["Square", "Circle"]
  Status: ["Default", "Enabled", "Disabled"]

variants:
  count: 12
  formula: "Mode(2) × Type(2) × Status(3)"
  constraints:
    - "Mode, Type, Status 모든 조합이 유효하다. 예외 없음."
  registry:
    - { variant: "Mode=Default, Type=Square, Status=Default",   node_id: "60365:40277", key: "1ae35e933e8ae8b70a92056fdba5756efafa1cc2" }
    - { variant: "Mode=Default, Type=Circle, Status=Default",   node_id: "60365:40279", key: "f0f3604b4c06e466048b74a96662d818abf763eb" }
    - { variant: "Mode=Default, Type=Square, Status=Enabled",   node_id: "60365:40287", key: "b5dcca9ebab4095e296500b10b05a8831513a417" }
    - { variant: "Mode=Default, Type=Circle, Status=Enabled",   node_id: "60365:40289", key: "351492bbcdbd03282801f21aa5b9e9521dc9f5f1" }
    - { variant: "Mode=Default, Type=Square, Status=Disabled",  node_id: "60365:40297", key: "566198b07c0776362178e75fa0afdfe7977151b3" }
    - { variant: "Mode=Default, Type=Circle, Status=Disabled",  node_id: "60365:40299", key: "b1d057516b0b64d7474edd9bdf1a1b1386eba455" }
    - { variant: "Mode=Fixed,   Type=Square, Status=Default",   node_id: "60365:40307", key: "fdd2c753eaedebbab5130b27019402ffbf754c73" }
    - { variant: "Mode=Fixed,   Type=Circle, Status=Default",   node_id: "60365:40309", key: "2cf729ebb8448b8d7a3d82b4341c307391755227" }
    - { variant: "Mode=Fixed,   Type=Square, Status=Enabled",   node_id: "60365:40317", key: "541d07efd1affb9cb595579371b829e6c6249426" }
    - { variant: "Mode=Fixed,   Type=Circle, Status=Enabled",   node_id: "60365:40319", key: "0278f2c0e9a4c324529aaee8ac241ec04684219b" }
    - { variant: "Mode=Fixed,   Type=Square, Status=Disabled",  node_id: "60365:40327", key: "1fdc15732d1427bb3a540b8689c86c433660b19d" }
    - { variant: "Mode=Fixed,   Type=Circle, Status=Disabled",  node_id: "60365:40329", key: "fabb83704e82e49ac760350ad46c144b41c9c2ed" }

props:
  Mode:
    type: '"Default" | "Fixed"'
    default: '"Default"'
    description: "Default는 OS 테마에 따라 Light/Dark 전환. Fixed는 항상 dark 계열 고정 색상."
  Type:
    type: '"Square" | "Circle"'
    default: '"Circle"'
    description: "Square=모서리 둥근 사각형(List Item 맥락), Circle=원형(기본)."
  Status:
    type: '"Default" | "Enabled" | "Disabled"'
    default: '"Default"'
    description: "Default=미선택, Enabled=선택됨, Disabled=비활성."

tokens:
  box_stroke:
    part: "Box"
    role: "stroke"
    applies_to: "Status=Default"
    default: "system/color/outline/default-200a"
    fixed:   "system/fixed_color/outline/default-200a"
  enabled_bg:
    part: "BG"
    role: "fill"
    applies_to: "Status=Enabled"
    default: "system/color/roles/primary"
    fixed:   "system/fixed_color/roles/primary"
  disabled_bg:
    part: "BG"
    role: "fill"
    applies_to: "Status=Disabled"
    default: "system/color/surface/default-reverse-100a"
    fixed:   "system/fixed_color/surface/default-reverse-100a"
  disabled_stroke:
    part: "BG"
    role: "stroke"
    applies_to: "Status=Disabled"
    default: "system/color/outline/default-200a"
    fixed:   "system/fixed_color/outline/default-200a"

assets:
  check_icon:
    part: "Icon area"
    role: "icon"
    source: "24/em/ic_check_medium"
    applies_to: "Status=Enabled | Disabled"
    size: "16×16px"
    tint:
      default_enabled: "system/color/icon/default-reverse"
      default_disabled: "system/color/icon/200a"
      fixed_enabled: "system/fixed_color/icon/default-reverse"
      fixed_disabled: "system/fixed_color/icon/200a"
    implementation: "Use existing dev asset. Do not redraw as CSS/vector."

layout:
  component_size: "24×24px"
  box_size: "22×22px"
  icon_area: "16×16px"

rules:
  do:
    - "여러 항목을 0개부터 전체까지 선택할 수 있을 때 Check Box를 사용해야 한다."
    - "단일 항목의 동의, 승인, 확인에는 Check Box를 사용해야 한다."
    - "기본 Check Box는 Circle 타입을 사용해야 한다."
    - "Square 타입은 List Item처럼 지정된 맥락에서만 사용해야 한다."
    - "선택된 항목은 Enabled 상태로 명확하게 강조해야 한다."
    - "하위 리스트의 체크 표시는 ic_check_xsmall을 사용해야 한다."
  dont:
    - "여러 옵션 중 하나만 고르는 선택에 Check Box를 사용하지 않아야 한다. (선택 모델)"
    - "독립적으로 해제 가능한 Yes/No 결정을 Radio로 대체하지 않아야 한다. (해제 가능성)"
    - "Square와 Circle을 같은 선택 그룹 안에서 임의로 혼용하지 않아야 한다. (일관성)"
    - "Default 상태에 회색 check icon을 노출하지 않아야 한다. (상태 오인)"
    - "상위 항목의 상태와 하위 항목의 상태를 불일치하게 두지 않아야 한다. (계층 혼란)"
---

# [V2] Checkbox

> 단일 또는 복수 항목 선택에 사용합니다.

---

## 1. Axes

| Axis | Values |
| --- | --- |
| `Mode` | `Default` \| `Fixed` |
| `Type` | `Square` \| `Circle` |
| `Status` | `Default` \| `Enabled` \| `Disabled` |

**Variants:** `Mode(2) × Type(2) × Status(3) = 12` — 모든 조합 유효.

---

## 2. Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `Mode` | `"Default" \| "Fixed"` | `"Default"` | Default는 OS 테마에 따라 Light/Dark 전환. Fixed는 항상 dark 계열 고정 색상. |
| `Type` | `"Square" \| "Circle"` | `"Circle"` | Square=모서리 둥근 사각형(List Item 맥락), Circle=원형(기본). |
| `Status` | `"Default" \| "Enabled" \| "Disabled"` | `"Default"` | Default=미선택, Enabled=선택됨, Disabled=비활성. |

---

## 3. Layout

| Part | Size |
| --- | ---: |
| Component root | 24×24px |
| Box / BG | 22×22px |
| Icon area | 16×16px |

---

## 4. Tokens

| Token key | Part | Role | Applies to | Default | Fixed |
| --- | --- | --- | --- | --- | --- |
| `box_stroke` | Box | stroke | Status=Default | `system/color/outline/default-200a` | `system/fixed_color/outline/default-200a` |
| `enabled_bg` | BG | fill | Status=Enabled | `system/color/roles/primary` | `system/fixed_color/roles/primary` |
| `disabled_bg` | BG | fill | Status=Disabled | `system/color/surface/default-reverse-100a` | `system/fixed_color/surface/default-reverse-100a` |
| `disabled_stroke` | BG | stroke | Status=Disabled | `system/color/outline/default-200a` | `system/fixed_color/outline/default-200a` |

---

## 5. Assets

| Asset key | Part | Role | Source | Applies to | Size | Implementation |
| --- | --- | --- | --- | --- | ---: | --- |
| `check_icon` | Icon area | icon | `24/em/ic_check_medium` | Status=Enabled \| Disabled | 16×16px | 기존 개발 asset 사용. CSS/vector로 다시 그리지 않음. |

---

## 6. Do / Don't

**DO**

- 여러 항목을 0개부터 전체까지 선택할 수 있을 때 Check Box를 사용해야 한다.
- 단일 항목의 동의, 승인, 확인에는 Check Box를 사용해야 한다.
- 기본 Check Box는 Circle 타입을 사용해야 한다.
- Square 타입은 List Item처럼 지정된 맥락에서만 사용해야 한다.
- 선택된 항목은 Enabled 상태로 명확하게 강조해야 한다.
- 하위 리스트의 체크 표시는 `ic_check_xsmall`을 사용해야 한다.

**DON'T**

- 여러 옵션 중 하나만 고르는 선택에 Check Box를 사용하지 않아야 한다. (선택 모델)
- 독립적으로 해제 가능한 Yes/No 결정을 Radio로 대체하지 않아야 한다. (해제 가능성)
- Square와 Circle을 같은 선택 그룹 안에서 임의로 혼용하지 않아야 한다. (일관성)
- Default 상태에 회색 check icon을 노출하지 않아야 한다. (상태 오인)
- 상위 항목의 상태와 하위 항목의 상태를 불일치하게 두지 않아야 한다. (계층 혼란)
