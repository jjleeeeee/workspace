# CLAUDE.md — 07_figma-to-dev

Figma 화면 → React 화면 생성 소비자 앱.
라이브러리: `04_wf-figma-to-react-components` (`@chord-ds/components`).

## 워크플로우

Figma URL 수신 → `get_design_context` → 레이어 분석 → 코드 생성 → `npm run dev` 검증.
상세 절차: `plan/screen-generation-workflow.md`

## 절대 금지

- 색/간격/폰트 하드코딩. 토큰 CSS 변수(`var(--cds-...)`)만.
- `<ChordIcon>` 외 임의 SVG import·인라인 드로잉.
- 등록 안 된 아이콘: 폴백은 `<ChordIcon name="nullMedium" />` (camelCase 키), TODO 주석 필수.
  - 키 확인: `04_wf-figma-to-react-components/src/assets/chord-icons.tsx`의 `chordIconAssets` export.
  - 파일명(`ic_close_medium.svg`) ≠ 키(`closeMedium`). 키 기준으로 사용.
- 💠 DS 컴포넌트 Code Connect 매핑 누락 시 코드 생성 진행 금지 → 에러 리포트 후 중단.
- `04_wf-figma-to-react-components` 라이브러리 코드 수정. 변경 필요 시 해당 PR로.
- `_workspace/`를 git에 커밋. figma URL·nodeId·fileKey를 커밋 diff에 포함.

## 산출물 구조

```
src/screens/<slug>/       ← 커밋됨
  index.tsx
  index.module.css
  _mapping.md             ← 요약만, nodeId/URL 금지

_workspace/figma/<slug>/  ← gitignored (Figma raw 데이터)
  context.json
  screenshot.png
  _raw-mapping.md
```

화면 파일 추가 시 라우팅 자동 등록 (`import.meta.glob`). `App.tsx` 수정 불필요.

## 커밋 전 leak 체크

```bash
git diff --cached | grep -E "figma\.com/(design|file)/|node-id=|DWEduE6GfxYMlyxKPNJ8jA" && echo "❌ leak 의심"
```

## 라이브러리 업데이트 반영

```bash
cd ../04_wf-figma-to-react-components && npm run build:lib
cd ../07_figma-to-dev && npm install
```
