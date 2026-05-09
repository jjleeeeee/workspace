# wf-figma-component-spec.md v0.3 업데이트 — markitdown 통합

## Context

markitdown과 MCP(Framelink + figma_execute)는 보완 관계다.
- **MCP**: 컴포넌트 노드 구조 → token binding, variant, layout (구조 데이터)
- **markitdown**: Figma 스펙 프레임 → 크기 테이블, gradient 상세, 구현 주의사항 (스펙 문서 데이터)

MCP는 컴포넌트 Set 노드만 읽는다. 스펙 프레임의 표는 Figma에서 Auto Layout 중첩으로 표현되며 공간 배치에 의미가 담겨 있어 MCP로 구조 복원이 불가능하다. markitdown은 PDF rendering을 거쳐 레이아웃 좌표로 표를 복원하므로 이 역할에 적합하다.

**대상 파일:** `design-cds-docs/98_workflow/wf-figma-component-spec.md` (현재 v0.2)
**markitdown 파일 위치:** `design-cds-docs/99_ref/ref-markitdown-output/<component>.md`

---

## 변경 항목 (6개)

### 1. frontmatter — version 0.2 → 0.3

### 2. Section 3 (입력/산출물) — markitdown 선택적 입력 행 추가

```
| 입력 (선택) | `design-cds-docs/99_ref/ref-markitdown-output/<component>.md` | 스펙 프레임 데이터. 복합 컴포넌트에서 크기 테이블, gradient, 구현 주의사항 보충. 없으면 skip. |
```

### 3. Section 6 (전체 흐름) — Step 2.5 추가

```
2.5. (복합 컴포넌트) markitdown 파일이 있으면 읽어서 스펙 데이터를 보충한다.
```

### 4. Section 7 — Step 2.5 신규 추가 (Step 2 결과물 뒤, Step 3 앞)

내용:
- **목표**: markitdown 파일에서 MCP로 추출 불가능한 스펙 데이터를 읽는다.
- **조건**: `design-cds-docs/99_ref/ref-markitdown-output/<component>.md` 존재 시에만 실행
- **추출 대상**:
  - 크기 테이블 (서브 요소별 size group 값: Ring stroke/gap, Badge_Dot, Emoji 등)
  - Gradient paint 상세 (stop 좌표, style 이름)
  - 구현 주의사항 텍스트
- **판단 기준**:
  - markitdown 내용이 Framelink 추출값과 충돌하면 figma_execute 결과 우선
  - markitdown에만 있는 데이터는 `spec_notes`에 기록
  - markitdown 파일이 없으면 이 step을 skip하고 Step 3으로 진행

### 5. Step 4 YAML 스키마 — `spec_notes` 블록 추가

`rules` 뒤에 선택적으로 추가:

```yaml
spec_notes:                        # 복합 컴포넌트에서 markitdown으로 보충된 스펙 데이터
  <sub_element>:
    size_table:
      <size_group>: { <key>: <value> }
  <gradient_key>:
    type: "gradient"
    style_name: "<figma_paint_style_name>"
    stops:
      - { pos: "<n%>", token: "<system/color/...>" }
  implementation:
    - "<구현 주의사항>"
```

### 6. Step 5 .md 파일 구조 — Spec Notes 섹션 추가 (조건부)

```md
## 6. Spec Notes   ← spec_notes가 있을 때만 추가
```

Section 8 판단 기준 우선순위에 markitdown 추가:
```
1. 사용자 제공 Do/Don't 규칙
2. Figma 컴포넌트 실제 데이터 (Framelink + figma_execute)
3. markitdown 스펙 프레임 데이터 (spec_notes 보충)   ← 신규
4. 기존 .md 파일의 rules 섹션 (싱크 시 보존)
5. 기존 repo 패턴
6. LLM 추론
```

Section 12 체크리스트에 항목 추가:
```
- [ ] markitdown 파일 존재 여부 확인 (있으면 Step 2.5 실행, 없으면 skip)
- [ ] spec_notes 포함 여부 확인 (복합 컴포넌트에만 해당)
```

---

## 수정하지 않는 것

- Section 7의 Step 1, 2, 3, 4, 5 본문 (이미 v0.2에서 업데이트 완료)
- Section 9 예외 대응 (이미 v0.2에서 업데이트 완료)
- YAML 스키마의 기존 블록 (component, axes, variants, props, tokens, layout, rules)

---

## 검증

```bash
grep -n "markitdown\|spec_notes\|2\.5\|Spec Notes" \
  design-cds-docs/98_workflow/wf-figma-component-spec.md

git diff -- design-cds-docs/98_workflow/wf-figma-component-spec.md
```
