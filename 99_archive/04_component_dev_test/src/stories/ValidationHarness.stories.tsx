import type { Meta, StoryObj } from "@storybook/react";
import {
  BadgeDot,
  BadgeNumber,
  Checkbox,
  CircularProgressIndicator,
  Divider,
  IconButton,
  LinearProgressIndicator,
  LoadingCircular,
  LoadingDot,
  Radio,
  ScrimOverlay,
  Scrollbar,
  SelectNumberBox,
  Skeleton,
  TextButton,
  ToggleSwitch,
} from "../components";
import { TokenProbe } from "../harness/TokenProbe";

function HarnessOverview() {
  return (
    <div style={{ display: "grid", gap: 28, width: "min(920px, 100vw - 48px)" }}>
      <section style={{ display: "grid", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 16, minHeight: 44 }}>
          <BadgeDot aria-label="Unread" outline="on" size="large" />
          <BadgeNumber count={1000} aria-label="Unread count" />
          <SelectNumberBox aria-label="Selected item order" state="selected" value={3} />
          <LoadingDot aria-label="Loading dots" />
          <LoadingCircular aria-label="Circular loading" />
          <CircularProgressIndicator aria-label="Circular progress" value={64} />
          <Skeleton aria-label="Loading text" type="text" width={180} />
          <TextButton radius="on" size="small" showTrailing>
            Action
          </TextButton>
          <IconButton aria-label="More actions" radius="on" size="small" />
          <Checkbox aria-label="Agreement selected" shape="square" status="enabled" />
          <Radio aria-label="Option selected" status="enabled" />
          <ToggleSwitch aria-label="Notifications on" status="on" />
        </div>
        <LinearProgressIndicator aria-label="Linear progress" value={48} />
        <Divider height="2" />
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ width: 160, height: 96 }}>
            <ScrimOverlay aria-label="Scrim preview" opacity={0.5} />
          </div>
          <Scrollbar aria-label="Scroll preview" state="dragging" value={40} />
        </div>
      </section>
      <TokenProbe />
    </div>
  );
}

const meta = {
  title: "Harness/Atom Catalog",
  component: HarnessOverview,
  parameters: {
    docs: {
      description: {
        component: "현재 구현된 atom 16개와 token CSS 변수 로딩 상태를 한 화면에서 확인하는 검증 하네스입니다.",
      },
    },
  },
} satisfies Meta<typeof HarnessOverview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {};
