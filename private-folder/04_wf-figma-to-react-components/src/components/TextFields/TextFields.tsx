import type {
  ChangeEventHandler,
  HTMLAttributes,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

import { ChordIcon } from "../../assets/chord-icons";
import { BadgeDot } from "../BadgeDot/BadgeDot";
import { Scrollbar } from "../Scrollbar/Scrollbar";
import { TextButton } from "../TextButton/TextButton";
import "./TextFields.css";

export type TextFieldsMode = "default" | "fixed";
export type TextFieldsLines = "single" | "multiple";
export type TextFieldsStatus = "default" | "disabled" | "enabled" | "error" | "success";

export type TextFieldsGuideMessageCase = "text" | "text-button";

export type TextFieldsProps = Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> & {
  mode?: TextFieldsMode;
  lines?: TextFieldsLines;
  status?: TextFieldsStatus;
  showTitle?: boolean;
  titleLabel?: string;
  showBadgeDot?: boolean;
  characterCounter?: boolean;
  characterCounterLabel?: string;
  countryCode?: boolean;
  countryCodeLabel?: string;
  guideMessage?: boolean;
  guideMessageLabel?: string;
  guideMessageCase?: TextFieldsGuideMessageCase;
  inputButton?: boolean;
  inputButtonLabel?: string;
  timer?: boolean;
  timerLabel?: string;
  typingClear?: boolean;
  showCaret?: boolean;
  showCheckIcon?: boolean;
  showEyeIcon?: boolean;
  scrollbar?: boolean;
  multiLineLabel?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  textareaProps?: TextareaHTMLAttributes<HTMLTextAreaElement>;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function TextFields({
  className,
  mode = "default",
  lines = "single",
  status = "default",
  showTitle = true,
  titleLabel = "Title",
  showBadgeDot = true,
  characterCounter = true,
  characterCounterLabel = "12/200",
  countryCode = true,
  countryCodeLabel = "+82",
  guideMessage = true,
  guideMessageLabel = "Guide Message",
  guideMessageCase = "text",
  inputButton = true,
  inputButtonLabel = "Text",
  timer = true,
  timerLabel = "02:13",
  typingClear = false,
  showCaret = false,
  showCheckIcon = false,
  showEyeIcon = false,
  scrollbar = true,
  multiLineLabel = "일이삼사오육",
  placeholder = "일이삼사오육",
  value,
  defaultValue,
  onChange,
  inputProps,
  textareaProps,
  ...rest
}: TextFieldsProps) {
  const isDisabled = status === "disabled";
  const isMultiple = lines === "multiple";
  const scrollbarMode = mode === "fixed" ? "fixed-white" : "default";
  const { className: inputClassName, disabled: inputDisabled, ...inputRest } = inputProps ?? {};
  const {
    className: textareaClassName,
    disabled: textareaDisabled,
    ...textareaRest
  } = textareaProps ?? {};
  const singleValueProps =
    value !== undefined ? { value } : defaultValue !== undefined ? { defaultValue } : {};
  const multipleValueProps =
    value !== undefined
      ? { value }
      : defaultValue !== undefined
        ? { defaultValue }
        : textareaProps?.value !== undefined || textareaProps?.defaultValue !== undefined
          ? {}
          : { defaultValue: multiLineLabel };

  return (
    <div
      {...rest}
      className={cx("chord-text-fields", className)}
      data-mode={mode}
      data-lines={lines}
      data-status={status}
    >
      {showTitle && (
        <div className="chord-text-fields__title">
          <span className="chord-text-fields__title-main" data-testid="text-fields-title-main">
            <span className="chord-text-fields__title-text">{titleLabel}</span>
            {showBadgeDot && (
              <BadgeDot
                className="chord-text-fields__title-badge"
                mode={mode === "fixed" ? "fixed" : "default"}
                size="small"
              />
            )}
          </span>
          {characterCounter && (
            <span className="chord-text-fields__counter">{characterCounterLabel}</span>
          )}
        </div>
      )}

      <div className="chord-text-fields__field">
        {!isMultiple && countryCode && (
          <span className="chord-text-fields__country-code">
            <span className="chord-text-fields__country-code-value">{countryCodeLabel}</span>
            <ChordIcon
              className="chord-text-fields__country-code-chevron"
              data-testid="text-fields-country-code-chevron"
              name="arrowDownMedium"
              size={16}
            />
            <span
              aria-hidden="true"
              className="chord-text-fields__country-code-divider"
              data-testid="text-fields-country-code-divider"
            />
          </span>
        )}

        {isMultiple ? (
          <textarea
            {...textareaRest}
            {...multipleValueProps}
            className={cx("chord-text-fields__input", textareaClassName)}
            disabled={isDisabled || textareaDisabled}
            onChange={onChange}
          />
        ) : (
          <span className="chord-text-fields__input-module">
            <input
              {...inputRest}
              {...singleValueProps}
              className={cx("chord-text-fields__input", inputClassName)}
              disabled={isDisabled || inputDisabled}
              onChange={onChange}
              placeholder={placeholder}
            />
            {showCaret && <span className="chord-text-fields__caret" aria-hidden="true" />}
            {typingClear && (
              <button
                aria-label="지우기"
                className="chord-text-fields__clear-btn"
                type="button"
              >
                <span className="chord-text-fields__clear-icon" aria-hidden="true" />
              </button>
            )}
            {showCheckIcon && (
              <span className="chord-text-fields__check-icon">
                <ChordIcon name="checkMedium" size={24} />
              </span>
            )}
            {showEyeIcon && (
              <span className="chord-text-fields__eye-icon">
                <ChordIcon name="hiddenMedium" size={24} />
              </span>
            )}
            {inputButton && (
              <TextButton
                className="chord-text-fields__input-button"
                buttonType="outlinedGray"
                mode={mode}
                size="xxsmall"
                status={isDisabled ? "disabled" : "default"}
              >
                {inputButtonLabel}
              </TextButton>
            )}
            {timer && <span className="chord-text-fields__timer">{timerLabel}</span>}
          </span>
        )}

        {isMultiple && scrollbar && <Scrollbar mode={scrollbarMode} />}
      </div>

      {guideMessage && (
        <div
          className="chord-text-fields__guide"
          data-guide-case={guideMessageCase === "text-button" ? "text-button" : undefined}
        >
          {guideMessageLabel && guideMessageCase === "text-button" ? (
            <button className="chord-text-fields__guide-text-button" type="button">
              {guideMessageLabel}
            </button>
          ) : guideMessageLabel ? (
            <span className="chord-text-fields__guide-text">{guideMessageLabel}</span>
          ) : null}
        </div>
      )}
    </div>
  );
}
