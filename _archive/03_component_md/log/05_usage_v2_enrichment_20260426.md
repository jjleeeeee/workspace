# Usage Figma 기반 컴포넌트 MD 보강 실행 로그

**날짜:** 2026-04-26  
**대상:** Avatar, Button, Badge canonical 문서와 하네스 검증  
**목적:** 컴포넌트 정의 Figma만으로 만든 문서에 Usage Figma의 사용 원칙을 추가하고, 검증 루프가 유지되는지 확인한다.

---

## 입력 소스

| 컴포넌트 | Usage Figma URL | Node |
|---|---|---|
| Avatar | `Chord_Usage` / `6pHGdaJh3L8Z1Ew8AxIV85` | `277:34924` |
| Button | `Chord_Usage` / `6pHGdaJh3L8Z1Ew8AxIV85` | `428:4854` |

Badge는 별도 Usage URL이 없었고, 기존 component source 기반 문서와 하네스 검증만 함께 확인했다.

---

## 실행 방식

1. Usage Figma 프레임에서 About, Principle, Components, Variation, Example 텍스트를 확인했다.
2. 구현 계약을 흐리지 않도록 설명 섹션과 Figma Source Notes에 사용 규칙을 추가했다.
3. `Implementation Contract`의 variant/token/size 계약은 기존 Figma component source 기준을 유지했다.
4. 세 canonical 문서를 하네스로 검증했다.

---

## Avatar 반영 내용

Usage에서 확인한 핵심:

- Avatar는 사람과 서비스를 대표하는 이미지형 컴포넌트다.
- 콘텐츠 성격과 정체성 표현 목적에 따라 `Circle`/`Squircle` 타입을 구분한다.
- 레이아웃을 해치지 않도록 상황에 맞는 크기를 적용한다.
- 같은 맥락에서 타입과 사이즈를 혼용하지 않는다.

반영 위치:

- `components/avatar.md`의 `Role & Usage`
- `Layout & Responsive Rules`
- `Do's and Don'ts`
- `Figma Source Notes`

---

## Button 반영 내용

Usage에서 확인한 핵심:

- Button은 사용자가 선택이나 행동을 할 수 있게 하는 컴포넌트다.
- 화면 하단이나 콘텐츠 위에 노출되며 사용자의 작업을 수행한다.
- 찾기 쉽고 누르기 쉬워야 하며, 중요도에 맞는 크기를 써야 한다.
- 단일 하단 CTA는 usage 예시에서 16px horizontal margin과 `XLarge(52)` 높이를 사용한다.
- 두 버튼 그룹은 primary action을 오른쪽에 둔다.
- 세 개 이상의 action이나 긴/다국어 label은 vertical layout을 우선한다.
- 필수 정보가 입력되기 전에는 버튼을 비활성 상태로 두고 반응하지 않게 한다.

반영 위치:

- `components/button.md`의 `Role & Usage`
- `Layout & Responsive Rules`
- `Do's and Don'ts`
- `Layout Contract`
- `Figma Source Notes`

---

## 하네스 수정

Button 검증 중 `SIZES`가 실패했다.

원인:

```python
pattern = rf'...{size}...'
```

`size` 값이 `XLarge(52)`처럼 괄호를 포함하면 정규식에서 괄호가 literal이 아니라 group으로 해석됐다.

수정:

```python
pattern = rf'...{re.escape(size)}...'
```

결과적으로 `XLarge(52)`, `Large(44)`, `Medium(40)`, `Small(36)`, `XSmall(32)`, `XXSmall(24)`를 문서 표에서 정확히 찾는다.

---

## 최종 검증 명령

```bash
bash harness/eval.sh components/avatar.md
bash harness/eval.sh components/badge.md
bash harness/eval.sh components/button.md
```

---

## 최종 결과

| 문서 | 결과 |
|---|---|
| `components/avatar.md` | 100/100 PASS |
| `components/badge.md` | 100/100 PASS |
| `components/button.md` | 100/100 PASS |

---

## 판단

추천안은 Usage 내용을 canonical 컴포넌트 MD 안에 직접 넣는 방식이다. 구현 에이전트가 하나의 문서만 읽어도 “무엇을 만들지”와 “어떻게 써야 하는지”를 함께 알 수 있다. 트레이드오프는 문서가 길어지는 점이다.

대안은 Usage 문서를 별도 파일로 두고 링크만 거는 방식이다. 문서는 짧아지지만 컴포넌트 구현 에이전트가 사용 규칙을 놓칠 가능성이 커진다.
