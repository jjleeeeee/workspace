import type { Meta, StoryObj } from "@storybook/react";
import { getChordComponent } from "../../figma/chord-components";
import { ComponentMatrix } from "../../harness/ComponentMatrix";
import { componentContracts, createStoryArgTypes } from "../../harness/component-contract";
import { BadgeDot, type BadgeDotProps } from "./BadgeDot";

const manifest = getChordComponent("badge-dot");

const meta = {
  title: "Atoms/BadgeDot",
  component: BadgeDot,
  args: {
    mode: "default",
    outline: "off",
    size: "medium",
    "aria-label": "Unread",
  },
  argTypes: createStoryArgTypes(componentContracts.badgeDot),
  parameters: {
    docs: {
      description: {
        component: manifest?.description,
      },
    },
  },
} satisfies Meta<typeof BadgeDot>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <ComponentMatrix<BadgeDotProps>
      axes={[
        { prop: "size", label: "Size", values: ["small", "medium", "large"] },
        { prop: "outline", label: "Outline", values: ["off", "on"] },
      ]}
      baseArgs={args}
      component={BadgeDot}
      title="BadgeDot size x outline"
    />
  ),
};
