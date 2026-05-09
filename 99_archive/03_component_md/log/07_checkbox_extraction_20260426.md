# CheckBox 컴포넌트 MD 추출 로그

**날짜:** 2026-04-26
**대상:** Chord Design System — CheckBox (`[V2] Checkbox`)
**결과:** SCORE 100/100 (6/6 PASS)

---

## 입력 소스

| 소스 | URL | Node |
|---|---|---|
| Component Figma | `DWEduE6GfxYMlyxKPNJ8jA` (Chord Design System) | `60365:40258` (문서 프레임) / `60365:40276` (컴포넌트 세트) |
| Usage Figma | `6pHGdaJh3L8Z1Ew8AxIV85` (Chord_Usage) | `819:36201` |

---

## 추출 핵심

- **Mode**: `Default`, `Fixed`
- **Type**: `Circle` (기본), `Square` (List Item 전용, deprecated)
- **Status**: `Default` (미선택), `Enabled` (선택됨), `Disabled`
- **크기**: 24×24px 단일 (Inner box 22×22px, stroke 1px inside)
- **체크박스 ↔ 텍스트 gap**: 6px
- **Square border-radius**: `system/size/radius/box/75` = 6px
- **Circle**: ELLIPSE (full round)
- **Variant count**: 12 (Mode 2 × Type 2 × Status 3)

### Usage에서 추가된 규칙

- `Circle`이 표준 타입. `Square`는 추후 Figma에서 삭제 예정 — 신규 화면에서 사용 금지.
- `Default` 상태에 회색 체크 아이콘을 넣는 V1 스타일 사용 금지.
- 터치 및 클릭 영역은 체크박스 + 텍스트 전체 영역으로 설정 (체크박스 단독 금지).
- 상위 체크박스 상태 변경은 모든 하위 항목에 즉시 반영.
- 하위 항목 계층 표시 시 `ic_check_xsmall` (16px) 사용.

---

## 토큰 매핑

| Role | Token (Default) | Token (Fixed) |
|---|---|---|
| Enabled fill | `system/color/roles/primary` | `system/fixed_color/roles/primary` |
| Default & Disabled stroke | `system/color/outline/default-200a` | `system/fixed_color/outline/default-200a` |
| Disabled fill | `system/color/surface/default-reverse-100a` | `system/fixed_color/surface/default-reverse-100a` |
| Check icon (Enabled) | `system/color/icon/default-reverse` | `system/fixed_color/icon/default-reverse` |
| Check icon (Disabled) | `system/color/icon/200a` | `system/fixed_color/icon/200a` |
| Square radius | `system/size/radius/box/75` (6px) | — |

토큰은 `figma/variables/local` REST API로 VariableID를 직접 해석해 추출했다.

---

## 발생한 이슈 및 해결

| 이슈 | 원인 | 해결 |
|---|---|---|
| Desktop Bridge 미연결 | figma-console MCP가 Desktop Bridge 없이는 `figma_analyze_component_set` 실행 불가 | 사용자가 Bridge 재실행 후 재시도. 그 전까지는 REST API로 variant 추출 |
| `tokens.json` 구조 오류 | `{ "source": ..., "fileKey": ..., "tokens": [...] }` 형태로 작성 → 하네스가 최상위 key를 토큰 이름으로 해석 | 토큰 이름을 최상위 key로 변경: `{ "system/color/...": { "type": ... } }` |
| 노드 데이터 파싱 오류 | heredoc Python 방식에서 JSON 데이터가 표준 입력에 직접 주입되어 파싱 실패 | `/tmp/` 파일로 저장 후 `json.load(open(…))` 패턴으로 변경 |

---

## TEMPLATE.md 검증

이번 추출에서 `TEMPLATE.md` 9개 섹션 구조를 처음 실사용했다. 섹션 누락 없이 모두 채워졌으며, 별도 섹션 추가 없이 기존 템플릿으로 CheckBox를 완전히 표현할 수 있었다.

→ **TEMPLATE.md 업데이트 없음** (30% 룰 해당 패턴 없음)

---

## 최종 검증 결과

```
bash harness/eval.sh components/checkbox.md
```

| Check | Score |
|---|---|
| design_sections | 9/9 |
| agent_guidance | 5/5 |
| contract_scope | 5/5 |
| variants | 7/7 |
| tokens | 11/11 |
| sources | 10/10 |
| **SCORE** | **100/100 PASS** |

---

## 출력 파일

```
03_component_md/
├── components/
│   └── checkbox.md
└── harness/fixtures/checkbox/
    ├── variants.json       (figma-console/analyze_component_set)
    ├── variants_rest.json  (Figma REST API)
    └── tokens.json         (Figma variables/local)
```
