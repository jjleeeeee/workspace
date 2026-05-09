# Components 섹션과 상태(variant)

원자 토큰들을 모아 버튼·카드 프리셋을 만들어요

> **L237** The components section defines a collection of design tokens used to ensure consistent styling of common components. It's a `map<string, map<string, string>>` that maps a component identifier to a group of sub token names and values.

**한국어:** `components` 섹션은 자주 쓰는 컴포넌트(버튼·카드·입력창 등)의 스타일을 일관되게 만들기 위한 토큰 묶음이에요. 컴포넌트 이름을 키로 하고, 그 안에 하위 속성(배경색·텍스트색·패딩 등)을 넣어요.

## 컴포넌트가 받을 수 있는 하위 속성 8종

- `backgroundColor` — 배경색
- `textColor` — 글자색
- `typography` — 타이포 전체(컴포넌트에서만 객체 통째 참조 허용)
- `rounded` — 모서리 둥글기
- `padding` — 안쪽 여백
- `size`·`height`·`width` — 크기

CSS 속성은 훨씬 많은데 여기선 뼈대 8개만 둬요. 보더·트랜지션·텍스트 그림자 같은 건 본문 설명에 적거나, 필요하면 커스텀 키를 붙여요(검사 도구는 accept with warning으로 받음).

## 권장 컴포넌트 유형

**Buttons**  
`primary`/`secondary`/`tertiary` + 상태(`hover`·`active`).

**Chips · Lists**  
선택칩·필터칩·액션칩, 리스트 아이템·구분선.

**Inputs · Tooltips**  
입력창·도움말 말풍선.

**도메인 확장**  
`weather-display-large`, `card-profile`처럼 프로젝트 특화 컴포넌트도 자유롭게 추가.

## 상태(variant) — 평면 키 이름으로 표현

> **L239** Variants. A component may have a variant for different UI states such as `active`, `hover`, `pressed`, etc. Those variant components may be defined under a different but related key, for example, `"button-primary"`, `"button-primary-hover"`, `"button-primary-active"`.

**한국어:** 컴포넌트는 상태별 변형(`hover`·`active`·`pressed`)을 가질 수 있어요. 변형은 원본 안에 중첩시키지 않고 `button-primary-hover`처럼 원본 이름에 접미어를 붙인 별개 키로 따로 정의해요.

## 실제로 어떻게 쓰는지

**버튼 primary + hover**

```yaml
components:
  button-primary:
    backgroundColor: "{colors.primary-60}"
    textColor: "{colors.primary-20}"
    rounded: "{rounded.md}"
    padding: 12px
  button-primary-hover:
    backgroundColor: "{colors.primary-70}"    # 이 값만 덮어쓰기
```

`hover` 항목엔 바뀌는 배경색 하나만 적어요. 나머지(텍스트색·모서리·패딩)는 원본에서 그대로 가져다 쓰는 게 관례예요. 단, 파일 파서가 자동으로 합쳐주지는 않아요. "`button-primary-hover`는 `button-primary`의 변형"이라는 걸 이름 규칙으로 AI·렌더러가 알아차려요.

## 왜 중첩 객체가 아니라 평면 키?

- YAML 트리가 얕아져서 AI가 파싱하기 안정적이에요.
- 참조 경로가 짧아요. `{components.button-primary-hover.backgroundColor}` 한 줄이면 끝.
- 버전 비교(`diff`) 시 "어떤 상태가 바뀌었나"가 키 이름 수준에서 보여요.

## 핵심 인사이트

변형 처리를 중첩 대신 평면 키 + 이름 규칙으로 푼 게 묘미예요. 파싱은 단순해지고, 상속 합성은 AI·구현체가 관습으로 이해해요. 스펙이 파싱을 복잡하게 만들지 않고, 대신 "관습을 아는 독자"를 전제해요.

## 체크리스트

- 컴포넌트의 하위 속성 8종을 떠올릴 수 있다
- 변형을 평면 키(`button-primary-hover`)로 표현하는 관습을 안다
- 변형에 바뀌는 속성만 적는 이유를 설명할 수 있다
- 평면 키 방식이 중첩 객체보다 나은 이유 두 가지를 말할 수 있다
