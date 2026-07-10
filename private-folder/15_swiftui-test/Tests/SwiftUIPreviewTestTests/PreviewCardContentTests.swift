import XCTest
@testable import SwiftUIPreviewTest

final class PreviewCardContentTests: XCTestCase {
  func testReadyFixtureDescribesPrimaryPreviewState() {
    let content = PreviewCardContent.ready

    XCTAssertEqual(content.title, "SwiftUI Preview")
    XCTAssertEqual(content.subtitle, "Package setup ready")
    XCTAssertEqual(content.status, .ready)
    XCTAssertEqual(content.accessibilitySummary, "SwiftUI Preview, Package setup ready, Ready")
  }

  func testEmptyFixtureDescribesSecondaryPreviewState() {
    let content = PreviewCardContent.empty

    XCTAssertEqual(content.title, "Empty State")
    XCTAssertEqual(content.subtitle, "Preview without sample data")
    XCTAssertEqual(content.status, .empty)
    XCTAssertEqual(content.accessibilitySummary, "Empty State, Preview without sample data, Empty")
  }

  @MainActor
  func testPreviewCardStoresContentForPreviewRendering() {
    let card = PreviewCard(content: .empty)

    XCTAssertEqual(card.content, .empty)
  }
}
