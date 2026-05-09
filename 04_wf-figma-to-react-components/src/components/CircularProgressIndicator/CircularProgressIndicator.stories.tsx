import type { Meta, StoryObj } from "@storybook/react";
import { CircularProgressIndicator } from "./CircularProgressIndicator";
import "./CircularProgressIndicator.css";

const circularProgressBaseline = new URL(
  "../../figma/baselines/circular-progress-indicator-default@3x.png",
  import.meta.url,
).href;
const figmaControlNames = ["mode", "button"] as const;

const argTypes = {
  button: { control: "boolean" },
  mode: { control: { type: "inline-radio" }, options: ["default", "fixed"] },
} as const;

const meta = {
  title: "Atoms/CircularProgressIndicator",
  component: CircularProgressIndicator,
  args: {
    button: true,
    mode: "default",
    progress: 0.75,
  },
  argTypes,
  parameters: {
    controls: { include: [...figmaControlNames] },
    docs: {
      description: {
        component:
          "Figma node 9003:21751 기반 CircularProgressIndicator입니다. Button=true 기본 상태는 Figma에서 추출한 nested cancel asset을 렌더합니다.",
      },
    },
  },
} satisfies Meta<typeof CircularProgressIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={{ alignItems: "center", display: "flex", gap: 20 }}>
      <CircularProgressIndicator {...args} mode="default" />
      <CircularProgressIndicator {...args} mode="fixed" />
    </div>
  ),
};

export const States: Story = {
  render: (args) => (
    <div style={{ alignItems: "center", display: "flex", gap: 20 }}>
      <CircularProgressIndicator {...args} button={false} progress={0.25} />
      <CircularProgressIndicator {...args} button progress={0.75} />
      <CircularProgressIndicator {...args} buttonContent={<span aria-hidden="true" />} progress={1} />
    </div>
  ),
};

export const FigmaCompare: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div style={{ display: "grid", gap: 12 }}>
      <img
        alt="Figma CircularProgressIndicator reference"
        src={circularProgressBaseline}
        style={{ height: 56, objectFit: "contain", objectPosition: "left", width: 56 }}
      />
      <CircularProgressIndicator {...args} button mode="default" progress={0.75} />
    </div>
  ),
};
