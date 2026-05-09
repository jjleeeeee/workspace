# Component MD 포맷 회고

**날짜:** 2026-04-26  
**대상:** Avatar / Badge / Button 문서, Stitch식 설명 + Implementation Contract, 하네스

---

## 한 줄 결론

현재 방향은 맞다. 단순 Figma 스펙 요약보다, AI가 컴포넌트 코드를 만들 때 필요한 사용 맥락과 구현 계약을 함께 주는 문서가 훨씬 실용적이다.

---

## 이전 문서에서 부족했던 점

초기 문서는 Figma fact check에는 효과적이었다.

- variant axis가 빠졌는지 확인할 수 있었다.
- token name이 문서에 있는지 확인할 수 있었다.
- size px값 누락을 잡을 수 있었다.
- REST와 console source를 비교해 순환 검증을 줄일 수 있었다.

하지만 코드 구현 입력으로는 부족했다.

- 컴포넌트를 언제 쓰고 언제 쓰지 말아야 하는지 약했다.
- 타입과 상태의 의미가 구현 판단으로 이어지지 않았다.
- Public API, layout contract, accessibility가 명확히 분리되어 있지 않았다.
- Usage Figma에 있는 중요한 제품 규칙이 빠지기 쉬웠다.

---

## 좋아진 점

### 1. 설명과 계약이 분리됐다

`Role & Usage`부터 `Do's and Don'ts`까지는 AI가 디자인 의도를 이해하는 영역이다. `Implementation Contract`는 코드로 옮길 때 반드시 지켜야 하는 사실값 영역이다.

이 분리는 중요하다. 설명 영역은 사람이 읽기 좋게 써도 되고, 계약 영역은 하네스가 엄격하게 검사할 수 있다.

### 2. Usage Figma가 실제 구현 품질을 높인다

컴포넌트 source만 보면 Button의 variant는 알 수 있지만, 다음 규칙은 놓치기 쉽다.

- 단일 하단 CTA는 16px horizontal margin과 `XLarge(52)`를 쓴다.
- 두 버튼 그룹은 primary action을 오른쪽에 둔다.
- 세 개 이상의 action이나 긴 label은 vertical layout을 우선한다.
- 필수 정보가 입력되기 전에는 button을 disabled로 유지한다.

Avatar도 마찬가지다. component source는 size/type을 말해주지만, Usage source는 타입과 사이즈를 같은 맥락에서 혼용하지 말라는 제품 규칙을 준다.

### 3. 하네스가 문서 품질의 하한선을 만든다

하네스는 좋은 문서를 완전히 증명하지는 못한다. 그래도 다음 실수는 잘 막는다.

- 필수 섹션 누락
- Implementation Contract에 variant axis 누락
- token name 누락
- size px값 누락
- REST source와 console source의 명백한 불일치

이 정도만 자동으로 잡아도 컴포넌트 MD를 반복 생성할 때 품질 하한선이 생긴다.

---

## 발견한 한계

### 1. 문자열 기반 검증은 의미 검증이 아니다

하네스는 문서에 `Disabled`라는 단어가 있는지는 확인할 수 있다. 하지만 disabled 상태를 올바르게 설명했는지는 완전히 판단하지 못한다.

현재 하네스는 “필수 정보가 빠졌는가”를 잡는 도구이지 “문서가 좋은 설계인가”를 보장하는 도구는 아니다.

### 2. Usage rule은 아직 fixture화되어 있지 않다

Usage Figma에서 가져온 규칙은 사람이 읽고 문서에 반영했다. 자동 검증은 아직 약하다.

다음 단계에서는 usage source에서 나온 rule을 별도 fixture로 만들 수 있다.

```json
{
  "usageRules": [
    "primary action belongs on the right in two-button groups",
    "single bottom CTA uses XLarge(52)",
    "do not mix avatar sizes in one repeated layout"
  ]
}
```

이렇게 하면 “Usage Figma를 봤는가”뿐 아니라 “중요 rule을 문서에 반영했는가”까지 더 잘 검증할 수 있다.

### 3. 문서는 길어질 수밖에 없다

현재 포맷은 초기 요약 문서보다 길다. 하지만 길어진 이유가 구현에 연결되어야 한다.

남겨야 하는 문장:

- 코드 API로 이어지는 설명
- layout/state/accessibility 판단에 필요한 설명
- AI가 자주 틀릴 수 있는 Do/Don't
- Figma source와 연결되는 사실값

줄여야 하는 문장:

- 구현에 영향을 주지 않는 분위기 설명
- Figma 표를 그대로 반복하는 설명
- 이미 contract에 있는 값을 앞에서 장황하게 반복하는 설명

---

## 다음에 적용할 기준

새 컴포넌트를 만들 때는 다음 순서가 좋다.

1. Component Figma source에서 variant, token, size, props를 추출한다.
2. Usage Figma source가 있으면 먼저 사용 규칙을 뽑는다.
3. Stitch식 설명은 사용 맥락과 오용 방지를 중심으로 쓴다.
4. Implementation Contract는 코드 API와 하네스 검증 기준으로 쓴다.
5. 하네스를 통과시킨다.

---

## 결정

추천안은 현재 포맷을 기본 문서 포맷으로 삼는 것이다. 트레이드오프는 문서 작성 비용과 길이가 늘어난다는 점이다. 대신 코드 생성 성공률과 검증 가능성이 높아진다.

대안은 Usage를 별도 문서로 분리하는 방식이다. 이 방식은 문서가 짧아지지만, 구현 에이전트가 usage rule을 놓칠 가능성이 높다.

따라서 다음 작업부터는 `components/{name}.md`를 canonical input으로 사용한다.
