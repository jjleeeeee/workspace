import type { Meta, StoryObj } from "@storybook/react";
import { getChordComponent } from "../../figma/chord-components";
import { ComponentMatrix } from "../../harness/ComponentMatrix";
import { componentContracts, createStoryArgTypes } from "../../harness/component-contract";
import { ToggleSwitch, type ToggleSwitchProps } from "./ToggleSwitch";

const manifest = getChordComponent("toggle-switch");

const meta = {
  title: "Atoms/ToggleSwitch",
  component: ToggleSwitch,
  args: {
    "aria-label": "Notifications",
    mode: "default",
    os: "ios",
    size: "medium",
    status: "off",
  },
  argTypes: createStoryArgTypes(componentContracts.toggleSwitch),
  parameters: { docs: { description: { component: manifest?.description } } },
} satisfies Meta<typeof ToggleSwitch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: (args) => (
    <ComponentMatrix<ToggleSwitchProps>
      axes={[
        { prop: "status", label: "Status", values: ["off", "on", "disabled"] },
        { prop: "os", label: "OS", values: ["ios", "aos"] },
      ]}
      baseArgs={args}
      component={ToggleSwitch}
      title="ToggleSwitch status x OS"
    />
  ),
};
