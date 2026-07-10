import XCTest
@testable import SwiftUIPreviewTest

final class FigmaLiveNewsCardContentTests: XCTestCase {
  func testFigmaFixtureMatchesSelectedFrameCopy() {
    let content = FigmaLiveNewsCardContent.testSwiftUI

    XCTAssertEqual(content.sectionTitle, "놓치지 말아야 할 소식")
    XCTAssertEqual(content.artistName, "TOMORROW X TOGETHER")
    XCTAssertEqual(content.subtitle, "추천포스트")
    XCTAssertEqual(content.moreLabel, "More")
    XCTAssertEqual(content.callToAction, "MOA 멤버십 선예매 사전인증하기")
    XCTAssertEqual(content.heroImageName, "figma-test-swiftui-hero")
  }

  func testAccessibilitySummaryUsesPrimaryContent() {
    let content = FigmaLiveNewsCardContent.testSwiftUI

    XCTAssertEqual(
      content.accessibilitySummary,
      "놓치지 말아야 할 소식, TOMORROW X TOGETHER, 추천포스트, MOA 멤버십 선예매 사전인증하기"
    )
  }

  @MainActor
  func testFigmaLiveNewsCardStoresContentForPreviewRendering() {
    let content = FigmaLiveNewsCardContent.testSwiftUI
    let card = FigmaLiveNewsCard(content: content)

    XCTAssertEqual(card.content, content)
  }
}
