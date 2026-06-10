충돌 표 (spec vs markitdown-design vs usage)

  #: 1
  항목: 상태 수
  radio.md (9-섹션): 4개 (Default / Enabled / Disabled / Disabled_Enabled)
  markitdown-radio.md (Figma 원본): 3개 (Default / Enabled / Disabled)
  markitdown-usage-radio.md: 3개
  ────────────────────────────────────────
  #: 2
  항목: Outline 두께
  radio.md (9-섹션): 2px
  markitdown-radio.md (Figma 원본): stroke: 1
  markitdown-usage-radio.md: —
  ────────────────────────────────────────
  #: 3
  항목: Outline 지름
  radio.md (9-섹션): 명시 없음 (전체 24px만)
  markitdown-radio.md (Figma 원본): 22px (전체 24, outline 22)
  markitdown-usage-radio.md: —
  ────────────────────────────────────────
  #: 4
  항목: Enabled 색상 토큰
  radio.md (9-섹션): system/color/roles/primary
  markitdown-radio.md (Figma 원본): system/color/status/active-primary
  markitdown-usage-radio.md: —
  ────────────────────────────────────────
  #: 5
  항목: Disabled 표현 방식
  radio.md (9-섹션): opacity: 0.4 일괄
  markitdown-radio.md (Figma 원본): Outline + Background + Inner circle 별도 토큰
  markitdown-usage-radio.md: —
  ────────────────────────────────────────
  #: 6
  항목: Mode별 토큰 차이
  radio.md (9-섹션): Default/Fixed 토큰 차이 명시 없음
  markitdown-radio.md (Figma 원본): Light/Dark는 system/color/*, Fixed는 system/fixed_color/* 별도

    셋
  markitdown-usage-radio.md: —
  ────────────────────────────────────────
  #: 7
  항목: 기본값 선택
  radio.md (9-섹션): "default selection 반드시 지정" (권장)
  markitdown-radio.md (Figma 원본): —
  markitdown-usage-radio.md: "항상 하나의 항목이 기본값" (강제)
  ────────────────────────────────────────
  #: 8
  항목: V1 dot 미사용 가이드
  radio.md (9-섹션): 없음
  markitdown-radio.md (Figma 원본): —
  markitdown-usage-radio.md: "Dot 들어간 default 사용 금지(V1)"

  핵심 결정 포인트

  일괄 결정 (추천): Figma 원본인 markitdown-radio.md를 SoT로 채택 (1-6번 모두 markitdown 기준)
  - 근거: Figma가 디자인 SoT, 기존 radio.md는 사람이 작성한 후 outdated 가능성
  - 단, "Disabled_Enabled" 상태(radio.md:42)가 실제 Figma에 있는지 사용자 확인 필요. markitdown에
  안 보이면 제거.

  항목별 결정: 1-6번 각각 다르게 결정

  7-8번은 보강 항목이라 자동으로 추가하면 됨 (충돌 없음).

  Disabled_Enabled 상태 — 별도 확인 필요