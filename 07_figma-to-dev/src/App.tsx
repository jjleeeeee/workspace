import { lazy, Suspense } from "react";

const screenGlob = import.meta.glob("./screens/*/index.tsx");

function slugFromPath(path: string): string {
  const match = path.match(/\.\/screens\/([^/]+)\/index\.tsx$/);
  return match?.[1] ?? path;
}

const screens: Record<string, () => Promise<{ default: React.ComponentType }>> =
  Object.fromEntries(
    Object.entries(screenGlob).map(([path, loader]) => [
      slugFromPath(path),
      loader as () => Promise<{ default: React.ComponentType }>,
    ])
  );

export default function App() {
  const params = new URLSearchParams(window.location.search);
  const screenSlug = params.get("screen");

  if (!screenSlug) {
    return (
      <div style={{ padding: "2rem", fontFamily: "monospace" }}>
        <h1 style={{ marginBottom: "1rem" }}>Figma → Dev</h1>
        <p style={{ color: "var(--cds-system-color-text-secondary, #666)" }}>
          Usage: <code>?screen=&lt;slug&gt;</code>
        </p>
        {Object.keys(screens).length > 0 && (
          <ul style={{ marginTop: "1rem" }}>
            {Object.keys(screens).map((slug) => (
              <li key={slug}>
                <a href={`?screen=${slug}`}>{slug}</a>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  const loader = screens[screenSlug];
  if (!loader) {
    return (
      <div style={{ padding: "2rem", fontFamily: "monospace" }}>
        ❌ Unknown screen: <code>{screenSlug}</code>
      </div>
    );
  }

  const Screen = lazy(loader);
  return (
    <Suspense fallback={<div style={{ padding: "2rem" }}>Loading…</div>}>
      <Screen />
    </Suspense>
  );
}
