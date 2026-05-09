import type { Meta, StoryObj } from "@storybook/react";
import { Toast } from "./Toast";
import "./Toast.css";

const toastBaseline = new URL("../../figma/baselines/toast-default@3x.png", import.meta.url).href;
const figmaControlNames = ["label", "mode"] as const;

const argTypes = {
  label: { control: { type: "text" } },
  mode: { control: { type: "inline-radio" }, options: ["default", "fixed"] },
} as const;

const meta = {
  title: "Atoms/Toast",
  component: Toast,
  args: {
    label: "Translate it into the following language.",
    mode: "default",
  },
  argTypes,
  parameters: {
    controls: { include: [...figmaControlNames] },
    docs: {
      description: {
        component:
          "Figma node 63694:4595 기반 Toast입니다. Source note: src/figma/toast.source.md. Text-only, non-blocking feedback; no icon or action slot.",
      },
    },
  },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={{ alignItems: "center", display: "flex", flexWrap: "wrap", gap: 16 }}>
      <Toast {...args} mode="default" />
      <Toast {...args} mode="fixed" />
    </div>
  ),
};

export const States: Story = {
  render: (args) => (
    <div style={{ alignItems: "center", display: "grid", gap: 16, justifyItems: "start", width: 430 }}>
      <Toast {...args} label="Saved" />
      <Toast {...args} label="Translate it into the following language." />
      <Toast
        {...args}
        label="긴 메시지는 최대 두 줄까지만 표시되며 화면 가장자리와 최대 너비 기준을 함께 지킵니다"
      />
    </div>
  ),
};

export const FigmaCompare: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div style={{ display: "grid", gap: 12 }}>
      <img
        alt="Figma Toast reference"
        src={toastBaseline}
        style={{ height: 42, objectFit: "contain", objectPosition: "left", width: 293 }}
      />
      <Toast {...args} label="Translate it into the following language." mode="default" />
    </div>
  ),
};
