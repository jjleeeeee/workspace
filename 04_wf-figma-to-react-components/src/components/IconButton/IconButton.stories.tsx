import type { Meta, StoryObj } from "@storybook/react";
import { IconButton } from "./IconButton";
import "./IconButton.css";

const iconButtonBaseline = new URL("../../figma/baselines/icon-button-default@3x.png", import.meta.url).href;
const figmaControlNames = ["buttonColor", "buttonType", "mode", "radius", "size", "status"] as const;

const argTypes = {
  buttonColor: { control: { type: "inline-radio" }, options: ["default", "black"] },
  buttonType: { control: { type: "inline-radio" }, options: ["filled", "outlined"] },
  mode: { control: { type: "inline-radio" }, options: ["default", "fixed"] },
  radius: { control: { type: "inline-radio" }, options: ["off", "on"] },
  size: { control: { type: "select" }, options: ["xlarge", "medium", "small", "xxsmall"] },
  status: { control: { type: "select" }, options: ["default", "hover", "disabled"] },
} as const;

const meta = {
  title: "Atoms/IconButton",
  component: IconButton,
  args: {
    buttonColor: "default",
    buttonType: "filled",
    mode: "default",
    radius: "off",
    size: "xlarge",
    status: "default",
  },
  argTypes,
  parameters: {
    controls: { include: [...figmaControlNames] },
    docs: {
      description: {
        component:
          "Figma node 54093:38777 기반 IconButton입니다. Source note: src/figma/icon-button.source.md. Default icon is mapped to the shared DS icon registry.",
      },
    },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={{ alignItems: "center", display: "flex", gap: 12 }}>
      {(["xlarge", "medium", "small", "xxsmall"] as const).map((size) => (
        <IconButton {...args} aria-label={`${size} icon button`} key={size} size={size} />
      ))}
    </div>
  ),
};

export const States: Story = {
  render: (args) => (
    <div style={{ alignItems: "center", display: "flex", gap: 12 }}>
      {(["default", "hover", "disabled"] as const).map((status) => (
        <IconButton {...args} aria-label={`${status} icon button`} key={status} status={status} />
      ))}
    </div>
  ),
};

export const FigmaCompare: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div style={{ display: "grid", gap: 12 }}>
      <img
        alt="Figma IconButton reference"
        src={iconButtonBaseline}
        style={{ height: 52, objectFit: "contain", objectPosition: "left", width: 52 }}
      />
      <IconButton {...args} aria-label="Figma compare icon button" />
      <span style={{ color: "#777", fontSize: 12 }}>Default icon uses the mapped DS send asset; icon prop can override the slot.</span>
    </div>
  ),
};
