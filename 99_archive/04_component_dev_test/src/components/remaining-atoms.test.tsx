import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Avatar } from "./Avatar/Avatar";
import { Chips } from "./Chips/Chips";
import { DropdownBox } from "./DropdownBox/DropdownBox";
import { ListItemNative } from "./ListItemNative/ListItemNative";
import { ListItemWeb } from "./ListItemWeb/ListItemWeb";
import { Menu } from "./Menu/Menu";
import { PaginationDot } from "./PaginationDot/PaginationDot";
import { PaginationList } from "./PaginationList/PaginationList";
import { Search } from "./Search/Search";
import { Snackbar } from "./Snackbar/Snackbar";
import { Stepper } from "./Stepper/Stepper";
import { Tabs } from "./Tabs/Tabs";
import { Tag } from "./Tag/Tag";
import { TextFields } from "./TextFields/TextFields";
import { Thumbnail } from "./Thumbnail/Thumbnail";
import { TitleHeader } from "./TitleHeader/TitleHeader";
import { Toast } from "./Toast/Toast";
import { Tooltip } from "./Tooltip/Tooltip";
import { TopNavigation } from "./TopNavigation/TopNavigation";

describe("remaining atom components", () => {
  it("renders display atoms with their Figma variant data attributes", () => {
    render(
      <>
        <Avatar aria-label="Chord user" name="Chord" size="small" type="squircle" />
        <Thumbnail aria-label="Album cover" ratio="16:9" radius="on" />
        <TitleHeader align="center" title="Library" />
        <Tag color="red" shape="round" size="small" type="outlined">Hot</Tag>
      </>,
    );

    expect(screen.getByRole("img", { name: "Chord user" })).toHaveAttribute("data-type", "squircle");
    expect(screen.getByRole("img", { name: "Album cover" })).toHaveAttribute("data-ratio", "16:9");
    expect(screen.getByRole("heading", { name: "Library" })).toBeInTheDocument();
    expect(screen.getByText("Hot")).toHaveAttribute("data-color", "red");
  });

  it("renders selectable and input atoms with accessible state", () => {
    render(
      <>
        <Chips aria-label="Genre" state="filledSelected">Genre</Chips>
        <DropdownBox label="Genre" state="enabledDown" />
        <Search aria-label="Search catalog" state="typing" value="jazz" readOnly />
        <Stepper aria-label="Quantity" state="typing" value={3} />
        <Tabs selectedIndex={1} type="text" />
        <TextFields aria-label="Memo" status="typing" value="note" readOnly />
      </>,
    );

    expect(screen.getByRole("button", { name: "Genre" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: /Genre/ })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("searchbox", { name: "Search catalog" })).toHaveValue("jazz");
    expect(screen.getByRole("spinbutton", { name: "Quantity" })).toHaveValue(3);
    expect(screen.getAllByRole("tab")[1]).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("textbox", { name: "Memo" })).toHaveValue("note");
  });

  it("renders navigation and feedback atoms", () => {
    render(
      <>
        <ListItemNative title="Native row" />
        <ListItemWeb title="Web row" />
        <Menu items={["Share", "Report"]} />
        <PaginationDot dots={5} selection="3" />
        <PaginationList page={3} pages={5} />
        <TopNavigation textType="title" title="Explore" />
        <Snackbar message="Saved" />
        <Toast message="Done" />
        <Tooltip position="bottom" text="More info" />
      </>,
    );

    expect(screen.getByRole("button", { name: /Native row/ })).toHaveAttribute("data-size", "medium");
    expect(screen.getByRole("button", { name: /Web row/ })).toHaveAttribute("data-size", "medium");
    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(screen.getByLabelText("Page 3")).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("button", { name: "3" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("navigation", { name: "Top navigation" })).toBeInTheDocument();
    expect(screen.getByRole("status", { name: "Snackbar" })).toHaveTextContent("Saved");
    expect(screen.getByRole("status", { name: "Toast" })).toHaveTextContent("Done");
    expect(screen.getByRole("tooltip")).toHaveAttribute("data-position", "bottom");
  });
});
