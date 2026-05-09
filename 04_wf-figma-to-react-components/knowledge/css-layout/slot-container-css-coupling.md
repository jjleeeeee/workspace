# Slot-Container CSS Coupling

## Trigger

slot prop(ReactNode)과 type/variant prop이 함께 있는 컴포넌트의 스토리나 사용 예시를 작성할 때.

## Lesson

slot prop이 컨텐츠를 교체해도 **컨테이너 CSS는 type/variant prop에 따라 그대로 적용된다.**

TopNavigation 사례:
- `leadingType="icon-avatar"` CSS 오버라이드: `padding: 0; width: auto`
- `leadingSlot={<ChordIcon size={24} />}` 단일 아이콘 주입
- 결과: 컨테이너가 `width: auto`로 아이콘 크기(24px)로 찌그러짐

Playground는 `leadingSlot`을 넘기지 않아 내부에서 icon(40px)+avatar(38px)
복합 렌더를 해서 정상으로 보였지만, 단일 슬롯을 넘기는 스토리에서만 깨졌다.
이 때문에 `npm test` 443/443 통과 상태에서도 화면이 틀릴 수 있었다.

## Apply

- 스토리에서 단일 slot(예: `leadingSlot`)을 넘길 때는 반드시 대응하는 type prop도 명시:
  - 단일 아이콘 → `leadingType="icon"`
  - 단일 아바타 → `leadingType="avatar"`
  - 아이콘+아바타 복합 → `leadingType="icon-avatar"` + `leadingSlot` 미주입(내부 렌더 사용)
- 고정 렌더 스토리(`controls: { disable: true }`)는 각 prop 조합의 유효성을
  컴포넌트 로직과 별개로 눈으로 추적한다.
- slot을 받는 컴포넌트 설계 시, slot 주입 여부와 type CSS 오버라이드가 충돌하지
  않는지 조합 매트릭스로 확인한다.

## Source Cases

- `retrospectives/retrospective_top-navigation-layout-fix_2026-05-09.md`
