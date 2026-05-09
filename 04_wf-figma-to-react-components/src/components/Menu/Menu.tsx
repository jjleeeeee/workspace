import type { CSSProperties, HTMLAttributes } from "react";
import { ListItemNative, type ListItemNativeProps } from "../ListItemNative/ListItemNative";
import { Scrollbar } from "../Scrollbar/Scrollbar";
import "./Menu.css";

export type MenuMode = "default" | "fixed";
export type MenuPosition = "top" | "bottom" | "center";

export interface MenuItem {
  disabled?: boolean;
  detailText?: string;
  id?: string;
  label?: string;
  listItemProps?: Partial<ListItemNativeProps>;
  selected?: boolean;
  title: string;
}

export interface MenuProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  items?: Array<MenuItem | string>;
  itemCount?: number;
  maxHeight?: number;
  mode?: MenuMode;
  onItemSelect?: (item: MenuItem, index: number) => void;
  position?: MenuPosition;
  selectedItemId?: string;
}

const menuRowHeight = 40;
const menuPanelPaddingBlock = 8;

function createDefaultItems(itemCount: number): MenuItem[] {
  return Array.from({ length: itemCount }, (_, index) => ({
    id: `menu-item-${index + 1}`,
    title: "Title",
  }));
}

function normalizeItem(item: MenuItem | string, index: number): Required<Pick<MenuItem, "id" | "title">> & MenuItem {
  if (typeof item === "string") {
    return { id: `menu-item-${index + 1}`, title: item };
  }

  return {
    ...item,
    id: item.id ?? `menu-item-${index + 1}`,
    title: item.title ?? item.label ?? "Title",
  };
}

export function Menu({
  className,
  itemCount = 9,
  items,
  maxHeight = 370,
  mode = "default",
  onItemSelect,
  position = "bottom",
  selectedItemId,
  ...divProps
}: MenuProps) {
  const classNames = ["chord-menu", className].filter(Boolean).join(" ");
  const normalizedItems = (items ?? createDefaultItems(itemCount)).map(normalizeItem);
  const hasOverflow = normalizedItems.length * menuRowHeight + menuPanelPaddingBlock > maxHeight;

  return (
    <div
      {...divProps}
      className={classNames}
      data-mode={mode}
      data-position={position}
      data-row-source="ListItemNative"
      style={{ "--menu-panel-max-block-size": `${maxHeight}px`, ...divProps.style } as CSSProperties}
    >
      <div className="chord-menu__panel" role="menu">
        <div className="chord-menu__items">
          {normalizedItems.map((item, index) => {
            const disabled = Boolean(item.disabled);
            const selected = item.selected ?? item.id === selectedItemId;

            return (
              <ListItemNative
                {...item.listItemProps}
                aria-disabled={disabled ? "true" : undefined}
                bodyText={item.detailText ?? item.listItemProps?.bodyText}
                data-menu-item-selected={String(selected)}
                inlineSize={240}
                key={item.id}
                mode={mode}
                onClick={(event) => {
                  item.listItemProps?.onClick?.(event);
                  if (!disabled) onItemSelect?.(item, index);
                }}
                role="menuitem"
                showBodyText={Boolean(item.detailText ?? item.listItemProps?.bodyText)}
                showDivider={false}
                showMediumLeading={false}
                showSmallLeading={false}
                showTrailing={false}
                size="small"
                status={disabled ? "disabled" : (item.listItemProps?.status ?? "default")}
                title={item.title}
              />
            );
          })}
        </div>
        {hasOverflow ? (
          <Scrollbar
            className="chord-menu__scrollbar"
            data-testid="menu-scrollbar"
            mode={mode === "fixed" ? "fixed-white" : "default"}
          />
        ) : null}
      </div>
    </div>
  );
}
