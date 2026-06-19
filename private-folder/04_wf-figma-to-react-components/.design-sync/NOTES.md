# Design Sync Notes

## Build Fixes

- `dist/index.d.ts` 미존재 → `dist/components/index.d.ts`를 가리키는 barrel 수동 생성. [GENERAL] package.json `types` 경로 불일치 — 빌드 재실행 후 재생성 필요.
- `cssEntry: "./dist/components.css"` 명시 설정 (CSS 자동 감지 실패).
- DropdownBox, TextFields — `src/components/index.ts` 미포함 WIP 컴포넌트. `titleMap: null`로 제외.
- FigmaCompare 스토리 전체 skip — 외부 이미지 의존 (ASSETS_BLOCKED); 프로덕션 컴포넌트 스토리가 아님.
- GRID_OVERFLOW 14개 컴포넌트 → `cardMode: "column"` 적용.

## Grading Learnings

- **Canvas/iframe 스케일 차이**: preview가 storybook보다 작게 렌더링 — 프레이밍 아티팩트, content/composition 동일하면 `match`.
- **ASSETS_BLOCKED (ds-preview.invalid)**: 양쪽 패널 동일하게 차단 — 일반 컴포넌트 스토리 그레이딩에 영향 없음.
- **애니메이션 전용 스토리**: static 스크린샷에서 양쪽 공백 = `match` (LoadingCircular).
- **cardMode=column 너비**: preview iframe이 부모 컨테이너를 채우지 않아 트랙형 컴포넌트가 storybook보다 좁게 표시됨 → `close` 수용.
- **시스템 폰트 폴백**: WeGothicSans/Pretendard 미탑재 → 양쪽 패널 폰트 동일한 system font. 약간 작게 표시 → `close` 수용.
- **TopNavigation SVG 폴백**: 아이콘 슬롯에 SVG fallback 텍스트 — 양쪽 동일, 에셋 갭이지 렌더링 문제 아님.
- **cardMode 없는 wide 컴포넌트 스케일**: Search/ToggleSwitch Playground가 storybook보다 작게 렌더링 — cardMode viewport 제약. Variants/States 스토리는 match. `close` 수용.

## Close Components (현재 싱크 기준)

- `Search`: Playground preview 스케일 축소 (cardMode viewport 제약). Variants/States 정확.
- `ToggleSwitch`: Playground preview 스케일 축소 (cardMode viewport 제약). Variants/States 정확.

## Re-sync Risks

- `dist/index.d.ts`는 수동 생성 파일 — `npm run build:lib` 재실행 후 덮어씀. 빌드 후 항상 재생성: `echo "export * from './components/index';" > dist/index.d.ts`
- `npm run build:lib` 실행 시 `.design-sync/sb-reference`도 stale 상태가 됨 — `npx storybook build -c .storybook -o .design-sync/sb-reference` 재빌드 필요.
- 컴포넌트 추가/삭제 시 `src/components/` + `src/components/index.ts` 양쪽 반영 확인 후 build:lib → sb-reference 순으로 재빌드.
- 폰트 (WeGothicSans, Pretendard, CircularXX TT) 미탑재 — 재싱크 시 폰트 파일 추가 검토.
- FigmaCompare 스토리 skip 유지 — 외부 이미지 의존성 변경 없는 한.
- `--entry dist/index.js` flag: resync.mjs가 node_modules에서 pkg를 못 찾을 때 필요. driver 실행 시 추가: `node .ds-sync/resync.mjs --entry dist/index.js`
