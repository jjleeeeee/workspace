# Reference Deck Analysis: DS Chatbot Slides

## 조사 범위/키워드

- 대상 파일: `https://www.figma.com/slides/HbHKFxazHHdjq7WUjpztfb`
- 분석 목적: LLM Harness 발표 덱의 디자인 퀄리티 향상을 위한 참고 덱 디자인 언어 추출
- 분석 방식:
  - Figma Slides 구조 확인
  - 5장 단위 순차 스크린샷 분석
  - 대표 슬라이드의 텍스트/레이아웃/배경/색상 패턴 확인

## 출처 리스트

| 사이트명 | URL | 핵심 요지 |
| --- | --- | --- |
| Figma Slides 참고 덱 | https://www.figma.com/slides/HbHKFxazHHdjq7WUjpztfb | DS Chatbot 발표 덱. 블랙 문제 파트와 민트 해결 파트가 명확히 나뉘는 발표 구조 |
| LLM Harness Figma 덱 | https://www.figma.com/slides/5ApcqynkNIBm8gFf0pCfft | HTML 덱을 Figma Slides로 옮긴 편집 가능 1차 골격 |

## 기본 구조

- 총 슬라이드 수: 28장
- 캔버스: 1920 x 1080
- Row: 1개 row에 전체 슬라이드 배치
- 주요 폰트:
  - 영문 대형 제목: `CircularXX TT / Black or Bold`
  - 본문/한국어 보조 텍스트: `CircularXX TT`, `WeGothicSans`, `Pretendard`
- 주요 색상:
  - 문제 파트 배경: `#000000`
  - 해결 파트 배경: 민트 그라데이션 기반, 중심색 `#D5F3F1`
  - 기본 텍스트: 블랙 배경에서는 `#FFFFFF`, 민트 배경에서는 `#000000`
  - 강조색: 시안/민트 계열
  - 경고/문제 강조: 레드 `#FE5B58`

## 디자인 언어 요약

### 1. 배경은 의미를 나눈다

- 블랙 배경:
  - 문제 제기
  - 복잡도 증가
  - 긴장감
  - pain point 표현
- 민트 그라데이션 배경:
  - 해결책
  - 제품 소개
  - 사용 방법
  - 클로징/Q&A

LLM Harness 덱 적용:

- AI 정보 과부하, 모델 혼란, 반복 실패 파트는 블랙 배경 사용
- Harness, Workflow, 입문자 조언, 정리 파트는 민트 배경 사용

### 2. 타이틀 위치는 강하게 고정한다

- 본문형 슬라이드 타이틀:
  - 위치: 좌상단 `x 100 / y 100`
  - 크기: 약 `60px`
  - 굵기: Black/Bold
- 커버/전환 슬라이드:
  - 중앙 정렬 또는 좌측 대형 타이틀
  - 정보량 최소화

LLM Harness 덱 적용:

- 기존 HTML 덱의 기본 패딩 `100px 80px`보다 좌측 기준을 참고 덱처럼 `100px`로 정렬
- 제목은 48px보다 크게, 핵심 슬라이드는 60px 이상으로 조정

### 3. 복잡한 설명은 상징으로 줄인다

참고 덱은 긴 문장을 바로 보여주지 않고, 먼저 상징으로 압축한다.

- 원형 6개: workflow 단계
- 겹친 원: 연결/구간/반복
- 사람 아이콘 군집: 질문 증가, 담당자 부담
- 실제 화면 캡처: 제품 신뢰감
- 어두운 overlay 위 중앙 메시지: 결론 수렴

LLM Harness 덱 적용:

- AI 툴 나열: 툴 이름을 작은 로고/칩으로 흩뿌리기
- LLM 설명: 문장/패턴이 쌓이는 필드 또는 원형 군집
- Harness 설명: `AI`와 `Workflow`를 연결하는 큰 원/라인
- Workflow 추출: 반복 루프를 원형/연결선으로 단순화

### 4. 시퀀스가 있다

참고 덱의 흐름:

1. 커버
2. Workflow 소개
3. 특정 구간 강조
4. DS/Designer pain point
5. 문제 규모 확대
6. 한 문장 결론
7. 해결책 소개
8. 구축 방식
9. Source of Truth
10. 사용 예시
11. Now Available
12. Q&A

LLM Harness 덱 적용 흐름:

1. 커버
2. AI 정보 과부하
3. LLM의 기본 작동 원리
4. AI를 검색창이 아닌 작업 인터페이스로 전환
5. Harness 정의
6. 반복 실패에서 Workflow 추출
7. Rules/Skills/Commands로 모듈화
8. Harness는 계속 진화
9. 입문자에게 주는 조언
10. 클로징/Q&A

## 슬라이드 타입별 패턴

### Cover

- 민트 그라데이션 배경
- 큰 제목과 짧은 서브타이틀
- 여백을 많이 둠
- 로고는 작게 배치

LLM Harness 적용:

- 제목: `AI(LLM)의 이해부터 Harness까지`
- 서브타이틀: `나만의 Workflow 만들기`
- 우하단 또는 좌하단에 작은 meta/logo

### Problem / Painpoint

- 블랙 배경
- 좌상단 타이틀
- 중앙에는 상징적 오브젝트
- 텍스트는 최소화
- 강조가 필요한 경우 레드 `!!`

LLM Harness 적용:

- `미디어 속에서 넘쳐나는 AI 정보`
- `그래서 뭘 써야하지?`
- `정보를 전부 쫓아가지 마세요`

### Workflow / Circle Diagram

- 블랙 또는 민트 배경
- 원형을 수평으로 나열
- 원은 서로 겹치거나 얇은 라인으로 연결
- 특정 구간만 민트/그라데이션으로 강조

LLM Harness 적용:

- `Build → Review → Extract → Refine`
- `Context / Rules / Skills / Commands / QA`
- `AI ↔ Workflow`

### Screenshot / Product Proof

- 민트 배경
- 실제 캡처를 크게 배치
- 좌상단 제목과 30px 설명
- 캡처는 라운드 처리 또는 큰 카드처럼 사용

LLM Harness 적용:

- 실제 폴더 구조, rules, skills, commands 예시가 있으면 이 타입으로 전환
- 현재 없으면 Figma 안에서 문서 카드/폴더 카드로 대체

### Closing / Q&A

- 민트 배경
- 중앙에 짧은 문장
- 부제는 흐리게 처리
- 정보량 최소화

LLM Harness 적용:

- `Q&A`
- `AI와 함께 자신만의 workflow를 만들어보세요.`

## LLM Harness 덱 1차 리디자인 추천 범위

33장 전체를 바로 고치기보다 대표 6장을 먼저 고도화한다.

1. 커버
   - 민트 그라데이션
   - 제목/서브타이틀 재정렬
2. 정보 과부하
   - 블랙 배경
   - AI 툴/뉴스 키워드 군집
   - 중앙 메시지 강조
3. LLM 작동 원리
   - 문장/패턴 field
   - 다음 말 예측을 시각화
4. Harness 정의
   - AI와 Workflow를 연결하는 원형/라인 구조
5. Workflow 추출
   - 실패/수정/관찰/패턴/Workflow 흐름
   - 민트 해결 파트로 전환
6. 클로징/Q&A
   - 민트 배경
   - 중앙 메시지

## 적용안 2개

### 추천안: Figma Slides에서 직접 고도화

- 현재 만들어둔 Figma Slides 편집 가능 덱을 그대로 사용
- 대표 6장을 먼저 고퀄 템플릿으로 리디자인
- 이후 같은 타입의 나머지 슬라이드에 확장 적용

트레이드오프:

- 원본 HTML과 완전 동일한 비주얼을 유지하는 작업은 아님
- 대신 발표 덱으로서 완성도와 편집성이 높아짐

### 대안: HTML 덱 스타일을 먼저 수정

- 기존 HTML/CSS에 참고 덱 스타일을 반영
- 브라우저에서 전체 톤을 빠르게 검수
- 이후 Figma로 다시 옮김

트레이드오프:

- Figma 편집 가능 덱을 바로 개선하는 목적과는 한 단계 멀어짐
- HTML/CSS 조정에는 빠르지만, Figma 내 수정성은 낮아질 수 있음

## 실행 메모

- 전체 Figma Slides 파일을 한 번에 깊게 분석하면 타임아웃이 발생함
- 안정적인 분석 단위는 5장 단위
- 레이어 딥스캔보다 스크린샷 중심 분석이 더 빠르고 정확함
- 복잡한 슬라이드는 immediate children만 읽고, 상세 레이어는 필요한 장만 별도 분석해야 함

## 최종 판단

LLM Harness 덱은 참고 덱의 시각 언어를 그대로 가져오되, 주제에 맞게 다음처럼 재해석하는 것이 적합하다.

- 문제 파트: 블랙 배경 + 복잡도/혼란/과부하
- 해결 파트: 민트 배경 + 구조화/워크플로우/하네스
- 핵심 모티프: 원형, 연결선, 키워드 군집, 중앙 메시지
- 목표: 모든 텍스트를 설명하지 말고, 한 장에 하나의 인상만 남기기

Too Long; Didn't Read 3줄:

- 결론: 참고 덱의 핵심은 블랙 문제 파트와 민트 해결 파트의 강한 분리다.
- 다음 행동: LLM Harness 덱 대표 6장을 먼저 이 스타일로 리디자인한다.
- 추천안: Figma Slides에서 직접 고도화 / 대안: HTML 덱 CSS를 먼저 개선한다.
