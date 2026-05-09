# lint — 파일 검사

DESIGN.md에 문제 없는지 자동으로 확인하는 명령

DESIGN.md 레포는 CLI(명령줄 도구)를 같이 제공해요. 그중 가장 먼저 배울 건 `lint` — 파일을 검사해서 문제를 찾아주는 명령이에요.

## 기본 사용법

```bash
# 파일 경로를 넘겨서 검사
npx @google/design.md lint DESIGN.md

# 포맷 지정 (현재는 json만)
npx @google/design.md lint --format json DESIGN.md

# 파이프로 넘기기 — 파일을 표준입력으로
cat DESIGN.md | npx @google/design.md lint -
```

마지막 줄의 `-`는 "파일 경로 대신 표준 입력(stdin)에서 받아"라는 관례예요. 다른 명령의 출력을 바로 넘길 때 편해요.

## 결과 종류 (severity) 3단계

| 심각도 | 의미 | 예시 |
|--------|------|------|
| **error** — 치명 | 파일을 실제로 못 쓰게 되는 문제 | 존재하지 않는 토큰 참조 |
| **warning** — 주의 | 문제는 있지만 AI가 추측해 메울 수 있는 상황 | primary 색 없음 |
| **info** — 정보 | 실패·통과 개념 없음 | 토큰 개수 같은 통계 |

**Exit code:** `error`가 있으면 1(실패), 없으면 0(성공). `warning`은 통과.

`error`가 있을 때만 CI 빌드가 막힌다는 뜻이에요. `warning`은 쌓여도 릴리스를 막지 않아 실용적이에요.

## 결과 예시

```json
{
  "findings": [
    {
      "severity": "warning",
      "path": "components.button-primary",
      "message": "textColor (#ffffff) on backgroundColor (#1A1C1E) has contrast ratio 15.42:1 — passes WCAG AA."
    }
  ],
  "summary": { "errors": 0, "warnings": 1, "info": 1 }
}
```

`findings`는 발견한 문제들의 목록, `summary`는 몇 개씩 나왔는지 요약이에요. AI 도구가 이 JSON을 읽고 "에러 0, 경고 1 → 통과"를 판단할 수 있어요.

## 코드에서 직접 호출

```javascript
import { lint } from '@google/design.md/linter';

const report = lint(markdownString);
report.findings;       // 발견한 문제들
report.summary;        // 개수 요약
report.designSystem;   // 파싱된 토큰 트리
```

Node 스크립트에서 파일 없이 문자열로 바로 호출할 수 있어요. `designSystem`은 이미 파싱된 토큰 트리라, AI 에이전트가 이걸 받아서 바로 UI를 만들 수 있어요.

## 실제로 어디에 쓸까

깃허브 PR에 DESIGN.md 변경이 들어오면 GitHub Actions가 자동으로 lint를 돌려요. 에러가 있으면 PR에 X 표시 → 리뷰 받기 전에 문제 확인. 에러가 없으면 자동 통과. CI와 자연스럽게 붙는 설계예요.

## 핵심 인사이트

`lint`는 "CI에서 쓰라고 만든 도구"예요. 3단계 심각도, exit code 정책, JSON 전용 출력 — 전부 자동화에 친화적이에요. AI가 "이 DESIGN.md 괜찮아?"를 물을 때 그대로 붙여 쓸 수 있는 API 설계예요.

## 체크리스트

- stdin 입력(`-`)의 쓰임새를 안다
- 심각도 3단계와 exit code 정책을 설명할 수 있다
- 코드에서 호출할 때 받는 3가지 반환값을 안다
- CI에서 이 명령이 어떻게 쓰이는지 상상할 수 있다
