# 09. Chips — Claude 단독 vs Claude+Codex 워크플로우 비교

**날짜:** 2026-04-26  
**비교 대상:** `components/chips.md` vs `components/chips_codex-cc.md`  
**실험 목적:** 동일 컴포넌트를 두 워크플로우로 추출했을 때 내용 차이 확인

---

## 워크플로우 비교

| 항목 | chips.md | chips_codex-cc.md |
|------|----------|-------------------|
| 워크플로우 | component-md-extract 스킬 (Claude 단독) | Claude(Stitch 1~8) + Codex(Contract 9) 분업 |
| Figma 소스 | Design file URL + fixtures | Design file + Usage file (2개 URL) + fixtures |
| 하네스 점수 | **100/100** (7/7 PASS) | **100/100** (7/7 PASS) |

---

## 내용 차이 분석

### 1. 사이즈 규칙 — **중요한 차이**

| | chips.md | chips_codex-cc.md |
|---|---|---|
| Filter 역할 사이즈 | Small과 Medium **모두** 사용 가능 | Text/Icon은 **Small만** 사용 |
| Medium 사용 조건 | Tabs 역할 또는 여유 있는 필터 레이아웃 | Image 타입이 포함될 경우에만 |

**출처:** chips_codex-cc는 Usage 파일에서 명시적 규칙을 확인:
> "Text 또는 Icon이 사용되는 Chips의 사이즈는 Small로 사용합니다."  
> "사이즈를 임의로 변경할 수 없습니다. Text만 사용되었을 때 Medium 사이즈 사용 불가"

**판정:** chips_codex-cc.md가 더 정확. Usage 파일을 소스로 추가했기 때문에 포착됨.

---

### 2. 토큰 이름 — **중요한 차이**

| 역할 | chips.md | chips_codex-cc.md |
|------|----------|-------------------|
| 테두리 (Default) | `system/color/button/outlined_gray` | `system/color/outline/default-100a` |
| 배경 (Filled_Disabled) | `system/color/button/disabled` | `system/color/surface/default-reverse-100a` |
| 아웃라인 (Outlined_Disabled) | `system/color/button/disabled` | `system/color/outline/default-100a` |

**출처:** chips_codex-cc는 Design file의 Colors 섹션에서 직접 확인된 토큰 이름 사용.  
chips.md의 `button/outlined_gray`, `button/disabled` 토큰은 fixtures/tokens.json 기반으로 기록되었으나 Figma 원본과 불일치 가능성 있음.

**판정:** 하네스는 16개 토큰 문자열 등장 여부만 검사하므로 **두 파일 모두 PASS**지만 실제 토큰 이름은 다름. chips_codex-cc.md 쪽이 Design file 원본에 더 가까움.

---

### 3. 아이콘 컬러 토큰 — **chips.md 누락**

chips.md에는 아이콘 컬러 토큰이 없음.  
chips_codex-cc.md에는 아래 4개 추가:

| 역할 | Token (Default mode) | Token (Fixed mode) |
|------|---------------------|-------------------|
| 아이콘 (Default) | `system/color/icon/default` | `system/fixed_color/icon/default` |
| 아이콘 (Outlined_Selected) | `system/color/icon/primary` | `system/fixed_color/icon/primary` |
| 아이콘 (Outlined/Filled Disabled) | `system/color/icon/200a` | `system/fixed_color/icon/200a` |
| 아이콘 (Filled_Selected) | `system/color/icon/default-reverse` | `system/fixed_color/icon/default-reverse` |

**판정:** 하네스 fixtures/tokens.json에 아이콘 토큰이 없어 검사에서 포착되지 않음. 실제 구현에서는 chips_codex-cc.md 쪽이 더 완전함.

---

### 4. 스크롤 처리 규칙 — **방향 충돌**

| | chips.md | chips_codex-cc.md |
|---|---|---|
| 칩 그룹 초과 처리 | 수평 스크롤 영역에 배치 | 줄바꿈 처리. 좌우 스크롤 사용 금지 |

**출처:** chips_codex-cc는 Usage 파일 DO NOT 규칙:
> "Option Chips이 페이지를 초과할 경우 줄바꿈을 사용해 주세요. (좌우 스크롤 사용 X)"

**판정:** Usage 파일을 소스로 추가해야만 포착 가능한 규칙. chips_codex-cc.md가 더 정확.

---

### 5. 추가 사용 규칙 — **chips.md 누락**

chips_codex-cc.md에는 있고 chips.md에 없는 규칙들:

| 규칙 | 출처 |
|------|------|
| Filter Chip이 1개일 경우 노출하지 않는다 | Usage 파일 |
| 아티스트명 영역은 Text Type을 `Artist(Circular)`로 설정 | Design file / Usage 파일 |
| 아티스트명 영역에 Default 텍스트 타입 사용 금지 | Usage 파일 |
| 커뮤니티 영역에서 `fixed_color` 사용 (다크모드 반전 방지) | Usage 파일 |
| Option Chips 1개라도 선택/적용 상태 인지 가능하게 노출 권장 | Usage 파일 |

**판정:** 모두 Usage 파일에서만 확인 가능. URL 2개 소스 전략이 유효했음.

---

## 하네스 한계 관찰

두 파일 모두 100/100이지만 내용 품질 차이가 존재한다.

| 하네스 항목 | 검사 방식 | 한계 |
|------------|----------|------|
| TOKENS | 토큰 문자열 등장 여부 | 토큰이 올바른 역할에 맵핑됐는지 검사 안 함 |
| SIZES | Layout Contract 테이블 수치 | 사이즈 선택 기준(언제 어떤 사이즈 쓸지) 검사 안 함 |
| VARIANTS | axes 값 등장 여부 | 조합 제약(Image = Medium 전용) 검사 안 함 |

하네스 점수가 같더라도 소스 범위에 따라 **내용의 정확도와 완결성에 차이**가 발생한다.

---

## 결론

| 관점 | 우세 | 이유 |
|------|------|------|
| 하네스 점수 | 동등 (100/100) | 하네스 검사 범위 내에서는 차이 없음 |
| 사이즈 규칙 정확도 | **chips_codex-cc.md** | Usage 파일 명시 규칙 반영 |
| 토큰 이름 정확도 | **chips_codex-cc.md** | Design file 원본 토큰 직접 확인 |
| 아이콘 토큰 완결성 | **chips_codex-cc.md** | icon/* 토큰 4개 추가 |
| 사용 규칙 완결성 | **chips_codex-cc.md** | Usage 파일 규칙 5개 추가 |
| Stitch 서술 밀도 | 유사 | 두 파일 모두 동등한 수준 |

**핵심 발견:** 품질 차이의 원인은 Codex 분업 여부가 아니라 **소스 범위**다.  
`chips_codex-cc.md`는 Design file + Usage file 2개 URL을 소스로 사용해 더 정확하고 완전한 내용을 담았다.  
Codex는 Contract 섹션 반복 구조를 정확하게 생성했으며 Size 컬럼 backtick 제거 1회 픽스 외에는 추가 수정이 불필요했다.
