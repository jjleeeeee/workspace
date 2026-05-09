import type { Meta, StoryObj } from "@storybook/react";
import {
  Tabs,
  tabsModeOptions,
  tabsStyleOptions,
  tabsTypeOptions,
  tabsSizeOptions,
} from "./Tabs";
import "./Tabs.css";

const figmaControlNames = [
  "mode",
  "style",
  "type",
  "size",
  "barBadge",
  "showExpandButton",
  "scrollMoreSize",
  "scrollMoreState",
] as const;

const argTypes = {
  mode: { control: { type: "inline-radio" }, options: tabsModeOptions },
  style: { control: { type: "inline-radio" }, options: tabsStyleOptions },
  type: { control: { type: "inline-radio" }, options: tabsTypeOptions },
  size: { control: { type: "inline-radio" }, options: tabsSizeOptions },
  barBadge: { control: { type: "boolean" } },
  showExpandButton: { control: { type: "boolean" } },
  scrollMoreSize: { control: { type: "inline-radio" }, options: ["medium", "small"] },
  scrollMoreState: { control: { type: "inline-radio" }, options: ["spread", "fold"] },
} as const;

const sampleItems = ["Tab 1", "Tab 2", "Tab 3", "Tab 4"];

const meta = {
  title: "Atoms/Tabs",
  component: Tabs,
  args: {
    mode: "default",
    style: "bar",
    type: "fixed",
    size: "medium",
    barBadge: false,
    showExpandButton: true,
    scrollMoreSize: "small",
    scrollMoreState: "spread",
    tabItems: sampleItems,
    selectedIndex: 0,
  },
  argTypes,
  parameters: {
    controls: { include: [...figmaControlNames] },
    docs: {
      description: {
        component:
          "Figma node 65172:10165 기반 [V2] Tabs입니다. Source note: src/figma/tabs.source.md.",
      },
    },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Styles: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ color: "#666", fontFamily: "monospace", fontSize: 11 }}>style=bar, type=fixed</span>
        <Tabs {...args} style="bar" type="fixed" />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ color: "#666", fontFamily: "monospace", fontSize: 11 }}>style=bar, type=scrollable</span>
        <Tabs {...args} style="bar" type="scrollable" tabItems={["Long Label One", "Long Label Two", "Long Label Three", "Long Label Four", "Long Label Five"]} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ color: "#666", fontFamily: "monospace", fontSize: 11 }}>style=chip, type=fixed</span>
        <Tabs {...args} style="chip" type="fixed" />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ color: "#666", fontFamily: "monospace", fontSize: 11 }}>style=chip, type=scrollable</span>
        <Tabs {...args} style="chip" type="scrollable" />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ color: "#666", fontFamily: "monospace", fontSize: 11 }}>style=chip, type=expand</span>
        <Tabs {...args} style="chip" type="expand" tabItems={["Tab 1", "Tab 2", "Tab 3", "Tab 4", "Tab 5", "Tab 6", "Tab 7"]} />
      </div>
    </div>
  ),
};

export const Modes: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ color: "#666", fontFamily: "monospace", fontSize: 11 }}>mode=default, style=bar</span>
        <Tabs {...args} mode="default" style="bar" />
      </div>
      <div style={{ background: "#181818", borderRadius: 8, display: "flex", flexDirection: "column", gap: 4, padding: 16 }}>
        <span style={{ color: "#aaa", fontFamily: "monospace", fontSize: 11 }}>mode=fixed, style=bar</span>
        <Tabs {...args} mode="fixed" style="bar" />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ color: "#666", fontFamily: "monospace", fontSize: 11 }}>mode=default, style=chip</span>
        <Tabs {...args} mode="default" style="chip" />
      </div>
      <div style={{ background: "#181818", borderRadius: 8, display: "flex", flexDirection: "column", gap: 4, padding: 16 }}>
        <span style={{ color: "#aaa", fontFamily: "monospace", fontSize: 11 }}>mode=fixed, style=chip</span>
        <Tabs {...args} mode="fixed" style="chip" />
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ color: "#666", fontFamily: "monospace", fontSize: 11 }}>size=medium (chip)</span>
        <Tabs {...args} style="chip" size="medium" />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ color: "#666", fontFamily: "monospace", fontSize: 11 }}>size=small-only-chips</span>
        <Tabs {...args} style="chip" size="small-only-chips" />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ color: "#666", fontFamily: "monospace", fontSize: 11 }}>size=small (expand)</span>
        <Tabs {...args} style="chip" type="expand" size="small" tabItems={["Tab 1", "Tab 2", "Tab 3", "Tab 4", "Tab 5"]} />
      </div>
    </div>
  ),
};

export const NestedModules: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ color: "#666", fontFamily: "monospace", fontSize: 11 }}>barBadge=true</span>
        <Tabs {...args} style="bar" type="fixed" barBadge />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ color: "#666", fontFamily: "monospace", fontSize: 11 }}>scroll_more size=small, state=spread</span>
        <Tabs {...args} style="chip" type="scrollable" scrollMoreSize="small" scrollMoreState="spread" />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ color: "#666", fontFamily: "monospace", fontSize: 11 }}>expand gradient</span>
        <Tabs {...args} style="chip" type="expand" tabItems={["Tab 1", "Tab 2", "Tab 3", "Tab 4", "Tab 5", "Tab 6"]} />
      </div>
    </div>
  ),
};

const tabsBaseline = new URL("../../figma/baselines/tabs-bar-default@3x.png", import.meta.url).href;
const figmaReferenceImageStyle = { display: "block", height: 44, width: 393 } as const;

export const FigmaCompare: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ alignItems: "flex-start", display: "flex", gap: 40 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={{ color: "#777", fontFamily: "monospace", fontSize: 11, fontWeight: 700 }}>
            Figma (node 66562:18181)
          </span>
          <img alt="Figma baseline: Tabs bar default" src={tabsBaseline} style={figmaReferenceImageStyle} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={{ color: "#777", fontFamily: "monospace", fontSize: 11, fontWeight: 700 }}>
            Implementation
          </span>
          <Tabs {...args} mode="default" style="bar" type="fixed" size="medium" />
        </div>
      </div>
    </div>
  ),
};
