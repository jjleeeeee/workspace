# Chips Retrospective

Date: 2026-05-08

## Scope

- Implemented component: `Chips`
- Figma node: `59869:78921` (component set, 100 variants)
- Source note: `src/figma/chips.source.md`
- MCP reads: Framelink `get_figma_data` + Console MCP `figma_get_component` (Desktop Bridge)

## What Worked

- Desktop Bridge 연결 상태에서 Console MCP가 axes, tokens, layout, asset rules를 모두 한 번에 반환. Framelink read로 구조를 파악한 뒤 Console MCP로 보완하는 2단계 흐름이 효율적이었다.
- Alpha token 처리: `system/color/button/disabled` 토큰이 이미 `#0000001A` (alpha 포함)임을 CSS variable 값으로 확인해, CSS `opacity` 추가 없이 토큰만 사용하는 결정을 source note에 명확히 기록할 수 있었다.
- `Type=Image` + `Size=Small` invalid 조합 normalize를 컴포넌트 내부에서 처리하고 테스트로 계약을 고정. 잘못된 prop 조합이 runtime에서 조용히 깨지지 않는다.
- boolean props (`marquee`, `badge`, `badgeNumber`)를 `data-*` 속성으로 반영해 CSS 훅 포인트를 열어뒀다. 현재는 badge 렌더링이 없지만 CSS selector 만으로 외부 스타일 적용 가능한 구조다.
- `icon`, `image` slot props를 Storybook Controls에서 제외. Figma-facing props 9개만 노출되는 것을 stories test로 고정.

## What Needs Improvement

- `Gradient_Mask` (Marquee overflow masking) 미구현. `marquee` prop은 수락하지만 `mask-image` 효과가 없어 Known Gap으로 남겼다. CSS `mask-image` 구현 시 별도 티켓 필요.
- Typography token `body-s/system-500`의 concrete font-family 미확인. Token system을 통해 해석하도록 남겼고, Known Gap에 기록했다. 추후 font rendering diff가 발생하면 여기서 시작.
- `Type=Image` Img frame의 border-radius 픽셀값 정확한 확인 불가. `border-radius: 50%` 로 구현했으나 visual smoke 시 조정 필요.
- Badge_Dot / Badge_Number는 이미 구현된 atom을 사용하도록 컴포넌트 설계했으나, 실제 렌더링과 절대 위치 지정은 v1에서 미구현. Known Gap.
- `Badge_Dot` 위치를 처음에는 top overlay처럼 해석했지만, Figma node `82119:48720` 재확인 결과 `8x14` trailing frame 안의 `4x4` visible dot 구조였다. wrapper frame과 visible glyph를 분리해서 읽어야 한다.

## Workflow Notes

- `workflow/exceptions.md` 규칙 수정: Desktop Bridge 미연결 시 "계속 진행" → "모든 작업 중단, 사용자에게 연결 요청"으로 강화. 이 세션에서 직접 변경.
- Framelink → Console MCP 순서 준수 확인. 컴팩션 후 재시작 시 순서가 끊어 보일 수 있으므로 주의.

## Validation Result

- `npm test`: 192/192 passed (61 files)
- `npm run typecheck`: passed (no errors)
- `npm run build-storybook`: passed
- `npm run visual:baseline`: passed
- `npm run visual:diff`: all PASS (기존 컴포넌트 regression 없음)
- `chips-badge-dot`: PASS, `visualMatch=0.985662`

## Known Gaps (v1)

- `Gradient_Mask` Marquee overflow masking은 CSS fade mask approximation으로 구현했으며, Figma nested component import는 하지 않았다.
- `Type=Image`는 Figma Img fixture를 local file로 저장해 기본 렌더링한다. Product media는 consumer `image` slot으로 교체해야 한다.
- Type=Icon 기본값은 Figma `ic_null_medium` marker다. Product icon은 consumer `icon` slot으로 공급해야 한다.
- Typography는 `WeGothicSans` system alias를 우선하고 token fallback을 둔다. Font anti-aliasing diff는 별도 visual review 대상이다.

## Lessons Promoted

- [knowledge/component-complexity/partial-coverage-labeling.md](../knowledge/component-complexity/partial-coverage-labeling.md)
  - 승격 여부: already promoted
  - 메모: Figma에서 nested layer를 읽은 것과 실제 component coverage는 분리해서 기록해야 한다. 초기 Chips 구현은 `Badge_Dot`/`Badge_Number`를 읽었지만 렌더링하지 않았고, `complete`로 표기해 오해를 만들었다.
- [knowledge/figma-reading/default-screenshot-is-not-contract.md](../knowledge/figma-reading/default-screenshot-is-not-contract.md)
  - 승격 여부: already promoted
  - 메모: `57x36`, `77x36`, `79x36`은 특정 props와 label의 sample result이며 CSS min-width가 아니다.
- [knowledge/visual-validation/media-dependent-baselines.md](../knowledge/visual-validation/media-dependent-baselines.md)
  - 승격 여부: reused
  - 메모: `Type=Image`는 consumer media slot이지만 Figma fixture를 local reference로 저장해야 Storybook branch 검증이 실제로 가능하다.
- [knowledge/figma-reading/visible-glyph-vs-wrapper-frame.md](../knowledge/figma-reading/visible-glyph-vs-wrapper-frame.md)
  - 승격 여부: promoted
  - 메모: `Badge_Dot`은 칩 기준 absolute overlay가 아니라 `8x14` trailing frame 안에 놓인 `4x4` dot이었다. 작은 부착 요소는 wrapper frame과 visible glyph bounds를 분리해서 기록해야 한다.

## Next Component

**Text_Fields** (Atom) — Dropdown_Box 선행 조건이므로 우선 처리.
