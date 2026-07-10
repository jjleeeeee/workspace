import XCTest
@testable import SwiftUIPreviewTest

final class OnLiveScreenTests: XCTestCase {

  // MARK: - Asset Lookup

  func testOnLiveHeroAssetsResolveFromBundle() {
    for name in OnLiveContent.preview.heroImageNames {
      let url = FigmaResourceLookup.url(named: name)
      XCTAssertNotNil(url, "Missing PNG for \(name). Diagnostics: \(FigmaResourceLookup.diagnostics(named: name))")
      XCTAssertEqual(url?.lastPathComponent, "\(name).png")
    }
  }

  func testOnLiveAvatarAssetResolvesFromBundle() {
    let name = OnLiveContent.preview.avatarImageName
    let url = FigmaResourceLookup.url(named: name)
    XCTAssertNotNil(url, "Missing PNG for \(name). Diagnostics: \(FigmaResourceLookup.diagnostics(named: name))")
    XCTAssertEqual(url?.lastPathComponent, "\(name).png")
  }

  // MARK: - Metrics Invariants

  func testHeroHeightMatchesFigmaFrame() {
    XCTAssertEqual(OnLiveScreenMetrics.heroHeight, 218)
  }

  func testAvatarBadgeSlotIsAvatarPlusBadgeOverhang() {
    let overhang = OnLiveScreenMetrics.avatarBadgeSlotHeight - OnLiveScreenMetrics.avatarLength
    XCTAssertEqual(overhang, 8, "Badge slot must overhang avatar bottom by exactly 8pt per Figma frame 402:7059")
  }

  func testChipRowHeightMatchesSectionHeader() {
    XCTAssertEqual(
      OnLiveScreenMetrics.chipRowHeight,
      OnLiveScreenMetrics.sectionHeaderHeight,
      "Header pattern reuses 48pt row across community slot"
    )
  }

  func testChipHeightFitsInsideRow() {
    XCTAssertLessThan(OnLiveScreenMetrics.chipHeight, OnLiveScreenMetrics.chipRowHeight)
  }

  // MARK: - Content Fixture

  func testPreviewFixtureMatchesFigmaCopy() {
    let c = OnLiveContent.preview
    XCTAssertEqual(c.navTitle, "Title")
    XCTAssertEqual(c.sectionTitle, "ON LIVE")
    XCTAssertEqual(c.tabs, ["Label", "Label"])
    XCTAssertEqual(c.liveTitle, "Our first Weverse LIVE!")
    XCTAssertEqual(c.artistName, "ENHYPEN")
    XCTAssertEqual(c.ctaLabel, "{ENHYPEN}의 공지사항을 확인해 보세요")
    XCTAssertEqual(c.heroImageNames, ["onlive-hero-1", "onlive-hero-2", "onlive-hero-3", "onlive-hero-4", "onlive-hero-5"])
    XCTAssertEqual(c.avatarImageName, "onlive-avatar-en")
  }

  func testPageCountTracksHeroImageNames() {
    let c = OnLiveContent.preview
    XCTAssertEqual(c.heroImageNames.count, 5, "Figma frame 402:7059 pagination shows 5 dots")
  }

  @MainActor
  func testOnLiveScreenStoresContentForPreviewRendering() {
    let content = OnLiveContent.preview
    let screen = OnLiveScreen(content: content)
    XCTAssertEqual(screen.content, content)
  }
}
