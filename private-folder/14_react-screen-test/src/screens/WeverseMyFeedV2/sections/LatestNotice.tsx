import { Avatar } from '@chord-ds/components';
import noticeAvatar from '../../../assets/figma/my-feed-v2/notice-avatar.png';
import './LatestNotice.css';

export default function LatestNotice() {
  return (
    <section className="wmfv2__notice">
      <span className="wmfv2__notice__header">최신 Notice</span>
      <div className="wmfv2__notice__card">
        <Avatar size="medium" src={noticeAvatar} ring={false} />
        <div className="wmfv2__notice__body">
          <div className="wmfv2__notice__row1">
            <span className="wmfv2__notice__artist">TOMORROW X TOGETHER</span>
            <span className="wmfv2__notice__time">2시간 전</span>
          </div>
          <span className="wmfv2__notice__text">
            [NOTICE] TOMORROW X TOGETHER '2026 TXT MOA CON' - 공식 상품 현장 판매 및 부스 운영 안내드립
          </span>
        </div>
      </div>
    </section>
  );
}
