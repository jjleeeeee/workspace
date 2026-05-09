import type { Meta, StoryObj } from "@storybook/react";
import { Scrollbar } from "./Scrollbar";
import "./Scrollbar.css";

const scrollbarBaseline = new URL("../../figma/baselines/scrollbar-default@3x.png", import.meta.url).href;
const figmaControlNames = ["mode"] as const;

const argTypes = {
  mode: { control: { type: "inline-radio" }, options: ["default", "fixed-white", "fixed-black"] },
} as const;

const meta = {
  title: "Atoms/Scrollbar",
  component: Scrollbar,
  args: {
    mode: "default",
  },
  argTypes,
  parameters: {
    controls: { include: [...figmaControlNames] },
    docs: {
      description: {
        component: "Figma node 27782:8837 기반 Scrollbar입니다. Native browser scrollbar가 아니라 DS atom입니다.",
      },
    },
  },
} satisfies Meta<typeof Scrollbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={{ alignItems: "center", display: "flex", gap: 24 }}>
      <Scrollbar {...args} mode="default" />
      <div style={{ background: "#fff", padding: 8 }}>
        <Scrollbar {...args} mode="fixed-white" />
      </div>
      <div style={{ background: "#111", padding: 8 }}>
        <Scrollbar {...args} mode="fixed-black" />
      </div>
    </div>
  ),
};

export const States: Story = {
  render: (args) => (
    <div style={{ alignItems: "flex-start", display: "flex", gap: 24 }}>
      <Scrollbar {...args} />
      <Scrollbar {...args} mode="fixed-white" />
      <Scrollbar {...args} mode="fixed-black" />
    </div>
  ),
};

export const FigmaCompare: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div style={{ display: "grid", gap: 12 }}>
      <img
        alt="Figma Scrollbar reference"
        src={scrollbarBaseline}
        style={{ height: 100, objectFit: "contain", objectPosition: "left", width: 10 }}
      />
      <Scrollbar {...args} mode="default" />
    </div>
  ),
};
