import type { Meta, StoryObj } from "@storybook/react";
import {
  ListItemWeb,
  listItemWebLeadingTypeOptions,
  listItemWebModeOptions,
  listItemWebSizeOptions,
  listItemWebStatesOptions,
  listItemWebTrailingTypeOptions,
} from "./ListItemWeb";
import "./ListItemWeb.css";

const figmaControlNames = [
  "mode",
  "size",
  "states",
  "showLeading",
  "leadingType",
  "showSmallLeading",
  "showMediumLeading",
  "showTrailing",
  "trailingType",
  "showTrailingText",
  "showTrailingIcon",
  "showDivider",
] as const;

const argTypes = {
  mode: { control: { type: "inline-radio" }, options: listItemWebModeOptions },
  size: { control: { type: "inline-radio" }, options: listItemWebSizeOptions },
  states: { control: { type: "inline-radio" }, options: listItemWebStatesOptions },
  showLeading: { control: { type: "boolean" } },
  leadingType: { control: { type: "select" }, options: listItemWebLeadingTypeOptions },
  showSmallLeading: { control: { type: "boolean" } },
  showMediumLeading: { control: { type: "boolean" } },
  showTrailing: { control: { type: "boolean" } },
  trailingType: { control: { type: "select" }, options: listItemWebTrailingTypeOptions },
  showTrailingText: { control: { type: "boolean" } },
  showTrailingIcon: { control: { type: "boolean" } },
  showDivider: { control: { type: "boolean" } },
} as const;

const meta = {
  title: "Atoms/ListItemWeb",
  component: ListItemWeb,
  args: {
    mode: "default",
    size: "small",
    states: "default",
    showLeading: true,
    leadingType: "square-thumbnail",
    showSmallLeading: true,
    showMediumLeading: true,
    showTrailing: true,
    trailingType: "text-and-icon",
    showTrailingText: true,
    showTrailingIcon: true,
    showDivider: true,
    showBadgeDot: false,
    titleLabel: "Title",
    bodyLabel: "Body Text",
    trailingLabel: "Detail",
  },
  argTypes,
  parameters: {
    controls: { include: [...figmaControlNames] },
    docs: {
      description: {
        component:
          "Figma node 69579:9043 기반 List Item Web입니다. Leading sets: small 63406:10120, medium 57343:20398. Source note: src/figma/list-item-web.source.md.",
      },
    },
  },
} satisfies Meta<typeof ListItemWeb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const SmallDisabled: Story = {
  args: {
    mode: "default",
    size: "small",
    states: "disabled",
  },
};

export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ color: "#666", fontFamily: "monospace", fontSize: 11 }}>size=small</span>
        <ListItemWeb {...args} size="small" />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 16 }}>
        <span style={{ color: "#666", fontFamily: "monospace", fontSize: 11 }}>size=medium</span>
        <ListItemWeb {...args} size="medium" />
      </div>
    </div>
  ),
};

export const States: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ color: "#666", fontFamily: "monospace", fontSize: 11 }}>states=default</span>
        <ListItemWeb {...args} states="default" />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 8 }}>
        <span style={{ color: "#666", fontFamily: "monospace", fontSize: 11 }}>states=disabled</span>
        <ListItemWeb {...args} states="disabled" />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 8 }}>
        <span style={{ color: "#666", fontFamily: "monospace", fontSize: 11 }}>states=hover-pressed</span>
        <ListItemWeb {...args} states="hover-pressed" />
      </div>
    </div>
  ),
};

export const Modes: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ color: "#666", fontFamily: "monospace", fontSize: 11 }}>mode=default</span>
        <ListItemWeb {...args} mode="default" />
      </div>
      <div
        style={{
          background: "#181818",
          borderRadius: 8,
          display: "flex",
          flexDirection: "column",
          gap: 4,
          padding: 16,
        }}
      >
        <span style={{ color: "#aaa", fontFamily: "monospace", fontSize: 11 }}>mode=fixed</span>
        <ListItemWeb {...args} mode="fixed" />
      </div>
    </div>
  ),
};

export const Slots: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ color: "#666", fontFamily: "monospace", fontSize: 11 }}>showTrailing=false</span>
        <ListItemWeb {...args} showTrailing={false} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 8 }}>
        <span style={{ color: "#666", fontFamily: "monospace", fontSize: 11 }}>showDivider=false</span>
        <ListItemWeb {...args} showDivider={false} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 8 }}>
        <span style={{ color: "#666", fontFamily: "monospace", fontSize: 11 }}>showLeading=false</span>
        <ListItemWeb {...args} showLeading={false} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 8 }}>
        <span style={{ color: "#666", fontFamily: "monospace", fontSize: 11 }}>showBadgeDot=true</span>
        <ListItemWeb {...args} showBadgeDot />
      </div>
    </div>
  ),
};

const leadingTypeLabels = {
  avatar: "Type=Avatar",
  checkbox: "Type=Checkbox",
  icon: "Type=Icon",
  radio: "Type=Radio",
  "rectangular-thumbnail": "Type=Rectanglular Thumbnail",
  "square-thumbnail": "Type=Square Thumbnail",
} as const;

const leadingTypeBranchIds = {
  avatar: "small=63406:10121 / medium=57343:20399",
  checkbox: "small=63406:10123 / medium=57343:20401",
  icon: "small=63406:10125 / medium=57343:20403",
  radio: "small=63406:10131 / medium=59314:27103",
  "rectangular-thumbnail": "small=63406:10127 / medium=62641:42034",
  "square-thumbnail": "small=63406:10129 / medium=63354:137265",
} as const;

export const LeadingTypes: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <span style={{ color: "#666", fontFamily: "monospace", fontSize: 11 }}>
        Leading component sets: small=63406:10120, medium=57343:20398
      </span>
      {listItemWebLeadingTypeOptions.map((leadingType) => (
        <div key={leadingType} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ color: "#666", fontFamily: "monospace", fontSize: 11 }}>
            {leadingTypeLabels[leadingType]} ({leadingTypeBranchIds[leadingType]})
          </span>
          <ListItemWeb {...args} leadingType={leadingType} />
        </div>
      ))}
    </div>
  ),
};

export const TrailingTypes: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {listItemWebTrailingTypeOptions.map((trailingType) => (
        <div key={trailingType} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ color: "#666", fontFamily: "monospace", fontSize: 11 }}>trailingType={trailingType}</span>
          <ListItemWeb {...args} trailingType={trailingType} />
        </div>
      ))}
    </div>
  ),
};

const listItemWebBaseline = new URL(
  "../../figma/baselines/list-item-web-default@3x.png",
  import.meta.url,
).href;
const figmaReferenceImageStyle = { display: "block", height: 57, width: 393 } as const;

export const FigmaCompare: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ alignItems: "flex-start", display: "flex", gap: 40 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={{ color: "#777", fontFamily: "monospace", fontSize: 11, fontWeight: 700 }}>
            Figma (node 69579:9044)
          </span>
          <img alt="Figma baseline: ListItemWeb default" src={listItemWebBaseline} style={figmaReferenceImageStyle} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={{ color: "#777", fontFamily: "monospace", fontSize: 11, fontWeight: 700 }}>
            Implementation
          </span>
          <ListItemWeb {...args} mode="default" size="small" states="default" />
        </div>
      </div>
    </div>
  ),
};
