---
name: dsl-to-code
trigger: "dsl to code, DSL → 코드, DSL을 구현, implement DSL, DSL 구현, dsl 코드 생성"
description: "DSL JSON을 플랫폼 코드(SwiftUI/Compose/Web)로 변환하고 자동 평가 하네스로 품질 검증 (최대 3 사이클)"
---

# DSL → Code Skill

DSL JSON을 플랫폼 코드로 변환하고, **하네스를 먼저 잠근 뒤** 생성·검증 루프를 실행한다.  
단순 변환이 아니라 **평가 기준 선설정 → 생성 → 4종 평가 → 개선** 사이클이 핵심이다.

---

## 입력 DSL 스킴

본 skill은 **cds-ds/dsl/v2** (`servers/dsl_v2.json`) 형식의 DSL을 입력으로 받는다. v2는 트리형 `nodes[]`, `Catalog`/`Layout`/`Style`/`Text`/`Asset` 분리, `TokenRef` 4종 참조 형식을 사용한다. v1(평탄 `components[]`, `$color.*` 참조)은 더 이상 지원하지 않는다.

## 공통 변환 규칙 (플랫폼 독립)

이 규칙은 모든 플랫폼에 적용된다.

1. **TokenRef 참조 4종 처리**:
   - `'token:<dotted.path>'` → 플랫폼 DS 토큰 API 호출(예: SwiftUI `Color.system.color.button.default`)
   - `'textStyle:<name>'` → 플랫폼 텍스트 스타일 API
   - `'hardcoded:<value>'` → 리터럴 그대로 사용 + `// FIXME: hardcoded` 주석
   - `'unresolved:<value>'` → 리터럴 사용 + `// TODO: 토큰 매칭 필요` 주석
2. **레이아웃 매핑**: `Layout.kind`(`stack`/`box`/`overlay`/`absolute`/`scroll`)와 `axis`(`vertical`/`horizontal`)를 플랫폼 레이아웃 프리미티브로 1:1 매핑. 병합·재구성 금지.
3. **Catalog variant 전달**: `catalog.variant`는 다축 객체. 카탈로그 axes 정의 그대로(공백·괄호·한국어 보존)를 플랫폼 컴포넌트의 enum/param으로 매핑. 정확히 매칭되는 매개변수가 없으면 `// TODO: variant 매핑 필요 - <axis>=<value>` 주석.
4. **SizePolicy 변환**: `layout.size.{width,height}.mode` 기준 →
   - `'fill'` → 플랫폼별 "최대 너비/높이 채우기" API
   - `'hug'` → "콘텐츠 크기에 맞춤" API
   - `'fixed'` → `value` 픽셀 고정
5. **children 트리 보존**: `nodes[].children[]` 중첩 구조를 그대로 유지. 임의 병합 금지.
6. **catalog 미매핑 노드**: `Node.type`이 `'frame'/'group'`이고 `catalog`가 없는 경우(매핑 실패)는 플랫폼 네이티브 primitive로 근사 구현 + `// TODO: DS 매핑 필요 - <node.name>` 주석.
7. **Text 노드**: `text.value`는 리터럴 문자열로 직접 사용(i18n은 호출자 책임). `text.textStyle`(`textStyle:` 또는 `token:typography.*`) → 플랫폼 텍스트 스타일.
8. **Style.effects**: `shadow` 계열은 플랫폼별 shadow API, `blur`/`background_blur`는 플랫폼 근사 처리.
9. **Asset**: `kind='icon'`은 플랫폼 아이콘 API + `tint`(TokenRef), `kind='image'`는 이미지 컴포넌트 + `ref`/`url`.

---

## 워크플로우 (최대 3 사이클)

### Step 0: 사전 조건 확인

1. DSL 파일 경로 확인. 없으면 사용자에게 요청.
2. 출력 디렉터리 결정: 지정이 없으면 DSL 파일과 같은 디렉터리.
3. `ds-manifest.json` 탐색 (선택, 찾지 못해도 계속 진행):
   - 탐색 순서: `./ds-manifest.json` → 플랫폼별 외부 의존성 위치
     - **ios**: `.build/checkouts/*/ds-manifest.json`, `Packages/*/ds-manifest.json`
     - **android**: `**/ds-manifest.json` (`build/`, `.gradle/` 제외)
     - **web**: `node_modules/@weverse/*/ds-manifest.json`, `node_modules/*/ds-manifest.json`
   - 찾은 경우 `Read`로 로드 → `platform` 필드 추출.
   - 찾지 못한 경우 `manifest = null`로 계속 진행.
4. manifest의 `platform`과 사용자 요청 플랫폼이 충돌하면 사용자에게 확인.

### Step 1: 플랫폼 감지 + 특화 규칙 로드

플랫폼 결정 우선순위:
1. 사용자 명시 ("iOS로 만들어줘")
2. DSL root의 `platform` 필드
3. DSL root의 `dsManifest.platform`
4. `ds-manifest.json`의 `platform` 필드
5. 현재 디렉터리 내 `Package.swift` → ios, `build.gradle` → android, `package.json` → web

플랫폼 확정 후 **이 SKILL.md와 같은 디렉터리**의 플랫폼 특화 MD를 `Read` 도구로 로드:
- `ios` → `SWIFTUI.md`
- `android` → `COMPOSE.md`
- `web` → `WEB.md`

플랫폼 특화 MD에 정의된 모든 규칙은 공통 규칙과 함께 이후 모든 단계에 적용된다.

### Step 2: 평가 하네스 사전 생성 (코드 생성 전에 확정)

**이 단계는 코드 생성 전에 반드시 완료해야 한다.**  
평가 기준이 생성된 코드에 의해 오염되는 것을 방지한다.

`<output-dir>/harness.json` 파일을 DSL에서 직접 추출하여 작성:

```json
{
  "dslPath": "<dsl-file-path>",
  "platform": "ios | android | web",
  "outputDir": "<output-dir>",
  "expectedTokens": ["token:system.color.button.default", "textStyle:body-lg/system-700", ...],
  "expectedCatalog": {
    "<node-id>": { "id": "textbutton", "variant": { "Type": "Filled", "Size": "Large(44)" } }
  },
  "expectedLayout": {
    "<node-id>": { "kind": "stack", "axis": "horizontal", "spacing": 8, "padding": { "top": 12, "right": 16, "bottom": 12, "left": 16 } }
  },
  "expectedSize": {
    "<node-id>": { "width": { "mode": "fill" }, "height": { "mode": "fixed", "value": 44 } }
  },
  "expectedText": {
    "<node-id>": "<text-value>"
  },
  "lint": {
    "command": "<플랫폼별 lint 명령>",
    "target": "<파일 경로>"
  },
  "build": {
    "command": "<플랫폼별 build 명령 — 불필요하면 null>",
    "target": null
  },
  "screenshot": {
    "command": "<플랫폼별 스크린샷 캡처 명령>",
    "outputPath": "<output-dir>/screenshot_N.png"
  },
  "generatedAt": "<ISO timestamp>"
}
```

`expectedTokens`: `nodes[]` 트리를 재귀 탐색해 모든 TokenRef 문자열(`token:`/`textStyle:` prefix)을 수집. `hardcoded:`/`unresolved:`는 제외.
`expectedCatalog`: 각 `type='component'` 노드의 `catalog.id` + `catalog.variant`.
`expectedLayout`: 각 노드의 `layout` 객체(kind/axis/spacing/padding/alignment).
`expectedSize`: 각 노드의 `layout.size` 객체.
`expectedText`: 각 `type='text'` 노드의 `text.value`.

lint/build/screenshot 명령은 플랫폼 특화 MD의 명세를 사용.

### Step 3: 코드 생성

이전 iteration의 `fix_hints`가 있으면 반드시 반영한다.

출력 파일:
- iOS: `<output-dir>/<ComponentName>.swift`
- Android: `<output-dir>/<ComponentName>.kt`
- Web: `<output-dir>/index.html` (또는 `<component>.css` 분리 가능)

코드 작성 시 플랫폼 특화 MD 규칙을 우선 적용하고, 공통 규칙을 함께 준수한다.

### Step 4: 하네스 실행 (4종 평가)

결과를 `<output-dir>/harness_result_<N>.json`에 기록.

#### 4-1. Lint
`harness.json.lint.command` 실행. exit code 0 = PASS.  
실패 시 lint 오류 메시지 전체를 `fix_hints`에 포함.

#### 4-2. Build
`harness.json.build.command`가 null이 아니면 실행. exit code 0, stderr에 error 없음 = PASS.  
실패 시 빌드 오류 메시지를 `fix_hints`에 포함.

#### 4-3. Static Check
생성된 코드에서 토큰 문자열과 레이아웃 구조를 추출해 `harness.json`의 expected 값과 비교.

| 항목 | 방법 | 기준 |
|------|------|------|
| 토큰 일치율 | 코드에서 플랫폼 토큰 API 호출 추출 → expectedTokens 매핑 | ≥ 95% |
| Catalog variant | 코드에서 컴포넌트 호출의 variant 인자 추출 → expectedCatalog 비교 | ≥ 90% |
| 레이아웃 구조 | 코드에서 HStack/VStack/Row/Column/flexbox 추출 → expectedLayout(kind/axis) 비교 | ≥ 90% |
| 텍스트 리터럴 | 코드에서 텍스트 상수 추출 → expectedText 비교 | 100% |

누락 항목은 `fix_hints`에 "컴포넌트명: 필드 누락" 형식으로 기록.

#### 4-4. Screenshot
`harness.json.screenshot.command` 실행 → 캡처 이미지 저장.  
캡처 후 원본 Figma 스크린샷(사용 가능한 경우) 또는 이전 iteration 스크린샷과 시각 비교.

| 기준 | 방법 |
|------|------|
| 레이아웃 방향 일치 | 주요 컨테이너 방향 확인 |
| 주요 요소 존재 | 텍스트, 버튼, 아이콘 등 핵심 UI 요소 |
| 여백·간격 근사 | 눈에 띄는 차이(>20%) 없음 |

스크린샷 비교 불가(환경 없음) 시: "스크린샷 비교 생략 — 환경 없음" 기록 후 SKIP 처리 (PASS에 영향 없음).

### Step 5: 판정 + 루프

```
harness_result_N.json 작성
└─ Lint PASS & Build PASS & Static Check PASS & Screenshot PASS/SKIP
   → PASS: 루프 종료 → 최종 출력
└─ 하나라도 FAIL & 시도 횟수 < 3
   → fix_hints 생성 → Step 3으로 (iteration N+1)
└─ 하나라도 FAIL & 시도 횟수 = 3
   → 루프 종료 → 베스트 시도 보고 + 미해결 이슈 사용자 보고
```

**fix_hints 우선순위**: 빌드 오류 > lint 오류 > 토큰 누락 > 레이아웃 불일치 > 텍스트 누락 > 시각 차이.

---

## 최종 출력 형식

```markdown
## DSL → Code 변환 결과

- 플랫폼: ios | android | web
- 시도: N/3
- 결과: PASS ✅ | FAIL ❌

### 평가 결과
| 평가 항목 | 결과 | 비고 |
|----------|------|------|
| Lint | ✅/❌ | ... |
| Build | ✅/❌/N/A | ... |
| Static Check | ✅/❌ | 토큰 N/N, 레이아웃 N/N |
| Screenshot | ✅/❌/SKIP | 유사도 N% 또는 SKIP 이유 |

### 생성 파일
- `<path>`

### 미해결 이슈 (FAIL 시)
- ...
```
