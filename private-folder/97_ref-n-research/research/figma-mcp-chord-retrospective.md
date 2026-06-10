# Figma MCP × Chord DS 프로토타입 회고

> design_v3.md 기반으로 "아티스트 × 팬 채팅 화면" 프로토타입을 Figma에 그리는 작업에서, AI(Claude)가 두 번 잘못 만들고 세 번째에 제대로 만든 과정의 회고.
> 같은 실수를 반복하지 않기 위한 기록.

## TL;DR

1. **시작 프롬프트**: "design_v3.md 기반으로 아티스트-팬 채팅 화면을 Figma에 그려줘"
2. **1차 결과** ❌: primitive(`createRectangle`/`createEllipse`)로 처음부터 끝까지 직접 그림. 시각적으로는 그럴듯하지만 Chord DS 컴포넌트가 하나도 안 들어감.
3. **2차 결과** ⚠️: 사용자 지적 후 컴포넌트 import는 시작했으나 default variant 그대로 사용 → App Bar가 BNB(Bottom Nav)로, Send 버튼 자리가 toolbar로 잘못 들어감.
4. **3차 결과** ✅: variant를 명시적으로 지정해서 의도한 컴포넌트로 정착.
5. **부수적 문제**: 디스커버리 단계에서 토큰을 과소비 (community 라이브러리 changelog까지 통째로 받음 등).

---

## 무엇을 만들었나

- 파일: `H7TPvm8L6cNlVj2gWNJt9j` (Figma "AI_TEST")
- 페이지: `9:33` ("2차")
- 화면: 375×812 모바일 채팅 화면 (아티스트 ↔ 팬)

최종 화면이 사용한 Chord 컴포넌트:

| 영역 | 컴포넌트 | Variant |
|---|---|---|
| 헤더 back / more | Chord/Icon Button | Outlined, Medium(40), Radius=on |
| 헤더 아바타 | Chord/[V2] Avatar | Circle, Small, Ring=true |
| 메시지 아바타 | Chord/[V2] Avatar | Circle, XXSmall |
| 인증 dot | Chord/Badge_Dot | default |
| 날짜 separator | Chord/Chip | Mode=Default, Type=Text, Style=Fill, Round=ON |
| 입력바 + / 전송 | Chord/Icon Button | Filled, Default(mint), Medium |

DS에 매칭이 없는 것(채팅 버블, 텍스트 필드, 사진 카드, 타이핑 인디케이터)만 토큰을 참조해 직접 구성.

---

## 실수 1 — primitive로 그렸다

### 무슨 일이 있었나

`design_v3.md`의 frontmatter에 color/typography/spacing/radius 토큰이 잘 정리돼 있었다. AI는 이걸 보고 *"필요한 정보가 다 있으니 이대로 그리면 된다"* 라고 판단해서, 곧장 `figma.createRectangle()`, `figma.createEllipse()`, `figma.createText()`로 화면을 처음부터 끝까지 만들었다.

결과는 시각적으로 Chord와 비슷해 보였지만 — Figma 컴포넌트 패널에서 보면 어떤 노드도 컴포넌트 인스턴스가 아니었다.

### 왜 잘못인가

- **DS 업데이트가 전파되지 않음**: Chord 컴포넌트가 수정돼도 이 화면은 그대로다.
- **Code Connect 연결 끊김**: 코드 매핑이 컴포넌트 키 기반이라, primitive에는 코드 스니펫이 안 붙는다.
- **Variant property 활용 불가**: state, size, color 같은 prop을 designer가 변경할 방법이 없다.
- **검수 비용**: 디자이너가 다시 컴포넌트로 교체해야 함.

### 핵심 오해

> "토큰 = 디자인 시스템"

토큰 일치는 시각적 결과만 비슷하게 만든다. 컴포넌트 인스턴스가 아니면 DS와 끊긴 dead pixel이다. 둘은 같지 않다.

### Figma MCP 가이드는 뭐라고 했나

`use_figma` 툴 description에 명시돼 있음:

> Before creating components, call `search_design_system` to check for existing design system components to reuse. Import matches via `importComponentByKeyAsync` / `importComponentSetByKeyAsync` instead of recreating them.

이걸 무시했다.

### 올바른 흐름

```
1. get_libraries (라이브러리 이름을 모를 때만)
   └─ 이미 파일에 어떤 DS가 붙어있는지 확인
2. search_design_system
   └─ 필요한 컴포넌트들의 componentKey 수집
3. use_figma
   └─ importComponentSetByKeyAsync → variant 선택 → createInstance
4. DS에 매칭이 없는 부분만 primitive
```

---

## 실수 2 — variant를 default로 둔 채 import

### 무슨 일이 있었나

1차 실수를 지적받고 컴포넌트 import는 시작했지만, `componentSet.defaultVariant`를 그대로 사용했다. 결과:

- **App Bar의 default variant**가 사실은 GNB(글로벌 네비게이션 바, Home/Shop/DM/More)였다 → 채팅 헤더 자리에 하단 탭이 들어감.
- **Button의 default variant**가 multi-button toolbar였다 → 전송 버튼 자리에 share/bookmark/heart 아이콘 묶음이 들어감.
- **Chip의 default variant**가 `State=Selected` (검은 배경) → 흰 톤이어야 할 날짜 separator가 검정.

### 왜 그랬나

- DS의 default variant는 종종 "가장 흔한 variant"가 아니라 "구조상 첫 번째"다. 신뢰하면 안 된다.
- `comp.componentPropertyDefinitions`로 Mode/Type/Size/State 같은 축이 있다는 걸 사전에 인지하지 않았다.

### 올바른 흐름

variant 이름은 `"Mode=Default, Type=Filled, Size=Medium(40), State=Default"` 형태의 콤마 구분 문자열이다. 파싱해서 원하는 조합을 명시적으로 골라야 한다.

```javascript
function variantProps(comp) {
  const out = {};
  comp.name.split(",").forEach(part => {
    const [k, v] = part.split("=").map(s => s.trim());
    if (k) out[k] = v;
  });
  return out;
}

function findVariant(set, want) {
  return set.children
    .filter(c => c.type === "COMPONENT")
    .find(c => {
      const p = variantProps(c);
      return Object.entries(want).every(([k, v]) => p[k] === v);
    });
}

// 사용
const sendBtnVariant = findVariant(iconBtnSet, {
  Mode: "Default", Type: "Filled", Size: "Medium(40)",
  State: "Default", Radius: "on", "Button Color": "Default",
});
```

---

## 실수 3 — 디스커버리 단계에서 토큰 과소비

### 무슨 일이 있었나

Chord 컴포넌트를 찾는 과정에서 컨텍스트 창에 큰 응답이 누적됐다.

1. **`get_libraries`** 한 번에 community 라이브러리들의 긴 changelog HTML이 딸려옴 (Material 3, Simple DS, iOS 18, iOS 26, watchOS 26, visionOS 26, macOS 26). 단순히 "Chord가 붙어 있는지" 확인하는 게 목적이었는데, 1만 단어 가까운 description이 응답에 들어옴.
2. **`search_design_system` 4회 병렬 호출**: avatar / button / badge / icon 검색. 각각 `includeVariables: true`, `includeStyles: true` 디폴트로 호출 → 토큰·스타일까지 같이 반환. `tag` 컴포넌트의 9-section AI 명세 전문이 통째로 들어옴.
3. **variant 구조 확인을 위한 별도 `use_figma` 라운드 트립**: variant 잘못 찍은 후 16+192+4+40+44개 variant 이름을 받아왔음. 첫 번째 `use_figma` 안에서 했으면 안 일어날 일.

### 줄이는 방법

| 잘못된 방식 | 개선 방식 |
|---|---|
| `get_libraries`로 모든 라이브러리 metadata 받음 | 라이브러리 이름이 확실하면 건너뛰기. 필요해도 description은 정렬·필터에만 쓰고 본문 무시 |
| `search_design_system(query="avatar")` | `search_design_system(query="avatar", includeVariables: false, includeStyles: false, includeLibraryKeys: [chordKey])` |
| 단어 하나 query (결과 20개) | `"button filled primary"`처럼 좁은 query로 결과 수 자체 축소 |
| variant 탐색용 use_figma 별도 호출 | 첫 use_figma 안에서 variant 출력 + 빌드 동시 처리 |
| description 전문 받기 | 첫 N자만 필요. AI 명세 본문은 빌드 시점에 거의 안 쓰임 |

---

## 정리: 다음에 같은 작업을 할 때

### Pre-flight 체크리스트

- [ ] 파일에 디자인 시스템 라이브러리가 붙어 있는가? (모르면 `get_libraries`, 알면 skip)
- [ ] DS 라이브러리 키 확보됨? (`includeLibraryKeys`로 search 범위 좁히기 위함)
- [ ] 만들 화면에 어떤 컴포넌트가 필요한지 목록화 완료?

### Build 단계

1. 필요한 컴포넌트들에 대해 좁은 query로 `search_design_system` 1~2회 — `includeVariables: false, includeStyles: false`.
2. 한 번의 `use_figma` 안에서:
   - `importComponentSetByKeyAsync` 병렬로 모두 import
   - 각 set의 `componentPropertyDefinitions` 로깅 (필요 시)
   - variant 명시적 선택 → `createInstance()`
   - DS에 없는 부분만 primitive (토큰 값 직접 사용)
   - 인스턴스 내부 텍스트 노드의 폰트는 `loadFontAsync`로 사전 로딩
3. `get_screenshot`으로 결과 시각 검증.

### Anti-patterns (피해야 할 것)

- ❌ frontmatter에 토큰 있다고 primitive로 바로 그리기
- ❌ `defaultVariant`를 그대로 신뢰
- ❌ `get_libraries` → `search_design_system` 4회 병렬 → 별도 variant 조사 → 빌드 (라운드 트립 4번)
- ❌ AI 응답에 9-section 컴포넌트 명세 전문 받아두고 안 씀

### Pro-patterns (지향)

- ✅ DS 라이브러리 확인 → 좁은 검색 → variant 명시 → 한 번에 빌드
- ✅ 컴포넌트 인스턴스로 만들고, 매칭 없는 부분만 토큰으로 primitive
- ✅ description은 정말 필요할 때만, 그것도 발췌만
- ✅ 결과를 스크린샷으로 자가 검증한 뒤 보고

---

## 부록 A — 사용한 Component Key (Chord Design System)

라이브러리 키:
`lk-0388fe7d6af3fadcc4104da6f32da9e197b6afe2cd663be770be1787764283b31612a7c9d2309efa79c06a657b9a1fd99740ac9b191933b5480b4ebe4bbb8fe9`

| 컴포넌트 | Component Key | Type |
|---|---|---|
| [V2] Avatar | `33d955018e09fb10ab89cefc8f00f2662a2b0e39` | component_set |
| Icon Button | `b60ecb5e664ce4e19bd9b11dd521d9b710d711df` | component_set |
| Button | `2c7545d494bb0137c170815794ee1be7d87921d1` | component_set |
| Chip | `bc850a83d50e399bb879539cdd32c3e8ed1363e2` | component_set |
| Badge_Dot | `d1ea898a9e908e7470a7518abae5b45c18e0a58a` | component_set |
| App Bar (실제는 BNB) | `74f34090918c78b52ca4c2c667494cb72db876ae` | component_set |
| 16/em/ic_arrow_left_xsmall | `6a0d0a03b8f34981ba228bb68e99d1982b05e85d` | component |

## 부록 B — 핵심 코드 패턴

### 폰트 일괄 로딩 (Chord는 WeGothicSans, Pretendard 등 다양)

```javascript
const fams = ["Inter", "WeGothicSans", "Pretendard", "Roboto", "SF Pro", "Noto Sans KR"];
const styles = ["Regular", "Medium", "Bold", "Extra Bold", "Semi Bold"];
const available = await figma.listAvailableFontsAsync();
const has = new Set(available.map(f => `${f.fontName.family}__${f.fontName.style}`));
await Promise.all(
  fams.flatMap(f =>
    styles
      .filter(s => has.has(`${f}__${s}`))
      .map(s => figma.loadFontAsync({ family: f, style: s }))
  )
);
```

### 인스턴스 내부 텍스트 폰트 로딩

```javascript
async function loadFontsIn(node) {
  const set = new Set();
  const visit = (n) => {
    if (n.type === "TEXT") {
      try { set.add(JSON.stringify(n.fontName)); } catch (e) {}
    }
    if ("children" in n) n.children.forEach(visit);
  };
  visit(node);
  await Promise.all(
    [...set].map(s => figma.loadFontAsync(JSON.parse(s)).catch(() => {}))
  );
}
```

### Variant 명시적 선택

```javascript
function variantProps(comp) {
  const out = {};
  comp.name.split(",").forEach(part => {
    const [k, v] = part.split("=").map(s => s.trim());
    if (k) out[k] = v;
  });
  return out;
}

function findVariant(set, want) {
  const children = set.children.filter(c => c.type === "COMPONENT");
  return children.find(c => {
    const p = variantProps(c);
    return Object.entries(want).every(([k, v]) => (p[k] || "").trim() === v);
  }) || set.defaultVariant || children[0];
}

const sendBtnVariant = findVariant(iconBtnSet, {
  Mode: "Default",
  Type: "Filled",
  Size: "Medium(40)",
  State: "Default",
  Radius: "on",
  "Button Color": "Default",
});
```

---

## 부록 C — 잘 정리된 컴포넌트 md(checkbox_v2.md 같은)가 있었다면?

`design-cds-docs/01_chord-ds/components/checkbox_v2.md`처럼 frontmatter에 `figma.design` URL, `props`, `prop-constraints`, `tokens`(SoT 경로 병기), `variants`(평면 키)가 모두 정리된 문서를 입력으로 받았다면 위 세 실수가 어떻게 달라졌을지 정리.

### 실수 1 (primitive로 그림) — 부분적으로만 막힘, 오히려 위험할 수도

- ✅ 도움: frontmatter의 `figma.design` URL이 "이건 Figma 컴포넌트로 존재한다"는 강한 신호다. `get_libraries` 단계 없이 바로 import 경로로 진입 가능.
- ⚠️ 위험: checkbox_v2.md는 토큰(`{colors.outline-default-200a}`), variant 분기, anatomy(box 16px, label-gap 6px)까지 모두 명시돼 있다. **이게 본문의 "토큰 = DS" 오해를 오히려 강화할 수 있음.** 문서가 "완벽해 보일수록" *"여기 다 있으니 그냥 그리자"* 의 유혹이 커진다. design_v3.md보다 더 정교하게 정리된 문서일수록 이 함정이 깊다.
- → 막으려면 md 컨벤션 자체에 **"frontmatter에 `figma.design`이 있으면 무조건 컴포넌트 인스턴스로 import"** 규칙을 한 줄 박아둬야 한다.

### 실수 2 (default variant 그대로 사용) — 거의 확실히 막힘

checkbox_v2.md는 `props` 축(type/mode/status)과 허용 값, 평면 키(`checkbox-circle-default`, `checkbox-circle-enabled`...)를 명시한다. `prop-constraints`까지 있어 "Square는 List Item 안에서만" 같은 의도가 드러난다. **AI가 default를 신뢰할 이유가 사라짐** — 어떤 조합을 골라야 하는지 md에 박혀 있기 때문이다.

App Bar 사례에 대입하면: md에 `variants: [GNB, AppBar-Chat, ...]`이 평면 키로 적혀 있고 "채팅 헤더 = AppBar-Chat"이라는 의미가 있었다면 default를 BNB로 잘못 찍는 일은 발생하지 않는다.

### 실수 3 (디스커버리 토큰 과소비) — 크게 줄어듦

- frontmatter `figma.design` URL → `get_libraries` 스킵 가능
- 컴포넌트명·variant 키 정확히 명시 → `search_design_system` query를 좁힐 수 있음 (`"checkbox circle"`)
- 토큰 SoT 경로 코멘트(`# SoT: system/color/outline/default-200a`)까지 있음 → `includeVariables: true`로 variables 통째로 받을 필요 없음
- → 본문의 "라운드 트립 4번 → 1~2번"이 실제로 가능해짐

### 정리

| 실수 | checkbox_v2.md급 문서가 막아주는가? |
|---|---|
| 1. primitive로 그림 | ⚠️ 부분적. md가 "완벽할수록" 오히려 유혹이 커짐. 컨벤션에 "figma.design 있으면 import 우선" 명시 필요 |
| 2. default variant 사용 | ✅ 거의 확실히 막음. props 축·허용 값·평면 키가 명시되어 있음 |
| 3. 디스커버리 과소비 | ✅ 크게 줄임. figma URL + 컴포넌트명 + variant 키 + 토큰 SoT 경로가 한 곳에 있음 |

**핵심 교훈**: 컴포넌트 md의 강점은 *props/variants/tokens가 평면 키로 명시*되어 있어 실수 2·3을 구조적으로 막는다는 점이다. 단, 실수 1은 문서 품질이 올라갈수록 오히려 함정이 깊어지므로, md 컨벤션 자체에 "figma.design이 있으면 import 우선"이라는 규칙을 한 줄 추가해야 한다.

---

## 한 줄 요약

> **"토큰을 따랐다"는 "DS를 썼다"가 아니다.**
> Figma 파일에 라이브러리가 붙어 있으면, primitive 그리기 전에 무조건 `search_design_system` → 컴포넌트 인스턴스로 만든다.
