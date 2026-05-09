# 결제하기 Screen — 섹션 인덱스
> 사용자가 상품 구매를 최종 확인하고 결제를 완료하는 주문서 화면

<!-- 실험 v2: 섹션/영역 단위 분리 + 참조 방식 -->
<!-- 이 파일은 화면의 섹션 목록과 흐름만 정의. 상세 구현은 각 섹션 파일 참조 -->

---

## Screen Overview

- **Screen ID**: checkout
- **Platform**: iOS, AOS, Web
- **Figma**: `hSZA1GLBpbgIyDFOnibf99` / node `298:87781`

### 섹션 구성

| 영역 | 파일 | 고정 여부 |
| --- | --- | --- |
| GNB | [sections/checkout_gnb.md](sections/checkout_gnb.md) | Fixed (top) |
| 주문자 | [sections/checkout_orderer.md](sections/checkout_orderer.md) | Scrollable |
| 배송 주소 | [sections/checkout_shipping.md](sections/checkout_shipping.md) | Scrollable |
| 주문 상품 | [sections/checkout_products.md](sections/checkout_products.md) | Scrollable |
| 캐시 | [sections/checkout_cash.md](sections/checkout_cash.md) | Scrollable |
| 결제 금액 | [sections/checkout_amount.md](sections/checkout_amount.md) | Scrollable |
| 결제 수단 | [sections/checkout_payment.md](sections/checkout_payment.md) | Scrollable |
| 유의사항·약관 | [sections/checkout_terms.md](sections/checkout_terms.md) | Scrollable |
| Bottom CTA | [sections/checkout_cta.md](sections/checkout_cta.md) | Fixed (bottom) |

### 섹션 순서

```
주문자 → 배송주소 → 주문 상품 → 캐시 → 결제금액 → 결제수단 → 유의사항·약관
```

---

## Screen States

| State | 설명 | 영향 섹션 |
| --- | --- | --- |
| Loading | 데이터 로드 중 | 전체 Body 섹션 |
| Default | 정상 렌더링 | — |
| CTA Disabled | 약관 미동의 | checkout_cta |
| CTA Enabled | 약관 동의 | checkout_cta |

---

## Navigation & Flow

- **진입**: 장바구니 → Push(→)
- **이탈**: 뒤로가기 → Pop(←) / 결제 완료 → 주문완료 화면
- **섹션 내 이동**: "변경" 버튼 → 해당 수정 화면

---

## Data Contract (Screen-level)

| 데이터 | 소비 섹션 |
| --- | --- |
| orderer | checkout_orderer |
| shippingAddress | checkout_shipping |
| products[] | checkout_products |
| cashBalance | checkout_cash |
| paymentMethods[] | checkout_payment |
| isIncomeDeductible | checkout_payment |
| termsAgreed | checkout_cta |

---

## 컴포넌트 참조

이 화면에서 사용하는 컴포넌트는 `99_archive/03_component_md/components/`를 참조.

| 컴포넌트 | 참조 파일 | 이 화면에서의 사용 |
| --- | --- | --- |
| Button | [button.md](../../../99_archive/03_component_md/components/button.md) | 변경 버튼 (Outlined_gray/XSmall) |
| Checkbox | [checkbox.md](../../../99_archive/03_component_md/components/checkbox.md) | 캐시 전액 사용, 약관 동의 |

---

## Agent Prompt Guide

```
Use when: 결제하기 화면의 전체 흐름을 파악하거나, 특정 섹션을 구현할 때
Always: 섹션별 파일을 먼저 확인한 후 구현
Always: GNB·Bottom CTA는 Fixed, Body는 Scrollable
Never: 섹션 순서 변경 금지
Check: 섹션 간 데이터 의존성 (termsAgreed → CTA 상태)
```
