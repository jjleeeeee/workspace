| **주요 업무(4/2~4/8)** | **시작/완료** | **투입율** | **진행율** | **서비스 오픈** |
| -------- | -------- | -------- | -------- | -------- |
| **현장수령 - 픽업 앱 보안 강화 운영 **{status:가이드 전달 완료|color:green} - 샵어드민 - 픽업관리 내 비밀번호 영역 추가<br>- 수정/삭제 케이스일때 영역 노출 방식 테스트<br>- 기획/개발 공유 완료 | 4/2~4/6 | <span style="color: #bf2600">1.0</span> | 100% | 6월 1일 |
| **현장수령 - 타임 슬롯별 미수령 취소 UI **{status:진행중|color:blue}- 주문서 하단에 픽업 운영 시간 외 상품 수령 불가 및 자동 취소 안내 메시지 위치 테스트 | 4/8~ | <span style="color: #bf2600">1.0</span> | 50% | 6월 1일 |
| **글로벌홈 맥락형 커머스 머치 슬롯 **{status:가이드 전달 완료|color:green}- 가이드 제작 및 전달 | 3/20~4/2 | <span style="color: #bf2600">0.4</span> | 100% | 3.15.0 |
| **커뮤니티 샵 탭 네이티브 **{status:가이드 전달 완료|color:green}- 가이드 제작 및 전달 | 4/2 | <span style="color: #bf2600">0.4</span> | 100% | 3.15.0 |
| **CDS** - **AI Friendly Documentation **{status:진행중|color:blue} - Figma 파일 > Markdown > Code 테스트<br>- MCP 연결 > 자연어 입력 > Design 테스트<br>- Markdown, Catalog.json, Figma MCP로 각각 Code Output 비교 테스트 | 03/30~ | <span style="color: #bf2600">2.2</span> | 20% | - |
<!-- adf:table attrs='{"width":760}' -->

**차주 예정 업무**

- 현장수령 - 타임 슬롯별 미수령 취소 UI 가이드 제작 및 전달
- AI Friendly CDS 문서화 방식 고도화
- 디자인-Code 정합성 테스트

---

# **현장수령 - 픽업 앱 보안 강화 운영**

투입율 <span style="color: #bf2600">1.0</span> | 진행율 <span style="color: #ff5630">100%</span> | 기획: 김혜주 님 | 개발: -

- 디자인 위키 or Figma :  [https://www.figma.com/design/XSmjC1yZ5lx5WXhXysFZfU/%EC%83%B5-%EC%96%B4%EB%93%9C%EB%AF%BC_%ED%98%84%EC%9E%A5%EC%88%98%EB%A0%B9-%EA%B4%80%EB%A6%AC?node-id=1701-25382&t=2HJ5qAxZlOKr6E2r-1](https://www.figma.com/design/XSmjC1yZ5lx5WXhXysFZfU/%EC%83%B5-%EC%96%B4%EB%93%9C%EB%AF%BC_%ED%98%84%EC%9E%A5%EC%88%98%EB%A0%B9-%EA%B4%80%EB%A6%AC?node-id=1701-25382&t=2HJ5qAxZlOKr6E2r-1)
- 기획 위키 :  [https://bighitcorp.atlassian.net/wiki/spaces/W/pages/5279875073](https://bighitcorp.atlassian.net/wiki/spaces/W/pages/5279875073)
- Jira :  [https://bighitcorp.atlassian.net/browse/WPD-1162](https://bighitcorp.atlassian.net/browse/WPD-1162)
- 목적

  - 등록된 기기에서만 pickup App 로그인이 가능하도록 기능 구현
- 진행상황

  - Phase0에서는 비밀번호 입력란만 제공
  - Phase1에서 자산 등록 페이지 신설 예정
  - 시안 제작 완료 및 기획 공유
  - 샵어드민 - 픽업관리 내 비밀번호 영역 추가
  - 수정/삭제 케이스일때 영역 노출 방식 테스트
  - 기획/개발 공유 완료

---

# **현장수령 - 타임 슬롯별 미수령 취소 UI**

투입율 <span style="color: #bf2600">1.0</span> | 진행율 <span style="color: #ff5630">50%</span> | 기획: 김혜주 님 | 개발: -

- 디자인 위키 or Figma :  [https://www.figma.com/design/tr6RdSHZyFe7x7PpcPDukP/%EC%83%B5_%EC%A3%BC%EB%AC%B8%EC%84%9C?node-id=9982-48063&t=F2dPucDhwjronMNf-1](https://www.figma.com/design/tr6RdSHZyFe7x7PpcPDukP/%EC%83%B5_%EC%A3%BC%EB%AC%B8%EC%84%9C?node-id=9982-48063&t=F2dPucDhwjronMNf-1)
- 기획 위키 :  [https://bighitcorp.atlassian.net/wiki/spaces/W/pages/5694987470](https://bighitcorp.atlassian.net/wiki/spaces/W/pages/5694987470)
- Jira :  [https://bighitcorp.atlassian.net/browse/WPD-1161](https://bighitcorp.atlassian.net/browse/WPD-1161)
- 목적

  - 수령을 진행하고 있는 당일 상황에 실시간으로 재고를 확보하여 최대한 많은 판매를 모색하고자 함
- 진행상황

  - 주문서, 주문내역 내 안내 문구 추가
  - 픽업 어드민 내에 타임슬롯별 일괄 취소 테이블 추가
  - 시안 제작 및 기획 공유 완료
  - 법무 검토 후 추가 UI(주문서 내 안내) 추가
  - 주문서 하단에 픽업 운영 시간 외 상품 수령 불가 및 자동 취소 안내 메시지 위치 테스트

---

# **글로벌홈 맥락형 커머스 머치 슬롯**

투입율 <span style="color: #bf2600">0.4</span> | 진행율 <span style="color: #ff5630">100%</span> | 기획: 남지영님, 남수지님, 조주은님, 안연수님 | 개발: -

- 디자인 위키 or Figma :  [리스트형](https://www.figma.com/design/PNCopTVjqi100eHucCW9bI/%EA%B8%80%EB%A1%9C%EB%B2%8C-%ED%99%88?m=auto&node-id=13261-63086&t=EjQP05QqDzD6qusM-1), [피드형](https://www.figma.com/design/PNCopTVjqi100eHucCW9bI/%EA%B8%80%EB%A1%9C%EB%B2%8C-%ED%99%88?node-id=13542-24074&t=EjQP05QqDzD6qusM-1)
- 기획 위키 :  [https://bighitcorp.atlassian.net/wiki/spaces/W/pages/5682692277](https://bighitcorp.atlassian.net/wiki/spaces/W/pages/5682692277) 
- Jira :  [https://bighitcorp.atlassian.net/browse/WPD-1170](https://bighitcorp.atlassian.net/browse/WPD-1170) 
- 목적

  - 글로벌 홈 내 사용자 상황에 최적화된 상품 추천 및 노출을 위한 전용 슬롯 UI 설계
- 진행상황

  - 리스트형 및 피드형 등 다양한 정보 밀도의 슬롯 디자인 시안 제작
  - 글로벌 홈 전체 레이아웃과의 정합성 및 확장성을 고려한 디자인 검토
  - 기획팀 피드백(디자인 의도 상충 건)에 대한 수정 보완 및 협의 완료
  - 개발 가이드 최종본 제작
  - 가이드 제작 및 공유완료

---

# **커뮤니티 샵 임베드**

투입율 <span style="color: #bf2600">0.4</span> | 진행율 <span style="color: #ff5630">100%</span> | 기획: 남지영 님 | 개발: -

- 디자인 위키 or Figma :  [https://www.figma.com/design/4MdixGBNEl9AA79iZUQaRR/%EC%BB%A4%EB%AE%A4%EB%8B%88%ED%8B%B0_%EC%83%B5%ED%83%AD?node-id=3-25794&t=CwkkjrwnhDO41DKy-1](https://www.figma.com/design/4MdixGBNEl9AA79iZUQaRR/%EC%BB%A4%EB%AE%A4%EB%8B%88%ED%8B%B0_%EC%83%B5%ED%83%AD?node-id=3-25794&t=CwkkjrwnhDO41DKy-1) 
- 기획 위키 :  [https://bighitcorp.atlassian.net/wiki/x/OAAIUAE](https://bighitcorp.atlassian.net/wiki/x/OAAIUAE) 
- Jira :  [https://bighitcorp.atlassian.net/browse/WWSP-1606](https://bighitcorp.atlassian.net/browse/WWSP-1606) 
- 목적

  - 커뮤니티 탭 내 샵 영역 자연스러운 노출을 위한 디자인 적용
- 진행상황

  - 추천 영역은 글로벌 홈 맥락형 커머스 슬롯(리스트형) 적용
  - 커뮤니티 샵 임베드 영역 시안 제작 및 기획 공유 완료
  - 가이드 제작 및 공유완료

---

# **AI Friendly CDS 및 Figma MCP 연구**

투입율 <span style="color: #bf2600">2.2</span> | 진행율 <span style="color: #ff5630">20%</span> | 기획: 팀R&D | 개발: -

- 디자인 위키 or Figma :  
- 기획 위키 :  
- Jira :  
- 목적

  - AI 에이전트가 이해하기 쉬운 디자인 시스템 문서화 구조 연구 및 워크플로우 효율화
- 진행상황

  - Figma MCP 및 Figma Console MCP를 활용한 디자인 시스템 문서화 방식 테스트
  - AI 친화적 CDS 구조 설계 및 React 컴포넌트 제작 자동화 실험
  - 작업 단계별 토큰 소모량 및 제작 소요 시간 측정 데이터 확보
  - Figma 파일 > Markdown > Code 테스트
  - MCP 연결 > 자연어 입력 > Design 테스트
  - Markdown, Catalog.json, Figma MCP로 각각 Code Output 비교 테스트