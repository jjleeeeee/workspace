import XCTest
@testable import SwiftUIPreviewTest

#if canImport(AppKit)
import AppKit
#endif

final class FigmaAssetQualityTests: XCTestCase {
  func testLiveNewsCardHeroImageIsContentAsset() throws {
    try assertContentAssets(["figma-test-swiftui-hero"])
  }

  func testOnLiveHeroImagesAreContentAssetsNotPlaceholderExports() throws {
    try assertContentAssets(OnLiveContent.preview.heroImageNames)
  }

  private func assertContentAssets(_ names: [String]) throws {
    #if canImport(AppKit)
    for name in names {
      let metrics = try FigmaAssetVisualMetrics.metrics(named: name)

      XCTAssertGreaterThanOrEqual(
        metrics.luminanceStandardDeviation,
        12,
        "\(name) looks too flat for a live hero image. Metrics: \(metrics)"
      )
      XCTAssertGreaterThanOrEqual(
        metrics.horizontalEdgeMean,
        2,
        "\(name) has too little image detail and may be a placeholder/blur export. Metrics: \(metrics)"
      )
      XCTAssertGreaterThanOrEqual(
        metrics.quantizedColorCount,
        64,
        "\(name) has too few colors for a content hero image. Metrics: \(metrics)"
      )
    }
    #else
    throw XCTSkip("Asset quality metrics require AppKit image decoding on macOS.")
    #endif
  }
}

#if canImport(AppKit)
private struct FigmaAssetVisualMetrics: CustomStringConvertible {
  let luminanceStandardDeviation: Double
  let horizontalEdgeMean: Double
  let quantizedColorCount: Int

  var description: String {
    "luminanceStdDev=\(rounded(luminanceStandardDeviation)), horizontalEdgeMean=\(rounded(horizontalEdgeMean)), quantizedColorCount=\(quantizedColorCount)"
  }

  static func metrics(named name: String) throws -> Self {
    let url = try XCTUnwrap(
      FigmaResourceLookup.url(named: name),
      "Missing PNG for \(name). Diagnostics: \(FigmaResourceLookup.diagnostics(named: name))"
    )
    let image = try XCTUnwrap(NSImage(contentsOf: url), "Could not decode \(url.path)")
    let tiffData = try XCTUnwrap(image.tiffRepresentation, "Could not create TIFF data for \(url.path)")
    let bitmap = try XCTUnwrap(NSBitmapImageRep(data: tiffData), "Could not create bitmap for \(url.path)")

    let sampleStep = max(1, min(bitmap.pixelsWide, bitmap.pixelsHigh) / 128)
    var sampleCount = 0.0
    var luminanceSum = 0.0
    var luminanceSquareSum = 0.0
    var horizontalEdgeSum = 0.0
    var horizontalEdgeCount = 0.0
    var quantizedColors = Set<Int>()

    for y in stride(from: 0, to: bitmap.pixelsHigh, by: sampleStep) {
      var previousLuminance: Double?

      for x in stride(from: 0, to: bitmap.pixelsWide, by: sampleStep) {
        guard let color = bitmap.colorAt(x: x, y: y)?.usingColorSpace(.sRGB) else {
          continue
        }

        let red = Double(color.redComponent)
        let green = Double(color.greenComponent)
        let blue = Double(color.blueComponent)
        let luminance = (0.2126 * red) + (0.7152 * green) + (0.0722 * blue)

        sampleCount += 1
        luminanceSum += luminance
        luminanceSquareSum += luminance * luminance
        quantizedColors.insert(Self.quantizedKey(red: red, green: green, blue: blue))

        if let previousLuminance {
          horizontalEdgeSum += abs(luminance - previousLuminance)
          horizontalEdgeCount += 1
        }
        previousLuminance = luminance
      }
    }

    XCTAssertGreaterThan(sampleCount, 0, "No pixels sampled for \(name)")

    let mean = luminanceSum / sampleCount
    let variance = max(0, (luminanceSquareSum / sampleCount) - (mean * mean))
    let edgeMean = horizontalEdgeCount == 0 ? 0 : horizontalEdgeSum / horizontalEdgeCount

    return Self(
      luminanceStandardDeviation: sqrt(variance) * 255,
      horizontalEdgeMean: edgeMean * 255,
      quantizedColorCount: quantizedColors.count
    )
  }

  private static func quantizedKey(red: Double, green: Double, blue: Double) -> Int {
    let redBucket = min(31, max(0, Int(red * 31)))
    let greenBucket = min(31, max(0, Int(green * 31)))
    let blueBucket = min(31, max(0, Int(blue * 31)))
    return (redBucket << 10) | (greenBucket << 5) | blueBucket
  }

  private func rounded(_ value: Double) -> String {
    String(format: "%.2f", value)
  }
}
#endif
