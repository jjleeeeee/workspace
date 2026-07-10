import Foundation

#if canImport(AppKit)
import AppKit
#endif

public struct FigmaDiffPixel: Equatable, Sendable {
  public let red: UInt8
  public let green: UInt8
  public let blue: UInt8
  public let alpha: UInt8

  public init(red: UInt8, green: UInt8, blue: UInt8, alpha: UInt8 = 255) {
    self.red = red
    self.green = green
    self.blue = blue
    self.alpha = alpha
  }

  static let white = FigmaDiffPixel(red: 255, green: 255, blue: 255)
  static let redHeat = FigmaDiffPixel(red: 255, green: 42, blue: 42)
  static let greenPass = FigmaDiffPixel(red: 45, green: 184, blue: 92)
  static let blueMask = FigmaDiffPixel(red: 68, green: 119, blue: 255)
}

public struct FigmaDiffImage: Equatable, Sendable {
  public let width: Int
  public let height: Int
  public let pixels: [FigmaDiffPixel]

  public init(width: Int, height: Int, pixels: [FigmaDiffPixel]) {
    precondition(width > 0, "width must be positive")
    precondition(height > 0, "height must be positive")
    precondition(pixels.count == width * height, "pixel count must equal width * height")
    self.width = width
    self.height = height
    self.pixels = pixels
  }

  public subscript(x: Int, y: Int) -> FigmaDiffPixel {
    pixels[(y * width) + x]
  }

  public func resized(toWidth targetWidth: Int, height targetHeight: Int) -> FigmaDiffImage {
    guard targetWidth != width || targetHeight != height else { return self }

    var resizedPixels: [FigmaDiffPixel] = []
    resizedPixels.reserveCapacity(targetWidth * targetHeight)

    for y in 0..<targetHeight {
      let sourceY = min(height - 1, (y * height) / targetHeight)
      for x in 0..<targetWidth {
        let sourceX = min(width - 1, (x * width) / targetWidth)
        resizedPixels.append(self[sourceX, sourceY])
      }
    }

    return FigmaDiffImage(width: targetWidth, height: targetHeight, pixels: resizedPixels)
  }

  public var luminanceStandardDeviation: Double {
    var sampleCount = 0.0
    var sum = 0.0
    var squareSum = 0.0

    for pixel in pixels {
      let luminance = pixel.luminance
      sampleCount += 1
      sum += luminance
      squareSum += luminance * luminance
    }

    let mean = sum / sampleCount
    let variance = max(0, (squareSum / sampleCount) - (mean * mean))
    return sqrt(variance) * 255
  }
}

public struct FigmaDiffRect: Codable, Equatable, Sendable {
  public let x: Int
  public let y: Int
  public let width: Int
  public let height: Int

  public init(x: Int, y: Int, width: Int, height: Int) {
    self.x = x
    self.y = y
    self.width = width
    self.height = height
  }

  func contains(x pointX: Int, y pointY: Int) -> Bool {
    pointX >= x && pointX < x + width && pointY >= y && pointY < y + height
  }
}

public struct FigmaDiffMaskRegion: Codable, Equatable, Sendable {
  public let rect: FigmaDiffRect
  public let reason: String

  public init(rect: FigmaDiffRect, reason: String) {
    self.rect = rect
    self.reason = reason
  }
}

public struct FigmaSemanticPassRegion: Codable, Equatable, Sendable {
  public let rect: FigmaDiffRect
  public let figmaTokenName: String
  public let swiftReference: String
  public let figmaResolvedValue: String
  public let swiftResolvedValue: String
  public let reason: String

  public init(
    rect: FigmaDiffRect,
    figmaTokenName: String,
    swiftReference: String,
    figmaResolvedValue: String,
    swiftResolvedValue: String,
    reason: String
  ) {
    self.rect = rect
    self.figmaTokenName = figmaTokenName
    self.swiftReference = swiftReference
    self.figmaResolvedValue = figmaResolvedValue
    self.swiftResolvedValue = swiftResolvedValue
    self.reason = reason
  }

  var isEffectiveOverride: Bool {
    !figmaTokenName.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
      && isSwiftTokenBacked
      && figmaResolvedValue.trimmingCharacters(in: .whitespacesAndNewlines)
        == swiftResolvedValue.trimmingCharacters(in: .whitespacesAndNewlines)
  }

  private var isSwiftTokenBacked: Bool {
    swiftReference.contains("ChordToken.")
      || swiftReference.contains("Metrics.")
      || swiftReference.contains("Token.")
  }
}

public struct FigmaCriticalRegion: Codable, Equatable, Sendable {
  public let rect: FigmaDiffRect
  public let minimumScore: Double
  public let maxPositionDelta: Int?
  public let reason: String

  public init(
    rect: FigmaDiffRect,
    minimumScore: Double = 95,
    maxPositionDelta: Int? = nil,
    reason: String
  ) {
    self.rect = rect
    self.minimumScore = minimumScore
    self.maxPositionDelta = maxPositionDelta
    self.reason = reason
  }
}

public enum FigmaColorSampleMode: String, Codable, Equatable, Sendable {
  case all
  case foreground
  case dominantForeground = "dominant_foreground"
}

public struct FigmaColorRegion: Codable, Equatable, Sendable {
  public let name: String
  public let rect: FigmaDiffRect
  public let sampleMode: FigmaColorSampleMode
  public let maxAverageDistance: Double
  public let figmaTokenName: String
  public let swiftReference: String
  public let figmaResolvedValue: String
  public let swiftResolvedValue: String
  public let reason: String

  public init(
    name: String,
    rect: FigmaDiffRect,
    sampleMode: FigmaColorSampleMode = .all,
    maxAverageDistance: Double = 0.04,
    figmaTokenName: String,
    swiftReference: String,
    figmaResolvedValue: String,
    swiftResolvedValue: String,
    reason: String
  ) {
    self.name = name
    self.rect = rect
    self.sampleMode = sampleMode
    self.maxAverageDistance = maxAverageDistance
    self.figmaTokenName = figmaTokenName
    self.swiftReference = swiftReference
    self.figmaResolvedValue = figmaResolvedValue
    self.swiftResolvedValue = swiftResolvedValue
    self.reason = reason
  }

  var isTokenBacked: Bool {
    !figmaTokenName.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
      && (
        swiftReference.contains("ChordToken.Color.")
          || swiftReference.contains("FigmaLocalColor.")
          || swiftReference.contains("Token.")
      )
      && figmaResolvedValue.trimmingCharacters(in: .whitespacesAndNewlines)
        == swiftResolvedValue.trimmingCharacters(in: .whitespacesAndNewlines)
  }
}

public struct FigmaColorTokenCheckResult: Codable, Equatable, Sendable {
  public let screenName: String
  public let passed: Bool
  public let checkedRegionCount: Int
  public let missingColorRegions: [FigmaDiffFinding]
  public let tokenMismatch: [FigmaDiffFinding]
  public let tokenOverrideApplied: [FigmaDiffFinding]

  enum CodingKeys: String, CodingKey {
    case screenName = "screen_name"
    case passed
    case checkedRegionCount = "checked_region_count"
    case missingColorRegions = "missing_color_regions"
    case tokenMismatch = "token_mismatch"
    case tokenOverrideApplied = "token_override_applied"
  }
}

public enum FigmaColorTokenValidator {
  public static func validate(
    screenName: String,
    colorRegions: [FigmaColorRegion]
  ) -> FigmaColorTokenCheckResult {
    let missingColorRegions: [FigmaDiffFinding]
    if colorRegions.isEmpty {
      missingColorRegions = [
        FigmaDiffFinding(
          message: "No color_regions defined. Add canonical surface, text, accent, badge, and CTA colors before screenshot diff."
        )
      ]
    } else {
      missingColorRegions = []
    }

    let tokenMismatch = colorRegions.compactMap { region -> FigmaDiffFinding? in
      guard !region.isTokenBacked else { return nil }

      return FigmaDiffFinding(
        message: "Color token region '\(region.name)' failed: figma_token='\(region.figmaTokenName)', swift_reference='\(region.swiftReference)', figma_resolved='\(region.figmaResolvedValue)', swift_resolved='\(region.swiftResolvedValue)'. Use ChordToken.Color.*, FigmaLocalColor.*, or another explicit color-token wrapper with the same resolved value.",
        rect: region.rect
      )
    }

    let tokenOverrideApplied = colorRegions
      .filter(\.isTokenBacked)
      .map {
        FigmaDiffFinding(
          message: "Color token matched: \($0.figmaTokenName) == \($0.swiftReference) resolved to \($0.figmaResolvedValue). Screenshot color pixel delta in this region may be treated as semantic pass. \($0.reason)",
          rect: $0.rect
        )
      }

    return FigmaColorTokenCheckResult(
      screenName: screenName,
      passed: missingColorRegions.isEmpty && tokenMismatch.isEmpty,
      checkedRegionCount: colorRegions.count,
      missingColorRegions: missingColorRegions,
      tokenMismatch: tokenMismatch,
      tokenOverrideApplied: tokenOverrideApplied
    )
  }
}

public struct FigmaScreenshotDiffManifest: Codable, Equatable, Sendable {
  public let maskedRegions: [FigmaDiffMaskRegion]
  public let semanticPassRegions: [FigmaSemanticPassRegion]
  public let criticalRegions: [FigmaCriticalRegion]
  public let colorRegions: [FigmaColorRegion]
  public let normalization: FigmaScreenshotNormalizationConfig?

  public init(
    maskedRegions: [FigmaDiffMaskRegion] = [],
    semanticPassRegions: [FigmaSemanticPassRegion] = [],
    criticalRegions: [FigmaCriticalRegion] = [],
    colorRegions: [FigmaColorRegion] = [],
    normalization: FigmaScreenshotNormalizationConfig? = nil
  ) {
    self.maskedRegions = maskedRegions
    self.semanticPassRegions = semanticPassRegions
    self.criticalRegions = criticalRegions
    self.colorRegions = colorRegions
    self.normalization = normalization
  }
}

public struct FigmaScreenshotNormalizationConfig: Codable, Equatable, Sendable {
  public let sourceScale: Double
  public let sourceCropTop: Int
  public let sourceCropBottom: Int
  public let canvasPlaceX: Int
  public let canvasPlaceY: Int
  public let backgroundHex: String

  public init(
    sourceScale: Double = 3,
    sourceCropTop: Int = 0,
    sourceCropBottom: Int = 0,
    canvasPlaceX: Int = 0,
    canvasPlaceY: Int = 0,
    backgroundHex: String = "#FFFFFF"
  ) {
    self.sourceScale = max(1, sourceScale)
    self.sourceCropTop = max(0, sourceCropTop)
    self.sourceCropBottom = max(0, sourceCropBottom)
    self.canvasPlaceX = canvasPlaceX
    self.canvasPlaceY = canvasPlaceY
    self.backgroundHex = backgroundHex
  }

  enum CodingKeys: String, CodingKey {
    case sourceScale
    case sourceCropTop
    case sourceCropBottom
    case canvasPlaceX
    case canvasPlaceY
    case backgroundHex
  }

  public init(from decoder: Decoder) throws {
    let container = try decoder.container(keyedBy: CodingKeys.self)
    self.init(
      sourceScale: try container.decodeIfPresent(Double.self, forKey: .sourceScale) ?? 3,
      sourceCropTop: try container.decodeIfPresent(Int.self, forKey: .sourceCropTop) ?? 0,
      sourceCropBottom: try container.decodeIfPresent(Int.self, forKey: .sourceCropBottom) ?? 0,
      canvasPlaceX: try container.decodeIfPresent(Int.self, forKey: .canvasPlaceX) ?? 0,
      canvasPlaceY: try container.decodeIfPresent(Int.self, forKey: .canvasPlaceY) ?? 0,
      backgroundHex: try container.decodeIfPresent(String.self, forKey: .backgroundHex) ?? "#FFFFFF"
    )
  }

  public func encode(to encoder: Encoder) throws {
    var container = encoder.container(keyedBy: CodingKeys.self)
    try container.encode(sourceScale, forKey: .sourceScale)
    try container.encode(sourceCropTop, forKey: .sourceCropTop)
    try container.encode(sourceCropBottom, forKey: .sourceCropBottom)
    try container.encode(canvasPlaceX, forKey: .canvasPlaceX)
    try container.encode(canvasPlaceY, forKey: .canvasPlaceY)
    try container.encode(backgroundHex, forKey: .backgroundHex)
  }
}

public struct FigmaScreenshotNormalizationReport: Codable, Equatable, Sendable {
  public let figmaViewport: FigmaDiffRect
  public let swiftUISourceViewport: FigmaDiffRect
  public let swiftUIPlacedViewport: FigmaDiffRect
  public let figmaContentBounds: FigmaDiffRect?
  public let swiftUIContentBounds: FigmaDiffRect?

  enum CodingKeys: String, CodingKey {
    case figmaViewport = "figma_viewport"
    case swiftUISourceViewport = "swiftui_source_viewport"
    case swiftUIPlacedViewport = "swiftui_placed_viewport"
    case figmaContentBounds = "figma_content_bounds"
    case swiftUIContentBounds = "swiftui_content_bounds"
  }
}

public struct FigmaScreenshotNormalizationResult: Equatable, Sendable {
  public let image: FigmaDiffImage
  public let report: FigmaScreenshotNormalizationReport
}

public enum FigmaScreenshotNormalizer {
  public static func normalize(
    simulatorFull source: FigmaDiffImage,
    matching figma: FigmaDiffImage,
    config: FigmaScreenshotNormalizationConfig
  ) -> FigmaScreenshotNormalizationResult {
    let background = FigmaDiffPixel(hex: config.backgroundHex) ?? .white
    var pixels = Array(repeating: background, count: figma.width * figma.height)
    let scale = max(1, config.sourceScale)
    let cropTop = min(max(0, config.sourceCropTop), source.height)
    let cropBottom = min(max(0, config.sourceCropBottom), source.height - cropTop)
    let sourceHeight = max(0, source.height - cropTop - cropBottom)
    let placedWidth = Int((Double(source.width) / scale).rounded(.down))
    let placedHeight = Int((Double(sourceHeight) / scale).rounded(.down))

    for destinationY in 0..<placedHeight {
      let canvasY = config.canvasPlaceY + destinationY
      guard canvasY >= 0 && canvasY < figma.height else { continue }

      for destinationX in 0..<placedWidth {
        let canvasX = config.canvasPlaceX + destinationX
        guard canvasX >= 0 && canvasX < figma.width else { continue }

        let sourceX = min(source.width - 1, Int((Double(destinationX) * scale).rounded(.down)))
        let sourceY = min(
          source.height - 1,
          cropTop + Int((Double(destinationY) * scale).rounded(.down))
        )
        pixels[(canvasY * figma.width) + canvasX] = source[sourceX, sourceY]
      }
    }

    let normalized = FigmaDiffImage(width: figma.width, height: figma.height, pixels: pixels)
    let report = FigmaScreenshotNormalizationReport(
      figmaViewport: FigmaDiffRect(x: 0, y: 0, width: figma.width, height: figma.height),
      swiftUISourceViewport: FigmaDiffRect(
        x: 0,
        y: cropTop,
        width: source.width,
        height: sourceHeight
      ),
      swiftUIPlacedViewport: FigmaDiffRect(
        x: config.canvasPlaceX,
        y: config.canvasPlaceY,
        width: placedWidth,
        height: placedHeight
      ),
      figmaContentBounds: contentBounds(in: figma, background: background),
      swiftUIContentBounds: contentBounds(in: normalized, background: background)
    )

    return FigmaScreenshotNormalizationResult(image: normalized, report: report)
  }

  public static func contentBounds(
    in image: FigmaDiffImage,
    background: FigmaDiffPixel = FigmaDiffPixel(red: 255, green: 255, blue: 255),
    tolerance: Double = 0.015
  ) -> FigmaDiffRect? {
    var minX = image.width
    var minY = image.height
    var maxX = -1
    var maxY = -1

    for y in 0..<image.height {
      for x in 0..<image.width {
        guard image[x, y].distance(to: background) > tolerance else { continue }
        minX = min(minX, x)
        minY = min(minY, y)
        maxX = max(maxX, x)
        maxY = max(maxY, y)
      }
    }

    guard maxX >= minX, maxY >= minY else { return nil }
    return FigmaDiffRect(x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1)
  }
}

public struct FigmaScreenshotDiffConfig: Equatable, Sendable {
  public let screenName: String
  public let passThreshold: Double
  public let loopIndex: Int
  public let maxLoops: Int
  public let antialiasTolerance: Double
  public let maskedRegions: [FigmaDiffMaskRegion]
  public let semanticPassRegions: [FigmaSemanticPassRegion]
  public let criticalRegions: [FigmaCriticalRegion]
  public let colorRegions: [FigmaColorRegion]

  public init(
    screenName: String,
    passThreshold: Double = 95,
    loopIndex: Int = 1,
    maxLoops: Int = 5,
    antialiasTolerance: Double = 4,
    maskedRegions: [FigmaDiffMaskRegion] = [],
    semanticPassRegions: [FigmaSemanticPassRegion] = [],
    criticalRegions: [FigmaCriticalRegion] = [],
    colorRegions: [FigmaColorRegion] = []
  ) {
    self.screenName = screenName
    self.passThreshold = passThreshold
    self.loopIndex = loopIndex
    self.maxLoops = max(1, maxLoops)
    self.antialiasTolerance = antialiasTolerance
    self.maskedRegions = maskedRegions
    self.semanticPassRegions = semanticPassRegions
    self.criticalRegions = criticalRegions
    self.colorRegions = colorRegions
  }
}

public enum FigmaDiffNextAction: String, Codable, Equatable, Sendable {
  case pass
  case iterate
  case fail
}

public struct FigmaDiffFinding: Codable, Equatable, Sendable {
  public let message: String
  public let rect: FigmaDiffRect?

  public init(message: String, rect: FigmaDiffRect? = nil) {
    self.message = message
    self.rect = rect
  }
}

public struct FigmaScreenshotDiffResult: Codable, Equatable, Sendable {
  public let screenName: String
  public let loopIndex: Int
  public let maxLoops: Int
  public let threshold: Double
  public let score: Double
  public let passed: Bool
  public let nextAction: FigmaDiffNextAction
  public let comparedPixels: Int
  public let maskedPixels: Int
  public let semanticPassPixels: Int
  public let changedPixelRatio: Double
  public let missingAsset: [FigmaDiffFinding]
  public let layoutShift: [FigmaDiffFinding]
  public let colorMismatch: [FigmaDiffFinding]
  public let colorRegionMismatch: [FigmaDiffFinding]
  public let criticalRegionMismatch: [FigmaDiffFinding]
  public let tokenOverrideApplied: [FigmaDiffFinding]
  public let dynamicMasked: [FigmaDiffFinding]

  enum CodingKeys: String, CodingKey {
    case screenName = "screen_name"
    case loopIndex = "loop_index"
    case maxLoops = "max_loops"
    case threshold
    case score
    case passed
    case nextAction = "next_action"
    case comparedPixels = "compared_pixels"
    case maskedPixels = "masked_pixels"
    case semanticPassPixels = "semantic_pass_pixels"
    case changedPixelRatio = "changed_pixel_ratio"
    case missingAsset = "missing_asset"
    case layoutShift = "layout_shift"
    case colorMismatch = "color_mismatch"
    case colorRegionMismatch = "color_region_mismatch"
    case criticalRegionMismatch = "critical_region_mismatch"
    case tokenOverrideApplied = "token_override_applied"
    case dynamicMasked = "dynamic_masked"
  }
}

public struct FigmaScreenshotDiffComparison: Equatable, Sendable {
  public let result: FigmaScreenshotDiffResult
  public let diffImage: FigmaDiffImage
}

public enum FigmaScreenshotDiffer {
  public static func compare(
    figma reference: FigmaDiffImage,
    swiftUI candidate: FigmaDiffImage,
    config: FigmaScreenshotDiffConfig
  ) -> FigmaScreenshotDiffComparison {
    let normalizedCandidate = candidate.resized(toWidth: reference.width, height: reference.height)
    let tolerance = config.antialiasTolerance / 255
    let passingCriticalRegions = passingCriticalRegions(
      reference: reference,
      candidate: normalizedCandidate,
      tolerance: tolerance,
      criticalRegions: config.criticalRegions
    )
    let passingColorRegions = config.colorRegions.filter(\.isTokenBacked)
    var penaltySum = 0.0
    var comparedPixels = 0
    var maskedPixels = 0
    var semanticPassPixels = 0
    var changedPixels = 0
    var diffPixels: [FigmaDiffPixel] = []
    diffPixels.reserveCapacity(reference.width * reference.height)

    for y in 0..<reference.height {
      for x in 0..<reference.width {
        if isMasked(x: x, y: y, regions: config.maskedRegions) {
          maskedPixels += 1
          diffPixels.append(.blueMask)
          continue
        }

        comparedPixels += 1
        let delta = reference[x, y].distance(to: normalizedCandidate[x, y])

        if delta <= tolerance {
          diffPixels.append(.white)
          continue
        }

        if hasEffectiveSemanticPass(x: x, y: y, regions: config.semanticPassRegions) {
          semanticPassPixels += 1
          diffPixels.append(.greenPass)
          continue
        }

        if hasEffectiveColorPass(x: x, y: y, regions: passingColorRegions) {
          semanticPassPixels += 1
          diffPixels.append(.greenPass)
          continue
        }

        if isInPassingCriticalRegion(x: x, y: y, regions: passingCriticalRegions) {
          semanticPassPixels += 1
          diffPixels.append(.greenPass)
          continue
        }

        penaltySum += max(0, delta - tolerance)
        changedPixels += 1
        diffPixels.append(.redHeat)
      }
    }

    let averagePenalty = comparedPixels == 0 ? 0 : penaltySum / Double(comparedPixels)
    let score = max(0, min(100, 100 - (averagePenalty * 100)))
    let criticalRegionMismatch = criticalRegionFindings(
      reference: reference,
      candidate: normalizedCandidate,
      tolerance: tolerance,
      maskedRegions: config.maskedRegions,
      semanticPassRegions: config.semanticPassRegions,
      criticalRegions: config.criticalRegions
    )
    let colorRegionMismatch = colorRegionFindings(
      colorRegions: config.colorRegions
    )
    let passed = score >= config.passThreshold
      && criticalRegionMismatch.isEmpty
      && colorRegionMismatch.isEmpty
    let nextAction: FigmaDiffNextAction
    if passed {
      nextAction = .pass
    } else if config.loopIndex < config.maxLoops {
      nextAction = .iterate
    } else {
      nextAction = .fail
    }

    let changedPixelRatio = comparedPixels == 0 ? 0 : Double(changedPixels) / Double(comparedPixels)
    let result = FigmaScreenshotDiffResult(
      screenName: config.screenName,
      loopIndex: config.loopIndex,
      maxLoops: config.maxLoops,
      threshold: config.passThreshold,
      score: score,
      passed: passed,
      nextAction: nextAction,
      comparedPixels: comparedPixels,
      maskedPixels: maskedPixels,
      semanticPassPixels: semanticPassPixels,
      changedPixelRatio: changedPixelRatio,
      missingAsset: missingAssetFindings(reference: reference, candidate: normalizedCandidate),
      layoutShift: layoutFindings(
        reference: reference,
        candidate: candidate,
        changedPixelRatio: changedPixelRatio
      ),
      colorMismatch: colorFindings(averagePenalty: averagePenalty, changedPixelRatio: changedPixelRatio),
      colorRegionMismatch: colorRegionMismatch,
      criticalRegionMismatch: criticalRegionMismatch,
      tokenOverrideApplied: semanticOverrideFindings(
        regions: config.semanticPassRegions,
        appliedPixels: semanticPassPixels
      ) + colorTokenOverrideFindings(regions: config.colorRegions),
      dynamicMasked: maskFindings(regions: config.maskedRegions, maskedPixels: maskedPixels)
    )

    return FigmaScreenshotDiffComparison(
      result: result,
      diffImage: FigmaDiffImage(width: reference.width, height: reference.height, pixels: diffPixels)
    )
  }

  private static func isMasked(x: Int, y: Int, regions: [FigmaDiffMaskRegion]) -> Bool {
    regions.contains { $0.rect.contains(x: x, y: y) }
  }

  private static func hasEffectiveSemanticPass(
    x: Int,
    y: Int,
    regions: [FigmaSemanticPassRegion]
  ) -> Bool {
    regions.contains { $0.isEffectiveOverride && $0.rect.contains(x: x, y: y) }
  }

  private static func hasEffectiveColorPass(
    x: Int,
    y: Int,
    regions: [FigmaColorRegion]
  ) -> Bool {
    regions.contains { $0.rect.contains(x: x, y: y) }
  }

  private static func layoutFindings(
    reference: FigmaDiffImage,
    candidate: FigmaDiffImage,
    changedPixelRatio: Double
  ) -> [FigmaDiffFinding] {
    var findings: [FigmaDiffFinding] = []

    if reference.width != candidate.width || reference.height != candidate.height {
      findings.append(
        FigmaDiffFinding(
          message: "SwiftUI screenshot was normalized from \(candidate.width)x\(candidate.height) to Figma viewport \(reference.width)x\(reference.height)."
        )
      )
    }

    if changedPixelRatio > 0.05 {
      findings.append(
        FigmaDiffFinding(
          message: "More than 5% of compared pixels changed; inspect layout position, size, or missing regions."
        )
      )
    }

    return findings
  }

  private static func missingAssetFindings(
    reference: FigmaDiffImage,
    candidate: FigmaDiffImage
  ) -> [FigmaDiffFinding] {
    guard candidate.luminanceStandardDeviation < 6, reference.luminanceStandardDeviation > 12 else {
      return []
    }

    return [
      FigmaDiffFinding(
        message: "SwiftUI screenshot is visually flat while Figma has image detail; this often means a missing, blank, or placeholder asset."
      )
    ]
  }

  private static func colorFindings(
    averagePenalty: Double,
    changedPixelRatio: Double
  ) -> [FigmaDiffFinding] {
    guard averagePenalty > 0.01 || changedPixelRatio > 0.01 else { return [] }
    return [
      FigmaDiffFinding(
        message: "Color or antialiasing delta affected the score. Check token mappings before changing raw color values."
      )
    ]
  }

  private static func colorRegionFindings(
    colorRegions: [FigmaColorRegion]
  ) -> [FigmaDiffFinding] {
    colorRegions.compactMap { region in
      guard region.isTokenBacked else {
        return FigmaDiffFinding(
          message: "Color token region '\(region.name)' failed: token mapping is missing or resolved values differ. Run `FigmaHarnessCLI color-tokens` before screenshot diff. \(region.reason)",
          rect: region.rect
        )
      }

      return nil
    }
  }

  private static func averageColor(
    in image: FigmaDiffImage,
    region: FigmaColorRegion
  ) -> FigmaDiffPixel? {
    let minX = max(0, region.rect.x)
    let minY = max(0, region.rect.y)
    let maxX = min(image.width, region.rect.x + region.rect.width)
    let maxY = min(image.height, region.rect.y + region.rect.height)
    var redSum = 0.0
    var greenSum = 0.0
    var blueSum = 0.0
    var sampleCount = 0.0

    guard minX < maxX, minY < maxY else { return nil }

    for y in minY..<maxY {
      for x in minX..<maxX {
        let pixel = image[x, y]
        if region.sampleMode != .all, pixel.distance(to: .white) <= 0.03 {
          continue
        }

        if region.sampleMode == .dominantForeground, pixel.saturation < 0.25 {
          continue
        }

        redSum += Double(pixel.red)
        greenSum += Double(pixel.green)
        blueSum += Double(pixel.blue)
        sampleCount += 1
      }
    }

    guard sampleCount > 0 else { return nil }
    return FigmaDiffPixel(
      red: UInt8(clamping: Int((redSum / sampleCount).rounded())),
      green: UInt8(clamping: Int((greenSum / sampleCount).rounded())),
      blue: UInt8(clamping: Int((blueSum / sampleCount).rounded()))
    )
  }

  private static func passingCriticalRegions(
    reference: FigmaDiffImage,
    candidate: FigmaDiffImage,
    tolerance: Double,
    criticalRegions: [FigmaCriticalRegion]
  ) -> [FigmaCriticalRegion] {
    criticalRegions.filter { region in
      criticalRegionScore(reference: reference, candidate: candidate, tolerance: tolerance, region: region)
        >= region.minimumScore
        || (
          region.maxPositionDelta.map {
            foregroundBoundsMatch(
              reference: reference,
              candidate: candidate,
              region: region.rect,
              tolerance: tolerance,
              maxPositionDelta: $0
            )
          } ?? false
        )
    }
  }

  private static func isInPassingCriticalRegion(
    x: Int,
    y: Int,
    regions: [FigmaCriticalRegion]
  ) -> Bool {
    regions.contains { $0.rect.contains(x: x, y: y) }
  }

  private static func criticalRegionFindings(
    reference: FigmaDiffImage,
    candidate: FigmaDiffImage,
    tolerance: Double,
    maskedRegions: [FigmaDiffMaskRegion],
    semanticPassRegions: [FigmaSemanticPassRegion],
    criticalRegions: [FigmaCriticalRegion]
  ) -> [FigmaDiffFinding] {
    criticalRegions.compactMap { region in
      let score = criticalRegionScore(
        reference: reference,
        candidate: candidate,
        tolerance: tolerance,
        region: region,
        maskedRegions: maskedRegions,
        semanticPassRegions: semanticPassRegions
      )
      guard score < region.minimumScore else { return nil }

      if let maxPositionDelta = region.maxPositionDelta,
        foregroundBoundsMatch(
          reference: reference,
          candidate: candidate,
          region: region.rect,
          tolerance: tolerance,
          maxPositionDelta: maxPositionDelta
        )
      {
        return nil
      }

      return FigmaDiffFinding(
        message: "Critical region scored \(String(format: "%.2f", score)) below \(region.minimumScore). \(region.reason)",
        rect: region.rect
      )
    }
  }

  private static func criticalRegionScore(
    reference: FigmaDiffImage,
    candidate: FigmaDiffImage,
    tolerance: Double,
    region: FigmaCriticalRegion,
    maskedRegions: [FigmaDiffMaskRegion] = [],
    semanticPassRegions: [FigmaSemanticPassRegion] = []
  ) -> Double {
    var penaltySum = 0.0
    var comparedPixels = 0
    let minX = max(0, region.rect.x)
    let minY = max(0, region.rect.y)
    let maxX = min(reference.width, region.rect.x + region.rect.width)
    let maxY = min(reference.height, region.rect.y + region.rect.height)

    guard minX < maxX, minY < maxY else { return 100 }

    for y in minY..<maxY {
      for x in minX..<maxX {
        if isMasked(x: x, y: y, regions: maskedRegions)
          || hasEffectiveSemanticPass(x: x, y: y, regions: semanticPassRegions)
        {
          continue
        }

        let referencePixel = reference[x, y]
        let candidatePixel = candidate[x, y]
        if referencePixel.distance(to: .white) <= tolerance
          && candidatePixel.distance(to: .white) <= tolerance
        {
          continue
        }

        comparedPixels += 1
        let delta = referencePixel.distance(to: candidatePixel)
        penaltySum += max(0, delta - tolerance)
      }
    }

    guard comparedPixels > 0 else { return 100 }

    let averagePenalty = penaltySum / Double(comparedPixels)
    return max(0, min(100, 100 - (averagePenalty * 100)))
  }

  private static func foregroundBoundsMatch(
    reference: FigmaDiffImage,
    candidate: FigmaDiffImage,
    region: FigmaDiffRect,
    tolerance: Double,
    maxPositionDelta: Int
  ) -> Bool {
    guard
      let referenceBounds = foregroundBounds(in: reference, region: region, tolerance: tolerance),
      let candidateBounds = foregroundBounds(in: candidate, region: region, tolerance: tolerance)
    else {
      return false
    }

    return abs(referenceBounds.x - candidateBounds.x) <= maxPositionDelta
      && abs(referenceBounds.y - candidateBounds.y) <= maxPositionDelta
      && abs(referenceBounds.width - candidateBounds.width) <= maxPositionDelta
      && abs(referenceBounds.height - candidateBounds.height) <= maxPositionDelta
  }

  private static func foregroundBounds(
    in image: FigmaDiffImage,
    region: FigmaDiffRect,
    tolerance: Double
  ) -> FigmaDiffRect? {
    let minX = max(0, region.x)
    let minY = max(0, region.y)
    let maxX = min(image.width, region.x + region.width)
    let maxY = min(image.height, region.y + region.height)
    var contentMinX = image.width
    var contentMinY = image.height
    var contentMaxX = -1
    var contentMaxY = -1

    guard minX < maxX, minY < maxY else { return nil }

    for y in minY..<maxY {
      for x in minX..<maxX where image[x, y].distance(to: .white) > tolerance {
        contentMinX = min(contentMinX, x)
        contentMinY = min(contentMinY, y)
        contentMaxX = max(contentMaxX, x)
        contentMaxY = max(contentMaxY, y)
      }
    }

    guard contentMaxX >= contentMinX, contentMaxY >= contentMinY else { return nil }
    return FigmaDiffRect(
      x: contentMinX,
      y: contentMinY,
      width: contentMaxX - contentMinX + 1,
      height: contentMaxY - contentMinY + 1
    )
  }

  private static func semanticOverrideFindings(
    regions: [FigmaSemanticPassRegion],
    appliedPixels: Int
  ) -> [FigmaDiffFinding] {
    guard appliedPixels > 0 else { return [] }
    return regions
      .filter(\.isEffectiveOverride)
      .map {
        FigmaDiffFinding(
          message: "Semantic override applied: \($0.figmaTokenName) == \($0.swiftReference) resolved to \($0.figmaResolvedValue). \($0.reason)",
          rect: $0.rect
        )
      }
  }

  private static func colorTokenOverrideFindings(
    regions: [FigmaColorRegion]
  ) -> [FigmaDiffFinding] {
    regions
      .filter(\.isTokenBacked)
      .map {
        FigmaDiffFinding(
          message: "Color token override applied: \($0.figmaTokenName) == \($0.swiftReference) resolved to \($0.figmaResolvedValue). Pixel color delta in this region is accepted after the color-token gate. \($0.reason)",
          rect: $0.rect
        )
      }
  }

  private static func maskFindings(
    regions: [FigmaDiffMaskRegion],
    maskedPixels: Int
  ) -> [FigmaDiffFinding] {
    guard maskedPixels > 0 else { return [] }
    return regions.map {
      FigmaDiffFinding(
        message: "Dynamic region masked: \($0.reason)",
        rect: $0.rect
      )
    }
  }
}

private extension FigmaDiffPixel {
  init?(hex: String) {
    let cleaned = hex
      .trimmingCharacters(in: .whitespacesAndNewlines)
      .replacingOccurrences(of: "#", with: "")

    guard cleaned.count == 6, let value = UInt32(cleaned, radix: 16) else {
      return nil
    }

    self.init(
      red: UInt8((value >> 16) & 0xFF),
      green: UInt8((value >> 8) & 0xFF),
      blue: UInt8(value & 0xFF)
    )
  }

  var luminance: Double {
    let red = Double(red) / 255
    let green = Double(green) / 255
    let blue = Double(blue) / 255
    return (0.2126 * red) + (0.7152 * green) + (0.0722 * blue)
  }

  var saturation: Double {
    let red = Double(red) / 255
    let green = Double(green) / 255
    let blue = Double(blue) / 255
    let maximum = max(red, green, blue)
    let minimum = min(red, green, blue)
    guard maximum > 0 else { return 0 }
    return (maximum - minimum) / maximum
  }

  func distance(to other: FigmaDiffPixel) -> Double {
    let redDelta = Double(red) - Double(other.red)
    let greenDelta = Double(green) - Double(other.green)
    let blueDelta = Double(blue) - Double(other.blue)
    return sqrt((redDelta * redDelta) + (greenDelta * greenDelta) + (blueDelta * blueDelta))
      / sqrt(3 * 255 * 255)
  }

  var hexString: String {
    String(format: "#%02X%02X%02X", red, green, blue)
  }
}

#if canImport(AppKit)
public extension FigmaDiffImage {
  init(contentsOf url: URL) throws {
    guard let image = NSImage(contentsOf: url) else {
      throw FigmaDiffImageIOError.couldNotRead(url.path)
    }
    guard let tiffData = image.tiffRepresentation,
          let bitmap = NSBitmapImageRep(data: tiffData)
    else {
      throw FigmaDiffImageIOError.couldNotDecode(url.path)
    }

    var pixels: [FigmaDiffPixel] = []
    pixels.reserveCapacity(bitmap.pixelsWide * bitmap.pixelsHigh)

    for y in 0..<bitmap.pixelsHigh {
      for x in 0..<bitmap.pixelsWide {
        guard let color = bitmap.colorAt(x: x, y: y)?.usingColorSpace(.sRGB) else {
          pixels.append(.white)
          continue
        }
        pixels.append(
          FigmaDiffPixel(
            red: UInt8(clamping: Int((color.redComponent * 255).rounded())),
            green: UInt8(clamping: Int((color.greenComponent * 255).rounded())),
            blue: UInt8(clamping: Int((color.blueComponent * 255).rounded())),
            alpha: UInt8(clamping: Int((color.alphaComponent * 255).rounded()))
          )
        )
      }
    }

    self.init(width: bitmap.pixelsWide, height: bitmap.pixelsHigh, pixels: pixels)
  }

  func writePNG(to url: URL) throws {
    guard let bitmap = NSBitmapImageRep(
      bitmapDataPlanes: nil,
      pixelsWide: width,
      pixelsHigh: height,
      bitsPerSample: 8,
      samplesPerPixel: 4,
      hasAlpha: true,
      isPlanar: false,
      colorSpaceName: .deviceRGB,
      bytesPerRow: width * 4,
      bitsPerPixel: 32
    ) else {
      throw FigmaDiffImageIOError.couldNotCreatePNG(url.path)
    }

    for y in 0..<height {
      for x in 0..<width {
        let pixel = self[x, y]
        bitmap.setColor(
          NSColor(
            calibratedRed: CGFloat(pixel.red) / 255,
            green: CGFloat(pixel.green) / 255,
            blue: CGFloat(pixel.blue) / 255,
            alpha: CGFloat(pixel.alpha) / 255
          ),
          atX: x,
          y: y
        )
      }
    }

    guard let data = bitmap.representation(using: .png, properties: [:]) else {
      throw FigmaDiffImageIOError.couldNotCreatePNG(url.path)
    }
    try data.write(to: url, options: .atomic)
  }
}

public enum FigmaDiffImageIOError: Error, CustomStringConvertible {
  case couldNotRead(String)
  case couldNotDecode(String)
  case couldNotCreatePNG(String)

  public var description: String {
    switch self {
    case .couldNotRead(let path):
      return "Could not read image at \(path)"
    case .couldNotDecode(let path):
      return "Could not decode image at \(path)"
    case .couldNotCreatePNG(let path):
      return "Could not create PNG at \(path)"
    }
  }
}
#endif
