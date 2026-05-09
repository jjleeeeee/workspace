// WDSBottomPopup.kt
// Chord Design System — Bottom Popup Molecule

package com.weverse.ds.component

import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.detectVerticalDragGestures
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Shape
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties

// ── Token Colors ──────────────────────────────────────────────────────────────
private val WdsColorSurface     = Color(0xFFFFFFFF)
private val WdsColorScrim       = Color(0x80000000) // rgba(0,0,0,0.5)
private val WdsColorLineDefault = Color(0xFFE0E0E0)
private val WdsColorBtnDefault  = Color(0xFF00CBD5)
private val WdsColorTextDefault = Color(0xFF000000)
private val WdsColorTextReverse = Color(0xFFFFFFFF)

// ── Bottom Sheet Shape ────────────────────────────────────────────────────────
private val BottomSheetShape = RoundedCornerShape(topStart = 16.dp, topEnd = 16.dp)

// ── WDSBottomPopup ────────────────────────────────────────────────────────────
@Composable
fun WDSBottomPopup(
    isVisible: Boolean,
    onDismiss: () -> Unit,
    title: String = "Title",
    showNavigation: Boolean = true,
    showButtons: Boolean = true,
    overflow: Boolean = false,
    showCheckbox: Boolean = false,
    checkboxLabel: String = "텍스트를 입력해주세요",
    confirmLabel: String = "확인",
    onConfirm: () -> Unit = {},
    content: @Composable ColumnScope.() -> Unit
) {
    var isChecked by remember { mutableStateOf(false) }

    AnimatedVisibility(
        visible = isVisible,
        enter = slideInVertically(initialOffsetY = { it }) + fadeIn(),
        exit = slideOutVertically(targetOffsetY = { it }) + fadeOut()
    ) {
        Box(
            modifier = Modifier.fillMaxSize(),
            contentAlignment = Alignment.BottomCenter
        ) {
            // Scrim
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(WdsColorScrim)
                    .clickable(
                        interactionSource = remember { MutableInteractionSource() },
                        indication = null,
                        onClick = onDismiss
                    )
                    .semantics { contentDescription = "팝업 닫기" }
            )

            // Sheet
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .widthIn(max = 410.dp)
                    .clip(BottomSheetShape)
                    .background(WdsColorSurface, BottomSheetShape)
                    .pointerInput(Unit) {
                        detectVerticalDragGestures(
                            onDragEnd = {},
                            onVerticalDrag = { _, dragAmount ->
                                if (dragAmount > 80f) onDismiss()
                            }
                        )
                    }
            ) {
                    // Close Button row (Figma: TopNavigation 상단 별도 행, right-aligned)
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(40.dp),
                    horizontalArrangement = Arrangement.End,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .size(40.dp)
                            .clickable(
                                interactionSource = remember { MutableInteractionSource() },
                                indication = null,
                                onClick = onDismiss
                            )
                            .semantics { contentDescription = "닫기" },
                        contentAlignment = Alignment.Center
                    ) {
                        Text("×", fontSize = 22.sp, color = WdsColorTextDefault, fontWeight = FontWeight.Light)
                    }
                }

                // Navigation (타이틀만, 닫기 버튼 없음)
                if (showNavigation) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(48.dp)
                            .padding(horizontal = 8.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = title,
                            modifier = Modifier
                                .weight(1f)
                                .padding(start = 8.dp),
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold,
                            color = WdsColorTextDefault,
                            maxLines = 1
                        )
                    }
                }

                // Content area
                if (overflow) {
                    Column(
                        modifier = Modifier
                            .weight(1f, fill = false)
                            .verticalScroll(rememberScrollState())
                            .padding(horizontal = 16.dp)
                            .padding(bottom = 24.dp),
                        verticalArrangement = Arrangement.spacedBy(16.dp),
                        content = content
                    )
                } else {
                    Column(
                        modifier = Modifier
                            .padding(horizontal = 16.dp)
                            .padding(bottom = 24.dp),
                        verticalArrangement = Arrangement.spacedBy(16.dp),
                        content = content
                    )
                }

                // Overlay buttons (sticky)
                if (showButtons) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 16.dp)
                            .padding(bottom = 16.dp),
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        if (overflow) {
                            // Gradient fade
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(24.dp)
                                    .background(
                                        Brush.verticalGradient(
                                            listOf(Color.Transparent, WdsColorSurface)
                                        )
                                    )
                            )
                        }

                        if (showCheckbox) {
                            WDSCheckbox(
                                label = checkboxLabel,
                                type = WDSCheckboxType.Circle,
                                checked = isChecked,
                                onCheckedChange = { isChecked = it }
                            )
                        }

                        // Confirm button — XLarge (52dp), full-width
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(52.dp)
                                .clip(RoundedCornerShape(10.dp))
                                .background(WdsColorBtnDefault)
                                .clickable(
                                    interactionSource = remember { MutableInteractionSource() },
                                    indication = null
                                ) {
                                    onConfirm()
                                    onDismiss()
                                },
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = confirmLabel,
                                fontSize = 17.sp,
                                fontWeight = FontWeight.Bold,
                                color = WdsColorTextReverse
                            )
                        }
                    }
                }
            }
        }
    }
}

// ── Usage Example ─────────────────────────────────────────────────────────────
/*
// In your composable:
var showPopup by remember { mutableStateOf(false) }
var text1 by remember { mutableStateOf("") }
var text2 by remember { mutableStateOf("") }

Button(onClick = { showPopup = true }) { Text("바텀 팝업 열기") }

WDSBottomPopup(
    isVisible = showPopup,
    onDismiss = { showPopup = false },
    title = "Title",
    showNavigation = true,
    showButtons = true,
    overflow = true,
    showCheckbox = true
) {
    WDSTextField(
        title = "입력 필드",
        maxLength = 200,
        visibleTitle = true,
        visibleCounter = true,
        textFieldValue = text1,
        onTextChanged = { text1 = it }
    )
    WDSTextField(
        title = "입력 필드",
        maxLength = 200,
        visibleTitle = true,
        visibleCounter = true,
        textFieldValue = text2,
        onTextChanged = { text2 = it }
    )
}
*/
