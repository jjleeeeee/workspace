---
name: enrich-component
description: 컴포넌트 YAML에 token 및 typography 데이터를 보강하는 반복 작업 스킬.
---

## 사용 시점

yaml-drafter가 YAML 초안을 저장한 후, validator 실행 전 또는 후.

## 절차

1. 토큰 보강:
   ```bash
   python scripts/enrich_tokens.py \
     _workspace/outputs/draft-descriptions/<component>.description.yaml
   ```
2. 타이포그래피 보강:
   ```bash
   python scripts/enrich_typography.py \
     _workspace/outputs/draft-descriptions/<component>.description.yaml
   ```
3. 변경 사항 확인 후 validate-component 스킬 실행.
