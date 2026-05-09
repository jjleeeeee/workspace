import type { Meta, StoryObj } from "@storybook/react";
import { ChordIcon } from "../../assets/chord-icons";
import { Chips } from "./Chips";
import type { ChipsMode, ChipsRadius, ChipsSize, ChipsState, ChipsType } from "./Chips";

const chipsBaseline = new URL("../../figma/baselines/chips-default@3x.png", import.meta.url).href;
const chipsBadgeDotBaseline = new URL("../../figma/baselines/chips-badge-dot@3x.png", import.meta.url).href;
const chipsImageFixture = new URL("../../figma/fixtures/chips-img.png", import.meta.url).href;

const figmaControlNames = [
  "badge",
  "badgeNumber",
  "label",
  "marquee",
  "mode",
  "radius",
  "size",
  "state",
  "type",
] as const;

const modeOptions: ChipsMode[] = ["default", "fixed"];
const sizeOptions: ChipsSize[] = ["small", "medium"];
const typeOptions: ChipsType[] = ["text", "icon", "image"];
const stateOptions: ChipsState[] = [
  "default",
  "filled-selected",
  "outlined-selected",
  "filled-disabled",
  "outlined-disabled",
];
const radiusOptions: ChipsRadius[] = ["on", "off"];

const argTypes = {
  badge: { control: { type: "boolean" } },
  badgeNumber: { control: { type: "boolean" } },
  label: { control: { type: "text" } },
  marquee: { control: { type: "boolean" } },
  mode: { control: { type: "inline-radio" }, options: modeOptions },
  radius: { control: { type: "inline-radio" }, options: radiusOptions },
  size: { control: { type: "inline-radio" }, options: sizeOptions },
  state: { control: { type: "select" }, options: stateOptions },
  type: { control: { type: "inline-radio" }, options: typeOptions },
} as const;

const meta = {
  title: "Atoms/Chips",
  component: Chips,
  args: {
    badge: false,
    badgeNumber: false,
    label: "Text",
    marquee: false,
    mode: "default",
    radius: "on",
    size: "small",
    state: "default",
    type: "text",
  },
  argTypes,
  parameters: {
    controls: { include: [...figmaControlNames] },
    docs: {
      description: {
        component:
          "Figma node 59869:78921 기반 Chips입니다. Source note: src/figma/chips.source.md. " +
          "Badge_Dot/Badge_Number는 기존 atom을 조합하고, Type=Icon 기본값은 Figma null icon marker입니다. " +
          "Type=Image는 Size=Medium 전용이며 Small/Image는 Text로 normalize됩니다.",
      },
    },
  },
} satisfies Meta<typeof Chips>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    label: "Text",
    radius: "off",
    size: "medium",
  },
};

export const Types: Story = {
  render: (args) => (
    <div style={{ alignItems: "center", display: "flex", flexWrap: "wrap", gap: 8 }}>
      <Chips {...args} label="Text" type="text" />
      <Chips {...args} icon={<ChordIcon name="nullMedium" size={16} />} label="Text" type="icon" />
      <Chips
        {...args}
        image={<img alt="" height={24} src={chipsImageFixture} width={24} />}
        label="Text"
        size="medium"
        type="image"
      />
    </div>
  ),
};

export const States: Story = {
  render: (args) => (
    <div style={{ alignItems: "center", display: "flex", flexWrap: "wrap", gap: 8 }}>
      {stateOptions.map((state) => (
        <Chips {...args} key={state} label={state} state={state} />
      ))}
    </div>
  ),
};

export const Badges: Story = {
  render: (args) => (
    <div style={{ alignItems: "center", display: "flex", flexWrap: "wrap", gap: 8 }}>
      <Chips {...args} badge label="Badge" />
      <Chips {...args} badgeNumber label="Number" />
      <Chips {...args} badge badgeNumber label="Number wins" />
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ alignItems: "center", display: "flex", flexWrap: "wrap", gap: 8 }}>
      {sizeOptions.map((size) =>
        radiusOptions.map((radius) => (
          <Chips {...args} key={`${size}-${radius}`} label={`${size} / ${radius}`} radius={radius} size={size} />
        )),
      )}
    </div>
  ),
};

export const Modes: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 12, justifyItems: "start" }}>
      <div style={{ alignItems: "center", display: "flex", flexWrap: "wrap", gap: 8 }}>
        {stateOptions.map((state) => (
          <Chips {...args} key={state} label="Default" mode="default" state={state} />
        ))}
      </div>
      <div style={{ alignItems: "center", background: "#222", display: "flex", flexWrap: "wrap", gap: 8, padding: 8 }}>
        {stateOptions.map((state) => (
          <Chips {...args} key={state} label="Fixed" mode="fixed" state={state} />
        ))}
      </div>
    </div>
  ),
};

export const FigmaCompare: Story = {
  args: {
    label: "Text",
    mode: "default",
    radius: "off",
    size: "medium",
    state: "default",
    type: "text",
  },
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div style={{ display: "grid", gap: 12, justifyItems: "start" }}>
      <img alt="Figma Chips reference" src={chipsBaseline} style={{ height: 36, width: 57 }} />
      <Chips {...args} />
    </div>
  ),
};

export const BadgeDotCompare: Story = {
  args: {
    badge: true,
    label: "Text",
    mode: "default",
    radius: "on",
    size: "small",
    state: "outlined-selected",
    type: "icon",
  },
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div style={{ display: "grid", gap: 12, justifyItems: "start" }}>
      <img alt="Figma Chips badge dot reference" src={chipsBadgeDotBaseline} style={{ height: 32, width: 85 }} />
      <Chips {...args} />
    </div>
  ),
};
