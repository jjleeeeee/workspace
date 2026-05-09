import type { Meta, StoryObj } from "@storybook/react";
import { Avatar } from "../Avatar/Avatar";
import { ChordIcon } from "../../assets/chord-icons";
import {
  TopNavigation,
  topNavigationLeadingTypeOptions,
  topNavigationModeOptions,
  topNavigationTextTypeOptions,
  topNavigationScrollBgOptions,
  topNavigationTrailingCountOptions,
} from "./TopNavigation";
import "./TopNavigation.css";

const figmaControlNames = [
  "mode",
  "textType",
  "scrollBg",
  "marquee",
  "leadingType",
  "trailingCount",
  "showSubTitle",
  "showSubTitleIcon",
  "showLeading",
  "showTrailing",
  "showImage",
  "showOfficialBadge",
] as const;

const argTypes = {
  mode: { control: { type: "inline-radio" }, options: topNavigationModeOptions },
  textType: { control: { type: "select" }, options: topNavigationTextTypeOptions },
  scrollBg: { control: { type: "inline-radio" }, options: topNavigationScrollBgOptions },
  leadingType: { control: { type: "select" }, options: topNavigationLeadingTypeOptions },
  marquee: { control: { type: "boolean" } },
  trailingCount: { control: { type: "inline-radio" }, options: topNavigationTrailingCountOptions },
  showSubTitle: { control: { type: "boolean" } },
  showSubTitleIcon: { control: { type: "boolean" } },
  showLeading: { control: { type: "boolean" } },
  showTrailing: { control: { type: "boolean" } },
  showImage: { control: { type: "boolean" } },
  showOfficialBadge: { control: { type: "boolean" } },
} as const;

const leadingIcon = <ChordIcon name="arrowLeftMedium" size={24} />;
const trailingIcon = <ChordIcon name="closeMedium" size={24} />;
const avatarSlot = <Avatar size="xsmall" />;
const logoSvg = (
  <svg height="24" viewBox="0 0 80 24" width="80" xmlns="http://www.w3.org/2000/svg">
    <rect fill="currentColor" height="24" rx="4" width="80" />
  </svg>
);

const meta = {
  title: "Atoms/TopNavigation",
  component: TopNavigation,
  args: {
    mode: "default",
    textType: "center",
    scrollBg: "off",
    leadingType: "icon-avatar",
    marquee: false,
    titleLabel: "Title",
    subTitleLabel: "SubTitle",
    trailingCount: "1ea",
    showSubTitle: true,
    showSubTitleIcon: true,
    showLeading: true,
    showTrailing: true,
    showImage: true,
    showOfficialBadge: true,
    imageSlot: avatarSlot,
    logoSlot: logoSvg,
  },
  argTypes,
  parameters: {
    controls: { include: [...figmaControlNames] },
    docs: {
      description: {
        component:
          "Figma node 64450:39560 기반 Top Navigation입니다. Source note: src/figma/top-navigation.source.md.",
      },
    },
  },
} satisfies Meta<typeof TopNavigation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const TextTypes: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {(["default", "left", "center", "search", "img", "img-text", "logo-svg", "logo-svg-center"] as const).map(
        (tt) => (
          <div key={tt} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span style={{ color: "#666", fontFamily: "monospace", fontSize: 11 }}>textType={tt}</span>
            <TopNavigation
              {...args}
              textType={tt}
              leadingType="icon"
              leadingSlot={leadingIcon}
              trailingSlot={trailingIcon}
              imageSlot={avatarSlot}
              logoSlot={logoSvg}
            />
          </div>
        ),
      )}
    </div>
  ),
};

export const Modes: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ color: "#666", fontFamily: "monospace", fontSize: 11 }}>mode=default, scrollBg=off</span>
        <TopNavigation {...args} mode="default" scrollBg="off" leadingType="icon" leadingSlot={leadingIcon} trailingSlot={trailingIcon} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ color: "#666", fontFamily: "monospace", fontSize: 11 }}>mode=default, scrollBg=on</span>
        <TopNavigation {...args} mode="default" scrollBg="on" leadingType="icon" leadingSlot={leadingIcon} trailingSlot={trailingIcon} />
      </div>
      <div style={{ background: "#181818", borderRadius: 8, display: "flex", flexDirection: "column", gap: 2, padding: "8px 0" }}>
        <span style={{ color: "#aaa", fontFamily: "monospace", fontSize: 11, paddingLeft: 8 }}>mode=fixed, scrollBg=on</span>
        <TopNavigation {...args} mode="fixed" scrollBg="on" leadingType="icon" leadingSlot={leadingIcon} trailingSlot={trailingIcon} />
      </div>
    </div>
  ),
};

export const SubTitleVariants: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ color: "#666", fontFamily: "monospace", fontSize: 11 }}>showSubTitle=true</span>
        <TopNavigation {...args} showSubTitle leadingType="icon" leadingSlot={leadingIcon} trailingSlot={trailingIcon} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ color: "#666", fontFamily: "monospace", fontSize: 11 }}>showSubTitle=false</span>
        <TopNavigation {...args} showSubTitle={false} leadingType="icon" leadingSlot={leadingIcon} trailingSlot={trailingIcon} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ color: "#666", fontFamily: "monospace", fontSize: 11 }}>showOfficialBadge=true</span>
        <TopNavigation {...args} showOfficialBadge leadingType="icon" leadingSlot={leadingIcon} trailingSlot={trailingIcon} />
      </div>
    </div>
  ),
};

export const NestedTypes: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {topNavigationLeadingTypeOptions.map((leadingType) => (
        <div key={leadingType} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span style={{ color: "#666", fontFamily: "monospace", fontSize: 11 }}>leadingType={leadingType}</span>
          <TopNavigation {...args} leadingType={leadingType} />
        </div>
      ))}
      {topNavigationTrailingCountOptions.map((trailingCount) => (
        <div key={trailingCount} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span style={{ color: "#666", fontFamily: "monospace", fontSize: 11 }}>trailingCount={trailingCount}</span>
          <TopNavigation {...args} trailingCount={trailingCount} />
        </div>
      ))}
    </div>
  ),
};

const topNavBaseline = new URL(
  "../../figma/baselines/top-navigation-center-default@3x.png",
  import.meta.url,
).href;
const figmaReferenceImageStyle = { display: "block", height: 48, width: 393 } as const;

export const FigmaCompare: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ alignItems: "flex-start", display: "flex", gap: 40 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={{ color: "#777", fontFamily: "monospace", fontSize: 11, fontWeight: 700 }}>
            Figma (node 64450:39561)
          </span>
          <img
            alt="Figma baseline: TopNavigation center default"
            src={topNavBaseline}
            style={figmaReferenceImageStyle}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={{ color: "#777", fontFamily: "monospace", fontSize: 11, fontWeight: 700 }}>
            Implementation
          </span>
          <TopNavigation
            {...args}
            mode="default"
            textType="center"
            scrollBg="off"
            leadingType="icon"
            leadingSlot={leadingIcon}
            trailingSlot={trailingIcon}
          />
        </div>
      </div>
    </div>
  ),
};
