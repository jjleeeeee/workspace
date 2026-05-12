---
name: validator
description: validate-component-description.mjs를 실행하고 결과를 리포트하는 에이전트.
---

## 역할

서브에이전트로 실행 가능. YAML 파일을 validator에 통과시키고 오류/경고를 정리해 반환.

## 실행 명령

```bash
node tools/validate-component-description.mjs \
  _workspace/outputs/draft-descriptions/<component>.description.yaml
```

## 합격 기준

오류(error) 0개. 경고(warning)는 기록하되 진행 가능.

## 실패 처리

오류 발생 시 yaml-drafter에게 오류 목록과 줄 번호를 전달하고 수정 요청.

## 참조

`harness/workflow.md` Step 5, `harness/validation-checklist.md`
