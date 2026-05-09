import type { Meta, StoryObj } from "@storybook/react";
import { BadgeDot } from "./BadgeDot";
import "./BadgeDot.css";

const badgeDotBaseline = new URL("../../figma/baselines/badge-dot-default@3x.png", import.meta.url).href;
const figmaControlNames = ["mode", "outline", "size"] as const;

const argTypes = {
  mode: { control: { type: "inline-radio" }, options: ["default", "fixed"] },
  outline: { control: { type: "inline-radio" }, options: ["off", "on"] },
  size: { control: { type: "inline-radio" }, options: ["small", "medium", "large"] },
} as const;

const meta = {
  title: "Atoms/BadgeDot",
  component: BadgeDot,
  args: {
    mode: "default",
    outline: "off",
    size: "medium",
  },
  argTypes,
  parameters: {
    controls: { include: [...figmaControlNames] },
    docs: {
      description: {
        component: "Figma node 8451:112783 기반 BadgeDot입니다. Source note: src/figma/badge-dot.source.md.",
      },
    },
  },
} satisfies Meta<typeof BadgeDot>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 16 }}>
      {(["default", "fixed"] as const).map((mode) => (
        <div key={mode} style={{ alignItems: "center", display: "flex", gap: 16 }}>
          {(["off", "on"] as const).map((outline) =>
            (["small", "medium", "large"] as const).map((size) => (
              <BadgeDot {...args} key={`${mode}-${outline}-${size}`} mode={mode} outline={outline} size={size} />
            )),
          )}
        </div>
      ))}
    </div>
  ),
};

export const FigmaCompare: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div style={{ display: "grid", gap: 12 }}>
      <img
        alt="Figma BadgeDot reference"
        src={badgeDotBaseline}
        style={{ height: 6, objectFit: "contain", objectPosition: "left", width: 6 }}
      />
      <BadgeDot {...args} mode="default" outline="off" size="medium" />
    </div>
  ),
};
