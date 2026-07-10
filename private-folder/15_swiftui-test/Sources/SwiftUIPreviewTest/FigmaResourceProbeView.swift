import SwiftUI

public struct FigmaResourceProbeView: View {
  public let resourceName: String

  public init(resourceName: String = "figma-test-swiftui-hero") {
    self.resourceName = resourceName
  }

  public var body: some View {
    ScrollView {
      VStack(alignment: .leading, spacing: 16) {
        Text("Resource Probe")
          .font(.title2.bold())

        FigmaResourceImage(name: resourceName)
          .frame(width: 260, height: 260)
          .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
          .overlay {
            RoundedRectangle(cornerRadius: 16, style: .continuous)
              .stroke(.secondary.opacity(0.3))
          }

        VStack(alignment: .leading, spacing: 8) {
          ForEach(FigmaResourceLookup.diagnostics(named: resourceName), id: \.self) { row in
            Text(row)
              .font(.caption.monospaced())
              .foregroundStyle(row.contains("MISS") ? .red : .primary)
          }
        }
      }
      .padding(24)
      .frame(maxWidth: .infinity, alignment: .leading)
    }
  }
}
