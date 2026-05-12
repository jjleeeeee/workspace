---
name: fill-gap
description: source_gaps 항목 1개를 해소하는 표준 절차 스킬.
---

## 사용 시점

source_gaps 항목이 남아 있을 때 컴포넌트별로 호출.

## 절차

1. 해당 gap 항목 확인 (item 텍스트, 이유).
2. figma-reader로 관련 Figma 데이터 읽기 시도 (부모 에이전트 전용).
3. 확인 가능한 경우:
   - YAML 해당 필드에 값 기입.
   - source_gaps 항목 제거.
4. 확인 불가한 경우:
   - source_gaps 항목에 추가:
     ```yaml
     confirmed: true
     reason: "<이유 — 예: Lottie asset stored outside Figma file>"
     ```
5. validate-component 스킬 실행.
