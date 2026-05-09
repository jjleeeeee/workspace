import type { ChordComponentManifest } from "../figma/chord-components";

export type EnumPropDefinition<T extends readonly string[] = readonly string[]> = {
  kind: "enum";
  values: T;
  defaultValue: T[number];
  figmaAxis?: string;
  figmaValues?: readonly string[];
  control?: "inline-radio" | "select";
};

export type TextPropDefinition = {
  kind: "text";
  defaultValue: string;
};

export type NumberPropDefinition = {
  kind: "number";
  defaultValue: number;
  min?: number;
  max?: number;
};

export type BooleanPropDefinition = {
  kind: "boolean";
  defaultValue: boolean;
};

export type PropDefinition =
  | BooleanPropDefinition
  | EnumPropDefinition
  | NumberPropDefinition
  | TextPropDefinition;

export type ComponentContract = {
  componentId: string;
  displayName: string;
  props: Record<string, PropDefinition>;
};

export const sharedModeProp = {
  kind: "enum",
  values: ["default", "fixed"],
  defaultValue: "default",
  figmaAxis: "Mode",
  figmaValues: ["Default", "Fixed"],
  control: "inline-radio",
} as const satisfies EnumPropDefinition;

export const componentContracts = {
  badgeDot: {
    componentId: "badge-dot",
    displayName: "Badge Dot",
    props: {
      mode: sharedModeProp,
      size: {
        kind: "enum",
        values: ["small", "medium", "large"],
        defaultValue: "medium",
        figmaAxis: "Size",
        figmaValues: ["Small", "Medium", "Large"],
        control: "inline-radio",
      },
      outline: {
        kind: "enum",
        values: ["off", "on"],
        defaultValue: "off",
        figmaAxis: "Outline",
        figmaValues: ["OFF", "ON"],
        control: "inline-radio",
      },
    },
  },
  badgeNumber: {
    componentId: "badge-number",
    displayName: "Badge Number",
    props: {
      mode: sharedModeProp,
      type: {
        kind: "enum",
        values: ["number", "new"],
        defaultValue: "number",
        figmaAxis: "Type",
        figmaValues: ["Number", "New"],
        control: "inline-radio",
      },
      count: { kind: "number", defaultValue: 999, min: 0, max: 1200 },
      label: { kind: "text", defaultValue: "" },
    },
  },
  skeleton: {
    componentId: "skeleton",
    displayName: "Skeleton",
    props: {
      mode: sharedModeProp,
      type: {
        kind: "enum",
        values: ["rectangle", "circle", "text"],
        defaultValue: "rectangle",
        figmaAxis: "Type",
        figmaValues: ["Rectangle", "Circle", "Text"],
        control: "inline-radio",
      },
      size: {
        kind: "enum",
        values: ["small", "medium"],
        defaultValue: "medium",
        figmaAxis: "Size",
        figmaValues: ["Small", "Medium"],
        control: "inline-radio",
      },
      animated: { kind: "boolean", defaultValue: true },
    },
  },
  divider: {
    componentId: "divider",
    displayName: "Divider",
    props: {
      mode: sharedModeProp,
      height: {
        kind: "enum",
        values: ["1", "2", "8"],
        defaultValue: "1",
        figmaAxis: "Height",
        figmaValues: ["1", "2", "8"],
        control: "inline-radio",
      },
      styleVariant: {
        kind: "enum",
        values: ["default-50a", "default-50a-2"],
        defaultValue: "default-50a",
        figmaAxis: "Style",
        figmaValues: ["Default-50a", "Default-50a-2"],
        control: "inline-radio",
      },
    },
  },
  scrimOverlay: {
    componentId: "scrim-overlay",
    displayName: "Scrim Overlay",
    props: {
      opacity: { kind: "number", defaultValue: 0.6, min: 0, max: 1 },
    },
  },
  selectNumberBox: {
    componentId: "select-number-box",
    displayName: "Select Number Box",
    props: {
      mode: sharedModeProp,
      state: {
        kind: "enum",
        values: ["default", "selected", "over"],
        defaultValue: "default",
        figmaAxis: "State",
        figmaValues: ["Default", "Selected", "Over"],
        control: "inline-radio",
      },
      value: { kind: "number", defaultValue: 1, min: 0, max: 128 },
    },
  },
  loadingDot: {
    componentId: "loading-dot",
    displayName: "Loading Dot",
    props: {
      mode: sharedModeProp,
      size: {
        kind: "enum",
        values: ["small", "medium"],
        defaultValue: "medium",
        figmaAxis: "Size",
        figmaValues: ["Small", "Medium"],
        control: "inline-radio",
      },
      color: {
        kind: "enum",
        values: ["default", "white"],
        defaultValue: "default",
        figmaAxis: "Color",
        figmaValues: ["Default", "White"],
        control: "inline-radio",
      },
    },
  },
  loadingCircular: {
    componentId: "loading-circular",
    displayName: "Loading Circular",
    props: {
      mode: sharedModeProp,
    },
  },
  linearProgressIndicator: {
    componentId: "linear-progress-indicator",
    displayName: "Linear Progress Indicator",
    props: {
      mode: sharedModeProp,
      rounded: {
        kind: "enum",
        values: ["on", "off"],
        defaultValue: "on",
        figmaAxis: "Rounded",
        figmaValues: ["ON", "OFF"],
        control: "inline-radio",
      },
      height: {
        kind: "enum",
        values: ["2", "4"],
        defaultValue: "4",
        figmaAxis: "Height",
        figmaValues: ["2", "4"],
        control: "inline-radio",
      },
      value: { kind: "number", defaultValue: 48, min: 0, max: 100 },
    },
  },
  circularProgressIndicator: {
    componentId: "circular-progress-indicator",
    displayName: "Circular Progress Indicator",
    props: {
      mode: sharedModeProp,
      value: { kind: "number", defaultValue: 64, min: 0, max: 100 },
    },
  },
  scrollbar: {
    componentId: "scrollbar",
    displayName: "Scrollbar",
    props: {
      state: {
        kind: "enum",
        values: ["default", "hover", "dragging"],
        defaultValue: "default",
        figmaAxis: "Mode",
        figmaValues: ["Default", "Hover", "Dragging"],
        control: "inline-radio",
      },
      value: { kind: "number", defaultValue: 30, min: 0, max: 100 },
    },
  },
  textButton: {
    componentId: "text-button",
    displayName: "Text Button",
    props: {
      mode: sharedModeProp,
      variant: {
        kind: "enum",
        values: ["filled", "outlinedColor", "outlinedGray", "ghost"],
        defaultValue: "filled",
        figmaAxis: "Type",
        figmaValues: ["Filled", "Outlined_color", "Outlined_gray", "Ghost"],
        control: "select",
      },
      size: {
        kind: "enum",
        values: ["xlarge", "large", "medium", "small", "xsmall", "xxsmall"],
        defaultValue: "medium",
        figmaAxis: "Size",
        figmaValues: ["XLarge(52)", "Large(44)", "Medium(40)", "Small(36)", "XSmall(32)", "XXSmall(24)"],
        control: "select",
      },
      buttonColor: {
        kind: "enum",
        values: ["default", "black"],
        defaultValue: "default",
        figmaAxis: "Button Color",
        figmaValues: ["Default (Gray Ghost 단일컬러)", "Black(Gray Ghost 미적용)"],
        control: "inline-radio",
      },
      status: {
        kind: "enum",
        values: ["default", "hover", "loading", "disabled"],
        defaultValue: "default",
        figmaAxis: "Status",
        figmaValues: ["Default", "Hover", "Loading", "Disabled"],
        control: "select",
      },
      radius: {
        kind: "enum",
        values: ["off", "on"],
        defaultValue: "off",
        figmaAxis: "Radius",
        figmaValues: ["off", "on"],
        control: "inline-radio",
      },
      showLeading: { kind: "boolean", defaultValue: false },
      showTrailing: { kind: "boolean", defaultValue: false },
    },
  },
  iconButton: {
    componentId: "icon-button",
    displayName: "Icon Button",
    props: {
      mode: sharedModeProp,
      variant: {
        kind: "enum",
        values: ["filled", "outlined"],
        defaultValue: "filled",
        figmaAxis: "Type",
        figmaValues: ["Filled", "Outlined"],
        control: "inline-radio",
      },
      size: {
        kind: "enum",
        values: ["xlarge", "medium", "small", "xxsmall"],
        defaultValue: "medium",
        figmaAxis: "Size",
        figmaValues: ["XLarge(52)", "Medium(40)", "Small(36)", "XXSmall(24)"],
        control: "select",
      },
      state: {
        kind: "enum",
        values: ["default", "hover", "disabled"],
        defaultValue: "default",
        figmaAxis: "State",
        figmaValues: ["Default", "Hover", "Disabled"],
        control: "inline-radio",
      },
      radius: {
        kind: "enum",
        values: ["off", "on"],
        defaultValue: "off",
        figmaAxis: "Radius",
        figmaValues: ["on", "off"],
        control: "inline-radio",
      },
      buttonColor: {
        kind: "enum",
        values: ["default", "black"],
        defaultValue: "default",
        figmaAxis: "Button Color",
        figmaValues: ["Default", "Black"],
        control: "inline-radio",
      },
    },
  },
  checkbox: {
    componentId: "checkbox",
    displayName: "Checkbox",
    props: {
      mode: sharedModeProp,
      shape: {
        kind: "enum",
        values: ["circle", "square"],
        defaultValue: "circle",
        figmaAxis: "Type",
        figmaValues: ["Circle", "Square"],
        control: "inline-radio",
      },
      status: {
        kind: "enum",
        values: ["default", "enabled", "disabled"],
        defaultValue: "default",
        figmaAxis: "Status",
        figmaValues: ["Default", "Enabled", "Disabled"],
        control: "inline-radio",
      },
    },
  },
  radio: {
    componentId: "radio",
    displayName: "Radio",
    props: {
      mode: sharedModeProp,
      status: {
        kind: "enum",
        values: ["default", "enabled", "disabled"],
        defaultValue: "default",
        figmaAxis: "Status",
        figmaValues: ["Default", "Enabled", "Disabled"],
        control: "inline-radio",
      },
    },
  },
  toggleSwitch: {
    componentId: "toggle-switch",
    displayName: "Toggle Switch",
    props: {
      mode: sharedModeProp,
      os: {
        kind: "enum",
        values: ["ios", "aos"],
        defaultValue: "ios",
        figmaAxis: "OS",
        figmaValues: ["iOS", "AOS"],
        control: "inline-radio",
      },
      size: {
        kind: "enum",
        values: ["small", "medium"],
        defaultValue: "medium",
        figmaAxis: "Size",
        figmaValues: ["Small", "Medium"],
        control: "inline-radio",
      },
      status: {
        kind: "enum",
        values: ["off", "on", "disabled"],
        defaultValue: "off",
        figmaAxis: "Status",
        figmaValues: ["Off", "On", "Disabled"],
        control: "inline-radio",
      },
    },
  },
} as const satisfies Record<string, ComponentContract>;

function sameSet(left: readonly string[], right: readonly string[]) {
  const leftSet = new Set(left);
  const rightSet = new Set(right);
  return leftSet.size === rightSet.size && [...leftSet].every((value) => rightSet.has(value));
}

export function validateContractAgainstManifest(
  contract: ComponentContract,
  manifests: readonly ChordComponentManifest[],
) {
  const issues: string[] = [];
  const manifest = manifests.find((component) => component.id === contract.componentId);
  if (!manifest) {
    return [`${contract.displayName}: missing manifest for ${contract.componentId}`];
  }

  const figmaAxesFromProps = Object.values(contract.props)
    .filter((prop): prop is EnumPropDefinition => prop.kind === "enum" && Boolean(prop.figmaAxis))
    .map((prop) => prop.figmaAxis as string);

  for (const axisName of Object.keys(manifest.variantAxes)) {
    if (!figmaAxesFromProps.includes(axisName)) {
      issues.push(`${contract.displayName}: missing prop for Figma axis "${axisName}"`);
    }
  }

  for (const prop of Object.values(contract.props)) {
    if (prop.kind !== "enum" || !prop.figmaAxis) continue;
    const figmaValues = manifest.variantAxes[prop.figmaAxis];
    if (!figmaValues) {
      issues.push(`${contract.displayName}: unknown Figma axis "${prop.figmaAxis}"`);
      continue;
    }
    if (!prop.figmaValues || !sameSet(prop.figmaValues, figmaValues)) {
      issues.push(`${contract.displayName}: "${prop.figmaAxis}" values do not match manifest`);
    }
  }

  return issues;
}

export function createStoryArgTypes(contract: ComponentContract) {
  return Object.fromEntries(
    Object.entries(contract.props).map(([propName, definition]) => {
      if (definition.kind === "enum") {
        return [
          propName,
          {
            control: definition.control ?? "select",
            options: definition.values,
          },
        ];
      }
      if (definition.kind === "number") {
        return [
          propName,
          {
            control: { type: "number", min: definition.min, max: definition.max },
          },
        ];
      }
      return [propName, { control: definition.kind }];
    }),
  );
}
