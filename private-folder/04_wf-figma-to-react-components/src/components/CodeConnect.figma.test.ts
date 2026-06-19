import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const componentDir = path.resolve(__dirname);

const expectations: Array<{
  file: string;
  forbiddenSnippets?: string[];
  snippets: string[];
}> = [
  {
    file: "BadgeNumber/BadgeNumber.figma.tsx",
    snippets: ['label: figma.string("Label")', "label={label}"],
  },
  {
    file: "Chips/Chips.figma.tsx",
    snippets: [
      'marquee: figma.boolean("Marquee")',
      'badge: figma.boolean("Badge")',
      'badgeNumber: figma.boolean("Badge_Number")',
      "Filled_Selected",
      "{...{ marquee, badge, badgeNumber }}",
    ],
  },
  {
    file: "PaginationDot/PaginationDot.figma.tsx",
    snippets: ['selection: figma.enum("Selection"', "selection={selection}"],
  },
  {
    file: "Search/Search.figma.tsx",
    snippets: ['label: figma.string("Label")', "label={label}"],
  },
  {
    file: "Skeleton/Skeleton.figma.tsx",
    snippets: ['skeletonType: figma.enum("Type"', "skeletonType={skeletonType}"],
  },
  {
    file: "Snackbar/Snackbar.figma.tsx",
    snippets: ['icon: figma.boolean("Icon")', "{...{ icon }}"],
  },
  {
    file: "Tabs/Tabs.figma.tsx",
    snippets: ['type: figma.enum("Type"'],
  },
  {
    file: "TextButton/TextButton.figma.tsx",
    snippets: [
      'optionLeading: figma.boolean("Option-Leading")',
      'optionTrailing: figma.boolean("Option-Trailing")',
      'trailingIcon: figma.boolean("-> Trailing-Icon")',
      'trailingText: figma.boolean("-> Trailing-Text")',
      "{...{ optionLeading, optionTrailing, trailingIcon, trailingText }}",
    ],
  },
  {
    file: "Tooltip/Tooltip.figma.tsx",
    snippets: ['buttonClose: figma.boolean("Button - Close")', 'label: figma.string("Label")', "{...{ buttonClose }}"],
  },
  {
    file: "TopNavigation/TopNavigation.figma.tsx",
    snippets: ["{...{ scrollBg, showLeading, showTrailing, showImage, showOfficialBadge, showSubTitle, showSubTitleIcon, marquee }}"],
  },
];

describe("Code Connect templates", () => {
  it.each(expectations)("keeps Figma props mapped in $file", ({ file, forbiddenSnippets = [], snippets }) => {
    const source = fs.readFileSync(path.join(componentDir, file), "utf8");

    for (const snippet of snippets) {
      expect(source).toContain(snippet);
    }

    for (const snippet of forbiddenSnippets) {
      expect(source).not.toContain(snippet);
    }
  });
});
