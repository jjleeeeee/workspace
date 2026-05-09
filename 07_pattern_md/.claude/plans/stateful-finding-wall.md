# 04_pattern_md: checkout.md → 폴더+섹션 파일 분리 리팩토링

## Context

아이데이션 세션을 통해 화면 단위 MD 구조를 합의함.
현재 `screens/checkout.md` (단일 파일)로 만들었으나, 실제 합의한 구조는 **폴더 + 섹션 파일 분리** 방식이었음.

이를 올바른 구조로 리팩토링한다.

- **목적**: AI 에이전트가 코드 구현 가능한 수준의 화면 spec MD
- **구조**: `screens/checkout/` 폴더 안에 섹션별 파일 분리
- **컴포넌트 관계**: 핵심 props 인라인 + 컴포넌트 MD 참조
- **공통 영역** (Top Navigation, Tab Bar): 컴포넌트 MD 참조로 처리

---

## 목표 폴더 구조

```
04_pattern_md/
├── screens/
│   ├── experiments/          # 기존 실험 파일 (유지)
│   └── checkout/             # 새로 생성
│       ├── index.md          # 화면 개요, layout, nav, data contract, platform, layout spec
│       ├── orderer.md        # 주문자
│       ├── shipping.md       # 배송 주소
│       ├── products.md       # 주문 상품 및 배송 수단
│       ├── cash.md           # 캐시
│       ├── amount.md         # 결제 금액
│       ├── payment.md        # 결제 수단
│       ├── terms.md          # 유의사항 및 이용약관
│       └── cta.md            # Bottom CTA
└── log/
```

## 작업 내용

1. `screens/checkout/` 폴더 생성
2. 기존 `screens/checkout.md` 내용을 섹션별로 분리해서 각 파일에 저장
3. `index.md`에는 전체 섹션 목록 + 공통 정보 (layout, nav, data contract, platform, layout spec)
4. 각 섹션 파일에는 해당 섹션의 컴포넌트 구성 + 인라인 스펙
5. 기존 `screens/checkout.md` 삭제

## 파일별 담당 내용

| 파일 | 내용 |
| --- | --- |
| `index.md` | 화면 개요, Layout 다이어그램, Screen States, Navigation, Data Contract, Platform Differences, Layout Spec |
| `orderer.md` | 주문자 섹션 컴포넌트 + 스펙 |
| `shipping.md` | 배송주소 섹션 컴포넌트 + 스펙 |
| `products.md` | 주문상품 섹션 컴포넌트 + 스펙 |
| `cash.md` | 캐시 섹션 컴포넌트 + 스펙 |
| `amount.md` | 결제금액 섹션 컴포넌트 + 스펙 |
| `payment.md` | 결제수단 섹션 컴포넌트 + 스펙 |
| `terms.md` | 유의사항·약관 섹션 컴포넌트 + 스펙 |
| `cta.md` | Bottom CTA 섹션 컴포넌트 + 스펙 |

## 섹션 파일 포맷

각 섹션 파일은 동일한 구조로:

```markdown
# [섹션명]
> 한 줄 설명

## 구성
(텍스트 스타일, 표시 내용)

## 컴포넌트
- `ComponentName` `key=value, ...` → [component.md](../../../99_archive/03_component_md/components/component.md)
```

---

## 화면 MD 섹션 구조

컴포넌트 MD의 **Stitch 영역(1-8) + Contract 영역(9)** 구조를 화면 레벨로 재해석한다.

### 상단 헤더
```markdown
# [ScreenName] Screen
> 한 줄 설명 (한글, 사용자 목표 중심)
```

---

### 섹션 1. Screen Purpose [Required]
- 이 화면이 충족하는 **사용자 목표**
- **진입 맥락**: 어떤 상황에서 이 화면이 노출되는가
- **성공 정의**: 사용자가 무엇을 완료해야 이 화면의 역할이 끝나는가

---

### 섹션 2. Layout Structure [Required]
- 화면의 **영역 분할** (Header / Body / Footer / Overlay 등)
- **스크롤 동작**: 고정 영역 vs 스크롤 영역 명시
- **반응형 규칙**: 플랫폼(Web/iOS/AOS)별 레이아웃 차이

---

### 섹션 3. Component Composition [Required]
화면 내 각 영역별 컴포넌트를 **인라인으로 명시** (컴포넌트 MD 참조 없이 자급자족).

```markdown
### 3.1 Header
- `AppBar`: mode=Fixed, title="홈", showBackButton=false, trailingIcons=[Search, Notification]

### 3.2 Content Filter
- `Chips`: mode=Default, size=Small, type=Outlined, multiSelect=true
  - 항목: ["전체", "아티스트", "게시물", "미디어"]
  - 기본 선택: "전체"

### 3.3 Feed List
- `ContentCard`: 반복 렌더링, type=Standard
  - 이미지 비율: 16:9
  - 최대 표시 라인: title 2줄, description 3줄
```

명시 항목:
- 컴포넌트명 + 핵심 props (variant 축 기준)
- 반복 렌더링 여부 및 제약
- 화면 특화 커스텀 (디폴트와 다른 부분)

---

### 섹션 4. Screen States [Required]
| State | 트리거 | 렌더링 |
| --- | --- | --- |
| Loading | 데이터 fetch 중 | 영역별 Skeleton 배치 |
| Empty | 데이터 없음 | EmptyState 컴포넌트 + CTA |
| Error | fetch 실패 | ErrorState + 재시도 버튼 |
| Success | 데이터 있음 | 기본 화면 |

각 상태에서 **어떤 컴포넌트가 어떻게 변경**되는지 명시.

---

### 섹션 5. Navigation & Flow [Required]
- **진입점**: 어디서 이 화면으로 오는가 (탭 바, 딥링크, 푸시 알림 등)
- **이탈점**: 이 화면에서 어디로 이동하는가 (탭, 카드 탭 등)
- **전환 애니메이션**: 기본 / 특이 케이스

---

### 섹션 6. Data Contract [Required]
- 화면 렌더링에 필요한 **데이터 목록**
- **조건부 렌더링 규칙**: 데이터 존재 여부/값에 따라 달라지는 UI
- 예: `hasNewNotification=true` → Notification 아이콘에 Badge_Dot 표시

---

### 섹션 7. Agent Prompt Guide [Required]
컴포넌트 MD의 섹션 8과 동일 목적. AI가 이 화면을 구현/검토할 때의 지침.

```
Use when: 이 화면을 피그마에서 구현하거나 코드로 변환할 때
Always: Component Composition의 props를 기준으로 컴포넌트 인스턴스를 생성
Never: 명시되지 않은 컴포넌트를 임의로 추가하지 않음
Check: Screen States의 모든 상태가 구현되었는지 확인
```

---

### 섹션 8. Implementation Contract [Required]
컴포넌트 MD 섹션 9에 해당하는 사실값 영역.

#### 8.1 Scroll Behavior
| 영역 | 동작 | 고정 여부 |
| --- | --- | --- |
| AppBar | Sticky (스크롤 내려도 고정) | Fixed |
| Filter Chips | 수평 스크롤 가능 | Sticky (AppBar 하단) |
| Feed | 수직 스크롤 | Scrollable |

#### 8.2 Animation & Transitions
- 화면 진입: 기본 Push (→)
- 카드 탭: 화면 전환 애니메이션 명시

#### 8.3 Platform Differences
| 항목 | Web | iOS | AOS |
| --- | --- | --- | --- |
| AppBar 높이 | 56px | 44px | 56px |
| 하단 Safe Area | 없음 | 필요 | 없음 |

#### 8.4 Accessibility
- 화면 레벨 `aria-label` / `accessibilityLabel`
- 포커스 순서
- 스크린 리더 발화 순서

#### 8.5 Figma Source Notes
- Figma file key, 화면 노드 ID
- 구현 주의사항 (컴포넌트 MD 9.7과 동일 패턴)

---

## 컴포넌트 MD와의 차이

| 항목 | 컴포넌트 MD | 화면 MD |
| --- | --- | --- |
| 단위 | 단일 UI 요소 | 전체 페이지 |
| Props 초점 | 컴포넌트 자체 API | 화면에서의 사용 구성 |
| 상태 | 컴포넌트 상태 (Hover, Disabled) | 화면 상태 (Loading, Empty, Error) |
| 네비게이션 | 없음 | 진입/이탈 흐름 명시 |
| 데이터 | 없음 | 필요 데이터 + 조건부 렌더링 |
| Contract | Props/Token/Layout | Scroll/Animation/Platform/A11y |

---

## 다음 단계

1. `TEMPLATE.md` 작성 (위 섹션 구조 기반)
2. 첫 번째 화면 MD 시범 작성 (예: Home Feed)
3. 아이데이션 내용 `log/01_구조_아이데이션_20260426.md`로 저장
