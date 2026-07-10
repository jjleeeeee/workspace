# 시나리오 — 글로벌 홈에서 가입 커뮤니티 진입 (v1)

## 메타

| 항목 | 내용 |
|---|---|
| 시나리오 ID | `proto-walk-global-home-community-search-v1` |
| 평가 유형 | Multi-turn prototype walk |
| 배경 문서 | [`backgrounds/260618_global-home-community-navigation.md`](../backgrounds/260618_global-home-community-navigation.md) |
| Figma 파일 | `7tuvMuw9gk20QnyHo0iu2e` (글로벌홈 - 커뮤니티 동선 개선) |
| 시작 노드 (AS-IS) | `35:75221` Discover |
| 시작 노드 (TO-BE) | TBD (개선안 시작 노드 추출 필요) |
| 평가 퍼소나 | yuki, satomi, yuna |
| 작성일 | 2026-06-18 |

---

## 1. Walk 목표

퍼소나가 글로벌 홈 Discover에서 출발하여 **Tomorrow x Together 커뮤니티에 가입하고 피드에 진입**한다.

```
GOAL:        Discover 출발 → 커뮤니티 검색 →
             Tomorrow x Together 선택 → 가입/팔로우 클릭 →
             커뮤니티 피드 진입
START_FRAME: 35:75221  (Discover, 글로벌 홈)
REACH_FRAME: 35:79132  (커뮤니티_피드탭_하이라이트)
MAX_TURNS:   10
```

- **이탈(실패)**: GIVE_UP 또는 다른 frame에서 멈춤

배경: doc02 유저 피드백 TOP 1 "5분 동안 BTS 커뮤니티 찾느라 헤맸다"와 1:1 매칭.

---

## 2. 가설 (배경 §8에서 import)

### H0 (디자인 가설, 검증 대상)
> 커뮤니티 검색/선택 이후 커뮤니티에 진입했을 때 탭간 전환이 일어나도 내 커뮤니티로 즉시 재진입(세션 유지)할 수 있다면, 커뮤니티 진입 실패와 반복 탐색 비용이 줄어든다.

### Walk 가설
- **H1 (AS-IS 기준선)**: confusion_level 평균 ≥ 3, 턴 6+, 마찰점 ≥ 2
- **H2 (TO-BE 효과)**: confusion_level 평균 1~2, 턴 ≤ 4, 마찰점 ≤ 1
- **H3 (라벨 잔존)**: "Artist Profile/List" 라벨 → 3명 모두 "이게 커뮤니티 맞나?" 보고

---

## 3. W축 정의 (이 시나리오 전용 평가 축)

> 공통 R1-R6 (`evaluation/rubric-v0.md`)와 함께 적용. 1~5점 척도.

### W1. 동선 적합성 (Goal Reach)
- **5점**: 목표 frame(`35:79132`) 도달 + base 4턴에서 부수 화면 ≤ 1 (총 턴 ≤ 5)
- **3점**: 도달했으나 우회·재시도 다수 (총 턴 6~8)
- **1점**: 미도달 (GIVE_UP 또는 잘못된 frame에서 종료)
- → **H0/H2 직접 측정**

### W2. Hotspot 발견성 (Discoverability)
- 매 턴 `confusion_level` (1=명확, 5=완전 혼란)의 평균값
- **5점**: 평균 ≤ 1.5 (모든 화면에서 즉시 다음 동작 파악)
- **3점**: 평균 2.5~3.5
- **1점**: 평균 ≥ 4
- → **H1 측정**

### W3. 라벨/구조 잔존 마찰 (Residual Friction)
- walk 중 보고된 frictions[]의 `type:'label_unclear'` 개수
- **5점**: 0개
- **3점**: 1~2개
- **1점**: 3개 이상 또는 도달 실패 직접 원인
- → **H3 측정**

---

## 4. Walker 실행 지시

```
cat personas/{persona}.md \
    scenarios/proto-walk-global-home-community-search-v1.md \
    proto-walk/walker.md \
    proto-walk/flow-{version}.json \
  | claude > transcripts/proto-walk/{persona}-{version}-{date}.json
```

`{version}` = `as-is` 또는 `to-be-{안이름}`.

각 턴 입력: 현재 frame 이미지 + hotspot 목록.
각 턴 출력 (JSON):
```json
{"choice_id": "<hotspot_id|GIVE_UP>", "reasoning": "...", "emotion": "...", "confusion_level": 1-5}
```

---

## 5. Judge 실행 지시

```
cat evaluation/rubric-v0.md \
    scenarios/proto-walk-global-home-community-search-v1.md \
    transcripts/proto-walk/{persona}-{version}-{date}.json \
  | claude --system "당신은 사용성 평가자다. R1-R6(공통) + W1-W3(시나리오 정의) 모두 채점하라"
```

출력: `evaluation/scores/{persona}-{version}-{date}.json` — `{R1..R6, W1..W3, summary}` 스키마.

---

## 6. 실행 기록 (walk 완료 후 채움)

| 항목 | yuki / AS-IS | satomi / AS-IS | yuna / AS-IS | yuki / TO-BE | satomi / TO-BE | yuna / TO-BE |
|---|---|---|---|---|---|---|
| 실행일 | 2026-06-18 | 2026-06-18 | 2026-06-18 | | | |
| 도달 여부 | Y | Y | Y | | | |
| 턴 수 | 4 | 4 | 4 | | | |
| confusion 평균 | 2.25 | 2.0 | 2.0 | | | |
| 마찰점 수 | 2 | 1 | 1 | | | |
| W1 | 5 | 5 | 5 | | | |
| W2 | 4 | 4 | 4 | | | |
| W3 | 3 | 3 | 5 | | | |
| R1-R6 평균 | 4.6 | 4.6 | 4.2 | | | |

---

## 7. 가설 검증 (모든 walk 완료 후)

| 가설 | 결과 | 근거 |
|---|---|---|
| H0 | (지지/기각) | (W1 AS-IS vs TO-BE 차이) |
| H1 | (지지/기각) | (AS-IS 평균 지표) |
| H2 | (지지/기각) | (TO-BE 평균 지표) |
| H3 | (지지/기각) | (W3 점수 + 보고된 label_unclear) |
