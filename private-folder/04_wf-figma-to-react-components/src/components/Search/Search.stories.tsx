import type { Meta, StoryObj } from "@storybook/react";
import { Search } from "./Search";
import type { SearchMode, SearchState } from "./Search";
import "./Search.css";

const searchBaseline = new URL("../../figma/baselines/search-default@3x.png", import.meta.url).href;
const figmaControlNames = ["label", "mode", "state"] as const;

const modeOptions: SearchMode[] = ["default", "fixed"];
const stateOptions: SearchState[] = ["default", "enabled", "completed"];

const argTypes = {
  label: { control: { type: "text" } },
  mode: { control: { type: "inline-radio" }, options: modeOptions },
  state: { control: { type: "inline-radio" }, options: stateOptions },
} as const;

const meta = {
  title: "Atoms/Search",
  component: Search,
  args: {
    label: "Search",
    mode: "default",
    state: "default",
  },
  argTypes,
  parameters: {
    controls: { include: [...figmaControlNames] },
    docs: {
      description: {
        component:
          "Figma node 59722:17972 기반 Search입니다. Source note: src/figma/search.source.md. Search and clear icons are mapped to the DS icon registry; clear keeps the 24x24 frame + 18x18 internal graphic contract.",
      },
    },
  },
} satisfies Meta<typeof Search>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 16, justifyItems: "start" }}>
      {modeOptions.map((mode) =>
        stateOptions.map((state) => <Search {...args} key={`${mode}-${state}`} mode={mode} state={state} />),
      )}
    </div>
  ),
};

export const States: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 16, justifyItems: "start" }}>
      <Search {...args} label="Search" state="default" />
      <Search {...args} label="Search" state="enabled" />
      <Search {...args} label="Keyword" state="completed" />
    </div>
  ),
};

export const FigmaCompare: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div style={{ display: "grid", gap: 12 }}>
      <img alt="Figma Search reference" src={searchBaseline} style={{ height: 36, width: 361 }} />
      <Search {...args} label="Search" mode="default" state="default" />
      <span style={{ color: "#777", fontSize: 12 }}>
        Search icon uses icon_area sizing; clear is not icon_area and keeps a 24x24 frame with a mapped 18x18 delete graphic.
      </span>
    </div>
  ),
};
