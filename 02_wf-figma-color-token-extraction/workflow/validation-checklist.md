# Validation Checklist

`outputs/current/tokens.color.v1.0.json` 생성 후 반드시 확인한다.

| Check | Expected |
| --- | ---: |
| JSON parse | pass |
| validation `errorCount` | `0` |
| token type | `color` only |
| modes | `light`, `dark` |
| `base/color` output count | `0` |
| non-hex color value count | `0` |
| `aliasOf !== null` count | `0` |
| invalid usage count | `0` |
| `all-fills` usage count | `0` |

샘플 값:

| token | light | dark |
| --- | --- | --- |
| `token:system.color.button.default` | `#00CBD5` | `#01D5DF` |
| `token:system.color.text.primary` | `#00B8C1` | `#01D5DF` |
| `token:system.fixed-color.roles.primary` | `#01D5DF` | `#01D5DF` |

diagnostics 확인:

- `documentation:missing`은 현재 정상 경고다.
- `duplicate-alias`는 SameColor/FixedColor 정리 보류를 뜻한다.
- `alias:dangling`에 `token:system.color.roles.brand-green`이 있으면 삭제 참조
  예외로 유지한다.
- `hidden-from-publishing`은 현재 Figma 원천 상태에 따라 달라질 수 있다.
