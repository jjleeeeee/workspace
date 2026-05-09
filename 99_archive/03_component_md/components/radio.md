---
component:
  name: "[V2] Radio"
  description: "단일 선택이 필요한 상황에서 사용합니다."
  figma_file: "DWEduE6GfxYMlyxKPNJ8jA"
  node_id: "59215:200965"
  component_set_key: "a04bcc0355ca5db25efdc00cdfc68958db3f5976"
  last_synced: "2026-05-02"

axes:
  Mode: ["Default", "Fixed"]
  Status: ["Default", "Enabled", "Disabled"]

variants:
  count: 6
  formula: "Mode(2) × Status(3)"
  constraints:
    - "Mode와 Status의 모든 조합이 유효하다. 예외 없음."
  registry:
    - { variant: "Mode=Default, Status=Default",  node_id: "59215:200966", key: "5936fa29f60ec656c6b879ba9a61f1816e14acec" }
    - { variant: "Mode=Default, Status=Enabled",  node_id: "59215:200968", key: "fae7ae5fecfdda6ded346b56064eb02f5b33d3a3" }
    - { variant: "Mode=Default, Status=Disabled", node_id: "59215:200970", key: "36d871cc8f534548e52b5fb054661411335e9566" }
    - { variant: "Mode=Fixed,   Status=Default",  node_id: "59215:200972", key: "60f524b48127b387e1c8508edb7e8ea60ccb3118" }
    - { variant: "Mode=Fixed,   Status=Enabled",  node_id: "59215:200974", key: "d6fbbc21bbc102d4345ba9b2911b77b335a4d3d5" }
    - { variant: "Mode=Fixed,   Status=Disabled", node_id: "59215:200976", key: "e05300683e362644f4614fb1711fe9f2fe3cdce8" }

props:
  Mode:
    type: '"Default" | "Fixed"'
    default: '"Default"'
    description: "Default는 OS 테마에 따라 Light/Dark 전환. Fixed는 항상 dark 계열 고정 색상."
  Status:
    type: '"Default" | "Enabled" | "Disabled"'
    default: '"Default"'
    description: "Default=미선택, Enabled=선택됨, Disabled=비활성."

tokens:
  outline_stroke:
    part: "Outline"
    role: "stroke"
    applies_to: "Status=Default, Status=Disabled"
    default: "system/color/outline/default-200a"
    fixed:   "system/fixed_color/outline/default-200a"
  active_primary:
    part: "Shape"
    role: "fill"
    applies_to: "Status=Enabled"
    default: "system/color/status/active-primary"
    fixed:   "system/fixed_color/status/active-primary"
  inner_circle_enabled:
    part: "inner-circle"
    role: "fill"
    applies_to: "Status=Enabled"
    default: "system/color/surface/default"
    fixed:   "system/fixed_color/surface/default-reverse"
  disabled_background:
    part: "Outline"
    role: "fill"
    applies_to: "Status=Disabled"
    default: "system/color/surface/default-reverse-100a"
    fixed:   "system/fixed_color/surface/default-reverse-100a"
  disabled_inner:
    part: "inner-circle"
    role: "fill"
    applies_to: "Status=Disabled"
    default: "system/color/surface/default-reverse-200a"
    fixed:   "system/fixed_color/surface/default-reverse-200a"
  label_gap:
    token: "system/size/padding/box/75"
    value: "6px"

layout:
  component_size: "24x24px"
  outline_diameter: "22px"
  inner_circle: "8px"
  label_gap: "6px"

rules:
  do:
    - "여러 항목 중 하나만 선택해야 할 때 Radio를 사용해야 한다."
    - "같은 선택 그룹 안에서는 동일한 control 타입을 사용해야 한다."
    - "가장 권장되거나 일반적인 옵션을 기본값으로 선택해야 한다."
    - "독립적인 동의, 승인, 확인은 Check Box를 사용해야 한다."
    - "선택 전 상태는 채워지지 않은 빈 원으로 표시해야 한다."
  dont:
    - "복수 선택 가능한 옵션에 Radio를 사용하지 않아야 한다. (선택 모델)"
    - "Radio와 Check Box를 같은 선택 그룹 안에서 함께 사용하지 않아야 한다. (일관성)"
    - "Radio group을 모두 미선택 상태로 노출하지 않아야 한다. (결정 부담)"
    - "단일 Yes/No 의사결정에 Radio를 사용하지 않아야 한다. (해제 가능성)"
    - "선택 전 상태에 dot을 표시하지 않아야 한다. (상태 오인)"
---

# [V2] Radio

> 단일 선택이 필요한 상황에서 사용합니다.

---

## 1. Axes

| Axis | Values |
| --- | --- |
| `Mode` | `Default` \| `Fixed` |
| `Status` | `Default` \| `Enabled` \| `Disabled` |

**Variants:** `Mode(2) × Status(3) = 6` — 모든 조합 유효.

---

## 2. Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `Mode` | `"Default" \| "Fixed"` | `"Default"` | Default는 OS 테마에 따라 Light/Dark 전환. Fixed는 항상 dark 계열 고정 색상. |
| `Status` | `"Default" \| "Enabled" \| "Disabled"` | `"Default"` | Default=미선택, Enabled=선택됨, Disabled=비활성. |

---

## 3. Layout

| Part | Size |
| --- | ---: |
| Component root | 24×24px |
| Outline (circle) | 22px |
| Inner circle | 8px |
| Label gap | 6px (`system/size/padding/box/75`) |

---

## 4. Tokens

| Token key | Part | Role | Applies to | Default | Fixed |
| --- | --- | --- | --- | --- | --- |
| `outline_stroke` | Outline | stroke | Status=Default, Disabled | `system/color/outline/default-200a` | `system/fixed_color/outline/default-200a` |
| `active_primary` | Shape | fill | Status=Enabled | `system/color/status/active-primary` | `system/fixed_color/status/active-primary` |
| `inner_circle_enabled` | inner-circle | fill | Status=Enabled | `system/color/surface/default` | `system/fixed_color/surface/default-reverse` |
| `disabled_background` | Outline | fill | Status=Disabled | `system/color/surface/default-reverse-100a` | `system/fixed_color/surface/default-reverse-100a` |
| `disabled_inner` | inner-circle | fill | Status=Disabled | `system/color/surface/default-reverse-200a` | `system/fixed_color/surface/default-reverse-200a` |

---

## 5. Do / Don't

**DO**

- 여러 항목 중 하나만 선택해야 할 때 Radio를 사용해야 한다.
- 같은 선택 그룹 안에서는 동일한 control 타입을 사용해야 한다.
- 가장 권장되거나 일반적인 옵션을 기본값으로 선택해야 한다.
- 독립적인 동의, 승인, 확인은 Check Box를 사용해야 한다.
- 선택 전 상태는 채워지지 않은 빈 원으로 표시해야 한다.

**DON'T**

- 복수 선택 가능한 옵션에 Radio를 사용하지 않아야 한다. (선택 모델)
- Radio와 Check Box를 같은 선택 그룹 안에서 함께 사용하지 않아야 한다. (일관성)
- Radio group을 모두 미선택 상태로 노출하지 않아야 한다. (결정 부담)
- 단일 Yes/No 의사결정에 Radio를 사용하지 않아야 한다. (해제 가능성)
- 선택 전 상태에 dot을 표시하지 않아야 한다. (상태 오인)
