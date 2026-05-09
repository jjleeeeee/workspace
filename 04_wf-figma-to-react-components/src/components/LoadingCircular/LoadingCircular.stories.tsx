import type { Meta, StoryObj } from "@storybook/react";
import { LoadingCircular } from "./LoadingCircular";
import "./LoadingCircular.css";

const loadingCircularBaseline = new URL("../../figma/baselines/loading-circular-default@3x.png", import.meta.url).href;
const figmaControlNames = ["mode"] as const;

const argTypes = {
  mode: { control: { type: "inline-radio" }, options: ["default", "fixed"] },
} as const;

const meta = {
  title: "Atoms/LoadingCircular",
  component: LoadingCircular,
  args: {
    animated: false,
    mode: "default",
  },
  argTypes,
  parameters: {
    controls: { include: [...figmaControlNames] },
    docs: {
      description: {
        component:
          "Figma node 10384:29888 기반 LoadingCircular입니다. Motion timing/Lottie asset은 source note의 Known Gaps에 기록되어 있습니다.",
      },
    },
  },
} satisfies Meta<typeof LoadingCircular>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={{ alignItems: "center", display: "flex", gap: 20 }}>
      <div style={{ background: "#111", padding: 8 }}>
        <LoadingCircular {...args} mode="default" />
      </div>
      <div style={{ background: "#111", padding: 8 }}>
        <LoadingCircular {...args} mode="fixed" />
      </div>
    </div>
  ),
};

export const States: Story = {
  render: (args) => (
    <div style={{ alignItems: "center", display: "flex", gap: 20 }}>
      <LoadingCircular {...args} animated={false} />
      <LoadingCircular {...args} animated />
    </div>
  ),
};

export const FigmaCompare: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div style={{ display: "grid", gap: 12 }}>
      <img
        alt="Figma LoadingCircular reference"
        src={loadingCircularBaseline}
        style={{ height: 20, objectFit: "contain", objectPosition: "left", width: 20 }}
      />
      <LoadingCircular {...args} animated={false} mode="default" />
    </div>
  ),
};
