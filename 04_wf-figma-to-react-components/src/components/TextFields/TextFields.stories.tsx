import type { Meta, StoryObj } from "@storybook/react";

import { TextFields } from "./TextFields";
import type { TextFieldsLines, TextFieldsMode, TextFieldsStatus } from "./TextFields";

const textFieldsDefaultBaseline = new URL(
  "../../figma/baselines/text-fields-default@3x.png",
  import.meta.url,
).href;

const figmaControlNames = [
  "characterCounter",
  "countryCode",
  "guideMessage",
  "lines",
  "mode",
  "scrollbar",
  "showBadgeDot",
  "showTitle",
  "status",
] as const;

const modeOptions: TextFieldsMode[] = ["default", "fixed"];
const linesOptions: TextFieldsLines[] = ["single", "multiple"];
const statusOptions: TextFieldsStatus[] = ["default", "disabled", "enabled", "error", "success"];

const argTypes = {
  characterCounter: { control: { type: "boolean" } },
  countryCode: { control: { type: "boolean" } },
  guideMessage: { control: { type: "boolean" } },
  lines: { control: { type: "inline-radio" }, options: linesOptions },
  mode: { control: { type: "inline-radio" }, options: modeOptions },
  scrollbar: { control: { type: "boolean" } },
  showBadgeDot: { control: { type: "boolean" } },
  showTitle: { control: { type: "boolean" } },
  status: { control: { type: "select" }, options: statusOptions },
} as const;

const meta = {
  title: "Atoms/TextFields",
  component: TextFields,
  args: {
    characterCounter: true,
    countryCode: true,
    guideMessage: true,
    lines: "single",
    mode: "default",
    scrollbar: true,
    showBadgeDot: true,
    showTitle: true,
    status: "default",
  },
  argTypes,
  parameters: {
    controls: { include: [...figmaControlNames] },
    docs: {
      description: {
        component:
          "Figma node 62030:25225 기반 Text Fields입니다. Source note: src/figma/text-fields.source.md. " +
          "Coverage: partial/default-branch. " +
          "Lines=Single은 native <input>, Lines=Multiple은 native <textarea>를 사용합니다. " +
          "Default/Single/Default의 visible Input branch는 country code, divider, Text Button, timer, Guide Message까지 구현되어 있습니다. " +
          "clear/check/eye/caret과 Guide Message Text Button case는 deferred입니다.",
      },
    },
  },
} satisfies Meta<typeof TextFields>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Lines: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <TextFields {...args} lines="single" titleLabel="Single Line" />
      <TextFields {...args} lines="multiple" titleLabel="Multiple Lines" multiLineLabel="" />
    </div>
  ),
};

export const Statuses: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {statusOptions.map((status) => (
        <TextFields {...args} key={status} status={status} titleLabel={status} />
      ))}
    </div>
  ),
};

export const Modes: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      <div style={{ padding: 24, background: "#f5f5f5" }}>
        <TextFields {...args} mode="default" titleLabel="Default Mode" />
      </div>
      <div style={{ padding: 24, background: "#1a1a1a" }}>
        <TextFields {...args} mode="fixed" titleLabel="Fixed Mode" />
      </div>
    </div>
  ),
};

export const MultipleVariants: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {statusOptions.map((status) => (
        <TextFields
          {...args}
          key={status}
          lines="multiple"
          status={status}
          titleLabel={status}
          multiLineLabel="여러 줄 텍스트 입력 영역입니다."
        />
      ))}
    </div>
  ),
};

export const FigmaCompare: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: "grid", gap: 16, justifyItems: "start" }}>
      <div>
        <p style={{ fontSize: 11, color: "#888", margin: "0 0 4px" }}>
          Figma: Default / Single / Default
        </p>
        <img
          alt="Figma Text Fields reference — Default/Single/Default"
          src={textFieldsDefaultBaseline}
          style={{ width: 393, height: 95, display: "block" }}
        />
      </div>
      <p style={{ fontSize: 11, color: "#777", margin: 0, maxWidth: 393 }}>
        Local parity compare for Default / Single / Default. Other Input branches remain deferred.
      </p>
      <TextFields
        mode="default"
        lines="single"
        status="default"
        showTitle
        titleLabel="Title"
        showBadgeDot
        characterCounter
        characterCounterLabel="12/200"
        countryCode
        guideMessage
      />
    </div>
  ),
};
