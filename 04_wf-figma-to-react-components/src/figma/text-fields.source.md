---
component: TextFields
figma_name: "[V2] Text_Fields"
node_id: "62030:25225"
component_key: "1cd268687529359f71d915dd915ac2eac7eb3fa4"
source_read: "2026-05-08"
status: partial/input-branches-implemented
---

# Text Fields Source Note

## Description

사용자가 텍스트를 입력하거나 편집하고 입력 상태와 피드백을 확인하는 폼 입력 컴포넌트.

## MCP Reads

- Console MCP `figma_get_component(62030:25225, format=metadata, enrich=true)` on 2026-05-08.
- Console MCP `figma_get_component_image(62030:25485, scale=3)` — Default/Single/Default.
- Console MCP `figma_get_component_image(62030:25509, scale=3)` — Default/Single/Enabled.
- Console MCP `figma_get_component_image(62030:25521, scale=3)` — Default/Single/Error.
- Console MCP `figma_get_component_image(62030:25473, scale=3)` — Default/Single/Disabled.
- Console MCP `figma_get_component_image(62030:25244, scale=3)` — Default/Multiple/Default.
- Console MCP `figma_get_component_image(62030:25395, scale=3)` — Fixed/Single/Default.
- Figma official MCP `get_context_for_code_connect(62030:25225)` on 2026-05-08.
- Figma official MCP `get_design_context(62030:25485)` on 2026-05-08 — Default/Single/Default rendered structure.
- Console MCP `figma_get_component(I62030:25493;10219:79410, format=metadata)` on 2026-05-08 — country-code `24/em/ic_arrow_down_medium` icon-area instance.
- Figma official MCP `get_design_context(62030:25395)` on 2026-05-08 — Fixed / Single / Default rendered structure; TextField radius is `system/size/radius/box/100` (8px).

## Figma Contract

- Axes: `Mode`, `Lines`, `Status`
- `Mode`: `Default`, `Fixed`
- `Lines`: `Single`, `Multiple`
- `Status`: `Default`, `Disabled`, `Enabled`, `Error`, `Success`
- Variant count: 20 (`Mode(2) × Lines(2) × Status(5)`)
- Boolean props: `Guide_Message`, `Country_Code`, `Scrollbar`, `Character_Counter`, `Show_Badge_Dot`, `Show_Title`
- Text props: `Title_Label`, `Multi_line_Label`, `Character_Counter_Label`
- Variant shell coverage: 20 visual shell combinations are implemented.
- Nested coverage: `partial/input-branches-implemented`. Default / Single / Default implements the visible nested Input branch (country code, arrow icon, divider, placeholder label, Text Button, timer) and Guide Message default text. Input clear/caret/check/eye branches and Guide Message `text-button` case are all implemented. `Hidden` password-toggle interaction and status-specific Guide Message components remain deferred.

## Code Props Mapping

| Figma axis / prop           | React prop             | Type                                                                    | Default       | Notes                                          |
| --------------------------- | ---------------------- | ----------------------------------------------------------------------- | ------------- | ---------------------------------------------- |
| `Mode`                      | `mode`                 | `"default" \| "fixed"`                                                  | `"default"`   | Figma-facing                                   |
| `Lines`                     | `lines`                | `"single" \| "multiple"`                                                | `"single"`    | Figma-facing                                   |
| `Status`                    | `status`               | `"default" \| "disabled" \| "enabled" \| "error" \| "success"`         | `"default"`   | Figma-facing                                   |
| `Show_Title`                | `showTitle`            | `boolean`                                                               | `true`        | Figma-facing                                   |
| `Title_Label`               | `titleLabel`           | `string`                                                                | `"Title"`     | runtime content; hidden from Controls          |
| `Show_Badge_Dot`            | `showBadgeDot`         | `boolean`                                                               | `true`        | Figma-facing; renders `BadgeDot`               |
| `Character_Counter`         | `characterCounter`     | `boolean`                                                               | `true`        | Figma-facing                                   |
| `Character_Counter_Label`   | `characterCounterLabel`| `string`                                                                | `"12/200"`    | runtime content; hidden from Controls          |
| `Country_Code`              | `countryCode`          | `boolean`                                                               | `true`        | Figma-facing; Single only                      |
| Country code content        | `countryCodeLabel`     | `string`                                                                | `"+82"`       | runtime content; hidden from Controls          |
| `Guide_Message`             | `guideMessage`         | `boolean`                                                               | `true`        | Figma-facing                                   |
| Guide message content       | `guideMessageLabel`    | `string`                                                                | `"Guide Message"` | runtime content; hidden from Controls      |
| nested Input Show Button    | `inputButton`          | `boolean`                                                               | `true`        | runtime/nested content; hidden from Controls   |
| nested Input Button Text    | `inputButtonLabel`     | `string`                                                                | `"Text"`      | runtime/nested content; hidden from Controls   |
| nested Input Show Timer     | `timer`                | `boolean`                                                               | `true`        | runtime/nested content; hidden from Controls   |
| nested Input Timer Label    | `timerLabel`           | `string`                                                                | `"02:13"`     | runtime/nested content; hidden from Controls   |
| `Scrollbar`                 | `scrollbar`            | `boolean`                                                               | `true`        | Figma-facing; Multiple only                    |
| `Multi_line_Label`          | `multiLineLabel`       | `string`                                                                | `"일이삼사오육"` | runtime content; hidden from Controls          |
| placeholder text            | `placeholder`          | `string`                                                                | `"일이삼사오육"` | runtime content; hidden from Controls        |
| native value                | `value`                | `string`                                                                | —             | runtime content; hidden from Controls          |
| native default value        | `defaultValue`         | `string`                                                                | —             | runtime content; hidden from Controls          |
| native change handler       | `onChange`             | `ChangeEventHandler<HTMLInputElement \| HTMLTextAreaElement>`           | —             | runtime behavior; hidden from Controls         |
| native single input props   | `inputProps`           | `InputHTMLAttributes<HTMLInputElement>`                                  | —             | runtime behavior; hidden from Controls         |
| native textarea props       | `textareaProps`        | `TextareaHTMLAttributes<HTMLTextAreaElement>`                            | —             | runtime behavior; hidden from Controls         |

## Layout

### Variant Shell (outer container)
- Width: 393px
- Single height: 95px (title 18px + gap 6px + textField 48px + gap 6px + guideMessage 17px)
- Multiple height: 155px (title 18px + gap 6px + textField 108px + gap 6px + guideMessage 17px)
- Direction: vertical
- Gap between sections: 6px
- Padding: 16px left/right

### Title Row
- Width: 361px, height: 18px
- Direction: horizontal, gap: 8px, padding-x: 4px
- Character counter area: 46×18px (right side)

### Text Flow Contract
- `Title_Label` and `Show_Badge_Dot` share the title main text flow.
- `Badge_Dot` follows the rendered end of the title text, not the full title container end.
- Title internal layout follows Figma as a nested row: gap 2px, `align-items: flex-start`, Badge_Dot top offset 0px inside the 18px title row.
- The character counter remains a separate right-side slot.
- Do not implement the title as `flex: 1` text followed by Badge_Dot as a row sibling; that places the badge at the container/counter edge instead of the text end.
- Do not use `vertical-align` to approximate the badge position; keep Badge_Dot as a nested flex item with explicit 0px top offset.

### Text Field Box (Single)
- Width: 361px, height: 48px
- Direction: horizontal, gap: 8px
- Padding: 12px top/bottom, 16px left/right
- Border-radius: `system/size/radius/box/100` (8px) in both Default and Fixed mode.
- Fixed mode changes token family only; it does not remove TextField radius.
- Country code prefix: 63×22px
  - code text: `+82`, 30×22px, body-m/system-400
  - icon_area: 16×16px, `24/em/ic_arrow_down_medium`
  - divider: 1×18px, component state shape / bottom_line
- Input body: 258×24px
  - input area: 164×24px in default branch
  - placeholder label: `일이삼사오육`, 16px / 22px, `system/color/text/300a`
  - Text Button: `Type=Outlined_gray`, `Size=XXSmall(24)`, label `Text`
  - timer: `02:13`, 37×18px, `system/color/text/primary`

### Text Field Box (Multiple)
- Width: 361px, height: 108px
- Direction: horizontal, gap: 2px
- Padding: 12px top/bottom, 16px left/right
- Border-radius: 8px
- Scrollbar slot: 10×108px (right side)

### Guide Message
- Width: 361px, height: 17px
- Padding-x: 4px

## Token Mapping

### TextField stroke
| Status           | Mode=Default token                              | Mode=Fixed token                                      |
| ---------------- | ----------------------------------------------- | ----------------------------------------------------- |
| Default          | `--cds-system-color-status-inactive-gray`        | `--cds-system-fixed-color-status-inactive-gray`       |
| Disabled         | `--cds-system-color-status-inactive-gray`        | `--cds-system-fixed-color-status-inactive-gray`       |
| Enabled          | `--cds-system-color-status-focus-gray-400`       | `--cds-system-fixed-color-status-focus-gray-400`      |
| Error            | `--cds-system-color-status-danger-red`           | `--cds-system-fixed-color-status-danger-red`          |
| Success          | `--cds-system-color-status-inactive-gray`        | `--cds-system-fixed-color-status-inactive-gray`       |

### TextField fill (background)
| Status           | Mode=Default token                                      | Mode=Fixed token                                              |
| ---------------- | ------------------------------------------------------- | ------------------------------------------------------------- |
| Disabled         | `--cds-system-color-status-background-disabled`          | `--cds-system-fixed-color-status-background-disabled`         |
| Others           | transparent                                             | transparent                                                   |

### Title text color
| Status           | Mode=Default token                        | Mode=Fixed token                               |
| ---------------- | ----------------------------------------- | ---------------------------------------------- |
| Default/Disabled/Enabled | `--cds-system-color-text-400a` (opacity 0.5) | `--cds-system-fixed-color-text-400a` (opacity 0.5) |
| Success          | `--cds-system-color-text-primary`          | `--cds-system-fixed-color-text-primary`         |
| Error            | `--cds-system-color-status-danger-red`     | `--cds-system-fixed-color-status-danger-red`    |

### Input text color
| State            | Mode=Default token                  | Mode=Fixed token                          |
| ---------------- | ----------------------------------- | ----------------------------------------- |
| Active text      | `--cds-system-color-text-default`   | `--cds-system-fixed-color-text-default`   |
| Placeholder      | `--cds-system-color-text-300a` (opacity 0.3) | `--cds-system-fixed-color-text-300a` (opacity 0.3) |
| Disabled         | `--cds-system-color-text-200a` (opacity 0.2) | `--cds-system-fixed-color-text-200a` (opacity 0.2) |

### Country code and default Input branch
| Part             | Token / source                                      | Notes |
| ---------------- | --------------------------------------------------- | ----- |
| Country code text | `--cds-system-color-text-default` / fixed equivalent | `+82`, 16px / 22px |
| Country code icon | `ChordIcon name="arrowDownMedium"`                 | Figma instance name `24/em/ic_arrow_down_medium`; rendered inside 16×16 `icon_area`. |
| Country code divider | `--cds-system-color-divider-default-200a` / fixed equivalent | 1×18 bottom_line state shape. |
| Text Button      | `TextButton buttonType="outlinedGray" size="xxsmall"` | Nested visible default action. |
| Timer            | `--cds-system-color-text-primary` / fixed equivalent | `02:13`, 14px / 18px. |

### Guide message text color
| Status   | Mode=Default token                          | Mode=Fixed token                                    |
| -------- | ------------------------------------------- | --------------------------------------------------- |
| Success  | `--cds-system-color-text-primary`           | `--cds-system-fixed-color-text-primary`             |
| Error    | `--cds-system-color-status-danger-red`      | `--cds-system-fixed-color-status-danger-red`        |
| Default  | (inherits guide message component styling)  | (inherits guide message component styling)          |

### Character counter text color
| Mode=Default token                        | Mode=Fixed token                                |
| ----------------------------------------- | ----------------------------------------------- |
| `--cds-system-color-text-400a` (opacity 0.5) | `--cds-system-fixed-color-text-400a` (opacity 0.5) |

### Scrollbar thumb color (Multiple only)
| Mode=Default token                                   | Mode=Fixed token                                           |
| ---------------------------------------------------- | ---------------------------------------------------------- |
| `--cds-system-color-surface-default-reverse-200a`    | `--cds-system-fixed-color-surface-default-reverse-200a`   |

## Nested Module Inventory

Nested coverage: `partial/default-branch`

| Nested role | Node/key evidence | Owner type | Axes/props/options observed | Required child atoms/assets | Coverage | Decision |
| ----------- | ----------------- | ---------- | --------------------------- | --------------------------- | -------- | -------- |
| Title Badge_Dot | `Show Badge_Dot#65547:0` | atom | Mode Default/Fixed, Size Small, Outline OFF | `BadgeDot` | complete | Compose `BadgeDot mode={mode} size="small"` inline with title text. |
| Scrollbar | `Scrollbar#8758:1` | atom | Mode Default/Fixed-White | `Scrollbar` | complete | Compose only for `Lines=Multiple && Scrollbar=true`. |
| Country Code arrow | `I62030:25493;10219:79410`, `24/em/ic_arrow_down_medium` | icon asset inside `icon_area` | 16×16 wrapper, 24px exported source frame | `ChordIcon` registry | complete/default | Registry entry is contextual to TextFields default branch because the official context provided an instance id, not a reusable component key. |
| Country Code divider | `62030:25494`, `bottom_line` | component state shape | 1×18 vertical line | CSS state shape | complete/default | Not an icon asset; implemented as divider shape. |
| Input | `62030:25118`, nested `Input` | component-set | Status Default/Enabled/Disabled plus `Typing Clear`, `Show Caret`, `Show Check Icon`, `Show Eye Icon`, `Show Button`, `Show Timer`, `Label` | Input, TextButton, Hidden, icon assets | partial | Editable native input, button, timer, `typingClear`, `showCaret`, `showCheckIcon`, `showEyeIcon` all implemented. `Hidden` password-toggle interaction deferred (eye icon renders via `showEyeIcon` but toggle behaviour is not wired). |
| Guide Message | `62030:25179`, nested `Guide Message` | component-set | Message text prop, Case variants | GuideMessage | partial | Default text branch and `guideMessageCase="text-button"` both implemented. Status-specific Guide Message sub-components deferred. |
| Text Button | nested inside Input | atom | Input trailing action: Type Outlined_gray, Size XXSmall(24), label Text | `TextButton` | complete/default | Composed through existing `TextButton`, not re-drawn in TextFields CSS. |
| Hidden | nested inside Input | atom | password visibility control | Hidden/icon assets | deferred | Not surfaced in this TextFields rebuild. |

## Visual References

| Variant                    | Node ID     | Local baseline |
| -------------------------- | ----------- | -------------- |
| Default / Single / Default | 62030:25485 | `src/figma/baselines/text-fields-default.png`, `src/figma/baselines/text-fields-default@3x.png` |

Other variants were read through MCP on 2026-05-08, but only Default / Single / Default is promoted to a parity gate in this phase.

Visual registry id: `text-fields-default`
Visual registry scope: `comparisonScope="full-parity"`, `isParityGate=true`.
This parity gate covers Default / Single / Default only. It must not be generalized
to all nested Input branches until clear/check/eye/caret and Guide Message Text
Button cases are implemented.

## Known Gaps

- **Input component-set full coverage:** Figma의 `Input` 컴포넌트 세트(`62030:25118`) 전체를 독립 컴포넌트로 만들지는 않았다. `typingClear`, `showCaret`, `showCheckIcon`, `showEyeIcon`, `inputButton`, `timer` 등 내부 브랜치는 모두 구현됐다. 미구현: `Hidden` password-toggle 상호작용 (아이콘은 `showEyeIcon`으로 렌더링되지만 visibility 토글 동작은 연결되지 않음).
- **Guide Message component-set full coverage:** Default text branch와 `guideMessageCase="text-button"` 모두 구현됐다. Status-specific Guide Message 서브컴포넌트는 deferred.
- **Fixed mode radius correction:** Earlier source note incorrectly treated Fixed mode as radius 0. Direct read of `62030:25395` shows TextField keeps `system/size/radius/box/100` (8px). Implementation follows the rendered variant.
- **Country code variants:** Default branch의 `+82`와 arrow/down divider는 구현했다. 다른 country code content variants는 runtime content로 처리한다.

## Alpha Token Notes

- N/A for legacy backfill (2026-05-08): explicit evidence for this section was not recorded as a dedicated section in the existing source note.
- Re-read Figma and replace this note with concrete evidence before changing this component contract.

## Font Mapping Notes

- N/A for legacy backfill (2026-05-08): explicit evidence for this section was not recorded as a dedicated section in the existing source note.
- Re-read Figma and replace this note with concrete evidence before changing this component contract.

## Text Behavior Notes

- N/A for legacy backfill (2026-05-08): explicit evidence for this section was not recorded as a dedicated section in the existing source note.
- Re-read Figma and replace this note with concrete evidence before changing this component contract.

## Sizing Interpretation Notes

- N/A for legacy backfill (2026-05-08): explicit evidence for this section was not recorded as a dedicated section in the existing source note.
- Re-read Figma and replace this note with concrete evidence before changing this component contract.

## Nested Atom Mapping

- N/A for legacy backfill (2026-05-08): explicit evidence for this section was not recorded as a dedicated section in the existing source note.
- Re-read Figma and replace this note with concrete evidence before changing this component contract.

## Token vs Rendered Pixel Notes

- N/A for legacy backfill (2026-05-08): explicit evidence for this section was not recorded as a dedicated section in the existing source note.
- Re-read Figma and replace this note with concrete evidence before changing this component contract.
