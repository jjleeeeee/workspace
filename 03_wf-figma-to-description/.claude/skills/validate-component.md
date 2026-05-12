---
name: validate-component
description: 컴포넌트 YAML 1개에 대해 validator를 실행하고 결과를 해석하는 반복 작업 스킬.
---

## 사용 시점

YAML을 저장한 직후, 커밋 전.

## 절차

1. validator 실행:
   ```bash
   node tools/validate-component-description.mjs \
     _workspace/outputs/draft-descriptions/<component>.description.yaml
   ```
2. 오류 있으면 → yaml-drafter에게 목록 전달 후 수정, 재실행.
3. 경고만 있으면 → 경고 내용을 source_gaps 또는 spec_notes에 기록 후 진행.
4. 오류 없음 → 통과. 다음 단계 진행.
