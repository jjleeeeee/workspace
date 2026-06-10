import type { Meta, StoryObj } from "@storybook/react";
import { PaginationDot, type PaginationDotSelection } from "./PaginationDot";
import "./PaginationDot.css";

const paginationDotBaseline = new URL("../../figma/baselines/pagination-dot-default@3x.png", import.meta.url).href;
const figmaControlNames = ["mode", "dots", "selection"] as const;

const argTypes = {
  dots: { control: { type: "inline-radio" }, options: ["2", "3", "4", "5", "6+"] },
  mode: { control: { type: "inline-radio" }, options: ["default", "fixed"] },
  selection: { control: { type: "number", min: 1, max: 6, step: 1 } },
} as const;

const meta = {
  title: "Atoms/PaginationDot",
  component: PaginationDot,
  args: {
    dots: "2",
    mode: "fixed",
    selection: 1,
  },
  argTypes,
  parameters: {
    controls: { include: [...figmaControlNames] },
    docs: {
      description: {
        component: "Figma node 62324:12061 기반 PaginationDot입니다. Source note: src/figma/pagination-dot.source.md.",
      },
    },
  },
} satisfies Meta<typeof PaginationDot>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 12 }}>
      {(["2", "3", "4", "5", "6+"] as const).map((dots) => (
        <div key={dots} style={{ alignItems: "center", display: "flex", gap: 12 }}>
          <PaginationDot {...args} dots={dots} mode="fixed" selection={1} />
          <PaginationDot
            {...args}
            dots={dots}
            mode="default"
            selection={(dots === "6+" ? 6 : Number(dots)) as PaginationDotSelection}
          />
        </div>
      ))}
    </div>
  ),
};

export const States: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 12 }}>
      {([1, 2, 3, 4, 5, 6] as const).map((selection) => (
        <PaginationDot {...args} dots="6+" key={selection} selection={selection} />
      ))}
    </div>
  ),
};

export const FigmaCompare: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div style={{ display: "grid", gap: 12 }}>
      <img
        alt="Figma PaginationDot reference"
        src={paginationDotBaseline}
        style={{ height: 32, objectFit: "contain", objectPosition: "left", width: 120 }}
      />
      <PaginationDot {...args} dots="2" mode="fixed" selection={1} />
    </div>
  ),
};
