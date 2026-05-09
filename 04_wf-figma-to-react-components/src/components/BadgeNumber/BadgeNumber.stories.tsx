import type { Meta, StoryObj } from "@storybook/react";
import { BadgeNumber } from "./BadgeNumber";
import "./BadgeNumber.css";

const badgeNumberBaseline = new URL("../../figma/baselines/badge-number-default@3x.png", import.meta.url).href;
const figmaControlNames = ["badgeType", "label", "mode"] as const;

const argTypes = {
  badgeType: { control: { type: "inline-radio" }, options: ["number", "new"] },
  label: { control: { type: "text" } },
  mode: { control: { type: "inline-radio" }, options: ["default", "fixed"] },
} as const;

const meta = {
  title: "Atoms/BadgeNumber",
  component: BadgeNumber,
  args: {
    badgeType: "number",
    label: "999+",
    mode: "default",
  },
  argTypes,
  parameters: {
    controls: { include: [...figmaControlNames] },
    docs: {
      description: {
        component: "Figma node 8451:113030 기반 BadgeNumber입니다. Source note: src/figma/badge-number.source.md.",
      },
    },
  },
} satisfies Meta<typeof BadgeNumber>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={{ alignItems: "center", display: "flex", gap: 12 }}>
      {(["default", "fixed"] as const).map((mode) =>
        (["number", "new"] as const).map((badgeType) => (
          <BadgeNumber {...args} badgeType={badgeType} key={`${mode}-${badgeType}`} mode={mode} />
        )),
      )}
    </div>
  ),
};

export const States: Story = {
  render: (args) => (
    <div style={{ alignItems: "center", display: "flex", gap: 12 }}>
      {(["1", "12", "999+", "12345"] as const).map((label) => (
        <BadgeNumber {...args} badgeType="number" key={label} label={label} />
      ))}
      <BadgeNumber {...args} badgeType="new" />
    </div>
  ),
};

export const FigmaCompare: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div style={{ display: "grid", gap: 12 }}>
      <img
        alt="Figma BadgeNumber reference"
        src={badgeNumberBaseline}
        style={{ height: 16, objectFit: "contain", objectPosition: "left", width: 39 }}
      />
      <BadgeNumber {...args} badgeType="number" label="999+" mode="default" />
    </div>
  ),
};
