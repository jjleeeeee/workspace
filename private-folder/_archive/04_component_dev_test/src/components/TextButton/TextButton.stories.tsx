import type { Meta, StoryObj } from "@storybook/react";
import { getChordComponent } from "../../figma/chord-components";
import { ComponentMatrix } from "../../harness/ComponentMatrix";
import { componentContracts, createStoryArgTypes } from "../../harness/component-contract";
import { TextButton, type TextButtonProps } from "./TextButton";

const manifest = getChordComponent("text-button");

const meta = {
  title: "Atoms/TextButton",
  component: TextButton,
  args: {
    buttonColor: "default",
    children: "Button",
    mode: "default",
    radius: "off",
    showLeading: false,
    showTrailing: false,
    size: "medium",
    status: "default",
    variant: "filled",
  },
  argTypes: createStoryArgTypes(componentContracts.textButton),
  parameters: { docs: { description: { component: manifest?.description } } },
} satisfies Meta<typeof TextButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <ComponentMatrix<TextButtonProps>
      axes={[
        { prop: "size", label: "Size", values: ["xlarge", "large", "medium", "small", "xsmall", "xxsmall"] },
        { prop: "variant", label: "Type", values: ["filled", "outlinedColor", "outlinedGray", "ghost"] },
      ]}
      baseArgs={args}
      component={TextButton}
      title="TextButton size x type"
    />
  ),
};

export const States: Story = {
  render: (args) => (
    <ComponentMatrix<TextButtonProps>
      axes={[
        { prop: "status", label: "Status", values: ["default", "hover", "loading", "disabled"] },
        { prop: "buttonColor", label: "Button Color", values: ["default", "black"] },
      ]}
      baseArgs={{ ...args, radius: "on" }}
      component={TextButton}
      title="TextButton status x color"
    />
  ),
};
