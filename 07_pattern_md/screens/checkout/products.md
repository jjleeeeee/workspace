# 주문 상품 및 배송 수단
> 주문한 상품 목록과 각 상품의 배송 수단을 표시하는 섹션

## 구성

- 섹션 헤더: `"주문 상품"` `body-lg/system-700` + 개수 텍스트 (예: `"4개"`)
- **Product** (N개 반복):
  - 이미지 + 상품명 + 수량/가격: `body-m/system-400`
  - Shipping Info: 배송 방법 텍스트 `body-s/system-400`
  - 상품 사이 Divider
- 섹션 하단 Message Box (안내 메시지)

> 이 섹션은 `padding left/right = 0` — 상품 이미지가 카드 끝까지 확장됨 (index.md Layout Spec 참조)

## 컴포넌트

- `[V1] Divider` 상품 구분선 → [divider.md](../../../99_archive/03_component_md/components/divider.md) *(MD 미작성)*
- `[V2] List_Item_Native` 상품 목록 아이템 → [list_item.md](../../../99_archive/03_component_md/components/list_item.md) *(MD 미작성)*
- `Tag` `Type=Tint_Small` → [tag.md](../../../99_archive/03_component_md/components/tag.md) *(MD 미작성)*
- `Message Box` 하단 안내 → [message_box.md](../../../99_archive/03_component_md/components/message_box.md) *(MD 미작성)*
