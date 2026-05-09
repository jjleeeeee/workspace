import type { Meta, StoryObj } from "@storybook/react";
import { getChordComponent } from "../../figma/chord-components";
import { ComponentMatrix } from "../../harness/ComponentMatrix";
import { componentContracts, createStoryArgTypes } from "../../harness/component-contract";
import { SelectNumberBox, type SelectNumberBoxProps } from "./SelectNumberBox";

const manifest = getChordComponent("select-number-box");

const meta = {
  title: "Atoms/SelectNumberBox",
  component: SelectNumberBox,
  args: { mode: "default", state: "default", value: 3, "aria-label": "Selection order" },
  argTypes: createStoryArgTypes(componentContracts.selectNumberBox),
  parameters: { docs: { description: { component: manifest?.description } } },
} satisfies Meta<typeof SelectNumberBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: (args) => (
    <ComponentMatrix<SelectNumberBoxProps>
      axes={[
        { prop: "state", label: "State", values: ["default", "selected", "over"] },
        { prop: "mode", label: "Mode", values: ["default", "fixed"] },
      ]}
      baseArgs={args}
      component={SelectNumberBox}
      title="SelectNumberBox state x mode"
    />
  ),
};
