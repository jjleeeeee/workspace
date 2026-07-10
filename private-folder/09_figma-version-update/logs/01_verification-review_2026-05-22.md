# 검증 섹션 검토 — 2026-05-22

대상 문서: `wf-figma-component-version-update.md` § 10. 검증

---

## 발견된 문제

### 1. 버전 태그 하드코딩

검증 스크립트에 `'v.0.5.2'` 직접 박혀 있음.  
Step 2 스크립트는 `OLD_VERSION` 변수 사용하는데 검증만 하드코딩.  
다음 버전 교체 시 수정 누락 → 잘못된 검증 통과 위험.

### 2. 신버전 확인 없음

구버전 0개인지만 체크. 신버전(`v.0.5.3`)으로 실제 바뀌었는지 확인 안 함.  
"구버전 사라짐 ≠ 신버전으로 교체됨" — 빈 description으로 덮인 케이스 배제 못함.

### 3. 캐시 경고만 있고 대응 없음

주의 메모만 있고 실질적 대응 없음.  
REST API 캐시로 검증 결과 신뢰 못하면 검증 의미 없음.  
실질적 ground truth가 Figma UI 수동 확인뿐인 상태.

---

## 개선안

```python
OLD_VERSION = 'v.0.5.2'
NEW_VERSION = 'v.0.5.3'

remaining_old = [x for x in cs + c if '💠' in x.get('name','') and x.get('description','') == OLD_VERSION]
confirmed_new = [x for x in cs + c if '💠' in x.get('name','') and x.get('description','') == NEW_VERSION]

print(f"구버전 잔존: {len(remaining_old)}개")
print(f"신버전 확인: {len(confirmed_new)}개")
```

캐시 문제 근본 해결: `figma_execute` 내부에서 업데이트 직후 바로 재확인.  
Plugin API는 캐시 없이 실시간 조회 가능.

---

## 우선순위

| 문제 | 심각도 | 수정 난이도 |
|------|--------|-------------|
| 버전 태그 하드코딩 | 중 | 낮음 (변수화) |
| 신버전 확인 없음 | 중 | 낮음 (카운트 추가) |
| 캐시 대응 없음 | 높음 | 중간 (Plugin API 검증 추가) |

---

## 권장 액션

1. 검증 스크립트 `OLD_VERSION` / `NEW_VERSION` 변수화
2. 신버전 카운트 출력 추가
3. `figma_execute` 반환 코드 내부에 업데이트 후 재조회 로직 추가 (Plugin API 실시간)
