// WeverseMyFeed — fixed Figma slot dimensions (as const)
// Source: Figma node 2:2207 (gnxpCiUTQhuWVgmdiSh61A), frame 393×2259

export const WeverseMyFeedMetrics = {
  // Frame
  frameWidth: 393,
  frameHeight: 852, // viewport height (one screen)

  // Navigation (Figma-frozen)
  statusBarHeight: 50,
  topNavHeight: 48,
  tabsRowHeight: 44,

  // Banner carousel slot (16px margin each side)
  slotScreenMargin: 16,
  slotContentAspectW: 361, // frameWidth - slotScreenMargin * 2
  bannerSlideSize: 361,    // = slotContentAspectW
  bannerSlideCount: 5,

  // LIVE Banner card (10px margin, Figma: onLive section)
  liveBannerHeight: 392,
  liveBannerRadius: 16,    // --system/size/radius/box/200

  // Moments / community cards
  momentThumbWidth: 100,
  momentThumbHeight: 133,
  momentThumbRadius: 8,    // --system/size/radius/box/100
  communityCardWidth: 100,
  communityCardGap: 12,

  // Bottom Navigation
  bottomNavHeight: 132,
  tabBarHeight: 132,       // alias for bottomNavHeight
} as const;

// Invariants
const m = WeverseMyFeedMetrics;
if (m.momentThumbWidth >= m.frameWidth)
  throw new Error("WeverseMyFeedMetrics: momentThumbWidth invariant violated");
if (m.slotContentAspectW !== m.frameWidth - m.slotScreenMargin * 2)
  throw new Error("WeverseMyFeedMetrics: slotContentAspectW invariant violated");
if (m.bannerSlideSize !== m.slotContentAspectW)
  throw new Error("WeverseMyFeedMetrics: bannerSlideSize invariant violated");
