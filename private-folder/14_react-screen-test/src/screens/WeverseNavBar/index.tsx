import { ChordIcon } from "@chord-ds/components";
import { TopNavigation } from "@chord-ds/components";
import weverseLogo from "../../assets/figma/weverse-myfeed/weverse-logo.svg";
import "./styles.css";

export default function WeverseNavBar() {
  return (
    <div className="wnb">
      <TopNavigation
        mode="default"
        textType="img"
        scrollBg="on"
        showLeading={false}
        showImage
        showTrailing
        trailingCount="2ea"
        titleLabel=""
        showSubTitle={false}
        showSubTitleIcon={false}
        showOfficialBadge={false}
        imageSlot={<img src={weverseLogo} alt="weverse" style={{ height: "20px", width: "auto", display: "block" }} />}
        trailingSlots={[
          <ChordIcon key="sparkle" name="aiSpecialMedium" size={24} />,
          <ChordIcon key="bell" name="notificationMedium" size={24} />,
        ]}
      />
    </div>
  );
}
