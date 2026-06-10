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
    file: "AvatarGroup/AvatarGroup.figma.tsx",
    snippets: ['liveTag: figma.boolean("Live Tag")', "{...{ liveTag }}"],
  },
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
    file: "CircularProgressIndicator/CircularProgressIndicator.figma.tsx",
    snippets: ['button: figma.boolean("Button")', "{...{ button }}"],
  },
  {
    file: "Divider/Divider.figma.tsx",
    snippets: ['dividerStyle: figma.enum("Style"', "dividerStyle={dividerStyle}"],
  },
  {
    file: "DropdownBox/DropdownBox.figma.tsx",
    snippets: [
      'titleLabel: figma.string("Label_Title")',
      'guideLabel: figma.string("Label_Guide")',
      'textLabel: figma.string("Label_Text")',
      "{...{ showTitle, showGuide, showScrollbar, showBadgeDot }}",
    ],
  },
  {
    file: "LinearProgressIndicator/LinearProgressIndicator.figma.tsx",
    snippets: ['"Default (2)"'],
  },
  {
    file: "ListItemNative/ListItemNative.figma.tsx",
    snippets: ["{...{ showDivider, showTrailing, showSmallLeading, showMediumLeading }}"],
  },
  {
    file: "ListItemWeb/ListItemWeb.figma.tsx",
    snippets: ["{...{ showTrailing, showDivider, showMediumLeading, showSmallLeading }}"],
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
    file: "Stepper/Stepper.figma.tsx",
    snippets: ['caret: figma.boolean("Caret")', 'label: figma.string("Label")', "{...{ caret }}"],
  },
  {
    file: "Tabs/Tabs.figma.tsx",
    snippets: ["{...{ showExpandButton }}"],
  },
  {
    file: "Tag/Tag.figma.tsx",
    snippets: ["{...{ showIcon }}"],
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
    file: "TextFields/TextFields.figma.tsx",
    snippets: [
      'titleLabel: figma.string("Title Label")',
      'multiLineLabel: figma.string("Multi-line Label")',
      'characterCounterLabel: figma.string("Character Counter Label")',
      "{...{ showTitle, showBadgeDot, guideMessage, scrollbar, characterCounter, countryCode }}",
    ],
  },
  {
    file: "Thumbnail/Thumbnail.figma.tsx",
    snippets: [
      'type: figma.enum("Type"',
      'fill: figma.boolean("Fill")',
      'button: figma.boolean("Button")',
      'leftItem: figma.boolean("Left Item")',
      'rightItemTop: figma.boolean("Right Item_top")',
      'rightItemBottom: figma.boolean("Right Item_bottom")',
      'seekBar: figma.boolean("Seek bar")',
      "{...{ fill, button, leftItem, rightItemTop, rightItemBottom, seekBar }}",
    ],
  },
  {
    file: "TitleHeader/TitleHeader.figma.tsx",
    snippets: [
      'marquee: figma.boolean("Marquee")',
      'showBadge2: figma.boolean("Badge_2")',
      'showSubBadge: figma.boolean("[Sub] Badge")',
      "{...{ showLeading, showTrailing, showTitleBadge, showBadge1, showBadge2, showSubBadge, showSubTitle, marquee }}",
    ],
    forbiddenSnippets: [
      'showTitleMultiple: figma.boolean("[Title] Multiple ")',
      'showSubTitleMultiple: figma.boolean("[Sub] Multiple ")',
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
