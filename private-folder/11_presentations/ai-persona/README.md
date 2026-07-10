# AI Persona Presentation

이 폴더는 AI 퍼소나 발표자료 패키지입니다.

## File Roles

- `../style-kit/slide-style-kit.md`
  - 새 PPT/HTML 슬라이드를 만들 때 가장 먼저 참조할 상위 공용 스타일 기준 문서입니다.

- `deck/index.html`
  - 현재 완성된 HTML 발표자료입니다.
  - AI 퍼소나 발표자료의 실제 화면 감각, 레이아웃, 커버 처리 레퍼런스입니다.

- `content/ai-persona-slides-draft.md`
  - 발표 내용 초안입니다.
  - 문장, 흐름, 슬라이드 구성 참고용입니다.

- `planning/`
  - 발표 컨셉, 제작 과정, 리서치 메모가 있을 때만 두는 선택 구조입니다.
  - 현재 AI 퍼소나 발표자료에는 별도 planning 문서가 없습니다.

- `assets/`
  - AI 퍼소나 발표자료에서만 사용하는 배경과 썸네일 이미지입니다.

## Recommended AI Workflow

1. 먼저 `../style-kit/slide-style-kit.md`를 읽습니다.
2. 새 슬라이드 내용은 `content/ai-persona-slides-draft.md` 또는 사용자가 제공한 원고를 기준으로 합니다.
3. 레이아웃 판단이 애매하면 `deck/index.html`의 구현을 우선 참고합니다.
4. AI 퍼소나 고유 에셋은 `assets/` 안의 로컬 파일만 사용합니다.
