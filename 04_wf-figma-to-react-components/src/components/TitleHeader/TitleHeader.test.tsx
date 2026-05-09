import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  TitleHeader,
  titleHeaderLeadingTypeOptions,
  titleHeaderTrailingTypeOptions,
} from "./TitleHeader";

describe("TitleHeader — mode & align", () => {
  it("renders with data-mode=default by default", () => {
    const { container } = render(<TitleHeader />);
    expect(container.querySelector("[data-mode='default']")).toBeTruthy();
  });

  it("renders with data-align=left by default", () => {
    const { container } = render(<TitleHeader />);
    expect(container.querySelector("[data-align='left']")).toBeTruthy();
  });

  it("renders data-mode=fixed when mode=fixed", () => {
    const { container } = render(<TitleHeader mode="fixed" />);
    expect(container.querySelector("[data-mode='fixed']")).toBeTruthy();
  });

  it("renders data-align=center when align=center", () => {
    const { container } = render(<TitleHeader align="center" />);
    expect(container.querySelector("[data-align='center']")).toBeTruthy();
  });
});

describe("TitleHeader — title label", () => {
  it("renders default titleLabel", () => {
    render(<TitleHeader titleLabel="My Title" />);
    expect(screen.getByText("My Title")).toBeTruthy();
  });

  it("renders custom titleLabel", () => {
    render(<TitleHeader titleLabel="Custom Title" />);
    expect(screen.getByText("Custom Title")).toBeTruthy();
  });

  it("records the Figma marquee prop as a data contract", () => {
    const { container } = render(<TitleHeader marquee />);
    expect(container.querySelector(".chord-title-header")).toHaveAttribute("data-marquee", "true");
  });
});

describe("TitleHeader — subtitle", () => {
  it("renders subtitle by default", () => {
    render(<TitleHeader subTitleLabel="Sub" />);
    expect(screen.getByText("Sub")).toBeTruthy();
  });

  it("hides subtitle when showSubTitle=false", () => {
    const { container } = render(<TitleHeader subTitleLabel="Sub" showSubTitle={false} />);
    expect(container.querySelector(".chord-title-header__subtitle-area")).toBeFalsy();
  });

  it("shows subtitle area when showSubTitle=true", () => {
    const { container } = render(<TitleHeader showSubTitle={true} />);
    expect(container.querySelector(".chord-title-header__subtitle-area")).toBeTruthy();
  });
});

describe("TitleHeader — trailing", () => {
  it("exposes nested trailing type options from Figma", () => {
    expect(titleHeaderTrailingTypeOptions).toEqual(["text-icon", "dropdown"]);
  });

  it("renders trailing area by default", () => {
    const { container } = render(<TitleHeader />);
    expect(container.querySelector(".chord-title-header__trailing")).toBeTruthy();
  });

  it("hides trailing when showTrailing=false", () => {
    const { container } = render(<TitleHeader showTrailing={false} />);
    expect(container.querySelector(".chord-title-header__trailing")).toBeFalsy();
  });

  it("renders trailingLabel text", () => {
    render(<TitleHeader trailingLabel="See all" />);
    expect(screen.getByText("See all")).toBeTruthy();
  });

  it("renders trailingSlot content", () => {
    render(<TitleHeader trailingSlot={<span data-testid="trail-icon" />} />);
    expect(screen.getByTestId("trail-icon")).toBeTruthy();
  });

  it("renders the dropdown trailing branch with a down icon", () => {
    const { container } = render(<TitleHeader trailingType="dropdown" />);
    const trailing = container.querySelector(".chord-title-header__trailing");
    expect(trailing).toHaveAttribute("data-trailing-type", "dropdown");
    expect(trailing?.querySelector(".chord-icon")).toHaveAttribute("data-icon-name", "arrowDownMedium");
  });

  it("honors trailing text and icon visibility booleans", () => {
    const { container } = render(
      <TitleHeader showTrailingText={false} showTrailingIcon={false} />,
    );
    const trailing = container.querySelector(".chord-title-header__trailing");
    expect(trailing?.querySelector(".chord-title-header__trailing-label")).toBeFalsy();
    expect(trailing?.querySelector(".chord-icon")).toBeFalsy();
  });
});

describe("TitleHeader — leading", () => {
  it("exposes nested leading type options from Figma", () => {
    expect(titleHeaderLeadingTypeOptions).toEqual(["icon", "avatar-group"]);
  });

  it("renders leading area by default", () => {
    const { container } = render(<TitleHeader />);
    expect(container.querySelector(".chord-title-header__leading")).toBeTruthy();
  });

  it("hides leading when showLeading=false", () => {
    const { container } = render(<TitleHeader showLeading={false} />);
    expect(container.querySelector(".chord-title-header__leading")).toBeFalsy();
  });

  it("renders leadingSlot content", () => {
    render(<TitleHeader leadingSlot={<span data-testid="lead-avatar" />} />);
    expect(screen.getByTestId("lead-avatar")).toBeTruthy();
  });

  it("renders avatar-group leading branch by composing Avatar", () => {
    const { container } = render(<TitleHeader align="left" leadingType="avatar-group" />);
    const leading = container.querySelector(".chord-title-header__leading");
    expect(leading).toHaveAttribute("data-leading-type", "avatar-group");
    expect(leading?.querySelector(".chord-avatar")).toBeTruthy();
  });

  it("forces center alignment leading to the icon branch", () => {
    const { container } = render(<TitleHeader align="center" leadingType="avatar-group" />);
    const leading = container.querySelector(".chord-title-header__leading");
    expect(leading).toHaveAttribute("data-leading-type", "icon");
    expect(leading).toHaveAttribute("data-requested-leading-type", "avatar-group");
  });
});

describe("TitleHeader — title badge group", () => {
  it("renders title badge group by default", () => {
    const { container } = render(<TitleHeader />);
    expect(container.querySelector(".chord-title-header__title-badge")).toBeTruthy();
  });

  it("hides title badge group when showTitleBadge=false", () => {
    const { container } = render(<TitleHeader showTitleBadge={false} />);
    expect(container.querySelector(".chord-title-header__title-badge")).toBeFalsy();
  });

  it("renders nullMedium icon for badge1 when no slot provided", () => {
    const { container } = render(<TitleHeader showTitleBadge={true} showBadge1={true} showBadge2={false} />);
    expect(container.querySelector('.chord-title-header__title-badge [data-icon-name="nullMedium"]')).toBeTruthy();
  });

  it("renders nullMedium icon for badge2 when no slot provided", () => {
    const { container } = render(<TitleHeader showTitleBadge={true} showBadge1={false} showBadge2={true} />);
    expect(container.querySelector('.chord-title-header__title-badge [data-icon-name="nullMedium"]')).toBeTruthy();
  });

  it("renders badge1Slot content", () => {
    render(<TitleHeader badge1Slot={<span data-testid="b1" />} />);
    expect(screen.getByTestId("b1")).toBeTruthy();
  });

  it("renders badge2Slot content", () => {
    render(<TitleHeader badge2Slot={<span data-testid="b2" />} />);
    expect(screen.getByTestId("b2")).toBeTruthy();
  });

  it("hides badge1 when showBadge1=false", () => {
    const { container } = render(<TitleHeader badge1Slot={<span data-testid="b1" />} showBadge1={false} />);
    expect(container.querySelector("[data-testid='b1']")).toBeFalsy();
  });

  it("hides badge2 when showBadge2=false", () => {
    const { container } = render(<TitleHeader badge2Slot={<span data-testid="b2" />} showBadge2={false} />);
    expect(container.querySelector("[data-testid='b2']")).toBeFalsy();
  });
});

describe("TitleHeader — sub badge", () => {
  it("renders nullMedium icon for subBadge when no slot provided", () => {
    const { container } = render(<TitleHeader showSubBadge={true} showSubTitle={true} />);
    expect(container.querySelector('.chord-title-header__subtitle-area [data-icon-name="nullMedium"]')).toBeTruthy();
  });

  it("renders subBadgeSlot when showSubBadge=true and showSubTitle=true", () => {
    render(<TitleHeader showSubBadge={true} subBadgeSlot={<span data-testid="sb" />} showSubTitle={true} />);
    expect(screen.getByTestId("sb")).toBeTruthy();
  });

  it("hides subBadge when showSubBadge=false", () => {
    const { container } = render(
      <TitleHeader showSubBadge={false} subBadgeSlot={<span data-testid="sb" />} showSubTitle={true} />
    );
    expect(container.querySelector("[data-testid='sb']")).toBeFalsy();
  });
});

describe("TitleHeader — multiple title slot", () => {
  it("shows multipleTitleSlot when showTitleMultiple=true", () => {
    render(<TitleHeader showTitleMultiple={true} multipleTitleSlot={<span data-testid="mt" />} />);
    expect(screen.getByTestId("mt")).toBeTruthy();
  });

  it("hides multipleTitleSlot when showTitleMultiple=false", () => {
    const { container } = render(
      <TitleHeader showTitleMultiple={false} multipleTitleSlot={<span data-testid="mt" />} />
    );
    expect(container.querySelector("[data-testid='mt']")).toBeFalsy();
  });
});

describe("TitleHeader — multiple subtitle slot", () => {
  it("shows multipleSubTitleSlot when showSubTitleMultiple=true and showSubTitle=true", () => {
    render(
      <TitleHeader
        showSubTitleMultiple={true}
        showSubTitle={true}
        multipleSubTitleSlot={<span data-testid="mst" />}
      />
    );
    expect(screen.getByTestId("mst")).toBeTruthy();
  });

  it("hides multipleSubTitleSlot when showSubTitleMultiple=false", () => {
    const { container } = render(
      <TitleHeader
        showSubTitleMultiple={false}
        showSubTitle={true}
        multipleSubTitleSlot={<span data-testid="mst" />}
      />
    );
    expect(container.querySelector("[data-testid='mst']")).toBeFalsy();
  });
});

describe("TitleHeader — multiple metadata slot", () => {
  it("renders multipleSlot content when showSubTitleMultiple=true", () => {
    render(
      <TitleHeader showSubTitleMultiple={true} showSubTitle={true} multipleSlot={<span data-testid="ms" />} />
    );
    expect(screen.getByTestId("ms")).toBeTruthy();
  });
});

describe("TitleHeader — class", () => {
  it("has chord-title-header root class", () => {
    const { container } = render(<TitleHeader />);
    expect(container.querySelector(".chord-title-header")).toBeTruthy();
  });
});
