// WDSTextButton.swift
// Chord Design System — Text Button
// Spec: 576 variants · Mode × Type × Size × Color × Status × Radius

import SwiftUI

// MARK: - Enums

public enum WDSTextButtonType {
    case filled
    case outlinedColor
    case outlinedGray
    case ghost
}

public enum WDSTextButtonSize: CaseIterable {
    case xlarge, large, medium, small, xsmall, xxsmall

    var height: CGFloat {
        switch self {
        case .xlarge:  52
        case .large:   44
        case .medium:  40
        case .small:   36
        case .xsmall:  32
        case .xxsmall: 24
        }
    }

    var horizontalPadding: CGFloat {
        switch self {
        case .xlarge:  24
        case .large:   20
        case .medium:  16
        case .small:   12
        case .xsmall, .xxsmall: 8
        }
    }

    var iconSize: CGFloat {
        switch self {
        case .xlarge:          20
        case .large, .medium:  16
        case .small, .xsmall:  12
        case .xxsmall:         10
        }
    }

    var fontSize: CGFloat {
        switch self {
        case .xlarge, .large: 17
        case .medium:         15
        case .small, .xsmall: 13
        case .xxsmall:        11
        }
    }
}

public enum WDSTextButtonStatus {
    case `default`, hover, loading, disabled
}

public enum WDSTextButtonColor {
    case `default`, black
}

public enum WDSTextButtonMode {
    case `default`, fixed
}

public enum WDSTextButtonTrailingMode {
    case icon, text
}

// MARK: - Token Colors

private extension Color {
    static let wdsBtnDefault      = Color(red: 0.0,    green: 203/255.0, blue: 213/255.0) // #00cbd5
    static let wdsBtnBlack        = Color.black
    static let wdsBtnOutlinedGray = Color(white: 222/255.0) // #dedede
    static let wdsTextReverse     = Color.white
    static let wdsTextDefault     = Color.black
    static let wdsTextGray700     = Color(white: 72/255.0) // #484848
}

// MARK: - WDSTextButton

public struct WDSTextButton<LeadingIcon: View, TrailingIcon: View>: View {

    // Props
    let label: String
    let type: WDSTextButtonType
    let size: WDSTextButtonSize
    let buttonColor: WDSTextButtonColor
    let status: WDSTextButtonStatus
    let radius: Bool
    let mode: WDSTextButtonMode
    let showLeading: Bool
    let showTrailing: Bool
    let trailingMode: WDSTextButtonTrailingMode
    let trailingText: String?
    let leadingIcon: () -> LeadingIcon
    let trailingIcon: () -> TrailingIcon
    let action: () -> Void

    // MARK: Derived tokens

    private var backgroundColor: Color {
        switch type {
        case .filled:
            return buttonColor == .black ? .wdsBtnBlack : .wdsBtnDefault
        case .outlinedColor, .outlinedGray, .ghost:
            return .clear
        }
    }

    private var labelColor: Color {
        switch type {
        case .filled:
            return .wdsTextReverse
        case .outlinedColor:
            return buttonColor == .black ? .wdsBtnBlack : .wdsBtnDefault
        case .outlinedGray:
            return .wdsTextDefault
        case .ghost:
            return .wdsTextGray700
        }
    }

    private var strokeColor: Color? {
        switch type {
        case .filled, .ghost:
            return nil
        case .outlinedColor:
            return buttonColor == .black ? .wdsBtnBlack : .wdsBtnDefault
        case .outlinedGray:
            return .wdsBtnOutlinedGray
        }
    }

    private var cornerRadius: CGFloat {
        radius ? 999 : 10
    }

    private var fontWeight: Font.Weight {
        type == .ghost ? .medium : .bold
    }

    private var isDisabled: Bool { status == .disabled }

    // MARK: Body

    public var body: some View {
        Button(action: action) {
            HStack(spacing: 4) {
                if showLeading {
                    leadingIcon()
                        .frame(width: size.iconSize, height: size.iconSize)
                        .foregroundColor(labelColor)
                }

                // ZStack preserves label width during loading (spec: width가 흔들리지 않도록 유지)
                ZStack {
                    Text(label)
                        .font(.system(size: size.fontSize, weight: fontWeight))
                        .lineLimit(1)
                        .opacity(status == .loading ? 0 : 1)
                    if status == .loading {
                        WDSLoadingDots(color: labelColor, dotSize: max(4, size.iconSize * 0.3))
                    }
                }

                if showTrailing {
                    if trailingMode == .text, let tText = trailingText {
                        Text(tText)
                            .font(.system(size: size.fontSize, weight: fontWeight))
                    } else {
                        trailingIcon()
                            .frame(width: size.iconSize, height: size.iconSize)
                            .foregroundColor(labelColor)
                    }
                }
            }
            .foregroundColor(labelColor)
            .padding(.horizontal, size.horizontalPadding)
            .frame(height: size.height)
            .background(backgroundColor)
            .overlay(
                RoundedRectangle(cornerRadius: cornerRadius)
                    .strokeBorder(strokeColor ?? .clear, lineWidth: strokeColor != nil ? 1.5 : 0)
            )
            .clipShape(RoundedRectangle(cornerRadius: cornerRadius))
        }
        .disabled(isDisabled)
        .opacity(isDisabled ? 0.38 : 1.0)
        .accessibilityLabel(label)
        .accessibilityAddTraits(.isButton)
        .accessibilityValue(status == .loading ? "로딩 중" : "")
        .accessibilityHint(isDisabled ? "비활성화됨" : "")
    }
}

// MARK: - Convenience initialisers (no icons)

public extension WDSTextButton where LeadingIcon == EmptyView, TrailingIcon == EmptyView {
    init(
        _ label: String,
        type: WDSTextButtonType = .filled,
        size: WDSTextButtonSize = .medium,
        buttonColor: WDSTextButtonColor = .default,
        status: WDSTextButtonStatus = .default,
        radius: Bool = false,
        mode: WDSTextButtonMode = .default,
        action: @escaping () -> Void = {}
    ) {
        self.label = label
        self.type = type
        self.size = size
        self.buttonColor = buttonColor
        self.status = status
        self.radius = radius
        self.mode = mode
        self.showLeading = false
        self.showTrailing = false
        self.trailingMode = .icon
        self.trailingText = nil
        self.leadingIcon = { EmptyView() }
        self.trailingIcon = { EmptyView() }
        self.action = action
    }
}

// MARK: - Loading Dots

struct WDSLoadingDots: View {
    let color: Color
    let dotSize: CGFloat

    @State private var animate = false

    var body: some View {
        HStack(spacing: 3) {
            ForEach(0..<3, id: \.self) { i in
                Circle()
                    .fill(color)
                    .frame(width: dotSize, height: dotSize)
                    .offset(y: animate ? -4 : 0)
                    .opacity(animate ? 1 : 0.55)
                    .animation(
                        .easeInOut(duration: 0.4)
                            .repeatForever()
                            .delay(Double(i) * 0.18),
                        value: animate
                    )
            }
        }
        .onAppear { animate = true }
    }
}

// MARK: - Preview

#if DEBUG
struct WDSTextButton_Previews: PreviewProvider {
    static var previews: some View {
        ScrollView {
            VStack(spacing: 16) {
                // Core Variants
                Group {
                    Text("Filled · Default Color").font(.caption).foregroundColor(.secondary)
                    HStack(spacing: 8) {
                        WDSTextButton("Text", type: .filled, size: .xlarge)
                        WDSTextButton("Text", type: .filled, size: .medium)
                        WDSTextButton("Text", type: .filled, size: .xxsmall)
                    }
                }
                Group {
                    Text("Types · XLarge/off").font(.caption).foregroundColor(.secondary)
                    HStack(spacing: 8) {
                        WDSTextButton("Text", type: .filled,       size: .xlarge)
                        WDSTextButton("Text", type: .outlinedColor, size: .xlarge)
                        WDSTextButton("Text", type: .outlinedGray,  size: .xlarge)
                        WDSTextButton("Text", type: .ghost,         size: .xlarge)
                    }
                }
                Group {
                    Text("Radius On · Small").font(.caption).foregroundColor(.secondary)
                    HStack(spacing: 8) {
                        WDSTextButton("Text", type: .filled,       size: .small, radius: true)
                        WDSTextButton("Text", type: .outlinedColor, size: .small, radius: true)
                        WDSTextButton("Text", type: .outlinedGray,  size: .small, radius: true)
                        WDSTextButton("Text", type: .ghost,         size: .small, radius: true)
                    }
                }
                Group {
                    Text("Loading · Medium").font(.caption).foregroundColor(.secondary)
                    WDSTextButton("Text", type: .filled, size: .medium, status: .loading)
                }
                Group {
                    Text("Disabled · Medium").font(.caption).foregroundColor(.secondary)
                    HStack(spacing: 8) {
                        WDSTextButton("Text", type: .filled,       size: .medium, status: .disabled)
                        WDSTextButton("Text", type: .outlinedColor, size: .medium, status: .disabled)
                        WDSTextButton("Text", type: .outlinedGray,  size: .medium, status: .disabled)
                        WDSTextButton("Text", type: .ghost,         size: .medium, status: .disabled)
                    }
                }
                Group {
                    Text("Black Color").font(.caption).foregroundColor(.secondary)
                    HStack(spacing: 8) {
                        WDSTextButton("Text", type: .filled,       size: .xlarge, buttonColor: .black)
                        WDSTextButton("Text", type: .outlinedColor, size: .xlarge, buttonColor: .black)
                    }
                }
            }
            .padding()
        }
    }
}
#endif
