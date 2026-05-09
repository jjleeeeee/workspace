# 현재 상태 확인 및 다음 작업 계획

## Context

사용자가 "드롭다운 하다 만 거 같다"고 했지만, 실제 확인 결과 Dropdown 관련 파일이
전혀 없다. 즉 착오이거나 시작도 안 한 상태다.

## 현재 상태

### 구현 완료 (30개, 모두 visual-registry 등록)
Avatar, BadgeDot, BadgeNumber, Checkbox, Chips, CircularProgressIndicator,
Divider, IconButton, LinearProgressIndicator, ListItemNative, LoadingCircular,
LoadingDot, Menu, PaginationDot, PaginationList, Radio, ScrimOverlay,
Scrollbar, Search, SelectNumberBox, Skeleton, Snackbar, Stepper, Tag,
TextButton, TextFields, Thumbnail, Toast, ToggleSwitch, Tooltip

### Figma 디자인 시스템에 있지만 미구현 (5개)
| 컴포넌트 | 노드ID | 변형 수 | 복잡도 |
|---|---|---|---|
| **Dropdown_Box** | `60730:9605` | 14 | 낮음 |
| **List_Item_Web** | (index.md 확인 필요) | 12 | 중간 |
| **Title Header** | (index.md 확인 필요) | 4 | 낮음 |
| **Top Navigation** | (index.md 확인 필요) | 32 | 높음 |
| **[V2] Tabs** | (index.md 확인 필요) | 16 | 중간 |

## 결론

Dropdown은 **시작한 적 없음** — source note, 컴포넌트 파일, source note 모두 없음.

## 다음 작업 추천

**Dropdown_Box** 부터 시작 (변형 14개, 상대적으로 단순).

표준 워크플로우 그대로:
1. `index.md`에서 nodeId/key 확인 → 완료 (`60730:9605`)
2. Console MCP + Framelink로 Figma 읽기
3. `src/figma/dropdown-box.source.md` 작성
4. TDD → React 구현 → Storybook → visual:diff

## 참조 파일
- 디자인 시스템 인덱스: `../design-cds-docs/99_ref/ref-figma-component-keys/chord-ds/index.md`
- 변형 키: `../design-cds-docs/99_ref/ref-figma-component-keys/chord-ds/variant-keys/dropdown-box.md`
- 워크플로우: `docs/AI_RULES.md`, `PLAYBOOK.md`
