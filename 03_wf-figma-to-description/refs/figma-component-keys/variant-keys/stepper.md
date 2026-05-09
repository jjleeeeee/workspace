# Detail: [V2] Stepper

Parent Component Set:
- Figma file: `DWEduE6GfxYMlyxKPNJ8jA`
- Source: Chord Design System
- Parent Node ID: `61604:4394`
- Component Set Key: `684550ae4653da74717f2599c3da1bb7b7640d73`
- Variant Count: 6
- Last checked: 2026-05-01 KST
- Extraction source: Figma REST API / provided node link

| Variant | Node ID | Variant Component Key |
| --- | --- | --- |
| `Mode=Default, State=Default` | `61604:4395` | `0a83b0528461a1160cdf2191987253aba33dfb10` |
| `Mode=Default, State=Disabled` | `61604:4404` | `3d3a1d26619b9f4f4a445fbee4756e677b12159b` |
| `Mode=Default, State=Enabled` | `61604:4413` | `dbd35703f40cedfbffc5fc8919e3dc0daf0ccd25` |
| `Mode=Fixed, State=Default` | `61604:4422` | `288984866d159f7bb82d080e525ef83a89c016a4` |
| `Mode=Fixed, State=Enabled` | `61604:4431` | `0344ba07faecd60987f98e512142c57de9adc977` |
| `Mode=Fixed, State=Disabled` | `61604:4440` | `beca73b9a54214b6a102120e9ada030f2287040d` |

## Usage Notes

Source: `Chord_Usage` / Stepper (`1278:605`)

Stepper는 상품 수량을 직접 입력하거나 `-`, `+` 버튼으로 조정하기 위해 사용한다.

### Principle

- 최대 두자리수까지 입력할 수 있어야 한다.
- 높이와 너비는 고정되어야 한다.

### Interaction

- 사용자는 숫자를 직접 입력하거나 `-`, `+` 버튼으로 수량을 조정할 수 있어야 한다.
- 수량을 줄일 수 없는 상태에서는 `-` 버튼을 Disabled 상태로 표시해야 한다.
- 수량을 늘릴 수 없는 상태에서는 `+` 버튼을 Disabled 상태로 표시해야 한다.

### Text

- Stepper의 수량 텍스트는 최대 두자리수까지 입력할 수 있어야 한다.
- 세자리수 입력은 허용하지 않아야 한다.

### Size

- Stepper는 고정된 높이와 너비를 사용해야 한다.
- 임의로 높이나 너비를 조절하지 않아야 한다.
