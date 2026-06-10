# Top Navigation Layout Fix Retrospective

Date: 2026-05-09

## Scope

- 대상: `TopNavigation` 컴포넌트 CSS/TSX 레이아웃 버그 수정
- 발생 시점: 초기 구현(2026-05-08) 이후 브라우저 검증 중 발견
- 수정 파일: `TopNavigation.css`, `TopNavigation.tsx`, `TopNavigation.stories.tsx`

## 수정된 버그 목록

| 버그 | 원인 | 수정 |
|---|---|---|
| trailing-item 24×24 → 40×40 | `box-sizing: border-box` 누락, `width: 24px` 오기입 | `box-sizing: border-box; width: 40px; height: 40px; padding: 8px` |
| leading 컨테이너 56×56 렌더 | 공유 룰에 `box-sizing: border-box` 누락 | 공유 룰에 추가 |
| leading-icon 56px 렌더 (icon-avatar) | `chord-top-navigation__leading-icon`에 `box-sizing: border-box` 누락 | 해당 클래스에 추가 |
| default/left 타입 gap 없음 | 루트에 gap 미지정 | `gap: 8px` 추가 |
| img 타입 leading nav 아이콘 노출 | `hasLeading = showLeading` 무조건 true | `hasLeading = showLeading && !isImg` |
| img 타입 이미지 크기 오류 | 기본값 Avatar XSmall(38×38) 사용 | img 타입에 `height: 44px; width: 180px` |
| TextTypes/Modes 스토리 leading 찌그러짐 | `leadingType="icon-avatar"` + 단일 `leadingSlot` 조합 → 컨테이너 `padding:0; width:auto` | 해당 스토리에 `leadingType="icon"` 명시 |

## 반복된 패턴 (핵심 교훈)

### 1. box-sizing 감사를 일괄로 하지 않음

`trailing-item` 수정 시 `box-sizing: border-box`를 추가했지만, 동일 패턴(`width + padding` 조합)인 `leading`, `leading-icon`을 같이 확인하지 않음. 사용자가 브라우저에서 발견 → 지적 → 수정 사이클이 **3회** 반복됨.

**규칙:** 한 요소에 `box-sizing` 추가할 때, 같은 파일의 모든 `width/height + padding` 조합을 grep으로 일괄 감사.

### 2. slot과 container CSS의 숨은 coupling

`leadingSlot`(ReactNode)이 주입되면 컨텐츠는 슬롯으로 교체되지만, 컨테이너 CSS는 `leadingType` prop에 따라 그대로 적용됨. `leadingType="icon-avatar"`의 오버라이드(`padding: 0; width: auto`)가 단일 아이콘 슬롯과 충돌해 컨테이너가 24px으로 찌그러짐.

**규칙:** slot prop을 넘길 때는 대응하는 type/variant prop도 일치시켜야 함. 스토리에서 `leadingSlot` 단일 아이콘을 넘기면 `leadingType="icon"` 명시 필수.

### 3. 컴포넌트 테스트 통과 ≠ 스토리 화면 정상

443/443 테스트 통과 상태에서도 스토리에서 잘못된 prop 조합으로 레이아웃이 깨질 수 있음. Playground/NestedTypes는 정상이고 TextTypes/Modes만 깨진 이유가 바로 이 조합 차이였음.

**규칙:** 고정 렌더 스토리(controls.disable)는 각 prop 조합의 유효성을 컴포넌트 로직과 별개로 추적해야 함.

## Lessons Promoted

- Knowledge: `knowledge/css-layout/box-sizing-audit-pattern.md` — 신규 생성
- Knowledge: `knowledge/css-layout/slot-container-css-coupling.md` — 신규 생성
- Promotion: `knowledge`
- Reason: 두 패턴 모두 다른 컴포넌트 구현 시 재발 가능성 높음. box-sizing은 모든 CSS 작성 시, slot-coupling은 slot 기반 컴포넌트 스토리 작성 시 적용 가능.
