# CDS / Components / Snackbar

# [Usage] Snackbar

Snackbar는 작업 결과를 알려주면서 필요한 경우 선택적 후속 조치를 제공하기 위해 사용하는 피드백 컴포넌트입니다.

## Context

Snackbar는 Toast보다 사용자가 취할 수 있는 Action이 필요할 때 사용해야 합니다. 하지만 Dialog처럼 사용자의 흐름을 강제로 멈추지는 않아야 하며, 메시지와 액션은 간결해야 합니다.

## Principle

- 사용 흐름을 방해하지 않기 위해 간결한 문장으로 메시지를 전달해야 합니다.
- 후속 조치가 필요할 때만 Action을 제공해야 합니다.
- 홈 인디케이터, GNB, CTA 버튼 위의 y축 위치에 노출해야 합니다.

## Usage Do / Don't

### Message

Do

- 작업 결과를 짧고 명확한 텍스트로 전달해야 합니다.

Don't

- 여러 개의 정보를 긴 문장으로 넣지 않아야 합니다. (가독성 저하)

### Action

Do

- 선택적 후속 조치가 필요한 경우에만 Action 버튼을 제공해야 합니다.

Don't

- 필수 확인이나 중요한 결정을 Snackbar Action으로 처리하지 않아야 합니다. (중요도 약화)

### Text Length

Do

- Text는 최대 3줄까지 노출해야 합니다.

Don't

- 3줄을 넘는 안내 문구를 Snackbar에 넣지 않아야 합니다. (정보 과밀)

### 위치

Do

- Snackbar는 홈 인디케이터, GNB, CTA 버튼 위에 노출해야 합니다.

Don't

- Snackbar를 주요 CTA 위에 겹쳐 조작을 막지 않아야 합니다. (조작 방해)

### 역할

Do

- 사용자의 작업 흐름을 유지한 채 결과와 후속 조치를 제공해야 합니다.

Don't

- Snackbar를 주요 작업을 강제하는 팝업처럼 사용하지 않아야 합니다. (사용 흐름 차단)
