import type { Meta, StoryObj } from "@storybook/react";
import {
  TitleHeader,
  titleHeaderAlignOptions,
  titleHeaderLeadingTypeOptions,
  titleHeaderModeOptions,
  titleHeaderTrailingTypeOptions,
} from "./TitleHeader";
import "./TitleHeader.css";

const figmaControlNames = [
  "mode",
  "align",
  "marquee",
  "leadingType",
  "trailingType",
  "showLeading",
  "showSubTitle",
  "showTrailing",
  "showTrailingText",
  "showTrailingIcon",
  "showTitleBadge",
] as const;

const argTypes = {
  align: { control: { type: "inline-radio" }, options: titleHeaderAlignOptions },
  leadingType: { control: { type: "inline-radio" }, options: titleHeaderLeadingTypeOptions },
  marquee: { control: { type: "boolean" } },
  mode: { control: { type: "inline-radio" }, options: titleHeaderModeOptions },
  trailingType: { control: { type: "inline-radio" }, options: titleHeaderTrailingTypeOptions },
  showLeading: { control: { type: "boolean" } },
  showSubTitle: { control: { type: "boolean" } },
  showTrailingIcon: { control: { type: "boolean" } },
  showTrailingText: { control: { type: "boolean" } },
  showTitleBadge: { control: { type: "boolean" } },
  showTrailing: { control: { type: "boolean" } },
} as const;

const meta = {
  title: "Atoms/TitleHeader",
  component: TitleHeader,
  args: {
    align: "left",
    leadingType: "icon",
    marquee: false,
    mode: "default",
    showLeading: true,
    showSubTitle: true,
    showTitleBadge: true,
    showTrailing: true,
    showTrailingIcon: true,
    showTrailingText: true,
    subTitleLabel: "SubTitle",
    titleLabel: "Title",
    trailingLabel: "Detail",
    trailingType: "dropdown",
  },
  argTypes,
  parameters: {
    controls: { include: [...figmaControlNames] },
    docs: {
      description: {
        component:
          "Figma node 64450:27844 기반 Title Header입니다. Source note: src/figma/title-header.source.md.",
      },
    },
  },
} satisfies Meta<typeof TitleHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Modes: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ color: "#666", fontFamily: "monospace", fontSize: 11 }}>mode=default, align=left</span>
        <TitleHeader {...args} mode="default" align="left" />
      </div>
      <div style={{ background: "#181818", borderRadius: 8, display: "flex", flexDirection: "column", gap: 4, padding: 16 }}>
        <span style={{ color: "#aaa", fontFamily: "monospace", fontSize: 11 }}>mode=fixed, align=left</span>
        <TitleHeader {...args} mode="fixed" align="left" />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ color: "#666", fontFamily: "monospace", fontSize: 11 }}>mode=default, align=center</span>
        <TitleHeader {...args} mode="default" align="center" />
      </div>
      <div style={{ background: "#181818", borderRadius: 8, display: "flex", flexDirection: "column", gap: 4, padding: 16 }}>
        <span style={{ color: "#aaa", fontFamily: "monospace", fontSize: 11 }}>mode=fixed, align=center</span>
        <TitleHeader {...args} mode="fixed" align="center" />
      </div>
    </div>
  ),
};

export const Aligns: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ color: "#666", fontFamily: "monospace", fontSize: 11 }}>align=left, leadingType=icon</span>
        <TitleHeader {...args} align="left" leadingType="icon" />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ color: "#666", fontFamily: "monospace", fontSize: 11 }}>align=left, leadingType=avatar-group</span>
        <TitleHeader {...args} align="left" leadingType="avatar-group" />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ color: "#666", fontFamily: "monospace", fontSize: 11 }}>align=center, showLeading=true (icon only)</span>
        <TitleHeader {...args} align="center" showLeading={true} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ color: "#666", fontFamily: "monospace", fontSize: 11 }}>align=center, showLeading=false</span>
        <TitleHeader {...args} align="center" showLeading={false} />
      </div>
    </div>
  ),
};

export const NestedTypes: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {titleHeaderLeadingTypeOptions.map((leadingType) => (
        <div key={leadingType} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ color: "#666", fontFamily: "monospace", fontSize: 11 }}>align=left, leadingType={leadingType}</span>
          <TitleHeader {...args} align="left" leadingType={leadingType} />
        </div>
      ))}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ color: "#666", fontFamily: "monospace", fontSize: 11 }}>align=center, leading=icon (atoms/leading_Center)</span>
        <TitleHeader {...args} align="center" showLeading={true} />
      </div>
      {titleHeaderTrailingTypeOptions.map((trailingType) => (
        <div key={trailingType} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ color: "#666", fontFamily: "monospace", fontSize: 11 }}>trailingType={trailingType}</span>
          <TitleHeader {...args} trailingType={trailingType} />
        </div>
      ))}
    </div>
  ),
};

export const Slots: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ color: "#666", fontFamily: "monospace", fontSize: 11 }}>showLeading=false</span>
        <TitleHeader {...args} showLeading={false} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ color: "#666", fontFamily: "monospace", fontSize: 11 }}>showSubTitle=false</span>
        <TitleHeader {...args} showSubTitle={false} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ color: "#666", fontFamily: "monospace", fontSize: 11 }}>showTrailing=false</span>
        <TitleHeader {...args} showTrailing={false} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ color: "#666", fontFamily: "monospace", fontSize: 11 }}>showTitleBadge=false</span>
        <TitleHeader {...args} showTitleBadge={false} />
      </div>
    </div>
  ),
};

const titleHeaderBaseline = new URL("../../figma/baselines/title-header-default@3x.png", import.meta.url).href;
const figmaReferenceImageStyle = { display: "block", height: 48, width: 393 } as const;

export const FigmaCompare: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ alignItems: "flex-start", display: "flex", gap: 40 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={{ color: "#777", fontFamily: "monospace", fontSize: 11, fontWeight: 700 }}>
            Figma (node 64450:28044)
          </span>
          <img alt="Figma baseline: TitleHeader default" src={titleHeaderBaseline} style={figmaReferenceImageStyle} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={{ color: "#777", fontFamily: "monospace", fontSize: 11, fontWeight: 700 }}>
            Implementation
          </span>
          <TitleHeader {...args} align="left" mode="default" />
        </div>
      </div>
    </div>
  ),
};
