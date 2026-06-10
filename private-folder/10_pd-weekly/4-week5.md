| **주요 업무(4/23~4/29)** | **업무 성격** | **시작/완료** | **투입율** | **진행율** | **서비스 오픈** |
| -------- | -------- | -------- | -------- | -------- | -------- |
| **Click TF **{status:진행중|color:blue} - cds component.md test<br><br>  - 컴포넌트 포멧 테스트 - Stitch식 설명(1~8) + Implementation Contract(9) 이중 구조<br>  - 검증 하네스 구축 - 95점 이상 pass<br>  - avatar / badge / button / checkbox 4종 추출, 하네스 100/100 pass<br>  - usage figma 병행 참조 추가<br>- cds pattern.md test<br><br>  - 화면 MD 구조 탐색 - 단일 파일 인라인 vs 섹션 분리 방식 비교<br>  - 컴포넌트 참조 방식 - 화면에서 사용한 값(type, size, label)만 인라인, 규격은 component.md 참조<br>- cds component dev test (구현 검증)<br><br>  - MD 스펙만으로 React 컴포넌트 개발 가능성 검증<br>- 검증 파이프라인 테스트<br><br>  - pixel diff 파이프라인 - playwright 캡쳐 + Python PIL 히트맵으로 테스트 | {status:SUSTAINING} | 4/23~ | <span style="color: #ff5630">3.0</span> | 10% | - |
| **CDS **{status:진행중|color:blue} - 2026 CDS 과제 선정<br>- 컴포넌트 명세서 추가/삭제/수정<br><br>  - Avatar<br>  - Badge<br>  - Radio<br>  - Checkbox<br>- CDS 컴포넌트 운영 대응<br><br>  - Merch 컴포넌트 {status:수정|color:yellow} <br>  - Tooltip 컴포넌트 {status:신규|color:green} <br>- CDS 사용성 개선<br><br>  - 디자이너 인터뷰 기획서 작성<br>  - 인터뷰 항목 작성 | {status:SUSTAINING} | 4/24~4/29 | <span style="color: #ff5630">2.0</span> | - | - |
<!-- adf:table attrs='{"width":760}' -->

**차주 예정 업무**

- TF - Component.md 파일 제작
- CDS 컴포넌트 개발 대응

---

# **Click TF**

투입율 <span style="color: #bf2600">3.0</span> | 진행율 <span style="color: #ff5630">10%</span> | 디자인: 김선영C 님, 전지영님, 이정주 | 개발: 임경택 님, 김영민 님, 김유석 님, 한지훈 님

- 디자인 위키 or Figma :  [https://www.figma.com/deck/237R2Xz39e9Dr9KjdJPIlI](https://www.figma.com/deck/237R2Xz39e9Dr9KjdJPIlI)
- 기획 위키 :  
- Jira :  
- 목적

  - AI 에이전트가 이해하기 쉬운 디자인 시스템 문서화 구조 연구 및 워크플로우 효율화
- 진행상황
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
~~~

---

# **CDS**

투입율 <span style="color: #bf2600">2.0</span> | 진행율 <span style="color: #ff5630">10%</span> | 디자인: 이정주, 이현중 님, 전지영 님 | 개발: 임리나 님, 박새영 님

- 디자인 위키 or Figma :  [https://www.figma.com/design/DWEduE6GfxYMlyxKPNJ8jA/Chord-Design-System?node-id=37171-15217&t=aTTR6DStbSLbemyb-11](https://www.figma.com/design/DWEduE6GfxYMlyxKPNJ8jA/Chord-Design-System?node-id=37171-15217&t=aTTR6DStbSLbemyb-11) 
- 기획 위키 :  
- Jira :  [https://bighitcorp.atlassian.net/browse/WV2Q-52251](https://bighitcorp.atlassian.net/browse/WV2Q-52251) 
- 목적

  - 디자인 요소로 사용될 컴포넌트 관리, 개발 대응
- 진행상황

  - [2026 CDS 과제 선정](https://docs.google.com/spreadsheets/d/144jyhGQ7WyBSYiwFncqiDHPkUN6TMWQh-MAibVPkuHM/edit?gid=1496733194#gid=1496733194) 
  - 컴포넌트 명세서 추가/삭제/수정

    - Avatar
    - Badge
    - Radio
    - Checkbox
  - CDS 컴포넌트 운영 대응

    - Merch 컴포넌트 {status:수정|color:yellow} 
    - Tooltip 컴포넌트 {status:신규|color:green} 
  - CDS 사용성 개선

    - 디자이너 인터뷰 기획서 작성
    - 인터뷰 항목 작성