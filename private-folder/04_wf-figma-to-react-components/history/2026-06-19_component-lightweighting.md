# 2026-06-19 컴포넌트 경량화

## 결정

Chord DS React 라이브러리에서 14개 컴포넌트를 삭제하고 22개 코어 셋만 유지.

## 삭제 컴포넌트 (14개)

CircularProgressIndicator, LinearProgressIndicator, Divider, DropdownBox, ListItemNative, ListItemWeb, Menu, Scrollbar, SelectNumberBox, Stepper, Tag, TextFields, Thumbnail, TitleHeader.

## 유지 컴포넌트 (22개)

Avatar, AvatarGroup, BadgeDot, BadgeNumber, Checkbox, Chips, IconButton, TextButton, LoadingCircular, LoadingDot, PaginationDot, PaginationList, Radio, ScrimOverlay, Search, Skeleton, Snackbar, Tabs, Toast, ToggleSwitch, Tooltip, TopNavigation.

## 근거

`docs/AI_RULES.md`의 source-note·visual-registry·MCP 게이트가 반복적으로 지켜지지 않아 라이브러리가 부풀었음. 제품 팀이 실제로 사용하는 코어 셋만 남기고 신뢰할 수 없는 구현체를 제거해, 남은 컴포넌트의 품질 보증을 강화하기 위한 결정. 삭제 14개는 유지 컴포넌트에서 import되지 않아 단방향 안전 삭제 가능.

미존재(나중 빌드 예정): Bottom popup/sheet, Bottom navigation, Dialog, In-app browser.
