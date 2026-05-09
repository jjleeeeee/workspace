# 결제하기 Screen
> 사용자가 상품 구매를 최종 확인하고 결제를 완료하는 주문서 화면

<!-- 실험 v1: 전체 페이지 단위 + 인라인 방식 -->

---

## 1. Screen Purpose

사용자가 장바구니에서 넘어온 상품에 대해 주문자 정보, 배송지, 결제수단을 확인·수정하고 최종 결제를 실행한다.

- **진입 맥락**: 장바구니 또는 상품 상세에서 "구매하기" 탭
- **성공 정의**: 결제 완료 후 주문 완료 화면으로 이동

---

## 2. Layout Structure

```
┌──────────────────────────┐
│ GNB (Fixed)              │  Status Bar + AppBar
├──────────────────────────┤
│                          │
│ Body (Scrollable)        │  여러 섹션 카드 (accordion 포함)
│                          │
├──────────────────────────┤
│ Bottom CTA (Fixed)       │  약관동의 + 결제 버튼
│ Tab Bar (iOS only)       │
└──────────────────────────┘
```

- GNB, Bottom은 Fixed. Body만 수직 스크롤.
- Body 내 각 섹션은 카드(borderRadius: 16px) 형태로 구분.

---

## 3. Component Composition

### 3.1 GNB

- `Status_bar`: OS=iOS, Notch=True, Mode=Light
- `Navigation` (AppBar):
  - Mode=Default, Text Type=Center, Scroll Bg=On
  - title: `"주문서"`, textStyle: `body-lg/system-700`
  - Leading: true (뒤로가기 아이콘)
  - Trailing: false (아이콘 없음)
  - Image: true

### 3.2 Body — 주문자

- 카드 컨테이너: borderRadius=16px, fills=surface
- `Title + Arr`: 텍스트 `"주문자"` (body-lg/system-700) + 접기 아이콘 (`ic_arrow_down_fold_xsmall`)
- 정보 표시:
  - 이름: `body-m/system-700`
  - 이메일, 전화번호: `body-m/system-400`, color=text-secondary
- `Button` (변경):
  - Mode=Default, Type=Outlined_gray, Size=XSmall(32), Radius=off
  - Button Text: `"변경"`, Trailing-Icon: true

### 3.3 Body — 배송 주소

- 카드 컨테이너: borderRadius=16px
- `Title + Arr`: 텍스트 `"배송 주소"` + 접기 아이콘
- 정보 표시:
  - 수령인명: `body-m/system-700`
  - 주소, 국가, 전화번호: `body-s/system-400`, color=text-secondary
- `Button` (변경): Type=Outlined_gray, Size=XSmall(32)
- `Dropdown_Box` (배송 메모 입력): Text Input 포함

### 3.4 Body — 주문 상품 및 배송 수단

- `Title`: 텍스트 `"주문 상품"` + 개수 Badge (예: `"4개"`)
- `Product` × N개 (반복):
  - Product Info: 이미지 + 상품명 + 수량/가격
  - Shipping Info: 배송 방법 텍스트
  - 하단 `Divider`로 구분
- `Message Box`: 안내 메시지 (에셋 컴포넌트)

### 3.5 Body — 캐시

- `Title + Arr`: 텍스트 `"캐시"` + 접기 아이콘
- `Text Input`: 캐시 금액 직접 입력
- 보유 캐시 잔액 텍스트 (body-s/system-400)
- `Checkbox`: 전액 사용 옵션

### 3.6 Body — 결제 금액

- `Title + Arr`: 텍스트 `"결제 금액"` + 접기 아이콘
- 가격 항목 리스트 (key-value 형태):
  - 각 항목: label (body-m/system-400) + 금액 (body-m/system-700)
- `Line` (Divider)
- `최종 결제금액` (body-lg/system-700 + 강조색)
- `적립 예정 캐쉬` 텍스트 (body-s/system-400)

### 3.7 Body — 결제 수단

- `Title + Arr`: 텍스트 `"결제 수단"` + 접기 아이콘
- 결제수단 선택 영역:
  - 위버스카드 / 일반결제 탭 또는 선택 컴포넌트
- `Message Box`: `"해당 상품은 소득 공제 상품입니다."` 안내

### 3.8 Body — 유의사항 및 이용약관

- `Title + Arr`: 텍스트 `"유의사항"` + 접기 아이콘
- 약관 내용 텍스트 (body-s/system-400, color=text-secondary):
  - Toss 결제 시 문화비소득공제 안내
  - VISA/Master/JCB 청구 표시 안내
  - 미성년자 구매 취소 안내

### 3.9 Bottom CTA

- `Text Button` (약관 동의 링크)
- 약관 동의 텍스트 + 체크 영역
- `Tab Bar` (iOS only): Theme=Default, OS=iOS, focus=Shop

---

## 4. Screen States

| State | 트리거 | 렌더링 변화 |
| --- | --- | --- |
| Loading | 화면 진입 직후 | 각 섹션 카드에 Skeleton |
| Default | 데이터 로드 완료 | 전체 섹션 노출 |
| Accordion Collapsed | 섹션 헤더 탭 | 해당 섹션 Info 영역 숨김, 아이콘 회전 |
| Accordion Expanded | 섹션 헤더 탭 | 해당 섹션 Info 영역 노출 |
| CTA Disabled | 약관 미동의 | 결제 버튼 Status=Disabled |
| CTA Enabled | 약관 동의 완료 | 결제 버튼 Status=Default |

---

## 5. Navigation & Flow

- **진입점**: 장바구니 "구매하기" 버튼 → Push(→) 전환
- **이탈점**:
  - 뒤로가기(Leading) → Pop(←)
  - "변경" 버튼 → 주문자/배송지 수정 화면
  - "결제하기" → 결제 처리 → 주문 완료 화면
- **딥링크**: 미지원 (세션 기반)

---

## 6. Data Contract

| 데이터 | 타입 | 조건부 렌더링 |
| --- | --- | --- |
| orderer.name / email / phone | string | 항상 노출 |
| shippingAddress | object | 항상 노출 |
| products[] | array | 개수에 따라 Product 반복 |
| cashBalance | number | 0이면 캐시 섹션 입력 비활성 |
| paymentMethods[] | array | 결제수단 탭 목록 |
| isIncomeDeductible | boolean | true이면 소득공제 Message Box 노출 |
| termsAgreed | boolean | false이면 CTA Disabled |

---

## 7. Agent Prompt Guide

```
Use when: 결제하기 화면을 피그마에서 구현하거나 코드로 변환할 때
Always: GNB와 Bottom을 Fixed로 처리하고, Body만 스크롤 가능하게 구성
Always: 각 섹션을 borderRadius=16px 카드로 래핑
Always: accordion 섹션은 접힘/펼침 상태 모두 구현
Never: 섹션 순서를 임의로 변경하지 않음 (주문자 → 배송주소 → 상품 → 캐시 → 결제금액 → 결제수단 → 약관)
Check: CTA 버튼 disabled/enabled 상태가 약관 동의와 연동되어 있는지 확인
Check: iOS에서 하단 Safe Area 처리 확인
```

---

## 8. Implementation Contract

### 8.1 Scroll Behavior

| 영역 | 동작 | 고정 여부 |
| --- | --- | --- |
| GNB (Status Bar + AppBar) | 스크롤 시 고정 | Fixed |
| Body | 수직 스크롤 | Scrollable |
| Bottom CTA | 스크롤 시 고정 | Fixed |

### 8.2 Accordion

- 기본 상태: 모든 섹션 Expanded
- 접기 아이콘: `ic_arrow_down_fold_xsmall` (접힘 시 180도 회전)
- 애니메이션: height collapse (duration 미정)

### 8.3 Platform Differences

| 항목 | iOS | AOS | Web |
| --- | --- | --- | --- |
| Status Bar | Notch=True | 별도 처리 | 없음 |
| Tab Bar | 하단 고정 노출 | 없음 | 없음 |
| Safe Area | 필요 | 불필요 | 불필요 |

### 8.4 Accessibility

- 각 섹션 카드: `accessibilityRole=region`, label=섹션 제목
- accordion 버튼: `accessibilityState={expanded: true/false}`
- CTA 버튼: disabled 상태 시 `accessibilityState={disabled: true}`

### 8.5 Figma Source Notes

- file key: `hSZA1GLBpbgIyDFOnibf99`
- node ID: `298:87781`
- Navigation 컴포넌트: `298:79107` (Mode=Default, Text Type=Center, Scroll Bg=On)
- Button (변경): `298:83470` (Outlined_gray, XSmall)
