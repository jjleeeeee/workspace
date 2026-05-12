---
name: figma-to-md
description: "Figma 컴포넌트 URL을 입력받아 design.md를 생성하고 생성-평가 반복 루프(최대 5회)로 품질 고도화. 산출물: _workspace/outputs/<ComponentName>.md"
---

## 사전 준비

```
!python3 servers/setup.py
```

완료 대기. 실패 시 중단.

---

## 진행 방식

이 커맨드는 오케스트레이터입니다.
단계별 세부 절차는 `harness/workflow.md`를 읽어 참조하고,
흐름 제어 로직은 `harness/orchestrator.md`를 읽어 따릅니다.

```
!cat harness/workflow.md
!cat harness/orchestrator.md
```

---

## 입력 파싱

`$ARGUMENTS`에서 Figma URL 추출:
- `https://www.figma.com/design/<fileKey>/...?node-id=<nodeId>`
- `fileKey`, `nodeId` 분리 (`-` → `:` 변환)
- 컴포넌트명 결정 (Figma 메타데이터 또는 URL에서 추출, PascalCase)

---

## 실행

`harness/orchestrator.md`의 실행 순서에 따라:

1. Phase 0.5 — 컴포넌트 스펙 추출 및 사용자 확인
2. Phase 0 — Fixture 셋업 (1회)
3. Loop (최대 5회) — Steps A→B→C→D→E→F→G→H

산출물 위치 규약은 `CLAUDE.md` 참조.

---

## 진행 상황 출력

```
[loop N/5] Step <X> 진행 중...
  ✓ <check-id>
  ✗ <check-id>: <message>
[loop N/5] SSIM: <score> (목표: 0.85)
```
