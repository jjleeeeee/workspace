# LLM Wiki in Obsidian 구축 플랜

## Context

Andrej Karpathy의 LLM Wiki 패턴을 활용해 Obsidian에 AI 기반 지식 관리 시스템을 구축한다.
소스(아티클, 메모, 업무 자료, AI 관련 내용)를 넣으면 Claude가 자동으로 엔티티/개념을 추출해
위키 페이지로 정리하고 쿼리도 가능한 "두 번째 뇌"를 만드는 것이 목표.

현재 상황: Obsidian 설치됨, vault는 거의 비어있음.

---

## 접근 방식: claude-obsidian 직접 설치 (Option 1 — Vault로 클론)

### 단계 1: 레포 클론 & vault 설정 (~2분)

```bash
git clone https://github.com/AgriciDaniel/claude-obsidian /Users/jj.iee/Desktop/workspace/02_knowledge_wiki
cd /Users/jj.iee/Desktop/workspace/02_knowledge_wiki
bash bin/setup-vault.sh
```

setup-vault.sh가 자동으로 처리하는 것:
- `graph.json` — 그래프 필터/색상 설정
- `app.json` — 플러그인 디렉토리 제외 설정
- `appearance.json` — CSS 적용

### 단계 2: Obsidian에서 vault 열기

1. Obsidian 실행
2. **Manage Vaults → Open folder as vault → `my-wiki/` 선택**
3. Settings → Community Plugins에서 활성화:
   - Calendar, Thino, Excalidraw, Banners (이미 포함됨)
4. 추가 설치 권장:
   - **Templater** — frontmatter 자동 완성
   - **Obsidian Git** — 15분마다 자동 커밋 (지식 백업)
   - **Obsidian Web Clipper** (브라우저 확장) — 웹 페이지 원클릭 캡처

### 단계 3: Claude Code MCP 연동 (선택, 추천)

Filesystem 기반 MCP 연결 (플러그인 불필요):

```bash
claude mcp add-json obsidian-vault '{
  "type": "stdio",
  "command": "npx",
  "args": ["-y", "@bitbonsai/mcpvault@latest", "/Users/jj.iee/Desktop/workspace/02_knowledge_wiki"]
}' --scope user
```

### 단계 4: Claude Code에서 `/wiki` 초기화

```bash
cd /Users/jj.iee/Desktop/workspace/02_knowledge_wiki
claude  # Claude Code 실행
# Claude Code 내에서:
/wiki
```

---

## 생성되는 구조

```
my-wiki/
├── wiki/
│   ├── index.md         ← 전체 위키 인덱스
│   ├── log.md           ← 수집 로그
│   ├── hot.md           ← 핫 캐시 (최근 컨텍스트)
│   ├── concepts/        ← 개념 페이지들
│   ├── entities/        ← 엔티티(인물/기업/툴) 페이지들
│   └── sources/         ← 원본 소스 참조
├── _templates/          ← 노트 템플릿
├── .raw/                ← 원본 파일 보관
└── CLAUDE.md            ← 위키 동작 정의
```

---

## 주요 사용 명령어

| 명령어 | 용도 |
|--------|------|
| `/wiki` | 초기화 및 상태 확인 |
| `ingest [파일/URL]` | 소스 추가 및 자동 위키화 |
| `what do you know about X?` | 위키 검색 및 답변 |
| `/autoresearch [주제]` | 자율 웹 리서치 후 저장 |
| `/lint` | 깨진 링크, 모순 감지 |

---

## 사용 시나리오 (jj.lee 케이스)

- **AI/LLM 지식**: 아티클 URL이나 PDF를 `ingest`하면 개념/엔티티 자동 추출
- **업무/프로젝트**: Weverse 관련 자료를 넣으면 프로젝트별 위키 생성
- **개인 메모**: 아이디어 메모 → `ingest` → 관련 기존 지식과 자동 연결
- **웹 클리핑**: 브라우저에서 웹 클리퍼로 캡처 → vault에 저장 → `ingest`

---

## 검증 방법

1. `/wiki` 실행 후 `wiki/index.md` 생성 확인
2. 테스트 소스 하나 ingest: `ingest [아티클 URL]`
3. `wiki/concepts/`, `wiki/entities/` 폴더에 파일 생성 확인
4. Obsidian 그래프 뷰에서 노드 연결 확인
5. `what do you know about [ingested topic]?`으로 쿼리 테스트

---

## 전제조건 확인 필요

- [ ] Claude Code CLI 설치 여부: `claude --version`
- [ ] Node.js 설치 여부: `node --version`
- [ ] Obsidian 버전 v1.9.10 이상 (Bases 플러그인 지원)
