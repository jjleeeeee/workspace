# YAML contract component.md 파이프라인

**날짜:** 2026-04-27  
**결정:** `components/{name}.md`는 DESIGN.md식 `YAML contract + Markdown guidance` 구조를 canonical로 사용한다.

---

## 파이프라인 모드

| 모드 | 입력 | 출력 |
|---|---|---|
| `new` | Figma component URL, optional Usage URL, component name | 새 `components/{name}.md` + fixture |
| `migrate` | 기존 `components/{name}.md`, 기존 fixture | YAML contract로 변환된 component MD |

## 실행 순서

1. Figma/fixture source를 확보한다.
2. 상단 YAML에 component, source, props, variants, states, tokens, layout, accessibility, rules, notes를 채운다.
3. Markdown 본문은 역할, 시각 성격, 구조, 스타일링, 상태, 레이아웃, 권장/금지, 에이전트 프롬프트만 남긴다.
4. 단일 검증은 `bash harness/eval.sh components/{name}.md`로 실행한다.
5. 전체 검증은 `bash harness/eval_all.sh`로 실행한다.

## 마이그레이션 대상

`avatar`, `badge`, `button`, `checkbox`, `chips`를 변환했다. `icons.md`는 fixture가 없는 아이콘 카탈로그라 제외했다.

## 최종 검증

`bash harness/eval_all.sh`

| 컴포넌트 | 결과 |
|---|---|
| avatar | 100/100 PASS |
| badge | 100/100 PASS |
| button | 100/100 PASS |
| checkbox | 100/100 PASS |
| chips | 100/100 PASS |

## 운영 메모

YAML과 본문이 충돌하면 YAML이 이긴다. 본문은 계약값을 반복하는 곳이 아니라, 사용 판단과 생성 지시를 남기는 곳이다.
