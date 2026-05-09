import type { Meta, StoryObj } from "@storybook/react";
import { getChordComponent } from "../../figma/chord-components";
import { ComponentMatrix } from "../../harness/ComponentMatrix";
import { componentContracts, createStoryArgTypes } from "../../harness/component-contract";
import { CircularProgressIndicator, type CircularProgressIndicatorProps } from "./CircularProgressIndicator";

const manifest = getChordComponent("circular-progress-indicator");

const meta = {
  title: "Atoms/CircularProgressIndicator",
  component: CircularProgressIndicator,
  args: { mode: "default", value: 64, "aria-label": "Progress" },
  argTypes: createStoryArgTypes(componentContracts.circularProgressIndicator),
  parameters: { docs: { description: { component: manifest?.description } } },
} satisfies Meta<typeof CircularProgressIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Modes: Story = {
  render: (args) => (
    <ComponentMatrix<CircularProgressIndicatorProps>
      axes={[{ prop: "mode", label: "Mode", values: ["default", "fixed"] }]}
      baseArgs={args}
      component={CircularProgressIndicator}
      title="CircularProgressIndicator modes"
    />
  ),
};
