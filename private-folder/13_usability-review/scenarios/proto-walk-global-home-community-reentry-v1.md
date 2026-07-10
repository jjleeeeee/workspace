# 시나리오2 — 커뮤니티 피드에서 Discover 이탈 후 재진입 (v1)

## 메타

| 항목 | 내용 |
|---|---|
| 시나리오 ID | `proto-walk-global-home-community-reentry-v1` |
| 평가 유형 | Multi-turn prototype walk |
| 배경 문서 | [`backgrounds/260618_global-home-community-navigation.md`](../backgrounds/260618_global-home-community-navigation.md) |
| Figma 파일 | `7tuvMuw9gk20QnyHo0iu2e` (글로벌홈 - 커뮤니티 동선 개선) |
| 시작 노드 (AS-IS) | `35:79132` 커뮤니티_피드탭_하이라이트 |
| 시작 노드 (TO-BE) | TBD |
| 도달 노드 (AS-IS) | `35:75221` Discover (이탈 성공 측정; 재진입은 시나리오1 반복) |
| 평가 퍼소나 | yuki, satomi, yuna |
| 작성일 | 2026-06-18 |

---

## 1. Walk 목표

퍼소나가 커뮤니티 피드에서 Discover로 이탈한 뒤 **다시 동일 커뮤니티 피드로 재진입**한다.

```
GOAL:        TXT 커뮤니티 피드에서 Discover(글로벌홈)로 이탈하라.
             탭 전환 또는 내비게이션으로 Discover 화면에 도달하는 것이 목표.
             (재진입 단계는 시나리오1로 측정; 본 시나리오는 이탈 경로 발견성 측정)
START_FRAME: 35:79132  (커뮤니티_피드탭_하이라이트)
REACH_FRAME: 35:75221  (Discover)
MAX_TURNS:   10
```

> **AS-IS 참고**: flow.json 분석 결과, 35:79132에서 Discover(35:75221)까지 직접 탭이 없음.
> 경로: 35:79132 → [하단 우측 아이콘] → 검색 화면 다수 경유 → [하단 우측 아이콘] → 35:75221.
> 3턴+ 소요 예상. 이 자체가 AS-IS 페인포인트 (H1 기준선).

- **성공**: 동일 커뮤니티 피드 재도달 (세션 유지 확인)
- **부분 성공**: 커뮤니티 진입은 했으나 재검색 필요 (세션 미유지)
- **이탈(실패)**: GIVE_UP 또는 목표 frame 미도달

배경: H0 가설 "탭간 전환 후 즉시 재진입 가능하면 탐색 비용 감소" 직접 검증.

---

## 2. 가설 (배경 §8에서 import)

### H0 (디자인 가설, 검증 대상)
> 커뮤니티 진입 후 탭간 전환이 일어나도 내 커뮤니티로 즉시 재진입(세션 유지)할 수 있다면, 커뮤니티 진입 실패와 반복 탐색 비용이 줄어든다.

### Walk 가설
- **H1 (AS-IS 기준선)**: 재진입 시 confusion_level 평균 ≥ 3, 턴 4+, 시나리오1과 동일한 검색 동선 반복 (세션 미유지)
- **H2 (TO-BE 효과)**: 재진입 턴 ≤ 2, confusion_level 평균 1~2 (즉시 재진입 진입점 노출)
- **H3 (라벨 잔존)**: Discover 화면에서 "내 커뮤니티" 재진입 진입점 라벨 혼란 보고

---

## 3. W축 정의 (이 시나리오 전용 평가 축)

> 공통 R1-R6 (`evaluation/rubric-v0.md`)와 함께 적용. 1~5점 척도.

### W1. 재진입 동선 적합성 (Re-entry Goal Reach)
- **5점**: 재진입 frame 도달 + 턴 ≤ 2 (세션 유지 = 즉시 접근)
- **3점**: 도달했으나 재검색 동선 반복 (턴 3~5, 세션 미유지)
- **1점**: 미도달 (GIVE_UP 또는 다른 커뮤니티 진입)
- → **H0/H2 직접 측정**. 시나리오1 W1 대비 턴 단축 여부 = H0 근거.

### W2. 재진입 진입점 발견성 (Re-entry Discoverability)
- 매 턴 `confusion_level` 평균값
- **5점**: 평균 ≤ 1.5 (Discover에서 즉시 "내 커뮤니티" 진입점 인지)
- **3점**: 평균 2.5~3.5
- **1점**: 평균 ≥ 4 (진입점 못 찾고 헤맴)
- → **H1 측정**

### W3. 세션 컨텍스트 유지 (Session Retention)
- 재진입 후 퍼소나가 "내가 보던 TXT 커뮤니티"라고 인식하는지
- **5점**: friction 없음 (즉시 동일 커뮤니티 인식)
- **3점**: friction 1건 (재확인 행동)
- **1점**: friction 2건+ 또는 "다른 커뮤니티인 줄 알았다" 보고
- → **H3 측정** (라벨/진입점 컨텍스트 잔존 여부)

---

## 4. Walker 실행 지시

```
cat personas/{persona}.md \
    scenarios/proto-walk-global-home-community-reentry-v1.md \
    proto-walk/walker.md \
    proto-walk/flow-{version}.json \
  | claude > transcripts/proto-walk/{persona}-reentry-{version}-{date}.json
```

`{version}` = `as-is` 또는 `to-be-{안이름}`.

각 턴 입력: 현재 frame 이미지 + hotspot 목록.
각 턴 출력 (JSON):
```json
{"choice_id": "<hotspot_id|GIVE_UP|REACHED>", "reasoning": "...", "emotion": "...", "confusion_level": 1-5}
```

---

## 5. Judge 실행 지시

```
cat evaluation/rubric-v0.md \
    scenarios/proto-walk-global-home-community-reentry-v1.md \
    transcripts/proto-walk/{persona}-reentry-{version}-{date}.json \
  | claude --system "당신은 사용성 평가자다. R1-R6(공통) + W1-W3(시나리오 정의) 모두 채점하라"
```

출력: `evaluation/scores/{persona}-reentry-{version}-{date}.json`

---

## 6. 실행 기록 (walk 완료 후 채움)

| 항목 | yuki / AS-IS | satomi / AS-IS | yuna / AS-IS | yuki / TO-BE | satomi / TO-BE | yuna / TO-BE |
|---|---|---|---|---|---|---|
| 실행일 | 2026-06-18 | 2026-06-18 | 2026-06-18 | | | |
| 도달 여부 | Y | Y | Y | | | |
| 세션 유지 여부 | N | N | N | | | |
| 턴 수 | 4 | 5 | 4 | | | |
| confusion 평균 | 3.4 | 2.6 | 3.25 | | | |
| 마찰점 수 | 3 | 3 | 3 | | | |
| W1 | 3 | 3 | 3 | | | |
| W2 | 3 | 3 | 3 | | | |
| W3 | 1 | 3 | 1 | | | |
| R1-R6 평균 | 4.2 | 4.0 | 3.6 | | | |

---

## 7. 가설 검증 (모든 walk 완료 후)

| 가설 | 결과 | 근거 |
|---|---|---|
| H0 | (지지/기각) | (시나리오1 W1 vs 시나리오2 W1 턴 비교) |
| H1 | (지지/기각) | (AS-IS 재진입 평균 지표) |
| H2 | (지지/기각) | (TO-BE 재진입 평균 지표) |
| H3 | (지지/기각) | (W3 점수 + 세션 유지 여부) |

---

## 비고

- REACH_FRAME 미확정: flow.json 추출 후 `35:79132` 출발 BFS로 도달 가능한 "재진입 완료" frame 확인 필요.
- 시나리오1과 연속 실행 권장: 시나리오1 종료 상태(커뮤니티 피드)가 시나리오2 START_FRAME과 일치.
- 세션 유지 여부는 프로토타입 설계에 따라 다름 — TO-BE에 "즉시 재진입" 진입점이 없으면 H2는 기각.
