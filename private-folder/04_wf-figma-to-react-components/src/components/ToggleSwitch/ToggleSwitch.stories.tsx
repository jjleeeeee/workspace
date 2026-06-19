import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ToggleSwitch } from "./ToggleSwitch";
import "./ToggleSwitch.css";

const toggleBaseline = new URL("../../figma/baselines/toggle-switch-default@3x.png", import.meta.url).href;
const figmaControlNames = ["mode", "platform", "size", "status"] as const;

const argTypes = {
  mode: { control: { type: "inline-radio" }, options: ["default", "fixed"] },
  platform: { control: { type: "inline-radio" }, options: ["ios", "aos"] },
  size: { control: { type: "inline-radio" }, options: ["medium", "small"] },
  status: { control: { type: "inline-radio" }, options: ["default", "enabled", "disabled"] },
} as const;

const meta = {
  title: "Atoms/ToggleSwitch",
  component: ToggleSwitch,
  args: {
    "aria-label": "설정",
    mode: "default",
    platform: "ios",
    size: "medium",
    status: "default",
  },
  argTypes,
  parameters: {
    controls: { include: [...figmaControlNames] },
    docs: {
      description: {
        component: "Figma node 7927:149092 기반 ToggleSwitch입니다. Source note: src/figma/toggle-switch.source.md.",
      },
    },
  },
} satisfies Meta<typeof ToggleSwitch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: function Render(args) {
    const [checked, setChecked] = useState(false);
    return <ToggleSwitch {...args} checked={checked} status={undefined} onClick={() => setChecked((v) => !v)} />;
  },
};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 16 }}>
      {(["ios", "aos"] as const).map((platform) =>
        (["medium", "small"] as const).map((size) => (
          <div key={`${platform}-${size}`} style={{ alignItems: "center", display: "flex", gap: 12 }}>
            {(["default", "enabled", "disabled"] as const).map((status) => (
              <ToggleSwitch {...args} key={`${platform}-${size}-${status}`} platform={platform} size={size} status={status} />
            ))}
          </div>
        )),
      )}
    </div>
  ),
};

export const States: Story = {
  render: (args) => (
    <div style={{ alignItems: "center", display: "flex", gap: 12 }}>
      <ToggleSwitch {...args} checked={false} status={undefined} />
      <ToggleSwitch {...args} checked status={undefined} />
      <ToggleSwitch {...args} disabled status={undefined} />
    </div>
  ),
};

export const FigmaCompare: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div style={{ display: "grid", gap: 12 }}>
      <img
        alt="Figma ToggleSwitch reference"
        src={toggleBaseline}
        style={{ height: 32, objectFit: "contain", objectPosition: "left", width: 52 }}
      />
      <ToggleSwitch {...args} mode="default" platform="ios" size="medium" status="default" />
    </div>
  ),
};
