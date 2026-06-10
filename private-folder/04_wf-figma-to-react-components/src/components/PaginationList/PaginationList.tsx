import type { HTMLAttributes } from "react";
import { ChordIcon } from "../../assets/chord-icons";
import "./PaginationList.css";

export type PaginationListMode = "default" | "fixed";
export type PaginationListSize = "large" | "small";
export type PaginationListPages = "2" | "3" | "4" | "5" | "6" | "7" | "8+";

export type PaginationListProps = HTMLAttributes<HTMLElement> & {
  mode?: PaginationListMode;
  pages?: PaginationListPages;
  selectedPage?: number;
  size?: PaginationListSize;
};

export type PaginationListItem =
  | { disabled: boolean; key: "previous" | "next"; kind: "control" }
  | { key: string; kind: "page"; page: number; selected: boolean }
  | { key: "ellipsis"; kind: "ellipsis" };

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function pagesToCount(pages: PaginationListPages) {
  return pages === "8+" ? 8 : Number.parseInt(pages, 10);
}

export function clampPaginationListPage(pages: PaginationListPages, selectedPage: number) {
  const total = pagesToCount(pages);
  if (!Number.isFinite(selectedPage)) return 1;
  return Math.min(total, Math.max(1, Math.round(selectedPage)));
}

export function getPaginationListModel(
  pages: PaginationListPages,
  selectedPage: number,
): PaginationListItem[] {
  const selected = clampPaginationListPage(pages, selectedPage);
  const total = pagesToCount(pages);
  const visiblePages = pages === "8+" ? [1, 2, 3, 4, 5, 8] : Array.from({ length: total }, (_, index) => index + 1);

  return [
    { disabled: selected === 1, key: "previous", kind: "control" },
    ...visiblePages.flatMap<PaginationListItem>((page, index) => {
      const needsEllipsis = pages === "8+" && index === visiblePages.length - 1;
      const item: PaginationListItem = { key: `page-${page}`, kind: "page", page, selected: page === selected };
      return needsEllipsis ? [{ key: "ellipsis", kind: "ellipsis" }, item] : [item];
    }),
    { disabled: selected === total, key: "next", kind: "control" },
  ];
}

export function PaginationList({
  "aria-label": ariaLabel = "Pagination",
  className,
  mode = "default",
  pages = "2",
  selectedPage = 1,
  size = "large",
  ...rest
}: PaginationListProps) {
  const resolvedSelectedPage = clampPaginationListPage(pages, selectedPage);
  const model = getPaginationListModel(pages, resolvedSelectedPage);

  return (
    <nav
      {...rest}
      aria-label={ariaLabel}
      className={cx("chord-pagination-list", className)}
      data-mode={mode}
      data-pages={pages}
      data-selected-page={resolvedSelectedPage}
      data-size={size}
    >
      {model.map((item) => {
        if (item.kind === "ellipsis") {
          return (
            <span aria-hidden="true" className="chord-pagination-list__slot" data-kind="ellipsis" key={item.key}>
              <span className="chord-pagination-list__ellipsis">
                <span />
                <span />
                <span />
              </span>
            </span>
          );
        }

        if (item.kind === "control") {
          const isPrevious = item.key === "previous";
          return (
            <button
              aria-label={isPrevious ? "Previous page" : "Next page"}
              className="chord-pagination-list__slot"
              data-disabled={item.disabled ? "true" : "false"}
              data-kind="control"
              disabled={item.disabled}
              key={item.key}
              type="button"
            >
              <ChordIcon
                data-testid={isPrevious ? "pagination-previous-icon" : "pagination-next-icon"}
                name={isPrevious ? "arrowLeftMedium" : "arrowRightMedium"}
                size={16}
              />
            </button>
          );
        }

        return (
          <button
            aria-current={item.selected ? "page" : undefined}
            aria-label={`Page ${item.page}`}
            className="chord-pagination-list__slot"
            data-kind="page"
            data-selected={item.selected ? "true" : "false"}
            key={item.key}
            type="button"
          >
            {item.page}
          </button>
        );
      })}
    </nav>
  );
}
