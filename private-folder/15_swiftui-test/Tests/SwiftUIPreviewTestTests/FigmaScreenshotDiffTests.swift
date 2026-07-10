import XCTest
@testable import SwiftUIPreviewTest

final class FigmaScreenshotDiffTests: XCTestCase {
  func testScoreAtOrAboveThresholdPasses() {
    let figma = image(width: 8, height: 8, pixel: .init(red: 240, green: 240, blue: 240))
    let swiftUI = image(width: 8, height: 8, pixel: .init(red: 240, green: 240, blue: 240))

    let result = FigmaScreenshotDiffer.compare(
      figma: figma,
      swiftUI: swiftUI,
      config: .init(screenName: "fixture")
    ).result

    XCTAssertEqual(result.score, 100)
    XCTAssertTrue(result.passed)
    XCTAssertEqual(result.nextAction, .pass)
  }

  func testScoreBelowThresholdRequestsIterationBeforeMaxLoop() {
    let figma = image(width: 8, height: 8, pixel: .init(red: 255, green: 255, blue: 255))
    let swiftUI = image(width: 8, height: 8, pixel: .init(red: 0, green: 0, blue: 0))

    let result = FigmaScreenshotDiffer.compare(
      figma: figma,
      swiftUI: swiftUI,
      config: .init(screenName: "fixture", loopIndex: 4, maxLoops: 5)
    ).result

    XCTAssertLessThan(result.score, 95)
    XCTAssertFalse(result.passed)
    XCTAssertEqual(result.nextAction, .iterate)
    XCTAssertFalse(result.colorMismatch.isEmpty)
  }

  func testScoreBelowThresholdFailsAtFifthLoop() {
    let figma = image(width: 8, height: 8, pixel: .init(red: 255, green: 255, blue: 255))
    let swiftUI = image(width: 8, height: 8, pixel: .init(red: 0, green: 0, blue: 0))

    let result = FigmaScreenshotDiffer.compare(
      figma: figma,
      swiftUI: swiftUI,
      config: .init(screenName: "fixture", loopIndex: 5, maxLoops: 5)
    ).result

    XCTAssertLessThan(result.score, 95)
    XCTAssertEqual(result.nextAction, .fail)
  }

  func testSemanticTokenOverrideExcludesMatchingTokenRegionFromPenalty() {
    let figma = image(width: 4, height: 4, pixel: .init(red: 255, green: 255, blue: 255))
    let swiftUI = image(width: 4, height: 4, pixel: .init(red: 0, green: 0, blue: 0))
    let semanticRegion = FigmaSemanticPassRegion(
      rect: .init(x: 0, y: 0, width: 4, height: 4),
      figmaTokenName: "surface/default/4",
      swiftReference: "ChordToken.Color.surfaceDefault4.swiftUIColor",
      figmaResolvedValue: "#FFFFFF",
      swiftResolvedValue: "#FFFFFF",
      reason: "Token names and resolved values match; pixel delta is antialiasing/platform rendering."
    )

    let result = FigmaScreenshotDiffer.compare(
      figma: figma,
      swiftUI: swiftUI,
      config: .init(screenName: "fixture", semanticPassRegions: [semanticRegion])
    ).result

    XCTAssertEqual(result.score, 100)
    XCTAssertTrue(result.passed)
    XCTAssertEqual(result.semanticPassPixels, 16)
    XCTAssertFalse(result.tokenOverrideApplied.isEmpty)
  }

  func testRawLiteralEqualityDoesNotApplySemanticOverride() {
    let figma = image(width: 4, height: 4, pixel: .init(red: 255, green: 255, blue: 255))
    let swiftUI = image(width: 4, height: 4, pixel: .init(red: 0, green: 0, blue: 0))
    let rawLiteralRegion = FigmaSemanticPassRegion(
      rect: .init(x: 0, y: 0, width: 4, height: 4),
      figmaTokenName: "Radius/box300",
      swiftReference: "12",
      figmaResolvedValue: "12",
      swiftResolvedValue: "12",
      reason: "Raw literal is not a token-backed Swift reference."
    )

    let result = FigmaScreenshotDiffer.compare(
      figma: figma,
      swiftUI: swiftUI,
      config: .init(screenName: "fixture", semanticPassRegions: [rawLiteralRegion])
    ).result

    XCTAssertLessThan(result.score, 95)
    XCTAssertEqual(result.semanticPassPixels, 0)
    XCTAssertTrue(result.tokenOverrideApplied.isEmpty)
  }

  func testDynamicMaskExcludesRegionFromPenalty() {
    let figma = image(width: 4, height: 4, pixel: .init(red: 255, green: 255, blue: 255))
    let swiftUI = image(width: 4, height: 4, pixel: .init(red: 0, green: 0, blue: 0))
    let mask = FigmaDiffMaskRegion(
      rect: .init(x: 0, y: 0, width: 4, height: 4),
      reason: "status bar time"
    )

    let result = FigmaScreenshotDiffer.compare(
      figma: figma,
      swiftUI: swiftUI,
      config: .init(screenName: "fixture", maskedRegions: [mask])
    ).result

    XCTAssertEqual(result.score, 100)
    XCTAssertTrue(result.passed)
    XCTAssertEqual(result.maskedPixels, 16)
    XCTAssertFalse(result.dynamicMasked.isEmpty)
  }

  func testCriticalRegionFailureOverridesPassingGlobalScore() {
    var swiftUIPixels = Array(
      repeating: FigmaDiffPixel(red: 255, green: 255, blue: 255),
      count: 100
    )
    swiftUIPixels[(9 * 10) + 9] = FigmaDiffPixel(red: 0, green: 0, blue: 0)
    let figma = image(width: 10, height: 10, pixel: .init(red: 255, green: 255, blue: 255))
    let swiftUI = FigmaDiffImage(width: 10, height: 10, pixels: swiftUIPixels)
    let criticalRegion = FigmaCriticalRegion(
      rect: .init(x: 9, y: 9, width: 1, height: 1),
      minimumScore: 95,
      reason: "CTA anchor must match the Figma screenshot."
    )

    let result = FigmaScreenshotDiffer.compare(
      figma: figma,
      swiftUI: swiftUI,
      config: .init(screenName: "fixture", criticalRegions: [criticalRegion])
    ).result

    XCTAssertGreaterThanOrEqual(result.score, 95)
    XCTAssertFalse(result.passed)
    XCTAssertEqual(result.nextAction, .iterate)
    XCTAssertFalse(result.criticalRegionMismatch.isEmpty)
  }

  func testCriticalRegionAllowsSmallForegroundPositionDelta() {
    var figmaPixels = Array(
      repeating: FigmaDiffPixel(red: 255, green: 255, blue: 255),
      count: 100
    )
    var swiftUIPixels = figmaPixels
    figmaPixels[(5 * 10) + 5] = FigmaDiffPixel(red: 0, green: 180, blue: 180)
    swiftUIPixels[(5 * 10) + 7] = FigmaDiffPixel(red: 0, green: 180, blue: 180)
    let criticalRegion = FigmaCriticalRegion(
      rect: .init(x: 4, y: 4, width: 5, height: 3),
      minimumScore: 95,
      maxPositionDelta: 2,
      reason: "Small platform antialiasing/position deltas are acceptable."
    )

    let result = FigmaScreenshotDiffer.compare(
      figma: FigmaDiffImage(width: 10, height: 10, pixels: figmaPixels),
      swiftUI: FigmaDiffImage(width: 10, height: 10, pixels: swiftUIPixels),
      config: .init(screenName: "fixture", criticalRegions: [criticalRegion])
    ).result

    XCTAssertGreaterThanOrEqual(result.score, 95)
    XCTAssertTrue(result.passed)
    XCTAssertTrue(result.criticalRegionMismatch.isEmpty)
  }

  func testColorTokenRegionAllowsPixelDeltaInScreenshotDiff() {
    var swiftUIPixels = Array(
      repeating: FigmaDiffPixel(red: 255, green: 255, blue: 255),
      count: 100
    )
    swiftUIPixels[(9 * 10) + 9] = FigmaDiffPixel(red: 255, green: 0, blue: 0)
    let colorRegion = FigmaColorRegion(
      name: "brand accent",
      rect: .init(x: 9, y: 9, width: 1, height: 1),
      maxAverageDistance: 0.01,
      figmaTokenName: "text/primary",
      swiftReference: "ChordToken.Color.textPrimary.swiftUIColor",
      figmaResolvedValue: "#00B7C7",
      swiftResolvedValue: "#00B7C7",
      reason: "Brand accent color must match."
    )

    let result = FigmaScreenshotDiffer.compare(
      figma: image(width: 10, height: 10, pixel: .init(red: 255, green: 255, blue: 255)),
      swiftUI: FigmaDiffImage(width: 10, height: 10, pixels: swiftUIPixels),
      config: .init(screenName: "fixture", colorRegions: [colorRegion])
    ).result

    XCTAssertEqual(result.score, 100)
    XCTAssertTrue(result.passed)
    XCTAssertEqual(result.nextAction, .pass)
    XCTAssertTrue(result.colorRegionMismatch.isEmpty)
    XCTAssertFalse(result.tokenOverrideApplied.isEmpty)
  }

  func testColorRegionPassesWhenSampleAndTokensMatch() {
    let colorRegion = FigmaColorRegion(
      name: "surface",
      rect: .init(x: 0, y: 0, width: 4, height: 4),
      maxAverageDistance: 0.01,
      figmaTokenName: "surface/default/3",
      swiftReference: "ChordToken.Color.surfaceDefault3.swiftUIColor",
      figmaResolvedValue: "#FFFFFF",
      swiftResolvedValue: "#FFFFFF",
      reason: "Surface token and sampled color match."
    )

    let result = FigmaScreenshotDiffer.compare(
      figma: image(width: 4, height: 4, pixel: .init(red: 255, green: 255, blue: 255)),
      swiftUI: image(width: 4, height: 4, pixel: .init(red: 255, green: 255, blue: 255)),
      config: .init(screenName: "fixture", colorRegions: [colorRegion])
    ).result

    XCTAssertEqual(result.score, 100)
    XCTAssertTrue(result.passed)
    XCTAssertTrue(result.colorRegionMismatch.isEmpty)
  }

  func testRawColorReferenceDoesNotPassColorRegion() {
    let colorRegion = FigmaColorRegion(
      name: "surface",
      rect: .init(x: 0, y: 0, width: 4, height: 4),
      maxAverageDistance: 0.01,
      figmaTokenName: "surface/default/3",
      swiftReference: "Color.white",
      figmaResolvedValue: "#FFFFFF",
      swiftResolvedValue: "#FFFFFF",
      reason: "Raw SwiftUI color references are not token-backed."
    )

    let result = FigmaScreenshotDiffer.compare(
      figma: image(width: 4, height: 4, pixel: .init(red: 255, green: 255, blue: 255)),
      swiftUI: image(width: 4, height: 4, pixel: .init(red: 255, green: 255, blue: 255)),
      config: .init(screenName: "fixture", colorRegions: [colorRegion])
    ).result

    XCTAssertEqual(result.score, 100)
    XCTAssertFalse(result.passed)
    XCTAssertFalse(result.colorRegionMismatch.isEmpty)
  }

  func testColorTokenValidatorFailsWhenManifestHasNoColorRegions() {
    let result = FigmaColorTokenValidator.validate(
      screenName: "fixture",
      colorRegions: []
    )

    XCTAssertFalse(result.passed)
    XCTAssertEqual(result.checkedRegionCount, 0)
    XCTAssertFalse(result.missingColorRegions.isEmpty)
  }

  func testColorTokenValidatorFailsRawColorReferenceBeforeScreenshotDiff() {
    let colorRegion = FigmaColorRegion(
      name: "surface",
      rect: .init(x: 0, y: 0, width: 4, height: 4),
      maxAverageDistance: 0.01,
      figmaTokenName: "surface/default/3",
      swiftReference: "Color.white",
      figmaResolvedValue: "#FFFFFF",
      swiftResolvedValue: "#FFFFFF",
      reason: "Raw SwiftUI color references are not token-backed."
    )

    let result = FigmaColorTokenValidator.validate(
      screenName: "fixture",
      colorRegions: [colorRegion]
    )

    XCTAssertFalse(result.passed)
    XCTAssertTrue(result.missingColorRegions.isEmpty)
    XCTAssertFalse(result.tokenMismatch.isEmpty)
  }

  func testColorTokenValidatorPassesTokenBackedRegionsBeforeScreenshotDiff() {
    let colorRegion = FigmaColorRegion(
      name: "surface",
      rect: .init(x: 0, y: 0, width: 4, height: 4),
      maxAverageDistance: 0.01,
      figmaTokenName: "surface/default/3",
      swiftReference: "ChordToken.Color.surfaceDefault3.swiftUIColor",
      figmaResolvedValue: "#FFFFFF",
      swiftResolvedValue: "#FFFFFF",
      reason: "Surface token and sampled color match."
    )

    let result = FigmaColorTokenValidator.validate(
      screenName: "fixture",
      colorRegions: [colorRegion]
    )

    XCTAssertTrue(result.passed)
    XCTAssertEqual(result.checkedRegionCount, 1)
    XCTAssertTrue(result.tokenMismatch.isEmpty)
    XCTAssertFalse(result.tokenOverrideApplied.isEmpty)
  }

  func testFigmaLocalColorReferenceCanPassColorRegion() {
    let colorRegion = FigmaColorRegion(
      name: "avatar",
      rect: .init(x: 0, y: 0, width: 4, height: 4),
      maxAverageDistance: 0.01,
      figmaTokenName: "FigmaLocal/avatar-pink",
      swiftReference: "FigmaLocalColor.avatarPink.swiftUIColor",
      figmaResolvedValue: "#FF1E91",
      swiftResolvedValue: "#FF1E91",
      reason: "Named Figma-local color wrappers are traceable."
    )

    let result = FigmaScreenshotDiffer.compare(
      figma: image(width: 4, height: 4, pixel: .init(red: 255, green: 30, blue: 145)),
      swiftUI: image(width: 4, height: 4, pixel: .init(red: 255, green: 30, blue: 145)),
      config: .init(screenName: "fixture", colorRegions: [colorRegion])
    ).result

    XCTAssertEqual(result.score, 100)
    XCTAssertTrue(result.passed)
    XCTAssertTrue(result.colorRegionMismatch.isEmpty)
  }

  func testNormalizerCropsScalesAndPlacesSimulatorScreenshotOnFigmaCanvas() {
    let figma = image(width: 5, height: 5, pixel: .init(red: 255, green: 255, blue: 255))
    let simulator = simulatorImage(
      width: 6,
      height: 6,
      cropTop: 2,
      contentPixel: .init(red: 20, green: 80, blue: 180)
    )

    let result = FigmaScreenshotNormalizer.normalize(
      simulatorFull: simulator,
      matching: figma,
      config: .init(
        sourceScale: 2,
        sourceCropTop: 2,
        canvasPlaceX: 1,
        canvasPlaceY: 1
      )
    )

    XCTAssertEqual(result.image.width, 5)
    XCTAssertEqual(result.image.height, 5)
    XCTAssertEqual(result.report.swiftUIPlacedViewport, .init(x: 1, y: 1, width: 3, height: 2))
    XCTAssertEqual(result.report.swiftUIContentBounds, .init(x: 1, y: 1, width: 3, height: 2))
    XCTAssertEqual(result.image[1, 1], .init(red: 20, green: 80, blue: 180))
    XCTAssertEqual(result.image[0, 0], .init(red: 255, green: 255, blue: 255))
  }
}

private func image(width: Int, height: Int, pixel: FigmaDiffPixel) -> FigmaDiffImage {
  FigmaDiffImage(width: width, height: height, pixels: Array(repeating: pixel, count: width * height))
}

private func simulatorImage(
  width: Int,
  height: Int,
  cropTop: Int,
  contentPixel: FigmaDiffPixel
) -> FigmaDiffImage {
  var pixels = Array(
    repeating: FigmaDiffPixel(red: 255, green: 255, blue: 255),
    count: width * height
  )

  for y in cropTop..<height {
    for x in 0..<width {
      pixels[(y * width) + x] = contentPixel
    }
  }

  return FigmaDiffImage(width: width, height: height, pixels: pixels)
}
