import type { Meta, StoryObj } from "@storybook/react";
import { Stepper } from "./Stepper";
import type { StepperMode, StepperState } from "./Stepper";
import "./Stepper.css";

const stepperBaseline = new URL("../../figma/baselines/stepper-default@3x.png", import.meta.url).href;
const figmaControlNames = ["caret", "label", "mode", "state"] as const;

const modeOptions: StepperMode[] = ["default", "fixed"];
const stateOptions: StepperState[] = ["default", "disabled", "enabled"];

const argTypes = {
  caret: { control: { type: "boolean" } },
  label: { control: { type: "text" } },
  mode: { control: { type: "inline-radio" }, options: modeOptions },
  state: { control: { type: "inline-radio" }, options: stateOptions },
} as const;

const meta = {
  title: "Atoms/Stepper",
  component: Stepper,
  args: {
    caret: false,
    label: "99",
    mode: "default",
    state: "default",
  },
  argTypes,
  parameters: {
    controls: { include: [...figmaControlNames] },
    docs: {
      description: {
        component:
          "Figma node 61604:4394 기반 Stepper입니다. Source note: src/figma/stepper.source.md. Plus/minus are mapped through the shared DS icon registry.",
      },
    },
  },
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={{ alignItems: "center", display: "grid", gap: 16, justifyItems: "start" }}>
      {modeOptions.map((mode) =>
        stateOptions.map((state) => <Stepper {...args} key={`${mode}-${state}`} mode={mode} state={state} />),
      )}
    </div>
  ),
};

export const States: Story = {
  render: (args) => (
    <div style={{ alignItems: "center", display: "flex", flexWrap: "wrap", gap: 16 }}>
      <Stepper {...args} state="default" label="0" />
      <Stepper {...args} state="enabled" label="12" />
      <Stepper {...args} state="disabled" label="99" />
      <Stepper {...args} state="enabled" label="45" caret />
    </div>
  ),
};

export const FigmaCompare: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div style={{ display: "grid", gap: 12 }}>
      <img alt="Figma Stepper reference" src={stepperBaseline} style={{ height: 28, width: 104 }} />
      <Stepper {...args} caret={false} label="99" mode="default" state="default" />
      <span style={{ color: "#777", fontSize: 12 }}>Plus/minus marks use exported DS SVG assets, not text glyphs.</span>
    </div>
  ),
};
