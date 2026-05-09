// WDSBottomPopup.swift
// Chord Design System — Bottom Popup Molecule

import SwiftUI

// MARK: - Token Colors

private extension Color {
    static let wdsSurface       = Color.white
    static let wdsScrim         = Color.black.opacity(0.5)
    static let wdsLineDefault   = Color(white: 224/255.0) // #e0e0e0
    static let wdsBtnDefault    = Color(red: 0.0, green: 203/255.0, blue: 213/255.0) // #00cbd5
    static let wdsTextDefault   = Color.black
    static let wdsTextReverse   = Color.white
}

// MARK: - WDSBottomPopup

public struct WDSBottomPopup<Content: View>: View {

    @Binding var isPresented: Bool

    let title: String
    let showNavigation: Bool
    let showButtons: Bool
    let overflow: Bool
    let showCheckbox: Bool
    let checkboxLabel: String
    let confirmLabel: String
    let onConfirm: () -> Void
    let content: () -> Content

    @State private var isChecked = false
    @State private var dragOffset: CGFloat = 0

    public init(
        isPresented: Binding<Bool>,
        title: String = "Title",
        showNavigation: Bool = true,
        showButtons: Bool = true,
        overflow: Bool = false,
        showCheckbox: Bool = false,
        checkboxLabel: String = "텍스트를 입력해주세요",
        confirmLabel: String = "확인",
        onConfirm: @escaping () -> Void = {},
        @ViewBuilder content: @escaping () -> Content
    ) {
        self._isPresented = isPresented
        self.title = title
        self.showNavigation = showNavigation
        self.showButtons = showButtons
        self.overflow = overflow
        self.showCheckbox = showCheckbox
        self.checkboxLabel = checkboxLabel
        self.confirmLabel = confirmLabel
        self.onConfirm = onConfirm
        self.content = content
    }

    public var body: some View {
        ZStack(alignment: .bottom) {
            // Scrim
            if isPresented {
                Color.wdsScrim
                    .ignoresSafeArea()
                    .onTapGesture { dismiss() }
                    .transition(.opacity)
            }

            // Sheet
            if isPresented {
                sheetContent
                    .offset(y: max(0, dragOffset))
                    .gesture(
                        DragGesture()
                            .onChanged { v in dragOffset = v.translation.height }
                            .onEnded { v in
                                if v.translation.height > 80 { dismiss() }
                                else { withAnimation(.spring()) { dragOffset = 0 } }
                            }
                    )
                    .transition(.move(edge: .bottom))
            }
        }
        .animation(.spring(response: 0.35, dampingFraction: 0.8), value: isPresented)
        .ignoresSafeArea()
    }

    // MARK: Sheet

    private var sheetContent: some View {
        VStack(spacing: 0) {
            // Close Button row (Figma: TopNavigation 상단 별도 행)
            closeButtonRow

            // Navigation (타이틀만)
            if showNavigation {
                topNavigation
            }

            // Content area
            contentArea

            // Overlay buttons (sticky)
            if showButtons {
                overlayButtons
            }
        }
        .background(Color.wdsSurface)
        .clipShape(
            UnevenRoundedRectangle(
                topLeadingRadius: 16,
                bottomLeadingRadius: 0,
                bottomTrailingRadius: 0,
                topTrailingRadius: 16
            )
        )
        .frame(maxWidth: 410)
    }

    // MARK: Subviews

    private var handlebar: some View { EmptyView() } // handlebar는 외부 컨테이너에서 관리

    // Figma: Close Button은 TopNavigation 상단 별도 행 (40px, right-aligned)
    private var closeButtonRow: some View {
        HStack {
            Spacer()
            Button(action: dismiss) {
                Image(systemName: "xmark")
                    .font(.system(size: 13, weight: .medium))
                    .foregroundColor(.wdsTextDefault)
                    .frame(width: 40, height: 40)
                    .contentShape(Rectangle())
            }
            .buttonStyle(.plain)
            .accessibilityLabel("닫기")
        }
        .frame(height: 40)
    }

    // Figma: TopNavigation — 타이틀만, 닫기 버튼 없음
    private var topNavigation: some View {
        HStack(spacing: 8) {
            Text(title)
                .font(.system(size: 16, weight: .bold))
                .foregroundColor(.wdsTextDefault)
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(.leading, 8)
                .lineLimit(1)
        }
        .frame(height: 48)
        .padding(.horizontal, 8)
    }

    private var contentArea: some View {
        Group {
            if overflow {
                ScrollView(.vertical, showsIndicators: false) {
                    VStack(alignment: .leading, spacing: 16) {
                        content()
                    }
                    .padding(.horizontal, 16)
                    .padding(.bottom, 24)
                }
            } else {
                VStack(alignment: .leading, spacing: 16) {
                    content()
                }
                .padding(.horizontal, 16)
                .padding(.bottom, 24)
            }
        }
    }

    private var overlayButtons: some View {
        VStack(spacing: 8) {
            if overflow {
                // Gradient fade to indicate scrollable content above
                LinearGradient(
                    gradient: Gradient(colors: [Color.wdsSurface.opacity(0), Color.wdsSurface]),
                    startPoint: .top,
                    endPoint: .bottom
                )
                .frame(height: 24)
                .allowsHitTesting(false)
                .padding(.bottom, -8)
            }

            if showCheckbox {
                WDSCheckbox(
                    label: checkboxLabel,
                    type: .circle,
                    isChecked: $isChecked
                )
                .frame(maxWidth: .infinity, alignment: .leading)
            }

            // Confirm button — XLarge (52px), full-width
            Button(action: {
                onConfirm()
                dismiss()
            }) {
                Text(confirmLabel)
                    .font(.system(size: 17, weight: .bold))
                    .foregroundColor(.wdsTextReverse)
                    .frame(maxWidth: .infinity)
                    .frame(height: 52)
                    .background(Color.wdsBtnDefault)
                    .clipShape(RoundedRectangle(cornerRadius: 10))
            }
            .buttonStyle(.plain)
        }
        .padding(.horizontal, 16)
        .padding(.bottom, 16)
    }

    private func dismiss() {
        withAnimation(.spring(response: 0.3, dampingFraction: 0.9)) {
            dragOffset = 0
            isPresented = false
        }
    }
}

// MARK: - Preview

#if DEBUG
struct WDSBottomPopup_Previews: PreviewProvider {
    struct PreviewWrapper: View {
        @State var showA = false
        @State var showB = false
        @State var showC = false
        @State var text1 = ""
        @State var text2 = ""

        var body: some View {
            ZStack {
                Color(.systemGroupedBackground).ignoresSafeArea()
                VStack(spacing: 16) {
                    Button("Overflow O / Checkbox O") { showA = true }
                    Button("Overflow O / Checkbox X") { showB = true }
                    Button("showButtons=false") { showC = true }
                }
                .font(.system(size: 15, weight: .semibold))
                .foregroundColor(.blue)

                WDSBottomPopup(
                    isPresented: $showA,
                    title: "Title",
                    showNavigation: true,
                    showButtons: true,
                    overflow: true,
                    showCheckbox: true
                ) {
                    WDSTextField(title: "입력 필드", hintText: "입력해주세요", maxLength: 200,
                                 visibleTitle: true, visibleCounter: true, textFieldValue: $text1)
                    WDSTextField(title: "입력 필드", hintText: "입력해주세요", maxLength: 200,
                                 visibleTitle: true, visibleCounter: true, textFieldValue: $text2)
                }

                WDSBottomPopup(
                    isPresented: $showB,
                    title: "Title",
                    showNavigation: true,
                    showButtons: true,
                    overflow: true,
                    showCheckbox: false
                ) {
                    WDSTextField(title: "입력 필드", hintText: "입력해주세요", maxLength: 200,
                                 visibleTitle: true, visibleCounter: true, textFieldValue: $text1)
                    Text("추가 더미 콘텐츠").font(.system(size: 14)).foregroundColor(.secondary)
                }

                WDSBottomPopup(
                    isPresented: $showC,
                    title: "Title",
                    showNavigation: true,
                    showButtons: false
                ) {
                    Text("버튼 없는 컨텐츠입니다.").font(.system(size: 15))
                }
            }
        }
    }

    static var previews: some View {
        PreviewWrapper()
            .preferredColorScheme(.light)
    }
}
#endif
