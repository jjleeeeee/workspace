import type { Meta, StoryObj } from "@storybook/react";
import { Skeleton } from "./Skeleton";
import "./Skeleton.css";

const skeletonBaseline = new URL("../../figma/baselines/skeleton-default@3x.png", import.meta.url).href;
const figmaControlNames = ["mode", "size", "skeletonType"] as const;

const argTypes = {
  mode: { control: { type: "inline-radio" }, options: ["default", "fixed"] },
  size: { control: { type: "inline-radio" }, options: ["large", "medium"] },
  skeletonType: { control: { type: "inline-radio" }, options: ["rectangle", "line", "circle"] },
} as const;

const meta = {
  title: "Atoms/Skeleton",
  component: Skeleton,
  args: {
    mode: "default",
    size: "large",
    skeletonType: "rectangle",
  },
  argTypes,
  parameters: {
    controls: { include: [...figmaControlNames] },
    docs: {
      description: {
        component: "Figma node 12447:42302 기반 Skeleton입니다. Source note: src/figma/skeleton.source.md.",
      },
    },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 20 }}>
      {(["default", "fixed"] as const).map((mode) => (
        <div key={mode} style={{ alignItems: "center", display: "flex", gap: 16 }}>
          {(["rectangle", "line", "circle"] as const).map((skeletonType) =>
            (["large", "medium"] as const).map((size) => (
              <Skeleton
                {...args}
                key={`${mode}-${skeletonType}-${size}`}
                mode={mode}
                size={size}
                skeletonType={skeletonType}
              />
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
    <div style={{ display: "grid", gap: 16 }}>
      <img
        alt="Figma Skeleton reference"
        src={skeletonBaseline}
        style={{ height: 200, objectFit: "contain", objectPosition: "left", width: 355 }}
      />
      <Skeleton {...args} mode="default" size="large" skeletonType="rectangle" />
    </div>
  ),
};
