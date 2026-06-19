import type { Meta, StoryObj } from "@storybook/react";
import {
  FloatingActionButton,
  floatingActionButtonFunctionOptions,
  floatingActionButtonModeOptions,
} from "./FloatingActionButton";

const meta = {
  title: "Atoms/FloatingActionButton",
  component: FloatingActionButton,
  parameters: { layout: "centered" },
  argTypes: {
    mode: { control: "select", options: floatingActionButtonModeOptions },
    fabFunction: { control: "select", options: floatingActionButtonFunctionOptions },
  },
  args: {
    mode: "default",
    fabFunction: "goToTop",
    "aria-label": "위로 가기",
  },
} satisfies Meta<typeof FloatingActionButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const GoToTop: Story = {
  args: { fabFunction: "goToTop", "aria-label": "위로 가기" },
};

export const GoToBottom: Story = {
  args: { fabFunction: "goToBottom", "aria-label": "아래로 가기" },
};

export const FixedGoToTop: Story = {
  name: "Fixed / Go to Top",
  parameters: { backgrounds: { default: "dark" } },
  args: { mode: "fixed", fabFunction: "goToTop", "aria-label": "위로 가기" },
};

export const FixedGoToBottom: Story = {
  name: "Fixed / Go to Bottom",
  parameters: { backgrounds: { default: "dark" } },
  args: { mode: "fixed", fabFunction: "goToBottom", "aria-label": "아래로 가기" },
};

export const VisualGoToTop: Story = {
  name: "Visual / Go to Top",
  args: { fabFunction: "goToTop", "aria-label": "위로 가기" },
};

export const VisualGoToBottom: Story = {
  name: "Visual / Go to Bottom",
  args: { fabFunction: "goToBottom", "aria-label": "아래로 가기" },
};
