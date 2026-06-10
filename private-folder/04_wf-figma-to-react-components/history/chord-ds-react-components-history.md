# Chord DS React Components History

이 문서는 `04_wf-figma-to-react-components` workflow의 구조, 검증 기준, 반복 규칙이
바뀐 이유만 짧게 누적한다.

component별 구현 회고는 `retrospectives/`에 남긴다. 이 파일에는
workflow decision을 반복해서 적는다.

## 기록 원칙

- workflow 구조, source priority, Done Criteria, 검증 기준이 바뀐 경우에만 기록한다.
- 단순 오탈자나 같은 의미의 문장 정리는 기록하지 않는다.
- 확인되지 않은 값은 결정처럼 쓰지 않고 source note의 `Known Gaps`에 남긴다.
- 각 항목은 5-10줄 안에서 끝낸다.

## Entry Template

```md
### YYYY-MM-DD / <workflow-or-component-family>

- 변경: <무엇을 바꿨는가>
- 이유: <왜 바꿨는가>
- 제외: <선택하지 않은 대안>
- 검증: <test/type/build/browser smoke/docs search 결과>
- 재검토: <언제 다시 볼 것인가>
```

## History

### 2026-05-05 / folder-renumber

- 변경: 작업실 폴더를 04번 React component workflow로 승격했다.
- 이유: Figma 기준 component 구현 workflow를 04번 작업실에서 바로 실행하기 위해서다.
- 제외: package scripts, component source, Storybook stories, tests는 변경하지 않았다.
- 검증: 이전 폴더명 잔여 검색, npm test/typecheck/build-storybook으로 확인한다.
- 재검토: workflow 이름이 실제 운영 목적과 어긋날 때.

### 2026-05-06 / workflow-rename

- 변경: 작업실 이름을 `04_wf-figma-to-react-components`로 바꾸고, Figma source note 기반 구현 workflow로 정리했다.
- 이유: 이 작업실은 과거 구현 평가가 아니라 Figma source note 기반 React component 구현과 검증을 위한 전용 공간이기 때문이다.
- 제외: `FigmaCompare` Storybook export와 visual diff harness는 Figma 기준 검증 장치라 유지했다.
- 검증: old folder/project name 검색, npm test/typecheck/build-storybook으로 확인한다.
- 재검토: component 검증 방식이 Storybook 외부 도구로 이동할 때.

### 2026-05-05 / playbook-workflow-history

- 변경: 604줄 단일 workflow 문서를 `PLAYBOOK.md` 진입점과 `workflow/` 상세 문서로 분리하고, workflow decision 기록용 `history/`를 추가했다.
- 이유: source note, Figma read, React build, Storybook 검증, 예외 대응이 한 파일에 섞여 읽기 부담이 커졌기 때문이다.
- 제외: `AGENTS.md`에 전체 절차를 합치거나 component별 회고를 history로 옮기는 방식은 제외했다.
- 검증: `PLAYBOOK.md` 참조 검색, 이전 workflow filename 잔여 검색, npm test/typecheck/build-storybook으로 확인한다.
- 재검토: workflow detail 문서가 다시 길어지거나 component family별 정책이 별도 playbook을 요구할 때.
