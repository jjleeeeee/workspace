# 워크플로우 — AI Persona Prototype Walk

> Figma 프로토타입을 AI 퍼소나가 graph traversal로 "걸어보며" 사용성 마찰점을 측정하는 파이프라인.
> 이 문서 = "어떻게 돌리나" 가이드. 도메인 배경은 `backgrounds/`, 시나리오는 `scenarios/`, 채점 기준은 `evaluation/`.

---

## 0. 폴더 구조

```
12_usability-review/
├ WORKFLOW.md                     ← 이 문서
├ backgrounds/                    ← 프로젝트별 배경·페인포인트·가설
│   └ YYMMDD_<topic>.md
├ personas/                       ← 페르소나 카드 (system prompt)
│   ├ japanese-yuki-20s.md
│   ├ japanese-satomi-40s.md
│   └ korean-yuna.md
├ scenarios/                      ← walk 시나리오 + W축(시나리오 전용 평가축)
│   ├ _template.md
│   └ proto-walk-<topic>-v1.md
├ evaluation/                     ← 공통 평가 자산 (수정 X)
│   ├ rubric-v0.md                R1-R6 정의 (공통)
│   ├ judge.md                    judge 프롬프트 (공통)
│   └ scores/                     채점 결과 (walk 후 생성)
├ proto-walk/                     ← walk 산출물 (스크립트·캐시)
│   ├ raw-<fileKey>.json          REST 덤프 1회 캐시 (600MB+)
│   ├ flow-<version>.json         BFS 추출된 도달가능 그래프
│   └ frames/<nodeId>.png         프레임 이미지
├ transcripts/proto-walk/         ← walk 결과 (turn-by-turn JSON)
├ assets/                         ← 원본 자료 (영상·스크린샷·doc01-2)
└ plans/                          ← 작업 플랜
```

---

## 1. 전제 조건

- **Figma 토큰**: `workspace/.env`의 `FIGMA_TOKEN`. 파일 접근 권한 필요.
- **Claude CLI**: `claude` 명령 사용 가능.
- **Python 3**: REST 응답 파싱·BFS용.
- (선택) `jq`: JSON 정리.

---

## 2. 파이프라인 (5단계)

```
[1] 배경 + 가설 정리       backgrounds/YYMMDD_*.md
[2] 시나리오 + W축 정의     scenarios/proto-walk-*.md
[3] Figma 그래프 추출       proto-walk/flow-*.json + frames/*.png
[4] Persona walker 실행     transcripts/proto-walk/*.json
[5] Judge 채점              evaluation/scores/*.json
```

### [1] 배경 + 가설 정리

**산출물**: `backgrounds/YYMMDD_<topic>.md`

필수 섹션:
1. 한 줄 요약
2. 타임라인
3. 핵심 페인포인트 (유저 피드백 출처 명시)
4. 개선 방향
5. 프로토타입 확보 상태 (AS-IS 시작 노드 + TO-BE 시작 노드)
6. 시나리오 v1 개요 (목표·출발·도착)
7. 퍼소나 선정 근거
8. **가설**
   - H0 (디자인 가설, 검증 대상)
   - H1~Hn (walk 측정 가설)
9. 작업 범위 (in/out)
10. TL;DR

### [2] 시나리오 + W축 정의

**산출물**: `scenarios/proto-walk-<topic>-v<n>.md`

필수 섹션:
1. 메타 (시나리오 ID, 시작 노드, 퍼소나 리스트)
2. Walk 목표 (출발 → 도착 frame ID)
3. 가설 (배경에서 import)
4. **W축 정의** (이 시나리오 전용 평가축, 1~5점)
   - W1: 동선 적합성
   - W2: 발견성
   - W3: 잔존 마찰
   - (필요시 추가)
5. Walker 실행 지시 (명령어)
6. Judge 실행 지시 (명령어)
7. 실행 기록 표 (walk 후 채움)
8. 가설 검증 표 (전체 walk 후 채움)

**원칙**: R1-R6 = 공통(`evaluation/rubric-v0.md`), W축 = 시나리오 전용.

### [3] Figma 그래프 추출

#### 3-1. 원본 파일 덤프 (1회)

```bash
source /Users/jj.iee/Desktop/workspace/.env
curl -s -H "X-Figma-Token: $FIGMA_TOKEN" \
  "https://api.figma.com/v1/files/<fileKey>" \
  > proto-walk/raw-<fileKey>.json
```

#### 3-2. 시작 노드부터 BFS → flow.json

```python
# proto-walk/extract-flow.py (예시 스니펫)
import json
from collections import defaultdict

d = json.load(open('proto-walk/raw-<fileKey>.json'))
doc = d['document']
nodes_by_id = {}
parent_of = {}
def index(n, parent=None):
    nodes_by_id[n['id']] = n
    if parent: parent_of[n['id']] = parent['id']
    for c in n.get('children',[]): index(c, n)
index(doc)

def frame_ancestor(nid):
    cur = nid
    while cur:
        n = nodes_by_id.get(cur)
        if n and n.get('type')=='FRAME' and parent_of.get(cur) and nodes_by_id[parent_of[cur]].get('type') in ('CANVAS','PAGE'):
            return cur
        cur = parent_of.get(cur)
    return nid

edges = []
for nid, n in nodes_by_id.items():
    for it in n.get('interactions',[]):
        trig = it.get('trigger',{}).get('type','?')
        for act in it.get('actions',[]):
            dest = act.get('destinationId')
            if dest:
                edges.append({
                    'from_frame': frame_ancestor(nid),
                    'hotspot_id': nid,
                    'hotspot_name': n.get('name','?'),
                    'bbox': n.get('absoluteBoundingBox'),
                    'trigger': trig,
                    'to': dest,
                })

out = defaultdict(list)
for e in edges: out[e['from_frame']].append(e)

START = '<startNodeId>'
visited = {START}; queue = [START]; order = [START]
while queue:
    cur = queue.pop(0)
    for e in out[cur]:
        if e['to'] not in visited:
            visited.add(e['to']); queue.append(e['to']); order.append(e['to'])

flow = {'startNodeId': START, 'nodes': {}}
for fid in order:
    flow['nodes'][fid] = {
        'name': nodes_by_id[fid].get('name','?'),
        'imageRef': f'frames/{fid.replace(":","-")}.png',
        'hotspots': [
            {'id':e['hotspot_id'],'label':e['hotspot_name'],'bbox':e['bbox'],
             'target':e['to'],'trigger':e['trigger']}
            for e in out[fid] if e['trigger']=='ON_CLICK'
        ],
        'auto_next': [  # AFTER_TIMEOUT 자동 전환
            e['to'] for e in out[fid] if e['trigger']=='AFTER_TIMEOUT'
        ],
    }
json.dump(flow, open('proto-walk/flow-<version>.json','w'), ensure_ascii=False, indent=2)
```

**중요**:
- `ON_CLICK`만 hotspot 선택지로 노출
- `AFTER_TIMEOUT`은 walker가 자동 진행
- `ON_PRESS`는 무시 (시각 효과)
- `_atoms/Leading` 같은 라벨은 휴리스틱 보강 ("상단 좌측 아이콘") 권장

#### 3-3. 프레임 이미지 일괄

```bash
IDS=$(jq -r '.nodes | keys | join(",")' proto-walk/flow-<version>.json)
curl -s -H "X-Figma-Token: $FIGMA_TOKEN" \
  "https://api.figma.com/v1/images/<fileKey>?ids=$IDS&format=png&scale=2" \
  | jq -r '.images | to_entries[] | "\(.key)\t\(.value)"' \
  | while IFS=$'\t' read id url; do
      wget -qO "proto-walk/frames/$(echo $id | tr ':' '-').png" "$url"
    done
```

### [4] Persona walker 실행

**산출물**: `transcripts/proto-walk/<persona>-<version>-<date>.json`

walker는 다음 루프 수행:
```
state = {current: startNode, history: [], goal: scenarioGoal}
while turn < MAX_TURNS:
  node = flow.nodes[state.current]
  # 자동 전환 처리
  while node.auto_next:
    state.current = node.auto_next[0]; node = flow.nodes[state.current]
  # 퍼소나에게 결정 요청
  prompt = persona_md + walk_instruction(node.image, node.hotspots, history, goal)
  resp = LLM(prompt)  # JSON: {choice_id, reasoning, emotion, confusion_level}
  if resp.choice_id == 'GIVE_UP': break
  if resp.choice_id == goal_target: break  # 도달
  state.history.append(turn_record)
  state.current = node.hotspots[resp.choice_id].target
```

실행 명령:
```bash
cat personas/<persona>.md \
    scenarios/proto-walk-<topic>-v1.md \
    proto-walk/walker.md \
    proto-walk/flow-<version>.json \
  | claude > transcripts/proto-walk/<persona>-<version>-<date>.json
```

Transcript 스키마:
```json
{
  "meta": {"persona":"yuki","scenario":"...","version":"as-is","fileKey":"...","date":"2026-06-18"},
  "turns": [
    {"turn":1,"frame":"35:75221","choice_id":"...","reasoning":"...","emotion":"기대","confusion_level":2}
  ],
  "outcome": {
    "reached_goal": true,
    "turns_total": 4,
    "frictions": [{"turn":3,"type":"label_unclear","note":"..."}]
  }
}
```

### [5] Judge 채점

**산출물**: `evaluation/scores/<persona>-<version>-<date>.json`

```bash
cat evaluation/rubric-v0.md \
    scenarios/proto-walk-<topic>-v1.md \
    transcripts/proto-walk/<persona>-<version>-<date>.json \
  | claude --system "당신은 사용성 평가자다. R1-R6(공통, rubric-v0) + W1-W3(시나리오 §3) 모두 채점하라. JSON으로 출력." \
  > evaluation/scores/<persona>-<version>-<date>.json
```

스키마:
```json
{
  "meta": {...},
  "reliability": {
    "R1": {"score": 4, "rationale": "..."},
    "...": "...",
    "R6": {...}
  },
  "walk": {
    "W1": {"score": 5, "rationale": "도달, 우회 0"},
    "W2": {"score": 3, "rationale": "confusion 평균 2.8"},
    "W3": {"score": 4, "rationale": "label_unclear 1건"}
  },
  "summary": "..."
}
```

---

## 3. 가설 검증 (모든 walk 완료 후)

시나리오 §7 가설 검증 표 채움. AS-IS vs TO-BE W점수 평균 비교 = H0 검증 정량 근거.

---

## 4. 다른 프로젝트로 이식할 때

**수정 필요**:
- `backgrounds/` 신규 작성
- `scenarios/` 신규 작성 (W축 재정의)
- Figma fileKey, 시작 노드 변경

**그대로 재사용**:
- `personas/` (도메인 동일하면)
- `evaluation/rubric-v0.md`, `judge.md`
- 본 `WORKFLOW.md` 5단계 구조
- `proto-walk/extract-flow.py` 골격

---

## 5. 알려진 함정

1. **hotspot 라벨이 generic** (`_atoms/Leading`, `Search` 등 컴포넌트 인스턴스명) → 휴리스틱 보강 필요
2. **destination=None interaction** = "BACK" 액션. 별도 처리
3. **overlay 액션** = 모달 누적. walker가 "닫기" 인식 필요
4. **AFTER_TIMEOUT 체인** = 애니메이션 시퀀스. 1턴으로 합쳐서 처리
5. **raw.json 거대** (600MB+) → git 커밋 X (`.gitignore` 등록)

---

## 6. 현재 12_usability-review 진행 상황

| 단계 | 상태 |
|---|---|
| [1] 배경 정리 | ✅ `backgrounds/260618_global-home-community-navigation.md` |
| [2] 시나리오 + W축 | ✅ `scenarios/proto-walk-global-home-community-search-v1.md` |
| [3] AS-IS flow 추출 | 🟡 그래프 BFS 검증 완료 (13 frames), flow.json 미생성 |
| [3] TO-BE 시작 노드 확인 | ❌ TBD |
| [3] frame 이미지 일괄 | ❌ |
| [4] walker.md 작성 | ❌ |
| [4] walk 실행 (퍼소나 3 × 버전 2 = 6회) | ❌ |
| [5] judge 채점 | ❌ |
| 가설 검증 | ❌ |
