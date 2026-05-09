import { render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { TextFields } from "./TextFields";

const css = readFileSync(join(process.cwd(), "src/components/TextFields/TextFields.css"), "utf8");
const sourceNote = readFileSync(join(process.cwd(), "src/figma/text-fields.source.md"), "utf8");

describe("TextFields", () => {
  it("renders the Figma default contract", () => {
    render(<TextFields data-testid="tf" />);
    const el = screen.getByTestId("tf");

    expect(el).toHaveAttribute("data-mode", "default");
    expect(el).toHaveAttribute("data-lines", "single");
    expect(el).toHaveAttribute("data-status", "default");
  });

  it("reflects mode, lines, status as data attributes", () => {
    render(<TextFields mode="fixed" lines="multiple" status="error" data-testid="tf" />);
    const el = screen.getByTestId("tf");

    expect(el).toHaveAttribute("data-mode", "fixed");
    expect(el).toHaveAttribute("data-lines", "multiple");
    expect(el).toHaveAttribute("data-status", "error");
  });

  it("renders title row when showTitle is true", () => {
    const { container } = render(<TextFields showTitle titleLabel="이름" data-testid="tf" />);

    expect(container.querySelector(".chord-text-fields__title")).toBeInTheDocument();
    expect(screen.getByText("이름")).toBeInTheDocument();
  });

  it("hides title row when showTitle is false", () => {
    const { container } = render(<TextFields showTitle={false} data-testid="tf" />);

    expect(container.querySelector(".chord-text-fields__title")).not.toBeInTheDocument();
  });

  it("renders BadgeDot when showBadgeDot is true and title is visible", () => {
    const { container } = render(<TextFields showTitle showBadgeDot data-testid="tf" />);

    expect(container.querySelector(".chord-badge-dot")).toBeInTheDocument();
  });

  it("does not render BadgeDot when showBadgeDot is false", () => {
    const { container } = render(<TextFields showTitle showBadgeDot={false} data-testid="tf" />);

    expect(container.querySelector(".chord-badge-dot")).not.toBeInTheDocument();
  });

  it("renders character counter when characterCounter is true", () => {
    const { container } = render(
      <TextFields showTitle characterCounter characterCounterLabel="5/100" data-testid="tf" />,
    );

    expect(container.querySelector(".chord-text-fields__counter")).toBeInTheDocument();
    expect(screen.getByText("5/100")).toBeInTheDocument();
  });

  it("hides character counter when characterCounter is false", () => {
    const { container } = render(<TextFields showTitle characterCounter={false} data-testid="tf" />);

    expect(container.querySelector(".chord-text-fields__counter")).not.toBeInTheDocument();
  });

  it("renders a single-line input for lines=single", () => {
    const { container } = render(<TextFields lines="single" data-testid="tf" />);

    expect(container.querySelector("input")).toBeInTheDocument();
    expect(container.querySelector("textarea")).not.toBeInTheDocument();
  });

  it("renders a textarea for lines=multiple", () => {
    const { container } = render(<TextFields lines="multiple" data-testid="tf" />);

    expect(container.querySelector("textarea")).toBeInTheDocument();
    expect(container.querySelector("input")).not.toBeInTheDocument();
  });

  it("renders country code area when countryCode is true and lines=single", () => {
    const { container } = render(<TextFields lines="single" countryCode data-testid="tf" />);

    expect(container.querySelector(".chord-text-fields__country-code")).toBeInTheDocument();
  });

  it("renders the Default/Single/Input nested default branch instead of an empty shell", () => {
    const { container } = render(<TextFields data-testid="tf" />);

    expect(screen.getByText("+82")).toBeInTheDocument();
    expect(screen.getByTestId("text-fields-country-code-chevron")).toHaveAttribute(
      "data-icon-name",
      "arrowDownMedium",
    );
    expect(screen.getByTestId("text-fields-country-code-divider")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("일이삼사오육")).toBeInTheDocument();
    expect(container.querySelector(".chord-text-button")).toHaveAttribute("data-size", "xxsmall");
    expect(container.querySelector(".chord-text-button")).toHaveAttribute("data-button-type", "outlinedGray");
    expect(screen.getByText("02:13")).toBeInTheDocument();
    expect(screen.getByText("Guide Message")).toBeInTheDocument();
  });

  it("does not render country code when lines=multiple", () => {
    const { container } = render(<TextFields lines="multiple" countryCode data-testid="tf" />);

    expect(container.querySelector(".chord-text-fields__country-code")).not.toBeInTheDocument();
  });

  it("renders Scrollbar when scrollbar is true and lines=multiple", () => {
    const { container } = render(<TextFields lines="multiple" scrollbar data-testid="tf" />);

    expect(container.querySelector(".chord-scrollbar")).toBeInTheDocument();
  });

  it("does not render Scrollbar when lines=single", () => {
    const { container } = render(<TextFields lines="single" scrollbar data-testid="tf" />);

    expect(container.querySelector(".chord-scrollbar")).not.toBeInTheDocument();
  });

  it("renders guide message when guideMessage is true", () => {
    const { container } = render(<TextFields guideMessage data-testid="tf" />);

    expect(container.querySelector(".chord-text-fields__guide")).toBeInTheDocument();
  });

  it("hides guide message when guideMessage is false", () => {
    const { container } = render(<TextFields guideMessage={false} data-testid="tf" />);

    expect(container.querySelector(".chord-text-fields__guide")).not.toBeInTheDocument();
  });

  it("disables the native input when status=disabled", () => {
    const { container } = render(<TextFields status="disabled" lines="single" data-testid="tf" />);

    expect(container.querySelector("input")).toBeDisabled();
  });

  it("disables the native textarea when status=disabled and lines=multiple", () => {
    const { container } = render(<TextFields status="disabled" lines="multiple" data-testid="tf" />);

    expect(container.querySelector("textarea")).toBeDisabled();
  });

  it("renders an editable single-line input and forwards input props", () => {
    const { container } = render(
      <TextFields
        lines="single"
        value="입력값"
        inputProps={{ "aria-label": "이름", name: "username" }}
        data-testid="tf"
      />,
    );

    const input = container.querySelector("input");

    expect(input).toHaveAttribute("aria-label", "이름");
    expect(input).toHaveAttribute("name", "username");
    expect(input).toHaveValue("입력값");
    expect(input).not.toHaveAttribute("readonly");
  });

  it("renders an editable textarea and forwards textarea props", () => {
    const { container } = render(
      <TextFields
        lines="multiple"
        defaultValue="여러 줄"
        textareaProps={{ "aria-label": "상세", rows: 4 }}
        data-testid="tf"
      />,
    );

    const textarea = container.querySelector("textarea");

    expect(textarea).toHaveAttribute("aria-label", "상세");
    expect(textarea).toHaveAttribute("rows", "4");
    expect(textarea).toHaveValue("여러 줄");
    expect(textarea).not.toHaveAttribute("readonly");
  });

  it("keeps the title badge in the title text flow instead of after a full-width title span", () => {
    render(<TextFields showTitle showBadgeDot titleLabel="Title" data-testid="tf" />);

    expect(screen.getByTestId("text-fields-title-main")).toBeInTheDocument();
    expect(css).toContain(".chord-text-fields__title-main");
    expect(css).toContain(".chord-text-fields__title-main {\n  flex: 1 1 auto;\n  min-width: 0;\n  display: inline-flex");
    expect(css).toContain("gap: 2px");
    expect(css).toContain("align-items: flex-start");
    expect(css).toContain(".chord-text-fields__title-text {\n  display: block");
    expect(css).not.toContain(".chord-text-fields__title-text {\n  flex: 1");
    expect(css).toContain("margin-block-start: 0");
    expect(css).not.toContain("vertical-align: 3px");
  });

  it("keeps Fixed mode field corners rounded like the Figma fixed variant", () => {
    expect(css).toContain(".chord-text-fields[data-mode=\"fixed\"] .chord-text-fields__field");
    expect(css).toContain("border-radius: var(--cds-system-size-radius-box-100, 8px)");
    expect(css).not.toContain(".chord-text-fields[data-mode=\"fixed\"] .chord-text-fields__field {\n  border-radius: 0");
  });

  it("renders guide message text instead of an empty shell", () => {
    render(<TextFields guideMessage guideMessageLabel="도움말" status="success" data-testid="tf" />);

    expect(screen.getByText("도움말")).toBeInTheDocument();
  });

  it("marks the source note as input-branches-implemented instead of shell-only parity", () => {
    expect(sourceNote).toContain("status: partial/input-branches-implemented");
    expect(sourceNote).toContain("Nested coverage: `partial/input-branches-implemented`");
    expect(sourceNote).toContain('Visual registry scope: `comparisonScope="full-parity"`, `isParityGate=true`.');
    expect(sourceNote).not.toContain("status: ready");
    expect(sourceNote).not.toContain("All 20 combinations are implemented.");
  });
});

describe("TextFields — Input deferred branches", () => {
  it("renders clear button when typingClear=true", () => {
    const { container } = render(<TextFields typingClear data-testid="tf" />);
    expect(container.querySelector(".chord-text-fields__clear-btn")).toBeInTheDocument();
  });

  it("does not render clear button when typingClear=false", () => {
    const { container } = render(<TextFields typingClear={false} data-testid="tf" />);
    expect(container.querySelector(".chord-text-fields__clear-btn")).not.toBeInTheDocument();
  });

  it("renders caret bar when showCaret=true", () => {
    const { container } = render(<TextFields showCaret data-testid="tf" />);
    expect(container.querySelector(".chord-text-fields__caret")).toBeInTheDocument();
  });

  it("does not render caret bar when showCaret=false", () => {
    const { container } = render(<TextFields showCaret={false} data-testid="tf" />);
    expect(container.querySelector(".chord-text-fields__caret")).not.toBeInTheDocument();
  });

  it("renders check icon when showCheckIcon=true", () => {
    const { container } = render(<TextFields showCheckIcon data-testid="tf" />);
    expect(container.querySelector('[data-icon-name="checkMedium"]')).toBeInTheDocument();
  });

  it("does not render check icon when showCheckIcon=false", () => {
    const { container } = render(<TextFields showCheckIcon={false} data-testid="tf" />);
    expect(container.querySelector('[data-icon-name="checkMedium"]')).not.toBeInTheDocument();
  });

  it("renders eye/hidden icon when showEyeIcon=true", () => {
    const { container } = render(<TextFields showEyeIcon data-testid="tf" />);
    expect(container.querySelector('[data-icon-name="hiddenMedium"]')).toBeInTheDocument();
  });

  it("does not render eye icon when showEyeIcon=false", () => {
    const { container } = render(<TextFields showEyeIcon={false} data-testid="tf" />);
    expect(container.querySelector('[data-icon-name="hiddenMedium"]')).not.toBeInTheDocument();
  });

  it("renders clear button with inner circle and X icon", () => {
    const { container } = render(<TextFields typingClear data-testid="tf" />);
    const btn = container.querySelector(".chord-text-fields__clear-btn");
    expect(btn?.querySelector(".chord-text-fields__clear-icon")).toBeInTheDocument();
  });

  it("renders guide message as text-button style when guideMessageCase=text-button", () => {
    const { container } = render(
      <TextFields guideMessage guideMessageLabel="약관 보기" guideMessageCase="text-button" data-testid="tf" />,
    );
    const guide = container.querySelector(".chord-text-fields__guide");
    expect(guide).toHaveAttribute("data-guide-case", "text-button");
    const textBtn = guide?.querySelector(".chord-text-fields__guide-text-button");
    expect(textBtn).toBeInTheDocument();
  });

  it("renders guide message as plain text when guideMessageCase=text", () => {
    const { container } = render(
      <TextFields guideMessage guideMessageLabel="도움말" guideMessageCase="text" data-testid="tf" />,
    );
    const guide = container.querySelector(".chord-text-fields__guide");
    expect(guide).not.toHaveAttribute("data-guide-case", "text-button");
    expect(guide?.querySelector(".chord-text-fields__guide-text-button")).not.toBeInTheDocument();
  });
});
