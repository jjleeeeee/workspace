# LLM to Harness Workflow Presentation

이 폴더는 AI(LLM)의 이해부터 하네스까지 이어지는 발표자료 패키지입니다.

## File Roles

- `../style-kit/slide-style-kit.md`
  - 새 PPT/HTML 슬라이드를 만들 때 가장 먼저 참조할 상위 공용 스타일 기준 문서입니다.

- `content/`
  - 실제 슬라이드 생성에 직접 쓰는 발표 원고와 slide-by-slide 장면 설계입니다.
  - `script.md`: 발표 대본
  - `slide-scene-design.md`: 슬라이드별 장면 구성

- `deck/`
  - `index.html`: 공용 style kit를 기준으로 만든 HTML 발표자료입니다.

- `assets/generated/`
  - ChatGPT 이미지 생성으로 만든 deck용 비주얼 에셋입니다.
  - `wild-horse.png`, `workflow-desk.png`, `info-overload.png`, `harness-system.png`

- `planning/`
  - 발표 제작 전의 컨셉, 방향성, 제작 프로세스 문서입니다.
  - `ppt-concept.md`: 발표 컨셉, 대상, 톤, 메타포
  - `workflow.md`: 스토리텔링 기반 발표 제작 워크플로우

## Recommended AI Workflow

1. 먼저 `../style-kit/slide-style-kit.md`를 읽습니다.
2. 발표의 의도와 톤은 `planning/ppt-concept.md`를 기준으로 잡습니다.
3. 실제 슬라이드 내용은 `content/script.md`와 `content/slide-scene-design.md`를 기준으로 만듭니다.
4. 제작 순서나 사고 과정이 필요하면 `planning/workflow.md`를 참고합니다.
5. 완성 화면 감각은 `deck/index.html`을 확인합니다.
