import type { Meta, StoryObj } from "@storybook/react";
import { Menu } from "./Menu";
import type { MenuMode, MenuPosition } from "./Menu";
import "./Menu.css";

const menuBaseline = new URL("../../figma/baselines/menu-default@3x.png", import.meta.url).href;
const figmaControlNames = ["mode", "itemCount", "maxHeight", "position"] as const;

const modeOptions: MenuMode[] = ["default", "fixed"];
const positionOptions: MenuPosition[] = ["bottom", "top", "center"];

const argTypes = {
  itemCount: { control: { type: "number" } },
  maxHeight: { control: { type: "number" } },
  mode: { control: { type: "inline-radio" }, options: modeOptions },
  position: { control: { type: "inline-radio" }, options: positionOptions },
} as const;

const meta = {
  title: "Atoms/Menu",
  component: Menu,
  args: {
    itemCount: 9,
    maxHeight: 370,
    mode: "default",
    position: "bottom",
  },
  argTypes,
  parameters: {
    controls: { include: [...figmaControlNames] },
    docs: {
      description: {
        component:
          "Figma node 25963:37235 기반 Menu입니다. Source note: src/figma/menu.source.md. Menu owns the overlay container; rows are composed with ListItemNative compact title-only branch. Visual capture includes shadow export bounds.",
      },
    },
  },
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={{ alignItems: "start", display: "flex", flexWrap: "wrap", gap: 24 }}>
      {modeOptions.map((mode) => (
        <Menu {...args} key={mode} mode={mode} />
      ))}
    </div>
  ),
};

export const States: Story = {
  render: (args) => (
    <div style={{ alignItems: "start", display: "flex", flexWrap: "wrap", gap: 24 }}>
      <Menu {...args} itemCount={3} maxHeight={154} />
      <Menu {...args} items={[{ disabled: true, id: "disabled", title: "Disabled" }, "Title", "Title"]} maxHeight={154} />
      <Menu {...args} itemCount={12} maxHeight={120} />
    </div>
  ),
};

export const FigmaCompare: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div style={{ display: "grid", gap: 12 }}>
      <img alt="Figma Menu reference" src={menuBaseline} style={{ height: 418, width: 288 }} />
      <Menu {...args} />
      <span style={{ color: "#777", fontSize: 12 }}>
        The outer box captures Figma shadow bounds. The live menu panel remains 240x370 and rows are ListItemNative
        compact title-only composition, not private Menu row typography.
      </span>
    </div>
  ),
};
