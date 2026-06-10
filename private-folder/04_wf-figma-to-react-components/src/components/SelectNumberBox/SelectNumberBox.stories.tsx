import type { Meta, StoryObj } from "@storybook/react";
import { SelectNumberBox } from "./SelectNumberBox";
import "./SelectNumberBox.css";

const selectNumberBoxBaseline = new URL("../../figma/baselines/select-number-box-default@3x.png", import.meta.url).href;
const figmaControlNames = ["mode", "state", "value"] as const;

const argTypes = {
  mode: { control: { type: "inline-radio" }, options: ["default", "fixed"] },
  state: { control: { type: "inline-radio" }, options: ["selected", "selected-99-plus", "unselected"] },
  value: { control: { type: "number", min: 1, max: 120, step: 1 } },
} as const;

const meta = {
  title: "Atoms/SelectNumberBox",
  component: SelectNumberBox,
  args: {
    mode: "default",
    state: "selected",
    value: 99,
  },
  argTypes,
  parameters: {
    controls: { include: [...figmaControlNames] },
    docs: {
      description: {
        component: "Figma node 12436:362 기반 SelectNumberBox입니다. Source note: src/figma/select-number-box.source.md.",
      },
    },
  },
} satisfies Meta<typeof SelectNumberBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={{ alignItems: "center", display: "flex", gap: 16 }}>
      <SelectNumberBox {...args} mode="default" state="selected" value={12} />
      <SelectNumberBox {...args} mode="default" state="selected-99-plus" value={100} />
      <SelectNumberBox {...args} mode="default" state="unselected" />
      <SelectNumberBox {...args} mode="fixed" state="selected" value={12} />
      <SelectNumberBox {...args} mode="fixed" state="selected-99-plus" value={100} />
      <SelectNumberBox {...args} mode="fixed" state="unselected" />
    </div>
  ),
};

export const States: Story = {
  render: (args) => (
    <div style={{ alignItems: "center", display: "flex", gap: 16 }}>
      <SelectNumberBox {...args} value={1} />
      <SelectNumberBox {...args} value={99} />
      <SelectNumberBox {...args} value={100} />
      <SelectNumberBox {...args} state="unselected" />
    </div>
  ),
};

export const FigmaCompare: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div style={{ display: "grid", gap: 12 }}>
      <img
        alt="Figma SelectNumberBox reference"
        src={selectNumberBoxBaseline}
        style={{ height: 24, objectFit: "contain", objectPosition: "left", width: 24 }}
      />
      <SelectNumberBox {...args} mode="default" state="selected" value={99} />
    </div>
  ),
};
