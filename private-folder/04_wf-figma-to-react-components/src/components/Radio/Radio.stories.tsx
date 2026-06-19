import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Radio } from "./Radio";
import "./Radio.css";

const radioBaseline = new URL("../../figma/baselines/radio-default@3x.png", import.meta.url).href;
const figmaControlNames = ["mode", "status"] as const;

const argTypes = {
  mode: { control: { type: "inline-radio" }, options: ["default", "fixed"] },
  status: { control: { type: "inline-radio" }, options: ["default", "enabled", "disabled"] },
} as const;

const meta = {
  title: "Atoms/Radio",
  component: Radio,
  args: {
    "aria-label": "선택",
    mode: "default",
    status: "default",
  },
  argTypes,
  parameters: {
    controls: { include: [...figmaControlNames] },
    docs: {
      description: {
        component: "Figma node 59215:200965 기반 Radio입니다. Source note: src/figma/radio.source.md.",
      },
    },
  },
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: function Render(args) {
    const [checked, setChecked] = useState(false);
    return <Radio {...args} checked={checked} status={undefined} onClick={() => setChecked((v) => !v)} />;
  },
};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 16 }}>
      {(["default", "fixed"] as const).map((mode) => (
        <div key={mode} style={{ alignItems: "center", display: "flex", gap: 12 }}>
          {(["default", "enabled", "disabled"] as const).map((status) => (
            <Radio {...args} key={`${mode}-${status}`} mode={mode} status={status} />
          ))}
        </div>
      ))}
    </div>
  ),
};

export const States: Story = {
  render: (args) => (
    <div style={{ alignItems: "center", display: "flex", gap: 12 }}>
      <Radio {...args} checked={false} status={undefined} />
      <Radio {...args} checked status={undefined} />
      <Radio {...args} disabled status={undefined} />
    </div>
  ),
};

export const FigmaCompare: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div style={{ display: "grid", gap: 12 }}>
      <img
        alt="Figma Radio reference"
        src={radioBaseline}
        style={{ height: 24, objectFit: "contain", objectPosition: "left", width: 24 }}
      />
      <Radio {...args} mode="default" status="default" />
    </div>
  ),
};
