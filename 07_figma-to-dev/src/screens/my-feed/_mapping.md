# my-feed

Figma: "My Feed" 화면 (393×5765px), 피드 홈 화면

## DS 컴포넌트 매핑

| Figma 컴포넌트 | React 컴포넌트 | props |
|---|---|---|
| 💠 Status_bar | 50px spacer div | OS 전용 → 웹에서 의미 없음 |
| 💠 Top Navigation | `TopNavigation` | textType="logo-svg" scrollBg="on" mode="default" showTrailing trailingCount="2ea" |
| 💠 tag | `Tag` | color="secondary-blue" size="small" tagType="fill" shape="round" |
| 💠 [V2] Avatar | `Avatar` | size="large" (48px) |
| 💠 [V1] Divider | `Divider` | height="1" |
| Avatar (non-💠, 32px) | `Avatar` | size="small" |
| Avatar (non-💠, 20px) | `Avatar` | size="tiny" |

## 미해결

- [ ] **icon**: `ic_wev_ai_special_medium` → chord-icons.tsx 등록 필요 (현재 nullMedium 폴백)
- [ ] **icon**: `ic_notification_medium` → chord-icons.tsx 등록 필요 (현재 nullMedium 폴백)
- [ ] **component**: AI Banner → 앱 고유 컴포넌트, 라이브러리 미포함
- [ ] **component**: ImageGrid → 앱 고유 컴포넌트
- [ ] **component**: Thumbnail → 라이브러리 Thumbnail과 다를 수 있음 (확인 필요)
- [ ] **component**: Bottom Navigation → 앱 고유
- [ ] **component**: 말풍선 (DM Bubble) → 앱 고유
- [ ] **asset**: weverse 로고 → logoSlot 플레이스홀더 처리
- [ ] **component**: Tabs bar → 커스텀 구현 (💠 [V2] Tabs hidden이었음)
