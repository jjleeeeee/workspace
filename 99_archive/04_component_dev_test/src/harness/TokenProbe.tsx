import "./harness.css";

const tokenChecks = [
  "--cds-token-build-status",
  "--cds-system-color-status-danger-red",
  "--cds-system-color-status-background-disabled",
  "--cds-system-color-text-white-same",
  "--cds-system-size-radius-box-100",
  "--cds-typography-default-font-family-body",
];

export function TokenProbe() {
  return (
    <section className="token-probe" aria-label="Token probe">
      <header>
        <h2>Token probe</h2>
        <p>Generated CSS variables used by the first atom pass.</p>
      </header>
      <div className="token-probe__grid">
        {tokenChecks.map((token) => (
          <code key={token}>{token}</code>
        ))}
      </div>
    </section>
  );
}
