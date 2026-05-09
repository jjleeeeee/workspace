Sprint #1 - DS-MCP MVP (크로스플랫폼 공통 카탈로그)

# 사전 준비

- 각 팀별 현황 조사/공유
  - 디자인: 디자인 가이드 작업, 공유, QA 절차
  - 개발: 각 플랫폼 별 디자인 가이드 적용 방법
- AI 툴 신청 및 설정

# 아젠다

- TF 소개 및 목표
- 구성원 소개
- 각 팀 별 현황 및 어려움 공유
- 해결해야할 문제점 공유
- 스프린트1 공유

  


## 스프린트 킥오프

- 목표 설정
- 평가 기준 설정
- 역할 분담
- 진행 일정 결정 (~4/31? 5/8?)

  


## 팀 별 공유 요약


|                  |             |                 |               |
| ---------------- | ----------- | --------------- | ------------- |
| 이슈               | iOS         | Android         | Web           |
| Figma MCP 품질 불안정 | ✅ 레이어 해석 오류 | ✅ UI 겨우 표시      | —             |
| 디자인 검증 자동화 부재    | ✅ 사람 눈 의존   | ✅               | ✅             |
| 토큰 연결 미흡         | ✅           | ✅ 변수 연결 안 됨     | —             |
| CDS 버전 파편화       | —           | —               | ✅ 프로젝트별 다른 버전 |
| 컴포넌트 공통화 미완      | —           | ✅ 미사용 선제 개발 안 함 | ✅ 악순환         |


# 개선 방향

- **as-is: LLM → Figma MCP → LLM**
- to-be: LLM → DSL MCP → LLM

  
**결론**  


- DS-MCP MVP — 3개 플랫폼(iOS · Android · Web)이 공유하는 Token/Component Catalog(DSL)를 MCP로 제공하고, off/on A/B로 LLM 코드 품질 기준 데이터(현재)를 측정하는 10일 스프린트.

## 카탈로그 설계 (DSL)

> **카탈로그와 MCP 스펙은 플랫폼을 몰라야한다.** 토큰·컴포넌트 의미(semantic)만 정의한다.


|                       |                                                      |                                                                                          |
| --------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| 레이어                   | 설명                                                   | 예시                                                                                       |
| **Token Catalog**     | 의미 중심 이름 + 값. 플랫폼별 코드 없음.                            | `color.button.primary.bg`, `spacing.md`, `radius.12`                                     |
| **Component Catalog** | 컴포넌트 이름 + 시맨틱 props. 구현 코드 없음.                       | Button: `{ variant: primary\|secondary, size: M\|L, state: enabled\|disabled\|loading }` |
| **MCP 응답**            | 위 두 카탈로그를 tool로 제공. 플랫폼별 코드 생성은 **각 플랫폼 LLM 룰에 위임.** | `list-ds-tokens`, `get-ds-component-metadata`                                            |


각 플랫폼은 이 공통 컨텍스트를 받아 자신의 코드(SwiftUI / Compose / React)로 변환하는 것을 **각자 Sprint에서 진행한다.**   


## DS를 정의해야하는 이유

Platform-Pain-Points에서 3개 플랫폼이 공유하는 핵심 원인:  


> **"LLM이 우리 DS 토큰·컴포넌트의 존재를 모른다"** → 하드코딩 리터럴, DS 미사용, 플랫폼마다 다른 해석.

DS-MCP는 이 공백을 모든 플랫폼에 한 번에 채우는 계층:  



|                       |                                                    |
| --------------------- | -------------------------------------------------- |
| Pain Point            | DS-MCP 대응                                          |
| 토큰명 모름 → 리터럴 직접 기입    | `list-ds-tokens`로 semantic 토큰명 조회                  |
| DS 컴포넌트 존재 모름 → 직접 구현 | `list-ds-components` / `get-ds-component-metadata` |
| 플랫폼마다 다른 토큰 해석        | 카탈로그가 유일한 공식 기준 — 플랫폼 룰이 거기서 파생                    |


## 이 스프린트의 실질 목적 — 기준 데이터 측정

> **기준 데이터(현재)가 없음. 따라서 이 스프린트의 1차 목표는 수치 달성이 아니라 기준 데이터 측정.**

Sprint-1 A/B 결과는 다음을 확인하는 것:  


1. DS-MCP on/off 조건에서 지표가 **어느 방향으로** 움직이는가
2. 어느 지표가 **신뢰할 수 있는 신호**인가 (측정 노이즈 파악)
3. Sprint-2에서 쓸 수 있는 **정량 임계값 초안** 도출

## 가설

> **LLM이 이해하기 쉬운 형태의 카탈로그 및 DS로 제공하면 LLM이 UI를 생성할 때 정확도가 향상될 것이다.**

## Sprint 1 목표 (5개)

1. **Token Catalog Schema v1 + Component Catalog Schema v1 확정** · 팀 합의.
2. **스키마 따른 fixture JSON** (tokens · components · DSL 샘플 등) 정의
3. **최소 DS-MCP 서버** `npx our-ds-mcp` 동작
  1. tool 3개: `list-ds-tokens` · `list-ds-components` · `get-ds-component-metadata`
4. **A/B 벤치마크**: Cursor/Claude에서 DS 참조/미참조 × 3 플랫폼 병렬 → DSL + 코드 스냅샷 저장.
5. **측정 리포트**: off(Figma MCP만) / on(Figma MCP + DS-MCP) A/B 각 플랫폼 병렬 실행   
→ 생성 결과물의 품질(token linter, 디자인 준수율 측정)

> Sprint 1의 성과는 코드의 양이 아니라 **정의된 DS 스키마의 완성도 + 기준 데이터(현재)**다. Sprint 2+ 가 이 위에서 굴러간다.

## 이 스프린트에서 진행할 것들 / 진행하지 않을 것

### 진행할 것

- **Figma MCP (Framelink) 등** — A/B 태스크의 디자인 입력. off/on 모두 사용.
- **Token Catalog + Component Catalog** — DS-MCP가 제공.
- 기본 컴포넌트 (Atomic component), Composite component, 실제 화면
- DS-MCP tool 생성 (`list-ds-tokens` · `list-ds-components` · `get-ds-component-metadata`).
- **DSL → 플랫폼 코드 + 빌드**: 각 플랫폼이 Sprint-1 내 병렬로 실행. 평가 대상(Stage 2).
- A/B: 태스크 2~3개 × 참가자 2명 × off/on 2조건 × **3 플랫폼 병렬**.

### 진행하지 않을 것

- 플랫폼 별 Full Token catalog + Full Component catalog 제공

## 플랫폼별 병렬 테스트 전략

- 카탈로그/MCP 스펙은 Sprint-1에서 확정
- **DSL→Code 테스트는 각 플랫폼이 Sprint-1 내에서 각각 진행**
- 플랫폼마다 담당자가 자신의 스택에서 A/B를 실행하고, 결과를 D10 리포트에서 정리


|             |                   |             |                         |
| ----------- | ----------------- | ----------- | ----------------------- |
| 플랫폼         | Sprint-1 역할       | DSL→Code 스택 | 비고                      |
| **iOS**     | 카탈로그 검토 + A/B 테스트 | SwiftUI     | Plan-first 워크플로 이미 운영 중 |
| **Android** | 카탈로그 검토 + A/B 테스트 | Compose     | 담당자 자율 진행               |
| **Web**     | 카탈로그 검토 + A/B 테스트 | React/WDS   | 담당자 자율 진행               |


> 각 플랫폼 담당자가 D8~D9에서 **독립적으로** 자신의 스택으로 A/B를 실행한다. 서로 블로킹하지 않는다. 참여 여부는 각 플랫폼 자율이며, Sprint-1 리포트는 참여한 플랫폼의 결과를 합산해 효과 크기를 기록한다. Go/No-Go 판정은 없다.

## 10일 타임라인

### Week 1 — 스펙 확정과 데이터


|     |                                                       |               |                                                                |
| --- | ----------------------------------------------------- | ------------- | -------------------------------------------------------------- |
| Day | Step                                                  | 담당            | 산출물                                                            |
| D1  | Step 0: 벤치마크 태스크 확정 + 필드 관찰                           | 공통 (전 플랫폼 참여) | 태스크 시나리오, 실제 Figma MCP(Framelink) + DS-MCP 호출 → LLM 참조 필드 도출   |
| D2  | Step 1: DSL Schema v1 확정 + Token Catalog Schema v1 확정 | 디자인+개발 공동     | `schemas/dsl.v1.json` · `schemas/tokens.v1.json`               |
| D3  | Step 2: Component Catalog Schema v1 확정                | 디자인 주도        | `schemas/components.v1.json`                                   |
| D4  | Step 3: Token Catalog fixture                         | 디자인 주도        | `fixtures/tokens.sample.json`                                  |
| D5  | Step 4: Component Catalog fixture + DSL 샘플 fixture    | 디자인 주도        | `fixtures/components.sample.json` · `fixtures/dsl.sample.json` |


### Week 2 — MCP 구현 + 병렬 A/B


|     |                                                                                             |             |                                                        |
| --- | ------------------------------------------------------------------------------------------- | ----------- | ------------------------------------------------------ |
| Day | Step                                                                                        | 담당          | 산출물                                                    |
| D6  | Step 5: MCP skeleton + `list-ds-tokens`                                                     | 개발          | `npx our-ds-mcp` 기본 동작                                 |
| D7  | 나머지 2개 tool + contract test + Cursor 등록 + Figma MCP(Framelink) 등록                           | 개발          | `.cursor/mcp.json` 템플릿 (DS-MCP + Figma MCP 병렬)         |
| D8  | Step 6: A/B off/on 주행 — **iOS · Android · Web 병렬** (off=Figma MCP만 / on=Figma MCP + DS-MCP) | 각 플랫폼 담당자   | 플랫폼별 실험 로그 + DSL 스냅샷 + 생성 코드 스냅샷                       |
| D9  | Stage 1(DSL) + Stage 2(코드) 지표 측정 + 검증자 리뷰 — 플랫폼별 독립 진행                                      | 각 플랫폼 + 검증자 | 플랫폼별 Stage 1/2 점수표 + 질적 노트                             |
| D10 | 측정 리포트 (전 플랫폼 결과 합산)                                                                        | 공통          | 1~2페이지: 지표별 off vs on 수치 + 측정 노이즈 분석 + Sprint-2 개선 포인트 |


## D1 핵심 — 벤치마크 태스크 설계

**각 플랫폼 담당자가 자신의 스택에서 실행할 태스크를 D1에 확정한다.** 태스크 정의는 플랫폼 중립적으로 기술하고 (예: "Button 구현", "목록 화면"), 실제 구현은 각자 스택으로.  


### 태스크 후보 (D1에 플랫폼별 확정)


|               |                                        |                                   |
| ------------- | -------------------------------------- | --------------------------------- |
| 후보            | 시나리오                                   | DS-MCP 효과 관찰 포인트                  |
| **Button 구현** | Button 컴포넌트 하나 구현 (primary/M 사이즈)      | token 참조 vs 리터럴, DS Button 재사용 여부 |
| **단순 목록 화면**  | Navigation + Label + Chips로 구성된 화면     | 컴포넌트 3개 복합 사용, 토큰 다양도             |
| **상태 처리**     | Button/Checkbox disabled·loading 상태 구현 | 상태별 토큰 매핑 정확도                     |


태스크 선정 원칙:  


- 각 플랫폼에서 실제 반복적으로 하는 작업일 것
- off 조건에서도 시도 가능한 것 (A/B 비교를 위해)
- 20분 내외로 완료 가능한 것 (참가자 부담 최소화)
- 플랫폼이 다른 태스크를 선택해도 무방 — 공통 카탈로그를 같은 조건(off/on)으로 테스트하는 것이 중요

### D1 필드 관찰 방법

D2 스키마 확정 전에 "LLM이 실제로 어떤 필드를 참조하는가"를 관찰한다.  
**실제 Figma MCP(Framelink) + DS-MCP 초기 버전을 그대로 사용한다** — 환경이 이미 갖춰져 있어 수작업 JSON 불필요.  
태스크 시나리오를 실제 툴로 실행하면서 LLM이 참조하는 필드를 기록. 플랫폼별 코드 포함 금지.  


## Day 1~2 필수 진입 비용

DS-MCP 계약을 잘못 확정하면 이후 전체 A/B가 무효화된다. D1~D2에서 반드시 완료할 4가지:  


1. **벤치마크 태스크 3건으로 "필요 필드" 관찰** — 실제 Figma MCP(Framelink) + DS-MCP로 태스크 실행 → LLM이 실제 참조하는 필드 확인.
2. **스키마 v0.1 확정 PR** — 별도 파일 분리, 필드 삭제·이름 변경은 PR 설명에 "major bump 사유" 명시.
3. **Tool description 초안 확정** — 변경 시 A/B 재측정 의무.
4. **Contract test 장치** — Stage 승격 시 이전 응답과 계약 일치 검증 스냅샷 테스트 (`diagnostics`·`source`는 스냅샷 제외).

## 인터페이스 3원칙

1. **Additive only** — 필드 추가만 자유. 삭제·이름 변경·타입 narrowing은 major bump.
2. `source` **메타필드 필수** — `{ origin, version, coverage, freshness, stageLabel }`.
3. `diagnostics` **배열 필수** — 부분 데이터·누락 필드를 LLM에 알림.

## 지표 — Stage 1/2 평가 기준표

UI-Code-Quality-Metrics 기반 2단계 평가 기준표. Stage 1은 DS-MCP가 제공하는 DSL 품질을, Stage 2는 각 플랫폼 생성 코드 품질을 평가한다.  


> **중요**: Go/No-Go 판정 없음. **"on이 off보다 얼마나 나은가"** 수치 자체가 이 스프린트의 산출물.  
> Stage 1은 DSL 품질 평가 (플랫폼 공통, 매 태스크마다 실행). Stage 2는 코드 품질 평가 (플랫폼별, 매 태스크마다 실행).

### Stage 1 — DSL 품질 평가 (0~6점, 플랫폼 공통)


|     |                                     |                                 |     |
| --- | ----------------------------------- | ------------------------------- | --- |
|     | 지표                                  | 측정                              | 매핑  |
| 1   | 컴포넌트 매칭 정확도 (0/1/2)                 | LLM이 응답에서 선택한 컴포넌트명 vs 정답 수동 대조 | 품질  |
| 2   | Raw 리터럴 카운트 (0/1/2)                 | LLM 출력 내 하드코딩 값 grep            | 품질  |
| 3   | i18n + accessibility 필드 완성도 (0/1/2) | 출력 내 a11y/i18n 언급 여부 boolean    | 품질  |


### Stage 2 — 코드 품질 평가 (0~5점, 플랫폼별 독립 측정)

> 각 플랫폼 담당자가 자신의 스택으로 독립 측정. 빌드 도구·검사 패턴은 플랫폼별로 다르나 평가 기준표 구조는 동일.


|     |                                 |                                                |     |
| --- | ------------------------------- | ---------------------------------------------- | --- |
|     | 지표                              | 측정                                             | 매핑  |
| 4   | 빌드 통과 (0/1)                     | 파일럿 플랫폼 빌드 도구 종료 코드                            | 품질  |
| 5   | Token linter — 리터럴 grep (0/1/2) | grep 패턴 자동 카운트                                 | 품질  |
| 6   | 시각 유사도 3-point (0/1/2)          | 렌더링 결과 vs 시안 육안 비교 (Visual-Similarity-Metrics) | 품질  |


### 보조 지표 (정성)


|     |                |     |     |
| --- | -------------- | --- | --- |
|     | 지표             | 측정  | 매핑  |
| A   | Wall-clock 시간  | 수동  | 생산성 |
| B   | MCP tool 호출 횟수 | 로그  | 소비량 |
| C   | 질적 리뷰 코멘트 수    | 검증자 | 품질  |


## 측정 목표 — 이 스프린트는 Go/No-Go 없음

> **Sprint-1은 무조건 진행·완료한다.** 판정이 아닌 수치 획득이 목적이다.

D10 리포트에 담을 것:  



|                     |                                            |
| ------------------- | ------------------------------------------ |
| 항목                  | 내용                                         |
| **효과 크기**           | 각 지표별 `on 평균 − off 평균` 및 플랫폼별 분포           |
| **측정 노이즈 분석**       | 어느 지표가 신뢰할 수 있었는가, 어느 지표가 노이즈였는가           |
| **병목 관찰**           | tool description 품질? fixture 커버리지? 태스크 설계? |
| **Sprint-2 개선 포인트** | 임계값 초안 + 자동화 우선순위                          |


> 수치가 어떻게 나오더라도 Sprint-2는 진행된다. 결과에 따라 Sprint-2 설계가 바뀐다.

## 완료 조건 체크리스트

- D1: 벤치마크 태스크 3건 시나리오 확정 · 실제 Figma MCP(Framelink) + DS-MCP 호출 · LLM 참조 필드 관찰
- D2: `schemas/dsl.v1.json` 확정 PR 머지 · `schemas/tokens.v1.json` 확정 PR 머지
- D3: `schemas/components.v1.json` 확정 PR 머지
- D4: `fixtures/tokens.sample.json` CI validate 통과
- D5: `fixtures/components.sample.json` · `fixtures/dsl.sample.json` CI validate 통과
- D6~D7: `npx our-ds-mcp` 3 tool 전부 응답 · contract test green
- D7: `.cursor/mcp.json` 템플릿 (DS-MCP + Figma MCP 병렬) 레포 등재
- D8: 참여 플랫폼별 off/on A/B 주행 완료 (병렬 진행) · DSL + 코드 스냅샷 저장
- D9: 플랫폼별 Stage 1(DSL) + Stage 2(코드) 지표 수집 + 검증자 리뷰 완료
- D10: 측정 리포트 1~2페이지 (지표별 off vs on 수치 · 노이즈 분석 · Sprint-2 개선 포인트)

