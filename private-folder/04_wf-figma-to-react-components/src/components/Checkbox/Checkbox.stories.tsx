import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "./Checkbox";
import "./Checkbox.css";

const checkboxBaseline = new URL("../../figma/baselines/checkbox-default@3x.png", import.meta.url).href;
const figmaControlNames = ["mode", "checkboxType", "status"] as const;

const argTypes = {
  checkboxType: { control: { type: "inline-radio" }, options: ["circle", "square"] },
  mode: { control: { type: "inline-radio" }, options: ["default", "fixed"] },
  status: { control: { type: "inline-radio" }, options: ["default", "enabled", "disabled"] },
} as const;

const meta = {
  title: "Atoms/Checkbox",
  component: Checkbox,
  args: {
    "aria-label": "선택",
    checkboxType: "circle",
    mode: "default",
    status: "default",
  },
  argTypes,
  parameters: {
    controls: { include: [...figmaControlNames] },
    docs: {
      description: {
        component: "Figma node 60365:40276 기반 Checkbox입니다. Source note: src/figma/checkbox.source.md.",
      },
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: function Render(args) {
    const [checked, setChecked] = useState(false);
    return <Checkbox {...args} checked={checked} status={undefined} onClick={() => setChecked((v) => !v)} />;
  },
};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 16 }}>
      {(["circle", "square"] as const).map((checkboxType) => (
        <div key={checkboxType} style={{ alignItems: "center", display: "flex", gap: 12 }}>
          {(["default", "enabled", "disabled"] as const).map((status) => (
            <Checkbox {...args} key={`${checkboxType}-${status}`} checkboxType={checkboxType} status={status} />
          ))}
        </div>
      ))}
    </div>
  ),
};

export const States: Story = {
  render: (args) => (
    <div style={{ alignItems: "center", display: "flex", gap: 12 }}>
      <Checkbox {...args} checked={false} status={undefined} />
      <Checkbox {...args} checked status={undefined} />
      <Checkbox {...args} disabled status={undefined} />
    </div>
  ),
};

export const FigmaCompare: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div style={{ display: "grid", gap: 12 }}>
      <img
        alt="Figma Checkbox reference"
        src={checkboxBaseline}
        style={{ height: 24, objectFit: "contain", objectPosition: "left", width: 24 }}
      />
      <Checkbox {...args} checkboxType="circle" mode="default" status="default" />
    </div>
  ),
};
