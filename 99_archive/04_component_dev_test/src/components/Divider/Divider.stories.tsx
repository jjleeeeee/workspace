import type { Meta, StoryObj } from "@storybook/react";
import { getChordComponent } from "../../figma/chord-components";
import { ComponentMatrix } from "../../harness/ComponentMatrix";
import { componentContracts, createStoryArgTypes } from "../../harness/component-contract";
import { Divider, type DividerProps } from "./Divider";

const manifest = getChordComponent("divider");

const meta = {
  title: "Atoms/Divider",
  component: Divider,
  args: { height: "1", mode: "default", styleVariant: "default-50a" },
  argTypes: createStoryArgTypes(componentContracts.divider),
  decorators: [(Story) => <div style={{ width: 320 }}><Story /></div>],
  parameters: { docs: { description: { component: manifest?.description } } },
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Matrix: Story = {
  render: (args) => (
    <ComponentMatrix<DividerProps>
      axes={[
        { prop: "height", label: "Height", values: ["1", "2", "8"] },
        { prop: "styleVariant", label: "Style", values: ["default-50a", "default-50a-2"] },
      ]}
      baseArgs={args}
      component={Divider}
      title="Divider height x style"
    />
  ),
};
