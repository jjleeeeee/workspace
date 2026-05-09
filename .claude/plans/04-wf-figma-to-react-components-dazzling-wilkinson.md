# Plan: ENABLE_TOOL_SEARCH=always 설정

## 작업 내용

`~/.claude/settings.json`의 `env` 섹션에 한 줄 추가.

```json
"env": {
  ...기존 항목들...,
  "ENABLE_TOOL_SEARCH": "always"   ← 추가
}
```

**파일**: `/Users/jj.iee/.claude/settings.json`

**효과**: MCP 도구 ~190개를 세션 시작 시 전부 시스템 프롬프트에 박는 대신, Claude가 필요할 때 검색해서 lazy load → 컨텍스트 절약.

## 검증
Claude Code 재시작 후 새 대화에서 MCP 툴 수가 줄어든 것 확인.

---

# Plan: MCP 서버 정리

## 작업 내용

`~/.claude.json` 파일 하나만 수정.

| 서버 | 위치 | 작업 |
|---|---|---|
| `obsidian-wiki` | `mcpServers.obsidian-wiki` (글로벌) | 키 삭제 |
| `shadcn` | `projects["/Users/jj.iee"].mcpServers.shadcn` (홈 프로젝트) | 키 삭제 |

## 검증
Claude Code 재시작 후 `mcp__obsidian-wiki__*`, `mcp__shadcn__*` 툴 사라짐 확인

---

# Plan: Code Connect 설정 (완료)

## Context
37개 React 컴포넌트가 완성된 상태에서 Figma Dev Mode에 코드 스니펫을 연결.
소스 노출 없이 import + 기본 사용법만 표시하는 것이 목표.
index.md에 모든 node ID / component set key 정리되어 있음.

- Figma 파일 키: `DWEduE6GfxYMlyxKPNJ8jA`
- 파일 URL: `https://www.figma.com/design/DWEduE6GfxYMlyxKPNJ8jA`

## 작업 범위

### 1. 패키지 설치
```bash
npm install -D @figma/code-connect
```

### 2. Figma 토큰 설정
토큰은 `~/.claude.json`의 `mcpServers.figma-official.headers.X-Figma-Token`에 저장되어 있음.
publish 시 해당 값을 환경변수로 사용:
```bash
FIGMA_ACCESS_TOKEN=$(python3 -c "import json; d=json.load(open('/Users/jj.iee/.claude.json')); print(d['mcpServers']['figma-official']['headers']['X-Figma-Token'])")
```

### 3. 파일 구조
컴포넌트별 `.figma.tsx` 파일을 각 컴포넌트 폴더에 생성:
```
src/components/
├── Tag/
│   ├── Tag.tsx
│   ├── Tag.figma.tsx  ← NEW
├── Divider/
│   ├── Divider.tsx
│   ├── Divider.figma.tsx  ← NEW
...
```

### 4. 파일 형식 (보안: 사용법만 노출)
```tsx
// Tag.figma.tsx
import figma from '@figma/code-connect'
import { Tag } from './Tag'

figma.connect(Tag, 'https://www.figma.com/design/DWEduE6GfxYMlyxKPNJ8jA?node-id=30256-32826', {
  props: {
    color: figma.enum('Color', {
      primary: 'primary',
      gray: 'gray',
      white: 'white',
      red: 'red',
    }),
    size: figma.enum('Size', { small: 'small', medium: 'medium' }),
    tagType: figma.enum('Type', { line: 'line', fill: 'fill' }),
  },
  example: ({ color, size, tagType }) => (
    <Tag color={color} size={size} tagType={tagType} label="텍스트" />
  ),
})
```

### 5. 우선 구현할 컴포넌트 (단순한 것부터)

| 컴포넌트 | Node ID | 이유 |
|---|---|---|
| Divider | `10379:40800` | props 가장 단순 |
| Tag | `30256:32826` | 대표적 |
| BadgeDot | `8451:112783` | 단순 |
| BadgeNumber | `8451:113030` | 단순 |
| Skeleton | `12447:42302` | 단순 |

나머지 32개는 동일 패턴으로 순차 추가.

### 6. figma.config.ts (publish 범위 지정)
```ts
// figma.config.ts
import { defineConfig } from '@figma/code-connect'

export default defineConfig({
  include: ['src/components/**/*.figma.tsx'],
})
```

### 7. Publish
```bash
npx figma connect publish --token $FIGMA_ACCESS_TOKEN
```

## 일괄 삭제 (필요 시)
```bash
npx figma connect unpublish --token $FIGMA_ACCESS_TOKEN
```

## 검증
- Figma Dev Mode에서 컴포넌트 클릭 → "Code" 탭에 스니펫 표시 확인
- 소스 코드 내용 미노출 확인

## 전제 조건
- Figma Personal Access Token 필요 (Settings → Personal access tokens → Create new token)
- Token scope: `File content` (read)
