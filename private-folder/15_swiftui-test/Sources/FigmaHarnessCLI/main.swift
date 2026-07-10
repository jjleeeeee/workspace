import Darwin
import Foundation
import SwiftUI
import SwiftUIPreviewTest
#if canImport(AppKit)
import AppKit
#endif

@MainActor
enum HarnessCLI {
  static func main() {
    var arguments = Array(CommandLine.arguments.dropFirst())
    guard let command = arguments.first else {
      printUsageAndExit(2)
    }
    arguments.removeFirst()

    do {
      switch command {
      case "color-tokens":
        let options = try ColorTokenOptions(arguments: arguments)
        try runColorTokens(options: options)
      case "diff":
        let options = try DiffOptions(arguments: arguments)
        try runDiff(options: options)
      case "normalize":
        let options = try NormalizeOptions(arguments: arguments)
        try runNormalize(options: options)
      case "render":
        let options = try RenderOptions(arguments: arguments)
        try runRender(options: options)
      default:
        printUsageAndExit(2)
      }
      exit(0)
    } catch {
      fputs("FigmaHarnessCLI error: \(error)\n", stderr)
      exit(2)
    }
  }

  private static func runColorTokens(options: ColorTokenOptions) throws {
    let manifest = try loadManifest(url: options.manifestURL)
    let result = FigmaColorTokenValidator.validate(
      screenName: options.screenName,
      colorRegions: manifest.colorRegions
    )

    try FileManager.default.createDirectory(
      at: options.outputJSONURL.deletingLastPathComponent(),
      withIntermediateDirectories: true
    )

    let encoder = JSONEncoder()
    encoder.outputFormatting = [.prettyPrinted, .sortedKeys]
    try encoder.encode(result).write(to: options.outputJSONURL, options: .atomic)

    print(
      "color token check checked_regions=\(result.checkedRegionCount) passed=\(result.passed)"
    )
    print("json: \(options.outputJSONURL.path)")

    exit(result.passed ? 0 : 12)
  }

  private static func runDiff(options: DiffOptions) throws {
    let manifest = try options.manifestURL.map(loadManifest) ?? FigmaScreenshotDiffManifest()
    let config = FigmaScreenshotDiffConfig(
      screenName: options.screenName,
      passThreshold: options.threshold,
      loopIndex: options.loopIndex,
      maxLoops: options.maxLoops,
      maskedRegions: manifest.maskedRegions,
      semanticPassRegions: manifest.semanticPassRegions,
      criticalRegions: manifest.criticalRegions,
      colorRegions: manifest.colorRegions
    )
    let figmaImage = try FigmaDiffImage(contentsOf: options.figmaURL)
    let swiftUIImage = try FigmaDiffImage(contentsOf: options.swiftUIURL)
    let comparison = FigmaScreenshotDiffer.compare(
      figma: figmaImage,
      swiftUI: swiftUIImage,
      config: config
    )

    try FileManager.default.createDirectory(
      at: options.outputJSONURL.deletingLastPathComponent(),
      withIntermediateDirectories: true
    )
    try FileManager.default.createDirectory(
      at: options.outputDiffURL.deletingLastPathComponent(),
      withIntermediateDirectories: true
    )

    let encoder = JSONEncoder()
    encoder.outputFormatting = [.prettyPrinted, .sortedKeys]
    try encoder.encode(comparison.result).write(to: options.outputJSONURL, options: .atomic)
    try comparison.diffImage.writePNG(to: options.outputDiffURL)

    print(
      "screenshot diff score=\(String(format: "%.2f", comparison.result.score)) threshold=\(options.threshold) next_action=\(comparison.result.nextAction.rawValue)"
    )
    print("json: \(options.outputJSONURL.path)")
    print("diff: \(options.outputDiffURL.path)")

    switch comparison.result.nextAction {
    case .pass:
      exit(0)
    case .iterate:
      exit(10)
    case .fail:
      exit(11)
    }
  }

  private static func runNormalize(options: NormalizeOptions) throws {
    let manifest = try loadManifest(url: options.manifestURL)
    guard let normalization = manifest.normalization else {
      throw NormalizeError.missingNormalization(options.manifestURL.path)
    }

    let figmaImage = try FigmaDiffImage(contentsOf: options.figmaURL)
    let simulatorFullImage = try FigmaDiffImage(contentsOf: options.simulatorFullURL)
    let result = FigmaScreenshotNormalizer.normalize(
      simulatorFull: simulatorFullImage,
      matching: figmaImage,
      config: normalization
    )

    try FileManager.default.createDirectory(
      at: options.outputURL.deletingLastPathComponent(),
      withIntermediateDirectories: true
    )
    try result.image.writePNG(to: options.outputURL)

    if let reportURL = options.outputReportURL {
      try FileManager.default.createDirectory(
        at: reportURL.deletingLastPathComponent(),
        withIntermediateDirectories: true
      )
      let encoder = JSONEncoder()
      encoder.outputFormatting = [.prettyPrinted, .sortedKeys]
      try encoder.encode(result.report).write(to: reportURL, options: .atomic)
      print("normalization report: \(reportURL.path)")
    }

    print("normalized swiftui screenshot: \(options.outputURL.path)")
    print("figma_content_bounds: \(describe(result.report.figmaContentBounds))")
    print("swiftui_content_bounds: \(describe(result.report.swiftUIContentBounds))")
  }

  #if canImport(AppKit)
  private static func runRender(options: RenderOptions) throws {
    let app = NSApplication.shared
    app.setActivationPolicy(.accessory)

    let screen = OnLiveScreen(content: .preview)
    let size = NSSize(width: options.width, height: options.height)
    let hostView = NSHostingView(rootView: screen)
    hostView.appearance = NSAppearance(named: .aqua)  // force light mode to match Figma designs
    hostView.setFrameSize(size)
    hostView.layout()

    guard let bitmap = hostView.bitmapImageRepForCachingDisplay(in: hostView.bounds) else {
      throw RenderError.failedToRender(options.screenName)
    }
    hostView.cacheDisplay(in: hostView.bounds, to: bitmap)
    guard let pngData = bitmap.representation(using: .png, properties: [:]) else {
      throw RenderError.failedToRender(options.screenName)
    }

    try FileManager.default.createDirectory(
      at: options.outputURL.deletingLastPathComponent(),
      withIntermediateDirectories: true
    )
    try pngData.write(to: options.outputURL, options: .atomic)
    print("rendered: \(options.outputURL.path)")
    print("size: \(Int(size.width))x\(Int(size.height)) scale=\(options.scale)")
  }
  #else
  private static func runRender(options: RenderOptions) throws {
    throw RenderError.unsupportedPlatform
  }
  #endif

  private static func loadManifest(url: URL) throws -> FigmaScreenshotDiffManifest {
    let decoder = JSONDecoder()
    decoder.keyDecodingStrategy = .convertFromSnakeCase
    return try decoder.decode(FigmaScreenshotDiffManifest.self, from: Data(contentsOf: url))
  }

  private static func printUsageAndExit(_ code: Int32) -> Never {
    print(
      """
      Usage:
        swift run FigmaHarnessCLI render \\
          --screen onlive-screen \\
          --output /tmp/onlive-screen-swiftui.png \\
          [--width 393] [--height 852] [--scale 1.0]

        swift run FigmaHarnessCLI color-tokens \\
          --screen onlive-screen \\
          --manifest harness/onlive-screen-diff-manifest.json \\
          --output-json /tmp/onlive-screen-color-tokens-loop-1.json

        swift run FigmaHarnessCLI normalize \\
          --figma /tmp/onlive-screen-figma.png \\
          --simulator-full /tmp/onlive-screen-swiftui-loop-1-full.png \\
          --output /tmp/onlive-screen-swiftui-loop-1.png \\
          --manifest harness/onlive-screen-diff-manifest.json \\
          [--output-report /tmp/onlive-screen-normalization-loop-1.json]

        swift run FigmaHarnessCLI diff \\
          --screen onlive-screen \\
          --figma /tmp/onlive-screen-figma.png \\
          --swiftui /tmp/onlive-screen-swiftui-loop-1.png \\
          --output-json /tmp/onlive-screen-diff-loop-1.json \\
          --output-diff /tmp/onlive-screen-diff-loop-1.png \\
          [--manifest harness/onlive-screen-diff-manifest.json] \\
          [--threshold 95] [--loop 1] [--max-loops 5]
      """
    )
    exit(code)
  }

  private static func describe(_ rect: FigmaDiffRect?) -> String {
    guard let rect else { return "nil" }
    return "x=\(rect.x) y=\(rect.y) width=\(rect.width) height=\(rect.height)"
  }
}

struct ColorTokenOptions {
  let screenName: String
  let manifestURL: URL
  let outputJSONURL: URL

  init(arguments: [String]) throws {
    let values = try ParsedArguments(arguments: arguments)
    screenName = try values.required("--screen")
    manifestURL = URL(fileURLWithPath: try values.required("--manifest"))
    outputJSONURL = URL(fileURLWithPath: try values.required("--output-json"))
  }
}

struct DiffOptions {
  let screenName: String
  let figmaURL: URL
  let swiftUIURL: URL
  let outputJSONURL: URL
  let outputDiffURL: URL
  let manifestURL: URL?
  let threshold: Double
  let loopIndex: Int
  let maxLoops: Int

  init(arguments: [String]) throws {
    let values = try ParsedArguments(arguments: arguments)
    screenName = try values.required("--screen")
    figmaURL = URL(fileURLWithPath: try values.required("--figma"))
    swiftUIURL = URL(fileURLWithPath: try values.required("--swiftui"))
    outputJSONURL = URL(fileURLWithPath: try values.required("--output-json"))
    outputDiffURL = URL(fileURLWithPath: try values.required("--output-diff"))
    manifestURL = values.optional("--manifest").map { URL(fileURLWithPath: $0) }
    threshold = Double(values.optional("--threshold") ?? "95") ?? 95
    loopIndex = Int(values.optional("--loop") ?? "1") ?? 1
    maxLoops = Int(values.optional("--max-loops") ?? "5") ?? 5
  }
}

struct NormalizeOptions {
  let figmaURL: URL
  let simulatorFullURL: URL
  let outputURL: URL
  let outputReportURL: URL?
  let manifestURL: URL

  init(arguments: [String]) throws {
    let values = try ParsedArguments(arguments: arguments)
    figmaURL = URL(fileURLWithPath: try values.required("--figma"))
    simulatorFullURL = URL(fileURLWithPath: try values.required("--simulator-full"))
    outputURL = URL(fileURLWithPath: try values.required("--output"))
    outputReportURL = values.optional("--output-report").map { URL(fileURLWithPath: $0) }
    manifestURL = URL(fileURLWithPath: try values.required("--manifest"))
  }
}

struct RenderOptions {
  let screenName: String
  let outputURL: URL
  let scale: Double
  let width: CGFloat
  let height: CGFloat

  init(arguments: [String]) throws {
    let values = try ParsedArguments(arguments: arguments)
    screenName = try values.required("--screen")
    outputURL = URL(fileURLWithPath: try values.required("--output"))
    scale = Double(values.optional("--scale") ?? "1.0") ?? 1.0
    width = CGFloat(Double(values.optional("--width") ?? "393") ?? 393)
    height = CGFloat(Double(values.optional("--height") ?? "852") ?? 852)
  }
}

struct ParsedArguments {
  private let values: [String: String]

  init(arguments: [String]) throws {
    var parsed: [String: String] = [:]
    var index = 0
    while index < arguments.count {
      let key = arguments[index]
      guard key.hasPrefix("--") else {
        throw ArgumentError.unexpected(key)
      }
      let valueIndex = index + 1
      guard valueIndex < arguments.count else {
        throw ArgumentError.missingValue(key)
      }
      parsed[key] = arguments[valueIndex]
      index += 2
    }
    values = parsed
  }

  func required(_ key: String) throws -> String {
    guard let value = values[key], !value.isEmpty else {
      throw ArgumentError.missingValue(key)
    }
    return value
  }

  func optional(_ key: String) -> String? {
    values[key]
  }
}

enum NormalizeError: Error, CustomStringConvertible {
  case missingNormalization(String)

  var description: String {
    switch self {
    case .missingNormalization(let path):
      return "Manifest \(path) does not define a normalization block."
    }
  }
}

enum RenderError: Error, CustomStringConvertible {
  case failedToRender(String)
  case unsupportedPlatform

  var description: String {
    switch self {
    case .failedToRender(let name):
      return "ImageRenderer failed for screen '\(name)'."
    case .unsupportedPlatform:
      return "render subcommand requires macOS."
    }
  }
}

enum ArgumentError: Error, CustomStringConvertible {
  case unexpected(String)
  case missingValue(String)

  var description: String {
    switch self {
    case .unexpected(let argument):
      return "Unexpected argument \(argument)"
    case .missingValue(let argument):
      return "Missing value for \(argument)"
    }
  }
}

Task { @MainActor in
  HarnessCLI.main()
}
RunLoop.main.run()
