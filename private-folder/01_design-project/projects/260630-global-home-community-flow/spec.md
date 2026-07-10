# Spec — 글로벌홈 커뮤니티 동선 개선

## 1. 배경

- 위버스 글로벌 홈-커뮤니티 검색-커뮤니티 홈으로 진입 동선의 화면전환이 어색하다는 의견
- 화면 전환은 글로벌 홈 지표 이탈을 줄이기 위한 기획 의도

## 2. 문제 정의

### 2-1. 3.14.0 버전 동선

| **플랫폼** | **iOS** | **플로우 분석** |
| -------- | -------- | -------- |
| **화면** | ```adf-media<br>{"msAttrs":{"layout":"center","width":320,"widthType":"pixel"},"mediaAttrs":{"width":1126,"alt":"ScreenRecording_06-19-2026 06-54-40_1.mov","id":"1d720e53-c5cd-4965-baf3-2bbeb9d8b6eb","collection":"contentId-5864783926","type":"file","height":2436}}<br>``` | 1. 글로벌 홈 탭 안에 나의 커뮤니티가 상단에 존재<br>2. 글로벌홈-커뮤니티 목록검색-커뮤니티 홈이 계층적 탐색 구조<br><br>  1. [+] 버튼을 누르면 커뮤니티 목록 검색이 Push로 전환 <span style="color: #ff5630">(바텀 네비게이션 유지X)</span><br>  2. 커뮤니티 선택하면 커뮤니티 홈 Push로 전환<br>  3. 커뮤니티 홈에서 되돌아 나갈때도 커뮤니티 홈(pop)-커뮤니티 목록 검색(pop)-글로벌 홈으로 이동 (History back)<br>3. 위버스 2.0 혹은 그 이전부터 위 사용성을 유지해옴 |
<!-- adf:table attrs='{"layout":"center","width":760}' -->

### 2-2. 3.15.0 버전 동선

| **플랫폼** | **iOS** | **Android** | **플로우 분석** |
| -------- | -------- | -------- | -------- |
| **화면** | ```adf-media<br>{"msAttrs":{"layout":"center","width":320,"widthType":"pixel"},"mediaAttrs":{"width":1126,"alt":"ScreenRecording_06-11-2026 11-30-35_1.mov","id":"15090a85-fe08-4318-ace0-0a44800aad15","collection":"contentId-5864783926","type":"file","height":2436}}<br>``` | ```adf-media<br>{"msAttrs":{"layout":"center","width":320,"widthType":"pixel"},"mediaAttrs":{"width":1080,"alt":"Screen_Recording_20260611_114050.mp4","id":"7f8a3208-e03b-4294-bbe0-be1e8e9356ba","collection":"contentId-5864783926","type":"file","height":2340}}<br>``` | 1. 나의 커뮤니티가 우하단 민트색 버튼으로 기능이 이동<br>2. <span style="color: #ff5630">민트색 버튼을 누르면 글로벌 홈에서 계층 탐색 이동(Push, 바텀 네비게이션 유지X)</span><br>3. 커뮤니티를 선택하면 <span style="color: #ff5630">계층 탐색 이동을 취소하고(Instant Pop) 글로벌 홈에서 커뮤니티 홈으로 다시 계층 탐색 이동(Push)</span> |
<!-- adf:table attrs='{"layout":"center","width":760}' -->

~~~expand title="스크린샷으로 화면 전환 분석"
| **화면** | **홈** | **커뮤니티 검색** | **커뮤니티 홈** |
| -------- | -------- | -------- | -------- |
| **iOS** | - | push | 검색 instant 후 홈에서 push |
| ```adf-media<br>{"msAttrs":{"layout":"center","width":173,"widthType":"pixel"},"mediaAttrs":{"width":390,"alt":"frame-007.png","id":"b8ee9958-c7eb-48e6-b2a4-65295910b8ca","collection":"contentId-5864783926","type":"file","height":844}}<br>``` | ```adf-media<br>{"msAttrs":{"layout":"center","width":173,"widthType":"pixel"},"mediaAttrs":{"width":390,"alt":"frame-014.png","id":"85217b34-d638-4c73-99f2-56f6e389382b","collection":"contentId-5864783926","type":"file","height":844}}<br>``` | ```adf-media<br>{"msAttrs":{"layout":"center","width":173,"widthType":"pixel"},"mediaAttrs":{"width":390,"alt":"frame-017.png","id":"e83f68b4-3f8c-4052-9515-4a6fccfa59fb","collection":"contentId-5864783926","type":"file","height":844}}<br>``` |
| **Android** | - | instant | instant |
| ```adf-media<br>{"msAttrs":{"layout":"center","width":173,"widthType":"pixel"},"mediaAttrs":{"width":390,"alt":"frame-006.png","id":"dc4fe47b-8f3f-4c42-b08a-c49ac9a4e7a0","collection":"contentId-5864783926","type":"file","height":845}}<br>``` | ```adf-media<br>{"msAttrs":{"layout":"center","width":173,"widthType":"pixel"},"mediaAttrs":{"width":390,"alt":"frame-011.png","id":"16b78b50-2cfd-4d7f-b430-abb5b557f562","collection":"contentId-5864783926","type":"file","height":845}}<br>``` | ```adf-media<br>{"msAttrs":{"layout":"center","width":173,"widthType":"pixel"},"mediaAttrs":{"width":390,"alt":"frame-014.png","id":"85217b34-d638-4c73-99f2-56f6e389382b","collection":"contentId-5864783926","type":"file","height":845}}<br>``` |
<!-- adf:table attrs='{"width":760}' -->
~~~

### 2-3. 3.15.0 화면 동선 분석

| **Platform** | **분석** |
| -------- | -------- |
| 공통 | **3.14.0과 비교**1. 기존 유저는 글로벌 홈에서 커뮤니티로 이동하는 UX에 익숙한데, 이 동선이 우측 하단 민트색 버튼으로 변경되며 혼란<br>2. 커뮤니티 홈에서도 커뮤니티 목록 검색을 할 수 있게 바텀 네비게이션 설계가 변경되면서 동선 꼬임**3.15.0으로 UX를 바꾸면서 놓친 점**1. 홈에 종속된 기능이 바텀 네비게이션 영역으로 변경되었으나, UX는 여전히 홈에 종속된 사용성으로 작동<br>2. 바텀 네비게이션으로 작동한다면 각 탭의 기능은 연관이 없거나 약한 연관 관계. 세션 유지가 필수<br>3. 3.15.0에서는 홈 탭을 누르면 글로벌 홈에서 처음부터 다시 시작(내가 보던 커뮤니티 세션 유지가 어려움)<br>4. 커뮤니티 탭에 대한 세션 유지가 어려워 유저들은 계속해서 커뮤니티 검색 페이지에서 나의 커뮤니티를 눌러야하는 번거로움 |
<!-- adf:table attrs='{"width":760}' -->

~~~expand title="Android 사용성은 문제 없어보이는 이유"
| **Platform** | **동선** | **이유** |
| -------- | -------- | -------- |
| Android | 동선상 어색함을 느끼지 못함 | 1. 화면 전환 처리가 instant<br>2. 커뮤니티 홈에서 뒤로(back) 돌아올 때 <span style="color: #4c9aff">replace stack으로 커뮤니티 검색 화면을 없애고 홈으로 전환</span> |
<!-- adf:table attrs='{"width":760}' -->

~~~panel type=info
**Replace Stack이란?**뒤로가기 기록을 갈아끼우는 것.  
화면 동선 구조가 글로벌 홈 > 커뮤니티 선택 > 커뮤니티 홈 일 경우 뒤로(back) 돌아갈 때 커뮤니티 선택 화면을 히스토리 기록에서 제외하고 바로 홈으로 보냄참고: [Android Back Stack](https://developer.android.com/guide/navigation/backstack?hl=ko#pop), [Apple Developer](https://developer.apple.com/documentation/uikit/uinavigationcontroller/setviewcontrollers%28_%3Aanimated%3A%29)
~~~
~~~

## 3. 데이터 분석

### 3-1. 정성 지표

[https://bighitcorp.atlassian.net/wiki/spaces/WRP/pages/5795548202](https://bighitcorp.atlassian.net/wiki/spaces/WRP/pages/5795548202) 

> 모니터링 기간: 2026-05-26 ~ 2026-06-01 / 채널: Weverse, X, 더쿠, 앱스토어 / 담당: 주은, 수지

| 채널 | 전반 반응 | 주요 불만 | 개선 요구 |
| -------- | -------- | -------- | -------- |
| **Weverse** | 매우 부정적 | 커뮤니티 진입 어려움(5분 탐색), 홈이 자꾸 초기화, 바텀 네비게이션 아이콘 인지 불가 | 커뮤니티 접근 경로 직관화, 홈 피드 스크롤 위치 유지 |
| **X(트위터)** | 매우 부정적 | 커뮤니티 숨겨짐, 원치 않는 타 아티스트 노출, 낯선 UI | 내 커뮤니티 접근 복구, 바텀 네비게이션 인지 개선 |
| **더쿠** | 매우 부정적 | 내가 가입한 커뮤니티 진입 실패, UI 혹평, 라이브 업데이트 강제로 방송 놓침 | 커뮤니티 진입 동선 롤백 또는 간소화 |
| **앱스토어** | 매우 부정적 | 커뮤니티 진입 불편, 미가입 아티스트 콘텐츠 강제 노출, 앱 크래시·라이브 오류 | 이전 레이아웃 복구 요구 다수 |
| **공통 현상** | — | 유저들이 서로 우회 접속 방법 공유 (커뮤니티 찾는 팁 전파) | — |
<!-- adf:table attrs='{"width":760}' -->

### 3-2. 정량 지표

[https://docs.google.com/spreadsheets/d/1zaSu1Tx1h8g6MzpltLPzGt1YGGb7qBc8WfTkx2kmu80/edit?gid=1127494724#gid=1127494724](https://docs.google.com/spreadsheets/d/1zaSu1Tx1h8g6MzpltLPzGt1YGGb7qBc8WfTkx2kmu80/edit?gid=1127494724#gid=1127494724) 

글로벌 홈 > 커뮤니티 목록 검색 > 커뮤니티 진입 후 유저의 다음 행동 지표

1. 탑 네비게이션의 뒤로가기 (<)
2. 바텀 네비게이션의 커뮤니티 목록 버튼 (민트색 버튼)

| 발견 | 수치 | 의미 |
| -------- | -------- | -------- |
| 뒤로가기를 눌렀는데 커뮤니티 목록이 아닌 홈으로 가서 당황한다 | 방문자 12.14% (3.15 기준) | 뒤로가기의 결과를 예상하지 못한 것 |
| 홈으로 튕긴 유저 중 57%가 바로 파란 버튼을 다시 눌러 목록으로 돌아갔다 | C→A 착지 후 56~57% 즉시 복구 | 홈을 보고 싶었던 게 아니라 어쩔 수 없이 다시 찾아간 것 |
| 불편한데 적응하고 있다 | 파란버튼 직접 탭 세션 비중 0.42% → 1.20% (+3배, 3.16) | 앱이 나빠진 걸 유저가 스스로 학습한 것 |
| 버전 업데이트가 이 문제를 해결하지 못했다 | 마찰 비율 3.88% → 3.86% (거의 동일) | 구조적 문제라 부분 개선으로는 안 풀림 |

~~~expand title="Path별 원시 데이터 (집계 기간: 2026-05-26 ~ 2026-06-28 / iOS 3.15·3.16 / 출처: DATA-8997)"

| 동선 (Path Tag) | 3.15 이벤트 | 3.15 유니크 방문자 비중 | 3.16 이벤트 | 3.16 유니크 방문자 비중 |
| -------- | -------- | -------- | -------- | -------- |
| C→A→B (back 후 홈 착지 → 파란버튼 재진입) | 369,092 | **12.14%** | 32,829 | 7.19% |
| C→A→다른 탭 이탈 | 91,107 | 4.78% | 7,382 | 2.14% |
| C→B→C 동일 커뮤 재진입 | 36,643 | 1.90% | 9,123 | 2.59% |
| C→B→C 다른 커뮤 탐색 | 56,624 | 1.99% | 6,576 | 1.55% |
| 우회:직접 비율 (C→A→B vs C→B→C) | **4.0 : 1** | — | **2.1 : 1** | — |
| back 후 B 미복귀 이탈 | **280,006건 (43%)** | — | — | — |

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

## 9. Flow Test with AI Persona {status:추가, 6/18|color:green}

### 9-1. 핵심 페인포인트

~~~panel type=info
이번 흐름 검증은 TOP 1 (가입 커뮤니티 재진입)에 집중
~~~

| **TOP** | **이슈** |
| -------- | -------- |
| **1** | **가입 커뮤니티 재진입 마찰**- "5분 동안 BTS 커뮤니티 찾느라 헤맸다"<br>- "팔로우 다시 해야 하나 싶었다"<br>- "원래는 첫 화면에 바로 떴는데 지금은 하늘색 버튼 누르고 BTS 커뮤니티 눌러야"<br>- 우회 동선 공유 현상 = 발견성 실패의 강한 신호 |
| **2** | **바텀 네비게이션 인지 실패**- 아이콘 즉시 인지 불가<br>- "새로운 위버스 어떻게 사용하는지 모르겠다"<br>- "불편하고 신경쓰이고 자리 차지한다" |
| **3** | **콘텐츠 강제 노출 거부감**- "BTS만 팔로우했는데 피드에 다른 사람들이 나오는 게 너무 싫다"<br>- 가입 커뮤 글 ↔ 일반 피드 혼재 거부 |
| **기타** | - 홈 피드 스크롤 위치 미보존 (글 보고 돌아오면 최상단)<br>- 라이브 진입로 불명확<br>- App Store/X 다수: 롤백 요구 |
<!-- adf:table attrs='{"width":760}' -->

### 9-2. 시나리오 설정

| **순서** | **시나리오** |
| -------- | -------- |
| **1** | Discover 출발 → 커뮤니티 검색 → Tomorrow x Together 선택 → 가입/팔로우 클릭 → 커뮤니티 피드 진입 |
| **2** | 커뮤니티 피드 → Discover로 이탈 → 다시 커뮤니티 재진입 |
<!-- adf:table attrs='{"width":760}' -->

### 9-3. 테스트 결과

~~~panel type=info
**Persona: 윤아 (TXT 팬덤 컨텍스트로 교체 주입)**순위: 테스트3 > 테스트2 > 테스트4 > 테스트1솔직히 말하면 테스트3이 제일 좋았어요.이유가 명확해요. "Community"라고 라벨이 바텀 네비에 딱 써있으니까 처음 보자마자 "여기 누르면 되겠다"가 바로 왔어요. 테스트1, 2, 4는 민트색 버튼인데 뭔지 몰라서 일단 눌러보는 거잖아요. 저처럼 앱 좀 쓸 줄 아는 사람도 헷갈렸는데, 위버스 처음 쓰는 사람이면 더 헤맸을 거예요.테스트2는 버튼이 검색바로 변신하는 인터랙션이 예뻤는데, 그게 "이게 커뮤니티 진입점이다"를 설명해주지는 않더라고요. 인터랙션이 재밌는 거랑 직관적인 건 다른 것 같아요.테스트4는 테스트2,3의 중간 느낌인데 애매해요. 바텀 네비에 포커스도 없고 라벨도 없으니까요.
~~~

| **버전** | **코멘트** |
| -------- | -------- |
| **Test0 (3.15.0)** | 예전엔 위버스 켜자마자 TXT 커뮤니티 바로 보였잖아요. 근데 업데이트 이후로 글로벌 홈인가 뭔가로 바뀌면서 제 커뮤니티가 어디 있는지를 모르겠는 거예요.처음엔 내가 팔로우 실수로 끊은 건가 싶었고, 이거 어떻게 들어가는지 몰라서 한참 헤맸어요. 나중에 더쿠에서 "하늘색 버튼 누르고 들어가면 된다"는 글 보고 겨우 찾은 거거든요. 근데 그게 왜 한눈에 안 보여야 해요? 매번 들어갈 때마다 그 동선 반복하는 게 너무 귀찮고...그리고 하단에 아이콘들 생겼잖아요. 근데 뭐가 뭔지 아이콘만 봐선 모르겠어요. 글자 라벨이라도 있으면 덜 헤맬텐데. |
| **Test1 (Modality)** | 1. 근데 Discover 화면 잠깐 스치고 지나가는 거... 약간 어색했어요. 모달 닫히자마자 바로 TXT 피드로 push됐으면 더 자연스러웠을 것 같아요. 중간에 Discover 끼어드는 게 "어? 뒤로 나간 건가?" 싶어서 한 박자 당황했거든요.<br>2. 뒤로가기 누르면 Discover로 나가는 건 자연스러운데... 다시 TXT 커뮤니티 들어오려면 또 그 민트색 버튼 → 검색 모달 → TXT 누르는 동선 반복해야 하는 건가요? 이미 가입한 커뮤니티인데 재진입할 때마다 검색 모달 거쳐야 하면 번거롭잖아요. |
| **Test2 (Button appearance - Search)** | 1. 근데 하단 검색바 위치가 더 자연스럽게 느껴져요. 손이 아래 있으니까 타이핑하기도 편할 것 같고.<br>2. 홈 갔다가 민트색 버튼 다시 누르면 TXT 피드가 바로 유지되는 거예요? 그럼 "나의 커뮤니티 어디 갔지?" 하고 다시 찾을 필요가 없는 거잖아요. 이거 진짜 편하다. 아까 테스트1에서 제일 불편했던 게 커뮤니티 재진입할 때마다 처음부터 찾아야 했던 거였는데, 이건 그 문제가 해결된 느낌이에요. |
| **Test3 (Standard Tab)** | 1. Community 탭이 바텀 네비에 라벨이랑 같이 딱 있으니까 처음 봐도 "여기 누르면 되겠다" 바로 알 수 있고, 들어갔다 나왔다 해도 세션 유지되니까 재진입 스트레스가 없어요. 테스트1에서 제일 헤맸던 "이 버튼이 커뮤니티인지 몰랐던 것"이 완전히 해결된 케이스네요. |
| **Test4 (Button appearance - Tab)** | 1. 테스트2랑 비교하면 — 테스트2는 바텀 네비가 홈 아이콘 하나로 축소되면서 민트 버튼이 검색바로 확장되는 인터랙션이 있었는데, 테스트4는 바텀 네비가 그대로 있고 민트 버튼이 별도 탭처럼 동작하는 거네요.  <br>  그럼 민트 버튼이 "커뮤니티 탭"인데 바텀 네비의 Home/Shop/DM/More랑 같은 레벨인데 라벨 없이 따로 떠있는 형태인 거죠?  <br>  테스트3에서 Community가 바텀 네비 안에 라벨이랑 들어가있던 것과 비교하면, 이건 여전히 "이게 커뮤니티 탭이다"라는 게 한눈에 안 들어오는 느낌이에요. 기능은 같은데 발견성은 테스트3이 더 낫다고 느껴져요.<br>2. 바텀 네비가 콘텐츠 위에 겹쳐서 플로팅으로 떠있는 거구나! 그래서 아티스트 목록 마지막 줄이 바텀 네비에 가려져 보이는 거네요.  <br>  이거 좀 불편할 것 같아요. 스크롤 내리다가 "가입" 버튼이 바텀 네비 뒤에 숨어있으면 못 누를 수도 있겠다 싶어서요. |
<!-- adf:table attrs='{"width":760}' -->