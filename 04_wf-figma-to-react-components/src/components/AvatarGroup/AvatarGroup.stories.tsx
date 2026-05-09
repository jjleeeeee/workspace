import type { Meta, StoryObj } from "@storybook/react";
import {
  AvatarGroup,
  avatarGroupAlignmentOptions,
  avatarGroupCountOptions,
  avatarGroupShapeOptions,
  avatarGroupVariantOptions,
} from "./AvatarGroup";
import "./AvatarGroup.css";

const avatarGroupBaseline = new URL("../../figma/baselines/avatar-group-default.png", import.meta.url).href;

const figmaControlNames = ["alignment", "count", "liveTag", "shape"] as const;

const argTypes = {
  alignment: { control: { type: "inline-radio" }, options: avatarGroupAlignmentOptions },
  count: { control: { type: "select" }, options: avatarGroupCountOptions },
  liveTag: { control: { type: "boolean" } },
  shape: { control: { type: "inline-radio" }, options: avatarGroupShapeOptions },
} as const;

const meta = {
  title: "Atoms/AvatarGroup",
  component: AvatarGroup,
  args: {
    alignment: "tile",
    count: "1",
    liveTag: true,
    shape: "squircle",
  },
  argTypes,
  parameters: {
    controls: { include: [...figmaControlNames] },
    docs: {
      description: {
        component:
          "Figma node 73587:6404 기반 Avatar Group입니다. Live variants only: Circle Tile/Horizontal Count 1..5+ and Squircle Tile Count 1.",
      },
    },
  },
} satisfies Meta<typeof AvatarGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div style={{ alignItems: "flex-start", display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ alignItems: "center", display: "flex", gap: 16 }}>
        {avatarGroupVariantOptions.slice(0, 5).map((variant) => {
          const [, , count] = variant.split("-");
          return <AvatarGroup {...args} count={count as typeof args.count} key={variant} shape="circle" alignment="tile" />;
        })}
      </div>
      <div style={{ alignItems: "center", display: "flex", gap: 16 }}>
        {avatarGroupVariantOptions.slice(5, 10).map((variant) => {
          const [, , count] = variant.split("-");
          return <AvatarGroup {...args} count={count as typeof args.count} key={variant} shape="circle" alignment="horizontal" />;
        })}
      </div>
      <AvatarGroup {...args} shape="squircle" alignment="tile" count="1" />
    </div>
  ),
};

export const LiveTag: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div style={{ alignItems: "center", display: "flex", gap: 16 }}>
      <AvatarGroup {...args} liveTag />
      <AvatarGroup {...args} liveTag={false} />
    </div>
  ),
};

export const FigmaCompare: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div style={{ alignItems: "flex-start", display: "flex", gap: 24 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <span style={{ color: "#777", fontFamily: "monospace", fontSize: 11, fontWeight: 700 }}>Figma</span>
        <img alt="Figma Avatar Group default" src={avatarGroupBaseline} style={{ display: "block", height: 46, width: 38 }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <span style={{ color: "#777", fontFamily: "monospace", fontSize: 11, fontWeight: 700 }}>Implementation</span>
        <AvatarGroup {...args} shape="squircle" alignment="tile" count="1" liveTag />
      </div>
    </div>
  ),
};
