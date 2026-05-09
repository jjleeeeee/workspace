import type { Meta, StoryObj } from "@storybook/react";
import { getChordComponent } from "../../figma/chord-components";
import { ComponentMatrix } from "../../harness/ComponentMatrix";
import { componentContracts, createStoryArgTypes } from "../../harness/component-contract";
import { BadgeNumber, type BadgeNumberProps } from "./BadgeNumber";

const manifest = getChordComponent("badge-number");

const meta = {
  title: "Atoms/BadgeNumber",
  component: BadgeNumber,
  args: {
    count: 1000,
    label: "",
    mode: "default",
    type: "number",
    "aria-label": "Unread count",
  },
  argTypes: createStoryArgTypes(componentContracts.badgeNumber),
  parameters: {
    docs: {
      description: {
        component: manifest?.description,
      },
    },
  },
} satisfies Meta<typeof BadgeNumber>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: (args) => (
    <ComponentMatrix<BadgeNumberProps>
      axes={[
        { prop: "type", label: "Type", values: ["number", "new"] },
        { prop: "mode", label: "Mode", values: ["default", "fixed"] },
      ]}
      baseArgs={args}
      component={BadgeNumber}
      renderLabel={(matrixArgs) => `${matrixArgs.type} / ${matrixArgs.mode}`}
      title="BadgeNumber type x mode"
    />
  ),
};
