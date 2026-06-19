import type { Meta, StoryObj } from "@storybook/react";
import { ScrimOverlay, scrimOverlayColorOptions } from "./ScrimOverlay";
import "./ScrimOverlay.css";

const scrimBaseline = new URL("../../figma/baselines/scrim-overlay-default@3x.png", import.meta.url).href;

const meta = {
  title: "Atoms/ScrimOverlay",
  component: ScrimOverlay,
  args: { color: "50" },
  argTypes: {
    color: { control: { type: "inline-radio" }, options: scrimOverlayColorOptions },
  },
  parameters: {
    controls: { include: ["color"] },
    docs: {
      description: {
        component: "Figma node 89156:56593 기반 ScrimOverlay입니다. Source note: src/figma/scrim-overlay.source.md. Color=50%는 light dim, Color=80%는 heavy dim 용도.",
      },
    },
  },
} satisfies Meta<typeof ScrimOverlay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 12 }}>
      {scrimOverlayColorOptions.map((color) => (
        <div key={color} style={{ height: 180, overflow: "hidden", position: "relative", width: 160 }}>
          <div style={{ background: "linear-gradient(135deg, #cde, #ffd)", height: "100%", width: "100%" }} />
          <ScrimOverlay {...args} color={color} fullCover />
          <span style={{ bottom: 8, color: "#fff", fontSize: 12, left: 8, position: "absolute" }}>{color}%</span>
        </div>
      ))}
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
