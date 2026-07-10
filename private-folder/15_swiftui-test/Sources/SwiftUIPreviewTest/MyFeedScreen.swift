import SwiftUI

// MARK: - Metrics

enum MyFeedMetrics {
    // Figma-frozen: banner node 1:13036 w=361, h=361; radius var(--system/size/radius/box/300,24px)
    static let bannerCardLength: CGFloat = 361
    static let bannerCardRadius: CGFloat = 24
    // Figma-frozen: line_ad node 1:13050 h=95; rounded-[20px]
    static let lineAdHeight: CGFloat = 95
    static let lineAdRadius: CGFloat = 20
    // Figma-frozen: community card node 1:13103 w=320, h=272
    static let communityCardWidth: CGFloat = 320
    static let communityCardHeight: CGFloat = 272
    // Figma-frozen: card img node 1:13104 h=174.58 / 320
    static let communityCardImageHeight: CGFloat = 175
    static let communityCardRadius: CGFloat = 24
    static let communityCardImageRadius: CGFloat = 21
    // Figma-frozen: tab strip h=48, bottom bar h=95
    static let tabStripHeight: CGFloat = 48
    static let bottomBarHeight: CGFloat = 95
    // Banner artist chip
    static let bannerChipHeight: CGFloat = 24
    static let bannerChipRadius: CGFloat = 100
    // Pagination pill
    static let paginationPillHeight: CGFloat = 20
}

// MARK: - Content Models

public struct MyFeedCommunityCard: Equatable, Sendable {
    public var title: String
    public var caption: String
    public var artistName: String
    public var dateText: String
    public var viewCount: String
    public var imageNames: [String]
    public var avatarImageName: String

    public init(
        title: String,
        caption: String,
        artistName: String,
        dateText: String,
        viewCount: String,
        imageNames: [String],
        avatarImageName: String
    ) {
        self.title = title
        self.caption = caption
        self.artistName = artistName
        self.dateText = dateText
        self.viewCount = viewCount
        self.imageNames = imageNames
        self.avatarImageName = avatarImageName
    }
}

public struct MyFeedContent: Equatable, Sendable {
    public var bannerImageNames: [String]
    public var bannerArtistChip: String
    public var bannerTitle: String
    public var bannerSubtitle: String
    public var lineAdTitle: String
    public var lineAdSubtitle: String
    public var lineAdArtImageName: String
    public var onLiveSlots: [OnLiveContent]
    public var communityTitle: String
    public var communityCards: [MyFeedCommunityCard]

    public init(
        bannerImageNames: [String],
        bannerArtistChip: String,
        bannerTitle: String,
        bannerSubtitle: String,
        lineAdTitle: String,
        lineAdSubtitle: String,
        lineAdArtImageName: String,
        onLiveSlots: [OnLiveContent],
        communityTitle: String,
        communityCards: [MyFeedCommunityCard]
    ) {
        self.bannerImageNames = bannerImageNames
        self.bannerArtistChip = bannerArtistChip
        self.bannerTitle = bannerTitle
        self.bannerSubtitle = bannerSubtitle
        self.lineAdTitle = lineAdTitle
        self.lineAdSubtitle = lineAdSubtitle
        self.lineAdArtImageName = lineAdArtImageName
        self.onLiveSlots = onLiveSlots
        self.communityTitle = communityTitle
        self.communityCards = communityCards
    }

    public static let preview = MyFeedContent(
        bannerImageNames: [
            "myfeed-banner-bg",
            "myfeed-banner-overlay1",
            "myfeed-banner-overlay2",
        ],
        bannerArtistChip: "ENHYPEN",
        bannerTitle: "ENHYPEN POP-UP in SYDNEY'Found Heaven",
        bannerSubtitle: "Check it out now!",
        lineAdTitle: "더 맛있어진 코-크 제로!",
        lineAdSubtitle: "뷔와 함께 짜릿한 코카콜라 제로 어때?",
        lineAdArtImageName: "myfeed-linead-art",
        onLiveSlots: [
            OnLiveContent(
                navTitle: "Weverse",
                sectionTitle: "ON LIVE",
                tabs: ["Label", "Label"],
                liveTitle: "Our first Weverse LIVE!",
                artistName: "21Tweebts...",
                bodyText: "",
                ctaLabel: "{ENHYPEN}의 공지사항을 확인해 보세요",
                heroImageNames: [
                    "onlive-hero-1",
                    "onlive-hero-2",
                    "onlive-hero-3",
                ],
                avatarImageName: "onlive-avatar-en"
            ),
            OnLiveContent(
                navTitle: "Weverse",
                sectionTitle: "ON LIVE",
                tabs: ["Label", "Label"],
                liveTitle: "Our first Weverse LIVE!",
                artistName: "Savannah Nguyen",
                bodyText: "",
                ctaLabel: "{Artist}의 공지사항을 확인해 보세요",
                heroImageNames: [
                    "onlive-hero-4",
                    "onlive-hero-5",
                ],
                avatarImageName: "onlive-avatar-en"
            ),
        ],
        communityTitle: "Our first Weverse LIVE!",
        communityCards: [
            MyFeedCommunityCard(
                title: "Our first Weverse LIVE!",
                caption: "CORTIS (코르티스) 'FaSHion'",
                artistName: "KATESYS",
                dateText: "12. 23. 21:00",
                viewCount: "10K",
                imageNames: ["myfeed-community-base", "myfeed-community-card1"],
                avatarImageName: "onlive-avatar-en"
            ),
            MyFeedCommunityCard(
                title: "Our first Weverse LIVE!",
                caption: "엠카 wasssup",
                artistName: "KATESYS",
                dateText: "",
                viewCount: "10K",
                imageNames: ["myfeed-community-base", "myfeed-community-card2"],
                avatarImageName: "onlive-avatar-en"
            ),
            MyFeedCommunityCard(
                title: "Our first Weverse LIVE!",
                caption: "",
                artistName: "KATESYS",
                dateText: "",
                viewCount: "10K",
                imageNames: ["myfeed-community-base", "myfeed-community-card3"],
                avatarImageName: "onlive-avatar-en"
            ),
        ]
    )
}

// MARK: - Tab enum

enum MyFeedTab: String, CaseIterable {
    case myFeed = "My Feed"
    case lounge = "Lounge"
    case live = "LIVE"
    case spot = "Spot"
}

// MARK: - Screen

public struct MyFeedScreen: View {
    public let content: MyFeedContent
    @State private var selectedTab: MyFeedTab = .lounge
    @State private var bannerPage: Int = 0

    public init(content: MyFeedContent = .preview) {
        self.content = content
    }

    private var bannerPageCount: Int { content.bannerImageNames.count }

    public var body: some View {
        #if os(iOS)
        if #available(iOS 18, *) {
            tabViewBody
        } else {
            scrollBody
                .navigationTitle("")
                .navigationBarTitleDisplayMode(.inline)
                .toolbar {
                    topBarItems
                }
        }
        #else
        scrollBody
        #endif
    }

    #if os(iOS)
    @available(iOS 18, *)
    private var tabViewBody: some View {
        TabView {
            Tab("Home", systemImage: "house.fill") {
                NavigationStack {
                    scrollBody
                        .navigationTitle("")
                        .navigationBarTitleDisplayMode(.inline)
                        .toolbar { topBarItems }
                }
            }
            Tab("DM", systemImage: "message") {
                ContentUnavailableView("DM", systemImage: "message")
            }
            Tab("Shop", systemImage: "bag") {
                ContentUnavailableView("Shop", systemImage: "bag")
            }
            Tab("More", systemImage: "ellipsis") {
                ContentUnavailableView("More", systemImage: "ellipsis")
            }
            Tab(role: .search) {
                ContentUnavailableView("Search", systemImage: "magnifyingglass")
            }
        }
    }
    #endif

    private var scrollBody: some View {
        ScrollView {
            LazyVStack(alignment: .leading, spacing: 0) {
                tabStrip
                bannerSection
                    .padding(.top, ChordToken.Padding.box75)

                ForEach(content.onLiveSlots.indices, id: \.self) { index in
                    OnLiveCard(content: content.onLiveSlots[index])
                        .padding(.horizontal, ChordToken.Margin.screen200)
                        .padding(.vertical, OnLiveScreenMetrics.communityVerticalInset)
                }

                communitySection
            }
        }
        .background(ChordToken.Color.surfaceDefault.swiftUIColor)
    }

    // MARK: - Top Bar toolbar items

    @ToolbarContentBuilder
    private var topBarItems: some ToolbarContent {
        #if os(iOS)
        ToolbarItem(placement: .principal) {
            Text("weverse")
                .font(.system(size: 20, weight: .heavy, design: .default))
                .foregroundStyle(ChordToken.Color.textDefault.swiftUIColor)
        }
        ToolbarItem(placement: .topBarTrailing) {
            HStack(spacing: ChordToken.Padding.box100) {
                Button(action: { /* TODO: sparkle action */ }) {
                    Image(systemName: "sparkle")
                        .font(.body)
                        .foregroundStyle(ChordToken.Color.iconDefault.swiftUIColor)
                }
                Button(action: { /* TODO: notifications */ }) {
                    Image(systemName: "bell")
                        .font(.body)
                        .foregroundStyle(ChordToken.Color.iconDefault.swiftUIColor)
                }
            }
        }
        #else
        ToolbarItem(placement: .automatic) {
            Text("weverse")
                .font(.system(size: 20, weight: .heavy))
                .foregroundStyle(ChordToken.Color.textDefault.swiftUIColor)
        }
        #endif
    }

    // MARK: - Tab Strip (My Feed / Lounge / LIVE / Spot)

    private var tabStrip: some View {
        HStack(spacing: 0) {
            ForEach(MyFeedTab.allCases, id: \.self) { tab in
                tabButton(tab: tab)
            }
            Spacer()
        }
        .frame(height: MyFeedMetrics.tabStripHeight)
        .padding(.horizontal, ChordToken.Margin.screen200)
    }

    private func tabButton(tab: MyFeedTab) -> some View {
        let isSelected = selectedTab == tab
        return Button(action: { selectedTab = tab }) {
            VStack(spacing: 0) {
                Spacer()
                Text(tab.rawValue)
                    .font(
                        isSelected
                            ? ChordToken.Typography.bodyMSystem700.font
                            : ChordToken.Typography.bodyMSystem400.font
                    )
                    .foregroundStyle(
                        isSelected
                            ? ChordToken.Color.textDefault.swiftUIColor
                            : ChordToken.Color.textGray500.swiftUIColor
                    )
                    .padding(.horizontal, ChordToken.Padding.box75)
                Spacer(minLength: 4)
                Rectangle()
                    .fill(isSelected ? ChordToken.Color.textDefault.swiftUIColor : Color.clear)
                    .frame(height: 2)
            }
        }
        .buttonStyle(.plain)
        .fixedSize(horizontal: true, vertical: false)
    }

    // MARK: - Banner Section (Main banner + Line_ad)

    private var bannerSection: some View {
        VStack(alignment: .leading, spacing: ChordToken.Padding.box200) {
            bannerCard
                .padding(.horizontal, ChordToken.Margin.screen200)
            lineAd
                .padding(.horizontal, ChordToken.Margin.screen200)
        }
        .padding(.bottom, ChordToken.Padding.box75)
    }

    private var bannerCard: some View {
        ZStack(alignment: .bottom) {
            // Full-bleed banner image carousel
            TabView(selection: $bannerPage) {
                ForEach(content.bannerImageNames.indices, id: \.self) { index in
                    FigmaResourceImage(name: content.bannerImageNames[index])
                        .aspectRatio(contentMode: .fill)
                        .tag(index)
                }
            }
            #if os(iOS)
            .tabViewStyle(.page(indexDisplayMode: .never))
            #endif
            .frame(width: MyFeedMetrics.bannerCardLength, height: MyFeedMetrics.bannerCardLength)
            .onChange(of: bannerPageCount) { _, newCount in
                if bannerPage >= newCount { bannerPage = max(0, newCount - 1) }
            }

            // Gradient overlay
            LinearGradient(
                colors: [.clear, .black.opacity(0.6)],
                startPoint: UnitPoint(x: 0.5, y: 0.45),
                endPoint: .bottom
            )

            // Text content over gradient
            VStack(alignment: .center, spacing: ChordToken.Padding.box75) {
                Text(content.bannerArtistChip)
                    .font(ChordToken.Typography.captionSSystem700.font)
                    .foregroundStyle(Color.white)
                    .padding(.horizontal, ChordToken.Padding.box100)
                    .frame(height: MyFeedMetrics.bannerChipHeight)
                    .background(Color.black.opacity(0.2))
                    .overlay(
                        Capsule()
                            .strokeBorder(Color.white.opacity(0.3), lineWidth: 1)
                    )
                    .clipShape(Capsule())

                VStack(alignment: .center, spacing: ChordToken.Padding.box50) {
                    Text(content.bannerTitle)
                        .font(ChordToken.Typography.headlineMSystem800.font)
                        .foregroundStyle(Color.white)
                        .multilineTextAlignment(.center)
                        .frame(maxWidth: .infinity)

                    Text(content.bannerSubtitle)
                        .font(ChordToken.Typography.bodyMSystem400.font)
                        .foregroundStyle(Color.white.opacity(0.8))
                        .multilineTextAlignment(.center)
                        .frame(maxWidth: .infinity)
                }
            }
            .padding(.horizontal, ChordToken.Padding.box200)
            .padding(.bottom, ChordToken.Padding.box200)

            // Pagination pill (top-right)
            paginationPill
                .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topTrailing)
                .padding(.top, ChordToken.Padding.box200)
                .padding(.trailing, ChordToken.Padding.box200)
        }
        .frame(width: MyFeedMetrics.bannerCardLength, height: MyFeedMetrics.bannerCardLength)
        .clipShape(RoundedRectangle(cornerRadius: MyFeedMetrics.bannerCardRadius, style: .continuous))
        .overlay(
            RoundedRectangle(cornerRadius: MyFeedMetrics.bannerCardRadius, style: .continuous)
                .strokeBorder(ChordToken.Color.outlineDefault50a.swiftUIColor, lineWidth: 1)
        )
        .accessibilityLabel(content.bannerTitle)
    }

    private var paginationPill: some View {
        Text("\(bannerPage + 1) / \(bannerPageCount)")
            .font(ChordToken.Typography.captionSSystem700.font)
            .foregroundStyle(Color.white)
            .padding(.horizontal, ChordToken.Padding.box100)
            .frame(height: MyFeedMetrics.paginationPillHeight)
            .background(Color.black.opacity(0.2))
            .clipShape(Capsule())
    }

    // MARK: - Line Ad

    private var lineAd: some View {
        ZStack(alignment: .trailing) {
            // Red background
            LinearGradient(
                colors: [
                    Color(red: 195/255, green: 42/255, blue: 45/255),
                    Color(red: 195/255, green: 42/255, blue: 45/255),
                ],
                startPoint: .leading,
                endPoint: .trailing
            )

            // Art image (right side, clipped)
            FigmaResourceImage(name: content.lineAdArtImageName)
                .aspectRatio(contentMode: .fill)
                .frame(width: 145, height: MyFeedMetrics.lineAdHeight)
                .clipped()

            // Gradient fade from left over art
            LinearGradient(
                colors: [
                    Color(red: 195/255, green: 42/255, blue: 45/255),
                    Color.clear,
                ],
                startPoint: UnitPoint(x: 0.5, y: 0.5),
                endPoint: .trailing
            )
            .frame(width: 80)
            .frame(maxWidth: .infinity, alignment: .trailing)

            // Text content (left side)
            HStack {
                VStack(alignment: .leading, spacing: ChordToken.Padding.box25) {
                    Text(content.lineAdTitle)
                        .font(ChordToken.Typography.bodyLgSystem700.font)
                        .foregroundStyle(Color.white)
                        .lineLimit(1)

                    Text(content.lineAdSubtitle)
                        .font(ChordToken.Typography.captionMSystem400.font)
                        .foregroundStyle(Color.white.opacity(0.65))
                        .lineLimit(1)
                }
                .padding(.leading, ChordToken.Padding.box200)
                Spacer()
            }
        }
        .frame(maxWidth: .infinity)
        .frame(height: MyFeedMetrics.lineAdHeight)
        .clipShape(RoundedRectangle(cornerRadius: MyFeedMetrics.lineAdRadius, style: .continuous))
        .accessibilityLabel(content.lineAdTitle)
    }

    // MARK: - Community Section (horizontal carousel)

    private var communitySection: some View {
        VStack(alignment: .leading, spacing: ChordToken.Padding.box75) {
            Text(content.communityTitle)
                .font(ChordToken.Typography.headlineMSystem800.font)
                .foregroundStyle(ChordToken.Color.textDefault.swiftUIColor)
                .frame(height: OnLiveScreenMetrics.sectionHeaderHeight)
                .padding(.horizontal, ChordToken.Margin.screen200)

            ScrollView(.horizontal, showsIndicators: false) {
                LazyHStack(spacing: ChordToken.Padding.box150) {
                    ForEach(content.communityCards.indices, id: \.self) { index in
                        communityCardView(content.communityCards[index])
                    }
                }
                .padding(.horizontal, ChordToken.Margin.screen200)
                .padding(.vertical, OnLiveScreenMetrics.communityVerticalInset)
            }
        }
    }

    private func communityCardView(_ card: MyFeedCommunityCard) -> some View {
        VStack(alignment: .leading, spacing: 0) {
            ZStack(alignment: .topLeading) {
                // Card image
                if card.imageNames.isEmpty {
                    Rectangle()
                        .fill(ChordToken.Color.surfaceDefaultgray50.swiftUIColor)
                } else {
                    FigmaResourceImage(name: card.imageNames.last ?? card.imageNames[0])
                        .aspectRatio(contentMode: .fill)
                }

                // View count chip (top-left)
                HStack(spacing: ChordToken.Padding.box50) {
                    Image(systemName: "play.fill")
                        .font(.system(size: 10))
                        .foregroundStyle(Color.white.opacity(0.65))
                    Text(card.viewCount)
                        .font(ChordToken.Typography.captionMSystem500.font)
                        .foregroundStyle(Color.white.opacity(0.65))
                }
                .padding(.horizontal, ChordToken.Padding.box150)
                .frame(height: 32)
                .background(Color.black.opacity(0.5))
                .clipShape(Capsule())
                .padding([.top, .leading], OnLiveScreenMetrics.communityVerticalInset)
            }
            .frame(width: MyFeedMetrics.communityCardWidth, height: MyFeedMetrics.communityCardImageHeight)
            .clipShape(
                UnevenRoundedRectangle(
                    topLeadingRadius: MyFeedMetrics.communityCardImageRadius,
                    topTrailingRadius: MyFeedMetrics.communityCardImageRadius,
                    style: .continuous
                )
            )

            // Title + music player row
            HStack(alignment: .top, spacing: ChordToken.Padding.box50) {
                // Avatar
                FigmaResourceImage(name: card.avatarImageName)
                    .frame(width: 33, height: 33)
                    .clipShape(Circle())

                VStack(alignment: .leading, spacing: 0) {
                    Text(card.title)
                        .font(ChordToken.Typography.bodyMSystem700.font)
                        .foregroundStyle(ChordToken.Color.textDefault.swiftUIColor)
                        .lineLimit(1)

                    HStack(spacing: ChordToken.Padding.box25) {
                        Text(card.artistName)
                            .font(ChordToken.Typography.captionSSystem400.font)
                            .foregroundStyle(ChordToken.Color.textGray500.swiftUIColor)
                            .lineLimit(1)

                        Image(systemName: "checkmark.seal.fill")
                            .font(.system(size: 10))
                            .foregroundStyle(ChordToken.Color.textPrimary.swiftUIColor)
                            .accessibilityHidden(true)

                        if !card.dateText.isEmpty {
                            Text("·")
                                .foregroundStyle(ChordToken.Color.textGray500.swiftUIColor)
                            Text(card.dateText)
                                .font(ChordToken.Typography.captionSSystem400.font)
                                .foregroundStyle(ChordToken.Color.textGray500.swiftUIColor)
                                .lineLimit(1)
                        }
                    }
                }

                Spacer(minLength: 0)
            }
            .padding(.horizontal, ChordToken.Padding.box150)
            .padding(.top, ChordToken.Padding.box150)

            // Caption
            if !card.caption.isEmpty {
                Text(card.caption)
                    .font(ChordToken.Typography.captionMSystem400.font)
                    .foregroundStyle(ChordToken.Color.textDefault.swiftUIColor)
                    .lineLimit(1)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(.horizontal, ChordToken.Padding.box150)
                    .padding(.top, ChordToken.Padding.box50)
            }

            Spacer(minLength: 0)
        }
        .frame(width: MyFeedMetrics.communityCardWidth, height: MyFeedMetrics.communityCardHeight)
        .background(ChordToken.Color.surfaceDefault4.swiftUIColor)
        .clipShape(RoundedRectangle(cornerRadius: MyFeedMetrics.communityCardRadius, style: .continuous))
        .shadow(color: .black.opacity(0.10), radius: 12, x: 0, y: 0)
        .accessibilityLabel(card.title)
    }
}

// MARK: - Preview

#Preview("My Feed Screen") {
    NavigationStack {
        MyFeedScreen()
            .navigationTitle("")
            #if os(iOS)
            .navigationBarTitleDisplayMode(.inline)
            #endif
    }
}
