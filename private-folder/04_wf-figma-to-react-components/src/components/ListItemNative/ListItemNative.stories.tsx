import type { Meta, StoryObj } from "@storybook/react";
import { ListItemNative } from "./ListItemNative";
import {
  listItemNativeLeadingTypeOptions,
  listItemNativeBodyTextColorOptions,
  listItemNativeModeOptions,
  listItemNativeSizeOptions,
  listItemNativeStatusOptions,
  listItemNativeTextWeightOptions,
  listItemNativeTitleTextColorOptions,
  listItemNativeTrailingTypeOptions,
} from "./ListItemNative";
import "./ListItemNative.css";

const listItemNativeBaseline = new URL("../../figma/baselines/list-item-native-default.png", import.meta.url).href;

const figmaControlNames = [
  "mode",
  "size",
  "status",
  "showDivider",
  "showTrailing",
  "showSmallLeading",
  "showMediumLeading",
  "leadingType",
  "showBodyText",
  "showTitleBadge",
  "bodyLeadingIcon",
  "titleTextWeight",
  "titleTextColor",
  "bodyTextWeight",
  "bodyTextColor",
  "trailingType",
  "trailingShowIcon",
  "trailingShowText",
] as const;

const argTypes = {
  bodyLeadingIcon: { control: { type: "boolean" } },
  bodyTextColor: { control: { type: "inline-radio" }, options: listItemNativeBodyTextColorOptions },
  bodyTextWeight: { control: { type: "inline-radio" }, options: listItemNativeTextWeightOptions },
  mode: { control: { type: "inline-radio" }, options: listItemNativeModeOptions },
  showBodyText: { control: { type: "boolean" } },
  showDivider: { control: { type: "boolean" } },
  showMediumLeading: { control: { type: "boolean" } },
  showSmallLeading: { control: { type: "boolean" } },
  showTitleBadge: { control: { type: "boolean" } },
  showTrailing: { control: { type: "boolean" } },
  leadingType: { control: { type: "select" }, options: listItemNativeLeadingTypeOptions },
  size: { control: { type: "inline-radio" }, options: listItemNativeSizeOptions },
  status: { control: { type: "select" }, options: listItemNativeStatusOptions },
  titleTextColor: { control: { type: "inline-radio" }, options: listItemNativeTitleTextColorOptions },
  titleTextWeight: { control: { type: "inline-radio" }, options: listItemNativeTextWeightOptions },
  trailingShowIcon: { control: { type: "boolean" } },
  trailingShowText: { control: { type: "boolean" } },
  trailingType: { control: { type: "select" }, options: listItemNativeTrailingTypeOptions },
} as const;

const meta = {
  title: "Atoms/ListItemNative",
  component: ListItemNative,
  args: {
    mode: "default",
    bodyLeadingIcon: true,
    bodyTextColor: "default",
    bodyTextWeight: "regular",
    showBodyText: true,
    showDivider: true,
    showMediumLeading: true,
    showSmallLeading: true,
    showTitleBadge: false,
    showTrailing: true,
    leadingType: "squareThumbnail",
    size: "medium",
    status: "default",
    titleTextColor: "default",
    titleTextWeight: "bold",
    trailingShowIcon: true,
    trailingShowText: true,
    trailingType: "textAndIcon",
  },
  argTypes,
  parameters: {
    controls: { include: [...figmaControlNames] },
    docs: {
      description: {
        component:
          "Figma node 57343:18628 기반 ListItemNative입니다. 현재 구현 coverage는 complete/deep-inventoried입니다. Leading/Content/Trailing은 Console MCP deep read와 REST로 전체 enum branch를 확인했습니다. FigmaCompare는 media fixture 차이 때문에 structure-only입니다.",
      },
    },
  },
} satisfies Meta<typeof ListItemNative>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div style={{ display: "grid", gap: 16 }}>
      {listItemNativeModeOptions.map((mode) => (
        <div key={mode} style={{ background: mode === "fixed" ? "#111" : "#fff", display: "grid", gap: 8, padding: 12 }}>
          {listItemNativeSizeOptions.map((size) => (
            <ListItemNative {...args} key={`${mode}-${size}`} mode={mode} size={size} />
          ))}
        </div>
      ))}
    </div>
  ),
};

export const States: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div style={{ display: "grid", gap: 8 }}>
      {listItemNativeStatusOptions.map((status) => (
        <ListItemNative {...args} key={status} status={status} />
      ))}
    </div>
  ),
};

export const OptionalSlots: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div style={{ display: "grid", gap: 8 }}>
      <ListItemNative {...args} />
      <ListItemNative {...args} showTrailing={false} />
      <ListItemNative {...args} showDivider={false} />
      <ListItemNative {...args} showMediumLeading={false} />
      <ListItemNative {...args} showSmallLeading={false} size="small" />
    </div>
  ),
};

export const ModuleBranches: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div style={{ display: "grid", gap: 20 }}>
      <div style={{ display: "grid", gap: 8 }}>
        <span style={{ color: "#666", fontSize: 12, fontWeight: 700 }}>Leading Type</span>
        {listItemNativeLeadingTypeOptions.map((leadingType) => (
          <ListItemNative {...args} key={leadingType} leadingType={leadingType} />
        ))}
      </div>
      <div style={{ display: "grid", gap: 8 }}>
        <span style={{ color: "#666", fontSize: 12, fontWeight: 700 }}>Trailing Type</span>
        {listItemNativeTrailingTypeOptions.map((trailingType) => (
          <ListItemNative {...args} key={trailingType} trailingType={trailingType} />
        ))}
      </div>
    </div>
  ),
};

export const ContentBranches: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div style={{ display: "grid", gap: 20 }}>
      <div style={{ display: "grid", gap: 8 }}>
        <span style={{ color: "#666", fontSize: 12, fontWeight: 700 }}>Title Text</span>
        {listItemNativeTextWeightOptions.flatMap((titleTextWeight) =>
          listItemNativeTitleTextColorOptions.map((titleTextColor) => (
            <ListItemNative
              {...args}
              key={`${titleTextWeight}-${titleTextColor}`}
              showTitleBadge
              titleTextColor={titleTextColor}
              titleTextWeight={titleTextWeight}
            />
          )),
        )}
      </div>
      <div style={{ display: "grid", gap: 8 }}>
        <span style={{ color: "#666", fontSize: 12, fontWeight: 700 }}>Body Text</span>
        {listItemNativeTextWeightOptions.flatMap((bodyTextWeight) =>
          listItemNativeBodyTextColorOptions.map((bodyTextColor) => (
            <ListItemNative
              {...args}
              bodyTextColor={bodyTextColor}
              bodyTextWeight={bodyTextWeight}
              key={`${bodyTextWeight}-${bodyTextColor}`}
            />
          )),
        )}
      </div>
    </div>
  ),
};

export const TitleBadge: Story = {
  args: {
    bodyLeadingIcon: true,
    leadingType: "avatar",
    mode: "default",
    showBodyText: true,
    showDivider: true,
    showMediumLeading: true,
    showSmallLeading: true,
    showTitleBadge: true,
    showTrailing: true,
    size: "medium",
    status: "default",
    trailingType: "iconButton",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Figma node 81275:904969 badge placement check. The title badge uses a 4x22 wrapper frame with 2px top padding; the nested visible BadgeDot remains 4x4.",
      },
    },
  },
};

export const LongText: Story = {
  args: {
    bodyLeadingIcon: true,
    bodyText: "Body Text",
    detailText: "Detail",
    leadingType: "squareThumbnail",
    mode: "default",
    showBodyText: true,
    showDivider: true,
    showMediumLeading: true,
    showSmallLeading: true,
    showTitleBadge: true,
    showTrailing: true,
    size: "medium",
    status: "default",
    textOverflow: "wrap",
    title: "asdfadsfkadsjflkadsjflkjadslkfjadsflkfjladskjf",
    trailingType: "textAndIcon",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Long unbroken text check. Default textOverflow=wrap lets the row grow with text height. Clip and ellipsis remain explicit runtime opt-ins.",
      },
    },
  },
};

export const FigmaCompare: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div style={{ alignItems: "start", display: "grid", gap: 16 }}>
      <div style={{ display: "grid", gap: 8 }}>
        <span style={{ color: "#666", fontSize: 12, fontWeight: 700 }}>Figma reference: 57343:18665</span>
        <img
          alt="Figma ListItemNative reference"
          data-testid="list-item-native-figma-reference"
          src={listItemNativeBaseline}
          style={{ display: "block", height: 81, objectFit: "contain", objectPosition: "left top", width: 393 }}
        />
      </div>
      <div style={{ display: "grid", gap: 8 }}>
        <span style={{ color: "#666", fontSize: 12, fontWeight: 700 }}>Current implementation</span>
        <ListItemNative {...args} mode="default" size="medium" status="default" />
      </div>
      <span style={{ color: "#777", fontSize: 12 }}>
        Complete/deep-inventoried branch coverage, structure-only visual comparison. The Figma reference uses its sampled media image, while the
        implementation uses the nested Thumbnail no-image state unless the consumer supplies thumbnailSrc. Leading and
        trailing module branches are covered by Console MCP deep read and REST.
      </span>
    </div>
  ),
};
