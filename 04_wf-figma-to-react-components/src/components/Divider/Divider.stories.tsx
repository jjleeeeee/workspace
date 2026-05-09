import type { Meta, StoryObj } from "@storybook/react";
import { Divider } from "./Divider";
import "./Divider.css";

const dividerBaseline = new URL("../../figma/baselines/divider-default@3x.png", import.meta.url).href;
const figmaControlNames = ["dividerStyle", "height", "mode"] as const;

const argTypes = {
  dividerStyle: { control: { type: "inline-radio" }, options: ["default-50a", "default-50a-2"] },
  height: { control: { type: "inline-radio" }, options: ["1", "2", "8"] },
  mode: { control: { type: "inline-radio" }, options: ["default", "fixed"] },
} as const;

const meta = {
  title: "Atoms/Divider",
  component: Divider,
  args: {
    dividerStyle: "default-50a",
    height: "1",
    mode: "default",
  },
  argTypes,
  parameters: {
    controls: { include: [...figmaControlNames] },
    docs: {
      description: {
        component: "Figma node 10379:40800 기반 Divider입니다. Source note: src/figma/divider.source.md.",
      },
    },
  },
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 16 }}>
      {(["1", "2", "8"] as const).map((height) => (
        <Divider {...args} height={height} key={height} />
      ))}
    </div>
  ),
};

export const States: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 16 }}>
      <Divider {...args} dividerStyle="default-50a" mode="default" />
      <Divider {...args} dividerStyle="default-50a-2" mode="default" />
      <div style={{ background: "#111", padding: 8 }}>
        <Divider {...args} dividerStyle="default-50a" mode="fixed" />
      </div>
    </div>
  ),
};

export const FigmaCompare: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div style={{ display: "grid", gap: 12 }}>
      <img
        alt="Figma Divider reference"
        src={dividerBaseline}
        style={{ height: 1, objectFit: "contain", objectPosition: "left", width: 393 }}
      />
      <Divider {...args} />
    </div>
  ),
};
