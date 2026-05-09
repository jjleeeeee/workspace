import type { Meta, StoryObj } from "@storybook/react";
import { getChordComponent } from "../../figma/chord-components";
import { ComponentMatrix } from "../../harness/ComponentMatrix";
import { componentContracts, createStoryArgTypes } from "../../harness/component-contract";
import { LoadingCircular, type LoadingCircularProps } from "./LoadingCircular";

const manifest = getChordComponent("loading-circular");

const meta = {
  title: "Atoms/LoadingCircular",
  component: LoadingCircular,
  args: { mode: "default", "aria-label": "Loading" },
  argTypes: createStoryArgTypes(componentContracts.loadingCircular),
  parameters: { docs: { description: { component: manifest?.description } } },
} satisfies Meta<typeof LoadingCircular>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Modes: Story = {
  render: (args) => (
    <ComponentMatrix<LoadingCircularProps>
      axes={[{ prop: "mode", label: "Mode", values: ["default", "fixed"] }]}
      baseArgs={args}
      component={LoadingCircular}
      title="LoadingCircular modes"
    />
  ),
};
