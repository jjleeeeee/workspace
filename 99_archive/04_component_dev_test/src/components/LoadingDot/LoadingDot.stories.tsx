import type { Meta, StoryObj } from "@storybook/react";
import { getChordComponent } from "../../figma/chord-components";
import { ComponentMatrix } from "../../harness/ComponentMatrix";
import { componentContracts, createStoryArgTypes } from "../../harness/component-contract";
import { LoadingDot, type LoadingDotProps } from "./LoadingDot";

const manifest = getChordComponent("loading-dot");

const meta = {
  title: "Atoms/LoadingDot",
  component: LoadingDot,
  args: { color: "default", mode: "default", size: "medium", "aria-label": "Loading" },
  argTypes: createStoryArgTypes(componentContracts.loadingDot),
  parameters: { docs: { description: { component: manifest?.description } } },
} satisfies Meta<typeof LoadingDot>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Matrix: Story = {
  render: (args) => (
    <ComponentMatrix<LoadingDotProps>
      axes={[
        { prop: "size", label: "Size", values: ["small", "medium"] },
        { prop: "color", label: "Color", values: ["default", "white"] },
      ]}
      baseArgs={args}
      component={LoadingDot}
      title="LoadingDot size x color"
    />
  ),
};
