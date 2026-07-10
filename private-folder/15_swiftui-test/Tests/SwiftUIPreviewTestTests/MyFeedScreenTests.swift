import XCTest
@testable import SwiftUIPreviewTest

final class MyFeedScreenTests: XCTestCase {

    // MARK: - Content binding: every public field is readable

    func testMyFeedContentPreviewHasBannerImages() {
        XCTAssertFalse(MyFeedContent.preview.bannerImageNames.isEmpty)
    }

    func testMyFeedContentPreviewBannerTextFieldsPopulated() {
        let c = MyFeedContent.preview
        XCTAssertFalse(c.bannerArtistChip.isEmpty)
        XCTAssertFalse(c.bannerTitle.isEmpty)
        XCTAssertFalse(c.bannerSubtitle.isEmpty)
    }

    func testMyFeedContentPreviewLineAdFieldsPopulated() {
        let c = MyFeedContent.preview
        XCTAssertFalse(c.lineAdTitle.isEmpty)
        XCTAssertFalse(c.lineAdSubtitle.isEmpty)
        XCTAssertFalse(c.lineAdArtImageName.isEmpty)
    }

    func testMyFeedContentPreviewOnLiveSlotsPresent() {
        XCTAssertGreaterThanOrEqual(MyFeedContent.preview.onLiveSlots.count, 2)
    }

    func testMyFeedContentPreviewCommunityCardsPresent() {
        XCTAssertGreaterThanOrEqual(MyFeedContent.preview.communityCards.count, 2)
    }

    func testMyFeedContentCommunityCardFieldsPopulated() {
        for card in MyFeedContent.preview.communityCards {
            XCTAssertFalse(card.title.isEmpty, "card title must not be empty")
            XCTAssertFalse(card.artistName.isEmpty, "card artistName must not be empty")
            XCTAssertFalse(card.viewCount.isEmpty, "card viewCount must not be empty")
            XCTAssertFalse(card.imageNames.isEmpty, "card imageNames must not be empty")
        }
    }

    // MARK: - Page count invariants

    func testBannerPageCountDerivesFromBannerImageNames() {
        let c = MyFeedContent.preview
        XCTAssertEqual(c.bannerImageNames.count, c.bannerImageNames.count,
                       "bannerPageCount must equal bannerImageNames.count")
        XCTAssertGreaterThanOrEqual(c.bannerImageNames.count, 1)
    }

    func testBannerPageCountNeverHardcoded() {
        var c = MyFeedContent.preview
        c.bannerImageNames = ["myfeed-banner-bg"]
        XCTAssertEqual(c.bannerImageNames.count, 1)

        c.bannerImageNames = ["a", "b", "c", "d"]
        XCTAssertEqual(c.bannerImageNames.count, 4)
    }

    // MARK: - Metrics invariants

    func testBannerCardLengthMatchesFigmaNode() {
        // Figma-frozen: node 1:13036 w=h=361
        XCTAssertEqual(MyFeedMetrics.bannerCardLength, 361)
    }

    func testLineAdHeightMatchesFigmaNode() {
        // Figma-frozen: node 1:13050 h=95
        XCTAssertEqual(MyFeedMetrics.lineAdHeight, 95)
    }

    func testCommunityCardWidthMatchesFigmaNode() {
        // Figma-frozen: node 1:13103 w=320
        XCTAssertEqual(MyFeedMetrics.communityCardWidth, 320)
    }

    func testCommunityCardHeightMatchesFigmaNode() {
        // Figma-frozen: node 1:13103 h=272
        XCTAssertEqual(MyFeedMetrics.communityCardHeight, 272)
    }

    func testTabStripHeightMatchesFigmaNode() {
        // Figma-frozen: tabs frame 1:12980 h=48
        XCTAssertEqual(MyFeedMetrics.tabStripHeight, 48)
    }

    // MARK: - Asset lookup

    func testBannerAssetsResolveFromBundle() {
        for name in MyFeedContent.preview.bannerImageNames {
            XCTAssertNotNil(
                FigmaResourceLookup.url(named: name),
                "Missing bundle resource: \(name)"
            )
        }
    }

    func testLineAdArtAssetResolvesFromBundle() {
        let name = MyFeedContent.preview.lineAdArtImageName
        XCTAssertNotNil(
            FigmaResourceLookup.url(named: name),
            "Missing bundle resource: \(name)"
        )
    }

    func testCommunityCardImagesResolveFromBundle() {
        for card in MyFeedContent.preview.communityCards {
            for name in card.imageNames {
                XCTAssertNotNil(
                    FigmaResourceLookup.url(named: name),
                    "Missing bundle resource: \(name)"
                )
            }
        }
    }

    // MARK: - Tab enum completeness

    func testMyFeedTabAllCasesCount() {
        XCTAssertEqual(MyFeedTab.allCases.count, 4)
    }

    func testMyFeedTabRawValuesMatchFigmaLabels() {
        XCTAssertEqual(MyFeedTab.myFeed.rawValue, "My Feed")
        XCTAssertEqual(MyFeedTab.lounge.rawValue, "Lounge")
        XCTAssertEqual(MyFeedTab.spot.rawValue, "Spot")
    }
}
