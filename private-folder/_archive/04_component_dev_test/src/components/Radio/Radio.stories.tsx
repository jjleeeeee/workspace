import type { Meta, StoryObj } from "@storybook/react";
import { getChordComponent } from "../../figma/chord-components";
import { ComponentMatrix } from "../../harness/ComponentMatrix";
import { componentContracts, createStoryArgTypes } from "../../harness/component-contract";
import { Radio, type RadioProps } from "./Radio";

const manifest = getChordComponent("radio");

const meta = {
  title: "Atoms/Radio",
  component: Radio,
  args: {
    "aria-label": "Selected option",
    mode: "default",
    status: "default",
  },
  argTypes: createStoryArgTypes(componentContracts.radio),
  parameters: { docs: { description: { component: manifest?.description } } },
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: (args) => (
    <ComponentMatrix<RadioProps>
      axes={[
        { prop: "status", label: "Status", values: ["default", "enabled", "disabled"] },
        { prop: "mode", label: "Mode", values: ["default", "fixed"] },
      ]}
      baseArgs={args}
      component={Radio}
      title="Radio status x mode"
    />
  ),
};
