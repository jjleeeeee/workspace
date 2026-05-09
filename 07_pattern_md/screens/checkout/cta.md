# Bottom CTA
> 약관 동의 확인 후 결제를 실행하는 고정 하단 영역

## 구성

- 약관 동의 Checkbox + 약관 링크 텍스트
- 결제하기 Button (전체 너비)
- Tab Bar (iOS only)

## 상태

| 조건 | Button 상태 |
| --- | --- |
| `termsAgreed=false` | `Status=Disabled` |
| `termsAgreed=true` | `Status=Default` |

## 컴포넌트

- `Checkbox` 약관 동의 → [checkbox.md](../../../99_archive/03_component_md/components/checkbox.md)
- `Button` `Type=Filled, Size=XLarge(52), fullWidth=true, label="결제하기"` → [button.md](../../../99_archive/03_component_md/components/button.md)
- `Tab Bar` iOS only, `focus=Shop` → [bottom_navigation.md](../../../99_archive/03_component_md/components/bottom_navigation.md) *(MD 미작성)*
