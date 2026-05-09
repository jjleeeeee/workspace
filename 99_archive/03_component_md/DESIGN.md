---
name: Chord Design System

colors:
  primary: "#00CBD5"
  primary-hover: "#00B8C1"
  primary-inactive: "#77E8EE"
  secondary-blue: "#5989FE"
  secondary-green: "#00CC96"
  secondary-purple: "#B864FA"
  secondary-pink: "#F562C6"
  negative: "#FE5B58"
  surface-default: "#FFFFFF"
  surface-gray-50: "#F7F8FA"
  surface-gray-75: "#F2F3F7"
  surface-gray-100: "#E8E9EE"
  surface-black: "#000000"
  text-primary: "#00B8C1"
  text-default: "#0F1117"
  text-gray-700: "#4B4E5A"
  text-gray-500: "#7C8092"
  text-gray-300: "#AEB1B8"

colors-dark:
  primary: "#01D5DF"
  primary-hover: "#37DEE5"
  surface-default: "#000000"
  surface-gray-50: "#161616"
  surface-gray-75: "#1F1F1F"
  surface-gray-100: "#282828"
  text-default: "#F4F4F4"

typography:
  # fontSize는 iOS 기준값 (SoT: tokens.typography.v1.0.json / TYPO_tokens)
  # Web · AOS 구현 시 fontSize를 1px 감소 적용 (lineHeight 동일)
  font-family-web: "Pretendard"
  font-family-app: "System" # iOS: Apple SD Gothic(한글) + SF(영문), AOS: Roboto 계열 시스템 폰트
  text-15:
    fontSize: "9px"
    lineHeight: "12px"
    fontWeight: 400
    letterSpacing: "0"
  text-25:
    fontSize: "10px"
    lineHeight: "13px"
    fontWeight: 400
    letterSpacing: "0"
  text-50:
    fontSize: "12px"
    lineHeight: "16px"
    fontWeight: 400
    letterSpacing: "0"
  text-75:
    fontSize: "13px"
    lineHeight: "17px"
    fontWeight: 400
    letterSpacing: "0"
  text-100:
    fontSize: "14px"
    lineHeight: "18px"
    fontWeight: 400
    letterSpacing: "0"
  text-150:
    fontSize: "15px"
    lineHeight: "21px"
    fontWeight: 400
    letterSpacing: "0"
  text-200:
    fontSize: "16px"
    lineHeight: "22px"
    fontWeight: 400
    letterSpacing: "0"
  text-300:
    fontSize: "17px"
    lineHeight: "23px"
    fontWeight: 400
    letterSpacing: "-0.01em"
  text-400:
    fontSize: "19px"
    lineHeight: "25px"
    fontWeight: 400
    letterSpacing: "-0.01em"
  text-500:
    fontSize: "21px"
    lineHeight: "27px"
    fontWeight: 400
    letterSpacing: "-0.01em"
  text-600:
    fontSize: "25px"
    lineHeight: "33px"
    fontWeight: 400
    letterSpacing: "-0.02em"
  text-700:
    fontSize: "29px"
    lineHeight: "38px"
    fontWeight: 400
    letterSpacing: "-0.02em"
  text-800:
    fontSize: "33px"
    lineHeight: "43px"
    fontWeight: 400
    letterSpacing: "-0.02em"
  text-900:
    fontSize: "37px"
    lineHeight: "48px"
    fontWeight: 400
    letterSpacing: "-0.02em"
  text-1200:
    fontSize: "48px"
    lineHeight: "auto"
    fontWeight: 400
    letterSpacing: "-0.02em"

font-weight:
  regular: 400
  medium: 500
  semibold: 600
  bold: 700
  extrabold: 800

spacing:
  size-25: "2px"
  size-50: "4px"
  size-75: "6px"
  size-100: "8px"
  size-125: "10px"
  size-150: "12px"
  size-200: "16px"
  size-250: "20px"
  size-300: "24px"
  size-350: "28px"
  size-400: "32px"
  size-500: "40px"
  size-600: "48px"
  size-700: "56px"
  size-800: "64px"

rounded:
  box-75: "6px"
  box-100: "8px"
  box-150: "12px"
  box-200: "16px"
  box-250: "20px"
  box-300: "24px"
  full: "9999px"

screen-margin:
  none: "0px"
  sm: "10px"
  md: "16px"
  lg: "20px"
---

## Overview

Chord는 Weverse의 공식 디자인 시스템으로, iOS·AOS·WEB 세 플랫폼을 단일 토큰 체계로 통합합니다. 브랜드 아이덴티티 컬러는 민트(#00CBD5)이며, 활기차고 현대적인 감각을 유지하면서 콘텐츠 중심의 클린한 레이아웃을 지향합니다. 라이트/다크 모드를 모두 지원하며, 다크 모드에서는 순수 블랙(#000000)을 베이스로 합니다.

## Colors

### 브랜드 & 역할 색상
- **Primary (Mint):** `#00CBD5` — 주요 인터랙션 드라이버. CTA 버튼, 활성 상태, 강조 요소에만 사용
- **Primary Hover:** `#00B8C1` — Primary의 hover/pressed 상태
- **Primary Inactive:** `#77E8EE` — 비활성화된 Primary 요소
- **Secondary Blue:** `#5989FE` — 보조 인터랙션, 링크, 알림
- **Secondary Green:** `#00CC96` — 성공, 긍정 상태
- **Secondary Purple:** `#B864FA` — 특별 콘텐츠, 멤버십
- **Secondary Pink:** `#F562C6` — 특별 이벤트, 팬 콘텐츠
- **Negative (Red):** `#FE5B58` — 오류, 삭제, 경고

### Surface
- **Default:** `#FFFFFF` (light) / `#000000` (dark)
- **Gray-50:** `#F7F8FA` (light) / `#161616` (dark) — 보조 배경, 카드 배경
- **Gray-75:** `#F2F3F7` (light) / `#1F1F1F` (dark) — 비활성 상태 배경
- **Gray-100:** `#E8E9EE` (light) / `#282828` (dark) — 구분선 배경

### Text
- **Primary:** `#00B8C1` — 강조 텍스트, 브랜드 컬러 텍스트
- **Default:** `#0F1117` (light) / `#F4F4F4` (dark) — 본문 텍스트
- **Gray-700:** `#4B4E5A` — 보조 텍스트
- **Gray-500:** `#7C8092` — Placeholder, 힌트
- **Gray-300:** `#AEB1B8` — 비활성 텍스트

## Typography

플랫폼별 폰트 패밀리:
- **WEB:** Pretendard
- **APP:** 시스템 폰트 (iOS: Apple SD Gothic 한글 + SF 영문 / AOS: 시스템 기본)

타입 스케일 (iOS 기준값. Web·AOS 구현 시 fontSize -1px 적용):

| 토큰 | 크기(iOS) | 크기(Web) | 행간 | 주요 사용처 |
|------|----------|----------|------|------------|
| text-1200 | 48px | 48px | auto | 히어로 타이틀 |
| text-900 | 37px | 36px | 48px / 47px | 대형 헤딩 |
| text-800 | 33px | 32px | 43px / 42px | 섹션 타이틀 |
| text-700 | 29px | 28px | 38px / 37px | 페이지 타이틀 |
| text-600 | 25px | 24px | 33px / 32px | 카드 타이틀 |
| text-500 | 21px | 20px | 27px / 26px | 서브 타이틀 |
| text-400 | 19px | 18px | 25px / 24px | 강조 본문 |
| text-300 | 17px | 16px | 23px / 22px | 기본 본문 |
| text-200 | 16px | 15px | 22px / 21px | 보조 본문 |
| text-150 | 15px | 14px | 21px / 20px | 캡션 |
| text-100 | 14px | 13px | 18px / 17px | 보조 캡션 |
| text-75 | 13px | 12px | 17px / 16px | 레이블, 배지 |
| text-50 | 12px | 11px | 16px / 15px | 미세 텍스트 |

폰트 웨이트: regular(400), medium(500), semibold(600), bold(700), extrabold(800)

## Spacing

4px 기반 스케일:

| 토큰 | 값 |
|------|----|
| size-25 | 2px |
| size-50 | 4px |
| size-75 | 6px |
| size-100 | 8px |
| size-125 | 10px |
| size-150 | 12px |
| size-200 | 16px |
| size-250 | 20px |
| size-300 | 24px |
| size-350 | 28px |
| size-400 | 32px |
| size-500 | 40px |
| size-600 | 48px |

화면 여백: 0px / 10px / 16px(기본) / 20px

## Components

### Button
- 높이: xxlarge, xlarge, large, medium, small, xsmall, xxsmall 7단계
- Border-radius: `box-full (9999px)` — 완전 라운드 기본
- Primary: `#00CBD5` 배경, 흰색 텍스트
- Outlined: 1px border, transparent 배경
- Disabled: `surface-gray-75` 배경, `text-gray-300` 텍스트

### Card
- Border-radius: `box-150 (12px)` ~ `box-200 (16px)`
- Background: `surface-default` 또는 `surface-gray-50`
- Padding: `size-200 (16px)` ~ `size-250 (20px)`

### Input / Text Field
- Border-radius: `box-100 (8px)`
- Border: 1px `outline-default`
- Focus: Primary 컬러 아웃라인
- Error: `negative (#FE5B58)` 아웃라인

### Icon
- 크기: 12px / 16px / 20px / 24px / 32px / 40px / 48px / 56px / 64px / 72px

### Badge / Tag
- Border-radius: `box-75 (6px)` 또는 `box-full`
- 텍스트: `text-75 (12px)` ~ `text-100 (13px)`

## Layout Principles

- 기본 그리드: 4px 베이스 유닛
- 화면 좌우 여백(기본): 16px (`screen-margin/200`)
- 컴포넌트 내부 패딩: 8px~20px
- 섹션 간 간격: 24px~32px

## Depth & Elevation

- 기본 카드: shadow 없음 (flat design 지향)
- Modal/Bottom Sheet: `surface-default-800a` (rgba 배경 오버레이)
- Tooltip/Popover: 경량 그림자 사용

## Do's and Don'ts

**DO:**
- Primary Mint 색상은 인터랙션 요소(버튼, 탭, 링크)에만 사용
- 텍스트는 정의된 타입 스케일 토큰만 사용
- 4px 배수 값으로 간격 정의
- 다크 모드에서는 반드시 `-dark` 컬러 토큰 사용
- 접근성 대비율 WCAG AA(4.5:1) 이상 유지

**DON'T:**
- 팔레트에 없는 임의 색상 사용 금지
- Primary 컬러를 배경 전체에 사용 금지 (인터랙션 드라이버 전용)
- 픽셀 단위 임의 간격 값 사용 금지
- 플랫폼별 폰트 무시 금지 (WEB은 반드시 Pretendard)

## Agent Prompt Guide

이 DESIGN.md를 참조하는 AI 에이전트에게:

1. UI 컴포넌트 생성 전 반드시 이 파일의 토큰을 확인할 것
2. 색상은 반드시 정의된 토큰 이름 또는 hex 값 사용
3. WEB 환경 기본 폰트는 Pretendard
4. 스페이싱은 4px 배수(size-*) 토큰 기반으로 적용
5. 라이트/다크 모드 모두 고려하여 시맨틱 컬러 토큰 우선 사용
6. 컴포넌트 스타일은 정의된 border-radius 토큰(rounded.*) 사용
