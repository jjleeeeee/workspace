---
name: record-history
description: 결정·정책 변경 사항을 history 파일에 기록하는 반복 작업 스킬.
---

## 사용 시점

컴포넌트 작업 중 결정이나 정책이 바뀐 경우 커밋 직전.

## 절차

1. `_workspace/reviews/history/figma-description-history.md` 파일 열기.
2. 파일 맨 아래에 항목 추가:
   ```markdown
   ## YYYY-MM-DD — <component 이름>
   - <변경 내용>
   - <이유 또는 근거>
   ```
3. 저장 후 커밋에 포함.

## 기록 기준

- 정책 변경 (예: 특정 필드를 더 이상 채우지 않기로 결정)
- 예외 처리 (예: 특정 컴포넌트에 표준 절차 외 규칙 적용)
- source_gaps confirmed 처리 이유가 새로운 패턴일 때
