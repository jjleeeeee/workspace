import {
  BadgeDot,
  BadgeNumber,
  Checkbox,
  CircularProgressIndicator,
  IconButton,
  LinearProgressIndicator,
  LoadingCircular,
  LoadingDot,
  Radio,
  SelectNumberBox,
  Skeleton,
  TextButton,
  ToggleSwitch,
} from "./components";
import { TokenProbe } from "./harness/TokenProbe";

export function App() {
  return (
    <main className="app-shell">
      <section className="app-hero">
        <div>
          <p>Chord DS atom catalog</p>
          <h1>16 ready atoms</h1>
        </div>
        <div className="app-hero__preview" aria-label="Atom preview">
          <BadgeDot aria-label="Unread content" outline="on" size="large" />
          <BadgeNumber count={1000} aria-label="Unread count" />
          <SelectNumberBox aria-label="Selection order" state="selected" value={3} />
          <LoadingDot aria-label="Loading dots" />
          <LoadingCircular aria-label="Loading circular" />
          <CircularProgressIndicator aria-label="Circular progress" value={64} />
          <Skeleton aria-label="Loading title" type="text" width={180} />
          <TextButton radius="on" size="small">
            Action
          </TextButton>
          <IconButton aria-label="More actions" radius="on" size="small" />
          <Checkbox aria-label="Agreement selected" shape="square" status="enabled" />
          <Radio aria-label="Option selected" status="enabled" />
          <ToggleSwitch aria-label="Notifications on" status="on" />
        </div>
      </section>
      <LinearProgressIndicator aria-label="Catalog progress" value={48} />
      <TokenProbe />
    </main>
  );
}
