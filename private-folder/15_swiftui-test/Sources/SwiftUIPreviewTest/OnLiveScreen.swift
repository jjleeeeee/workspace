import SwiftUI

// MARK: - Metrics

enum OnLiveScreenMetrics {
  static let slotWidth: CGFloat = 393
  static let sectionHeaderHeight: CGFloat = 48
  static let chipRowHeight: CGFloat = 48
  static let chipHeight: CGFloat = 32
  static let heroHeight: CGFloat = 218
  static let avatarLength: CGFloat = 38
  static let avatarBadgeSlotHeight: CGFloat = 46
  static let avatarImageLength: CGFloat = 32
  static let avatarImageOffsetX: CGFloat = 4
  static let avatarImageOffsetY: CGFloat = 0
  static let liveBadgeStrokeWidth: CGFloat = 2
  static let liveBadgeOffsetX: CGFloat = 0
  static let liveBadgeOffsetY: CGFloat = 29
  static let verifiedBadgeSize: CGFloat = 12
  static let paginationDotSize: CGFloat = 8
  static let ctaMinHeight: CGFloat = 56
  static let cardShadowRadius: CGFloat = 28
  static let dividerThickness: CGFloat = 1
  static let communityVerticalInset: CGFloat = 10
  static let cardHeaderVerticalPadding: CGFloat = ChordToken.Padding.box150
}

// MARK: - Content Model

public struct OnLiveContent: Equatable, Sendable {
    public var navTitle: String
    public var sectionTitle: String
    public var tabs: [String]
    public var liveTitle: String
    public var artistName: String
    public var bodyText: String
    public var ctaLabel: String
    public var heroImageNames: [String]
    public var avatarImageName: String

    public init(
        navTitle: String,
        sectionTitle: String,
        tabs: [String],
        liveTitle: String,
        artistName: String,
        bodyText: String,
        ctaLabel: String,
        heroImageNames: [String],
        avatarImageName: String
    ) {
        self.navTitle = navTitle
        self.sectionTitle = sectionTitle
        self.tabs = tabs
        self.liveTitle = liveTitle
        self.artistName = artistName
        self.bodyText = bodyText
        self.ctaLabel = ctaLabel
        self.heroImageNames = heroImageNames
        self.avatarImageName = avatarImageName
    }

    public static let preview = OnLiveContent(
        navTitle: "Title",
        sectionTitle: "ON LIVE",
        tabs: ["Label", "Label"],
        liveTitle: "Our first Weverse LIVE!",
        artistName: "ENHYPEN",
        bodyText: "📢 [ENHYPEN 'THE SIN : VANISH' Selfies 📸] Release : 2026.03.06 4PM (KST)",
        ctaLabel: "{ENHYPEN}의 공지사항을 확인해 보세요",
        heroImageNames: [
            "onlive-hero-1",
            "onlive-hero-2",
            "onlive-hero-3",
            "onlive-hero-4",
            "onlive-hero-5",
        ],
        avatarImageName: "onlive-avatar-en"
    )
}

// MARK: - Card (reusable by MyFeedScreen)

public struct OnLiveCard: View {
    public let content: OnLiveContent
    @State private var selectedTab: Int = 0
    @State private var heroPage: Int = 0

    public init(content: OnLiveContent) {
        self.content = content
    }

    private var pageCount: Int { content.heroImageNames.count }

    public var body: some View {
        VStack(alignment: .leading, spacing: ChordToken.Padding.box50) {
            VStack(alignment: .leading, spacing: ChordToken.Padding.box0) {
                titleHeader
                chipTabs
            }
            liveCard
        }
    }

    private var titleHeader: some View {
        Text(content.sectionTitle)
            .font(ChordToken.Typography.headlineMSystem800.font)
            .foregroundStyle(ChordToken.Color.textDefault.swiftUIColor)
            .frame(maxWidth: .infinity, alignment: .leading)
            .frame(height: OnLiveScreenMetrics.sectionHeaderHeight)
    }

    private var chipTabs: some View {
        HStack(spacing: ChordToken.Padding.box100) {
            ForEach(content.tabs.indices, id: \.self) { index in
                chipButton(
                    label: content.tabs[index],
                    isSelected: selectedTab == index,
                    action: { selectedTab = index }
                )
            }
            Spacer()
        }
        .frame(height: OnLiveScreenMetrics.chipRowHeight)
    }

    private func chipButton(label: String, isSelected: Bool, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            Text(label)
                .font(ChordToken.Typography.bodySSystem500.font)
                .foregroundStyle(
                    isSelected
                        ? ChordToken.Color.textDefaultReverse.swiftUIColor
                        : ChordToken.Color.textDefault.swiftUIColor
                )
                .lineLimit(1)
                .padding(.horizontal, ChordToken.Padding.box150)
                .frame(height: OnLiveScreenMetrics.chipHeight)
                .background(
                    isSelected
                        ? ChordToken.Color.surfaceDefaultReverse.swiftUIColor
                        : Color.clear
                )
                .overlay(
                    Capsule()
                        .strokeBorder(
                            isSelected
                                ? Color.clear
                                : ChordToken.Color.buttonOutlinedGray.swiftUIColor,
                            lineWidth: 1
                        )
                )
                .clipShape(Capsule())
        }
        .buttonStyle(.plain)
    }

    private var liveCard: some View {
        VStack(alignment: .leading, spacing: ChordToken.Padding.box0) {
            heroCarousel
            cardHeader
            cardContext
            Rectangle()
                .fill(ChordToken.Color.divideDefault50a.swiftUIColor)
                .frame(height: OnLiveScreenMetrics.dividerThickness)
            cardCTA
        }
        .background(ChordToken.Color.surfaceDefault4.swiftUIColor)
        .clipShape(RoundedRectangle(cornerRadius: ChordToken.Radius.box300, style: .continuous))
        .shadow(color: .black.opacity(0.10), radius: OnLiveScreenMetrics.cardShadowRadius, x: 0, y: 0)
    }

    private var heroCarousel: some View {
        ZStack(alignment: .bottom) {
            TabView(selection: $heroPage) {
                ForEach(content.heroImageNames.indices, id: \.self) { index in
                    FigmaResourceImage(name: content.heroImageNames[index])
                        .tag(index)
                }
            }
            #if os(iOS)
            .tabViewStyle(.page(indexDisplayMode: .never))
            #endif
            .frame(height: OnLiveScreenMetrics.heroHeight)

            paginationDots
                .padding(.bottom, ChordToken.Padding.box150)
        }
        .frame(maxWidth: .infinity)
        .frame(height: OnLiveScreenMetrics.heroHeight)
        .clipped()
        .onChange(of: pageCount) { _, newCount in
            if heroPage >= newCount { heroPage = max(0, newCount - 1) }
        }
        .accessibilityHidden(true)
    }

    private var paginationDots: some View {
        HStack(spacing: ChordToken.Padding.box75) {
            ForEach(0..<pageCount, id: \.self) { index in
                Circle()
                    .fill(
                        index == heroPage
                            ? ChordToken.Color.surfaceDefaultReverse.swiftUIColor
                            : ChordToken.Color.surfaceDefault200a.swiftUIColor
                    )
                    .frame(
                        width: OnLiveScreenMetrics.paginationDotSize,
                        height: OnLiveScreenMetrics.paginationDotSize
                    )
            }
        }
    }

    private var cardHeader: some View {
        HStack(alignment: .center, spacing: ChordToken.Padding.box100) {
            avatarWithLiveBadge
                .accessibilityHidden(true)

            VStack(alignment: .leading, spacing: 0) {
                Text(content.liveTitle)
                    .font(ChordToken.Typography.bodyMSystem700.font)
                    .foregroundStyle(ChordToken.Color.textDefault.swiftUIColor)
                    .lineLimit(1)

                HStack(spacing: ChordToken.Padding.box25) {
                    Text(content.artistName)
                        .font(ChordToken.Typography.captionMSystem400.font)
                        .foregroundStyle(ChordToken.Color.textGray500.swiftUIColor)
                        .lineLimit(1)

                    Image(systemName: "checkmark.seal.fill")
                        .font(.system(size: OnLiveScreenMetrics.verifiedBadgeSize))
                        .foregroundStyle(ChordToken.Color.textPrimary.swiftUIColor)
                        .accessibilityHidden(true)
                }
            }

            Spacer(minLength: 0)
        }
        .padding(.horizontal, ChordToken.Padding.box200)
        .frame(height: OnLiveScreenMetrics.chipRowHeight)
        .padding(.vertical, OnLiveScreenMetrics.cardHeaderVerticalPadding)
    }

    private var avatarWithLiveBadge: some View {
        ZStack(alignment: .topLeading) {
            FigmaResourceImage(name: content.avatarImageName)
                .frame(
                    width: OnLiveScreenMetrics.avatarImageLength,
                    height: OnLiveScreenMetrics.avatarImageLength
                )
                .clipShape(RoundedRectangle(cornerRadius: ChordToken.Radius.box75, style: .continuous))
                .offset(
                    x: OnLiveScreenMetrics.avatarImageOffsetX,
                    y: OnLiveScreenMetrics.avatarImageOffsetY
                )

            Text("LIVE")
                .font(ChordToken.Typography.captionXsSystem700.font)
                .foregroundStyle(ChordToken.Color.fixedTextDefault.swiftUIColor)
                .padding(.horizontal, ChordToken.Padding.box50)
                .padding(.vertical, ChordToken.Padding.box25)
                .background(ChordToken.Color.fixedStatusDangerRed.swiftUIColor)
                .clipShape(RoundedRectangle(cornerRadius: ChordToken.Radius.box50, style: .continuous))
                .overlay(
                    RoundedRectangle(cornerRadius: ChordToken.Radius.box50, style: .continuous)
                        .strokeBorder(
                            ChordToken.Color.outlineDefaultReverse.swiftUIColor,
                            lineWidth: OnLiveScreenMetrics.liveBadgeStrokeWidth
                        )
                )
                .offset(
                    x: OnLiveScreenMetrics.liveBadgeOffsetX,
                    y: OnLiveScreenMetrics.liveBadgeOffsetY
                )
        }
        .frame(
            width: OnLiveScreenMetrics.avatarLength,
            height: OnLiveScreenMetrics.avatarBadgeSlotHeight
        )
        .clipped()
    }

    private var cardContext: some View {
        Text(content.bodyText)
            .font(ChordToken.Typography.bodyXsSystem400.font)
            .foregroundStyle(ChordToken.Color.textDefault.swiftUIColor)
            .lineLimit(3)
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(.horizontal, ChordToken.Padding.box200)
            .padding(.bottom, ChordToken.Padding.box200)
    }

    private var cardCTA: some View {
        Button(action: { /* TODO: navigate to announcements */ }) {
            HStack(spacing: ChordToken.Padding.box100) {
                Text(content.ctaLabel)
                    .font(ChordToken.Typography.bodySSystem700.font)
                    .foregroundStyle(ChordToken.Color.textDefault.swiftUIColor)
                    .lineLimit(1)
                    .minimumScaleFactor(0.8)

                Spacer(minLength: ChordToken.Padding.box100)

                Image(systemName: "arrow.right")
                    .font(.body.weight(.medium))
                    .foregroundStyle(ChordToken.Color.textDefault.swiftUIColor)
            }
            .padding(.horizontal, ChordToken.Padding.box200)
        }
        .buttonStyle(.plain)
        .frame(minHeight: OnLiveScreenMetrics.ctaMinHeight)
    }
}

// MARK: - Screen

public struct OnLiveScreen: View {
    public let content: OnLiveContent

    public init(content: OnLiveContent = .preview) {
        self.content = content
    }

    public var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: ChordToken.Padding.box50) {
                    OnLiveCard(content: content)
                        .padding(.horizontal, ChordToken.Margin.screen200)
                        .padding(.vertical, OnLiveScreenMetrics.communityVerticalInset)
                }
            }
            .background(ChordToken.Color.surfaceDefault.swiftUIColor)
            .navigationTitle("")
            #if os(iOS)
            .navigationBarTitleDisplayMode(.inline)
            #endif
            .toolbar {
                #if os(iOS)
                ToolbarItem(placement: .topBarLeading) {
                    Button(action: { /* TODO: go back */ }) {
                        Image(systemName: "chevron.left")
                            .font(.body.weight(.medium))
                            .foregroundStyle(ChordToken.Color.iconDefault.swiftUIColor)
                    }
                }
                ToolbarItem(placement: .principal) {
                    Text(content.navTitle)
                        .font(ChordToken.Typography.bodyLgSystem700.font)
                        .foregroundStyle(ChordToken.Color.textDefault.swiftUIColor)
                }
                ToolbarItem(placement: .topBarTrailing) {
                    Button(action: { /* TODO: dismiss */ }) {
                        Image(systemName: "xmark")
                            .font(.body.weight(.medium))
                            .foregroundStyle(ChordToken.Color.iconDefault.swiftUIColor)
                    }
                }
                #else
                ToolbarItem(placement: .automatic) {
                    Text(content.navTitle)
                        .font(ChordToken.Typography.bodyLgSystem700.font)
                        .foregroundStyle(ChordToken.Color.textDefault.swiftUIColor)
                }
                #endif
            }
        }
    }
}

// MARK: - Preview

#Preview("ON LIVE Screen") {
    OnLiveScreen()
}
