import type { Meta, StoryObj } from "@storybook/react";
import { LinearProgressIndicator } from "./LinearProgressIndicator";
import "./LinearProgressIndicator.css";

const linearProgressBaseline = new URL(
  "../../figma/baselines/linear-progress-indicator-default@3x.png",
  import.meta.url,
).href;
const figmaControlNames = ["mode", "rounded", "indicatorHeight"] as const;

const argTypes = {
  indicatorHeight: { control: { type: "inline-radio" }, options: ["default", "4"] },
  mode: { control: { type: "inline-radio" }, options: ["default", "fixed"] },
  rounded: { control: { type: "inline-radio" }, options: ["off", "on"] },
} as const;

const meta = {
  title: "Atoms/LinearProgressIndicator",
  component: LinearProgressIndicator,
  args: {
    indicatorHeight: "default",
    mode: "default",
    progress: 75 / 393,
    rounded: "off",
  },
  argTypes,
  parameters: {
    controls: { include: [...figmaControlNames] },
    docs: {
      description: {
        component:
          "Figma node 9003:21727 기반 LinearProgressIndicator입니다. Source note: src/figma/linear-progress-indicator.source.md.",
      },
    },
  },
} satisfies Meta<typeof LinearProgressIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 16 }}>
      <LinearProgressIndicator {...args} mode="default" rounded="off" indicatorHeight="default" />
      <LinearProgressIndicator {...args} mode="default" rounded="on" indicatorHeight="default" />
      <LinearProgressIndicator {...args} mode="default" rounded="off" indicatorHeight="4" progress={173 / 393} />
      <LinearProgressIndicator {...args} mode="fixed" rounded="off" indicatorHeight="default" />
    </div>
  ),
};

export const States: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 16 }}>
      {[0, 75 / 393, 0.5, 1].map((progress) => (
        <LinearProgressIndicator {...args} key={progress} progress={progress} />
      ))}
    </div>
  ),
};

export const FigmaCompare: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div style={{ display: "grid", gap: 12 }}>
      <img
        alt="Figma LinearProgressIndicator reference"
        src={linearProgressBaseline}
        style={{ height: 2, objectFit: "contain", objectPosition: "left", width: 393 }}
      />
      <LinearProgressIndicator {...args} mode="default" rounded="off" indicatorHeight="default" progress={75 / 393} />
    </div>
  ),
};
