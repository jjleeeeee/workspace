import type { Meta, StoryObj } from "@storybook/react";
import { getChordComponent } from "../../figma/chord-components";
import { componentContracts, createStoryArgTypes } from "../../harness/component-contract";
import { ScrimOverlay } from "./ScrimOverlay";

const manifest = getChordComponent("scrim-overlay");

const meta = {
  title: "Atoms/ScrimOverlay",
  component: ScrimOverlay,
  args: { opacity: 0.6, "aria-label": "Scrim overlay" },
  argTypes: createStoryArgTypes(componentContracts.scrimOverlay),
  decorators: [(Story) => <div style={{ width: 280, height: 160 }}><Story /></div>],
  parameters: { docs: { description: { component: manifest?.description } } },
} satisfies Meta<typeof ScrimOverlay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Opacities: Story = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 160px)", gap: 12 }}>
      {[0.3, 0.6, 0.8].map((opacity) => (
        <div key={opacity} style={{ display: "grid", gap: 8 }}>
          <ScrimOverlay aria-label={`Scrim ${opacity}`} opacity={opacity} />
          <span style={{ fontSize: 12 }}>{opacity}</span>
        </div>
      ))}
    </div>
  ),
};
