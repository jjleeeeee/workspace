import type { Meta, StoryObj } from "@storybook/react";
import { ScrimOverlay } from "./ScrimOverlay";
import "./ScrimOverlay.css";

const scrimBaseline = new URL("../../figma/baselines/scrim-overlay-default@3x.png", import.meta.url).href;

const meta = {
  title: "Atoms/ScrimOverlay",
  component: ScrimOverlay,
  args: {},
  argTypes: {},
  parameters: {
    controls: { include: [] },
    docs: {
      description: {
        component: "Figma node 10482:75325 기반 ScrimOverlay입니다. Source note: src/figma/scrim-overlay.source.md.",
      },
    },
  },
} satisfies Meta<typeof ScrimOverlay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={{ height: 180, overflow: "hidden", width: 220 }}>
      <ScrimOverlay {...args} style={{ height: 180, width: 220 }} />
    </div>
  ),
};

export const States: Story = {
  render: (args) => (
    <div style={{ background: "linear-gradient(135deg, #f4f4f4, #9dd)", height: 220, position: "relative", width: 220 }}>
      <ScrimOverlay {...args} fullCover />
    </div>
  ),
};

export const FigmaCompare: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div style={{ display: "grid", gap: 12 }}>
      <img
        alt="Figma ScrimOverlay reference"
        src={scrimBaseline}
        style={{ height: 852, objectFit: "contain", objectPosition: "left", width: 393 }}
      />
      <ScrimOverlay {...args} />
    </div>
  ),
};
