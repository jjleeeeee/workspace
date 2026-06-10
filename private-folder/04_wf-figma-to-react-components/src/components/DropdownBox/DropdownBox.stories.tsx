import type { Meta, StoryObj } from "@storybook/react";
import { DropdownBox, dropdownBoxModeOptions, dropdownBoxStateOptions } from "./DropdownBox";
import type { DropdownBoxMode, DropdownBoxState } from "./DropdownBox";
import { ListItemNative } from "../ListItemNative/ListItemNative";
import "./DropdownBox.css";

const figmaControlNames = ["mode", "showTitle", "showGuide", "showBadgeDot", "showScrollbar", "state"] as const;

const argTypes = {
  mode: { control: { type: "inline-radio" }, options: dropdownBoxModeOptions },
  showBadgeDot: { control: { type: "boolean" } },
  showGuide: { control: { type: "boolean" } },
  showScrollbar: { control: { type: "boolean" } },
  showTitle: { control: { type: "boolean" } },
  state: { control: { type: "select" }, options: dropdownBoxStateOptions },
} as const;

const sampleOptions = (
  <>
    <ListItemNative size="medium" title="옵션 1" />
    <ListItemNative size="medium" title="옵션 2" />
    <ListItemNative size="medium" title="옵션 3" />
    <ListItemNative size="medium" title="옵션 4" />
  </>
);

const meta = {
  title: "Atoms/DropdownBox",
  component: DropdownBox,
  args: {
    guideLabel: "Guide Message",
    mode: "default",
    showBadgeDot: true,
    showGuide: true,
    showScrollbar: true,
    showTitle: true,
    state: "default",
    textLabel: "Select Option",
    titleLabel: "Title",
  },
  argTypes,
  parameters: {
    controls: { include: [...figmaControlNames] },
    docs: {
      description: {
        component:
          "Figma node 60730:9605 기반 Dropdown_Box입니다. Source note: src/figma/dropdown-box.source.md.",
      },
    },
  },
} satisfies Meta<typeof DropdownBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => {
    const closedStates: DropdownBoxState[] = ["default", "pressed", "completed", "error", "disabled"];
    return (
      <div style={{ alignItems: "start", display: "flex", flexDirection: "column", gap: 24 }}>
        {closedStates.map((state) => (
          <div key={state} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ color: "#666", fontSize: 11, fontFamily: "monospace" }}>{state}</span>
            <DropdownBox {...args} state={state} />
          </div>
        ))}
      </div>
    );
  },
};

export const Modes: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div style={{ display: "flex", gap: 40 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ color: "#666", fontSize: 11, fontFamily: "monospace" }}>mode=default</span>
        <DropdownBox {...args} mode="default" />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          background: "#181818",
          padding: 16,
          borderRadius: 8,
        }}
      >
        <span style={{ color: "#aaa", fontSize: 11, fontFamily: "monospace" }}>mode=fixed</span>
        <DropdownBox {...args} mode="fixed" />
      </div>
    </div>
  ),
};

export const OpenStates: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div style={{ alignItems: "start", display: "flex", gap: 40 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ color: "#666", fontSize: 11, fontFamily: "monospace" }}>enabled-down (메뉴 아래)</span>
        <DropdownBox {...args} state="enabled-down">
          {sampleOptions}
        </DropdownBox>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ color: "#666", fontSize: 11, fontFamily: "monospace" }}>enabled-up (메뉴 위)</span>
        <DropdownBox {...args} state="enabled-up">
          {sampleOptions}
        </DropdownBox>
      </div>
    </div>
  ),
};

const dropdownBoxBaseline = new URL("../../figma/baselines/dropdown-box-default@3x.png", import.meta.url).href;
const figmaReferenceImageStyle = { display: "block", height: 93, width: 393 } as const;

export const FigmaCompare: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", gap: 40, alignItems: "flex-start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={{ color: "#777", fontSize: 11, fontFamily: "monospace", fontWeight: 700 }}>Figma (node 60730:9606)</span>
          <img src={dropdownBoxBaseline} alt="Figma baseline: DropdownBox default" style={figmaReferenceImageStyle} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={{ color: "#777", fontSize: 11, fontFamily: "monospace", fontWeight: 700 }}>Implementation</span>
          <DropdownBox {...args} mode="default" state="default" />
        </div>
      </div>
    </div>
  ),
};
