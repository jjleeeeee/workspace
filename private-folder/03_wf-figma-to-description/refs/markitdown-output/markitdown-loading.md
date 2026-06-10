# CDS / Components / Loading

# [Usage] Loading

Loading은 화면 전환, Pull To Refresh, 사용자 Action 후 처리 중 상태를 알려주기 위해 사용하는 피드백 컴포넌트입니다. 로딩이 노출되는 범위와 순간에 따라 System Loading, Dot Loading, Circular Loading을 구분해 사용해야 합니다.

## Context

Loading은 시스템이 사용자의 요청을 처리 중이며 기다려야 한다는 사실을 알려야 할 때 사용해야 합니다. 화면을 아래로 당겨 새로고침하거나 로드하는 찰나의 순간에는 System Loading을 사용해야 하고, 화면 전체가 이동하는 상황에서는 Medium Dot Loading을 사용해야 합니다. 컴포넌트 내부에 로딩이 필요한 경우에는 Small 20x20 Icon Dot Loading을 우선 사용해야 하며, Dot Loading을 사용할 수 없는 컴포넌트 내부 상황에서만 Circular Loading을 사용해야 합니다. 오류나 완료 메시지는 Loading이 아니라 Toast 또는 Snackbar로 알려야 합니다.

## Principle

- 로딩 타입은 노출 범위와 지속 시간에 따라 구분해야 합니다.
- 화면 전체 이동에는 Dot Loading을, Pull To Refresh나 찰나의 로드에는 System Loading을 사용해야 합니다.
- 컴포넌트 내부에서는 Small Dot Loading을 우선 사용하고, Dot Loading을 사용할 수 없을 때만 Circular Loading을 사용해야 합니다.
- 모든 로딩은 Lottie Animation을 사용해야 하며, Json 파일은 테마를 구분하지 않고 사용해야 합니다.

## Usage Do / Don't

### System Loading

Do

- 화면을 아래로 당겨서 새로고침 하거나 로드하는 찰나의 순간에는 System Loading을 사용해야 합니다.

Don't

- System Loading이 필요한 순간에 다른 타입의 Loading을 사용하지 않아야 합니다. (상황 의미 불일치)

### Dot Loading - 화면 전체 이동

Do

- 화면 전체가 이동하는 상황에서 로딩이 필요한 경우 Medium 사이즈의 Dot Loading을 사용해야 합니다.

Don't

- 화면 전체 이동 상황에 System Loading이나 Circular Loading을 사용하지 않아야 합니다. (로딩 범위 혼동)

### Dot Loading - 컴포넌트 내부

Do

- 컴포넌트 내부에 로딩이 필요한 경우 Small 사이즈의 20x20 Icon Dot Loading을 사용해야 합니다.

Don't

- 컴포넌트 내부 로딩에 Medium Dot Loading을 사용하지 않아야 합니다. (컴포넌트 밀도 불균형)

### Circular Loading

Do

- Dot Loading을 사용할 수 없는 경우 Circular Loading을 사용해야 하며, 컴포넌트 내부에서만 사용해야 합니다.

Don't

- Dot Loading을 사용할 수 있는 상황이나 화면 전체 이동 상황에 Circular Loading을 사용하지 않아야 합니다. (로딩 타입 오용)

### Color

Do

- Dot Loading 컬러는 용도에 맞게 Primary 또는 White를 사용해야 합니다.

Don't

- 로딩 컬러를 커뮤니티 색상으로 변경하지 않아야 합니다. (상태 의미 혼동)
