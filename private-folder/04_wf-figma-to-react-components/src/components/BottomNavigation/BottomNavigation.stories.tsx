import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  BottomNavigation,
  bottomNavigationModeOptions,
  bottomNavigationOSOptions,
  bottomNavigationTabOptions,
} from "./BottomNavigation";
import "./BottomNavigation.css";

const figmaControlNames = ["mode", "os", "activeTab", "showSystem"] as const;

const argTypes = {
  mode: { control: { type: "inline-radio" }, options: bottomNavigationModeOptions },
  os: { control: { type: "inline-radio" }, options: bottomNavigationOSOptions },
  activeTab: { control: { type: "inline-radio" }, options: bottomNavigationTabOptions },
  showSystem: { control: { type: "boolean" } },
} as const;

const meta = {
  title: "Navigation/BottomNavigation",
  component: BottomNavigation,
  args: {
    mode: "default",
    os: "ios",
    activeTab: "home",
    showSystem: true,
  },
  argTypes,
  parameters: {
    controls: { include: [...figmaControlNames] },
    docs: {
      description: {
        component:
          "Figma node 87669:2290 기반 Bottom Navigation. Mode × OS 4 variants. 4 tabs: Home / Shop / DM / More + Community button.",
      },
    },
  },
} satisfies Meta<typeof BottomNavigation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: function Render(args) {
    const [active, setActive] = useState<typeof args.activeTab>("home");
    return <BottomNavigation {...args} activeTab={active} onTabChange={setActive} />;
  },
};

export const OSVariants: Story = {
  parameters: { controls: { disable: true } },
  render: function Render(args) {
    const [active1, setActive1] = useState<typeof args.activeTab>("home");
    const [active2, setActive2] = useState<typeof args.activeTab>("home");
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ color: "#666", fontFamily: "monospace", fontSize: 11 }}>os=ios</span>
          <BottomNavigation {...args} os="ios" activeTab={active1} onTabChange={setActive1} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ color: "#666", fontFamily: "monospace", fontSize: 11 }}>os=android</span>
          <BottomNavigation {...args} os="android" activeTab={active2} onTabChange={setActive2} />
        </div>
      </div>
    );
  },
};

export const Modes: Story = {
  parameters: { controls: { disable: true } },
  render: function Render(args) {
    const [active1, setActive1] = useState<typeof args.activeTab>("home");
    const [active2, setActive2] = useState<typeof args.activeTab>("home");
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ color: "#666", fontFamily: "monospace", fontSize: 11 }}>mode=default</span>
          <BottomNavigation {...args} mode="default" activeTab={active1} onTabChange={setActive1} />
        </div>
        <div style={{ background: "#181818", borderRadius: 16, display: "flex", flexDirection: "column", gap: 4, padding: 16 }}>
          <span style={{ color: "#aaa", fontFamily: "monospace", fontSize: 11 }}>mode=fixed</span>
          <BottomNavigation {...args} mode="fixed" activeTab={active2} onTabChange={setActive2} />
        </div>
      </div>
    );
  },
};

export const ActiveTabs: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {(["home", "shop", "dm", "more"] as const).map((tab) => (
        <div key={tab} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ color: "#666", fontFamily: "monospace", fontSize: 11 }}>activeTab={tab}</span>
          <BottomNavigation {...args} activeTab={tab} showSystem={false} />
        </div>
      ))}
    </div>
  ),
};
