import type { Meta, StoryObj } from "@storybook/react";
import { getChordComponent } from "../../figma/chord-components";
import { ComponentMatrix } from "../../harness/ComponentMatrix";
import { componentContracts, createStoryArgTypes } from "../../harness/component-contract";
import { IconButton, type IconButtonProps } from "./IconButton";

const manifest = getChordComponent("icon-button");

const meta = {
  title: "Atoms/IconButton",
  component: IconButton,
  args: {
    "aria-label": "More actions",
    buttonColor: "default",
    mode: "default",
    radius: "off",
    size: "medium",
    state: "default",
    variant: "filled",
  },
  argTypes: createStoryArgTypes(componentContracts.iconButton),
  parameters: { docs: { description: { component: manifest?.description } } },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Matrix: Story = {
  render: (args) => (
    <ComponentMatrix<IconButtonProps>
      axes={[
        { prop: "size", label: "Size", values: ["xlarge", "medium", "small", "xxsmall"] },
        { prop: "variant", label: "Type", values: ["filled", "outlined"] },
      ]}
      baseArgs={args}
      component={IconButton}
      title="IconButton size x type"
    />
  ),
};

export const States: Story = {
  render: (args) => (
    <ComponentMatrix<IconButtonProps>
      axes={[
        { prop: "state", label: "State", values: ["default", "hover", "disabled"] },
        { prop: "buttonColor", label: "Button Color", values: ["default", "black"] },
      ]}
      baseArgs={{ ...args, radius: "on" }}
      component={IconButton}
      title="IconButton state x color"
    />
  ),
};
