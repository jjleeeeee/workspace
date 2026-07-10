# CDS Interview Research Repository

CDS(Chord Design System) 사용자 인터뷰와 후속 분석 산출물을 모아 둔 리서치 작업 폴더입니다. 실무자, 파트리드, 팀리드, HoD 인터뷰를 바탕으로 CDS가 실제 업무 흐름에서 어떻게 사용되고, 어떤 조건에서 예외 판단이 발생하며, 조직 운영 관점에서 어떤 보완 지점이 있는지 정리합니다.

이 저장소는 애플리케이션 코드 저장소가 아니라 인터뷰 원문, 분석 리포트, 최종 보고서, 발표 준비 자료, Figma 사용 데이터 보조 분석 자료를 관리하기 위한 문서 중심 저장소입니다.

## 핵심 산출물

- `final-report/cds-interview-current-state-report.md`: 인터뷰 원문을 기준으로 정리한 최종 현황 리포트입니다. 본문에서는 인터뷰이 실명을 쓰지 않고 익명 ID로 정리합니다.
- `report/cds-report-260601.md`: Confluence 게시나 공유용으로 다듬은 보고서 초안입니다.
- `report/cds-current-state-review.md`: HoD 인터뷰 전 최종 PPT 준비를 위한 중간 리뷰입니다.
- `report/analysis-docs/cds-interview-analysis.md`: 사용자 인터뷰 1차 심층 분석 리포트입니다.
- `report/analysis-docs/hod-raw-interview-briefing-note.md`: HoD 설명용으로 13명 Raw 발화의 모순/텐션을 사람별로 정리한 브리핑 노트입니다.
- `report/analysis-docs/teamlead-interview-analysis.md`: 팀리드 인터뷰를 별도로 분석한 문서입니다.
- `report/analysis-docs/hod-interview-analysis.md`: HoD 인터뷰를 반영한 후속 분석 문서입니다.
- `plan/cds-status-report-ppt-plan.md`: CDS 현황 보고용 PPT 제작 계획입니다.
- `plan/cds-status-report-slide-deck.md`: 발표 슬라이드 구성을 텍스트로 정리한 자료입니다.

## 폴더 구조

```text
.
├── interview-script/     # 사용자, 파트리드, 팀리드 인터뷰 회의록과 질문지
├── template/             # 역할별 인터뷰 질문 템플릿
├── report/               # 공유용 보고서, Figma 데이터, 분석 문서 묶음
│   └── analysis-docs/    # 1차 분석, deep-dive, 리더십 후속 분석
├── final-report/         # 최종 현황 리포트
├── plan/                 # 발표 자료 제작 계획과 슬라이드 구성안
└── scripts/              # Figma API 기반 보조 분석 스크립트
```

루트의 `CDS 사용자 인터뷰 - HoD - 2026_05_28 17_06 KST - Gemini가 작성한 회의록.md`는 HoD 인터뷰 회의록입니다.

## 자료 흐름

1. `template/`의 질문지를 바탕으로 역할별 인터뷰를 진행합니다.
2. `interview-script/`와 루트의 HoD 회의록에 인터뷰 원문을 보관합니다.
3. `report/`에서 1차 분석, 역할별 분석, deep-dive, Figma 사용 데이터 보조 분석을 작성합니다.
4. `final-report/`에서 최종 현황 리포트로 통합합니다.
5. `plan/`에서 보고서 내용을 발표 자료로 변환하기 위한 구조를 설계합니다.

## 분석 기준

- 사용자 인터뷰 정량 집계는 실무자 8명, 파트리드 3명, 팀리드 2명, 총 13명을 기준으로 합니다.
- HoD 인터뷰는 정량 집계에 포함하지 않고 리더십 맥락 보강 자료로 분리해 읽습니다.
- 최종 현황 리포트는 `interview-script/` 내부 문서를 SoT(Source of Truth)로 삼습니다.
- 특정 개인이나 팀의 준수 여부를 평가하기보다, 업무 맥락, 판단 기준, 예외 처리 방식, 조직 운영 구조를 파악하는 데 초점을 둡니다.
- 개인정보 보호를 위해 공유용/최종 리포트 본문에서는 인터뷰이 실명 대신 익명 ID를 사용합니다.

## Figma 데이터 보조 분석

`scripts/figma-library-detach-top10.mjs`는 Figma Library Analytics API에서 컴포넌트 detach 데이터를 가져와 CSV와 Markdown 요약을 생성하는 스크립트입니다.

필수 환경 변수:

```sh
FIGMA_TOKEN=...
```

기본 실행:

```sh
FIGMA_TOKEN=... node scripts/figma-library-detach-top10.mjs
```

주요 옵션:

- `--library-file-key <key>`: 분석할 Figma 라이브러리 파일 키
- `--start-date <YYYY-MM-DD>`: 분석 시작일
- `--end-date <YYYY-MM-DD>`: 분석 종료일
- `--limit <number>`: 출력할 상위 컴포넌트 수
- `--output <path>`: CSV 출력 경로
- `--all-components`: 이름에 `💠`가 없는 컴포넌트까지 포함
- `--variant-level`: 컴포넌트 세트로 묶지 않고 variant 단위로 집계
- `--json`: Markdown 대신 JSON 출력

기본 출력 파일은 `report/figma-cds-detach-top10.csv`입니다.

## CSV 자료

`report/`에는 Figma 기반 정량 보조 자료가 포함되어 있습니다.

- `figma-cds-usage-audit.csv`: 대표 Figma 파일별 CDS 사용률 측정 자료
- `figma-cds-detach-top10.csv`: 기본 기간 기준 detach 상위 컴포넌트
- `figma-cds-detach-top10-1y.csv`: 1년 기간 기준 detach 상위 컴포넌트
- `slack-figma-link-duplicates.csv`: Slack/Figma 링크 중복 관련 보조 자료

CSV는 인터뷰 분석을 대체하는 자료가 아니라, 인터뷰에서 확인된 사용/예외/디태치 맥락을 보강하는 참고 자료로 봅니다.

## 작성 및 관리 원칙

- 인터뷰 원문과 파생 리포트를 구분해서 관리합니다.
- 수치를 사용할 때는 표본 범위와 HoD 포함 여부를 명확히 적습니다.
- 공유용 문서에서는 실명, 민감한 조직 정보, 원문 인용 범위를 신중하게 다룹니다.
- 새로운 분석 문서는 가능하면 `report/`에 두고, 최종본만 `final-report/`로 이동합니다.
- 발표 자료로 변환하기 전에는 `plan/`에 구조와 메시지 흐름을 먼저 정리합니다.

## 참고

현재 폴더에는 `package.json`이 없으므로 별도의 의존성 설치 절차는 정의되어 있지 않습니다. Figma 분석 스크립트는 Node.js 런타임과 내장 `fetch`를 사용하므로 Node.js 18 이상 환경에서 실행하는 것을 권장합니다.
