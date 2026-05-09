import type { Meta, StoryObj } from "@storybook/react";
import { PaginationList } from "./PaginationList";
import "./PaginationList.css";

const paginationListBaseline = new URL("../../figma/baselines/pagination-list-default@3x.png", import.meta.url).href;
const figmaControlNames = ["mode", "pages", "size"] as const;

const argTypes = {
  mode: { control: { type: "inline-radio" }, options: ["default", "fixed"] },
  pages: { control: { type: "select" }, options: ["2", "3", "4", "5", "6", "7", "8+"] },
  size: { control: { type: "inline-radio" }, options: ["large", "small"] },
} as const;

const meta = {
  title: "Atoms/PaginationList",
  component: PaginationList,
  args: {
    mode: "default",
    pages: "2",
    size: "large",
  },
  argTypes,
  parameters: {
    controls: { include: [...figmaControlNames] },
    docs: {
      description: {
        component:
          "Figma node 61753:7839 기반 PaginationList입니다. Source note: src/figma/pagination-list.source.md. Arrows are mapped DS icons; ellipsis remains a nested slot state.",
      },
    },
  },
} satisfies Meta<typeof PaginationList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 12 }}>
      {(["2", "3", "4", "5", "6", "7", "8+"] as const).map((pages) => (
        <PaginationList {...args} key={pages} pages={pages} />
      ))}
    </div>
  ),
};

export const States: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 12 }}>
      <PaginationList {...args} selectedPage={1} />
      <PaginationList {...args} pages="8+" selectedPage={5} />
      <div style={{ background: "#111", padding: 8, width: "max-content" }}>
        <PaginationList {...args} mode="fixed" pages="4" selectedPage={2} />
      </div>
    </div>
  ),
};

export const FigmaCompare: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div style={{ display: "grid", gap: 12 }}>
      <img
        alt="Figma PaginationList reference"
        src={paginationListBaseline}
        style={{ height: 72, objectFit: "contain", objectPosition: "left", width: 160 }}
      />
      <PaginationList {...args} />
      <span style={{ color: "#777", fontSize: 12 }}>
        Arrow controls use mapped DS SVG icons. Ellipsis remains a nested slot state until that child component is implemented.
      </span>
    </div>
  ),
};
