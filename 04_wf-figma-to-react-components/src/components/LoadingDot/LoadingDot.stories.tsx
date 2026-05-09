import type { Meta, StoryObj } from "@storybook/react";
import { LoadingDot } from "./LoadingDot";
import "./LoadingDot.css";

const loadingDotBaseline = new URL("../../figma/baselines/loading-dot-default@3x.png", import.meta.url).href;
const figmaControlNames = ["mode", "size", "color"] as const;

const argTypes = {
  color: { control: { type: "inline-radio" }, options: ["primary", "white"] },
  mode: { control: { type: "inline-radio" }, options: ["default", "fixed"] },
  size: { control: { type: "inline-radio" }, options: ["medium", "small"] },
} as const;

const meta = {
  title: "Atoms/LoadingDot",
  component: LoadingDot,
  args: {
    animated: false,
    color: "primary",
    mode: "default",
    size: "medium",
  },
  argTypes,
  parameters: {
    controls: { include: [...figmaControlNames] },
    docs: {
      description: {
        component: "Figma node 10384:29778 기반 LoadingDot입니다. Source note: src/figma/loading-dot.source.md.",
      },
    },
  },
} satisfies Meta<typeof LoadingDot>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={{ alignItems: "center", display: "flex", gap: 20 }}>
      <LoadingDot {...args} mode="default" size="medium" color="primary" />
      <LoadingDot {...args} mode="default" size="small" color="primary" />
      <div style={{ background: "#111", padding: 8 }}>
        <LoadingDot {...args} mode="default" size="small" color="white" />
      </div>
      <LoadingDot {...args} mode="fixed" size="medium" color="primary" />
      <LoadingDot {...args} mode="fixed" size="small" color="primary" />
    </div>
  ),
};

export const States: Story = {
  render: (args) => (
    <div style={{ alignItems: "center", display: "flex", gap: 20 }}>
      <LoadingDot {...args} animated={false} />
      <LoadingDot {...args} animated />
    </div>
  ),
};

export const FigmaCompare: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div style={{ display: "grid", gap: 12 }}>
      <img
        alt="Figma LoadingDot reference"
        src={loadingDotBaseline}
        style={{ height: 60, objectFit: "contain", objectPosition: "left", width: 60 }}
      />
      <LoadingDot {...args} animated={false} mode="default" size="medium" color="primary" />
    </div>
  ),
};
