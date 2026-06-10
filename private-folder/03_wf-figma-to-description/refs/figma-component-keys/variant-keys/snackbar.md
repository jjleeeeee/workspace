# Detail: [V2] Snackbar

Parent Component Set:
- Figma file: `DWEduE6GfxYMlyxKPNJ8jA`
- Source: Chord Design System
- Parent Node ID: `63694:5774`
- Component Set Key: `1d2be6f3586d1004dcb93f999e630377fe2a18c7`
- Variant Count: 2
- Last checked: 2026-05-01 KST
- Extraction source: Figma REST API / provided node link

| Variant | Node ID | Variant Component Key |
| --- | --- | --- |
| `Mode=Fixed` | `63694:5775` | `0bcedf9e6e0bbba92f64d166a22ba9d2fe613728` |
| `Mode=Default` | `63694:5789` | `a2d012aacb80f917c45d67b497f21e357391e628` |

## Usage Notes

Source: `Chord_Usage` / Snackbar (`1271:1243`)

Snackbar는 작업 결과에 대한 피드백을 제공하고, 필요한 경우 선택적 후속 조치를 돕기 위해 사용한다.

### Principle

- 간결한 문장으로 메시지를 전달하여 사용 흐름을 방해하지 않아야 한다.
- 일정 시간이 지나면 자동으로 사라져야 하며, 사용자가 아래로 스와이프하여 즉시 닫을 수 있어야 한다.
- 메시지의 성격 강조가 필요한 경우 아이콘을 적용할 수 있다.

### Type

- `none icon`: 간결한 문장으로 메시지를 전달할 때 사용한다.
- `icon`: 메시지의 성격 강조가 필요한 경우에만 아이콘을 함께 사용한다.

### Text

- 텍스트는 최대 3줄까지 노출해야 한다.
- 텍스트가 최대 너비에 도달하면 자동으로 줄바꿈 처리되고, 줄 수에 맞게 높이값이 조정되어야 한다.

### Layout

- 화면 좌우 마진은 10px로 두고 Screen fill로 노출해야 한다.
- Snackbar의 최대 너비는 410px을 넘지 않아야 한다.
- Home Indicator, GNB, CTA Button이 있는 경우 해당 요소 위쪽 y축에 노출해야 한다.

### Behavior

- 한 번에 하나의 Snackbar만 표시해야 한다.
- 여러 개의 Snackbar를 동시에 노출하지 않아야 한다.

### Button

- 버튼은 Snackbar 본문과 다른 컬러를 사용해야 한다.
- 주의를 끄는 Filled Button처럼 강조도가 높은 버튼을 Snackbar 안에 사용하지 않아야 한다.
