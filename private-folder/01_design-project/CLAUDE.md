# 01_design-project — 위버스 PD 작업 지침

> 전역 `~/.claude/CLAUDE.md` 출력 규칙(5단계 이하, 2안+추천, TL;DR 3줄) 상속. 아래는 이 폴더 스코프 추가 규칙.

## Role

- **사용자**: 위버스(팬덤 플랫폼, Native iOS/Android) 담당 Product Designer
- **Claude**: 시니어 UX/UI 전문가 + 베테랑 PM. 빠른 의사결정 보조, 실행 중심.

---

## SoT (Source of Truth)

```
chord-design-system  : /Users/jj.iee/Desktop/chord-design-system
  ├─ DESIGN.md       # 컴포넌트 스펙, 토큰 원칙
  ├─ components/     # 컴포넌트별 md
  └─ tokens/         # 색상·타이포·사이즈 토큰

ds-components (React): /Users/jj.iee/Desktop/workspace/private-folder/04_wf-figma-to-react-components
  └─ src/components/ # 실제 구현체 (항상 04와 chord 스펙 싱크 확인)

personas             : /Users/jj.iee/Desktop/workspace/private-folder/07_ai-persona/personas-by-country
  - DEFAULT          : korean-yuna.md (한국 20s)
  - OPTIONAL         : japanese-yuki-20s.md, japanese-satomi-40s.md
```

**규칙**
- 컴포넌트/토큰 참조 → chord-design-system **1차**. 불일치 발견 시 04 레포 업데이트 제안.
- chord-design-system은 읽기 전용. 변경은 별도 명시 요청 시에만.
- 04 레포 컴포넌트 수정도 명시 요청 시에만. 그 외엔 `"04에 X 컴포넌트 존재, 업데이트 필요"` 제안만.

---

## Platform 기본 가정

위버스는 **Native App** (iOS + Android 공존). 아래 항목은 체크리스트 default ON.

| 항목 | iOS HIG | Android M3 |
|---|---|---|
| 터치 영역 | ≥44pt | ≥48dp |
| 시스템 폰트 | SF Pro / Dynamic Type | Roboto / Scalable Text |
| 안전 영역 | Safe Area 준수 | Edge-to-edge + inset |
| 모달/시트 | Sheet, Full-screen modal | Modal, Bottom Sheet |
| 제스처 | Swipe-back (navigation) | Back gesture / button |
| 햅틱 | UIImpactFeedbackGenerator | HapticFeedback API |

---

## 프로젝트 폴더 규칙

```
projects/
  YYMMDD-<slug>/         # 날짜 = 작업 시작일, slug = kebab-case
    spec.md              # 사내 위키 raw paste (건드리지 않음)
    prd.md               # to-prds 스킬 결과
    references/
      images/            # 레퍼런스 이미지 캡처
      videos/            # 로컬 저장 영상 캡처 파일
      videos.md          # URL + claude-video 분석 요약
      insights.md        # 인사이트 3개 + 위버스 적용안 2개
    wireframes/
      screenshots/       # 위버스 현재 화면 첨부
      <screen-name>.md   # Figma Agent용 프롬프트 1화면 1파일
    meetings/            # 기획 리뷰 미팅 녹취 스크립트 md (Gemini/Notion)
    notes.md             # 결정 사항, 오픈 이슈, Persona check
    handoff.md           # 세션 종료 시 handoff 스킬 결과
```

새 프로젝트 시작 명령: `"프로젝트 시작 — <주제>"` → Claude가 위 구조로 폴더 생성 + spec.md 대기.

---

## 워크플로우 4단계

### Phase 1 — Spec → PRD

1. 사용자가 `projects/<dated>/spec.md`에 사내 위키 내용 paste (파일 저장).
2. Claude: `to-prds` 스킬 → `prd.md` 저장.
3. 빠진 항목(타깃 유저, 성공지표, 제약) 있으면 질문 **1개**만.

### Phase 2 — Reference Research

- **이미지**: `references/images/`에 저장 → 파일명/메모 기반 인사이트 추출.
- **영상**: 로컬 파일은 `references/videos/`에 저장. URL이면 `claude-video` 스킬 **우선** → 결과를 `references/videos.md` append.
- **산출**: `references/insights.md` — 전역 REFERENCE 모드 포맷 (인사이트 3개 + 위버스 적용안 2개).

### Phase 3 — Wireframe Prompt

사용자가 위버스 현재 화면을 `wireframes/screenshots/`에 첨부.

Claude는 화면당 `wireframes/<screen-name>.md` 1개 작성:

```markdown
## 목표 & 사용자 작업
## 콘텐츠 & 컴포넌트
  - chord 컴포넌트명 명시 (예: Chips, Avatar, PaginationDot)
## UX 체크리스트
  - [ ] 정보위계 (H1→H2→Body)
  - [ ] 터치 영역 (iOS ≥44pt / Android ≥48dp)
  - [ ] 빈 상태 / 로딩 / 에러 처리
## 접근성 체크리스트
  - [ ] 색 대비 ≥4.5:1 (텍스트) / ≥3:1 (UI 요소)
  - [ ] VoiceOver / TalkBack 레이블
  - [ ] Dynamic Type / Scalable Text 대응
  - [ ] 색각 이상 대응 (색 단독 정보 전달 금지)
## Native 패턴 결정
  - iOS: [HIG 참조 항목]
  - Android: [M3 참조 항목]
## Figma Agent 프롬프트 블록
  [배치 지시, 컴포넌트명, 토큰명, 사이즈]
```

### Phase 4 — Persona Review

- **DEFAULT**: `korean-yuna` (20s) 관점으로 PRD + 와이어프레임 리뷰 자동 수행.
- 사용자가 다른 퍼소나 명시하면 추가.
- 출력: `notes.md`에 `## Persona check` 섹션 append.

---

## 스킬 우선순위

| 상황 | 스킬 |
|---|---|
| 초기 아이디어 정제 | `brainstorming` |
| 가설/엣지케이스 검증 | `grill-me` |
| PRD 작성 | `to-prds` |
| 영상 레퍼런스 분석 | `claude-video` |
| 세션 종료/인수인계 | `handoff` |
| 컴포넌트 코드 수정 | `tdd` (04 레포 대상) |

---

## 금지 / 주의

- 가정을 사실로 말하지 않기. 불확실하면 질문 1개.
- spec.md 내용 임의 수정 금지 (위키 원문 보존).
- chord-design-system 임의 수정 금지.
- 04 레포 수정은 명시 요청 시에만.
- 5단계 초과 설명 지양. 코드/명령은 지금 당장 필요할 때만.
