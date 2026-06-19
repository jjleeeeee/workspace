# AI Persona × Figma Prototype Walk

## Context
글로벌홈/커뮤니티 동선 개선 프로토타입(`7tuvMuw9gk20QnyHo0iu2e`, start `35:75221`)을 AI 퍼소나가 "걸어보며" 사용성 마찰점을 뽑아내는 파이프라인을 구축한다. Playwright 자동조작은 ① 로그인 게이트 ② canvas 비-DOM hotspot 두 가지 이유로 비용 대비 효과 낮음. 대신 **Figma 메타데이터로 prototype flow graph를 정적 추출 → 각 노드에서 퍼소나 LLM이 hotspot 선택**하는 graph-traversal 방식이 사용성 검증에 더 적합.

기존 `07_ai-persona`에 퍼소나 카드 3종과 judge rubric(`evaluation/judge.md`)은 있으나 멀티스텝 walk 코드/스키마는 없음 → 본 작업이 빈 구멍을 메움. 퍼소나 카드는 `12_usability-review/personas/`에 복사하여 본 작업에서 독립 소유.

## 전체 파이프라인

```
[1] Figma MCP → flow graph JSON      (frames + hotspot edges)
[2] Figma MCP → frame PNG per node   (이미지 캐시)
[3] Persona walker (LLM 루프)        (이미지 + hotspot 옵션 → 선택)
[4] Walk transcript JSON              (turn-by-turn 기록)
[5] Judge LLM                         (rubric 적용 → 점수 + 마찰점)
```

## 단계별 설계

### [1] Flow graph 추출
- 도구: `mcp__Framelink_Figma_MCP__get_figma_data` (fileKey, startNode `35:75221`, depth 충분히)
- 파싱 타겟: 각 frame node의 `prototypeInteractions[]` → `{trigger, action.destinationId, action.transition}`
- 출력 스키마 (`flow.json`):
  ```json
  {
    "startNodeId": "35:75221",
    "nodes": {
      "35:75221": {
        "name": "글로벌홈",
        "imageRef": "frames/35-75221.png",
        "hotspots": [
          {"id":"35:75301","label":"커뮤니티 탭","bbox":[x,y,w,h],"target":"35:79132"}
        ]
      }
    }
  }
  ```
- hotspot label은 hotspot 자식 텍스트 노드 또는 인접 텍스트로 휴리스틱 추출. 라벨 없으면 `bbox` 위치 기반 ("상단 중앙 버튼") 폴백.

### [2] 프레임 이미지 렌더
- 도구: `mcp__Framelink_Figma_MCP__download_figma_images` — 노드 ID 리스트 일괄, PNG.
- 저장: `frames/{nodeId}.png`. flow.json의 `imageRef`와 매칭.

### [3] Persona walker
- 입력: 퍼소나 MD 1개 + flow.json + 시나리오 목표
- 루프 의사코드:
  ```
  state = {current: startNodeId, history: [], goal: scenario.goal}
  while not done and turn < MAX_TURNS:
    node = flow.nodes[state.current]
    prompt = persona_md + walk_instructions(node.image, node.hotspots, state.history, state.goal)
    response = LLM(prompt)  # claude default
    parsed = {choice_id, reasoning, emotion, confusion_level}
    if parsed.choice_id == "GIVE_UP":
      log_friction("이탈"); break
    if parsed.choice_id not in node.hotspots:
      log_friction("기대 hotspot 없음", parsed.reasoning); break
    state.history.append(turn_record)
    state.current = node.hotspots[parsed.choice_id].target
  ```
- 퍼소나 카드는 system 영역에 그대로, walk 지시문만 추가:
  > "현재 화면 이미지와 누를 수 있는 hotspot 목록이 주어집니다. 당신의 페르소나 관점에서 다음 행동을 선택하세요. 출력은 JSON: `{choice_id, reasoning, emotion, confusion_level:1-5}`. hotspot 중 적절한 게 없으면 `choice_id:'GIVE_UP'`."
- 퍼소나 카드의 "AI임을 밝히지 말 것 / 창작 금지" 규칙(`japanese-yuki-20s.md:46-57`)은 그대로 살림 → hotspot 라벨이 모호하면 솔직히 "헷갈림" 표기.

### [4] Walk transcript
- 출력 위치: `12_usability-review/transcripts/proto-walk/{persona}-{scenario}-{date}.json`
- 스키마:
  ```json
  {
    "meta": {"persona":"yuki","scenario":"...","fileKey":"7tuv...","date":"2026-06-18"},
    "turns": [{"turn":1,"frame":"35:75221","choice_id":"...","reasoning":"...","emotion":"기대","confusion_level":2}],
    "outcome": {"reached_goal": true, "frictions": [{"turn":3,"type":"label_unclear","note":"..."}]}
  }
  ```

### [5] Judge 확장
- 기존 `evaluation/judge.md` rubric R1-R6 재사용 + walk 전용 axis 추가:
  - **W1 동선 적합성**: 퍼소나가 목표 도달했나
  - **W2 hotspot 발견성**: 매 턴 confusion_level 평균
  - **W3 dead-end 노출**: 라벨 없는/연결 안 된 hotspot 만났나
- judge 입력: walk transcript JSON + 퍼소나 카드 + 시나리오 목표.

## 영향 파일 (신규)

작업 폴더: `/Users/jj.iee/Desktop/workspace/private-folder/12_usability-review/` (이하 `12_/`)

- `12_/proto-walk/extract-flow.md` — Claude CLI에 줄 프롬프트(파이프라인 [1] 실행 가이드, MCP 호출법 명시)
- `12_/proto-walk/walker.md` — walker 루프 프롬프트 템플릿 (파이프라인 [3])
- `12_/proto-walk/schema.json` — flow.json / transcript.json JSON Schema
- `12_/proto-walk/flow.json`, `12_/proto-walk/frames/{nodeId}.png` — 추출 산출물
- `12_/scenarios/proto-walk-global-home-community-search-v1.md` — 첫 시나리오
- `12_/evaluation/judge-walk.md` — judge 확장본 (R1-R6 + W1-W3)
- `12_/transcripts/proto-walk/` — walk 결과 저장 폴더
- `12_/transcripts/proto-walk/_compare-v1.md` — 퍼소나 3명 비교 표

`07_ai-persona/` 기존 파일은 수정·이동 X. 퍼소나 카드만 `12_/personas/`로 복사 완료.

## 재사용 자산

- `12_/personas/japanese-yuki-20s.md`, `japanese-satomi-40s.md`, `korean-yuna.md` — system 프롬프트 (07_에서 복사됨).
- `12_/evaluation/judge.md` — R1-R6 rubric base (07_에서 복사됨). `judge-walk.md`가 W1-W3 추가.
- `12_/scenarios/_template.md` — 시나리오 포맷 base (07_에서 복사됨). walk 전용 hotspot 섹션 추가하여 v1 파생.
- `07_ai-persona/HOW-TO-USE.md:91-97` Claude CLI concat 패턴 — walker 실행도 동일하게 `cat persona.md walker.md flow.json | claude` 형태.
- Figma MCP 3종 — REST 토큰 불필요.

## 확정 사항

- **시나리오 목표 (v1)**: "글로벌 홈 → 커뮤니티 목록 검색 → 커뮤니티 진입". 3단 동선이라 hotspot 발견성·검색 입력·결과 클릭 3가지 마찰 지점 동시 검증 가능.
- **퍼소나 3명**:
  - `japanese-yuki-20s.md` (디지털 능숙·직설)
  - `japanese-satomi-40s.md` (신중·세부 확인)
  - `korean-yuna.md` (한국어 원어민 — UI 언어 매칭 베이스라인)
- 시나리오 파일: `12_/scenarios/proto-walk-global-home-community-search-v1.md`
- 결과 비교 표: 퍼소나 3명 × walk 1회 → `12_/transcripts/proto-walk/_compare-v1.md` 에 turn 수·도달 여부·마찰점 횟수 옆에 나란히.

## 검증 방법 (end-to-end)

1. **[1] 단독 검증**: `flow.json` 생성 후 노드 개수·edge 개수 수동 확인. startNode부터 BFS로 도달 가능 노드가 전체와 일치하는지(고립 노드 없는지) 체크.
2. **[2] 단독 검증**: 무작위 3개 프레임 PNG 열어 화면 일치 확인.
3. **[3] 미니 walk**: 퍼소나 1명(yuki) + 짧은 시나리오 1회 실행. turn 5 이내로 끝나는지, transcript JSON 스키마 유효한지.
4. **[5] judge 1회 적용**: 미니 walk 결과를 judge-walk에 넣어 점수·rationale 정상 출력 확인.
5. **풀 walk**: 퍼소나 3명 × 시나리오 1개. 마찰점 리스트가 사람이 보기에 납득되는지 직접 검토.

## TL;DR
- 결론: Playwright 대신 **Figma MCP로 flow graph 정적 추출 → 퍼소나 LLM이 graph traversal**.
- 다음 행동: [1][2] 추출 1회 돌려 flow.json + frame PNG 확보 → 미니 walk.
- 추천: **MCP graph + 퍼소나 walker + judge 확장**. 대안: 프레임 이미지만 순차 보여주는 패시브 리뷰(traversal 없음, 마찰점 탐지력 약함).
