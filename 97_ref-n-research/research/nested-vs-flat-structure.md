# 중첩(nested) 구조 vs 평면(flat) 구조 — AI는 어느 쪽을 선호하는가

디자인 토큰을 정리하는 두 가지 방식의 차이, 그리고 AI 코딩 도구가 더 잘 다루는 구조에 대한 정리.

---

## 1. 평면(flat) 구조

모든 토큰이 같은 층위에 한 줄로 나열되는 방식. 깊이 없음.

```yaml
color-primary: "#B8422E"
color-primary-hover: "#A03821"
color-surface: "#FFFFFF"
color-surface-dim: "#F5F5F5"
button-bg: "#B8422E"
button-text: "#FFFFFF"
button-radius: 8px
input-bg: "#FFFFFF"
input-border: "#CCCCCC"
spacing-sm: 8px
spacing-md: 16px
```

**특징**: 이름 자체가 모든 의미를 담음 (`button-bg`, `color-primary-hover`).

---

## 2. 중첩(nested) 구조

의미 단위로 묶여 트리처럼 깊이가 있는 방식.

```yaml
colors:
  primary:
    default: "#B8422E"
    hover: "#A03821"
  surface:
    default: "#FFFFFF"
    dim: "#F5F5F5"

components:
  button:
    backgroundColor: "{colors.primary.default}"
    textColor: "#FFFFFF"
    rounded: "{rounded.md}"
  input:
    backgroundColor: "{colors.surface.default}"
    border: "{colors.outline}"

spacing:
  sm: 8px
  md: 16px
```

**특징**: *위치*가 의미를 담음. `colors.primary.hover`라는 *경로*로 토큰을 가리킴.

---

## 3. 핵심 차이점 비교

| 항목 | 평면 구조 | 중첩 구조 |
|------|-----------|-----------|
| **의미 표현** | 이름에 다 담김 (`button-bg-hover`) | 위치(경로)에 담김 (`button.bg.hover`) |
| **참조 방식** | 직접 이름 호출 | `{path.to.token}` 경로 참조 |
| **가독성** | 짧을 땐 직관적 | 깊을수록 구조 파악 쉬움 |
| **확장성** | 수가 늘면 이름이 길어짐 (`btn-primary-hover-disabled`) | 새 가지만 추가하면 됨 |
| **중복 제거** | 같은 값을 여러 이름이 가짐 | 한 곳에 정의·여러 곳에서 참조 |
| **수정 영향** | 이름 하나 바꾸면 전 프로젝트 grep | 경로의 한 노드만 수정 |
| **타입 추론** | 이름 prefix로만 가능 | 그룹 위치로 자동 추론 |
| **편집 도구** | grep·find&replace | 트리 뷰·스키마 검증 |

---

## 4. AI가 선호하는 방식

**결론: AI는 중첩 구조를 더 잘 다룬다. 단, 너무 깊으면 평면이 낫다.**

### 4-1. 왜 중첩을 선호하는가

1. **의미 추론이 쉬움** — `colors.button.hover`를 보면 *컬러 그룹의 버튼 hover 상태*라는 게 경로만 봐도 뚜렷함. 평면의 `btn-c-h` 같은 축약은 hallucination 유발.

2. **타입 안정성** — Stitch 스펙처럼 "그룹 위치로 타입을 추론"하는 방식은 AI가 *값 형식*을 자신 있게 결정하게 해줌. `typography.heading.fontSize`가 dimension이라는 걸 경로만 보고 알 수 있음.

3. **참조 무결성** — `{colors.primary}` 같은 명시적 경로는 AI가 *진짜 존재하는 토큰만* 사용하게 강제함. 평면 구조에선 `color-primary` 같은 *그럴듯한 이름*을 지어내기 쉬움.

4. **컨텍스트 한계 친화적** — AI는 *섹션 단위*로 읽기 쉬움. `colors:` 블록만 들여다보면 컬러 시스템 전체가 한눈에 들어옴. 평면 구조는 전체를 다 훑어야 함.

5. **부분 수정에 강함** — "primary 컬러만 바꿔줘"라고 시키면 중첩에선 한 노드만 수정. 평면은 `color-primary`, `color-primary-hover`, `color-primary-bg`, `color-primary-text` ... 모두 찾아 고쳐야 함.

### 4-2. 단, 너무 깊으면 안 된다

```yaml
colors:
  brand:
    primary:
      light:
        default:
          value: "#B8422E"   # ← 5단계 중첩, AI도 헷갈림
```

3~4단계를 넘어가면 AI도 경로 추적에 실패하기 시작한다. 깊이가 늘어날 가치가 있을 때만 깊게 쓰는 게 좋다.

---

## 5. 실전 권장 — 하이브리드

대부분의 디자인 시스템은 **평면 + 중첩 혼합**이 정답.

```yaml
# 1단계: 원시 토큰은 평면
colors:
  brand-orange-500: "#B8422E"
  brand-orange-600: "#A03821"
  neutral-0: "#FFFFFF"
  neutral-100: "#F5F5F5"

# 2단계: 시맨틱 토큰은 얕은 중첩 (역할 → 상태)
semantic:
  primary:
    default: "{colors.brand-orange-500}"
    hover:   "{colors.brand-orange-600}"
  surface:
    default: "{colors.neutral-0}"
    dim:     "{colors.neutral-100}"

# 3단계: 컴포넌트는 중첩 (컴포넌트 → 속성)
components:
  button:
    backgroundColor: "{semantic.primary.default}"
    textColor: "{colors.neutral-0}"
```

이 패턴이 Stitch DESIGN.md, Material Design 3, Tailwind config 모두 공통으로 쓰는 구조다. AI가 가장 잘 다루는 형태이기도 하다.

---

## 6. 상황별 가이드

| 상황 | 추천 |
|------|------|
| 토큰 수 < 30개 | 평면도 OK |
| 토큰 수 30~200개 | 얕은 중첩 (2~3단계) |
| 토큰 수 200개 이상 | 다층 중첩 + 시맨틱 레이어 분리 |
| AI가 읽고 쓸 파일 | **얕은 중첩 + 명시적 참조** (`{path.to.token}`) |
| 깊이 > 4단계 | 다시 쪼개거나 시맨틱 별칭으로 평탄화 |

---

## 7. 핵심 인사이트

핵심은 **"AI가 경로 한 줄로 의도를 추론할 수 있는 깊이"** 를 유지하는 것이다.

- 너무 평면 → 이름이 길어지고 중복이 생김, AI가 그럴듯한 이름을 지어냄
- 너무 깊은 중첩 → 경로 추적 실패, 사람도 AI도 길을 잃음
- **2~3단계 중첩 + 명시적 토큰 참조**가 sweet spot

DESIGN.md가 `{colors.primary.default}` 같은 참조 문법을 1급으로 채택한 이유도 여기에 있다. *위치를 의미로 쓰면서, 그 위치를 언어처럼 가리킬 수 있게* 한 것.

## 참고

- 같은 폴더의 `design-md-as-ai-output.md` — DESIGN.md를 AI 정규화 출력물로 두는 방법
- 같은 폴더의 `spec.md` — DESIGN.md alpha 정식 스펙 원본
- [DTCG (Design Tokens Community Group)](https://www.designtokens.org/) — `{path.to.token}` 참조 문법의 원조
