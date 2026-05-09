# 08. Codex 플러그인 활용 워크플로우 시뮬레이션

**날짜:** 2026-04-26  
**목적:** Avatar 컴포넌트 추출을 예시로 Claude + Codex 플러그인 분업 워크플로우 정의

---

## 배경

컴포넌트 추출 작업에서 Claude가 모든 단계를 혼자 처리하는 것은 비효율적이다. 특히 Contract 섹션의 반복 구조(Props 테이블, Token Mapping, Size 테이블 등)는 패턴이 명확하므로 Codex에 위임하면:

- 병렬 처리로 속도 향상
- 수동 오타 방지
- Claude는 판단이 필요한 Stitch 영역에 집중 가능

Codex 환경: `gpt-5.5` 모델, `medium` effort (`~/.codex/config.toml` 기준)

---

## 워크플로우

```
[1] Claude: Figma에서 raw 데이터 추출
      ↓
[2] Claude: 데이터 분석 + Stitch/Contract 초안 작성
      ↓
[3] Codex: 반복 구조 섹션 병렬 생성 (위임)
      ↓
[4] Claude: 결과 병합 + 품질 검토
      ↓
[5] Claude: 하네스 검증 실행
      ↓
[6] Codex: 하네스 실패 시 픽스 위임 (필요한 경우)
```

---

## 단계별 상세

### Step 1 — Claude: Figma 데이터 추출

MCP 도구 접근이 필요하므로 Claude가 직접 수행:

```
Framelink MCP : get_figma_data(fileKey, nodeId)   → 노드 트리, 레이아웃
figma-console : analyze_component_set(nodeId)      → 축, 변형 목록, props
Figma REST    : /v1/files/{key}/components         → 변형 독립 검증
```

결과물: `harness/fixtures/avatar/variants.json`, `tokens.json`

### Step 2 — Claude: 분석 + MD 초안

판단이 필요하므로 Claude가 직접 수행:

- 변형 축 파악 (Mode × Type × Size → 44개)
- Usage Rules 해석 (Type/Size 혼용 금지 등)
- TEMPLATE.md 구조에 따라 Stitch 섹션 1~8 초안 작성
- Contract 섹션 9 사실값 추출

→ **Codex 위임 분기점:** Props 테이블, Token Mapping, Layout Contract 등 반복 구조는 Codex로 넘김

### Step 3 — Codex: 반복 구조 섹션 생성

Claude Code 내에서:

```
/codex:rescue "fixtures/avatar/variants.json과 tokens.json을 읽고
components/TEMPLATE.md의 Contract 섹션 형식에 맞춰
Avatar의 Props 테이블, Token Mapping, Layout Contract,
State Matrix를 작성해줘.
기존 components/checkbox.md의 Contract 섹션을 참고 형식으로 사용."
```

또는 CLI에서 직접:

```bash
codex --approval-mode full-auto "[위임 내용]"
```

**Codex가 적합한 이유:**
- 정제된 JSON → MD 테이블 변환은 패턴이 명확
- 토큰 11개 매핑, 사이즈 픽셀값 등 실수 가능성 있는 반복 작업
- 백그라운드 실행 → Claude가 다른 컴포넌트 동시 처리 가능

### Step 4 — Claude: 병합 + 검토

- Codex 결과 + Claude 초안 병합
- Stitch 영역 품질 검토 (의미/맥락 판단)
- Contract 사실값 재확인
- `components/avatar.md` 저장

### Step 5 — Claude: 하네스 검증

```bash
bash harness/eval.sh components/avatar.md
```

목표: 6/6 PASS, 100/100

### Step 6 — Codex: 실패 항목 픽스 (필요 시)

```
/codex:rescue "harness/eval.sh 결과에서 실패한 항목:
[실패 내용 붙여넣기]
components/avatar.md의 해당 Contract 섹션을 수정해줘"
```

---

## 분업 원칙

| 작업 | 담당 | 이유 |
|------|------|------|
| Figma MCP 호출 | Claude | 도구 접근 권한 필요 |
| 사용 맥락 해석 | Claude | 의미 판단 필요 |
| Do/Don't 작성 | Claude | 디자인 의도 이해 필요 |
| JSON → MD 테이블 변환 | Codex | 패턴 명확, 반복 작업 |
| 토큰/픽셀값 매핑 | Codex | 오타 방지, 대량 처리 |
| 하네스 실패 픽스 | Codex | 에러 메시지 기반 수정 |
| 최종 품질 검토 | Claude | 맥락/의미 판단 필요 |
