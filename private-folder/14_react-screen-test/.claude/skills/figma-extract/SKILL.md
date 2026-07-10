---
name: figma-extract
description: >
  Use when reading a Figma frame for React screen implementation and the frame
  is large (>50 nodes estimated) OR get_design_context output would exceed
  context budget. Chunks node-tree extraction via figma_execute OFFSET/LIMIT
  loop and caches to harness/<slug>-nodes.json. Triggers on "figma 읽기",
  "화면 구현 시작", "extract nodes", "노드 추출", or whenever a new screen
  slug is introduced before any JSX is written.
---

# Figma Node-Tree Chunked Extractor

## 사용 조건
- Figma Console MCP 연결 (`figma_get_status` 로 확인)
- `--node-id`, `--file-key`, `--slug` 세 값 모두 확보
- `scripts/harness-cli.mjs` 존재 (이 repo 루트)

## 보호 규칙 (워커 스크립트 내장)
- `💠` / `🛠️` 접두사 노드 → 서브트리 스킵, `dsInstancesSkipped` 에 기록
- `INSTANCE` 타입 노드 → 스킵 + `mainComponentKey` 기록
- 스킵된 인스턴스는 이후 `code-connect resolve` 로 라우팅

---

## 실행 절차 (5 Phase)

### Phase A — 대상 파악
```
figma_get_status  # 연결 확인
```
필요 정보 확인:
- `--node-id`: 화면 루트 노드 ID (예: `59869:78921` 또는 `59869-78921`)
- `--file-key`: Figma 파일 키 (URL 에서 `/design/<fileKey>/` 부분)
- `--slug`: kebab-case 화면 슬러그 (예: `weverse-myfeed`)

미확보 시: "node-id / file-key / slug 를 알려달라" 안내 후 **중단**.

### Phase B — 캐시 초기화
```bash
node scripts/harness-cli.mjs extract-nodes fetch \
  --node-id <id> --file-key <key> --slug <slug> [--limit 25]
```
출력: `harness/<slug>-nodes.json` 생성 확인.

### Phase C — 배치 루프 (hasMore=false 될 때까지 반복)

**Step C1 — 다음 스크립트 출력**
```bash
node scripts/harness-cli.mjs extract-nodes next-script --slug <slug>
```
출력된 JS 스크립트를 그대로 `figma_execute` 에 붙여넣어 실행.

**Step C2 — 응답 저장**
```bash
# figma_execute 결과 JSON 을 임시 파일로 저장
# 예: /tmp/<slug>-batch-N.json
```
실제로는 Claude 가 응답 JSON 을 받아 파일로 기록:
```bash
cat > /tmp/<slug>-batch-N.json << 'EOF'
<figma_execute 응답 JSON>
EOF
```

**Step C3 — 캐시 병합**
```bash
node scripts/harness-cli.mjs extract-nodes ingest \
  --slug <slug> --response /tmp/<slug>-batch-N.json
```
출력 예: `extract-nodes ingest: +25 nodes (total=50, scanned=120, hasMore=true)`

**Step C4 — 진행 확인**
```bash
node scripts/harness-cli.mjs extract-nodes status --slug <slug>
```
- `hasMore: true` → C1 부터 반복 (N 증가)
- `hasMore: false` → Phase D 진행

**배치 번호 관리**: `N` 은 1 부터 시작, ingest 성공 시마다 +1.  
최대 반복 없음 — 노드 수 따라 자동 종료.

### Phase D — 완료 보고
```bash
node scripts/harness-cli.mjs extract-nodes status --slug <slug>
```
출력에서:
- `nodes cached` = 총 커스텀 노드 수
- `dsInstSkipped` = DS 인스턴스 수

보고 형식:
```
✓ extract-nodes 완료
  캐시: harness/<slug>-nodes.json
  커스텀 노드: N개
  DS 인스턴스 (code-connect 대상): M개
    - <id>  💠 Button/Primary
    - <id>  💠 Avatar/Default
  → 다음: code-connect resolve 로 각 인스턴스 매핑 확인
```

DS 인스턴스마다 resolve 안내:
```bash
node scripts/harness-cli.mjs code-connect resolve --node-id <id> --file-key <key>
```

### Phase E — 검증
- `harness/<slug>-nodes.json` 파일 존재 확인
- `nodes` 배열 비어있지 않음
- `hasMore: false`
- `dsInstancesSkipped` 에 실제 DS 컴포넌트 포함 (비어도 OK — 커스텀 화면)
- 이후 JSX 작성 시 이 캐시 파일 참조, Figma MCP 재호출 금지

---

## 빠른 트리거 예시
- "weverse-xxx 화면 구현 시작" → Phase A 부터 실행
- "figma 노드 읽어줘" → Phase A 부터 실행
- "next-script 실행" → Phase C1 직행
- "배치 ingset" / "ingest 해줘" → Phase C3 직행
- "상태 확인" / "몇 개 읽었어?" → Phase D / status 직행

## CLI 전체 레퍼런스
```
extract-nodes fetch       --node-id --file-key --slug [--limit 25]  # 초기화
extract-nodes next-script --slug                                      # 다음 배치 스크립트 출력
extract-nodes ingest      --slug --response <json-path>              # 배치 결과 병합
extract-nodes status      --slug                                      # 진행 요약
extract-nodes resume      --slug                                      # next-script + status 합본
```

## 캐시 스키마 (`harness/<slug>-nodes.json`)
```jsonc
{
  "slug": "weverse-myfeed",
  "figma": { "fileKey": "...", "nodeId": "..." },
  "limit": 25,
  "offset": 100,        // 다음 배치 시작점
  "hasMore": false,     // false = 추출 완료
  "startedAt": "...",
  "updatedAt": "...",
  "totalScanned": 120,  // walk 한 총 노드 수 (DS 인스턴스 포함)
  "dsInstancesSkipped": [
    { "id": "12:34", "name": "...", "mainComponentKey": "abc", "mainComponentName": "💠 Button/Primary" }
  ],
  "nodes": [
    {
      "id": "12:56", "name": "heroCard", "type": "FRAME", "parent": "12:40",
      "layout": { "mode": "VERTICAL", "padding": [16,16,16,16], "itemSpacing": 8 },
      "geometry": { "w": 343, "h": 200, "x": 16, "y": 100 },
      "fills": [...], "strokes": [...], "effects": [...],
      "cornerRadius": 12,
      "text": null,
      "boundVariables": {}
    }
  ]
}
```
