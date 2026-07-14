# Spec — Showcase

> 사내 위키 내용을 아래에 그대로 붙여넣기. 이 파일은 원문 보존 목적이므로 수정하지 않음.

---

<!-- 위키 내용 paste 시작 -->
<!-- adf:unknown type="layoutSection" -->
<!-- adf:unknown type="layoutSection" -->
{
  "type": "layoutSection",
  "marks": [
    {
      "type": "breakout",
      "attrs": {
        "mode": "wide",
        "width": 1800
      }
    }
  ],
  "content": [
    {
      "type": "layoutColumn",
      "attrs": {
        "width": 50
      },
      "content": [
        {
          "type": "panel",
          "attrs": {
            "panelColor": "#F4F5F7",
            "panelType": "custom"
          },
          "content": [
            {
              "type": "paragraph",
              "content": [
                {
                  "text": "목차",
                  "type": "text",
                  "marks": [
                    {
                      "type": "strong"
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "type": "extension",
          "attrs": {
            "layout": "default",
            "extensionType": "com.atlassian.confluence.macro.core",
            "extensionKey": "toc",
            "parameters": {
              "macroParams": {
                "style": {
                  "value": "none"
                }
              },
              "macroMetadata": {
                "macroId": {
                  "value": "d55d5ec1-3c2c-414e-81a1-e21b45b25f03"
                },
                "schemaVersion": {
                  "value": "1"
                },
                "title": "목차"
              }
            }
          }
        }
      ]
    },
    {
      "type": "layoutColumn",
      "attrs": {
        "width": 50
      },
      "content": [
        {
          "type": "panel",
          "attrs": {
            "panelColor": "#F4F5F7",
            "panelType": "custom"
          },
          "content": [
            {
              "type": "paragraph",
              "content": [
                {
                  "text": "Project General",
                  "type": "text",
                  "marks": [
                    {
                      "type": "strong"
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "type": "table",
          "attrs": {
            "layout": "center",
            "width": 1800
          },
          "content": [
            {
              "type": "tableRow",
              "content": [
                {
                  "type": "tableCell",
                  "content": [
                    {
                      "type": "paragraph",
                      "content": [
                        {
                          "text": "PIC",
                          "type": "text",
                          "marks": [
                            {
                              "type": "strong"
                            }
                          ]
                        }
                      ]
                    }
                  ]
                },
                {
                  "type": "tableCell",
                  "content": [
                    {
                      "type": "paragraph",
                      "content": [
                        {
                          "type": "mention",
                          "attrs": {
                            "id": "712020:7c7be662-6306-4e50-a700-499355f1de49",
                            "text": "@안성건/Seonggeon Ahn (WEV_광고전략팀)"
                          }
                        },
                        {
                          "text": " ",
                          "type": "text"
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              "type": "tableRow",
              "content": [
                {
                  "type": "tableCell",
                  "content": [
                    {
                      "type": "paragraph",
                      "content": [
                        {
                          "text": "Planning Status",
                          "type": "text",
                          "marks": [
                            {
                              "type": "strong"
                            }
                          ]
                        }
                      ]
                    }
                  ]
                },
                {
                  "type": "tableCell",
                  "content": [
                    {
                      "type": "paragraph",
                      "content": [
                        {
                          "type": "status",
                          "attrs": {
                            "color": "blue",
                            "style": "bold",
                            "text": "Done"
                          }
                        },
                        {
                          "text": " ",
                          "type": "text"
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              "type": "tableRow",
              "content": [
                {
                  "type": "tableCell",
                  "content": [
                    {
                      "type": "paragraph",
                      "content": [
                        {
                          "text": "Update History",
                          "type": "text",
                          "marks": [
                            {
                              "type": "strong"
                            }
                          ]
                        }
                      ]
                    }
                  ]
                },
                {
                  "type": "tableCell",
                  "content": [
                    {
                      "type": "paragraph",
                      "content": [
                        {
                          "type": "text",
                          "text": "June 9, 2026"
                        },
                        {
                          "text": " 초안 작성",
                          "type": "text"
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
<!-- /adf:unknown -->

~~~panel type=custom attrs='{"panelColor":"#B3D4FF"}'
## 0. 신규 탭 개설 타당성 평가 (기간 한정탭 기준)
~~~

- 위버스 쇼케이스 탭은 광고 캠페인 계약 기간에만 한시적으로 노출되는 **기간 한정탭**으로 분류
- [https://bighitcorp.atlassian.net/wiki/spaces/WRP/pages/5804360752/-#2-1-2.-%EC%8B%A0%EA%B7%9C-%ED%83%AD-%EA%B0%9C%EC%84%A4-%ED%83%80%EB%8B%B9%EC%84%B1-%ED%8F%89%EA%B0%80-%EA%B0%80%EC%9D%B4%EB%93%9C---%EA%B8%B0%EA%B0%84-%ED%95%9C%EC%A0%95%ED%83%AD-%EA%B0%9C%EB%B0%9C-%EA%B2%80%ED%86%A0%2F%EB%8C%80%EC%9D%91-%ED%95%84%EC%9A%94](https://bighitcorp.atlassian.net/wiki/spaces/WRP/pages/5804360752/-#2-1-2.-%EC%8B%A0%EA%B7%9C-%ED%83%AD-%EA%B0%9C%EC%84%A4-%ED%83%80%EB%8B%B9%EC%84%B1-%ED%8F%89%EA%B0%80-%EA%B0%80%EC%9D%B4%EB%93%9C---%EA%B8%B0%EA%B0%84-%ED%95%9C%EC%A0%95%ED%83%AD-%EA%B0%9C%EB%B0%9C-%EA%B2%80%ED%86%A0%2F%EB%8C%80%EC%9D%91-%ED%95%84%EC%9A%94) 

~~~expand title="기간 한정탭은 아직 구현되어있지 않은 스펙으로, 추가 희망 시 개발 검토/대응이 선행되어야 합니다."
- 기간 한정 탭은 특정 이벤트나 캠페인의 목적을 달성하기 위해 단기적으로 노출되는 탭입니다.  
  신규 탭 추가를 요청하는 담당 부서는 아래 항목에 대해 **자가 진단 점수 및 상위 기획서, 타당성 근거 자료**를 함께 제출하며, **<mark style="background-color: #dfd8fd">Step 1 모두 충족</mark><!-- adf:backgroundColor attrs='{"color":"#dfd8fd"}' -->**<mark style="background-color: #dfd8fd"> </mark><!-- adf:backgroundColor attrs='{"color":"#dfd8fd"}' -->**<mark style="background-color: #dfd8fd">& Step 2에서</mark><!-- adf:backgroundColor attrs='{"color":"#dfd8fd"}' -->**<mark style="background-color: #dfd8fd"> </mark><!-- adf:backgroundColor attrs='{"color":"#dfd8fd"}' -->**<mark style="background-color: #dfd8fd">총점 80점 이상</mark><!-- adf:backgroundColor attrs='{"color":"#dfd8fd"}' -->**일 경우에만 추가를 확정합니다.
- 상시 탭과는 다르게, 아래와 같이 각 탭 담당자의 직접 대응이 필요합니다.

  - **자동 비노출 설정**: 사전에 정의된 종료 시점에 시스템적으로 자동 비노출 처리가 되어야 합니다.
  - **랜딩 페이지 리다이렉트**: 탭 운영 기간 종료 후, 해당 경로(URL/Deep Link)로 진입한 유저를 관련 공지나 커뮤니티 홈 등으로 대체 연결하는 대응이 필요합니다.
  - **핵심 지표 공유**: 기간 한정 탭은 운영 종료 후 1주일 이내에 Clog 및 위버스 인사이트 지표를 공유해야 합니다. (다음 결정에 반영)

| **<span style="color: #97a0af"><sub>Step 1. 3가지 조건 모두 충족 필요 (충족, 미충족으로 구분)</sub><!-- adf:subsup attrs='{"type":"sub"}' --></span>** | **<span style="color: #97a0af"><sub>Step 2. '유저 보편성'보다는 '집중도와 파급력'에 무게를 두고 평가</sub><!-- adf:subsup attrs='{"type":"sub"}' --></span>** | **<span style="color: #ffffff"><sub>Decide</sub><!-- adf:subsup attrs='{"type":"sub"}' --></span>** |
| **시의성**  <br><sub>컴백, 공연, 주년 기념 등 특정 시점에 반드시 노출되어야 하는 강력한 명분이 있는가?</sub><!-- adf:subsup attrs='{"type":"sub"}' --> | **독립적 가치**  <br><sub>기존 'Discover'나 'My Feed' 내 게시물 하나로 대체할 수 없는 대규모 캠페인 혹은 전용 기능을 포함하는가?</sub><!-- adf:subsup attrs='{"type":"sub"}' --> | **기간 확정성**  <br><sub>시작일과 종료일이 기획 단계에서 확정되어 있는가?</sub><!-- adf:subsup attrs='{"type":"sub"}' --> | **캠페인 중요도 (40점)**  <br><sub>전사 핵심 아티스트의 주요 이벤트(컴백 등)인가?</sub><!-- adf:subsup attrs='{"type":"sub"}' --> | **트래픽 집중도 (30점)**  <br><sub>단기간 내 폭발적인 유입(예: 동접자 수)이 예상되는가?</sub><!-- adf:subsup attrs='{"type":"sub"}' --> | **전용 기능 제공 (20점)**  <br><sub>해당 기간에만 제공되는 특수 UI나 기능이 있는가?</sub><!-- adf:subsup attrs='{"type":"sub"}' --> | **종료 프로세스 (10점)**  <br><sub>종료 후 유입 경로 전환 계획이 수립되었는가?</sub><!-- adf:subsup attrs='{"type":"sub"}' --> | **Total Score**  <br><sub>80점 이상 - Pass</sub><!-- adf:subsup attrs='{"type":"sub"}' -->  <br><sub>80점 미만 - Reject</sub><!-- adf:subsup attrs='{"type":"sub"}' --> |
|   |   |   |   |   |   |     |   |
<!-- adf:table attrs='{"layout":"align-start","width":1800}' -->
~~~

### Step 1. 필수 충족 조건 (3가지 모두 충족 필요)

| **평가 항목** | **자가 진단 결과** | **자가 진단 상세** |
| -------- | -------- | -------- |
| **시의성**  <br><sup>컴백, 공연, 주년 기념 등 특정 시점에 반드시 노출되어야 하는 강력한 명분이 있는가?</sup><!-- adf:subsup attrs='{"type":"sup"}' --> | **<span style="color: #4c9aff">충족</span>** | - 광고는 본질적으로 **계약 기반의 기간 한정 서비스**로, 광고주는 특정 노출 기간에 대한 비용을 사전 지불하고 플랫폼은 해당 기간 내 노출 의무를 이행하는 계약 구조<br>- 위버스 쇼케이스는 1일 단위 예약형 상품으로, **계약된 날짜 외 노출은 불가하며 대체 일정 이동도 불가**. 해당 기간에 반드시 노출되어야 하는 강제성이 광고 계약 자체에 내재<br>- 특히 위버스는 브랜딩 목적 광고 수요가 높은 매체로, 브랜딩 캠페인은 신제품 출시·브랜드 론칭·시즌 캠페인 등 **특정 시점에 인지도를 집중 확보해야 하는 목적에서 집행**<br>- 탭 노출 기간이 광고 계약 기간(1일~N일)으로 명확히 확정되기에 기간 한정탭으로 분류 적합 |
| **독립적 가치**<sup>기존 'Discover'나 'My Feed' 내 게시물 하나로 대체할 수 없는 대규모 캠페인 혹은 전용 기능을 포함하는가?</sup><!-- adf:subsup attrs='{"type":"sup"}' --> | **<span style="color: #4c9aff">충족</span>** | - 기존 Discover/My Feed는 다양한 콘텐츠 및 피드 내 광고가 네이티브 형태로 노출되는 구조로, 광고 전용 공간은 미제공<br>- 위버스 쇼케이스는 광고주명이 탭에 직접 노출되며, 탭 진입 시 **광고주 전용 전면 영상 자동재생**되는 독립된 브랜드 전용 공간<br>- 탭 단위 브랜드 전용 채널 구조를 통해 단순 게시물·배너로는 불가능한 **'브랜드 테이크오버'** 수준 경험 제공<br><br>  - 네이버 쇼케이스·LINE 퍼스트뷰·유튜브 마스트헤드 등 유사 상품 모두 피드 배너와 명확히 구별되는 전용 전면 구좌 운영 중으로, 이는 프리미엄 단가의 핵심 요소 |
| **기간 확정성**  <br><sub>시작일과 종료일이 기획 단계에서 확정되어 있는가?</sub><!-- adf:subsup attrs='{"type":"sub"}' --> | **<span style="color: #4c9aff">충족</span>** | - 광고 계약 시 **캠페인 시작일·종료일이 사전에 확정**되며,** **일반 서비스가 아닌 광고 특성상 기획 단계에서 모든 광고 운영 스케줄을 확정할 수는 없지만 통상적으로 광고 운영 전 1개월 전 캠페인 확정<br>- GAM 스케줄링을 통해 캠페인 계약 종료 시점에 광고주 탭 자동 비노출 처리 예정 (광고 상품 특성상 계약 이행의 전제 조건) |
<!-- adf:table attrs='{"layout":"align-start","width":1800}' -->

### Step 2. 집중도와 파급력 기준 평가 (총점 100점, 80점 이상 Pass)

| **평가 항목** | **배점** | **자가 진단 점수** | **자가 진단 상세** |
| -------- | -------- | -------- | -------- |
| **캠페인 중요도**  <br><sub>전사 핵심 아티스트의 주요 이벤트(컴백 등)인가?</sub><!-- adf:subsup attrs='{"type":"sub"}' --> | 40점 | **<span style="color: #4c9aff">35점</span>** | - 위버스 쇼케이스: 광고 수익 고도화라는 **전사 핵심 KPI와 직접 연결**되는 신규 상품<br>- 현재 위버스 광고 포트폴리오는 일반 DA 배너 중심, 프리미엄 전면 광고 구좌 부재<br>- 글로벌 팬덤 플랫폼이라는 특수 매체 포지셔닝 보유에도, 헤드라인 광고 상품 부재로 광고주 대형 예산 유치 미흡<br>- 네이버 쇼케이스(CPM ₩41,700)·LINE 퍼스트뷰·유튜브 마스트헤드 등 주요 매체는 해당 포지션에서 이미 안정적 수익 확보 중<br>- 프리미엄 전면 광고 구좌 보유 시 뷰티·패션·게임·엔터테인먼트 등 팬덤 타깃 광고주의 **최우선 선택지로** 포지셔닝 가능 → 위버스의 '광고 미디어 신뢰도' 확보에 전략적 기여<br>- 셀스루 30% 기준 한국 연 ₩8.8억 / 일본 연 ¥1.0억 신규 매출 창출 기대 (CPM 한국 ₩13,500, 일본 ¥1,250 기준) |
| **트래픽 집중도**  <br><sub>단기간 내 폭발적인 유입(예: 동접자 수)이 예상되는가?</sub><!-- adf:subsup attrs='{"type":"sub"}' --> | 30점 | **<span style="color: #4c9aff">25점</span>** | - 글로벌홈 탭 진입 시 해당일 홈 방문 유저 **전원에게 광고주명 탭 노출** (SOV 100%<sup>*Share Of Voice</sup><!-- adf:subsup attrs='{"type":"sup"}' -->). 유저의 의도적 탭 선택으로 전면 영상 경험하는 구조이나, **탭 노출 자체는 홈 진입 유저 전원에게 발생**<br>- 현재 데이터 기준 일 평균 노출량 한국 ~59만 / 일본 ~75만으로, 일자별 단독 점유 구조 (복수 광고주 동시 경쟁 없음)<br>- 기간 한정 희소성 기반 진입 유도. 단, 광고 전용 페이지 특성상 유저 자발적 진입률(CTR)은 광고주의 인지도 및 브랜딩에 의존할 가능성 있음 |
| **전용 기능 제공**  <br><sub>해당 기간에만 제공되는 특수 UI나 기능이 있는가?</sub><!-- adf:subsup attrs='{"type":"sub"}' --> | 20점 | **<span style="color: #4c9aff">15점</span>** | - 기존 글로벌홈 탭 내 네이티브 광고 형태가 아닌 프리미엄 전면 광고 구좌로서 **새로운 UI 타입과 사용자 경험** 제공<br>- My Feed·Discover·Party 등 글로벌홈 내에 광고주명이 탭으로 노출되어 브랜드 인지 효과를 발생시키는 독립 노출 포맷<br>- 쇼케이스 탭 진입과 동시에 광고 영상 전면(Full-screen) 자동재생(기본 Mute)되어, 기존 피드, 띠배너, 팝업 배너 구좌와는 다른 인터랙션 지원 |
| **종료 프로세스**  <br><sub>종료 후 유입 경로 전환 계획이 수립되었는가?</sub><!-- adf:subsup attrs='{"type":"sub"}' --> | 10점 | **<span style="color: #4c9aff">10점</span>** | - GAM 플랫폼 내에서 광고 스케줄링을 통해 광고 계약 종료 시점에 탭 자동 비노출 처리 예정으로, **자동 비노출 설정 기술적 충족**<br>- 쇼케이스 탭 특성상 공간 내에서 지속성을 가진 서비스를 제공하는 것이 아닌 광고 운영 기간 한정으로 광고주의 전면 영상 광고 및 CTA 버튼으로 구성되기에 캠페인 종료 후 별도 **랜딩 페이지 리다이렉트 대응 불필요** |
| **합계** | **100점** | **<span style="color: #4c9aff">85점</span>** |  |
<!-- adf:table attrs='{"layout":"align-start","width":1800}' -->

~~~panel type=custom attrs='{"panelColor":"#B3D4FF"}'
## 1. 기획 배경 및 목적
~~~

**1.1  프리미엄 광고 구좌의 필요성**

위버스는 브랜딩 목적 광고 수요가 높은 매체임에도 불구하고, 현재 광고 구좌는 브랜딩 캠페인의 실질적 요건을 충족하지 못하는 구조적 한계 보유

- 위버스 주요 광고주는 **뷰티·엔터·패션·식음료·게임 등 브랜드 인지도 및 이미지 제고가 핵심 목적**인 카테고리로 구성 **→ IP·모델 중심의 비주얼 소재를 대형 공간에 임팩트 있게 노출하는 방식이 캠페인 효과의 핵심**
- 현재 위버스 내 광고 구좌는 **대부분 소형 사이즈** **→ 브랜드 소재의 핵심 요소(모델 전신, 제품, 캠페인 메시지 등)를 온전히 전달하기 어려운 구조**  


  ```adf-media
  {"msAttrs":{"layout":"center","width":1446,"widthType":"pixel"},"mediaAttrs":{"width":2488,"alt":"image-20260625-003735.png","id":"fdfee43d-9e77-4e78-aadf-ab411fb2fa26","collection":"contentId-5857641109","type":"file","height":619}}
  ```
- 현재 위버스 내 대형 사이즈로 분류할 수 있는 구좌는 홈팝업이 유일 **→ 브랜딩 캠페인에서 필수 포맷으로 자리잡은 영상 소재 운영 불가**  
  (스플래시 광고의 경우 v3.14.0에서 대형 사이즈로 개선 작업 진행했고 영상 송출도 가능하나 지면 특성상 매우 짧은 시간만 노출)  


**1.2. 세로형 영상 구좌의 부재**

- 최근 광고 시장의 영상 소재 제작 트렌드는 **세로형 중심으로 전환**

  - 틱톡·인스타그램 릴스·유튜브 쇼츠 등 주요 플랫폼의 영상 포맷이 세로형으로 표준화되면서, 광고주 세로형 소재 제작 비중이 가로형을 상회
  - 실제 위버스에서 틱톡과 유사한 유저 특성을 보유한 점을 근거로, 틱톡에 집행 중인 세로형 소재를 위버스에도 동일하게 집행하려는 광고주 문의가 많았으나, 현재 집행 가능한 구좌 부재로 수주 불가 사례 빈번
  - 이미 세로형으로 제작 완료된 소재를 가로형으로 재편집하는 추가 비용·일정은 현실적으로 광고주가 수용하기 어려운 구조
- 현재 위버스 영상 광고 구좌는 미디어 및 라이브 영상 시작 전 노출하는 프리롤 논스킵(인스트림 가로형, 15초) 광고 구좌만 운영 중  


**1.3. 왜 글로벌홈 탭인가**

위 두 가지 구조적 수요(대형 구좌 + 세로형 영상)를 동시에 충족하는 포맷으로서, 글로벌홈 탭 기반의 쇼케이스 구조가 최적

- 탭 전용 화면 = 9:16 전면 공간을 활용, 세로형 영상 소재를 별도 리사이징 없이 원본 그대로 집행 가능
- 탭 단위 SOV 100%로, 경쟁 광고 혼재 없이 특정 시간 동안 단일 브랜드가 전체 화면을 독점 점유 가능
- 기존 대형 구좌(홈팝업·스플래시) 대비 개선점:

  - 홈팝업: 영상 집행 불가
  - 스플래시: 영상·대형 영역 가능하나 랜딩(CTA) 불가, 지면 특성상 매우 짧은 시간동안 노출 가능 → 브랜딩 이후 전환 행동 유도 차단
  - **쇼케이스: 대형 전면 영상 + CTA 랜딩 가능 → 효과적으로 ‘브랜딩 메시지를 전달’하고 ‘고객 행동 유도까지 연결’ 가능한 구조**  


**1.4. 유사 서비스의 검증 사례 및 수익성 근거**

위버스와 유사한 특성(팬덤·브랜딩 매체·세로형 영상 포맷)을 가진 서비스에서 이미 동일 구조의 상품이 검증됨

- 아래 사례들은 모두 대형·전면·단독 노출 구조를 기반으로 프리미엄 단가를 형성 → 구좌 크기와 SOV 독점이 단가 결정의 핵심 요소임을 시장이 이미 검증
- 위버스 쇼케이스는 상기 서비스 대비 팬덤 고관여 유저 집중도라는 추가 차별 요소 보유 → 브랜드 메시지의 맥락 적합도 측면에서 프리미엄 단가 근거 확보 가능

| **서비스** | **광고 상품명** | **상품 구조** | **단가** | **참고 화면** |
| -------- | -------- | -------- | -------- | -------- |
| **무신사** | 브랜드 판 (Sponsored) | - 메인 탭 3번째 위치<br>- 3일 고정 노출<br>- 9:16 세로형 영상<br>- 평균 노출수 약 200만회 | 3일 7,000만원  <br>→ 프로모션가 5,000만원   <br>(약 일 1,600만원) | ```adf-media<br>{"msAttrs":{"layout":"center","width":115,"widthType":"pixel"},"mediaAttrs":{"width":590,"alt":"IMG_0343-20260624-123538.PNG","id":"63871232-ee9a-4664-8f19-a4bed86856e5","collection":"contentId-5857641109","type":"file","height":1278}}<br>``` |
| **네이버** | 쇼케이스 | - 네이버 모바일 메인 주제판 4번째 위치<br>- 하나의 브랜드가 24시간 동안 독점 노출 (주당 2개 광고주만 집행 가능)<br>- 9:16 세로형 영상<br>- 평균 노출수 일 약 120만회 | 일 5,000만원 | ```adf-media<br>{"msAttrs":{"layout":"center","width":117,"widthType":"pixel"},"mediaAttrs":{"width":590,"alt":"IMG_0333-20260624-113708.PNG","id":"627af7d1-7c1e-43ac-908e-183c479420e7","collection":"contentId-5857641109","type":"file","height":1278}}<br>``` |
| **에이블리** | 프리미엄 브랜딩 전면 배너 | - 메인 페이지 상단 탭 (2~3번째) 노출되는 전면형 광고 상품<br>- 1일 독점 노출<br>- 평균 노출수 일 약 200~250만회<br>- 9:16 세로형 영상 (최대 60초) | 일 1,500만원  <br>→ 프로모션가 1,000만원 | ```adf-media<br>{"msAttrs":{"layout":"center","width":125,"widthType":"pixel"},"mediaAttrs":{"width":849,"alt":"image-20260624-135600.png","id":"d6303435-a386-4163-aa25-74cfce2cbb79","collection":"contentId-5857641109","type":"file","height":1721}}<br>``` |
| **카카오** | 프로필풀뷰 | - 카카오톡의 첫 화면, 친구탭에 노출되는 전면형 광고 상품 ('업데이트 프로필' 영역의 4번째 프로필)<br>- CPT(Cost Per Time) 구매 방식으로 24시간 동안 노출 및 도달을 극대화<br>- 평균 노출수 일 약 250만회<br>- 9:16 세로형 영상 (30초 ~ 90초) | 일 3,500만원 | ```adf-media<br>{"msAttrs":{"layout":"center","width":173,"widthType":"pixel"},"mediaAttrs":{"width":935,"alt":"image-20260624-135706.png","id":"8c5fb9fc-8aa9-4255-b9c6-cb41ef649931","collection":"contentId-5857641109","type":"file","height":888}}<br>``` |
<!-- adf:table attrs='{"layout":"center","width":1204}' -->

~~~panel type=custom attrs='{"panelColor":"#B3D4FF"}'
## 2. 기대 효과 및 의의
~~~

- **광고사업 측면**

  - 위버스 대표 프리미엄 광고 상품 확보: 네이버 쇼케이스·유튜브 마스트헤드 수준의 헤드라인 상품 포지셔닝 가능
  - 셀스루 30% 기준 한국 연 ₩8.8억, 일본 연 ¥1.0억 매출 창출 (CPM 한국 ₩13,500, 일본 ¥1,250 기준)
  - 뷰티·패션·게임·엔터테인먼트 카테고리 대형 신규 광고주 유치 가능성 확대
- **사용자 경험 측면**

  - 1일 1사 단독 노출로 광고 과부하 없이 깔끔한 브랜드 경험 제공
  - 팬덤 맥락에 맞는 광고주만 진입하여 유저 거부감 최소화
  - 유저의 명시적 탭 선택(opt-in) 구조로 강제 광고 노출 부담 감소
- **매체 가치 측면**

  - 프리미엄 광고 구좌 보유 = 위버스의 광고 매체 신뢰도 및 단가 경쟁력 강화
  - 글로벌 확장(미국·중국) 시 해당 구좌를 통한 추가 매출 구조 마련

~~~panel type=custom attrs='{"panelColor":"#B3D4FF"}'
## 3. 상품 개요
~~~

| **항목** | **내용** |
| -------- | -------- |
| 상품명(가칭) | Weverse Showcase (위버스 쇼케이스) |
| 상품 유형 | 직광고 / 예약형 / 보장형 DA (프리미엄 테이크오버) |
| 노출 위치 | 글로벌홈 탭 영역 (기간 한정 탭) |
| 판매 단위 | 1일 1사 단독 점유 (홈탭 SOV 100%) |
| 광고 소재 | 동영상 Only (9:16 세로형) |
| 노출 형태 | 광고주명 탭 노출, 탭 진입 시 전면 영상 자동재생 (Mute) + CTA 버튼 |
| 광고 목적 | 브랜드 인지 및 캠페인 임팩트 |
| 대상 국가 | 한국, 일본 (1차) / 미국, 중국 (추후 검토) |
<!-- adf:table attrs='{"layout":"align-start","width":760}' -->

~~~panel type=custom attrs='{"panelColor":"#B3D4FF"}'
## 4. 구좌 동작 방식
~~~

**4.1 유저 시나리오**

<!-- adf:unknown type="layoutSection" -->
{
  "type": "layoutSection",
  "marks": [
    {
      "type": "breakout",
      "attrs": {
        "mode": "wide",
        "width": 1800
      }
    }
  ],
  "content": [
    {
      "type": "layoutColumn",
      "attrs": {
        "width": 63.65
      },
      "content": [
        {
          "type": "codeBlock",
          "attrs": {
            "language": "adf-media"
          },
          "content": [
            {
              "type": "text",
              "text": "{\"msAttrs\":{\"layout\":\"center\",\"width\":1121,\"widthType\":\"pixel\"},\"mediaAttrs\":{\"width\":1675,\"alt\":\"image-20260624-120036.png\",\"id\":\"6e2953c5-21d5-476c-876b-c40ec1b1e9f5\",\"collection\":\"contentId-5857641109\",\"type\":\"file\",\"height\":1028}}"
            }
          ]
        }
      ]
    },
    {
      "type": "layoutColumn",
      "attrs": {
        "width": 36.35
      },
      "content": [
        {
          "type": "orderedList",
          "attrs": {
            "order": 1
          },
          "content": [
            {
              "type": "listItem",
              "content": [
                {
                  "type": "paragraph",
                  "content": [
                    {
                      "text": "글로벌홈 진입 시 탭 영역에 쇼케이스 탭(광고주명+AD마크) 노출",
                      "type": "text",
                      "marks": [
                        {
                          "type": "strong"
                        }
                      ]
                    }
                  ]
                },
                {
                  "type": "bulletList",
                  "content": [
                    {
                      "type": "listItem",
                      "content": [
                        {
                          "type": "paragraph",
                          "content": [
                            {
                              "text": "해당일 글로벌홈 진입 유저 중 국가 기반 타겟팅에 의해 노출 국가에 해당하는 유저 전원에게 노출, 1일 1사 단독 점유",
                              "type": "text"
                            }
                          ]
                        },
                        {
                          "type": "bulletList",
                          "content": [
                            {
                              "type": "listItem",
                              "content": [
                                {
                                  "type": "paragraph",
                                  "content": [
                                    {
                                      "text": "타겟팅 대상 국가가 아닌 유저의 경우 해당 쇼케이스 탭 미노출",
                                      "type": "text"
                                    }
                                  ]
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    },
                    {
                      "type": "listItem",
                      "content": [
                        {
                          "type": "paragraph",
                          "content": [
                            {
                              "text": "탭 위치 관련해서는 서비스기획팀 및 유관 부서와 논의 필요. ",
                              "type": "text"
                            },
                            {
                              "type": "hardBreak"
                            },
                            {
                              "text": "다만 프리미엄 지면 특성인 홈탭 SOV 100% 요건 충족 및 주목도를 높이기 위해 글로벌홈 진입 시 스크롤 없이 즉시 노출될 수 있는 위치 배정 희망 ",
                              "type": "text"
                            },
                            {
                              "type": "hardBreak"
                            },
                            {
                              "text": "(e.g. My Feed / Discover / Party / ",
                              "type": "text"
                            },
                            {
                              "text": "쇼케이스탭",
                              "type": "text",
                              "marks": [
                                {
                                  "type": "code"
                                }
                              ]
                            },
                            {
                              "text": " / Spot / …)",
                              "type": "text"
                            }
                          ]
                        },
                        {
                          "type": "bulletList",
                          "content": [
                            {
                              "type": "listItem",
                              "content": [
                                {
                                  "type": "paragraph",
                                  "content": [
                                    {
                                      "text": "[참고] 유사 상품 서비스들의 구좌 위치",
                                      "type": "text"
                                    }
                                  ]
                                },
                                {
                                  "type": "bulletList",
                                  "content": [
                                    {
                                      "type": "listItem",
                                      "content": [
                                        {
                                          "type": "paragraph",
                                          "content": [
                                            {
                                              "text": "네이버 : 탭 네번째 위치 (스크롤 없는 첫 페이지)",
                                              "type": "text"
                                            }
                                          ]
                                        }
                                      ]
                                    },
                                    {
                                      "type": "listItem",
                                      "content": [
                                        {
                                          "type": "paragraph",
                                          "content": [
                                            {
                                              "text": "무신사 : 탭 세번째 위치 (스크롤 없는 첫 페이지)",
                                              "type": "text"
                                            }
                                          ]
                                        }
                                      ]
                                    },
                                    {
                                      "type": "listItem",
                                      "content": [
                                        {
                                          "type": "paragraph",
                                          "content": [
                                            {
                                              "text": "에이블리 : 탭 2~3번째 위치 (스크롤 없는 첫 페이지)",
                                              "type": "text"
                                            }
                                          ]
                                        }
                                      ]
                                    },
                                    {
                                      "type": "listItem",
                                      "content": [
                                        {
                                          "type": "paragraph",
                                          "content": [
                                            {
                                              "text": "카카오 : '업데이트 프로필' 영역의 4번째 프로필에 노출 (스크롤 없는 첫 페이지)",
                                              "type": "text"
                                            }
                                          ]
                                        }
                                      ]
                                    }
                                  ]
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    },
                    {
                      "type": "listItem",
                      "content": [
                        {
                          "type": "paragraph",
                          "content": [
                            {
                              "text": "광고주명은 기존 탭 명칭 정책(영문, 10자 이내) 준수 범위 내 정의",
                              "type": "text"
                            }
                          ]
                        },
                        {
                          "type": "bulletList",
                          "content": [
                            {
                              "type": "listItem",
                              "content": [
                                {
                                  "type": "paragraph",
                                  "content": [
                                    {
                                      "text": "일반 텍스트가 아닌 광고로 브랜딩 로고 이미지 형태로 구현 가능 여부, 영문 외 한글 사용 가능 여부 논의 필요. 이미지 형태 진행 시 영문 10자 이내 길이로 제한 예정",
                                      "type": "text"
                                    }
                                  ]
                                }
                              ]
                            },
                            {
                              "type": "listItem",
                              "content": [
                                {
                                  "type": "paragraph",
                                  "content": [
                                    {
                                      "text": "쇼케이스 탭 노출 시 주목도 향상을 위한 추가 이펙트 적용 검토 필요 (구현 가능성 및 공수 고려 필요, 필수 사항 아님)",
                                      "type": "text"
                                    }
                                  ]
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              "type": "listItem",
              "content": [
                {
                  "type": "paragraph",
                  "content": [
                    {
                      "text": "쇼케이스 탭 터치 시 탭 전용 화면 진입",
                      "type": "text",
                      "marks": [
                        {
                          "type": "strong"
                        }
                      ]
                    }
                  ]
                },
                {
                  "type": "bulletList",
                  "content": [
                    {
                      "type": "listItem",
                      "content": [
                        {
                          "type": "paragraph",
                          "content": [
                            {
                              "text": "광고주명 탭 터치 시 탭 전용 화면으로 진입, 진입과 동시에 광고 영상 전면 자동 재생 (기본 Mute 상태로 재생되며, 아이콘 탭 시 음소거 해제)",
                              "type": "text"
                            }
                          ]
                        }
                      ]
                    },
                    {
                      "type": "listItem",
                      "content": [
                        {
                          "type": "paragraph",
                          "content": [
                            {
                              "text": "영상 하단에 광고주 지정 문구를 CTA 버튼 함께 노출",
                              "type": "text"
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              "type": "listItem",
              "content": [
                {
                  "type": "paragraph",
                  "content": [
                    {
                      "text": "CTA 버튼 클릭 및 랜딩",
                      "type": "text",
                      "marks": [
                        {
                          "type": "strong"
                        }
                      ]
                    }
                  ]
                },
                {
                  "type": "bulletList",
                  "content": [
                    {
                      "type": "listItem",
                      "content": [
                        {
                          "type": "paragraph",
                          "content": [
                            {
                              "text": "CTA 버튼 클릭 시 광고주 설정 URL로 랜딩",
                              "type": "text"
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "type": "paragraph",
          "content": [
            {
              "text": "* 직광고 미운영 국가의 유저 또는 광고 노출이 OFF 된 상태의 경우 쇼케이스 탭 미노출",
              "type": "text",
              "marks": [
                {
                  "type": "strong"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
<!-- /adf:unknown -->

**4.2 구현 방안**

- 일반적인 GAM 광고 구좌는 정해진 광고 영역에 소재를 렌더링하는 구조지만, 쇼케이스의 경우 1차 노출(글로벌홈 내 탭 로고 노출)과 2차 노출(쇼케이스 탭 내 전면 영상 노출)이 분리되어 있는 구조
- 아래 2가지 방식으로 구현이 가능하나 가장 최적의 안은 2가지의 장점을 결합한 하이브리드 방식

| **방식** | **구조** | **1차 노출 처리 (글로벌 홈 내 쇼케이스 탭 노출)** | **2차 노출 처리 (쇼케이스 탭 내 광고 영상 노출)** | **장점** | **단점** |
| -------- | -------- | -------- | -------- | -------- | -------- |
| **위버스 서버 기반** | 위버스 서버가 활성 캠페인 정보를 앱에 내려줌 | 1. 사전에 내부 어드민 내 광고 캠페인 셋팅  <br>  (광고 일정, 타겟팅 국가, 로고 이미지 URL등)<br>2. 앱 실행 / 글로벌홈 진입<br>3. 위버스 서버에 현재 활성 쇼케이스 광고 정보 요청<br>4. 서버가 광고주 정보(브랜드명, 로고 URL, 탭 노출 여부) 응답<br>5. 앱이 탭 영역에 광고주 로고 렌더링 | 1. 유저가 쇼케이스 탭 클릭<br>2. 앱이 GAM에 광고 요청 (Ad Unit ID + 쇼케이스 식별 커스텀 타겟팅 키-값)<br>3. GAM이 해당 광고주의 영상 소재 응답<br>4. 앱이 전면 영상 광고 렌더링 및 재생<br>5. impression 기록 (recordImpression 또는 onAdImpression 콜백)<br>6. 영상 재생 완료 또는 유저 종료 시 광고 종료 처리 | - GAM 응답 속도와 무관하게 탭 로고를 빠르게 노출 가능 | - 위버스 서버에 캠페인 관리 로직 추가 필요 (개발 공수가 들 수 있으나 광고실 내부 개발 리소스 활용 가능)<br>- 쇼케이스 탭 진입 시 GAM에 광고 요청이 이뤄지기에 광고 영상 즉시 노출 불가 |
| **GAM(Google Ad Manager) 기반** | 앱 진입 시 GAM에 광고 요청해서 로고 에셋을 받아 탭에 표시 | 1. 앱 실행 / 글로벌홈 진입<br>2. 위버스 서버에서 쇼케이스용 Ad Unit ID 수신<br>3. 클라이언트가 GAM에 광고 요청<br>4. GAM 응답 수신 (로고 이미지 URL + 영상 에셋 등 전체 에셋)<br>5. 로고 이미지 → 탭에 즉시 렌더링  <br>  전면 영상 에셋 → 메모리에 보관 (프리로드 상태) | 1. 유저가 쇼케이스 탭 클릭<br>2. 메모리에 보관해둔 전면 영상 에셋을 불러와 즉시 랜더링 및 재생<br>3. impression 기록 (recordImpression 또는 onAdImpression 콜백)<br>4. 영상 재생 완료 또는 유저 종료 시 광고 종료 처리 | - GAM에서 캠페인 관리 일원화<br>- 쇼케이스 탭 진입 클릭 시 영상이 즉시 재생되어 로딩 대기 없는 UX 제공 가능 | - GAM 응답 전까지 글로벌 홈 내 로고 노출 불가, 응답 레이턴시로 인해 밀림현상(레이아웃 시프트)이 발생할 수 있음 (로딩 상태 처리 정책이 필요)<br>- 유저가 탭을 클릭하지 않아도 영상 에셋을 미리 로드해서 불필요한 데이터 사용 발생<br>- 메모리에 영상 에셋을 보관하는 시간이 길어질경우 쇼케이스 탭 진입 시 재요청 필요 |
| **하이브리드 방식** | 1차 노출 처리를 위버스 서버 기반으로 진행하여 글로벌 홈 내 탭을 빠르게 노출, 이어서 GAM에 광고를 요청해서 전면 영상 에셋을 응답받아 메모리에 보관 후 쇼케이스 탭 내 진입 시 즉시 영상 노출 |
<!-- adf:table attrs='{"layout":"center","isNumberColumnEnabled":true,"width":1800}' -->

~~~panel type=custom attrs='{"panelColor":"#B3D4FF"}'
## 5. 광고 소재 스펙
~~~

- 광고 소재 주요 에셋 및 스펙은 가안으로, 상세 기획 진행 시 최종 확정 예정

| **주요 에셋** | **규격** | **비고** |
| -------- | -------- | -------- |
| 탭 명칭 | 영문, 10자 이내 | 기존 탭 명칭 정책 준수 |
| 동영상 | MP4 / H.264, 1080×1920 (9:16) | 6~15초 권장, 최대 30초 |
| 용량 | ≤ 30MB | 자동재생 최적화 |
| 음성 | 탭 진입 시 기본 Mute | 유저가 볼륨 조절 가능 |
| CTA 텍스트 타이틀 | 15자 이내 | - |
| CTA 텍스트 서브타이틀 | 20자 이내 | - |
| 랜딩 URL | 외부 링크 또는 앱 내 딥링크 | 최종 이동 경로 |
| 광고주 로고 | 선택 | 브랜드 표기용 |
<!-- adf:table attrs='{"layout":"align-start","width":760}' -->

~~~panel type=custom attrs='{"panelColor":"#B3D4FF"}'
## 6. 과금 및 판매 방식
~~~

### 6.1 과금 모델

| **과금 모델** | **과금 방식** | **용도** |
| -------- | -------- | -------- |
| ① 일 정액 예약형 (메인) | 하루 단독 점유 = 고정가 / 노출 보장 | 테이크오버 헤드라인 상품 |
| ② 보장형 CPM (보조) | 1,000회 노출당 과금 / 노출 보장 | 상시 판매 · 중견 광고주용 |
<!-- adf:table attrs='{"layout":"align-start","width":864}' -->

### 6.2 예상 매출 시뮬레이션

단가는 **업계 벤치마크 예상 CPM × 위버스 실제 노출량** 기반으로 산출

| 구분 | 일 평균 노출 | 업계 벤치마크 예상 CPM | 일 단가 (테이크오버) |
| -------- | -------- | -------- | -------- |
| 한국 | ~50만 | ₩15,000~20,000 | ₩10,000,000 |
| 일본 | ~75만 | ¥1,500 ~ 2,000 | ¥1,500,000 |
<!-- adf:table attrs='{"layout":"align-start","width":873}' -->

- [참고] 직광고 운영 구좌 중 대형 구좌 일 단가

  - 스플래시 CPD 300만원
  - 홈팝업 CPD 500만원

    - 일 35만 노출 (프리퀀시 프리퀀시 5회 적용 기준)

### **6.3 셀스루별 연매출 시나리오**

| 셀스루 | 연 판매일수 | 한국 연매출  
(CPM ₩20,000 기준) | 일본 연매출  
(CPM ¥2,000 기준) |
| -------- | -------- | -------- | -------- |
| 10% | 약 37일 | 약 ₩3.7억 | 약 ¥5,500만 |
| 30% | 약 110일 | 약 ₩11억 | 약 ¥1.6억 |
| 50% | 약 183일 | 약 ₩18억 | 약 ¥2.7억 |
<!-- adf:table attrs='{"layout":"align-start","width":877}' -->

### 6.4 시장 유사 사례 비교

| 상품 | 매체 | 노출 방식 | 공시단가 (일부 추정) | 일 평균 노출 |
| -------- | -------- | -------- | -------- | -------- |
| **Weverse Showcase (제안)** | **위버스** | **홈탭 SOV 100%, 전면 영상** | **₩1천만원** | **~50만 (KR)** |
| **¥1,500,000** | **~75만 (JP)** |
| 네이버 쇼케이스 | 네이버 | 포털 전면 보장형, 1일 1사 | CPD 5천만원 | 1일 약 120-180만 |
| LINE 퍼스트뷰 | LINE | 1일 1사 전면 영상 | 1Day ALL (1일 1사 독점): 2,500~4,000만 엔 | 1일 도달 UU ~6,500만(Imp X) |
| 유튜브 마스트헤드 | YouTube | 홈 최상단 1일 1사 | 2020년 CPD- 1일 1억 4,200만원**현행 CPM 단가(한국 2,800원/타겟 가산)와 CPH(시간당 3,000만원대)** | 국가별 1광고주 독점, 24시간 고정 |
| 카카오 프로필 풀뷰 | 카카오 | CPT 24시간, 풀스크린 | ₩3,500만 (CPT) | ~250만 |
| 무신사 브랜드판 | 무신사 | 스플래시 + 브랜드판 패키지 | ₩7,000만 (패키지) | ~200만 |
<!-- adf:table attrs='{"layout":"align-start","width":883}' -->

~~~panel type=custom attrs='{"panelColor":"#B3D4FF"}'
## 7. 광고주 심사 및 운영 정책
~~~

### 7.1 광고주 심사 정책

- 카테고리 사전 심사: 브랜드 세이프티 및 팬덤 정서 충돌 방지 (경쟁 IP, 부적절 카테고리 차단)
- 선예약 우선 원칙 / 취소 마감일 및 위약 상세 기준 추후 정의 예정 (개발·정책 단계에서 확정)
- 소재 검수: 노출 N영업일 전 입고 및 검수 SLA 운영
- 대상 국가: 한국/일본 분리 판매 및 단가 차등 (IP 기준 국가 타깃팅 적용)

### 7.2 운영 정책

- 직광고 판매 건이 있을 경우에만 쇼케이스 탭 노출 (미판매일은 탭 영역 비노출)
- 캠페인 종료 시점에 GAM 스케줄링 기반으로 탭 자동 비노출 처리
- 1일 1사 SOV 100% 보장, 동일일 복수 광고주 노출 불가

~~~panel type=custom attrs='{"panelColor":"#B3D4FF"}'
## 8. 핵심 측정 지표 (KPI)
~~~

- 탭 노출수 (Tab Impressions)
- 탭 진입률 (Tab CTR = 탭 클릭 / 탭 노출)
- 동영상 완료율 (Video Completion Rate: 25 / 50 / 75 / 100%)
- 최종 CTR (CTA 클릭 / 탭 노출)
- 실효 CPM (eCPM)
- 셀스루 (연중 판매율)
- 재판매율 (광고주 리텐션)

~~~panel type=custom attrs='{"panelColor":"#B3D4FF"}'
## 9. 일정
~~~

- **목표 : v3.19.0 배포 / 9월말 또는 10월초 릴리즈 예정**

  - 6월~7월초 : 상세 기획서 작성 및 리뷰
  - 7월 : 디자인 시안 및 가이드 작성, 디자인 기준으로 기획서 업데이트, 서버 개발
  - 8월 : 서버 개발, 클라이언트 개발
  - 9월 (중간에 추석 연휴) : QA

<!-- 위키 내용 paste 끝 -->
