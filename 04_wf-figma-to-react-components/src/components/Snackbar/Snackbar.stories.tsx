import type { Meta, StoryObj } from "@storybook/react";
import { Snackbar } from "./Snackbar";
import "./Snackbar.css";

const snackbarBaseline = new URL("../../figma/baselines/snackbar-default@3x.png", import.meta.url).href;
const figmaControlNames = ["actionLabel", "icon", "label", "mode"] as const;

const argTypes = {
  actionLabel: { control: { type: "text" } },
  icon: { control: { type: "boolean" } },
  label: { control: { type: "text" } },
  mode: { control: { type: "inline-radio" }, options: ["default", "fixed"] },
} as const;

const meta = {
  title: "Atoms/Snackbar",
  component: Snackbar,
  args: {
    actionLabel: "Retry",
    icon: false,
    label: "Translate it into the following language.",
    mode: "default",
  },
  argTypes,
  parameters: {
    controls: { include: [...figmaControlNames] },
    docs: {
      description: {
        component:
          "Figma node 63694:5774 기반 Snackbar입니다. Source note: src/figma/snackbar.source.md. Optional default icon maps to the DS question icon asset.",
      },
    },
  },
} satisfies Meta<typeof Snackbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={{ alignItems: "center", display: "grid", gap: 16, justifyItems: "start" }}>
      <Snackbar {...args} mode="default" />
      <Snackbar {...args} mode="fixed" />
      <Snackbar {...args} icon />
    </div>
  ),
};

export const States: Story = {
  render: (args) => (
    <div style={{ alignItems: "center", display: "grid", gap: 16, justifyItems: "start", width: 430 }}>
      <Snackbar {...args} label="Saved" actionLabel="Undo" />
      <Snackbar {...args} />
      <Snackbar
        {...args}
        icon
        label="긴 메시지는 최대 세 줄까지만 표시되며 선택적 후속 조치가 필요한 상황에서만 Snackbar를 사용합니다"
      />
    </div>
  ),
};

export const FigmaCompare: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div style={{ display: "grid", gap: 12 }}>
      <img
        alt="Figma Snackbar reference"
        src={snackbarBaseline}
        style={{ height: 44, objectFit: "contain", objectPosition: "left", width: 373 }}
      />
      <Snackbar
        {...args}
        actionLabel="Retry"
        icon={false}
        label="Translate it into the following language."
        mode="default"
      />
      <span style={{ color: "#777", fontSize: 12 }}>
        Optional icon uses the mapped DS question-mark asset unless an iconSlot override is supplied.
      </span>
    </div>
  ),
};
