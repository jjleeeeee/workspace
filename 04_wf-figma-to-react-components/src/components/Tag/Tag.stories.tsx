import type { Meta, StoryObj } from "@storybook/react";
import { Tag } from "./Tag";
import type { TagColor, TagShape, TagSize, TagType } from "./Tag";
import "./Tag.css";

const tagBaseline = new URL("../../figma/baselines/tag-default@3x.png", import.meta.url).href;
const figmaControlNames = ["color", "label", "shape", "showIcon", "size", "tagType"] as const;

const sizeOptions: TagSize[] = ["small", "medium"];
const tagTypeOptions: TagType[] = ["line", "fill"];
const shapeOptions: TagShape[] = ["squircle", "round"];
const colorOptions: TagColor[] = [
  "primary",
  "secondary-blue",
  "secondary-green",
  "secondary-purple",
  "secondary-pink",
  "gray",
  "white",
  "red",
  "membership-malachite-green",
  "membership-lavender",
  "membership-cornflower-blue",
  "live-red",
];

const argTypes = {
  color: { control: { type: "select" }, options: colorOptions },
  label: { control: { type: "text" } },
  shape: { control: { type: "inline-radio" }, options: shapeOptions },
  showIcon: { control: { type: "boolean" } },
  size: { control: { type: "inline-radio" }, options: sizeOptions },
  tagType: { control: { type: "inline-radio" }, options: tagTypeOptions },
} as const;

const meta = {
  title: "Atoms/Tag",
  component: Tag,
  args: {
    color: "primary",
    label: "Text",
    shape: "squircle",
    showIcon: true,
    size: "small",
    tagType: "line",
  },
  argTypes,
  parameters: {
    controls: { include: [...figmaControlNames] },
    docs: {
      description: {
        component:
          "Figma node 30256:32826 기반 Tag입니다. Source note: src/figma/tag.source.md. The leading icon frame is 10x10; the default null marker is not a production icon asset.",
      },
    },
  },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={{ alignItems: "flex-start", display: "grid", gap: 16 }}>
      {tagTypeOptions.map((tagType) => (
        <div key={tagType} style={{ alignItems: "center", display: "flex", flexWrap: "wrap", gap: 8 }}>
          {colorOptions
            .filter((color) => color !== "live-red")
            .map((color) => (
              <Tag {...args} color={color} key={`${tagType}-${color}`} tagType={tagType} />
            ))}
        </div>
      ))}
      <div style={{ alignItems: "center", display: "flex", flexWrap: "wrap", gap: 8 }}>
        {sizeOptions.map((size) =>
          shapeOptions.map((shape) => <Tag {...args} key={`${size}-${shape}`} shape={shape} size={size} />),
        )}
      </div>
    </div>
  ),
};

export const States: Story = {
  render: (args) => (
    <div style={{ alignItems: "center", display: "flex", flexWrap: "wrap", gap: 12 }}>
      <Tag {...args} />
      <Tag {...args} showIcon={false} label="No icon" />
      <Tag {...args} size="medium" label="Medium" />
      <Tag {...args} tagType="fill" label="Fill" />
      <Tag {...args} color="live-red" label="LIVE" />
    </div>
  ),
};

export const FigmaCompare: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div style={{ display: "grid", gap: 12 }}>
      <img
        alt="Figma Tag reference"
        src={tagBaseline}
        style={{ height: 16, objectFit: "contain", objectPosition: "left", width: 41 }}
      />
      <Tag {...args} color="primary" label="Text" shape="squircle" showIcon size="small" tagType="line" />
      <span style={{ color: "#777", fontSize: 12 }}>
        Leading icon frame is 10x10. The red null marker preserves the Figma null marker, but it is not a
        production-complete product icon.
      </span>
    </div>
  ),
};
