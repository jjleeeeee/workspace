import type { ComponentType, ReactNode } from "react";
import "./harness.css";

export type MatrixAxis<TArgs> = {
  prop: keyof TArgs;
  label: string;
  values: readonly string[];
};

type ComponentMatrixProps<TArgs extends Record<string, unknown>> = {
  component: ComponentType<TArgs>;
  axes: readonly MatrixAxis<TArgs>[];
  baseArgs: TArgs;
  title?: string;
  renderLabel?: (args: TArgs) => ReactNode;
};

export function ComponentMatrix<TArgs extends Record<string, unknown>>({
  component: Component,
  axes,
  baseArgs,
  title = "Variant matrix",
  renderLabel,
}: ComponentMatrixProps<TArgs>) {
  const [primaryAxis, secondaryAxis] = axes;
  const primaryValues = primaryAxis?.values ?? ["default"];
  const secondaryValues = secondaryAxis?.values ?? ["default"];

  return (
    <section className="harness-matrix" aria-label={title}>
      <div className="harness-matrix__header">
        <h2>{title}</h2>
        <p>{axes.map((axis) => axis.label).join(" x ")}</p>
      </div>
      <div className="harness-matrix__grid">
        {primaryValues.flatMap((primaryValue) =>
          secondaryValues.map((secondaryValue) => {
            const args = {
              ...baseArgs,
              ...(primaryAxis ? { [primaryAxis.prop]: primaryValue } : null),
              ...(secondaryAxis ? { [secondaryAxis.prop]: secondaryValue } : null),
            } as TArgs;

            return (
              <article className="harness-matrix__cell" key={`${primaryValue}-${secondaryValue}`}>
                <div className="harness-matrix__preview">
                  <Component {...args} />
                </div>
                <span>{renderLabel ? renderLabel(args) : `${primaryValue} / ${secondaryValue}`}</span>
              </article>
            );
          }),
        )}
      </div>
    </section>
  );
}
