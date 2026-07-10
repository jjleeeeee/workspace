import type { HTMLAttributes } from "react";
import "./chord-logos.css";

import defaultAccountBizFullNameSvg from "./logos/default_account_biz_full_name.svg?raw";
import defaultAccountBizOnlyTextSvg from "./logos/default_account_biz_only_text.svg?raw";
import defaultAccountBizWTextSvg from "./logos/default_account_biz_w_text.svg?raw";
import defaultAccountFullNameSvg from "./logos/default_account_full_name.svg?raw";
import defaultAccountOnlyTextSvg from "./logos/default_account_only_text.svg?raw";
import defaultAccountWTextSvg from "./logos/default_account_w_text.svg?raw";
import defaultAlbumsFullNameSvg from "./logos/default_albums_full_name.svg?raw";
import defaultBackstageFullNameSvg from "./logos/default_backstage_full_name.svg?raw";
import defaultConcertsFullNameSvg from "./logos/default_concerts_full_name.svg?raw";
import defaultConcertsWTextSvg from "./logos/default_concerts_w_text.svg?raw";
import defaultDmFullNameSvg from "./logos/default_dm_full_name.svg?raw";
import defaultInsightFullNameSvg from "./logos/default_insight_full_name.svg?raw";
import defaultJellyshopOnlyTextSvg from "./logos/default_jellyshop_only_text.svg?raw";
import defaultMagazineFullNameSvg from "./logos/default_magazine_full_name.svg?raw";
import defaultMagazineOnlyTextSvg from "./logos/default_magazine_only_text.svg?raw";
import defaultMagazineWTextSvg from "./logos/default_magazine_w_text.svg?raw";
import defaultShopFullNameSvg from "./logos/default_shop_full_name.svg?raw";
import defaultShopOnlyTextSvg from "./logos/default_shop_only_text.svg?raw";
import defaultShopWTextSvg from "./logos/default_shop_w_text.svg?raw";
import defaultSpotFullNameSvg from "./logos/default_spot_full_name.svg?raw";
import defaultSpotWTextSvg from "./logos/default_spot_w_text.svg?raw";
import defaultSurveyFullNameSvg from "./logos/default_survey_full_name.svg?raw";
import defaultTicketFullNameSvg from "./logos/default_ticket_full_name.svg?raw";
import defaultTicketWTextSvg from "./logos/default_ticket_w_text.svg?raw";
import defaultWeverseMFullNameSvg from "./logos/default_weverse_m_full_name.svg?raw";
import defaultWeverseSFullNameSvg from "./logos/default_weverse_s_full_name.svg?raw";
import defaultWeverseXsFullNameSvg from "./logos/default_weverse_xs_full_name.svg?raw";
import fixedAccountBizFullNameSvg from "./logos/fixed_account_biz_full_name.svg?raw";
import fixedAccountBizOnlyTextSvg from "./logos/fixed_account_biz_only_text.svg?raw";
import fixedAccountBizWTextSvg from "./logos/fixed_account_biz_w_text.svg?raw";
import fixedAccountFullNameSvg from "./logos/fixed_account_full_name.svg?raw";
import fixedAccountOnlyTextSvg from "./logos/fixed_account_only_text.svg?raw";
import fixedAccountWTextSvg from "./logos/fixed_account_w_text.svg?raw";
import fixedAlbumsFullNameSvg from "./logos/fixed_albums_full_name.svg?raw";
import fixedBackstageFullNameSvg from "./logos/fixed_backstage_full_name.svg?raw";
import fixedConcertsFullNameSvg from "./logos/fixed_concerts_full_name.svg?raw";
import fixedConcertsWTextSvg from "./logos/fixed_concerts_w_text.svg?raw";
import fixedDmFullNameSvg from "./logos/fixed_dm_full_name.svg?raw";
import fixedInsightFullNameSvg from "./logos/fixed_insight_full_name.svg?raw";
import fixedJellyshopOnlyTextSvg from "./logos/fixed_jellyshop_only_text.svg?raw";
import fixedMagazineFullNameSvg from "./logos/fixed_magazine_full_name.svg?raw";
import fixedMagazineOnlyTextSvg from "./logos/fixed_magazine_only_text.svg?raw";
import fixedMagazineWTextSvg from "./logos/fixed_magazine_w_text.svg?raw";
import fixedShopFullNameSvg from "./logos/fixed_shop_full_name.svg?raw";
import fixedShopOnlyTextSvg from "./logos/fixed_shop_only_text.svg?raw";
import fixedShopWTextSvg from "./logos/fixed_shop_w_text.svg?raw";
import fixedSpotDarkFullNameSvg from "./logos/fixed_spot_dark_full_name.svg?raw";
import fixedSpotDarkWTextSvg from "./logos/fixed_spot_dark_w_text.svg?raw";
import fixedSpotLightFullNameSvg from "./logos/fixed_spot_light_full_name.svg?raw";
import fixedSpotLightWTextSvg from "./logos/fixed_spot_light_w_text.svg?raw";
import fixedSurveyFullNameSvg from "./logos/fixed_survey_full_name.svg?raw";
import fixedTicketDarkWTextSvg from "./logos/fixed_ticket_dark_w_text.svg?raw";
import fixedTicketFullNameSvg from "./logos/fixed_ticket_full_name.svg?raw";
import fixedTicketLightWTextSvg from "./logos/fixed_ticket_light_w_text.svg?raw";
import fixedWeverseMFullNameSvg from "./logos/fixed_weverse_m_full_name.svg?raw";
import fixedWeverseSFullNameSvg from "./logos/fixed_weverse_s_full_name.svg?raw";
import fixedWeverseXsFullNameSvg from "./logos/fixed_weverse_xs_full_name.svg?raw";

const LOGOS = {
  defaultAccountBizFullName: defaultAccountBizFullNameSvg,
  defaultAccountBizOnlyText: defaultAccountBizOnlyTextSvg,
  defaultAccountBizWText: defaultAccountBizWTextSvg,
  defaultAccountFullName: defaultAccountFullNameSvg,
  defaultAccountOnlyText: defaultAccountOnlyTextSvg,
  defaultAccountWText: defaultAccountWTextSvg,
  defaultAlbumsFullName: defaultAlbumsFullNameSvg,
  defaultBackstageFullName: defaultBackstageFullNameSvg,
  defaultConcertsFullName: defaultConcertsFullNameSvg,
  defaultConcertsWText: defaultConcertsWTextSvg,
  defaultDmFullName: defaultDmFullNameSvg,
  defaultInsightFullName: defaultInsightFullNameSvg,
  defaultJellyshopOnlyText: defaultJellyshopOnlyTextSvg,
  defaultMagazineFullName: defaultMagazineFullNameSvg,
  defaultMagazineOnlyText: defaultMagazineOnlyTextSvg,
  defaultMagazineWText: defaultMagazineWTextSvg,
  defaultShopFullName: defaultShopFullNameSvg,
  defaultShopOnlyText: defaultShopOnlyTextSvg,
  defaultShopWText: defaultShopWTextSvg,
  defaultSpotFullName: defaultSpotFullNameSvg,
  defaultSpotWText: defaultSpotWTextSvg,
  defaultSurveyFullName: defaultSurveyFullNameSvg,
  defaultTicketFullName: defaultTicketFullNameSvg,
  defaultTicketWText: defaultTicketWTextSvg,
  defaultWeverseMFullName: defaultWeverseMFullNameSvg,
  defaultWeverseSFullName: defaultWeverseSFullNameSvg,
  defaultWeverseXsFullName: defaultWeverseXsFullNameSvg,
  fixedAccountBizFullName: fixedAccountBizFullNameSvg,
  fixedAccountBizOnlyText: fixedAccountBizOnlyTextSvg,
  fixedAccountBizWText: fixedAccountBizWTextSvg,
  fixedAccountFullName: fixedAccountFullNameSvg,
  fixedAccountOnlyText: fixedAccountOnlyTextSvg,
  fixedAccountWText: fixedAccountWTextSvg,
  fixedAlbumsFullName: fixedAlbumsFullNameSvg,
  fixedBackstageFullName: fixedBackstageFullNameSvg,
  fixedConcertsFullName: fixedConcertsFullNameSvg,
  fixedConcertsWText: fixedConcertsWTextSvg,
  fixedDmFullName: fixedDmFullNameSvg,
  fixedInsightFullName: fixedInsightFullNameSvg,
  fixedJellyshopOnlyText: fixedJellyshopOnlyTextSvg,
  fixedMagazineFullName: fixedMagazineFullNameSvg,
  fixedMagazineOnlyText: fixedMagazineOnlyTextSvg,
  fixedMagazineWText: fixedMagazineWTextSvg,
  fixedShopFullName: fixedShopFullNameSvg,
  fixedShopOnlyText: fixedShopOnlyTextSvg,
  fixedShopWText: fixedShopWTextSvg,
  fixedSpotDarkFullName: fixedSpotDarkFullNameSvg,
  fixedSpotDarkWText: fixedSpotDarkWTextSvg,
  fixedSpotLightFullName: fixedSpotLightFullNameSvg,
  fixedSpotLightWText: fixedSpotLightWTextSvg,
  fixedSurveyFullName: fixedSurveyFullNameSvg,
  fixedTicketDarkWText: fixedTicketDarkWTextSvg,
  fixedTicketFullName: fixedTicketFullNameSvg,
  fixedTicketLightWText: fixedTicketLightWTextSvg,
  fixedWeverseMFullName: fixedWeverseMFullNameSvg,
  fixedWeverseSFullName: fixedWeverseSFullNameSvg,
  fixedWeverseXsFullName: fixedWeverseXsFullNameSvg,
} as const;

export type ChordLogoName = keyof typeof LOGOS;

export const chordLogoNames = Object.keys(LOGOS) as ChordLogoName[];

type ChordLogoProps = {
  name: ChordLogoName;
} & HTMLAttributes<HTMLSpanElement>;

export function ChordLogo({ name, className, ...rest }: ChordLogoProps) {
  return (
    <span
      className={["chord-logo", className].filter(Boolean).join(" ")}
      // ponytail: same inline SVG pattern as ChordIcon
      dangerouslySetInnerHTML={{ __html: LOGOS[name] }}
      {...rest}
    />
  );
}
