# token-summary · missing-sections · section-order

나머지 3개 규칙 + 전체 지도

검사 규칙 마지막 세 개예요. 정보성·경고성이 섞여 있고, 끝에 8개 규칙 전체 지도를 정리해요.

## token-summary — 그냥 통계

**심각도:** `info` (단순 정보)

각 토큰 묶음에 몇 개가 정의됐는지 세어서 알려줘요. `colors: 12, typography: 8, rounded: 6, ...` 같은 형태.

통과·실패 개념 자체가 없어요. "지금 얼마나 커졌나"를 보는 대시보드용이에요. 디자인 시스템이 3개월 전과 비교해 얼마나 늘었는지, 줄었는지를 그래프로 그릴 때 이 데이터를 씁니다.

## missing-sections — 어떤 선택 섹션이 비었는지

**심각도:** `info`

선택 섹션(`spacing`·`rounded`)이 정의 안 됐는데 다른 토큰은 있을 때 알려줘요.

"색·폰트는 다 정했는데 간격·모서리는 비어 있어요"라고 알려주는 정보예요. 경고도 아닌 이유? 빠진 게 의도인지 실수인지 기계가 모르니까요. "우리는 spacing 안 써"는 OK, "까먹었다"도 가능. 사용자 판단에 맡겨요.

## section-order — 본문 섹션 순서 위반

**심각도:** `warning`

본문 섹션이 권장 순서(Overview → Colors → Typography → Layout → Elevation → Shapes → Components → Do's and Don'ts)를 어길 때.

Ch 9에서 배운 8개 섹션 순서를 기억하시죠? 이 규칙이 그 순서를 지키는지 검사해요. 어겨도 빌드는 통과하지만 AI가 섹션을 찾기 어려워져요. "Colors 다음엔 Typography"라고 예측하고 있던 AI가 혼란을 겪으니 경고.

## 8개 규칙 전체 지도

| 규칙 | 심각도 | 무엇을 검사 |
|------|--------|-------------|
| `broken-ref` | `error` | 참조가 실제 존재하는 토큰을 가리키는가 |
| `missing-primary` | `warning` | 핵심 색(primary)이 있는가 |
| `contrast-ratio` | `warning` | 가독성 대비 기준을 충족하는가 |
| `orphaned-tokens` | `warning` | 쓰이지 않는 색 토큰이 있는가 |
| `missing-typography` | `warning` | 폰트 토큰이 지정됐는가 |
| `section-order` | `warning` | 섹션이 권장 순서를 따르는가 |
| `token-summary` | `info` | 지금 토큰이 몇 개인가 (통계) |
| `missing-sections` | `info` | 선택 섹션 중 어떤 게 비었나 |

## 핵심 인사이트

8개 규칙의 심각도 분포를 보세요. 에러 1개 · 경고 5개 · 정보 2개. "파일이 실제로 망가진 경우"만 에러로 막고, 나머지는 전부 사람·AI가 판단할 여지로 남겨뒀어요. 강제와 가이드의 비율이 1:7인 셈이에요. alpha 단계의 스펙이 관대하게 작동하도록 튜닝된 결과예요.

## 체크리스트

- 정보(info) 수준 2개 규칙이 빌드를 막지 않는 이유를 안다
- 8개 규칙을 심각도와 함께 기억한다 (1 error / 5 warning / 2 info)
- 이 분포가 alpha 스펙의 "관대한 태도"와 어떻게 연결되는지 설명할 수 있다
