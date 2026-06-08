---
name: ds-manifest
description: "현재 DS module에서 구현된 DS 토큰·컴포넌트를 탐색해 ds-manifest.json을 생성하거나 업데이트합니다. 예: /ds-manifest"
---

현재 작업 디렉터리를 DS module 루트로 간주하고, 구현된 DS 토큰·컴포넌트를 탐색해
`ds-manifest.json`을 생성하거나 업데이트한다.

## 실행 순서

### Step 1: 플랫폼 감지

아래 파일 존재 여부로 플랫폼을 판별한다.

| 플랫폼 | 판별 기준 |
|--------|----------|
| `ios` | `Package.swift` 또는 `*.podspec` 또는 `Podfile` 존재 |
| `android` | `build.gradle` 또는 `build.gradle.kts` 존재 |
| `web` | `package.json` 존재 |

복수 감지되면 우선순위: `ios` > `android` > `web`.  
`$ARGUMENTS` 에 플랫폼이 명시됐으면 (`ios` | `android` | `web`) 감지 결과보다 우선한다.

### Step 2: cds-catalogs 전체 카탈로그 로드

```
ds_list()
```

카탈로그의 전체 토큰·컴포넌트 이름을 기준집합으로 사용한다.

### Step 3: DS 구현 탐색

플랫폼별 패턴으로 현재 디렉터리를 재귀 탐색해 DS 토큰·컴포넌트 사용을 수집한다.

#### iOS (Swift/SwiftUI)
- **컴포넌트**: `*.swift` 파일에서 `WDS[A-Z][A-Za-z]+` 패턴의 타입/함수 이름 추출  
  예) `WDSButton`, `WDSChip`, `WDSTextField`
- **토큰**: `.color(`, `.font(`, `WDSToken.`, `TokenName.` 패턴 또는 DS 토큰 참조 형태 추출
- 탐색 제외: `Tests/`, `Preview Content/`, `*.generated.swift`

#### Android (Kotlin/Compose)
- **컴포넌트**: `*.kt` 파일에서 `WDS[A-Z][A-Za-z]+\s*\(` 패턴의 Composable 호출 추출  
  예) `WDSButton(`, `WDSChip(`
- **토큰**: `WDSTheme.`, `WDSColor.`, `WDSTypography.` 등 테마 참조 추출
- 탐색 제외: `build/`, `*Test*.kt`

#### Web (TypeScript/JavaScript)
- **컴포넌트**: `*.ts`, `*.tsx`, `*.js`, `*.jsx` 파일에서 WDS 패키지 import 추출  
  예) `import { WDSButton, WDSChip } from '@weverse/wds'`  
  또는 `node_modules/@weverse/wds*/` 하위 export 파일 직접 탐색
- **토큰**: CSS/SCSS/token 파일에서 WDS 토큰 변수 참조 추출  
  예) `var(--wds-`, `$wds-`
- 탐색 제외: `node_modules/`, `dist/`, `*.test.*`, `*.spec.*`

### Step 4: cds-catalog 이름 매핑

Step 3에서 추출한 이름을 Step 2의 카탈로그 기준집합과 매핑한다.

**매핑 규칙**:
- `WDS` 접두사를 제거한 뒤, `ds_list()` 반환 목록과 다음 순서로 매칭을 시도한다.
  1. 소문자 concat: `WDSTextButton` → `textbutton` (카탈로그에 `textbutton` 있으면 매핑)
  2. kebab-case: `WDSIconButton` → `icon-button` (카탈로그에 `icon-button` 있으면 매핑)
  3. 두 가지 모두 실패 시 `unmapped` 처리
- 카탈로그 이름은 `ds_list()` 결과를 **항상 정답**으로 사용한다. 변환 규칙을 따르지 말고 목록에서 직접 검색할 것.
- 토큰 컬렉션: 파일/import 경로에서 컬렉션 이름 추출  
  예) `WDSToken.color` → `WDS_tokens`, `WDSTheme.typography` → `WDS_typography`
- 매핑 실패 항목은 `unmapped` 로 분류해 출력에 포함 (manifest에는 넣지 않음)

### Step 5: 기존 ds-manifest.json 확인

현재 디렉터리에 `ds-manifest.json`이 있으면 `Read` 도구로 읽는다.
- 존재 → **업데이트 모드**: 기존 `platform`, `version` 유지, `tokens`/`components` 갱신
- 미존재 → **신규 생성 모드**

### Step 6: ds-manifest.json 작성

`ds_manifest_schema()`를 호출해 스킴을 확인한 뒤 파일을 작성한다.

```json
{
  "$schema": "cds-ds/manifest/v1",
  "platform": "<감지된 플랫폼>",
  "tokens": ["<매핑된 토큰 컬렉션 이름>", ...],
  "components": ["<매핑된 컴포넌트 이름>", ...]
}
```

- `tokens`, `components` 배열은 알파벳순 정렬
- 업데이트 모드: 기존 목록과 새로 발견된 목록의 합집합 사용 (항목 삭제 없음)

## 최종 출력 형식

```
## ds-manifest.json 생성/업데이트 결과

- 모드: 신규 생성 | 업데이트
- 플랫폼: ios | android | web
- 탐색 파일 수: N개

### 매핑된 항목
- 토큰 컬렉션 (N개): WDS_tokens, WDS_size, ...
- 컴포넌트 (N개): textbutton, chip, ...

### 매핑 실패 항목 (catalog에 없음)
- WDSCustomComponent → unmapped
- ...

### ds-manifest.json
\`\`\`json
{ ... }
\`\`\`
```

매핑 실패 항목이 있으면:
> `ds_list()` 결과에 없는 항목입니다. cds-catalogs에 등록되지 않은 컴포넌트이거나 이름 매핑이 실패했을 수 있습니다. 필요하면 수동으로 추가하세요.
