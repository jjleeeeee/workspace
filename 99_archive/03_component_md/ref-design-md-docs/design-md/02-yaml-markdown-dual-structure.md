# YAML + 마크다운 이중 구조

기계용 층과 사람용 층의 물리적 분리

> **L8** A DESIGN.md file contains two parts: An optional YAML frontmatter, and a markdown body. The YAML front matter contains machine-readable design tokens. The markdown body sections provide human-readable design rationale and guidance.

**한국어:** DESIGN.md 파일은 두 부분으로 나뉘어요. 맨 위에 YAML 프론트매터(선택)가, 그 아래에 마크다운 본문이 와요. 프론트매터에는 색·폰트·간격 같은 기계가 바로 읽을 수 있는 값(디자인 토큰)이 들어가고, 본문에는 왜 이렇게 정했는지, 어떻게 써야 하는지를 사람이 읽는 글로 적어요.

DESIGN.md의 가장 근본적인 설계 결정이에요. 파일은 하나, 층은 두 개.

## 왜 둘로 나눴을까

같은 내용을 누가 읽느냐에 따라 형식을 다르게 둔 거예요.

**YAML (기계용)**  
프로그램이 실수 없이 값을 뽑을 수 있어야 해요. `#1A1C1E`·`16px`·`24px`처럼 딱 정해진 값만 둡니다.

**Markdown (사람·AI용)**  
"이 색은 가장 중요한 버튼에만 쓴다", "Public Sans는 본문 가독성을 위해 골랐다" 같은 이유·문맥을 자연스러운 글로 적어요.

## 왜 둘을 같은 파일에 묶었을까

따로 두면 금방 어긋나거든요. (= "드리프트"라고 불러요 — 원래는 같이 움직여야 할 것들이 점점 멀어진다는 뜻.)

**흔한 엇박자 시나리오**

디자인 팀이 세 곳에 자료를 나눠 두었다고 해봐요. ① Figma 변수 ② 개발자가 쓰는 tailwind.config.js ③ 스타일 가이드 Notion 문서.

디자이너가 Figma에서 주조색을 `#1A1C1E` → `#0D0F11`로 살짝 어둡게 바꾸고 슬랙에 공유했어요. 개발자는 tailwind 값을 고쳤는데, Notion은 아직 옛날 hex 그대로. 신입 디자이너가 Notion을 보고 작업하면 다른 색을 씁니다.

반대로 개발자가 tailwind.config.js에서 값만 바꾸고 왜 바꿨는지를 어디에도 안 적었어요. 6개월 뒤 아무도 이 색의 이유를 기억하지 못해요.

DESIGN.md는 이걸 한 파일의 위(토큰)와 아래(설명)에 붙여 놓고, 같은 커밋으로 같이 바뀌도록 만들어요. 토큰을 고치면 바로 옆의 설명도 자연스럽게 같이 손보게 되는 구조 — 엇박자가 생길 자리 자체를 없애버린 거죠.

## YAML 구획의 경계선

> **L17** The front matter block must begin with a line containing exactly `---` and end with a line containing exactly `---`.

**한국어:** 프론트매터(YAML 영역)는 딱 `---`만 있는 줄로 시작하고, 똑같이 `---`만 있는 줄로 끝내야 해요. 뒤에 공백 하나, 글자 하나라도 붙으면 안 됩니다.

"exactly"(정확히)를 굳이 강조한 이유가 있어요. 예를 들어 `--- ` (뒤에 공백)이나 `----`(대시 4개)는 유효하지 않아요. 프로그램이 "여긴 YAML, 여긴 마크다운"을 헷갈릴 일이 없게 애매한 구분자를 처음부터 막은 거예요.

## 본문의 감성 이름과 토큰의 시스템 이름

> **L8** Prose may use descriptive color names (e.g., "Midnight Forest Green") that correspond to systematic token names (e.g., primary). The tokens are the normative values; the prose provides context for how to apply them.

**한국어:** 본문 설명에서는 "Midnight Forest Green"(한밤의 숲 녹색) 같은 감성 이름을 써도 돼요. 대신 YAML 토큰에서는 `primary` 같은 시스템 이름을 쓰고요. 둘이 같은 색을 가리킨다고 AI·사람이 스스로 매칭할 수 있도록 배치해요.

그리고 중요한 한 줄: 토큰이 규범(진짜 값)이고, 본문은 그걸 어떻게 쓸지 설명하는 주석이에요. 둘이 안 맞을 때는 토큰이 이깁니다.

**구체 예시**

본문에 이렇게 적혀 있어요:

- **Primary (#1A1C1E):** 헤드라인·본문에 쓰는 깊은 먹색.
- **Tertiary (#B8422E):** "보스턴 클레이" — 버튼 같은 주요 액션에만.

"깊은 먹색", "보스턴 클레이" 같은 감성 이름은 사람·AI가 톤을 잡을 때 쓰는 별명.  
`primary`, `tertiary`는 시스템이 참조할 때 쓰는 공식 이름.  
hex를 본문에도 같이 적어 두면 AI가 두 이름을 연결하기 쉬워져요.

## 핵심 인사이트

"같은 것을 기계용·사람용 두 형식으로, 한 파일 안에 담는다." 이 구조 하나가 디자인 시스템이 오래 살아남는 열쇠예요. 토큰만 있으면 AI가 왜 그런지 모르고, 설명만 있으면 정확한 값이 없어요. 둘을 물리적으로 같은 파일에 두면 어느 한쪽만 혼자 늙는 일이 사라집니다.

## 체크리스트

- YAML(기계용)과 마크다운(사람용)의 역할을 한 문장씩 말할 수 있다
- "엇박자(드리프트)"가 왜 생기는지 내 주변 예시로 설명할 수 있다
- 프론트매터 구분자 `---`가 정확히 일치해야 하는 이유를 안다
- 본문의 "Midnight Forest Green"이 토큰의 `primary`와 같은 것을 가리킨다는 게 무슨 뜻인지 이해한다
- 토큰과 본문이 충돌할 때 어느 쪽이 이기는지 안다
