---
name: test-tool
description: MCP 도구 로컬 테스트 방법
---

## 로컬 테스트 방법

### 빌드
```bash
npm run build
```

### MCP Inspector로 테스트
```bash
npx @modelcontextprotocol/inspector node dist/index.js
```

### 환경 변수 확인
```bash
echo $FIGMA_ACCESS_TOKEN  # figd_ 로 시작해야 함
```

### 테스트용 nodeId 확인
04_wf 프로젝트의 `../design-cds-docs/99_ref/ref-figma-component-keys/chord-ds/index.md` 참조
