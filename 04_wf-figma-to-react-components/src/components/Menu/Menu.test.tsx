import { render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { Menu } from "./Menu";

const menuCss = readFileSync(join(process.cwd(), "src/components/Menu/Menu.css"), "utf8");

describe("Menu", () => {
  it("renders the Figma default itemCount as ListItemNative rows", () => {
    render(<Menu data-testid="menu" />);

    const menu = screen.getByTestId("menu");
    const items = screen.getAllByRole("menuitem");

    expect(menu).toHaveAttribute("data-mode", "default");
    expect(menu).toHaveAttribute("data-position", "bottom");
    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(items).toHaveLength(9);
    expect(items[0]).toHaveTextContent("Title");
    expect(menu.querySelectorAll(".chord-list-item-native")).toHaveLength(9);
    expect(menu.querySelectorAll(".chord-menu__row")).toHaveLength(0);
  });

  it("maps disabled items to aria-disabled and ListItemNative disabled status", () => {
    render(<Menu items={[{ disabled: true, id: "disabled", title: "Disabled" }]} />);

    expect(screen.getByRole("menuitem")).toHaveAttribute("aria-disabled", "true");
    expect(screen.getByRole("menuitem")).toHaveClass("chord-list-item-native");
    expect(screen.getByRole("menuitem")).toHaveAttribute("data-status", "disabled");
  });

  it("uses itemCount when consumer items are not supplied", () => {
    render(<Menu itemCount={3} />);

    expect(screen.getAllByRole("menuitem")).toHaveLength(3);
  });

  it("renders a DS Scrollbar when content overflows maxHeight", () => {
    render(<Menu itemCount={12} maxHeight={120} />);

    expect(screen.getByTestId("menu-scrollbar")).toHaveClass("chord-scrollbar");
  });
});

describe("Menu CSS contract", () => {
  it("separates export shadow bounds from the live panel size", () => {
    expect(menuCss).toContain("--menu-export-inline-size: 288px");
    expect(menuCss).toContain("--menu-export-block-size: 418px");
    expect(menuCss).toContain("--menu-panel-inline-size: 240px");
    expect(menuCss).toContain("--menu-panel-block-size: 370px");
  });

  it("uses tokenized surfaces and the system alias font", () => {
    expect(menuCss).toContain("--cds-system-color-surface-default-4");
    expect(menuCss).toContain("--cds-system-fixed-color-surface-gray-100");
    expect(menuCss).toContain('"WeGothicSans"');
  });

  it("does not keep private row implementation styles", () => {
    expect(menuCss).not.toContain(".chord-menu__row");
    expect(menuCss).not.toContain("chord-menu__row-label");
  });
});
