# 오케스트레이터

`/figma-to-md` 커맨드가 이 파일을 읽어 전체 실행 흐름을 제어한다.
단계별 세부 절차는 `harness/workflow.md`를 참조한다.

---

## 시작 전: 의존성 확인 + SoT Preflight

```
!python3 servers/setup.py
!python3 scripts/preflight_sot.py
```

둘 다 실패 시 즉시 중단.

---

## fixture.lock 검증 (루프 시작마다 실행)

```
!python3 -c "
import hashlib, json
from pathlib import Path
lock = json.loads(Path('fixture/fixture.lock').read_text())
for f, expected in lock.items():
    actual = hashlib.sha256(Path('fixture/' + f).read_bytes()).hexdigest()
    assert actual == expected, f'fixture 변조 감지: {f}'
print('fixture 검증 통과')
"
```

실패 시 즉시 중단.

---

## 실행 순서

```
Preflight  →  Phase 0.5  →  Phase 0  →  Loop × 최대 5회
```

각 Phase/Step 상세 절차는 `harness/workflow.md` 참조.

### Phase 0.5 조건

`fixture/fixture.meta.json` 이미 존재하면 → Phase 0.5 전체 스킵.

### Phase 0 조건

`fixture/fixture.lock` 이미 존재하면 → Phase 0 전체 스킵.

### 루프 변수

```
N = 1  # 현재 루프 번호 (1~5)
COMPONENT_NAME = <Figma에서 추출한 컴포넌트명 (PascalCase)>
kebab_name = <kebab-case>
```

---

## 루프 제어 흐름

```python
for N in range(1, 6):
    # fixture.lock 검증
    verify_fixture_lock()

    # Step A: design.md 생성/수정
    run_generator(N)

    # Step B: 정적 평가 (25+ 게이트)
    harness_result = run_static_eval(N)

    # Step C: 회귀 확인
    if harness_result["terminate_for_regression"]:
        output_fail_report(N, reason="연속 회귀 감지")
        break

    # Step D: HTML 렌더링 (representative variant 1개만)
    run_renderer(N)

    # Step E: Pixel Diff
    pixel_result = run_pixel_compare(N)

    # Step F: 시각 QA
    qa_result = run_qa(N)

    # Step G: handoff 저장
    save_handoff(N, harness_result, pixel_result, qa_result)

    # Step H: 통과 판정
    if harness_result["all_pass"] and pixel_result["pass"]:
        copy_outputs(N)
        output_pass_report(N)
        break
    elif N == 5:
        output_fail_report(N, reason="5회 루프 초과")
```

---

## 진행 상황 출력 형식

각 루프마다:

```
[loop 1/5] Step B 정적 평가 중...
  ✓ text-coverage
  ✓ variants-registry-matches-source-of-truth
  ✗ token-colors: raw hex 2건
  ✗ tokens-id-resolves: token:system.color.button.black 미존재
  ✗ missing-sections: Asset Notes 누락
[loop 1/5] SSIM: 0.71 (목표: 0.85)
[loop 2/5] fix_hints 반영 중...
```

---

## 정적 게이트 목록 (25개)

| ID | 실패 조건 |
|----|-----------|
| `text-coverage` | Figma TEXT가 body에 없음 |
| `color-coverage` | Figma 색상이 YAML colors에 없음 |
| `typography-coverage` | Figma textStyle이 YAML typography에 없음 |
| `component-coverage` | Figma INSTANCE가 YAML에 없음 |
| `layout-coverage` | auto-layout 노드의 layout axis 미정의 |
| `token-colors` | YAML colors에 raw hex 사용 |
| `token-typography` | typography 항목에 token_fallback 없음 |
| `broken-ref` | `{colors.X}` 등 참조가 YAML에 없음 |
| `missing-sections` | 11개 필수 섹션 누락 |
| `section-order` | 섹션 순서 위반 |
| `variants-registry-matches-source-of-truth` | variants.registry ↔ variant-keys SoT 불일치 |
| `component-identity-matches-index` | frontmatter 식별자 ↔ index.md 불일치 |
| `representative-variant-defined` | representative.variant + node_id 미존재 |
| `fixture-schema-version` | fixture.meta.json schema_version ≠ "v2-representative" |
| `representative-screenshot-matches-spec` | fixture screenshot node_id ≠ spec representative node_id |
| `tokens-id-resolves` | tokens 참조 id가 src/tokens/*.json에 미존재 |
| `tokens-id-has-mode-value` | id가 render_mode에서 값 없음 |
| `tokens-name-not-ambiguous` | {cds: name}이 복수 id에 매핑 |
| `token-catalog-sha256-matches` | src/tokens/*.json sha256 ≠ snapshot 핀 |
| `typography-id-resolves` | typography token_fallback id 미존재 |
| `composition-matches-bridge` | composition.uses ↔ 03 bridge yaml 불일치 |
| `component-keys-sha256-matches` | index.md/variant-keys sha256 ≠ snapshot 핀 |
| `implementation-coverage-fields` | implementation_coverage 필드 비어있음 |
| `rules-non-empty` | rules.do 또는 dont가 비어있음 |
| `composition-uses-blacklist` | composition.uses에 vector/icon_area 등록 |

시각 게이트: SSIM ≥ 0.85 (`servers/pixel_compare.py`)

```
PASS = 정적 all_pass AND pixel_compare.pass (SSIM ≥ 0.85)
```

---

## 오류 처리

| 상황 | 처리 |
|------|------|
| preflight FAIL | 즉시 중단, SoT 파일 git-track 안내 |
| `fixture.lock` 검증 실패 | 즉시 중단, 오류 메시지 출력 |
| `terminate_for_regression: true` | 루프 종료, FAIL 보고서 출력 |
| 5회 루프 후 미통과 | FAIL 보고서 출력 |
| 에이전트 실패 응답 | 해당 루프 중단, 오류 기록 |

---

## 경로 규약 요약

| 항목 | 경로 |
|------|------|
| SoT 토큰 | `src/tokens/tokens.{color,typography,size}.v1.0.json` |
| SoT 컴포넌트 키 | `src/figma-component-keys/index.md` + `variant-keys/<comp>.md` |
| fixture (readonly) | `fixture/` |
| 루프 초안 | `_workspace/drafts/attempt_<N>/<COMPONENT_NAME>.md` |
| 평가 결과 | `_workspace/reviews/attempt_<N>/` |
| handoff | `_workspace/reviews/handoff_<N>.json` |
| 최종 산출물 | `_workspace/outputs/<ComponentName>.md` |
