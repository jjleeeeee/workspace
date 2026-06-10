| **주요 업무(5/14~5/20)** | **업무 성격** | **시작/완료** | **투입율** | **진행율** | **서비스 오픈** |
| -------- | -------- | -------- | -------- | -------- | -------- |
| **페르소나 검증 방법 **{status:진행중|color:blue} - 20s/40s 일본인 퍼소나 정리<br>- 평가 루브릭 정리<br>- 발표자료 준비 | {status:SUSTAINING} | 5/20~ | <span style="color: #ff5630">0.5</span> | 60% | - |
| **CDS **{status:진행중|color:blue} - CDS 사용성 개선<br><br>  - 인터뷰 진행 (류선영님, 주선영님)<br>- WEB 컴포넌트 개발 미팅 | {status:SUSTAINING} | 5/20~ | <span style="color: #ff5630">0.5</span> | - | - |
| **연차**- 건강상 이유로 연차 사용 |  | 5/14~5/19 | <span style="color: #ff5630">4.0</span> | - | - |
<!-- adf:table attrs='{"width":760}' -->

**차주 예정 업무**

- TF - 컴포넌트 자동화 스킬
- CDS 사용성 개선 인터뷰 (리드)

---

# **Click TF**

투입율 <span style="color: #bf2600">0.0</span> | 진행율 <span style="color: #ff5630">15%</span> | 디자인: 김선영C 님, 전지영님, 이정주 | 개발: 임경택 님, 김영민 님, 김유석 님, 한지훈 님

- 디자인 위키 or Figma :  [https://github.com/weversecorp/cds-catalogs/tree/main/design-markdown/02_component-md](https://github.com/weversecorp/cds-catalogs/tree/main/design-markdown/02_component-md) 
- 기획 위키 :  
- Jira :  
- 목적

  - AI 에이전트가 이해하기 쉬운 디자인 시스템 문서화 구조 연구 및 워크플로우 효율화
- 진행상황

  - 건강상 이슈로 진행 건 없음

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
~~~

---

# **페르소나 검증 방법**

투입율 <span style="color: #ff5630">0.5</span> | 진행율 <span style="color: #ff5630">60%</span> | 디자인: 이정주 | 개발: 

- 디자인 위키 or Figma :  [https://jjleeeeee.github.io/presentations/](https://jjleeeeee.github.io/presentations/) 
- 기획 위키 :  
- Jira :  
- 목적

  - 일본 팬덤 대응을 위한 20s/40s 퍼소나 제작 및 신뢰도 측정
- 진행상황

  - 20s/40s 퍼소나 제작 (나은님이 제작해주신 건)
  - 퍼소나 신뢰도 측정 방법 및 향후 계획 정리

---

# **CDS**

투입율 <span style="color: #bf2600">0.5</span> | 진행율 <span style="color: #ff5630">-</span> | 디자인: 이정주, 이현중 님, 전지영 님 | 개발: 임리나 님, 박새영 님, 부현웅 님, 한지훈 님

- 디자인 위키 or Figma :  [https://www.figma.com/design/DWEduE6GfxYMlyxKPNJ8jA/Chord-Design-System?node-id=37171-15217&t=aTTR6DStbSLbemyb-11](https://www.figma.com/design/DWEduE6GfxYMlyxKPNJ8jA/Chord-Design-System?node-id=37171-15217&t=aTTR6DStbSLbemyb-11) 
- 기획 위키 :  
- Jira :  
- 목적

  - 디자인 요소로 사용될 컴포넌트 관리, 개발 대응
- 진행상황

  - CDS 사용성 개선

    - 인터뷰 진행 (류선영님, 주선영님)
  - WEB 컴포넌트 개발 미팅