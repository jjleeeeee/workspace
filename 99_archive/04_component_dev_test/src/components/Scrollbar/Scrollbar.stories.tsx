import type { Meta, StoryObj } from "@storybook/react";
import { getChordComponent } from "../../figma/chord-components";
import { ComponentMatrix } from "../../harness/ComponentMatrix";
import { componentContracts, createStoryArgTypes } from "../../harness/component-contract";
import { Scrollbar, type ScrollbarProps } from "./Scrollbar";

const manifest = getChordComponent("scrollbar");

const meta = {
  title: "Atoms/Scrollbar",
  component: Scrollbar,
  args: { state: "default", value: 40, "aria-label": "Scroll position" },
  argTypes: createStoryArgTypes(componentContracts.scrollbar),
  parameters: { docs: { description: { component: manifest?.description } } },
} satisfies Meta<typeof Scrollbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: (args) => (
    <ComponentMatrix<ScrollbarProps>
      axes={[{ prop: "state", label: "State", values: ["default", "hover", "dragging"] }]}
      baseArgs={args}
      component={Scrollbar}
      title="Scrollbar states"
    />
  ),
};
