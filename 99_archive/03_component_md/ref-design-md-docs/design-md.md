---
title: "DESIGN.md 포맷 완전정복 — 28챕터 딥다이브"
site: "Rubric Labs"
url: "https://rubric.im/curriculum/design-md"
captured_at: "2026-04-27"
type: "reference"
status: "raw-text-scraped"
---

# DESIGN.md 포맷 완전정복

원문: <https://rubric.im/curriculum/design-md>

## 챕터 맵 · 28 챕터

## DESIGN.md 포맷 완전정복

28 챕터

시작

1. ★ 시작하기

M1 · 포맷 철학

1. 01 왜 DESIGN.md인가
2. 02 YAML + 마크다운 이중 구조
3. 03 토큰이 정답, 본문은 이유

M2 · 토큰 스키마

1. 04 YAML 스키마 한눈에 보기
2. 05 색(Color) 값 형식
3. 06 길이(Dimension) 값과 단위
4. 07 폰트(Typography) 값 구조
5. 08 토큰 참조 — {colors.primary}

M3 · 섹션 구조

1. 09 본문의 8개 섹션과 순서
2. 10 Overview · Colors 섹션
3. 11 Typography · Layout 섹션
4. 12 Elevation · Shapes 섹션
5. 13 Components 섹션과 상태(variant)
6. 14 Do's and Don'ts — 가드레일

M4 · 실제 예시 읽기

1. 15 Atmospheric Glass — 유리 효과
2. 16 Paws & Paths — 따뜻 + 신뢰
3. 17 Totality Festival — 다크 글래스

M5 · CLI 명령

1. 18 lint — 파일 검사
2. 19 diff — 버전 비교
3. 20 export — 다른 포맷으로 내보내기
4. 21 spec — 스펙 자체 출력

M6 · 린트 규칙

1. 22 broken-ref · missing-primary
2. 23 contrast-ratio — 가독성 자동 검사
3. 24 orphaned-tokens · missing-typography
4. 25 token-summary · missing-sections · section-order

M7 · 확장성 정책

1. 26 처음 보는 내용은 어떻게 처리할까
2. 27 DTCG · Tailwind · Figma와의 관계

최종 정리

1. 28 다시 읽는 큰 그림

DEEP DIVE

## DESIGN.md 포맷 완전정복

28 챕터

시작

1. ★ 시작하기

M1 · 포맷 철학

1. 01 왜 DESIGN.md인가
2. 02 YAML + 마크다운 이중 구조
3. 03 토큰이 정답, 본문은 이유

M2 · 토큰 스키마

1. 04 YAML 스키마 한눈에 보기
2. 05 색(Color) 값 형식
3. 06 길이(Dimension) 값과 단위
4. 07 폰트(Typography) 값 구조
5. 08 토큰 참조 — {colors.primary}

M3 · 섹션 구조

1. 09 본문의 8개 섹션과 순서
2. 10 Overview · Colors 섹션
3. 11 Typography · Layout 섹션
4. 12 Elevation · Shapes 섹션
5. 13 Components 섹션과 상태(variant)
6. 14 Do's and Don'ts — 가드레일

M4 · 실제 예시 읽기

1. 15 Atmospheric Glass — 유리 효과
2. 16 Paws & Paths — 따뜻 + 신뢰
3. 17 Totality Festival — 다크 글래스

M5 · CLI 명령

1. 18 lint — 파일 검사
2. 19 diff — 버전 비교
3. 20 export — 다른 포맷으로 내보내기
4. 21 spec — 스펙 자체 출력

M6 · 린트 규칙

1. 22 broken-ref · missing-primary
2. 23 contrast-ratio — 가독성 자동 검사
3. 24 orphaned-tokens · missing-typography
4. 25 token-summary · missing-sections · section-order

M7 · 확장성 정책

1. 26 처음 보는 내용은 어떻게 처리할까
2. 27 DTCG · Tailwind · Figma와의 관계

최종 정리

1. 28 다시 읽는 큰 그림

시작· 커리큘럼 소개

# 시작하기

DESIGN.md 포맷 완전정복 — 커리큘럼 소개

이 커리큘럼은 Google Labs Code가 공개한 DESIGN.md 포맷 스펙(`google-labs-code/design.md`)을 뜯어보는 딥다이브예요. 28개 챕터를 다 마치면, 포맷 스펙 · 토큰 타입 · 섹션 구조 · 검사 규칙 · CLI 명령 · 실제 예시 3개 를 처음부터 재구성할 수 있는 수준에 도달해요.

이 커리큘럼을 마치면

- DESIGN.md가 어떤 문제를 풀려고 만들어졌는지 설명할 수 있어요
- YAML 토큰 + 마크다운 본문 이중 구조 의 역할 분리를 이해해요
- 토큰 참조 `{path.to.token}`과 컴포넌트 변형(variant) 설계 원리를 알아요
- CLI 4개 명령(`lint` · `diff` · `export` · `spec`)과 8개 검사 규칙을 설명할 수 있어요

## 원본 레포

- GitHub: `github.com/google-labs-code/design.md`
- 라이선스: Apache-2.0, 버전: alpha (포맷이 앞으로 바뀔 수 있음)
- 참고 문서: `README.md`(CLI·검사 규칙), `docs/spec.md`(포맷 규범)
- 예시 3개: `atmospheric-glass`, `paws-and-paths`, `totality-festival`

## 학습 방식

- 모듈별 학습 — 7개 모듈 + 최종 정리, 총 28챕터
- 영문 원문 + 한국어 해석 병기 — 스펙 인용 바로 밑에 한국어로 풀어 놨어요
- 원문 자동 발췌 — 챕터 상단의 `L###` 표시를 누르면 해당 원문이 접혀 보여요
- 구체 예시 · 시나리오 박스 — 추상 개념은 실제 상황으로 바로 연결
- 체크리스트 — 각 챕터 끝에 자가 점검 항목

## 커리큘럼 맵

M1. 포맷 철학 · 3챕터

이 포맷이 풀려는 문제, 이중 구조, 토큰·본문의 우선순위

M2. 토큰 스키마 · 5챕터

스키마 전체 / 색 / 길이·단위 / 폰트 / 토큰 참조

M3. 섹션 구조 · 6챕터

8개 섹션 순서 · 각 섹션 설계 원칙

M4. 실제 예시 · 3챕터

Atmospheric Glass · Paws & Paths · Totality Festival

M5. CLI · 4챕터

lint · diff · export · spec

M6. 검사 규칙 · 4챕터

broken-ref · contrast · orphaned · section-order 등 8개

M7. 확장성 · 2챕터

모르는 내용 처리 정책, DTCG·Tailwind와 상호운용

최종 정리 · 1챕터

27챕터 요약 + 여러분의 작업에 가져갈 원리 10개

학습 팁

이 포맷은 아직 alpha 단계 예요. 정답으로 받아들이기보다 "설계자는 왜 이 선택을 했을까"를 추적하는 관점으로 읽으세요. 각 선택의 이유를 이해하면, 같은 원리를 여러분의 API 스펙·AI 시스템 프롬프트·팀 문서 포맷 설계에 그대로 옮겨 심을 수 있어요.

준비됐다면 아래 첫 챕터로 버튼으로 시작해요.

첫 챕터로 → Ch 1 . 왜 DESIGN.md인가

Home

Projects

문의

Blog

상호명 루브릭랩스 대표자 형성철 사업자등록번호 273-87-01118

소재지 서울 성동구 성수동2가 273-19 711호 대표이메일 such.hyung@rubric.im

© 2026 Rubric Labs. All rights reserved.

이용약관개인정보처리방침
