# 왜 DESIGN.md인가

AI 코딩 도구를 위한 디자인 시스템 문제 정의

스펙의 첫 문장부터 왜 이 포맷이 필요한지가 박혀 있어요.

> **L6** DESIGN.md is a self-contained, plain-text representation of a design system. It defines the visual identity of a brand and product, thereby ensuring that these stylistic choices can be followed across design sessions and between different AI agents and tools.

**한국어:** DESIGN.md는 디자인 시스템을 한 파일짜리 일반 텍스트로 표현하는 방식이에요. 브랜드·제품의 시각 정체성(색·폰트·톤)을 이 파일에 담아 두면, 어느 날·어느 도구·어느 AI를 써도 같은 스타일을 유지할 수 있어요.

## 핵심 단어 3개 뜯어보기

- **self-contained(자급자족)** — 서버·DB·디자인 툴 없이 이 파일 하나만 있으면 끝. 이미지·폰트 바이너리 같은 외부 의존도 없어요.
- **plain-text(일반 텍스트)** — 메모장으로도 열려요. 그래서 git으로 버전 관리되고, PR에서 한 줄씩 리뷰되고, AI한테 통째로 복사해서 붙여넣을 수도 있어요.
- **across different AI agents and tools(도구·AI를 넘나드는)** — 같은 파일을 Cursor·Claude·Codex·Figma·Tailwind가 모두 읽을 수 있어야 한다는 뜻.

## 풀려는 문제 — 디자인 정보가 세 곳에 흩어져 있다

실제 팀에서 디자인 시스템은 보통 이렇게 쪼개져 있어요.

**① Figma 변수**  
디자이너만 편집 가능. AI·코드가 직접 읽기 어려워요.

**② tailwind.config.js / tokens.json**  
개발자가 쓰는 값 파일. 숫자는 있는데 왜 그 숫자인지는 빠져 있어요.

**③ 스타일 가이드 문서 (Notion/PDF)**  
사람용 설명서. 기계는 읽기 어렵고, 내용이 금방 낡아요.

**→ DESIGN.md:** 셋을 한 파일로 합쳐요. 윗부분은 기계용 값, 아랫부분은 사람·AI용 설명.

**셋이 나뉘어 있으면 생기는 일**

스타트업 A 팀. 디자이너는 Figma에 primary 컬러 저장, 개발자는 tailwind.config.js에 hex 값 저장, PM은 Notion에 "우리 브랜드는 '따뜻한 오렌지'를 씁니다"라고 적어뒀어요.

신입 엔지니어가 Cursor한테 "새 랜딩 페이지 만들어줘"라고 시키면 — Cursor는 이 세 곳 중 어디도 자동으로 못 봐요. 결국 자기 마음대로 파란색을 골라 써요. PM이 보고 "이거 우리 브랜드 컬러 아니야"라며 돌려보내고, 다시 작업이 반복돼요.

## "AI 코딩 도구가 1등 독자"라는 가정

DESIGN.md의 첫 번째 독자는 사람이 아니에요. AI 코딩 도구(Cursor·Claude·Codex 등)예요. 이 가정이 포맷 전체의 생김새를 결정해요. "에이전트가 이 파일을 읽으면 Public Sans 헤드라인에 보스턴 클레이(#B8422E) 버튼이 자동으로 나와야 한다" — 이 정도로 기계가 곧바로 쓸 수 있는 정보가 들어 있어야 한다는 거예요.

## 핵심 인사이트

디자인 시스템의 1등 독자를 AI로 바꾸면 포맷이 통째로 바뀌어요. 예쁜 PDF 가이드북이 아니라, 기계가 바로 값을 뽑아 쓸 수 있고 + 사람이 왜 그런지를 옆에 글로 적어 둔 한 파일이 정답이 돼요. DESIGN.md는 Figma·Tailwind·Notion으로 흩어진 정보를 단 하나의 원본(single source of truth)으로 모으려는 시도예요.

## 체크리스트

- self-contained · plain-text · cross-tool 세 단어의 의미를 쉬운 말로 풀 수 있다
- 기존 디자인 시스템이 세 곳(Figma / Tailwind / Notion)에 흩어져서 생기는 실제 문제를 떠올릴 수 있다
- "AI가 1등 독자"라는 가정이 포맷 모양에 어떻게 영향을 주는지 설명할 수 있다
