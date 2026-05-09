// WDSTextField.swift
// Chord Design System — Text Field Atom

import SwiftUI

// MARK: - Token Colors

private extension Color {
    static let wdsLineDefault      = Color(white: 224/255.0)  // #e0e0e0
    static let wdsBtnDefault       = Color(red: 0.0, green: 203/255.0, blue: 213/255.0) // #00cbd5
    static let wdsTextDefault      = Color.black
    static let wdsTextHint         = Color.black.opacity(0.3)
    static let wdsTextSub          = Color.black.opacity(0.5)
    static let wdsError            = Color(red: 244/255.0, green: 67/255.0, blue: 54/255.0)
    static let wdsSurface          = Color.white
}

// MARK: - WDSTextField

public struct WDSTextField: View {

    let title: String
    let hintText: String
    let guideMessage: String
    let maxLength: Int
    let visibleTitle: Bool
    let visibleCounter: Bool
    let visibleBottomMessage: Bool
    let required: Bool
    let enabled: Bool
    let maxLines: Int

    @Binding var textFieldValue: String
    let onClearText: () -> Void

    @FocusState private var isFocused: Bool

    private var isOverLimit: Bool { textFieldValue.count > maxLength }

    public init(
        title: String = "입력 필드",
        hintText: String = "",
        guideMessage: String = "Guide Message",
        maxLength: Int = 200,
        visibleTitle: Bool = true,
        visibleCounter: Bool = false,
        visibleBottomMessage: Bool = false,
        required: Bool = false,
        enabled: Bool = true,
        maxLines: Int = 1,
        textFieldValue: Binding<String>,
        onClearText: @escaping () -> Void = {}
    ) {
        self.title = title
        self.hintText = hintText
        self.guideMessage = guideMessage
        self.maxLength = maxLength
        self.visibleTitle = visibleTitle
        self.visibleCounter = visibleCounter
        self.visibleBottomMessage = visibleBottomMessage
        self.required = required
        self.enabled = enabled
        self.maxLines = maxLines
        self._textFieldValue = textFieldValue
        self.onClearText = onClearText
    }

    public var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            // Title row — counter를 우측에 배치 (Figma 명세)
            if visibleTitle || visibleCounter {
                HStack {
                    if visibleTitle {
                        HStack(spacing: 2) {
                            Text(title)
                                .font(.system(size: 13, weight: .medium))
                                .foregroundColor(.wdsTextDefault)
                            if required {
                                Text("*")
                                    .font(.system(size: 13, weight: .medium))
                                    .foregroundColor(.wdsError)
                            }
                        }
                    }
                    Spacer()
                    if visibleCounter {
                        Text("\(textFieldValue.count)/\(maxLength)")
                            .font(.system(size: 11, weight: .regular))
                            .foregroundColor(isOverLimit ? .wdsError : .wdsTextSub)
                    }
                }
            }

            // Input row
            HStack(spacing: 8) {
                TextField(hintText, text: $textFieldValue, axis: maxLines > 1 ? .vertical : .horizontal)
                    .font(.system(size: 15, weight: .regular))
                    .foregroundColor(.wdsTextDefault)
                    .lineLimit(maxLines)
                    .focused($isFocused)
                    .disabled(!enabled)
                    .onChange(of: textFieldValue) { newVal in
                        if newVal.count > maxLength {
                            textFieldValue = String(newVal.prefix(maxLength))
                        }
                    }

                if !textFieldValue.isEmpty && enabled {
                    Button(action: {
                        textFieldValue = ""
                        onClearText()
                    }) {
                        ZStack {
                            Circle()
                                .fill(Color.black.opacity(0.15))
                                .frame(width: 20, height: 20)
                            Image(systemName: "xmark")
                                .font(.system(size: 9, weight: .bold))
                                .foregroundColor(.wdsTextDefault)
                        }
                    }
                    .buttonStyle(.plain)
                }
            }
            .padding(.horizontal, 12)
            .frame(height: 48)
            .background(.wdsSurface)
            .overlay(
                RoundedRectangle(cornerRadius: 8)
                    .strokeBorder(
                        isFocused ? Color.wdsBtnDefault : Color.wdsLineDefault,
                        lineWidth: 1
                    )
            )
            .clipShape(RoundedRectangle(cornerRadius: 8))
            .opacity(enabled ? 1 : 0.38)

            // Footer row — guide/error 메시지만 (counter는 title row에)
            if visibleBottomMessage {
                Text(guideMessage)
                    .font(.system(size: 11, weight: .regular))
                    .foregroundColor(isOverLimit ? .wdsError : .wdsTextSub)
                    .frame(maxWidth: .infinity, alignment: .leading)
            }
        }
    }
}

// MARK: - Preview

#if DEBUG
struct WDSTextField_Previews: PreviewProvider {
    struct PreviewWrapper: View {
        @State var text1 = ""
        @State var text2 = ""
        @State var text3 = "입력된 텍스트"

        var body: some View {
            ScrollView {
                VStack(spacing: 20) {
                    Group {
                        Text("Default — title + counter").font(.caption).foregroundColor(.secondary)
                        WDSTextField(
                            title: "입력 필드",
                            hintText: "입력해주세요",
                            maxLength: 200,
                            visibleTitle: true,
                            visibleCounter: true,
                            textFieldValue: $text1
                        )
                    }
                    Group {
                        Text("Required + guide message").font(.caption).foregroundColor(.secondary)
                        WDSTextField(
                            title: "입력 필드",
                            hintText: "입력해주세요",
                            guideMessage: "필수 입력 항목입니다",
                            maxLength: 200,
                            visibleTitle: true,
                            visibleBottomMessage: true,
                            required: true,
                            textFieldValue: $text2
                        )
                    }
                    Group {
                        Text("With text + clear button").font(.caption).foregroundColor(.secondary)
                        WDSTextField(
                            title: "입력 필드",
                            maxLength: 200,
                            visibleTitle: true,
                            visibleCounter: true,
                            textFieldValue: $text3,
                            onClearText: { text3 = "" }
                        )
                    }
                    Group {
                        Text("Disabled").font(.caption).foregroundColor(.secondary)
                        WDSTextField(
                            title: "입력 필드",
                            hintText: "비활성화",
                            enabled: false,
                            textFieldValue: .constant("")
                        )
                    }
                }
                .padding()
            }
        }
    }

    static var previews: some View {
        PreviewWrapper()
    }
}
#endif
