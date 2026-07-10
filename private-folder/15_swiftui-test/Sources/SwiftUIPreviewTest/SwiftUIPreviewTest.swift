import SwiftUI

public enum PreviewStatus: Equatable, Sendable {
  case ready
  case empty

  public var label: String {
    switch self {
    case .ready:
      "Ready"
    case .empty:
      "Empty"
    }
  }
}

public struct PreviewCardContent: Equatable, Sendable {
  public var title: String
  public var subtitle: String
  public var status: PreviewStatus

  public init(title: String, subtitle: String, status: PreviewStatus) {
    self.title = title
    self.subtitle = subtitle
    self.status = status
  }

  public var accessibilitySummary: String {
    "\(title), \(subtitle), \(status.label)"
  }

  public static let ready = PreviewCardContent(
    title: "SwiftUI Preview",
    subtitle: "Package setup ready",
    status: .ready
  )

  public static let empty = PreviewCardContent(
    title: "Empty State",
    subtitle: "Preview without sample data",
    status: .empty
  )
}

public struct PreviewCard: View {
  public let content: PreviewCardContent

  public init(content: PreviewCardContent = .ready) {
    self.content = content
  }

  public var body: some View {
    VStack(alignment: .leading, spacing: 12) {
      HStack(spacing: 8) {
        Image(systemName: content.status.systemImage)
          .foregroundStyle(content.status.tint)
          .accessibilityHidden(true)

        Text(content.status.label)
          .font(.caption.weight(.semibold))
          .foregroundStyle(content.status.tint)
      }

      VStack(alignment: .leading, spacing: 4) {
        Text(content.title)
          .font(.headline)

        Text(content.subtitle)
          .font(.subheadline)
          .foregroundStyle(.secondary)
      }
    }
    .padding(20)
    .frame(maxWidth: 360, alignment: .leading)
    .background(.background)
    .clipShape(RoundedRectangle(cornerRadius: 8, style: .continuous))
    .overlay {
      RoundedRectangle(cornerRadius: 8, style: .continuous)
        .stroke(.secondary.opacity(0.2))
    }
    .accessibilityElement(children: .ignore)
    .accessibilityLabel(content.accessibilitySummary)
  }
}

private extension PreviewStatus {
  var systemImage: String {
    switch self {
    case .ready:
      "checkmark.circle.fill"
    case .empty:
      "tray"
    }
  }

  var tint: Color {
    switch self {
    case .ready:
      .green
    case .empty:
      .secondary
    }
  }
}

#Preview("Ready") {
  PreviewCard(content: .ready)
    .padding()
}

#Preview("Empty") {
  PreviewCard(content: .empty)
    .padding()
}
