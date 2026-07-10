import { Avatar } from "@chord-ds/components";
import imgSubin from "../../../assets/figma/my-feed-v2/moment-subin.png";
import imgYeonjun from "../../../assets/figma/my-feed-v2/moment-yeonjun.png";
import imgBeomgyu from "../../../assets/figma/my-feed-v2/moment-beomgyu.png";
import imgSlot4 from "../../../assets/figma/my-feed-v2/moment-slot4.png";
import imgSlot5 from "../../../assets/figma/my-feed-v2/moment-slot5.png";
import imgSlot6 from "../../../assets/figma/my-feed-v2/moment-slot6.png";
import "./MediaSlot.css";

const MOMENTS = [
  { name: "수빈",   img: imgSubin   },
  { name: "연준",   img: imgYeonjun },
  { name: "범규",   img: imgBeomgyu },
  { name: "JUNGWON", img: imgSlot4  },
  { name: "JUNGWON", img: imgSlot5  },
  { name: "JUNGWON", img: imgSlot6  },
  { name: "JUNGWON", img: imgSlot6  }, // ponytail: slot7 없음, slot6 재사용
];

export default function MediaSlot() {
  return (
    <section className="wmfv2__media-slot" aria-label="Moments">
      <h2 className="wmfv2__media-slot__title">Moments</h2>
      <div className="wmfv2__media-slot__card">
        <div className="wmfv2__media-slot__scroll" role="list">
          {MOMENTS.map((m, i) => (
            <div key={i} className="wmfv2__media-slot__item" role="listitem">
              <img
                className="wmfv2__media-slot__thumb"
                src={m.img}
                alt={m.name}
              />
              <div className="wmfv2__media-slot__info">
                <div className="wmfv2__media-slot__avatar-wrap">
                  <Avatar
                    mode="default"
                    avatarType="circle"
                    size="xxsmall"
                    alt={m.name}
                    ring={false}
                  />
                </div>
                <span className="wmfv2__media-slot__name">{m.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
