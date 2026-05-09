import type { Meta, StoryObj } from "@storybook/react";
import { getChordComponent } from "../../figma/chord-components";
import { ComponentMatrix } from "../../harness/ComponentMatrix";
import { componentContracts, createStoryArgTypes } from "../../harness/component-contract";
import { Checkbox, type CheckboxProps } from "./Checkbox";

const manifest = getChordComponent("checkbox");

const meta = {
  title: "Atoms/Checkbox",
  component: Checkbox,
  args: {
    "aria-label": "Agree",
    mode: "default",
    shape: "circle",
    status: "default",
  },
  argTypes: createStoryArgTypes(componentContracts.checkbox),
  parameters: { docs: { description: { component: manifest?.description } } },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: (args) => (
    <ComponentMatrix<CheckboxProps>
      axes={[
        { prop: "shape", label: "Type", values: ["circle", "square"] },
        { prop: "status", label: "Status", values: ["default", "enabled", "disabled"] },
      ]}
      baseArgs={args}
      component={Checkbox}
      title="Checkbox type x status"
    />
  ),
};
