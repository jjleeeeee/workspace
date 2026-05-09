import type { Meta, StoryObj } from "@storybook/react";
import { getChordComponent } from "../../figma/chord-components";
import { ComponentMatrix } from "../../harness/ComponentMatrix";
import { componentContracts, createStoryArgTypes } from "../../harness/component-contract";
import { LinearProgressIndicator, type LinearProgressIndicatorProps } from "./LinearProgressIndicator";

const manifest = getChordComponent("linear-progress-indicator");

const meta = {
  title: "Atoms/LinearProgressIndicator",
  component: LinearProgressIndicator,
  args: { height: "4", mode: "default", rounded: "on", value: 48, "aria-label": "Progress" },
  argTypes: createStoryArgTypes(componentContracts.linearProgressIndicator),
  decorators: [(Story) => <div style={{ width: 320 }}><Story /></div>],
  parameters: { docs: { description: { component: manifest?.description } } },
} satisfies Meta<typeof LinearProgressIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Matrix: Story = {
  render: (args) => (
    <ComponentMatrix<LinearProgressIndicatorProps>
      axes={[
        { prop: "height", label: "Height", values: ["2", "4"] },
        { prop: "rounded", label: "Rounded", values: ["on", "off"] },
      ]}
      baseArgs={args}
      component={LinearProgressIndicator}
      title="LinearProgressIndicator height x rounded"
    />
  ),
};
