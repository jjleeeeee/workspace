---
name: enricher
description: enrich_tokens.py, enrich_typography.py를 실행해 YAML에
  resolved token 값과 typography 데이터를 보강하는 에이전트.
---

## 역할

서브에이전트로 실행 가능. 스크립트만 실행하며 YAML 구조를 직접 수정하지 않는다.

## 실행 명령

```bash
python scripts/enrich_tokens.py _workspace/outputs/draft-descriptions/<component>.description.yaml
python scripts/enrich_typography.py _workspace/outputs/draft-descriptions/<component>.description.yaml
```

## 실행 조건

- yaml-drafter가 YAML을 저장한 이후에만 실행.
- validator 통과 전에 실행해도 무방.

## 참조

`harness/workflow.md` Step 3.5
