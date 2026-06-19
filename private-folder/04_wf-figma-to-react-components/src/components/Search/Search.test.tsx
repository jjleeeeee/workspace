import { fireEvent, render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";

import { Search } from "./Search";

const searchCss = readFileSync(join(process.cwd(), "src/components/Search/Search.css"), "utf8");

describe("Search", () => {
  it("renders the Figma default contract", () => {
    render(<Search data-testid="search" />);

    const search = screen.getByTestId("search");

    expect(search).toHaveAttribute("data-mode", "default");
    expect(search).toHaveAttribute("data-state", "default");
    expect(search).toHaveAttribute("data-clear-visible", "false");
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("placeholder", "Search");
    expect(screen.queryByRole("button", { name: /clear search/i })).toBeNull();
  });

  it("fires onChange when input value changes", () => {
    const onChange = vi.fn();
    render(<Search onChange={onChange} />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "hello" } });
    expect(onChange).toHaveBeenCalledWith("hello");
  });

  it("fires onSearch on Enter keydown", () => {
    const onSearch = vi.fn();
    render(<Search onSearch={onSearch} value="hello" />);
    fireEvent.keyDown(screen.getByRole("textbox"), { key: "Enter" });
    expect(onSearch).toHaveBeenCalledWith("hello");
  });

  it("shows placeholder from label prop when placeholder not given", () => {
    render(<Search label="찾기" />);
    expect(screen.getByRole("textbox")).toHaveAttribute("placeholder", "찾기");
  });

  it("shows the clear control for enabled and completed states", () => {
    const onClear = vi.fn();
    render(<Search state="completed" onClear={onClear} label="Keyword" />);

    fireEvent.click(screen.getByRole("button", { name: /clear search/i }));

    expect(onClear).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("search")).toHaveAttribute("data-clear-visible", "true");
  });

  it("accepts DS asset slots without exposing them as Figma controls", () => {
    render(<Search searchIconSlot={<svg aria-label="search asset" />} clearIconSlot={<svg aria-label="clear asset" />} state="enabled" />);

    expect(screen.getByLabelText("search asset")).toBeInTheDocument();
    expect(screen.getByLabelText("clear asset")).toBeInTheDocument();
  });
});

describe("Search CSS contract", () => {
  it("uses Figma size and alpha text token without adding opacity", () => {
    expect(searchCss).toContain("inline-size: 361px");
    expect(searchCss).toContain("block-size: 36px");
    expect(searchCss).toContain("--cds-system-color-text-300a");
    expect(searchCss).not.toMatch(/opacity:\s*0\.3/);
  });

  it("uses icon-default token for search icon (not the 30% label color)", () => {
    expect(searchCss).toContain("--cds-system-color-icon-default");
    expect(searchCss).toContain("--search-icon");
  });

  it("uses mapped search and close icons from confirmed registry entries", () => {
    render(<Search state="completed" />);

    expect(screen.getByTestId("search-icon")).toHaveAttribute("data-icon-name", "searchMedium");
    expect(screen.getByTestId("clear-icon")).toHaveAttribute("data-icon-name", "closeMedium");
    expect(screen.getByTestId("clear-icon")).toHaveAttribute("data-icon-size", "10");
    expect(screen.queryByTestId("clear-icon-unresolved")).not.toBeInTheDocument();
    expect(searchCss).not.toContain("chord-search__search-replacement");
    expect(searchCss).not.toContain("chord-search__clear-graphic::before");
  });

  it("keeps clear icon as a 24x24 frame with 18x18 internal graphic, not icon_area", () => {
    expect(searchCss).toContain(".chord-search__clear-asset");
    expect(searchCss).toContain("block-size: 18px");
    expect(searchCss).toContain("inline-size: 18px");
    expect(searchCss).not.toMatch(/clear.*icon_area/i);
  });
});
