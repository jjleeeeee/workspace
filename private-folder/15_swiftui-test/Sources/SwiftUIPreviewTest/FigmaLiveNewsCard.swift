import SwiftUI

#if canImport(UIKit)
import UIKit
#elseif canImport(AppKit)
import AppKit
#endif

public struct FigmaLiveNewsCardContent: Equatable, Sendable {
  public var sectionTitle: String
  public var artistName: String
  public var subtitle: String
  public var body: String
  public var moreLabel: String
  public var callToAction: String
  public var heroImageName: String

  public init(
    sectionTitle: String,
    artistName: String,
    subtitle: String,
    body: String,
    moreLabel: String,
    callToAction: String,
    heroImageName: String
  ) {
    self.sectionTitle = sectionTitle
    self.artistName = artistName
    self.subtitle = subtitle
    self.body = body
    self.moreLabel = moreLabel
    self.callToAction = callToAction
    self.heroImageName = heroImageName
  }

  public var accessibilitySummary: String {
    "\(sectionTitle), \(artistName), \(subtitle), \(callToAction)"
  }

  public static let testSwiftUI = FigmaLiveNewsCardContent(
    sectionTitle: "놓치지 말아야 할 소식",
    artistName: "TOMORROW X TOGETHER",
    subtitle: "추천포스트",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor  Lorem ipsum dolor sit amet, consectetur adipiscing Lorem ipsum dolor sit amet, consectetur aliquip aliquip ex ea commodo consequat. Duis...",
    moreLabel: "More",
    callToAction: "MOA 멤버십 선예매 사전인증하기",
    heroImageName: "figma-test-swiftui-hero"
  )
}

public struct FigmaLiveNewsCard: View {
  public let content: FigmaLiveNewsCardContent

  public init(content: FigmaLiveNewsCardContent = .testSwiftUI) {
    self.content = content
  }

  public var body: some View {
    VStack(alignment: .leading, spacing: ChordToken.Padding.box200) {
      Text(content.sectionTitle)
        .font(ChordToken.Typography.headlineSSystem800.font)
        .foregroundStyle(ChordToken.Color.textDefault.swiftUIColor)
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(.horizontal, ChordToken.Padding.box200)

      card
        .padding(.horizontal, ChordToken.Margin.screen125)
    }
    .frame(width: FigmaLiveNewsCardMetrics.slotWidth)
    .accessibilityElement(children: .contain)
    .accessibilityLabel(content.accessibilitySummary)
  }

  private var card: some View {
    VStack(alignment: .leading, spacing: ChordToken.Padding.box0) {
      FigmaResourceImage(name: content.heroImageName)
        .frame(
          width: FigmaLiveNewsCardMetrics.heroLength,
          height: FigmaLiveNewsCardMetrics.heroLength
        )
        .clipped()
        .accessibilityHidden(true)

      authorRow
        .padding(.horizontal, ChordToken.Padding.box200)
        .padding(.vertical, ChordToken.Padding.box150)

      bodyText
        .padding(.horizontal, ChordToken.Padding.box200)
        .padding(.bottom, ChordToken.Padding.box200)

      Divider()

      ctaRow
        .padding(.horizontal, ChordToken.Padding.box200)
        .frame(minHeight: ChordToken.ButtonHeight.xxlarge)
    }
    .background(ChordToken.Color.surfaceDefault3.swiftUIColor)
    .clipShape(RoundedRectangle(cornerRadius: ChordToken.Radius.box200, style: .continuous))
    .shadow(color: .black.opacity(0.10), radius: 28, x: 0, y: 6)
  }

  private var authorRow: some View {
    HStack(spacing: ChordToken.Padding.box100) {
      Circle()
        .fill(FigmaLocalColor.avatarPink.swiftUIColor)
        .frame(
          width: FigmaLiveNewsCardMetrics.avatarLength,
          height: FigmaLiveNewsCardMetrics.avatarLength
        )
        .overlay {
          Text("투바투")
            .font(.caption2.weight(.bold))
            .foregroundStyle(ChordToken.Color.fixedTextBlackSame.swiftUIColor)
            .minimumScaleFactor(0.7)
        }
        .accessibilityHidden(true)

      VStack(alignment: .leading, spacing: 0) {
        Text(content.artistName)
          .font(ChordToken.Typography.bodyMSystem700.font)
          .foregroundStyle(ChordToken.Color.textDefault.swiftUIColor)
          .lineLimit(1)

        Text(content.subtitle)
          .font(ChordToken.Typography.captionMSystem400.font)
          .foregroundStyle(ChordToken.Color.textGray500.swiftUIColor)
          .lineLimit(1)
      }

      Spacer(minLength: ChordToken.Padding.box100)

      Button(action: { /* TODO: open overflow menu */ }) {
        Image(systemName: "ellipsis")
          .rotationEffect(.degrees(90))
          .font(.body.weight(.bold))
          .foregroundStyle(ChordToken.Color.textDefault.swiftUIColor)
          .frame(
            width: FigmaLiveNewsCardMetrics.iconButtonLength,
            height: FigmaLiveNewsCardMetrics.iconButtonLength
          )
      }
      .buttonStyle(.plain)
      .accessibilityLabel("More options")
    }
  }

  private var bodyText: some View {
    (
      Text(content.body + FigmaLiveNewsCardMetrics.moreLabelInlineGap)
        .font(ChordToken.Typography.bodySSystem400.font)
        .foregroundStyle(ChordToken.Color.textDefault.swiftUIColor)
      + Text(content.moreLabel)
        .font(ChordToken.Typography.bodySSystem700.font)
        .foregroundStyle(ChordToken.Color.textPrimary.swiftUIColor)
    )
    .lineSpacing(FigmaLiveNewsCardMetrics.bodyLineSpacing)
    .lineLimit(5)
    .frame(maxWidth: .infinity, alignment: .leading)
    .padding(.top, FigmaLiveNewsCardMetrics.bodyTextTopInset)
  }

  private var ctaRow: some View {
    Button(action: { /* TODO: start membership presale verification */ }) {
      HStack(spacing: ChordToken.Padding.box150) {
        Text(content.callToAction)
          .font(ChordToken.Typography.bodySSystem700.font)
          .foregroundStyle(ChordToken.Color.textDefault.swiftUIColor)
          .lineLimit(1)
          .minimumScaleFactor(0.8)

        Spacer(minLength: ChordToken.Padding.box100)

        Image(systemName: "arrow.right")
          .font(.body.weight(.medium))
          .foregroundStyle(ChordToken.Color.textDefault.swiftUIColor)
      }
    }
    .buttonStyle(.plain)
  }
}

enum FigmaLiveNewsCardMetrics {
  static let slotWidth: CGFloat = 393
  static let heroLength: CGFloat = 373
  static let avatarLength: CGFloat = 38
  static let iconButtonLength: CGFloat = 32
  static let bodyLineSpacing: CGFloat = 2.5
  static let bodyTextTopInset: CGFloat = 1
  static let moreLabelInlineGap = "   "
  static let cardHorizontalInset = ChordToken.Margin.screen125
}

enum FigmaLocalColor {
  static let avatarPink = ChordColorToken(
    name: "FigmaLocal/avatar-pink",
    lightHex: "#FF1E91",
    darkHex: "#FF1E91"
  )
}

struct FigmaResourceImage: View {
  let name: String

  var body: some View {
    #if canImport(UIKit)
    if let image = uiImage {
      Image(uiImage: image)
        .resizable()
        .scaledToFill()
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    } else {
      Color(.secondarySystemBackground)
    }
    #elseif canImport(AppKit)
    if let image = nsImage {
      Image(nsImage: image)
        .resizable()
        .scaledToFill()
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    } else {
      Color(nsColor: .windowBackgroundColor)
    }
    #else
    Color.gray.opacity(0.15)
    #endif
  }

  #if canImport(UIKit)
  private var uiImage: UIImage? {
    FigmaResourceLookup.url(named: name).flatMap {
      UIImage(contentsOfFile: $0.path)
    }
  }
  #elseif canImport(AppKit)
  private var nsImage: NSImage? {
    FigmaResourceLookup.url(named: name).flatMap {
      NSImage(contentsOf: $0)
    }
  }
  #endif
}

enum FigmaResourceLookup {
  static func url(named name: String, extension fileExtension: String = "png") -> URL? {
    if let url = Bundle.module.url(forResource: name, withExtension: "png") {
      return url
    }

    if let url = Bundle.main.url(forResource: name, withExtension: "png") {
      return url
    }

    for bundle in Bundle.allBundles + Bundle.allFrameworks {
      if let url = bundle.url(forResource: name, withExtension: "png") {
        return url
      }
    }

    return Bundle.main.bundleURL.resourceURL(named: "\(name).png")
  }

  static func diagnostics(named name: String) -> [String] {
    let fileName = "\(name).png"
    var rows = [
      "Bundle.module: \(Bundle.module.url(forResource: name, withExtension: "png")?.lastPathComponent ?? "MISS")",
      "Bundle.main: \(Bundle.main.url(forResource: name, withExtension: "png")?.lastPathComponent ?? "MISS")",
      "Bundle.main path: \(Bundle.main.bundleURL.lastPathComponent)",
    ]

    let bundleHit = (Bundle.allBundles + Bundle.allFrameworks)
      .compactMap { $0.url(forResource: name, withExtension: "png") }
      .first
    rows.append("All bundles: \(bundleHit?.lastPathComponent ?? "MISS")")

    let recursiveHit = Bundle.main.bundleURL.resourceURL(named: fileName)
    rows.append("Recursive app hit: \(recursiveHit?.path ?? "MISS")")

    #if canImport(UIKit)
    if let url = url(named: name), let image = UIImage(contentsOfFile: url.path) {
      rows.append("UIImage: \(Int(image.size.width))x\(Int(image.size.height))")
    } else {
      rows.append("UIImage: MISS")
    }
    #elseif canImport(AppKit)
    if let url = url(named: name), let image = NSImage(contentsOf: url) {
      rows.append("NSImage: \(Int(image.size.width))x\(Int(image.size.height))")
    } else {
      rows.append("NSImage: MISS")
    }
    #endif

    return rows
  }
}

private extension URL {
  func resourceURL(named fileName: String) -> URL? {
    guard
      let enumerator = FileManager.default.enumerator(
        at: self,
        includingPropertiesForKeys: nil,
        options: [.skipsHiddenFiles]
      )
    else {
      return nil
    }

    for case let url as URL in enumerator where url.lastPathComponent == fileName {
      return url
    }

    return nil
  }
}

#Preview("Figma test-swiftui") {
  FigmaLiveNewsCard()
    .padding()
    .background(ChordToken.Color.surfaceDefault3.swiftUIColor)
}

#Preview("Resource Probe") {
  FigmaResourceProbeView()
    .padding()
}
