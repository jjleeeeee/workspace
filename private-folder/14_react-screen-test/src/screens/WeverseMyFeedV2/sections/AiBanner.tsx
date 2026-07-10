import './AiBanner.css';
import aiIcon from '../../../assets/figma/my-feed-v2/ai-icon.svg';

export default function AiBanner({ text }: { text: string }) {
  return (
    <div className="wmfv2__ai-banner">
      <img className="wmfv2__ai-banner__icon" src={aiIcon} alt="" aria-hidden="true" />
      <span className="wmfv2__ai-banner__text">{text}</span>
    </div>
  );
}
