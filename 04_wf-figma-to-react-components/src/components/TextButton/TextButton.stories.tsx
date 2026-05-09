import type { Meta, StoryObj } from "@storybook/react";
import { TextButton } from "./TextButton";
import "./TextButton.css";

const textButtonBaseline = new URL("../../figma/baselines/text-button-default@3x.png", import.meta.url).href;
const figmaControlNames = [
  "buttonColor",
  "buttonType",
  "children",
  "mode",
  "optionLeading",
  "optionTrailing",
  "radius",
  "size",
  "status",
  "trailingIcon",
  "trailingText",
] as const;

const argTypes = {
  buttonColor: { control: { type: "inline-radio" }, options: ["default", "black"] },
  buttonType: { control: { type: "select" }, options: ["filled", "outlinedColor", "outlinedGray", "ghost"] },
  children: { control: { type: "text" } },
  mode: { control: { type: "inline-radio" }, options: ["default", "fixed"] },
  optionLeading: { control: { type: "boolean" } },
  optionTrailing: { control: { type: "boolean" } },
  radius: { control: { type: "inline-radio" }, options: ["off", "on"] },
  size: { control: { type: "select" }, options: ["xlarge", "large", "medium", "small", "xsmall", "xxsmall"] },
  status: { control: { type: "select" }, options: ["default", "hover", "loading", "disabled"] },
  trailingIcon: { control: { type: "boolean" } },
  trailingText: { control: { type: "boolean" } },
} as const;

const meta = {
  title: "Atoms/TextButton",
  component: TextButton,
  args: {
    buttonColor: "default",
    buttonType: "filled",
    children: "Text",
    mode: "default",
    optionLeading: false,
    optionTrailing: false,
    radius: "off",
    size: "medium",
    status: "default",
    trailingIcon: true,
    trailingText: false,
  },
  argTypes,
  parameters: {
    controls: { include: [...figmaControlNames] },
    docs: {
      description: {
        component:
          "Figma node 52753:39618 기준 TextButton입니다. Source note: src/figma/text-button.source.md. Asset note: leading/trailing icons are slot-only gaps in this v1 until their ChordIcon registry entries are identified.",
      },
    },
  },
} satisfies Meta<typeof TextButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 16 }}>
      {(["filled", "outlinedColor", "outlinedGray", "ghost"] as const).map((buttonType) => (
        <div key={buttonType} style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {(["xlarge", "large", "medium", "small", "xsmall", "xxsmall"] as const).map((size) => (
            <TextButton {...args} buttonType={buttonType} key={`${buttonType}-${size}`} size={size}>
              Text
            </TextButton>
          ))}
        </div>
      ))}
    </div>
  ),
};

export const States: Story = {
  render: (args) => (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      {(["default", "hover", "loading", "disabled"] as const).map((status) => (
        <TextButton {...args} aria-label={status === "loading" ? "Loading Text" : undefined} key={status} status={status}>
          Text
        </TextButton>
      ))}
    </div>
  ),
};

export const FigmaCompare: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "grid", gap: 8 }}>
        <span style={{ color: "#666", fontSize: 12, fontWeight: 700 }}>Figma reference: 52753:39957</span>
        <img
          alt="Figma TextButton reference"
          src={textButtonBaseline}
          style={{ height: 40, objectFit: "contain", objectPosition: "left", width: 63 }}
        />
      </div>
      <div style={{ display: "grid", gap: 8 }}>
        <span style={{ color: "#666", fontSize: 12, fontWeight: 700 }}>08 implementation</span>
        <TextButton {...args} buttonType="filled" buttonColor="default" radius="off" size="medium" status="default">
          Text
        </TextButton>
        <span style={{ color: "#777", fontSize: 12 }}>
          Asset gap: unresolved icon slots stay slot-only until a Figma icon source and ChordIcon registry entry are confirmed.
        </span>
      </div>
    </div>
  ),
};
