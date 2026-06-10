# CDS / Components / Tooltip

# [Usage] Tooltip

Tooltip은 사용자가 확인해야 하는 내용이나 강조해야 하는 내용을 특정 객체와 연결해 표시하기 위해 사용하는 안내 컴포넌트입니다.

## Context

Tooltip은 Dialog 메시지보다 중요도가 낮고, 사용자가 특정 UI 요소의 의미나 강조 내용을 이해해야 할 때 사용해야 합니다. 독립적인 공지나 긴 안내에는 사용하지 않아야 하며, 항상 설명 대상이 되는 객체와 연결되어야 합니다. 목적에 따라 일정 시간 후 자동으로 닫히는 none button 타입 또는 닫기 버튼이 있는 Close button 타입을 선택해야 합니다.

## Principle

- Dialog보다 중요도가 낮은 메시지를 전달할 때 사용해야 합니다.
- Tooltip은 특정 객체와 시각적으로 연결되어야 합니다.
- 텍스트는 최대 8줄 안에서 간략하고 명확하게 작성해야 합니다.
- 일정 시간 후 자동으로 닫히거나 닫기 버튼으로 닫히도록 목적에 맞는 인터랙션을 설정해야 합니다.

## Usage Do / Don't

### Type & Dismissal

Do

- 목적에 따라 none button 또는 Close button 타입을 선택하고, 닫기 버튼은 우측 상단에 고정해야 합니다.

Don't

- 자동으로 닫혀야 하는 안내에 Close button 타입을 임의로 사용하지 않아야 합니다. (인터랙션 부담 증가)

### Text Lines

Do

- Single line은 1줄로, Multi lines는 최소 2줄 이상 최대 8줄 이하로 사용해야 합니다.

Don't

- 8줄을 넘는 문구를 Tooltip에 넣지 않아야 합니다. (가독성 저하)

### Max Width

Do

- Tooltip의 가로 최대 너비는 240으로 사용해야 합니다.

Don't

- Tooltip 너비를 임의로 늘려 화면을 가로지르게 만들지 않아야 합니다. (시선 흐름 방해)

### Caret Position

Do

- 객체가 안전 영역 중앙이나 하단에 있을 때 Caret Position Bottom을 사용하고, 말꼬리와 콘텐츠 간격은 6으로 유지해야 합니다.

Don't

- 객체가 상단에 있을 때 Caret Position Top을 사용하지 않아야 합니다. (화면 밖 잘림)

### Margin

Do

- 화면과 Tooltip 사이에는 필요한 마진을 확보해야 합니다.

Don't

- 화면 가장자리에 Tooltip을 붙여 배치하지 않아야 합니다. (가독성 저하)

### Scroll

Do

- 화면 스크롤 시 Tooltip은 최초에 뜬 위치에 고정된 채로 스크롤되어야 합니다.

Don't

- Tooltip이 헤더 위로 올라가게 하지 않아야 합니다. (레이어 위계 충돌)
