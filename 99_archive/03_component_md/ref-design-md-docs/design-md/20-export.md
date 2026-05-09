# export — 다른 포맷으로 내보내기

Tailwind 설정 · DTCG 토큰 파일로 바꿔주는 명령

DESIGN.md는 사람·AI가 읽기 좋은 포맷이지만, 실제 개발에서는 Tailwind 설정 파일이나 Figma 토큰 파일 같은 다른 형식이 필요할 때가 많아요. `export`는 이걸 한 번에 변환해 줘요.

## 기본 사용법

```bash
# Tailwind 설정으로 변환
npx @google/design.md export --format tailwind DESIGN.md > tailwind.theme.json

# DTCG 표준 토큰 파일로 변환
npx @google/design.md export --format dtcg DESIGN.md > tokens.json
```

## 두 타깃의 목적

| 포맷 | 목적 |
|------|------|
| `tailwind` | Tailwind CSS의 theme JSON 형식. 프론트엔드가 `bg-primary`, `rounded-md` 같은 유틸리티 클래스를 바로 쓸 수 있어요. |
| `dtcg` | W3C Design Tokens Community Group이 정한 표준 토큰 파일 형식. Figma 플러그인·Style Dictionary·Tokens Studio 같은 도구들과 호환돼요. |

## Tailwind 변환은 컴포넌트 토큰을 빼요

atmospheric-glass 예시 레포의 설명:

> 컴포넌트 토큰은 의도적으로 제외했어요. Tailwind는 유틸리티 조합으로 컴포넌트를 만드는 철학이라, 컴포넌트를 프리셋으로 박지 않아요.

쉽게 말해 Tailwind는 `.button-primary` 같은 완성 스타일을 원하지 않아요. 대신 `bg-primary rounded-md px-3`처럼 원자 유틸리티를 조합해서 버튼을 만들어요.

그래서 `export --format tailwind`는 색·폰트·radius·spacing만 내보내고 `components`는 빼요.

## DTCG 변환은 컴포넌트까지 다 내보내요

DTCG는 컴포넌트 토큰을 포함해 전체 토큰 트리를 내보내요. Figma Variables·Style Dictionary 같은 도구가 이걸 그대로 읽어서 쓸 수 있어요.

## 변환은 한 방향이 정보가 많아요 — DESIGN.md가 허브

| 변환 방향 | 남는 정보 | 빠지는 정보 |
|-----------|-----------|-------------|
| DESIGN.md → DTCG | 컴포넌트·토큰 | 본문 설명 |
| DESIGN.md → Tailwind | 색·폰트·radius·spacing | 본문 + 컴포넌트 토큰 |
| DTCG → DESIGN.md | 토큰 뼈대 | 본문 설명 |
| Tailwind → DESIGN.md | 일부 토큰 | 컴포넌트 + 본문 |

즉 DESIGN.md가 가장 풍부한 원본이고, 나머지는 거기서 파생된 파일이에요. 건강한 파이프라인은 DESIGN.md가 원본(source of truth), 나머지는 자동 생성으로 두는 거예요.

## 실전 파이프라인 상상

1. 디자이너가 DESIGN.md를 PR로 수정
2. CI에서 `lint`·`diff`로 검증
3. 통과하면 `export --format tailwind`로 `tailwind.theme.json` 자동 생성
4. 같이 `export --format dtcg`로 `tokens.json` 생성
5. Figma 플러그인이 `tokens.json`을 받아 변수 동기화
6. AI는 원본 DESIGN.md의 본문 설명을 보고 새 컴포넌트 생성

## 핵심 인사이트

`export`는 "DESIGN.md를 허브로 만드는 다리"예요. 새 포맷이 성공하려면 기존 생태계(Tailwind·Figma·DTCG)를 거부하면 안 돼요. 양방향 변환을 처음부터 제공해서 "이 포맷 쓰면 기존 도구 못 쓰게 됨"이라는 저항을 없앴어요.

## 체크리스트

- Tailwind·DTCG 두 타깃의 용도 차이를 안다
- Tailwind 변환이 `components`를 빼는 이유(유틸리티 조합 철학)를 설명할 수 있다
- DESIGN.md가 왜 "가장 풍부한 원본"인지 정당화할 수 있다
- 실전 CI 파이프라인에서 각 명령이 어떻게 엮이는지 상상할 수 있다
