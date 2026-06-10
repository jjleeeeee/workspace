// WDSCheckbox.swift
// Chord Design System — Checkbox Atom

import SwiftUI

// MARK: - Enums

public enum WDSCheckboxType {
    case circle
    case square
}

// MARK: - Token Colors

private extension Color {
    static let wdsLineDefault  = Color(white: 224/255.0)  // #e0e0e0
    static let wdsBtnDefault   = Color(red: 0.0, green: 203/255.0, blue: 213/255.0) // #00cbd5
    static let wdsTextSub      = Color.black.opacity(0.5)
    static let wdsTextReverse  = Color.white
}

// MARK: - WDSCheckbox

public struct WDSCheckbox: View {
    let label: String
    let type: WDSCheckboxType
    let enabled: Bool

    @Binding var isChecked: Bool

    public init(
        label: String = "텍스트를 입력해주세요",
        type: WDSCheckboxType = .circle,
        enabled: Bool = true,
        isChecked: Binding<Bool>
    ) {
        self.label = label
        self.type = type
        self.enabled = enabled
        self._isChecked = isChecked
    }

    private var cornerRadius: CGFloat {
        type == .circle ? 999 : 4
    }

    public var body: some View {
        Button(action: {
            guard enabled else { return }
            isChecked.toggle()
        }) {
            HStack(spacing: 8) {
                // Checkbox indicator
                ZStack {
                    RoundedRectangle(cornerRadius: cornerRadius)
                        .strokeBorder(
                            isChecked ? Color.wdsBtnDefault : Color.wdsLineDefault,
                            lineWidth: 1.5
                        )
                        .background(
                            RoundedRectangle(cornerRadius: cornerRadius)
                                .fill(isChecked ? Color.wdsBtnDefault : Color.clear)
                        )
                        .frame(width: 24, height: 24)

                    if isChecked {
                        Image(systemName: "checkmark")
                            .font(.system(size: 11, weight: .bold))
                            .foregroundColor(.wdsTextReverse)
                    }
                }

                Text(label)
                    .font(.system(size: 15, weight: .regular))
                    .foregroundColor(.wdsTextSub)
                    .multilineTextAlignment(.leading)
            }
        }
        .buttonStyle(.plain)
        .opacity(enabled ? 1 : 0.38)
        .disabled(!enabled)
        .accessibilityLabel(label)
        .accessibilityAddTraits(.isButton)
        .accessibilityValue(isChecked ? "선택됨" : "선택 안 됨")
    }
}

// MARK: - Preview

#if DEBUG
struct WDSCheckbox_Previews: PreviewProvider {
    struct PreviewWrapper: View {
        @State var checked1 = false
        @State var checked2 = true
        @State var checked3 = false
        @State var checked4 = true

        var body: some View {
            VStack(alignment: .leading, spacing: 20) {
                Group {
                    Text("Circle — unchecked / checked").font(.caption).foregroundColor(.secondary)
                    WDSCheckbox(label: "텍스트를 입력해주세요", type: .circle, isChecked: $checked1)
                    WDSCheckbox(label: "텍스트를 입력해주세요", type: .circle, isChecked: $checked2)
                }
                Group {
                    Text("Square — unchecked / checked").font(.caption).foregroundColor(.secondary)
                    WDSCheckbox(label: "텍스트를 입력해주세요", type: .square, isChecked: $checked3)
                    WDSCheckbox(label: "텍스트를 입력해주세요", type: .square, isChecked: $checked4)
                }
                Group {
                    Text("Disabled").font(.caption).foregroundColor(.secondary)
                    WDSCheckbox(label: "비활성화 상태", type: .circle, enabled: false, isChecked: .constant(false))
                }
            }
            .padding()
        }
    }

    static var previews: some View {
        PreviewWrapper()
    }
}
#endif
