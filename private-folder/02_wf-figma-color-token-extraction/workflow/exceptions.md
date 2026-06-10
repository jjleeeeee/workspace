# Exceptions

## REST Fetch Failed

증상:

- `fetch failed`
- `getaddrinfo ENOTFOUND api.figma.com`

처리:

- sandbox 네트워크 제한이면 escalated command로 다시 실행한다.
- `FIGMA_ACCESS_TOKEN` 누락이면 env 설정 후 재시도한다.

## Dangling Alias

증상:

- alias target이 REST `meta.variables` 안에 없다.
- 순환 alias가 감지된다.

처리:

- final `tokens` 배열에서 제외한다.
- catalog-level diagnostics에 `alias:dangling`을 기록한다.

현재 대표 예외:

```text
token:system.color.roles.brand-green
```

## Hidden State Changed

증상:

- 이전 snapshot과 `hidden` 값 또는 `hidden-from-publishing` diagnostics가 다르다.

처리:

- 현재 Figma REST 원천의 `hiddenFromPublishing` 값을 우선한다.
- diff 설명에 어떤 token의 hidden 상태가 바뀌었는지 적는다.

## Unexpected Token Count

처리 순서:

1. added/removed token id를 확인한다.
2. Figma REST raw snapshot에서 해당 variable의 `name`, `deletedButReferenced`,
   `resolvedType`, `valuesByMode`를 확인한다.
3. 의도된 Figma 원천 변경이면 history에 기록한다.
4. 추출 규칙 문제면 `tools/`와 `workflow/`를 함께 수정한다.
