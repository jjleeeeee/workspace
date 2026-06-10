import type { Meta, StoryObj } from "@storybook/react";
import { Thumbnail } from "./Thumbnail";
import {
  thumbnailButtonTypeOptions,
  thumbnailLeftItemTypeOptions,
  thumbnailRightItemBottomTypeOptions,
  thumbnailRightItemTopTypeOptions,
} from "./Thumbnail";
import type { ThumbnailRadius, ThumbnailRatio } from "./Thumbnail";
import "./Thumbnail.css";

const thumbnailBaseline = new URL("../../figma/baselines/thumbnail-default.png", import.meta.url).href;

const figmaControlNames = [
  "button",
  "buttonType",
  "fill",
  "leftItem",
  "leftItemShowTag",
  "leftItemType",
  "radius",
  "ratio",
  "rightItemBottom",
  "rightItemBottomShowIcon",
  "rightItemBottomType",
  "rightItemTop",
  "rightItemTopType",
  "seekBar",
] as const;
const ratioOptions: ThumbnailRatio[] = ["1:1", "3:4", "5:6", "5:8", "9:16", "16:9"];
const radiusOptions: ThumbnailRadius[] = ["off", "on"];

const argTypes = {
  button: { control: { type: "boolean" } },
  buttonType: { control: { type: "inline-radio" }, options: thumbnailButtonTypeOptions },
  fill: { control: { type: "boolean" } },
  leftItem: { control: { type: "boolean" } },
  leftItemShowTag: { control: { type: "boolean" } },
  leftItemType: { control: { type: "inline-radio" }, options: thumbnailLeftItemTypeOptions },
  radius: { control: { type: "inline-radio" }, options: radiusOptions },
  ratio: { control: { type: "select" }, options: ratioOptions },
  rightItemBottom: { control: { type: "boolean" } },
  rightItemBottomShowIcon: { control: { type: "boolean" } },
  rightItemBottomType: { control: { type: "select" }, options: thumbnailRightItemBottomTypeOptions },
  rightItemTop: { control: { type: "boolean" } },
  rightItemTopType: { control: { type: "inline-radio" }, options: thumbnailRightItemTopTypeOptions },
  seekBar: { control: { type: "boolean" } },
} as const;

const meta = {
  title: "Atoms/Thumbnail",
  component: Thumbnail,
  args: {
    button: false,
    buttonType: "play",
    fill: false,
    leftItem: false,
    leftItemShowTag: true,
    leftItemType: "double-icon",
    radius: "off",
    ratio: "1:1",
    rightItemBottom: false,
    rightItemBottomShowIcon: false,
    rightItemBottomType: "text-large",
    rightItemTop: false,
    rightItemTopType: "double-icon",
    seekBar: false,
    width: 256,
  },
  argTypes,
  parameters: {
    controls: { include: [...figmaControlNames] },
    docs: {
      description: {
        component:
          "Figma node 50545:51014 기반 Thumbnail입니다. 기본 no-image 상태는 node 63529:131799의 Figma placeholder asset을 사용합니다. Source note: src/figma/thumbnail.source.md.",
      },
    },
  },
} satisfies Meta<typeof Thumbnail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const VisualDefault: Story = {
  args: { radius: "off", ratio: "1:1", width: 256 },
  parameters: { controls: { disable: true } },
};

export const Ratios: Story = {
  render: (args) => (
    <div style={{ alignItems: "start", display: "flex", flexWrap: "wrap", gap: 20 }}>
      {ratioOptions.map((ratio) => (
        <Thumbnail {...args} key={ratio} ratio={ratio} />
      ))}
    </div>
  ),
};

export const OverlayModules: Story = {
  render: (args) => (
    <div style={{ alignItems: "start", display: "flex", flexWrap: "wrap", gap: 20 }}>
      <Thumbnail {...args} fill />
      <Thumbnail {...args} button fill />
      <Thumbnail {...args} leftItem />
      <Thumbnail {...args} rightItemTop />
      <Thumbnail {...args} rightBottomLabel="03:21" rightItemBottom />
      <Thumbnail {...args} seekBar seekProgress={42} />
    </div>
  ),
};

export const NestedEnums: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div style={{ alignItems: "start", display: "grid", gap: 24 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        <Thumbnail {...args} leftItem leftItemType="double-icon" />
        <Thumbnail {...args} leftItem leftItemType="single-icon" />
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        <Thumbnail {...args} rightItemTop rightItemTopType="double-icon" />
        <Thumbnail {...args} rightItemTop rightItemTopType="single-icon" />
        <Thumbnail {...args} rightItemTop rightItemTopType="checkbox" />
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        <Thumbnail {...args} rightBottomLabel="99+" rightItemBottom rightItemBottomType="text-large" />
        <Thumbnail {...args} rightBottomLabel="99+" rightItemBottom rightItemBottomType="text-small" />
        <Thumbnail {...args} rightBottomLabel="00:00:00" rightItemBottom rightItemBottomType="timer-large" />
        <Thumbnail {...args} rightBottomLabel="00:00:00" rightItemBottom rightItemBottomType="timer-small" />
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        <Thumbnail {...args} button buttonType="play" />
        <Thumbnail {...args} button buttonText="+5" buttonType="text" />
      </div>
    </div>
  ),
};

export const FigmaCompare: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div className="chord-thumbnail-figma-compare">
      <div style={{ display: "grid", gap: 8 }}>
        <span style={{ color: "#666", fontSize: 12, fontWeight: 700 }}>Figma reference: 60779:56301</span>
        <img
          alt="Figma Thumbnail reference"
          src={thumbnailBaseline}
          style={{ display: "block", height: 256, objectFit: "contain", objectPosition: "left top", width: 256 }}
        />
      </div>
      <div style={{ display: "grid", gap: 8 }}>
        <span style={{ color: "#666", fontSize: 12, fontWeight: 700 }}>Current implementation</span>
        <Thumbnail {...args} radius="on" ratio="1:1" width={256} />
      </div>
      <span style={{ color: "#777", fontSize: 12 }}>
        Manual review only. Automated pixel diff remains unregistered until the reference image policy is decided for
        consumer media content.
      </span>
    </div>
  ),
};
