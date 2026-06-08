| **주요 업무(5/28~6/3)** | **업무 성격** | **시작/완료** | **투입율** | **진행율** | **서비스 오픈** |
| -------- | -------- | -------- | -------- | -------- | -------- |
| **CDS **{status:진행중|color:blue} - CDS 사용성 개선<br><br>  - 인터뷰 진행 (HoD)<br>  - 사용자 인터뷰 분석<br>  - 보고서 작성<br>  - 보고서 리뷰와 액션 아이템 선정 | {status:SUSTAINING} | 5/21~ | <span style="color: #ff5630">2.5</span> | - | - |
| **Click TF **{status:완료|color:green} - Splint 1 회고<br>- 내부 결과 공유 | {status:SUSTAINING} | 5/28~6/2 | <span style="color: #ff5630">0.5</span> | 90% | - |
| **일본인 퍼소나 **{status:완료|color:green} - 검증방법 추가하여 결과 공유 | {status:SUSTAINING} | 5/28 | <span style="color: #ff5630">0.5</span> | 100% |  |
| **연차 및 휴일**- 오후 반차 (5/29)<br>- 지방선거 (6/3) |  | 5/25 | <span style="color: #ff5630">1.5</span> | - | - |
<!-- adf:table attrs='{"width":760}' -->

**차주 예정 업무**

- CDS 액션아이템 기준으로 논의 진행
- Splint 2 준비

---

# **Click TF**

투입율 <span style="color: #bf2600">0.5</span> | 진행율 <span style="color: #ff5630">90%</span> | 디자인: 김선영C 님, 전지영님, 이정주 | 개발: 임경택 님, 김영민 님, 김유석 님, 한지훈 님

- 디자인 위키 or Figma : [https://www.figma.com/deck/237R2Xz39e9Dr9KjdJPIlI](https://www.figma.com/deck/237R2Xz39e9Dr9KjdJPIlI)
- 기획 위키 : 
- Jira :  
- 목적

  - AI 에이전트가 이해하기 쉬운 디자인 시스템 문서화 구조 연구 및 워크플로우 효율화
- 진행상황

  - Splint 1 회고
  - 내부 결과 공유

~~~expand title="히스토리"
- Figma MCP 및 Figma Console MCP를 활용한 디자인 시스템 문서화 방식 테스트
- AI 친화적 CDS 구조 설계 및 React 컴포넌트 제작 자동화 실험
- 작업 단계별 토큰 소모량 및 제작 소요 시간 측정 데이터 확보
- Figma 파일 > Markdown > Code 테스트
- MCP 연결 > 자연어 입력 > Design 테스트
- Markdown, Catalog.json, Figma MCP로 각각 Code Output 비교 테스트
- Click TF 전달용 문서 제작
- AI 워크플로우 덱 제작 및 공유
- CDS Token Catalog Schema 정의 및 정리
- Claude Code 활용 Color Scheme 설계
- Github/Git GUI 환경 구축 및 교육 이수
- cds component.md test

  - 컴포넌트 포멧 테스트 - Stitch식 설명(1~8) + Implementation Contract(9) 이중 구조
  - 검증 하네스 구축 - 95점 이상 pass
  - avatar / badge / button / checkbox 4종 추출, 하네스 100/100 pass
  - usage figma 병행 참조 추가
- cds pattern.md test

  - 화면 MD 구조 탐색 - 단일 파일 인라인 vs 섹션 분리 방식 비교
  - 컴포넌트 참조 방식 - 화면에서 사용한 값(type, size, label)만 인라인, 규격은 component.md 참조
- cds component dev test (구현 검증)

  - MD 스펙만으로 React 컴포넌트 개발 가능성 검증
- 검증 파이프라인 테스트

  - pixel diff 파이프라인 - playwright 캡쳐 + Python PIL 히트맵으로 테스트
- 피그마 파일 SoT화

  - 피그마 컴포넌트 별 do/don't 정리
  - 피그마 컴포넌트 디스크립션에 yaml 정보 입력(do/don't 포함) 자동화
  - 컴포넌트 URL과 컴포넌트 디스크립션 만으로 React 컴포넌트 구현 테스트 (35개 중 29개 테스트 진행)
- 컴포넌트 MD 하네스 구축

  - 피그마파일(figma, Usage)을 PDF로 export
  - Markitdown으로 MD파일 변환
  - 생성된 MD파일 조합 및 정리
  - 정리된 md파일을 yaml파일과 대조 및 수정
  - 검증된 md파일을 사람 눈으로 한번 더 검증
  - DESIGN.md 파일 수정
  - Splint 1 결과 슬라이드 제작
~~~

---

# **CDS**

투입율 <span style="color: #bf2600">2.5</span> | 진행율 <span style="color: #ff5630">-</span> | 디자인: 이정주, 이현중 님, 전지영 님 | 개발: 임리나 님, 박새영 님, 부현웅 님, 한지훈 님

- 디자인 위키 or Figma :  [https://www.figma.com/design/DWEduE6GfxYMlyxKPNJ8jA/Chord-Design-System?node-id=37171-15217&t=aTTR6DStbSLbemyb-11](https://www.figma.com/design/DWEduE6GfxYMlyxKPNJ8jA/Chord-Design-System?node-id=37171-15217&t=aTTR6DStbSLbemyb-11)[https://bighitcorp.atlassian.net/wiki/x/XYEyXAE](https://bighitcorp.atlassian.net/wiki/x/XYEyXAE) 
- 기획 위키 :  
- Jira :  
- 목적

  - 디자인 요소로 사용될 컴포넌트 관리, 개발 대응
- 진행상황

  - CDS 사용성 개선

    - 인터뷰 진행 (HoD)
    - 사용자 인터뷰 분석
    - 보고서 작성
    - 보고서 리뷰와 액션 아이템 선정

---

# **일본인 퍼소나**

투입율 <span style="color: #bf2600">0.5</span> | 진행율 <span style="color: #ff5630">100%</span> | 디자인: 이정주 님 | 개발: 

- 디자인 위키 or Figma :  [https://jjleeeeee.github.io/presentations/ai-persona/deck/](https://jjleeeeee.github.io/presentations/ai-persona/deck/) 
- 기획 위키 :  
- Jira :  
- 목적

  - 프로젝트 내에서 유저가 어떻게 반응할지 보다 쉽게 살펴보기 위한 AI Persona 제작
- 진행상황

  - 20s/40s 일본인 퍼소나 구축
  - 퍼소나 검증방법에 대한 대략적인 플로우 추가