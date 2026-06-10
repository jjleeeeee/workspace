# 컴포넌트 MD 추출 파이프라인 회고

**날짜:** 2026-04-25  
**업데이트:** 2026-04-26  
**대상:** Avatar / Badge / Button (Chord Design System)

---

## 잘 된 것

- 하네스가 실제로 버그를 잡았다. Button에서 Size px값이 날아간 것, variantCount 불일치, 괄호 포함 size 정규식 문제는 하네스 없었으면 조용히 틀린 MD가 남았을 가능성이 높다.
- fixture 3소스 설계가 유효했다. figma-console 또는 Framelink 기반 source와 REST API source를 분리한 덕분에 순환 검증을 줄였다.
- 스킬 자동화가 반복 비용을 낮췄다. URL만 넘기면 추출, 문서 작성, fixture 생성, 하네스 루프를 같은 방식으로 반복할 수 있다.
- Usage Figma를 별도로 읽으니 코드 구현에 가까운 규칙이 문서에 들어왔다.

---

## 힘들었던 것

| 문제 | 실제 비용 |
|---|---|
| REST API `.zshrc` 미로드 | 토큰이 잡히지 않는 문제를 별도로 디버깅해야 했다 |
| 정규식이 Size px 삭제 | `XLarge(52)`가 `XLarge`로 손상됐다 |
| REST API가 일부 variants 미반환 | source 비교를 엄격 일치가 아니라 subset 비교로 바꿔야 했다 |
| 2MB Figma 데이터 파싱 | 임시 파싱 패턴을 반복해서 써야 했다 |
| Usage source 분리 | component source만으로는 사용 규칙을 충분히 알 수 없었다 |

---

## 적용된 수정

### REST API 정규식 패턴 수정

**변경 전**

```python
re.sub(r'\s*\(.*?\)', '', value)
```

문제: `XLarge(52)` 같은 size 값의 px 정보까지 제거됐다.

**변경 후**

```python
re.sub(r'\s*\([^)]*[^\x00-\x7F][^)]*\)', '', value)
```

한글 포함 괄호만 제거한다. `XLarge(52)`는 보존하고, `Default (Gray Ghost 단일컬러)` 같은 설명 괄호만 제거한다.

### check_sources.py — 서브셋 비교 유지

- axes 비교: REST 값이 console/source 값의 부분집합이면 통과
- variantCount: REST count가 source count보다 작거나 같으면 통과
- 배경: Figma REST API는 미공개/internal variants를 누락할 수 있음

### check_sizes.py — size name escape

```python
re.escape(size)
```

`XLarge(52)`의 괄호를 정규식 group이 아니라 literal로 처리한다.

---

## 최종 검증 결과

| 컴포넌트 | design sections | guidance | contract | variants | tokens | sizes | sources | SCORE |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Avatar | 9/9 | 5/5 | 5/5 | 20/20 | 12/12 | 11/11 | 19/19 | 100/100 |
| Badge | 9/9 | 5/5 | 5/5 | 10/10 | 11/11 | 3/3 | 13/13 | 100/100 |
| Button | 9/9 | 5/5 | 5/5 | 23/23 | 13/13 | 6/6 | 25/25 | 100/100 |

---

## 결정

추천안은 `components/{name}.md`를 canonical input으로 유지하고, Usage source가 있으면 같은 문서에 직접 반영하는 것이다. 트레이드오프는 문서가 길어지는 점이다. 대안은 Usage를 별도 문서로 두는 방식인데, 구현 에이전트가 중요한 제품 규칙을 놓칠 가능성이 크다.
