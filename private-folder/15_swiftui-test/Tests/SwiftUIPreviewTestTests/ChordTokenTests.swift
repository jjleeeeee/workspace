import XCTest
@testable import SwiftUIPreviewTest

final class ChordTokenTests: XCTestCase {
  func testGeneratedTokensExposeValuesUsedByFigmaFrame() {
    XCTAssertEqual(ChordToken.Color.textDefault.lightHex, "#000000")
    XCTAssertEqual(ChordToken.Color.textGray500.lightHex, "#8E8E8E")
    XCTAssertEqual(ChordToken.Color.textPrimary.lightHex, "#00B8C1")
    XCTAssertEqual(ChordToken.Color.surfaceDefault3.lightHex, "#FFFFFF")

    XCTAssertEqual(ChordToken.Padding.box50, 4)
    XCTAssertEqual(ChordToken.Padding.box150, 12)
    XCTAssertEqual(ChordToken.Padding.box200, 16)
    XCTAssertEqual(ChordToken.Margin.screen125, 10)
    XCTAssertEqual(ChordToken.Radius.box200, 16)

    XCTAssertEqual(ChordToken.Typography.headlineSSystem800.fontSize, 19)
    XCTAssertEqual(ChordToken.Typography.bodyMSystem700.fontSize, 16)
    XCTAssertEqual(ChordToken.Typography.bodySSystem400.fontSize, 15)
    XCTAssertEqual(ChordToken.Typography.bodySSystem700.weight, 700)
    XCTAssertEqual(ChordToken.Typography.captionMSystem400.lineHeight, 17)
  }
}
