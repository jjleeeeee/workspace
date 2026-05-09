# 토큰 참조 — {colors.primary}

값을 복사하지 않고 "가리키기"로 연결해요

hex 값을 여러 군데 복붙해서 써 본 적 있으세요? primary 색을 바꾸고 싶은데 컴포넌트 12곳에 박혀 있어서 전부 찾아 고쳐야 하는 그 상황. DESIGN.md는 값을 복사하는 대신 "저기 있는 그 값을 쓰겠다"고 가리키는 문법을 제공해요.

> **L52** Token References: A token reference must be wrapped in curly braces, and contain an object path to another value in the YAML tree. For most token groups, the reference must point to a primitive value (e.g., `colors.primary-60`), not a group (e.g., `colors`). Within the components section, references to composite values (e.g., `{typography.label-md}`) are permitted.

**한국어:** 토큰 참조는 중괄호 `{ }`로 감싸고, 안에는 다른 토큰까지 가는 길을 점으로 이어 적어요(예: `{colors.primary}`).

대부분의 토큰 묶음에서는 단일 값만 가리킬 수 있어요. "묶음 전체"(`{colors}` 같은 거)는 안 돼요. 단, `components` 안에서만은 타이포 객체처럼 여러 속성이 묶인 값을 통째로 가리킬 수 있어요(예: `{typography.label-md}`).

## 쓰는 법

중괄호 안에 점으로 경로. 전체를 따옴표로 감싸 문자열로 둬요.

- ✅ `"{colors.primary}"` — 색 토큰 가리키기
- ✅ `"{rounded.md}"` — radius 스케일 가리키기
- ✅ `"{spacing.gutter}"` — 간격 토큰
- ✅ `"{typography.body-md}"` — (컴포넌트 안에서만) 타이포 객체 통째로
- ❌ `"{colors}"` — 묶음 자체를 가리키는 건 대부분의 영역에서 안 됨

## 두 영역이 서로 다른 규칙을 따르는 이유

**일반 토큰 묶음(바깥)**  
단일 값만 참조 가능. 예: `colors.on-primary: "{colors.primary}"` (색 → 색). 합성할 일 없음.

**components(안쪽)**  
객체 전체도 참조 가능. 예: `typography: "{typography.label-md}"` — 폰트·크기·굵기를 통째로 끌어와요.

왜 다른가? 컴포넌트는 "여러 토큰을 묶어 하나의 스타일 프리셋을 만드는 자리"거든요. "이 버튼 텍스트는 label-md 스타일을 통째로 쓴다"라고 말할 수 있어야 의미가 생겨요. 반대로 토큰 묶음끼리는 합칠 일이 없어요 — `colors.primary`가 타이포 전체를 가리키는 건 말이 안 되잖아요.

## 실제로 어떻게 생겼을까

**primary 색 하나로 버튼 전체 연동**

```yaml
colors:
  primary: "#855300"
  on-primary: "#ffffff"
  primary-container: "#f59e0b"

components:
  button-primary:
    backgroundColor: "{colors.primary}"            # 색 가리키기
    textColor: "{colors.on-primary}"
  button-primary-hover:
    backgroundColor: "{colors.primary-container}"  # 호버는 다른 색 가리키기
```

나중에 브랜드 컬러를 `#855300` → `#9c3625`로 바꾸면 버튼이 자동으로 따라와요. 12곳을 찾아 고칠 필요가 없어요. 이게 참조의 힘이에요.

## 만약 가리킨 곳이 없으면?

검사 도구(린터)가 `broken-ref` 규칙으로 에러를 내요. 예를 들어 `"{colors.primay}"`(오타)처럼 존재하지 않는 경로를 쓰면 바로 잡아내요. 이건 뒤의 M6 챕터에서 더 자세히 봐요.

## 순환 참조는 금지 (명시는 안 됐지만 상식적으로)

`a: "{b}"` / `b: "{a}"` 처럼 서로를 가리키면 해석기가 무한 루프에 빠져요. 스펙이 명시적으로 금지하진 않았지만 현실적으로 쓰면 안 되는 패턴이에요. 검사 도구가 향후 잡아낼 영역.

## 핵심 인사이트

토큰 참조의 가치는 두 가지예요. ① 같은 값을 반복해서 안 적어도 됨(복붙 제로). ② "이 버튼은 primary와 운명을 같이한다"는 관계를 구조로 표현. 단순히 값을 재사용하는 것보다 훨씬 큰 이야기예요 — 디자인 결정이 어떻게 연결돼 있는지가 파일에 남아요.

## 체크리스트

- 토큰 참조 문법(`{그룹.이름}`)을 예시로 쓸 수 있다
- 일반 토큰 묶음과 `components`의 참조 규칙 차이를 안다
- 왜 `components`에서만 객체 통째 참조가 허용되는지 설명할 수 있다
- 오타·없는 경로를 썼을 때 어떻게 감지되는지 안다
