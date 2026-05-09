import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import { ChordIcon } from "../../assets/chord-icons";
import "./Stepper.css";

export type StepperMode = "default" | "fixed";
export type StepperState = "default" | "disabled" | "enabled";

export interface StepperProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  addIconSlot?: ReactNode;
  caret?: boolean;
  label?: string;
  mode?: StepperMode;
  onDecrement?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
  onIncrement?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
  state?: StepperState;
  subtractIconSlot?: ReactNode;
}

export function normalizeStepperLabel(label: string | number) {
  const digits = String(label).replace(/\D/g, "").slice(0, 2);
  return digits || "0";
}

export function Stepper({
  addIconSlot,
  caret = false,
  className,
  label = "99",
  mode = "default",
  onDecrement,
  onIncrement,
  state = "default",
  subtractIconSlot,
  ...divProps
}: StepperProps) {
  const classNames = ["chord-stepper", className].filter(Boolean).join(" ");
  const disabled = state === "disabled";
  const subtractDisabled = disabled || state === "default";
  const addDisabled = disabled;
  const normalizedLabel = normalizeStepperLabel(label);

  return (
    <div
      {...divProps}
      aria-disabled={disabled ? "true" : undefined}
      className={classNames}
      data-caret={String(caret)}
      data-mode={mode}
      data-state={state}
      role="group"
    >
      <button
        aria-label="Decrease"
        className="chord-stepper__control chord-stepper__control--subtract"
        disabled={subtractDisabled}
        onClick={onDecrement}
        type="button"
      >
        <span className="chord-stepper__icon chord-stepper__icon--subtract">
          {subtractIconSlot ?? <ChordIcon data-testid="stepper-subtract-icon" name="subtractMedium" size={16} />}
        </span>
      </button>
      <span className="chord-stepper__number" aria-label={`Value ${normalizedLabel}`}>
        <span className="chord-stepper__label">{normalizedLabel}</span>
        {caret ? <span className="chord-stepper__caret" aria-hidden="true" /> : null}
      </span>
      <button
        aria-label="Increase"
        className="chord-stepper__control chord-stepper__control--add"
        disabled={addDisabled}
        onClick={onIncrement}
        type="button"
      >
        <span className="chord-stepper__icon chord-stepper__icon--add">
          {addIconSlot ?? <ChordIcon data-testid="stepper-add-icon" name="addMedium" size={16} />}
        </span>
      </button>
    </div>
  );
}
