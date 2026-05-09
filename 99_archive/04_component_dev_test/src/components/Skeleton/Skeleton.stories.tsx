import type { Meta, StoryObj } from "@storybook/react";
import { getChordComponent } from "../../figma/chord-components";
import { ComponentMatrix } from "../../harness/ComponentMatrix";
import { componentContracts, createStoryArgTypes } from "../../harness/component-contract";
import { Skeleton, type SkeletonProps } from "./Skeleton";

const manifest = getChordComponent("skeleton");

const meta = {
  title: "Atoms/Skeleton",
  component: Skeleton,
  args: {
    animated: true,
    mode: "default",
    size: "medium",
    type: "rectangle",
    "aria-label": "Loading content",
  },
  argTypes: createStoryArgTypes(componentContracts.skeleton),
  parameters: {
    docs: {
      description: {
        component: manifest?.description,
      },
    },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Matrix: Story = {
  render: (args) => (
    <ComponentMatrix<SkeletonProps>
      axes={[
        { prop: "type", label: "Type", values: ["rectangle", "circle", "text"] },
        { prop: "size", label: "Size", values: ["small", "medium"] },
      ]}
      baseArgs={args}
      component={Skeleton}
      renderLabel={(matrixArgs) => `${matrixArgs.type} / ${matrixArgs.size}`}
      title="Skeleton type x size"
    />
  ),
};
