---
plan_id: 03
date: 2026-05-11
revision: v2 (Codex 적대적 리뷰 3건 반영)
topic: 07_figma-to-dev 화면 생성 워크플로우
source_dirs:
  - 04_wf-figma-to-react-components (라이브러리)
  - 07_figma-to-dev (소비자 앱)
moved_from: 96_plan-compare/03_07-figma-to-dev_화면생성_워크플로우_20260511.md
---

# 07_figma-to-dev: Figma 화면 → React 화면 생성 워크플로우

## Context

`04_wf-figma-to-react-components`에 36개 DS 컴포넌트가 있고 모두 `*.figma.tsx`로 Code Connect 매핑됨(Figma fileKey `DWEduE6GfxYMlyxKPNJ8jA`). 디자이너는 Figma 화면 시안을 React 코드로 빠르게 옮겨 브라우저에서 검증하고 싶음. 이 작업을 Claude 워크플로우로 표준화.

기존 라이브러리는 손대지 않고, 소비자 앱 `07_figma-to-dev`에서 화면을 그림. 토큰·아이콘은 라이브러리가 SoT, 임의 값 금지. 매핑 누락은 즉시 멈춰서 라이브러리 쪽에서 해결.

**v2 변경점 (Codex 리뷰 반영)**:
- 라우터 자동 등록 (`import.meta.glob`)으로 화면별 수동 등록 제거
- 아이콘 키는 `chord-icons.tsx`의 실제 API(`ChordIconName` camelCase)에 맞춤. 폴백은 `nullMedium`
- Figma 산출물(스크린샷·raw 매핑)은 gitignored `_workspace/`로 분리, 커밋되는 매핑은 요약만

## 핵심 결정 요약

| 항목 | 결정 |
|---|---|
| 소비자 앱 셋업 | 독립 Vite+React 앱, `file:../04_wf-figma-to-react-components`로 라이브러리 의존 (완료) |
| 토큰 SoT | `@chord-ds/components/styles` (CSS 변수). 하드코딩 금지 |
| 아이콘 SoT | `<ChordIcon name="<ChordIconName>" />` 만. 실제 키는 camelCase (`nullMedium`, `arrowLeftMedium` 등). 미등록 시 폴백 `nullMedium` + TODO |
| 💠 DS 컴포넌트 매칭 실패 | 에러 리포트만 출력하고 화면 그리기 **중단** |
| Figma 데이터 소스 | `mcp__figma-official__get_design_context` |
| 라우터 | `import.meta.glob('./screens/*/index.tsx', { eager: false })` 자동 등록 |
| 산출물 위치(커밋) | `07_figma-to-dev/src/screens/<slug>/` |
| 산출물 위치(비커밋) | `07_figma-to-dev/_workspace/figma/<slug>/` (gitignored) |

## 사전 셋업 — 완료 상태 + 잔여 보강

기 완료:
- Vite+React+TS 앱 생성, `@chord-ds/components` file: 의존
- `src/main.tsx`에 `@chord-ds/components/styles` import
- `src/screens/_shared/`, `CLAUDE.md` 작성

**잔여 보강 (첫 화면 작업 전 필수)**:

1. **`src/App.tsx` 자동 라우팅 전환**
   - 정적 `SCREEN_MODULES` 제거. `import.meta.glob('./screens/*/index.tsx', { eager: false })`로 빌드타임 자동 수집.
   - 슬러그는 글롭 키에서 추출(`./screens/checkout-payment/index.tsx` → `checkout-payment`).
   - 화면 파일만 만들면 라우팅에 자동으로 잡힘 → Phase 5에서 등록 단계 불필요.

2. **`_workspace/` gitignore 추가**
   - `07_figma-to-dev/.gitignore` 신설 (또는 추가):
     ```
     _workspace/
     **/_figma-snapshot.png
     ```

3. **누락 아이콘 매핑 헬퍼 (선택, 첫 화면 후 도입)**
   - `src/screens/_shared/icon-resolver.ts`:
     ```ts
     import { chordIconAssets, type ChordIconName } from "@chord-ds/components";
     // figma의 raw 아이콘 명칭(ic_close_medium 같은 파일명) → ChordIconName(camelCase) 매핑.
     // 미발견 시 "nullMedium" 반환.
     ```
   - 첫 화면에서 어느 정도 케이스가 모이면 도입. 그전엔 인라인으로 수동 매핑.

4. **CLAUDE.md 업데이트**
   - 아이콘 폴백을 `nullMedium`으로 명시.
   - 산출물 구조 항목에 `_workspace/` 분리 반영.

## 화면 생성 워크플로우 (Phase 1~6, 화면당 반복)

### Phase 1 — Figma 컨텍스트 수집

입력: Figma 화면 노드 URL.

1. URL에서 `fileKey`, `nodeId` 파싱(`-` → `:`).
2. `mcp__figma-official__get_design_context({ fileKey, nodeId })` 호출.
3. 화면 슬러그 결정: 노드 이름을 kebab-case로.
4. **응답 저장 위치**: `07_figma-to-dev/_workspace/figma/<slug>/`
   - `context.json` (raw 응답)
   - `screenshot.png` (받은 PNG)
   - 이 폴더는 gitignored.

### Phase 2 — 레이어 트리 분석 & DS 컴포넌트 식별

`get_design_context` 응답으로 레이어 트리 훑기. 💠 마커 노드는 DS 인스턴스.

산출물(비커밋): `_workspace/figma/<slug>/_raw-mapping.md`
- 모든 노드 → 후보 React 컴포넌트, prop, 원본 figma nodeId 포함.

### Phase 3 — Code Connect 매핑 검증

각 💠 노드:
1. `get_design_context` 응답의 Code Connect 우선.
2. 없으면 `04_wf-figma-to-react-components/src/components/<X>/<X>.figma.tsx` 직접 확인.
3. **매칭 실패 시 즉시 중단**:
   ```
   ❌ 매칭 실패 (화면: <slug>)
   - 노드 <간단한설명> 
     사유: <원인>
     조치: src/components/<X>/<X>.figma.tsx 보강
   ```
   ※ 사유에 figma nodeId·내부 라벨 포함하지 말 것 (leak 방지). 기능적 설명만.

### Phase 4 — 아이콘 매핑 (수정됨)

각 아이콘 노드:

1. Figma 아이콘의 raw 이름을 `ChordIconName`(camelCase)로 변환 시도.
   - 컨벤션: `ic_close_medium` → `closeMedium`, `ic_arrow_left_medium` → `arrowLeftMedium`.
2. `04_wf-figma-to-react-components/src/assets/chord-icons.tsx`의 `chordIconAssets` export에 해당 키가 있는지 확인.
   - 있음 → `<ChordIcon name="closeMedium" size={...} />`
   - 없음 → **무조건** `<ChordIcon name="nullMedium" size={...} />` + 위에 주석:
     ```tsx
     {/* TODO(icon): figma "<원본 figma 아이콘명>" → chord-icons.tsx 등록 필요 */}
     ```
3. `src/assets/icons/`에 SVG 파일이 있어도 `chordIconAssets` 미등록이면 자체 import 금지. 라이브러리 PR로 처리.

확인 명령:
```bash
grep "^  [a-z]" 04_wf-figma-to-react-components/src/assets/chord-icons.tsx | grep ":" | head
```

### Phase 5 — 화면 코드 생성

위치: `07_figma-to-dev/src/screens/<slug>/index.tsx`
**※ 별도 라우터 등록 단계 없음** — `App.tsx`가 `import.meta.glob`로 자동 수집.

규칙:
1. import는 라이브러리 barrel만:
   ```tsx
   import { Avatar, IconButton, ChordIcon } from "@chord-ds/components";
   ```
2. 색·간격·폰트 인라인 금지. 토큰 CSS 변수만.
3. 다크/고정 surface는 host 노드에 `data-mode="fixed"`.
4. 컴포넌트 prop은 `*.figma.tsx`의 공개 API만. 내부 prop·CSS scale·임의 frame override 금지.
5. 정적 텍스트는 일단 하드코딩 가능. 추후 `_data.ts`로 분리 검토.

**커밋되는 매핑 노트**: `07_figma-to-dev/src/screens/<slug>/_mapping.md`
- 요약본만. **figma URL·fileKey·nodeId 포함 금지**.
- 형식 예:
  ```md
  # checkout-payment
  
  ## DS 컴포넌트 매핑
  - Avatar (size=large, mode=fixed) × 1
  - IconButton (icon=closeMedium) × 1
  - TextButton (variant=primary) × 2
  
  ## 미해결
  - [ ] icon "ic_apple_pay_medium": chord-icons.tsx 등록 필요
  ```
- 원본 figma context·스크린샷·nodeId 매핑은 `_workspace/figma/<slug>/`에만.

### Phase 6 — 검증

1. `npm run dev` → `http://localhost:5173/?screen=<slug>` 접속.
2. `_workspace/figma/<slug>/screenshot.png` ↔ 브라우저 화면 시각 비교.
3. `npm run typecheck` 통과 (특히 `ChordIcon name` 키 타입 체크).
4. 콘솔 에러 0 확인.
5. 커밋 전 leak 체크 (수동 또는 스크립트):
   ```bash
   git diff --cached | grep -E "figma\.com/(design|file)/|node-id=|DWEduE6GfxYMlyxKPNJ8jA" && echo "❌ leak 의심"
   ```

Phase 3·4에서 중단된 게 있으면 검증 진입 금지.

## 산출물 구조

```
07_figma-to-dev/
├─ CLAUDE.md
├─ plan/
│  └─ screen-generation-workflow.md   ← 본 문서
├─ .gitignore                          ← _workspace/ 차단
├─ _workspace/                         ← gitignored
│  └─ figma/
│     └─ checkout-payment/
│        ├─ context.json
│        ├─ screenshot.png
│        └─ _raw-mapping.md            ← nodeId·URL 포함, 커밋 안 됨
└─ src/
   ├─ App.tsx                          ← import.meta.glob 자동 수집
   ├─ main.tsx
   └─ screens/
      ├─ _shared/
      └─ checkout-payment/
         ├─ index.tsx
         ├─ index.module.css
         └─ _mapping.md                ← 요약본만, leak 안전
```

## 매칭 실패 / 누락 누적 처리

- 화면별 `_mapping.md`의 `## 미해결` 섹션에 (a) 매칭 실패 컴포넌트, (b) `nullMedium` 폴백된 아이콘 누적.
- 이 누적치가 04_wf 백로그의 입력. 주기적으로 PR.

## 주요 파일 참조

| 목적 | 경로 |
|---|---|
| Code Connect (컴포넌트별) | `04_wf-figma-to-react-components/src/components/<X>/<X>.figma.tsx` |
| 토큰 소스 | `04_wf-figma-to-react-components/tokens/tokens.{color,size,typography}.v1.0.json` |
| 토큰 빌드 산출물 | `04_wf-figma-to-react-components/src/styles/generated/tokens.css` |
| 아이콘 레지스트리 (camelCase 키) | `04_wf-figma-to-react-components/src/assets/chord-icons.tsx` |
| 아이콘 매니페스트 | `04_wf-figma-to-react-components/src/assets/chord-icon-medium-files.json` |
| 라이브러리 룰 | `04_wf-figma-to-react-components/docs/AI_RULES.md` |

## 엔드투엔드 검증 시나리오

새 화면 1개로 워크플로우 시연:
1. Figma URL 입력 → `get_design_context` → `_workspace/figma/<slug>/`에 저장.
2. 매핑 노트 자동 생성(요약은 src에, raw는 _workspace에).
3. 코드 생성 → `npm run dev` → `?screen=<slug>` 자동 잡힘.
4. 시각 비교 + typecheck + leak 체크.
5. 커밋.

성공 기준:
- 화면 1개당 30분 이내 완료
- 토큰·아이콘 하드코딩 0건 (`grep -rE "#[0-9a-fA-F]{3,6}" src/screens/`)
- typecheck 통과 (`ChordIcon name` 검증 포함)
- 커밋 diff에 figma URL·nodeId·fileKey 0건
- 매핑 누락이 있는데 코드 생성된 경우 0건

## Codex 리뷰 반영 추적

| 지적 | 반영 위치 |
|---|---|
| #1 라우터 미등록 (high) | "잔여 보강 1" — `import.meta.glob` 전환 |
| #2 ChordIcon API 불일치 (high) | "핵심 결정 요약" + Phase 4 — camelCase 키 + `nullMedium` 폴백 |
| #3 leak 게이트 부재 (medium) | "잔여 보강 2", Phase 1·5의 _workspace 분리, Phase 6의 leak grep |
