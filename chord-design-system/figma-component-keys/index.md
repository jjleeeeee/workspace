# Chord DS Figma Component Keys

Figma file: `DWEduE6GfxYMlyxKPNJ8jA`  
Source: Chord Design System  
Extraction tool: Framelink MCP / Figma REST API  
Last checked: 2026-05-01 KST

이 문서는 Figma node id와 component key를 빠르게 찾기 위한 레지스트리입니다.

- 이 파일은 component set/component key를 빠르게 찾기 위한 index입니다.
- `Level`은 Description workflow grouping을 위한 내부 분류 참고값입니다.
- `Atom`은 내부에 nested layer/component가 있어도 소비자가 하나의 기본 부품처럼 쓰는 컴포넌트입니다.
- `Molecule`은 여러 역할 영역이나 하위 DS 컴포넌트 조합이 사용 계약에 드러나는 컴포넌트입니다.
- Figma 내부에 instance가 있다는 이유만으로 `Molecule`로 바꾸지 않습니다.
- 실제 조합 관계는 Figma live readback과 Description YAML의 `composition.uses`로 확인하며, `Level`보다 우선합니다.
- 모든 variant component key 상세는 `variant-keys/` 아래 detail 파일로 분리합니다.
- `Component Set Key`는 Figma component set 자체의 key입니다.
- `Variant Component Key`는 실제 variant component 단위 key입니다.

## Component Set Summary

| Component | Level | Type | Node ID | Component Set Key / Component Key | Variant Count | Detail |
| --- | --- | --- | --- | --- | ---: | --- |
| `[V2] Avatar` | Atom | Component Set | `62973:7556` | `33d955018e09fb10ab89cefc8f00f2662a2b0e39` | 44 | [variant keys](./variant-keys/avatar.md) |
| `Badge_Dot` | Atom | Component Set | `8451:112783` | `d1ea898a9e908e7470a7518abae5b45c18e0a58a` | 12 | [variant keys](./variant-keys/badge-dot.md) |
| `Badge_Number` | Atom | Component Set | `8451:113030` | `0ec884a8ce648a69360a64bc9b883cd0b3cc948d` | 4 | [variant keys](./variant-keys/badge-number.md) |
| `Text Button` | Atom | Component Set | `52753:39618` | `70d2a20bcdfe3ac7a3c3190410d9a255d8783e1d` | 576 | [variant keys](./variant-keys/text-button.md) |
| `Icon Button` | Atom | Component Set | `54093:38777` | `b60ecb5e664ce4e19bd9b11dd521d9b710d711df` | 192 | [variant keys](./variant-keys/icon-button.md) |
| `[V2] Checkbox` | Atom | Component Set | `60365:40276` | `80eebb7d094726a1a9e864931f4347d76008ca25` | 12 | [variant keys](./variant-keys/checkbox.md) |
| `[V2] Chips` | Atom | Component Set | `59869:78921` | `6f1fa3aadc347f4c8c2f26405695b2415dbdcb95` | 100 | [variant keys](./variant-keys/chips.md) |
| `[V1] Divider` | Atom | Component Set | `10379:40800` | `5153f6a88c72583fd7bf2923e355e3b5d0e85773` | 12 | [variant keys](./variant-keys/divider.md) |
| `Dropdown_Box` | Molecule | Component Set | `60730:9605` | `97601b8a3636233ad6892ba3ecb2fa22f59e9546` | 14 | [variant keys](./variant-keys/dropdown-box.md) |
| `[V2] List_Item_Native` | Molecule | Component Set | `57343:18628` | `e120970b1638c0fa7a5b7638923eb91479384ebe` | 12 | [variant keys](./variant-keys/list-item-native.md) |
| `[V2] List_Item_Web` | Molecule | Component Set | `69579:9043` | `42c19f42926776126ff312006b4505a4e03a905a` | 12 | [variant keys](./variant-keys/list-item-web.md) |
| `[V2] Menu` | Molecule | Component Set | `25963:37235` | `f1e30b43648b4839e2cd69b1de633dd29a408fed` | 2 | [variant keys](./variant-keys/menu.md) |
| `Linear_Progress_Indicator` | Atom | Component Set | `9003:21727` | `42d64503b19a20dd5a6f7ea05e3c61cc3e75e9b7` | 6 | [variant keys](./variant-keys/linear-progress-indicator.md) |
| `Circular_Progress_Indicator` | Atom | Component Set | `9003:21751` | `52969b5595e5042dda34b6a45dbb86939887af5c` | 2 | [variant keys](./variant-keys/circular-progress-indicator.md) |
| `[V2] Search` | Molecule | Component Set | `59722:17972` | `cbcd2baf8a758cd859c194359b69faf7fa3e543a` | 6 | [variant keys](./variant-keys/search.md) |
| `[V2] Snackbar` | Molecule | Component Set | `63694:5774` | `1d2be6f3586d1004dcb93f999e630377fe2a18c7` | 2 | [variant keys](./variant-keys/snackbar.md) |
| `[V2] Stepper` | Molecule | Component Set | `61604:4394` | `684550ae4653da74717f2599c3da1bb7b7640d73` | 6 | [variant keys](./variant-keys/stepper.md) |
| `[V2] Tabs` | Molecule | Component Set | `65172:10165` | `12eee519d7ee66e179cb03c579962a37beba7e7f` | 16 | [variant keys](./variant-keys/tabs.md) |
| `[V2] Text_Fields` | Molecule | Component Set | `62030:25225` | `1cd268687529359f71d915dd915ac2eac7eb3fa4` | 20 | [variant keys](./variant-keys/text-fields.md) |
| `[V2] Thumbnail` | Molecule | Component Set | `50545:51014` | `d0a05143f1a3867b7d8d30eacf939b885d41e0eb` | 12 | [variant keys](./variant-keys/thumbnail.md) |
| `Title Header` | Molecule | Component Set | `64450:27844` | `33261ba4635ef136dd94de771e9ded865a98c6d4` | 4 | [variant keys](./variant-keys/title-header.md) |
| `Top Navigation` | Molecule | Component Set | `64450:39560` | `f53f182c4c02ac61fdb2d8bcdb0304f6ed4be48d` | 32 | [variant keys](./variant-keys/top-navigation.md) |
| `[V2] Toast` | Molecule | Component Set | `63694:4595` | `c582282238f4497a69ce1f3a82bd4c59723de883` | 2 | [variant keys](./variant-keys/toast.md) |
| `[V2] Radio` | Atom | Component Set | `59215:200965` | `a04bcc0355ca5db25efdc00cdfc68958db3f5976` | 6 | [variant keys](./variant-keys/radio.md) |
| `Scrim_Overlay` | Atom | Component | `10482:75325` | `82556da89c0795003b5b07261ac8dc65fb09da1c` | 1 | [component key](./variant-keys/scrim-overlay.md) |
| `Scrollbar` | Atom | Component Set | `27782:8837` | `ec2d17107a68bb443f80245ab791fb69380f0a50` | 3 | [variant keys](./variant-keys/scrollbar.md) |
| `Select_Number_Box` | Atom | Component Set | `12436:362` | `9d3d023e0d5060cdbcb54f40ff6c1df7a0c333a5` | 6 | [variant keys](./variant-keys/select-number-box.md) |
| `Skeleton` | Atom | Component Set | `12447:42302` | `646e648144ff6565de0d221e746dce3d4883ac5a` | 12 | [variant keys](./variant-keys/skeleton.md) |
| `Pagination_Dot(v2)` | Atom | Component Set | `62324:12061` | `6dc90bf874beb759995aee563475cf96c3aa9a58` | 40 | [variant keys](./variant-keys/pagination-dot-v2.md) |
| `Pagination_List(v2)` | Atom | Component Set | `61753:7839` | `cf936b6328942bcd5428cadb0d709f3e471091c4` | 28 | [variant keys](./variant-keys/pagination-list-v2.md) |
| `Loading_Dot` | Atom | Component Set | `10384:29778` | `b1ecfc5a18468daceeaaa41142ef26f896c0f67f` | 6 | [variant keys](./variant-keys/loading-dot.md) |
| `Loading_Circular` | Atom | Component Set | `10384:29888` | `b24a5889bca4523ee97a36936574bf3abbee155c` | 2 | [variant keys](./variant-keys/loading-circular.md) |
| `Toggle Switch` | Atom | Component Set | `7927:149092` | `707fb6a0b475122bef17b30346b9dfe6f211c50b` | 24 | [variant keys](./variant-keys/toggle-switch.md) |
| `Tooltip` | Atom | Component Set | `7891:6903` | `51e3f2d3c3ea2ece4c8b084477cee852a10eb2da` | 96 | [variant keys](./variant-keys/tooltip.md) |
| `tag` | Atom | Component Set | `30256:32826` | `bc5965253050f2719974ba59fab7b22b35a05b3f` | 89 | [variant keys](./variant-keys/tag.md) |
