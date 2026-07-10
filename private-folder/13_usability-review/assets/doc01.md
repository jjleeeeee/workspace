## 1. 배경

- 위버스 글로벌 홈-커뮤니티 검색-커뮤니티 홈으로 진입 동선의 화면전환이 어색하다는 의견
- 화면 전환은 글로벌 홈 지표 이탈을 줄이기 위한 기획 의도

## 2. 현황

### 2-1. 영상

| **화면** | **iOS** | **Android** |
| -------- | -------- | -------- |
| **영상 캡쳐** | ```adf-media<br>{"msAttrs":{"layout":"center","width":320,"widthType":"pixel"},"mediaAttrs":{"width":1126,"alt":"ScreenRecording_06-11-2026 11-30-35_1.mov","id":"15090a85-fe08-4318-ace0-0a44800aad15","collection":"contentId-5864783926","type":"file","height":2436}}<br>``` | ```adf-media<br>{"msAttrs":{"layout":"center","width":320,"widthType":"pixel"},"mediaAttrs":{"width":1080,"alt":"Screen_Recording_20260611_114050.mp4","id":"7f8a3208-e03b-4294-bbe0-be1e8e9356ba","collection":"contentId-5864783926","type":"file","height":2340}}<br>``` |
<!-- adf:table attrs='{"layout":"center","width":760}' -->

### 2-2. 스크린샷

| **화면** | **홈** | **커뮤니티 검색** | **커뮤니티 홈** |
| -------- | -------- | -------- | -------- |
| **iOS** | ```adf-media<br>{"msAttrs":{"layout":"center","width":173,"widthType":"pixel"},"mediaAttrs":{"width":390,"alt":"frame-007.png","id":"b8ee9958-c7eb-48e6-b2a4-65295910b8ca","collection":"contentId-5864783926","type":"file","height":844}}<br>``` | ```adf-media<br>{"msAttrs":{"layout":"center","width":173,"widthType":"pixel"},"mediaAttrs":{"width":390,"alt":"frame-014.png","id":"85217b34-d638-4c73-99f2-56f6e389382b","collection":"contentId-5864783926","type":"file","height":844}}<br>``` | ```adf-media<br>{"msAttrs":{"layout":"center","width":173,"widthType":"pixel"},"mediaAttrs":{"width":390,"alt":"frame-017.png","id":"e83f68b4-3f8c-4052-9515-4a6fccfa59fb","collection":"contentId-5864783926","type":"file","height":844}}<br>``` |
| **트랜지션** | - | push | 검색 instant 후 홈에서 push |
<!-- adf:table attrs='{"width":760}' -->

| **화면** | **홈** | **커뮤니티 검색** | **커뮤니티 홈** |
| -------- | -------- | -------- | -------- |
| ** Android** | ```adf-media<br>{"msAttrs":{"layout":"center","width":173,"widthType":"pixel"},"mediaAttrs":{"width":390,"alt":"frame-006.png","id":"dc4fe47b-8f3f-4c42-b08a-c49ac9a4e7a0","collection":"contentId-5864783926","type":"file","height":845}}<br>``` | ```adf-media<br>{"msAttrs":{"layout":"center","width":173,"widthType":"pixel"},"mediaAttrs":{"width":390,"alt":"frame-011.png","id":"16b78b50-2cfd-4d7f-b430-abb5b557f562","collection":"contentId-5864783926","type":"file","height":845}}<br>``` | ```adf-media<br>{"msAttrs":{"layout":"center","width":173,"widthType":"pixel"},"mediaAttrs":{"width":390,"alt":"frame-014.png","id":"85217b34-d638-4c73-99f2-56f6e389382b","collection":"contentId-5864783926","type":"file","height":845}}<br>``` |
| **트랜지션** | - | instant | instant |
<!-- adf:table attrs='{"width":760}' -->

## 3. 문제 정의

### 3-1. [https://bighitcorp.atlassian.net/wiki/spaces/WRP/pages/5795548202](https://bighitcorp.atlassian.net/wiki/spaces/WRP/pages/5795548202) 

### 3-2. 화면 동선 분석

| **Platform** | **동선** | **이유** |
| -------- | -------- | -------- |
| iOS | 동선상 어색함이 존재 | 1. 검색이 push로 화면전환 되는 계층적 탐색 구조로 진행<br>2. 커뮤니티를 선택했을 경우 <span style="color: #ff5630">커뮤니티 검색 창에서 커뮤니티 홈으로 push되는게 아니라 instant 후 글로벌 홈에서 커뮤니티 홈으로 push</span> |
| Android | 동선상 어색함을 느끼지 못함 | 1. 화면 전환 처리가 instant<br>2. 커뮤니티 홈에서 뒤로(back) 돌아올 때 <span style="color: #4c9aff">replace stack으로 커뮤니티 검색 화면을 없애고 홈으로 전환</span> |
| 공통 | 1. 홈 탭을 누르면 커뮤니티 탭으로 되돌아갈 수 없음<br>2. 커뮤니티 탭에 대한 세션 유지가 어려워 유저들은 계속해서 커뮤니티 검색 페이지에서 나의 커뮤니티를 눌러야하는 번거로움 |
<!-- adf:table attrs='{"width":760}' -->

~~~panel type=info
**Replace Stack이란?**뒤로가기 기록을 갈아끼우는 것.  
화면 동선 구조가 글로벌 홈 > 커뮤니티 선택 > 커뮤니티 홈 일 경우 뒤로(back) 돌아갈 때 커뮤니티 선택 화면을 히스토리 기록에서 제외하고 바로 홈으로 보냄참고: [Android Back Stack](https://developer.android.com/guide/navigation/backstack?hl=ko#pop), [Apple Developer](https://developer.apple.com/documentation/uikit/uinavigationcontroller/setviewcontrollers%28_%3Aanimated%3A%29)
~~~

## 4. 가설 설정

~~~panel type=note
커뮤니티 검색/선택 이후 커뮤니티에 진입했을 때 탭간 전환이 일어나도 내 커뮤니티로 즉시 재진입(세션 유지)할 수 있다면, 커뮤니티 진입 실패와 반복 탐색 비용이 줄어든다.
~~~

## 5. iOS Navagation Bar 탐색 사례

~~~expand title="HIG - Search as a tab"
##### HIG - [Search as a tab](https://developer.apple.com/design/human-interface-guidelines/search-fields#Search-as-a-tab)

```adf-media
{"msAttrs":{"layout":"center","width":698,"widthType":"pixel"},"mediaAttrs":{"width":698,"alt":"2026-06-15_10-17-30.png","id":"ec87a7af-ef51-4c68-b2c2-e5b9bafa4de6","collection":"contentId-5864783926","type":"file","height":768}}
```
~~~

### 5-1. iOS - Standard tab

**추천 콘텐츠를 제공하고, 검색 결과를 쉽게 찾고, 탐색을 유도**

|  | **HIG** | **앱스토어** | **게임** |
| -------- | -------- | -------- | -------- |
| **Screen** | ```adf-media<br>{"msAttrs":{"layout":"center","width":236,"widthType":"pixel"},"mediaAttrs":{"width":305,"alt":"2026-06-15_10-19-41.png","id":"dd9bf08e-e35b-47c7-aa24-a5d65007679b","collection":"contentId-5864783926","type":"file","height":328}}<br>``` | ```adf-media<br>{"msAttrs":{"layout":"center","width":320,"widthType":"pixel"},"mediaAttrs":{"width":1126,"alt":"ScreenRecording_06-15-2026 10-40-06_1.MP4","id":"db7673c6-cb2e-4d43-8a53-8f77efbfa5da","collection":"contentId-5864783926","type":"file","height":2436}}<br>``` | ```adf-media<br>{"msAttrs":{"layout":"center","width":320,"widthType":"pixel"},"mediaAttrs":{"width":1126,"alt":"ScreenRecording_06-15-2026 10-36-57_1.MP4","id":"97b492a0-0706-4c78-83dd-9a5f968d9df1","collection":"contentId-5864783926","type":"file","height":2436}}<br>``` |
| 표준 탭을 사용하는 iOS 전용 앱.1. 검색이 Navigation Bar의 메뉴에 포함<br>2. 해당 탭은 다른 탭과는 약한 연결 혹은 관련성 없는 독립된 페이지(형제 페이지)로 제공.<br>3. <span style="color: #4c9aff">탭간 이동 시에 세션이 유지됨</span> |
<!-- adf:table attrs='{"width":760}' -->

### 5-2. iOS - Button appearance

**사용자가 필요한 정보를 빠르게 탐색**

|  | **HIG** | **Apple Store** | **팟캐스트** | **애플뮤직** | **사진첩** |
| -------- | -------- | -------- | -------- | -------- | -------- |
| **Screen** | ```adf-media<br>{"msAttrs":{"layout":"center","width":192,"widthType":"pixel"},"mediaAttrs":{"width":314,"alt":"2026-06-15_10-46-45.png","id":"a7b57ebb-d1aa-41b9-a81f-4ee38597e443","collection":"contentId-5864783926","type":"file","height":327}}<br>``` | ```adf-media<br>{"msAttrs":{"layout":"center","width":320,"widthType":"pixel"},"mediaAttrs":{"width":1126,"alt":"ScreenRecording_06-15-2026 10-57-37_1.MP4","id":"164f247a-4954-4544-8068-b9a6b90cf7fc","collection":"contentId-5864783926","type":"file","height":2436}}<br>``` | ```adf-media<br>{"msAttrs":{"layout":"center","width":320,"widthType":"pixel"},"mediaAttrs":{"width":1126,"alt":"ScreenRecording_06-15-2026 10-59-00_1.MP4","id":"4765fccf-2e54-4e59-926f-f6c01c6af9dd","collection":"contentId-5864783926","type":"file","height":2436}}<br>``` | ```adf-media<br>{"msAttrs":{"layout":"center","width":320,"widthType":"pixel"},"mediaAttrs":{"width":1126,"alt":"ScreenRecording_06-15-2026 11-04-30_1.MP4","id":"7f735eab-9927-469d-8c29-d3535f0d952b","collection":"contentId-5864783926","type":"file","height":2436}}<br>``` | ```adf-media<br>{"msAttrs":{"layout":"center","width":320,"widthType":"pixel"},"mediaAttrs":{"width":1126,"alt":"ScreenRecording_06-15-2026 11-05-05_1.MP4","id":"4033dc31-78b7-4fc7-9193-fc346d1232be","collection":"contentId-5864783926","type":"file","height":2436}}<br>``` |
| 버튼모양을 따로 사용하는 iOS 전용 앱.1. 검색이 Navigation Bar의 메뉴에 별도 분리<br>2. 버튼을 누르면 Navigation Bar 위치에 하단이 작아지고 검색창이 노출<br>3. 애플뮤직의 경우엔 앱 접속시 검색창을 활성화 시켜둔 상태로 진입<br>4. 사진 앱의 경우엔 검색 버튼 눌렀을 때 키보드까지 활성화<br>5. <span style="color: #4c9aff">탭간 이동 시에 세션이 유지됨</span> |
<!-- adf:table attrs='{"width":760}' -->

### 5-3. System Navigation을 사용하지만 시스템 룰을 따르지 않는 앱 

|  | **카카오뱅크** | **배달의민족** | **zomato** | **ebay** |
| -------- | -------- | -------- | -------- | -------- |
| **Screen** | ```adf-media<br>{"msAttrs":{"layout":"center","width":320,"widthType":"pixel"},"mediaAttrs":{"width":1126,"alt":"ScreenRecording_06-15-2026 11-12-32_1.MP4","id":"333d95ec-5ad1-48be-b1bb-1ede04ae5bae","collection":"contentId-5864783926","type":"file","height":2436}}<br>``` | ```adf-media<br>{"msAttrs":{"layout":"center","width":320,"widthType":"pixel"},"mediaAttrs":{"width":1126,"alt":"ScreenRecording_06-15-2026 11-40-48_1.mov","id":"ceb29a87-18e4-4959-84af-e087f2f60484","collection":"contentId-5864783926","type":"file","height":2436}}<br>``` | ```adf-media<br>{"msAttrs":{"layout":"center","width":320,"widthType":"pixel"},"mediaAttrs":{"width":1126,"alt":"ScreenRecording_06-15-2026 11-48-41_1.MP4","id":"136785cb-9722-4008-bac5-a61e1a0058ab","collection":"contentId-5864783926","type":"file","height":2436}}<br>``` | ```adf-media<br>{"msAttrs":{"layout":"center","width":320,"widthType":"pixel"},"mediaAttrs":{"width":1126,"alt":"ScreenRecording_06-15-2026 11-27-10_1.MP4","id":"929c9040-db35-40c2-8f04-582a45807c94","collection":"contentId-5864783926","type":"file","height":2436}}<br>``` |
| **설명** | Button appearance 를 사용하지만, AI 채팅 버튼으로 사용 | UI만 Standard tab으로 사용 | Standard tab은 사용하지만, FAB를 따로 커스텀해서 사용하는 형태 | UI와 UX Flow을 Standard tab으로 사용검색 탭 클릭 시에 키보드 on |
| **화면전환** | modal | - 홈 탭은 1depth까지는 네비게이션이 존재<br>- 홈 탭을 제외하고는 탭 진입 이후엔 모두 계층적 탐색 (네비게이션 사라짐) | Move in/out | instant |
<!-- adf:table attrs='{"width":760}' -->

## 6. Android 탐색 사례

~~~expand title="Material Design 3 - Transition"
##### M3 - [Transition-patterns](https://m3.material.io/styles/motion/transitions/transition-patterns)

```adf-media
{"msAttrs":{"layout":"center","width":746,"widthType":"pixel"},"mediaAttrs":{"width":944,"alt":"image-20260615-031011.png","id":"b4a6aa4c-a811-47f1-9fb4-4cf58de27c22","collection":"contentId-5864783926","type":"file","height":775}}
```
~~~

### 6-1. Container Transition, Forward and Backward, Top Level

|  | **M3** | **Gmail** | **Google** | **Google Play** |
| -------- | -------- | -------- | -------- | -------- |
| **Screen** | ```adf-media<br>{"msAttrs":{"layout":"center","width":320,"widthType":"pixel"},"mediaAttrs":{"width":1352,"alt":"lyfrrw39-GM3-Transitions-TransitionPatterns-6-1-v01.mp4","id":"b6f3da2d-8ce8-4fed-b3fc-e3c5701dc4b9","collection":"contentId-5864783926","type":"file","height":1024}}<br>``` | ```adf-media<br>{"msAttrs":{"layout":"center","width":320,"widthType":"pixel"},"mediaAttrs":{"width":1080,"alt":"Screen_Recording_20260615_124105_Gmail.mp4","id":"8aa59f4c-731d-4d7e-b2f4-787811a79e79","collection":"contentId-5864783926","type":"file","height":2340}}<br>``` | ```adf-media<br>{"msAttrs":{"layout":"center","width":320,"widthType":"pixel"},"mediaAttrs":{"width":1080,"alt":"Screen_Recording_20260615_124021_Google.mp4","id":"7ce1b924-587a-4cf0-91e2-a34b32cd2178","collection":"contentId-5864783926","type":"file","height":2340}}<br>``` | ```adf-media<br>{"msAttrs":{"layout":"center","width":320,"widthType":"pixel"},"mediaAttrs":{"width":1080,"alt":"Screen_Recording_20260615_124250_GooglePlay.mp4","id":"46de1865-acb4-4e1f-a450-17f2fe32c9fc","collection":"contentId-5864783926","type":"file","height":2340}}<br>``` |
|  | 화면 전환이 대부분 instant로 빠르게 전환됨.backward에서 [Container Transition](https://m3.material.io/styles/motion/transitions/applying-transitions#50f9fc3f-c7e2-4099-b614-7c36b1c5285d)을 사용하는 것으로 보임탭간 세션 유지 | 탭간 세션 유지 | 계층적 이동 구조는 [Forward and backward](https://m3.material.io/styles/motion/transitions/applying-transitions#41b11a78-b88f-4972-904c-880bc348acc8) 룰을 따르는 것으로 보임<span style="color: #ff5630">탭간 세션 유지 안됨</span> |
|  | instant | instant | instant |
<!-- adf:table attrs='{"width":760}' -->

## 7. 방향성 설정

1. 커뮤니티 검색 페이지를 계층 탐색 페이지가 아닌 modal page로 변경

  - 검색 페이지는 ‘다음 계층 페이지’가 아니라 ‘목적지 선택 페이지’
  - context의 전환(검색)으로 본다면 modal이 어색하지 않음 
  - **Android와 함께 개선이 필요**
2. 버튼모양(Button appearance)형태로 검색 페이지를 개선

  - 글로벌 홈과 커뮤니티를 분리
  - 홈 탭은 글로벌 홈으로 작동하며, 커뮤니티 버튼은 커뮤니티 검색 및 진입
  - 엔드는 서로 공유
  - **Android 사용성은 현재 유지, iOS 분기**
3. 표준탭(Standard tab)으로 GNB를 개선

  - 2번과 사용성은 같음
  - **Android와 함께 개선이 필요**

## 8. 프로토타입 테스트

~~~expand title="3.15.0 Flow에서 목록검색 화면으로 돌아가는 상황만 추가하는게 어려운 이유"
| **프로토타입 링크** | [**3.15.0에서 목록검색만 나오게 노출**](https://www.figma.com/proto/7tuvMuw9gk20QnyHo0iu2e/%EA%B8%80%EB%A1%9C%EB%B2%8C%ED%99%88---%EC%BB%A4%EB%AE%A4%EB%8B%88%ED%8B%B0-%EB%8F%99%EC%84%A0-%EA%B0%9C%EC%84%A0?node-id=35-75221&viewport=613%2C161%2C0.08&t=mh1m8sGAGmolQvWE-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=35%3A75221&page-id=0%3A1&show-proto-sidebar=1) | **불가능 사유** |
| -------- | -------- | -------- |
| **화면** | ```adf-media<br>{"msAttrs":{"layout":"center","width":320,"widthType":"pixel"},"mediaAttrs":{"width":784,"alt":"화면 기록 2026-06-17 오후 5.17.29.mov","id":"9378158e-42f2-4810-bedf-bf5fd4276b39","collection":"contentId-5864783926","type":"file","height":1702}}<br>``` | 계층적 탐색 구조형태로 화면 트랜지션을 진행했을 때1. 현재 목록검색에서는 바텀 네비게이션이 나오지 않음<br>2. 목록에서 커뮤니티 선택하면 커뮤니티로 이동하면서 바텀 네비게이션이 다시 나옴<br>3. 커뮤니티로 이동 후 다시 목록검색 버튼을 눌렀을 때 아래 2가지 고민 포인트가 필요.<br><br>  1. push로 목록검색창 노출 (stack이 쌓임)<br>  2. 기존 커뮤니티를 pop하면서 목록검색창 노출<br>4. History Back : 위 내용 역순으로 바텀네비게이션의 노출이 부자연스러움<br>5. <span style="color: #ff5630">어떠한 경우에도 바텀 네비게이션의 Home tab을 눌렀을 때 커뮤니티 세션은 유지될 수 없을 것으로 예상</span> |
<!-- adf:table attrs='{"layout":"center","width":760}' -->
~~~

~~~panel type=info
아래 리서치 결과로 다음과 같은 프로토타입 형태를 도출
~~~

| **프로토타입 링크** | [**modality**](https://www.figma.com/proto/7tuvMuw9gk20QnyHo0iu2e/%EA%B8%80%EB%A1%9C%EB%B2%8C%ED%99%88---%EC%BB%A4%EB%AE%A4%EB%8B%88%ED%8B%B0-%EB%8F%99%EC%84%A0-%EA%B0%9C%EC%84%A0?node-id=1-168045&viewport=613%2C161%2C0.08&t=v8FmyOqScQOG6T5S-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=1%3A168045&show-proto-sidebar=1&page-id=0%3A1) | [**Button appearance - Search**](https://www.figma.com/proto/7tuvMuw9gk20QnyHo0iu2e/%EA%B8%80%EB%A1%9C%EB%B2%8C%ED%99%88---%EC%BB%A4%EB%AE%A4%EB%8B%88%ED%8B%B0-%EB%8F%99%EC%84%A0-%EA%B0%9C%EC%84%A0?node-id=12-38294&viewport=613%2C161%2C0.08&t=v8FmyOqScQOG6T5S-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=12%3A38294&show-proto-sidebar=1&page-id=0%3A1) | [**Button appearance - Tab**](https://www.figma.com/proto/7tuvMuw9gk20QnyHo0iu2e/%EA%B8%80%EB%A1%9C%EB%B2%8C%ED%99%88---%EC%BB%A4%EB%AE%A4%EB%8B%88%ED%8B%B0-%EB%8F%99%EC%84%A0-%EA%B0%9C%EC%84%A0?node-id=35-55640&viewport=613%2C161%2C0.08&t=mh1m8sGAGmolQvWE-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=35%3A55640&page-id=0%3A1&show-proto-sidebar=1)** **{status:Case 추가, 6/18|color:green}  | [**Standard Tab**](https://www.figma.com/proto/7tuvMuw9gk20QnyHo0iu2e/%EA%B8%80%EB%A1%9C%EB%B2%8C%ED%99%88---%EC%BB%A4%EB%AE%A4%EB%8B%88%ED%8B%B0-%EB%8F%99%EC%84%A0-%EA%B0%9C%EC%84%A0?node-id=14-72350&viewport=613%2C161%2C0.08&t=v8FmyOqScQOG6T5S-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=14%3A72350&show-proto-sidebar=1&page-id=0%3A1) |
| -------- | -------- | -------- | -------- | -------- |
| **화면** | ```adf-media<br>{"msAttrs":{"layout":"center","width":320,"widthType":"pixel"},"mediaAttrs":{"width":784,"alt":"화면 기록 2026-06-15 오후 1.03.37.mov","id":"1f20a2b7-a740-4982-b970-58dd4246ca39","collection":"contentId-5864783926","type":"file","height":1702}}<br>``` | ```adf-media<br>{"msAttrs":{"layout":"center","width":320,"widthType":"pixel"},"mediaAttrs":{"width":784,"alt":"화면 기록 2026-06-15 오후 4.04.12.mov","id":"ff1abbd4-b846-448f-accd-04b53be3a127","collection":"contentId-5864783926","type":"file","height":1702}}<br>``` | ```adf-media<br>{"msAttrs":{"layout":"center","width":320,"widthType":"pixel"},"mediaAttrs":{"width":784,"alt":"화면 기록 2026-06-17 오후 5.18.44.mov","id":"be15612b-c96a-40ff-9a76-ef77fe26c328","collection":"contentId-5864783926","type":"file","height":1702}}<br>``` | ```adf-media<br>{"msAttrs":{"layout":"center","width":320,"widthType":"pixel"},"mediaAttrs":{"width":784,"alt":"화면 기록 2026-06-15 오후 4.14.28.mov","id":"433a4802-ddb3-4003-97da-491c4819f8bb","collection":"contentId-5864783926","type":"file","height":1702}}<br>``` |
| **설명** | 커뮤니티 검색 버튼을 모달페이지 형태로 노출노출 이후 모달은 dismiss하고 계층 플로우로 연결 | iOS 버튼모양 UX 적용검색 버튼을 누르면 검색창 형태로 변경되며, 페이지에서도 네비게이션바는 유지 | iOS 버튼모양 UX 적용목록검색 버튼은 목록검색 탭으로 이동하는 탭으로 작동 | iOS 표준 탭 UX 적용검색 탭은 타 탭과 연관이 없거나 적음 (독립적 페이지) |
| **세션** | <span style="color: #ff5630">유지되지 않음</span> | <span style="color: #4c9aff">유지</span> | <span style="color: #4c9aff">유지</span> | <span style="color: #4c9aff">유지</span> |
| **트레이드 오프** | iOS/AND 모두 모달형태로 변경되어야함세션 유지 어려움 | 안드로이드는 현행 유지하면 되나 iOS/AND 사용성이 분기됨 | iOS/AND 모두 탐색 변경해야함 | iOS/AND 모두 탐색 변경해야함 |
| 별도 탭으로 작동하려면 목록검색 버튼의 포커스(활성)상태가 필요함 |
<!-- adf:table attrs='{"layout":"center","width":760}' -->