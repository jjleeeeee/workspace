# spec — 스펙 자체 출력

AI에게 "이 포맷은 이렇게 생겼다"를 바로 알려주는 명령

이건 CLI 명령 중에서도 좀 특이해요. DESIGN.md의 스펙 문서 자체를 출력해 주거든요. 왜 이런 게 필요할까? AI에게 "이 포맷은 이렇게 생겼으니 이대로 만들어"를 통째로 넘기기 위해서예요.

## 기본 사용법

```bash
# 스펙 본문 출력 (markdown)
npx @google/design.md spec

# 스펙 + 린트 규칙 표도 같이
npx @google/design.md spec --rules

# 린트 규칙 표만, JSON으로
npx @google/design.md spec --rules-only --format json
```

## 이 명령을 어디에 쓸까

**AI 시스템 프롬프트에 주입**  
AI에게 "DESIGN.md 만들어줘"를 시킬 때 `spec` 출력을 프롬프트에 붙여요. AI가 헛것을 만들어낼 가능성이 훅 줄어요.

**사내 문서 자동 동기화**  
Notion/Wiki에 스펙 섹션을 둘 때 `spec --format json`을 주기적으로 돌려 항상 최신 버전을 유지.

**버전 호환성 체크**  
"지금 내가 쓰는 스펙 버전이 alpha인지"를 JSON에서 뽑아 도구 호환성 검증.

**CI 설정 자동 생성**  
`--rules-only`로 린트 규칙 표만 뽑아 CI 워크플로우를 자동 생성.

## 세 가지 플래그

| 플래그 | 의미 |
|--------|------|
| `--rules` | 스펙 + 린트 규칙 표를 같이 붙여줘요. 기본은 꺼짐. |
| `--rules-only` | 스펙 본문 빼고 규칙 표만 출력. 기본은 꺼짐. |
| `--format` | `markdown`(기본) 또는 `json`. |

## 왜 markdown이 기본일까

AI에게 주입하기 가장 자연스러운 형식이 markdown이에요. Anthropic·OpenAI·Google 모두 시스템 프롬프트에 markdown을 넣기를 권장해요. JSON은 기계가 읽기 좋고, markdown은 AI가 이해하기 좋다는 쓰임새 분리예요.

## AI가 DESIGN.md를 만들게 시키려면

Cursor에게 "이 브랜드로 DESIGN.md 만들어줘"라고 했는데 AI가 엉뚱한 YAML을 뱉어요. 왜? AI가 이 포맷을 잘 몰라서요.

해결은 `npx @google/design.md spec`의 출력을 프롬프트에 먼저 붙이는 거예요.

```text
다음은 DESIGN.md 포맷 스펙이야:
<spec 출력 내용>

이 포맷으로, 내 브랜드(친근한 카페)용 DESIGN.md를 만들어줘.
```

AI가 이 스펙을 먼저 보고 나서 생성하기 때문에 환각(잘못된 값 만들어내기)이 훨씬 줄어요.

## 스펙 자체가 AI용으로 쓰기 좋게 설계됐어요

`docs/spec.md`를 열어 보면 각 섹션이 개념 설명 → 예시 → YAML 스키마의 3단 구조로 일관돼 있어요. 한 섹션에 한 개념만 담은 것도 AI가 읽기 좋게 설계된 결과예요. 이 문서를 통째로 AI에 붙이면 바로 "DESIGN.md 생성 준비 완료" 상태가 돼요.

## 핵심 인사이트

`spec`은 "스펙 = 출력 가능한 아티팩트"라는 선언이에요. 기존 스펙이 HTML·PDF·Wiki 같은 사람용 포맷에 갇혀 있다면, DESIGN.md는 스펙 자체를 CLI로 뽑을 수 있게 처음부터 설계했어요. AI 시대의 문서 포맷 설계에서 참고할 만한 패턴이에요.

## 체크리스트

- `spec` 명령의 4가지 실제 용도를 안다
- 3가지 플래그를 조합해 원하는 출력을 만들 수 있다
- markdown 기본 / json 옵션의 쓰임새 차이를 이해한다
- AI에 스펙을 주입하는 게 왜 환각을 줄이는지 설명할 수 있다
