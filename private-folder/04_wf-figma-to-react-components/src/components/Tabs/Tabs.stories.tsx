import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Tabs, tabsModeOptions, tabsTypeOptions } from "./Tabs";
import "./Tabs.css";

const figmaControlNames = ["mode", "type", "barBadge"] as const;

const argTypes = {
  mode: { control: { type: "inline-radio" }, options: tabsModeOptions },
  type: { control: { type: "inline-radio" }, options: tabsTypeOptions },
  barBadge: { control: { type: "boolean" } },
} as const;

const sampleItems = ["Tab 1", "Tab 2", "Tab 3", "Tab 4"];
const swipeItems = ["Tab 1", "Tab 2", "Tab 3", "Tab 4", "Tab 5", "Tab 6"];

const meta = {
  title: "Atoms/Tabs",
  component: Tabs,
  args: {
    mode: "default",
    type: "fill",
    barBadge: false,
    tabItems: sampleItems,
    selectedIndex: 0,
  },
  argTypes,
  parameters: {
    controls: { include: [...figmaControlNames] },
    docs: {
      description: {
        component:
          "Figma node 65172:10165 기반 [V2] Tabs입니다. Bar style만 지원. Source note: src/figma/tabs.source.md.",
      },
    },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: function Render(args) {
    const [selected, setSelected] = useState(0);
    const items = args.type === "swipe" ? swipeItems : sampleItems;
    return <Tabs {...args} tabItems={items} selectedIndex={selected} onTabChange={setSelected} />;
  },
};

export const Types: Story = {
  parameters: { controls: { disable: true } },
  render: function Render(args) {
    const [sel1, setSel1] = useState(0);
    const [sel2, setSel2] = useState(0);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ color: "#666", fontFamily: "monospace", fontSize: 11 }}>type=fill (Content Fill)</span>
          <Tabs {...args} type="fill" selectedIndex={sel1} onTabChange={setSel1} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ color: "#666", fontFamily: "monospace", fontSize: 11 }}>type=swipe (Content Swipe)</span>
          <Tabs {...args} type="swipe" tabItems={["Long Label One", "Long Label Two", "Long Label Three", "Long Label Four", "Long Label Five"]} selectedIndex={sel2} onTabChange={setSel2} />
        </div>
      </div>
    );
  },
};

export const Modes: Story = {
  parameters: { controls: { disable: true } },
  render: function Render(args) {
    const [sel1, setSel1] = useState(0);
    const [sel2, setSel2] = useState(0);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ color: "#666", fontFamily: "monospace", fontSize: 11 }}>mode=default</span>
          <Tabs {...args} mode="default" selectedIndex={sel1} onTabChange={setSel1} />
        </div>
        <div style={{ background: "#181818", borderRadius: 8, display: "flex", flexDirection: "column", gap: 4, padding: 16 }}>
          <span style={{ color: "#aaa", fontFamily: "monospace", fontSize: 11 }}>mode=fixed</span>
          <Tabs {...args} mode="fixed" selectedIndex={sel2} onTabChange={setSel2} />
        </div>
      </div>
    );
  },
};

export const NestedModules: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ color: "#666", fontFamily: "monospace", fontSize: 11 }}>barBadge=true</span>
        <Tabs {...args} type="fill" barBadge />
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
          <Tabs {...args} mode="default" type="fill" />
        </div>
      </div>
    </div>
  ),
};
