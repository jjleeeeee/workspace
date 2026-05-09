import type { Meta, StoryObj } from "@storybook/react";
import { Avatar, avatarModeOptions, avatarSizeOptions, avatarTypeOptions } from "./Avatar";
import "./Avatar.css";

const circleMediumBaseline = new URL("../../figma/baselines/avatar-circle-medium-default-3x.png", import.meta.url).href;
const circleSmallBaseline = new URL("../../figma/baselines/avatar-circle-small-default-3x.png", import.meta.url).href;
const squircleMediumBaseline = new URL("../../figma/baselines/avatar-squircle-medium-default-3x.png", import.meta.url).href;

const figmaControlNames = ["avatarType", "badgeDot", "birthdayHat", "emoji", "host", "mode", "ring", "size"] as const;

const argTypes = {
  avatarType: { control: { type: "inline-radio" }, options: avatarTypeOptions },
  badgeDot: { control: { type: "boolean" } },
  birthdayHat: { control: { type: "boolean" } },
  emoji: { control: { type: "boolean" } },
  host: { control: { type: "boolean" } },
  mode: { control: { type: "inline-radio" }, options: avatarModeOptions },
  ring: { control: { type: "boolean" } },
  size: { control: { type: "select" }, options: avatarSizeOptions },
} as const;

const meta = {
  title: "Atoms/Avatar",
  component: Avatar,
  args: {
    avatarType: "circle",
    badgeDot: true,
    birthdayHat: true,
    emoji: true,
    host: true,
    mode: "default",
    ring: true,
    size: "xxxxlarge",
  },
  argTypes,
  parameters: {
    controls: { include: [...figmaControlNames] },
    docs: {
      description: {
        component:
          "Figma node 62973:7556 기반 [V2] Avatar입니다. Optional props follow the Figma component property defaults. Placeholder image bundle node 81500:7449 is exported as size-specific SVG assets.",
      },
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const VisualCircleSmall: Story = {
  args: {
    avatarType: "circle",
    birthdayHat: false,
    emoji: false,
    host: false,
    mode: "default",
    ring: false,
    size: "small",
  },
  parameters: { controls: { disable: true } },
};

export const VisualSquircleMedium: Story = {
  args: {
    avatarType: "squircle",
    badgeDot: true,
    host: true,
    mode: "default",
    size: "medium",
  },
  parameters: { controls: { disable: true } },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ alignItems: "center", display: "flex", flexWrap: "wrap", gap: 20 }}>
      {avatarSizeOptions.map((size) => (
        <Avatar {...args} key={size} size={size} />
      ))}
    </div>
  ),
};

export const Types: Story = {
  render: (args) => (
    <div style={{ alignItems: "center", display: "flex", gap: 24 }}>
      <Avatar {...args} avatarType="circle" size="medium" />
      <Avatar {...args} avatarType="squircle" size="medium" />
    </div>
  ),
};

export const Decorations: Story = {
  render: (args) => (
    <div style={{ alignItems: "center", display: "flex", gap: 24 }}>
      <Avatar {...args} avatarType="circle" birthdayHat emoji ring size="medium" />
      <Avatar {...args} avatarType="circle" birthdayHat={false} emoji={false} ring={false} size="medium" />
      <Avatar {...args} avatarType="squircle" badgeDot host size="medium" />
      <Avatar {...args} avatarType="squircle" badgeDot={false} host={false} size="medium" />
    </div>
  ),
};

export const FigmaCompare: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: "grid", gap: 20 }}>
      <div style={{ alignItems: "center", display: "flex", gap: 16 }}>
        <img alt="Figma Avatar circle medium" src={circleMediumBaseline} style={{ height: 90, width: 84 }} />
        <Avatar avatarType="circle" size="medium" />
      </div>
      <div style={{ alignItems: "center", display: "flex", gap: 16 }}>
        <img alt="Figma Avatar circle small" src={circleSmallBaseline} style={{ height: 46, width: 46 }} />
        <Avatar avatarType="circle" size="small" />
      </div>
      <div style={{ alignItems: "center", display: "flex", gap: 16 }}>
        <img alt="Figma Avatar squircle medium" src={squircleMediumBaseline} style={{ height: 56, width: 56 }} />
        <Avatar avatarType="squircle" size="medium" />
      </div>
    </div>
  ),
};
