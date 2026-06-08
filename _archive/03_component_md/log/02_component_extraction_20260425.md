# 컴포넌트 MD 추출 프로세스 로그

**날짜:** 2026-04-25  
**업데이트:** 2026-04-26  
**대상:** Chord Design System (Figma)  
**fileKey:** `DWEduE6GfxYMlyxKPNJ8jA`

---

## 현재 산출물

| 컴포넌트 | 노드 ID | 출력 파일 | 검증 결과 |
|---|---|---|---|
| Avatar | `62973:5571` | `components/avatar.md` | SCORE 100/100 |
| Badge | `11859:104160` | `components/badge.md` | SCORE 100/100 |
| Button | `52753:23657` | `components/button.md` | SCORE 100/100 |

각 문서는 Stitch식 설명과 `Implementation Contract`를 함께 가진 canonical 컴포넌트 MD다.

---

## 사용 도구

| 도구 | 용도 |
|---|---|
| Framelink Figma MCP | Figma 노드 데이터 전체 추출 |
| figma-console MCP | 디자인 변수 값 조회 / 컴포넌트 세트 분석 |
| Figma REST API | `/v1/files/{key}/components` 독립 소스 교차 검증 |
| Python3 / Bash | 대용량 데이터 파싱 및 fixture 생성 보조 |

---

## 공통 추출 흐름

1. Figma URL에서 `fileKey`와 `nodeId`를 파싱한다.
2. Framelink로 target node tree를 추출한다.
3. figma-console로 component set axes, variants, componentProps를 확인한다.
4. Figma variables 또는 design context에서 token source를 확인한다.
5. Figma REST API로 `variants_rest.json`을 만들어 독립 교차 검증한다.
6. `components/{name}.md`를 Stitch식 설명 + Implementation Contract로 작성한다.
7. `bash harness/eval.sh components/{name}.md`를 실행해 검증한다.

---

## Avatar 추출 핵심

- Mode: `Default`, `Fixed`
- Type: `Circle`, `Squircle`
- Size: `Tiny`부터 `XXXXLarge`까지 11단계
- componentProps: `Emoji`, `Birthday_Hat`, `Ring`, `Badge_Dot`, `Host`
- Usage source에서 타입/사이즈 혼용 금지와 콘텐츠 성격 기반 타입 선택 규칙을 추가했다.

---

## Badge 추출 핵심

- Dot Badge: Mode × Size × Outline
- Number Badge: Mode × Type, `Label` TEXT prop
- 핵심 제약: Number label은 `+` 포함 4자 이내
- Dot size와 Number height/min-width를 `sizes.json`과 contract에 반영했다.

---

## Button 추출 핵심

- Mode: `Default`, `Fixed`
- Type: `Filled`, `Outlined`, `Outlined_color`, `Outlined_gray`, `Ghost`
- Size: `XXSmall(24)`부터 `XLarge(52)`까지 6단계
- Button Color: `Default`, `Black`
- Status: `Default`, `Hover`, `Disabled`, `Loading`
- Radius: `on`, `off`
- Usage source에서 하단 CTA, 2-button primary 위치, 3-button vertical layout, disabled 조건을 추가했다.

---

## 발생한 이슈 및 해결

| 이슈 | 원인 | 해결 |
|---|---|---|
| Framelink 403 에러 | 초기 토큰 권한 없음 | 토큰 설정 확인 후 세션 재시작 |
| 데이터 1MB 초과 | 노드 트리 전체 포함 | Python 파싱으로 필요 부분만 추출 |
| `\b` 이스케이프 문자 포함 | Figma 내부 포맷 | `.replace('\x08', '')` 처리 |
| sizes 자동 파싱 오류 | 중첩 YAML 구조로 잘못된 px값 추출 | 수동 검증 후 `sizes.json` 작성 |
| REST API 컴포넌트 필터 실패 | `containing_frame.nodeId` 기준 0건 반환 | `node_id.startswith('{prefix}:')` 기준으로 변경 |
| REST size 값 손상 | 괄호 제거 정규식이 `XLarge(52)`의 px값 제거 | 한글 포함 괄호만 제거하도록 정규식 변경 |
| Button Color 일부 REST 미노출 | REST API가 미공개 variants를 반환하지 않음 | `check_sources.py`를 REST subset 비교로 유지 |
| `XLarge(52)` size 검사 실패 | 정규식에서 괄호가 group으로 해석됨 | `check_sizes.py`에서 `re.escape(size)` 적용 |

---

## 현재 출력 구조

```text
03_component_md/
├── DESIGN.md
├── components/
│   ├── avatar.md
│   ├── badge.md
│   ├── button.md
│   └── icons.md
├── harness/
│   ├── eval.sh
│   ├── criteria.md
│   ├── fixtures/{avatar,badge,button}/
│   └── tests/
└── skills/
    └── component-md-extract/
```

---

## 검증 명령

```bash
bash harness/eval.sh components/avatar.md
bash harness/eval.sh components/badge.md
bash harness/eval.sh components/button.md
```

---

## 다음 컴포넌트 추출 시 참고

추천안은 `component-md-extract` 스킬을 사용해 Figma URL → fresh source extraction → canonical MD 작성 → fixture 생성 → harness loop 순서로 실행하는 것이다. 트레이드오프는 초안 작성 전에 기존 문서를 참고하지 않기 때문에 추출 시간이 조금 늘 수 있다. 대안은 기존 문서를 먼저 복사해 수정하는 방식인데, 이전 구조의 한계를 반복할 가능성이 크다.
