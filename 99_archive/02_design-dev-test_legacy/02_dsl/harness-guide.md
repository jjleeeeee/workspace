# CDS-DS 하네스 가이드

DSL 생성 품질 검증 파이프라인 — 명령, 설정, 평가 기준 정리.

---

## Figma API 경로 — 두 가지

파이프라인에서 Figma API를 호출하는 도구가 두 개 있고, 역할이 다르다.

| 도구 | 경로 | 용도 |
|------|------|------|
| **claude.ai Figma MCP** `get_design_context` | claude.ai 내장 MCP | 디자인 컨텍스트 + 스크린샷 — 시각 비교 기준 |
| **cds-ds** `figma_fetch_design()` | cds-ds MCP 서버 (`FIGMA_TOKEN` 필요) | INSTANCE 컴포넌트 구조화 JSON — `dsl_harness.py` 입력 |

둘 다 Figma REST API를 호출하지만 반환 형식이 다르다.  
`dsl_harness.py`는 `figma_fetch_design()` 형식만 받는다.

---

## 전체 파이프라인 구조

```
Figma URL
  │
  ├─ claude.ai Figma MCP
  │   └─ get_design_context()   → 스크린샷 + React/Tailwind 코드 (시각 비교용)
  │
  └─ cds-ds MCP
      ├─ figma_fetch_design()   → figma_raw.json (INSTANCE 구조, 토큰 BV)
      ├─ ds_list()              → 사용 가능한 DS 컴포넌트·토큰 목록
      ├─ ds_get(ids)            → 해당 카탈로그 fetch
      └─ ds_dsl_schema()        → DSL v1 스킴

       ↓ 조합
    DSL 생성 (Claude)
       │
       ├─ dsl_harness.py        → 구조적 점수 (figma_raw.json 기반, 자동)
       └─ dsl_qa_agent          → 플랫폼 드로잉 가능성 (Claude 에이전트)
              ↓
         PASS ≥ 80 / FAIL < 80
              │
        FAIL → fix_hints 반영 → DSL 재생성 (최대 3회)
```

---

## 1. Slash Command — `/dsl-harness`

**파일**: `commands/dsl-harness.md`

### 사용법

```
/dsl-harness https://figma.com/design/{fileKey}/ScreenName?node-id=1-23
```

### 흐름 (최대 3 iteration)

| Step | 도구 | 설명 |
|------|------|------|
| 준비-1 | `get_design_context(fileKey, nodeId)` | 스크린샷·컨텍스트 수집 (시각 기준) |
| 준비-2 | `figma_fetch_design(url)` | INSTANCE 구조 JSON 수집 → `/tmp/figma_raw.json` |
| 준비-3 | `ds_list()` + `ds_dsl_schema()` | 카탈로그 목록·스킴 로드 |
| A | DSL 생성 | 이전 `fix_hints` 반영 → `/tmp/dsl_attempt_N.json` |
| B | `dsl_harness.py` 실행 | 구조적 점수 산출 |
| C | `dsl-qa` 에이전트 호출 | 점수 ≥ 60일 때만, 플랫폼별 드로잉 평가 |
| D | 판정 | 평균 ≥ 80 → PASS / < 80 → A로 |

> **`figma_fetch_design()` 실패 시**: `get_design_context` 출력만으로 DSL 생성 후  
> 하네스는 `figma_raw.json` 없이 실행 불가 → 수동 SPEC_AUDIT.md로 대체.

### 최종 출력 형식

```
## DSL Harness 결과

- 시도 횟수: N/3
- 최종 점수: XX/100 (PASS/FAIL)

### 플랫폼 평가
- iOS: ...
- Android: ...
- Web: ...

### 미결 이슈 (FAIL 시)
- ...

### 최종 DSL
\`\`\`json
{ ... }
\`\`\`
```

---

## 2. Figma 데이터 수집 도구 비교

### 2-A. claude.ai Figma MCP — `get_design_context`

```
get_design_context(fileKey, nodeId)
```

- **반환**: React/Tailwind 레퍼런스 코드 + **스크린샷** + CodeConnect 스니펫
- **주 용도**: Web/iOS/Android 구현 시 시각 비교 기준
- **인증**: claude.ai Figma 연동 (별도 토큰 불필요)

### 2-B. cds-ds — `figma_fetch_design()`

```
figma_fetch_design(url)
```

- **반환**: INSTANCE 컴포넌트 목록 (layout, width/height, fill, boundVariables 포함)
- **주 용도**: `dsl_harness.py` 입력 (`figma_raw.json`)
- **인증**: `FIGMA_TOKEN` 환경변수 필수

**반환 형식** (`figma_raw.json`):

```json
{
  "frame": { "id": "1:23", "name": "ScreenName", "type": "FRAME" },
  "components": [
    {
      "id": "5:67",
      "name": "Button/Primary/Medium",
      "type": "INSTANCE",
      "text": "구매하기",
      "layout": { "layout": "horizontal", "gap": 8, "padding": [12, 16] },
      "width": "fill_container",
      "height": 48,
      "boundVariables": {
        "fills": [{ "figmaKey": "abc123", "tokenName": "system/color/button/default" }]
      }
    }
  ],
  "source": { "fileKey": "...", "nodeId": "1:23", "variablesResolved": true }
}
```

---

## 3. 구조적 하네스 — `dsl_harness.py`

**파일**: `servers/dsl_harness.py`  
**런타임**: `uv run --script` (Python ≥ 3.11, 외부 의존성 없음)

### 직접 실행

```bash
uv run --script servers/dsl_harness.py /tmp/figma_raw.json /tmp/dsl_output.json
```

exit code `0` = PASS, `1` = FAIL, `2` = 인자 오류.

### 채점 로직

| 항목 | 감점 | 조건 |
|------|------|------|
| DS 매핑 커버리지 < 50% | -30 | `missing_ds_mapping: true` 과다 |
| DS 매핑 커버리지 50~80% | -15 | 부분 매핑 |
| `layout` 필드 누락 | -10/건 | Figma layoutMode 있는데 DSL에 없음 |
| `tokens` 필드 누락 | -10/건 | Figma boundVariables 있는데 DSL에 없음 |
| `width`/`height` 누락 | -5/건 | Figma sizing 있는데 DSL에 없음 |
| `text` 필드 누락 | -5/건 | Figma characters 있는데 DSL에 없음 |
| `fill` 정보 누락 | -5/건 | Figma fill 있는데 DSL에 없음 |

**최종 점수 = 100 − 감점 합계** (최솟값 0) / **PASS 기준: ≥ 80**

### 출력 예시

```json
{
  "score": 85,
  "pass": true,
  "issues": [
    { "level": "warning", "component": "chip", "message": "height 누락" }
  ],
  "platform_notes": {
    "ios": "SwiftUI frame()/background() 적용 가능 — layout·sizing 완비",
    "android": "Compose Row/Column + fillMaxWidth 매핑 가능",
    "web": "CSS flexbox 완비"
  },
  "fix_hints": ["chip: height: 28 추가 필요"]
}
```

---

## 4. QA 에이전트 — `dsl-qa`

**파일**: `agents/dsl_qa_agent.md`

구조적 하네스(자동 채점)와 달리, Claude 에이전트가 **플랫폼별 드로잉 가능성**을 판단.

### 플랫폼별 체크포인트

| 플랫폼 | 핵심 확인 사항 |
|--------|---------------|
| iOS (SwiftUI) | `layout`/`width`/`height` → `frame()`, `fill` → `background()`, `effect` → `shadow()` |
| Android (Compose) | `layout` → `Column`/`Row`/`Box`, `width` → `fillMaxWidth()`, `tokens` → MaterialTheme |
| Web (CSS) | `layout` → flexbox 방향, `fill` → `background-color`, `stroke` → `border`, `effect` → `box-shadow` |

---

## 5. Web 미리보기 스크린샷 비교

DSL → Web 구현 후 `get_design_context` 스크린샷과 시각 비교.

### Chrome 헤드리스 명령

```bash
mkdir -p /tmp/cds-ds/<component>

/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --headless=new \
  --screenshot=/tmp/cds-ds/<component>/iterN.png \
  --window-size=390,800 \
  --force-device-scale-factor=2 \
  "file:///path/to/index.html" 2>/dev/null
```

### 주의: Headless Chrome viewport

> `--window-size=390,800`을 줘도 최소 CSS viewport = **500px** (`window.innerWidth = 500`)  
> 이미지는 780×1600px이지만 CSS 기준은 500px.  
> 레이아웃 정밀 검증은 JS `getBoundingClientRect()`로 직접 확인.

### JS 위치 검증 스니펫

```js
window.addEventListener('load', () => {
  const results = {};
  ['card', 'card__more-link', 'card__list-item'].forEach(cls => {
    const el = document.querySelector('.' + cls);
    if (el) results[cls] = { w: el.offsetWidth, left: el.getBoundingClientRect().left };
  });
  results.viewport = window.innerWidth;
  document.body.insertAdjacentHTML('beforeend', '<pre>' + JSON.stringify(results, null, 2) + '</pre>');
});
```

### Iteration 루프 기준

| 회차 | 내용 |
|------|------|
| Iter 1 | 초기 구현 + `get_design_context` 스크린샷 비교, 이슈 목록 작성 |
| Iter 2 | 이슈 수정 + 재스크린샷 비교 |
| Iter 3 | 필요 시 추가 수정 또는 PASS 선언 |

PASS 기준: 주요 Figma 스펙 항목 ≥ 80% 충족, 레이아웃·간격·타이포그래피·색상 일치.

---

## 6. 파일 구조

```
plugins/cds-ds/
├── commands/
│   ├── dsl-harness.md       # /dsl-harness 슬래시 커맨드
│   ├── figma-to-dsl.md      # /figma-to-dsl 슬래시 커맨드
│   └── ds-token-lint.md     # /ds-token-lint 슬래시 커맨드
├── agents/
│   └── dsl_qa_agent.md      # dsl-qa 서브에이전트
├── servers/
│   ├── dsl_harness.py       # 구조적 하네스 평가기
│   ├── ds_token_lint.py     # 토큰 lint
│   └── cds_ds_server.py     # MCP 서버 (ds_list, ds_get, figma_fetch_design, ds_dsl_schema)
├── docs/
│   └── harness-guide.md     # 이 파일
└── samples/
    └── <component>/
        ├── <component>.dsl.json
        ├── SPEC_AUDIT.md    # 항목별 Figma 비교 결과
        └── web/index.html
```
