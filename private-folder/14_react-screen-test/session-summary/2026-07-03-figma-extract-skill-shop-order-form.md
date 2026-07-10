# Session Summary — 2026-07-03

## 작업 범위

1. **figma-extract 스킬 설계 + 구현**
2. **ShopOrderForm 화면 구현**

---

## 1. figma-extract 스킬

### 배경
큰 Figma 프레임을 `get_design_context` 한 방에 읽으면 컨텍스트 폭발. `figma-rename` 스킬의 `figma_execute` + OFFSET/LIMIT 배치 스캔 아이디어를 화면 구현 파이프라인에 적용.

### 구현 파일
| 파일 | 내용 |
|---|---|
| `scripts/harness-cli.mjs` | `extract-nodes` 서브커맨드 추가 |
| `.claude/skills/figma-extract/SKILL.md` | 프로젝트 로컬 스킬 |
| `CLAUDE.md` / `AGENTS.md` | Verification Order -1 단계 추가 |
| `.gitignore` | `harness/*-nodes.json` 추가 |

### extract-nodes CLI 사용법
```bash
# 1. 초기화
node scripts/harness-cli.mjs extract-nodes fetch \
  --node-id <id> --file-key <key> --slug <slug> [--limit 25]

# 2. 배치 스크립트 출력 → figma_execute 에 붙여넣기
node scripts/harness-cli.mjs extract-nodes next-script --slug <slug>

# 3. 응답 저장 후 병합
node scripts/harness-cli.mjs extract-nodes ingest --slug <slug> --response /tmp/batch.json

# 4. 진행 확인 (hasMore=false 까지 반복)
node scripts/harness-cli.mjs extract-nodes status --slug <slug>

# resume = next-script + status 합본
node scripts/harness-cli.mjs extract-nodes resume --slug <slug>
```

### 캐시 스키마
`harness/<slug>-nodes.json` — offset/hasMore/nodes[]/dsInstancesSkipped[] 보관. 세션 끊겨도 재개 가능.

### 설계 결정
- **순수 chunker (A안)** 채택 — figma_execute 하나만 의존, stateless, 구현 단순
- Framelink 하이브리드(B안) — 미사용 이력 + 2-캐시 복잡도로 보류
- DS instance(`💠`/`🛠️`) → 스킵 + `dsInstancesSkipped` 기록 → 후속 `code-connect resolve` 라우팅
- LIMIT 기본 25 (rename skill 의 80보다 작음 — payload가 훨씬 큼)

---

## 2. ShopOrderForm 화면

### Figma 소스
- URL: `https://www.figma.com/design/VHF5kgkVRAtctETQfeVL1W/샵_현장수령?node-id=213-368199`
- file-key: `VHF5kgkVRAtctETQfeVL1W`
- node-id: `213:368199`
- slug: `shop-order-form`

### MCP 경로
figma-console 세션 미연결 → figma-official `get_design_context` 단일 호출로 읽기.

### 구현 파일
| 파일 | 내용 |
|---|---|
| `src/screens/ShopOrderForm/index.tsx` | 전체 화면 JSX |
| `src/screens/ShopOrderForm/styles.css` | CDS 토큰 기반 스타일 |
| `src/screens/ShopOrderForm/metrics.ts` | Figma 고정 치수 |
| `src/assets/figma/shop-order-form/` | 자산 4개 (제품 썸네일 2, 카드 이미지 2) |
| `src/main.tsx` | `"shop-order-form"` 슬러그 등록 |

### 화면 섹션
1. GNB (sticky, 주문서 타이틀)
2. 주문 상품 (썸네일 + 상품명/옵션/가격 + 결제금액 합계)
3. 주문자 (이름/이메일/전화 + 변경 버튼)
4. PICK-UP 장소
5. PICK-UP 예약 (예약하기 버튼)
6. 캐시 (금액 입력 + 전액 사용 버튼 + 항상 전액 사용 체크박스)
7. 결제 금액 (상품/세금/배송 소계 + 총 결제금액 + 캐시 적립)
8. 결제 수단 (위버스 카드 라디오 + 카드 캐러셀 / 일반결제 라디오)
9. 유의사항 (bullet list)
10. 하단 바 (플로팅 버튼 + 결제 버튼 + 이용약관 동의)

### 인터랙션
- 결제 수단 라디오 (`paymentMethod` state) → 위버스 카드 선택 시 카드 캐러셀 표시
- 캐시 체크박스 (`useAllCash` state)
- 전액 사용 버튼 → `cashInput` 채움

### 아이콘 처리
아이콘 PNG 다운로드 후 → `/Users/jj.iee/Desktop/chord-design-system/assets/svg/` 에 SVG 존재 확인 → `ChordIcon` 컴포넌트로 대체:
- `arrowDownFoldMedium` (16px)
- `arrowDownMedium` (16px)
- `arrowRightMedium` (12px)
- `questionMarkMedium` (20px)
- `favoritesMedium` (20px)

### CodeConnect 결과
Header, TextButton, IconButton → code-connect 인덱스 미매칭 (샵 파일 vs DS 파일 key 불일치) → **로컬 컴포지션** 채택.

### 미완료 / 후속
- [ ] `harness/shop-order-form-diff-manifest.json` 생성 (color_regions, critical_regions)
- [ ] `tests/ShopOrderForm.assets.test.ts` 자산 존재 테스트
- [ ] Playwright 스크린샷 diff (figma vs react)
- [ ] figma-console 연결 시 `extract-nodes fetch` 실행 → 노드 캐시 생성

### 확인 URL
`http://localhost:5175/?screen=shop-order-form`
