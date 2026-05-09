import type { HTMLAttributes } from "react";
import "./PaginationDot.css";

export type PaginationDotMode = "default" | "fixed";
export type PaginationDotCount = "2" | "3" | "4" | "5" | "6+";
export type PaginationDotSelection = 1 | 2 | 3 | 4 | 5 | 6;

export type PaginationDotProps = HTMLAttributes<HTMLDivElement> & {
  dots?: PaginationDotCount;
  mode?: PaginationDotMode;
  selection?: PaginationDotSelection;
};

type DotModel = {
  key: string;
  selected: boolean;
  size: "normal" | "small" | "tiny";
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function dotCountToNumber(dots: PaginationDotCount) {
  return dots === "6+" ? 6 : Number.parseInt(dots, 10);
}

export function clampPaginationDotSelection(dots: PaginationDotCount, selection: number) {
  const maxSelection = dotCountToNumber(dots);
  return Math.min(maxSelection, Math.max(1, Math.round(selection))) as PaginationDotSelection;
}

export function getPaginationDotModel(dots: PaginationDotCount, selection: PaginationDotSelection): DotModel[] {
  const selected = clampPaginationDotSelection(dots, selection);

  if (dots !== "6+") {
    return Array.from({ length: dotCountToNumber(dots) }, (_, index) => ({
      key: String(index + 1),
      selected: index + 1 === selected,
      size: "normal",
    }));
  }

  if (selected <= 3) {
    return [1, 2, 3, 4, 5].map((position, index) => ({
      key: String(position),
      selected: position === selected,
      size: index < 3 ? "normal" : index === 3 ? "small" : "tiny",
    }));
  }

  if (selected === 4) {
    return [
      { key: "1", selected: false, size: "tiny" },
      { key: "2", selected: false, size: "small" },
      { key: "3", selected: false, size: "normal" },
      { key: "4", selected: true, size: "normal" },
      { key: "5", selected: false, size: "small" },
      { key: "6", selected: false, size: "tiny" },
    ];
  }

  return [1, 2, 3, 4, 5].map((position, index) => {
    const actualPosition = position + 1;
    return {
      key: String(actualPosition),
      selected: actualPosition === selected,
      size: index < 2 ? (index === 0 ? "tiny" : "small") : "normal",
    };
  });
}

export function PaginationDot({
  className,
  dots = "2",
  mode = "fixed",
  selection = 1,
  ...rest
}: PaginationDotProps) {
  const resolvedSelection = clampPaginationDotSelection(dots, selection);
  const model = getPaginationDotModel(dots, resolvedSelection);

  return (
    <div
      {...rest}
      className={cx("chord-pagination-dot", className)}
      data-dots={dots}
      data-mode={mode}
      data-selection={resolvedSelection}
    >
      {model.map((dot) => (
        <span className="chord-pagination-dot__frame" data-size={dot.size} key={dot.key}>
          <span className="chord-pagination-dot__dot" data-selected={dot.selected ? "true" : "false"} />
        </span>
      ))}
    </div>
  );
}
