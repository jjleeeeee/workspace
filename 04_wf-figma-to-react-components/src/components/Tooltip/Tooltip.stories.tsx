import type { Meta, StoryObj } from "@storybook/react";
import { Tooltip } from "./Tooltip";
import "./Tooltip.css";

const tooltipBaseline = new URL("../../figma/baselines/tooltip-default@3x.png", import.meta.url).href;
const figmaControlNames = ["buttonClose", "color", "label", "mode", "position", "size"] as const;

const argTypes = {
  buttonClose: { control: { type: "boolean" } },
  color: { control: { type: "select" }, options: ["black", "white-fixed", "tint"] },
  label: { control: { type: "text" } },
  mode: { control: { type: "inline-radio" }, options: ["default", "fixed"] },
  position: {
    control: { type: "select" },
    options: [
      "bottom-center",
      "bottom-left",
      "bottom-right",
      "left-center",
      "right-center",
      "top-center",
      "top-left",
      "top-right",
    ],
  },
  size: { control: { type: "inline-radio" }, options: ["large", "medium"] },
} as const;

const meta = {
  title: "Atoms/Tooltip",
  component: Tooltip,
  args: {
    buttonClose: true,
    color: "black",
    label: "가로 최대 240, 글자수 최대 8줄",
    mode: "default",
    position: "bottom-center",
    size: "large",
  },
  argTypes,
  parameters: {
    controls: { include: [...figmaControlNames] },
    docs: {
      description: {
        component:
          "Figma node 7891:6903 기반 Tooltip입니다. Source note: src/figma/tooltip.source.md. Close icon is mapped through the DS icon registry; caret remains a nested asset gap.",
      },
    },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={{ alignItems: "center", display: "flex", flexWrap: "wrap", gap: 24 }}>
      {(["black", "white-fixed", "tint"] as const).map((color) => (
        <Tooltip {...args} color={color} key={color} />
      ))}
    </div>
  ),
};

export const States: Story = {
  render: (args) => (
    <div style={{ alignItems: "center", display: "flex", flexWrap: "wrap", gap: 24, padding: 24 }}>
      <Tooltip {...args} label="짧음" />
      <Tooltip {...args} />
      <Tooltip
        {...args}
        label="긴 문장은 최대 너비 안에서 줄바꿈되며 샘플 렌더 폭을 최소 너비로 강제하지 않습니다"
      />
      <Tooltip {...args} buttonClose={false} label="닫기 없음" />
      <Tooltip {...args} position="top-center" />
      <Tooltip {...args} position="left-center" />
      <Tooltip {...args} position="right-center" />
    </div>
  ),
};

export const FigmaCompare: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div style={{ display: "grid", gap: 12 }}>
      <img
        alt="Figma Tooltip reference"
        src={tooltipBaseline}
        style={{ height: 41, objectFit: "contain", objectPosition: "left", width: 225 }}
      />
      <Tooltip {...args} />
      <span style={{ color: "#777", fontSize: 12 }}>Close icon uses the mapped DS asset. Caret remains a nested asset gap.</span>
    </div>
  ),
};
