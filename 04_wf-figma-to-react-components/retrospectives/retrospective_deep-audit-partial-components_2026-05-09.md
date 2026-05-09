# 회고: 부분 완료 컴포넌트 심층 재감사 (2026-05-09)

## 대상

TextButton, Chips, TextFields — source note 상태가 Draft 또는 partial-ready이던 3개 컴포넌트.

## 무엇을 했나

1. 라이브 Figma 재읽기로 각 컴포넌트의 N/A 섹션을 실증 데이터로 교체했다.
2. TextButton CSS에서 WeGothicSans prefix 누락 버그를 발견하고 TDD로 수정했다.
3. TextButton inner_gap이 Figma 스펙(4px/6px 두 값)과 일치함을 검증했다.
4. Chips를 `partial-ready` → `implemented`로 승격시켰다.
5. source note 없는 22개 파일에 `status: implemented` frontmatter를 일괄 추가했다.

## 잘된 것

- Figma 재읽기를 통해 기존 N/A 섹션을 실제 증거로 채울 수 있었다.
- 다른 컴포넌트와 CSS를 비교하는 방식으로 TextButton 버그를 빠르게 발견했다 (크로스 컴포넌트 일관성 체크).
- TDD 사이클이 잘 작동했다 — 테스트 실패 확인 → 수정 → 통과.

## 놓쳤던 것

- TextButton 최초 구현 시 font-family 스택 패턴을 체크하지 않았다. 다른 컴포넌트와의 일관성 검사가 없었음.
- 22개 source note에 status 필드가 없었다. 초기 source note 작성 시 status를 템플릿에 포함시켰다면 추후 일괄 작업이 필요 없었다.

## 재사용 가능한 교훈

- 새 컴포넌트 CSS 작성 후 `font-family` 줄을 인접 컴포넌트와 비교해서 패턴이 일치하는지 확인한다.
- source note 초안 작성 시 `status: draft` 를 frontmatter에 포함시켜야 상태 추적이 가능하다.
- N/A 섹션은 "나중에 채운다"가 아니라 라이브 읽기 직후에 채우는 것이 효율적이다.
