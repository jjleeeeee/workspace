import "./styles/fonts.css";
import "./styles/tokens.css";
import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";

// Register screens here: "screen-slug": () => import("./screens/ScreenName")
const SCREENS: Record<string, () => Promise<{ default: React.ComponentType }>> = {
  "shop-pickup": () => import("./screens/ShopPickup"),
  "my-feed-v2": () => import("./screens/WeverseMyFeedV2"),
};

function App() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("screen") ?? "";
  const loader = SCREENS[slug];

  if (!loader) {
    return (
      <div style={{ padding: "24px", fontFamily: "sans-serif" }}>
        <h2>React Screen Harness — Chord DS</h2>
        <p>
          Pass <code>?screen=&lt;slug&gt;</code> to load a screen.
        </p>
        <p>
          Available: {Object.keys(SCREENS).join(", ") || "(none registered)"}
        </p>
      </div>
    );
  }

  const Screen = lazy(loader);
  return (
    <StrictMode>
      <Suspense fallback={<div data-testid="loading">Loading…</div>}>
        <Screen />
      </Suspense>
    </StrictMode>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
