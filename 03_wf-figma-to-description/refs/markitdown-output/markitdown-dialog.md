# CDS / Components / Dialog

# [Usage] Dialog

Dialog는 사용자의 흐름을 잠시 멈추고 중요한 메시지, 경고, 확인 액션에 집중시키기 위해 사용하는 오버레이 컴포넌트입니다.

## Context

Dialog는 사용자가 결정을 내려야 다음 단계로 진행할 수 있는 상황에 사용해야 합니다. 단순 정보 안내는 Toast나 Snackbar를 사용하고, 추가 작업이나 긴 콘텐츠 탐색이 필요하면 Bottom Popup 또는 Bottom Sheet를 사용해야 합니다.

## Principle

- 사용자의 주의를 집중시키기 위해 화면 중앙에 노출해야 합니다.
- 중요한 메시지와 명확한 액션을 함께 제공해야 합니다.
- 배경 콘텐츠와의 위계를 만들기 위해 Scrim Overlay를 사용해야 합니다.

## Usage Do / Don't

### 용도

Do

- 경고, 확인, 중대한 선택처럼 사용자의 결정을 기다려야 할 때 사용해야 합니다.

Don't

- 단순 성공 안내나 짧은 피드백에 Dialog를 사용하지 않아야 합니다. (사용 흐름 차단)

### Title & Description

Do

- Title은 최대 3줄, Description은 최대 5줄까지 노출해야 합니다.

Don't

- 정해진 줄 수를 넘어가는 긴 제목이나 설명을 Dialog에 넣지 않아야 합니다. (가독성 저하)

### Checkbox Text

Do

- 사용자 동의가 필요한 경우 체크 박스와 함께 노출되는 Text는 최대 2줄까지 노출해야 합니다.

Don't

- 체크 박스 옆 동의 Text를 2줄 넘게 노출하지 않아야 합니다. (동의 문구 가독성 저하)

### Scrim Overlay

Do

- Scrim Overlay의 opacity 값은 50%로 사용해야 합니다.

Don't

- Scrim Overlay의 opacity 값을 임의로 변경하지 않아야 합니다. (위계 불안정)

### Position

Do

- Dialog는 화면 정중앙에 위치해야 합니다.

Don't

- Dialog를 화면 가장자리나 임의 위치로 옮기지 않아야 합니다. (집중도 저하)

### Action

Do

- 사용자가 다음 행동을 결정할 수 있도록 명확한 액션을 제공해야 합니다.

Don't

- 닫기만 가능한 메시지를 Dialog로 제공하지 않아야 합니다. (컴포넌트 과사용)
