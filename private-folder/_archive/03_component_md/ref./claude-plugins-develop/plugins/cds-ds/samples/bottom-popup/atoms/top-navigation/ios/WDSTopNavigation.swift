// WDSTopNavigation.swift
// Chord Design System — Top Navigation Atom

import SwiftUI

// MARK: - Enums

public enum WDSTopNavigationLeft {
    case none
    case back
    case custom
}

// MARK: - Token Colors

private extension Color {
    static let wdsTextDefault = Color.black
    static let wdsSurface     = Color.white
}

// MARK: - WDSTopNavigation

public struct WDSTopNavigation<LeftContent: View>: View {
    let title: String
    let showClose: Bool
    let leftType: WDSTopNavigationLeft
    let leftContent: () -> LeftContent
    let onClose: () -> Void
    let onBack: () -> Void

    public init(
        title: String,
        showClose: Bool = true,
        leftType: WDSTopNavigationLeft = .none,
        onClose: @escaping () -> Void = {},
        onBack: @escaping () -> Void = {},
        @ViewBuilder leftContent: @escaping () -> LeftContent = { EmptyView() as! LeftContent }
    ) {
        self.title = title
        self.showClose = showClose
        self.leftType = leftType
        self.onClose = onClose
        self.onBack = onBack
        self.leftContent = leftContent
    }

    public var body: some View {
        HStack(spacing: 0) {
            // Left slot — 공간 유지로 타이틀 중앙 정렬 방지 (Figma: 타이틀 좌측 정렬)
            Group {
                switch leftType {
                case .none:
                    Color.clear
                        .frame(width: 40, height: 40)
                case .back:
                    Button(action: onBack) {
                        Image(systemName: "chevron.left")
                            .font(.system(size: 16, weight: .medium))
                            .foregroundColor(.wdsTextDefault)
                            .frame(width: 40, height: 40)
                    }
                    .buttonStyle(.plain)
                case .custom:
                    leftContent()
                        .frame(width: 40, height: 40)
                }
            }

            // Title — 좌측 정렬
            Text(title)
                .font(.system(size: 16, weight: .bold))
                .foregroundColor(.wdsTextDefault)
                .lineLimit(1)
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(.horizontal, 4)

            // Close button
            if showClose {
                Button(action: onClose) {
                    Image(systemName: "xmark")
                        .font(.system(size: 13, weight: .medium))
                        .foregroundColor(.wdsTextDefault)
                        .frame(width: 40, height: 40)
                }
                .buttonStyle(.plain)
                .accessibilityLabel("닫기")
            } else {
                Color.clear
                    .frame(width: 40, height: 40)
            }
        }
        .frame(height: 48)
        .padding(.horizontal, 4)
        .background(Color.wdsSurface)
    }
}

// MARK: - Convenience (no custom left)

public extension WDSTopNavigation where LeftContent == EmptyView {
    init(
        title: String,
        showClose: Bool = true,
        leftType: WDSTopNavigationLeft = .none,
        onClose: @escaping () -> Void = {},
        onBack: @escaping () -> Void = {}
    ) {
        self.title = title
        self.showClose = showClose
        self.leftType = leftType
        self.onClose = onClose
        self.onBack = onBack
        self.leftContent = { EmptyView() }
    }
}

// MARK: - Preview

#if DEBUG
struct WDSTopNavigation_Previews: PreviewProvider {
    static var previews: some View {
        VStack(spacing: 0) {
            Divider()
            Text("Default — title + close").font(.caption).foregroundColor(.secondary).frame(maxWidth: .infinity, alignment: .leading).padding(.horizontal, 16).padding(.top, 12)
            WDSTopNavigation(title: "Title", showClose: true)
            Divider()

            Text("Back + title + close").font(.caption).foregroundColor(.secondary).frame(maxWidth: .infinity, alignment: .leading).padding(.horizontal, 16).padding(.top, 12)
            WDSTopNavigation(title: "Title", showClose: true, leftType: .back)
            Divider()

            Text("showClose=false").font(.caption).foregroundColor(.secondary).frame(maxWidth: .infinity, alignment: .leading).padding(.horizontal, 16).padding(.top, 12)
            WDSTopNavigation(title: "Title", showClose: false)
            Divider()
        }
    }
}
#endif
