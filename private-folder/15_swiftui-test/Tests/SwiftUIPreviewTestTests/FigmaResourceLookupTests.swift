import XCTest
@testable import SwiftUIPreviewTest

final class FigmaResourceLookupTests: XCTestCase {
  func testHeroResourceIsAvailableFromSwiftPackageBundle() {
    let url = FigmaResourceLookup.url(named: "figma-test-swiftui-hero")

    XCTAssertNotNil(url)
    XCTAssertEqual(url?.lastPathComponent, "figma-test-swiftui-hero.png")
  }

  func testLiveNewsCardHeroUsesFigmaSlotWidthMinusCardInsets() {
    XCTAssertEqual(FigmaLiveNewsCardMetrics.slotWidth, 393)
    XCTAssertEqual(FigmaLiveNewsCardMetrics.cardHorizontalInset, 10)
    XCTAssertEqual(FigmaLiveNewsCardMetrics.heroLength, 373)
    XCTAssertEqual(
      FigmaLiveNewsCardMetrics.slotWidth - (FigmaLiveNewsCardMetrics.cardHorizontalInset * 2),
      FigmaLiveNewsCardMetrics.heroLength
    )
  }
}
