# 결제하기
> 사용자가 주문자 정보, 배송지, 결제수단을 확인하고 최종 결제를 완료하는 화면

- **Figma**: `hSZA1GLBpbgIyDFOnibf99` / node `298:87781`
- **Platform**: iOS, AOS, Web

---

## Layout

```
┌─────────────────────┐
│ Top Navigation      │ Fixed
├─────────────────────┤
│ orderer.md          │
│ shipping.md         │
│ products.md         │ Scrollable
│ cash.md             │
│ amount.md           │
│ payment.md          │
│ terms.md            │
├─────────────────────┤
│ cta.md              │ Fixed
└─────────────────────┘
```

Body 영역만 수직 스크롤. 각 섹션은 카드 형태로 구분.

**Top Navigation**: `title="주문서"`, `left=back`, `right=없음`
→ [top_navigation.md](../../../99_archive/03_component_md/components/top_navigation.md) *(MD 미작성)*

---

## Screen States

| State | 트리거 | 변화 |
| --- | --- | --- |
| Loading | 진입 직후 | 전체 Body Skeleton |
| Default | 데이터 로드 완료 | 전체 섹션 노출 |
| Accordion Collapsed | 섹션 헤더 탭 | Info 영역 숨김, 아이콘 180도 회전 |
| CTA Disabled | 약관 미동의 | 결제하기 버튼 Disabled |
| CTA Enabled | 약관 동의 | 결제하기 버튼 Default |

---

## Navigation

- **진입**: 장바구니 "구매하기" → Push(→)
- **이탈**:
  - 뒤로가기 → Pop(←)
  - "변경" 버튼 → 주문자/배송지 수정 화면
  - "결제하기" → 결제 처리 → 주문 완료 화면

---

## Data Contract

| 데이터 | 소비 섹션 | 조건부 렌더링 |
| --- | --- | --- |
| `orderer` | orderer.md | 항상 노출 |
| `shippingAddress` | shipping.md | 항상 노출 |
| `products[]` | products.md | 개수만큼 반복 |
| `cashBalance` | cash.md | 0이면 입력 비활성 |
| `paymentMethods[]` | payment.md | 결제수단 목록 |
| `isIncomeDeductible` | payment.md | true일 때 Message Box 노출 |
| `termsAgreed` | cta.md | false이면 버튼 Disabled |

---

## Platform Differences

| 항목 | iOS | AOS | Web |
| --- | --- | --- | --- |
| Tab Bar | 하단 고정 노출 | 없음 | 없음 |
| Safe Area | 필요 | 불필요 | 불필요 |
| Status Bar | Notch 처리 필요 | 별도 처리 | 없음 |

---

## Layout Spec

> Figma 기준 추출값 (figma-console JS).

### 화면 전체

| 항목 | 값 |
| --- | --- |
| 화면 너비 | 393px (iPhone 기준) |
| GNB 높이 | 98px (Status Bar 50px + Navigation 48px) |
| Bottom 높이 | 336px (CTA 영역 252px + Tab Bar 84px) |

### Body

| 항목 | 값 | 토큰 |
| --- | --- | --- |
| Layout | VERTICAL | — |
| 좌우 여백 | 10px | (미바인딩) |
| 섹션 간 간격 | 12px | `system/size/padding/box/150` |
| 배경 | transparent | — |

### 섹션 카드 (공통)

| 항목 | 값 | 토큰 |
| --- | --- | --- |
| Padding | 16px (전체) | `system/size/padding/box/200` |
| Border radius | 16px | (미바인딩) |
| Item spacing (내부) | 16px | `system/size/padding/box/200` |
| Background | surface/default | `system/color/surface/default` |

**예외 — products.md (주문 상품)**

| 항목 | 값 |
| --- | --- |
| Padding top/bottom | 16px |
| Padding left/right | 0px (상품 이미지가 카드 끝까지 확장) |
