// WDSTextField.kt
// Chord Design System — Text Field Atom

package com.weverse.ds.component

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsFocusedAsState
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

// ── Token Colors ──────────────────────────────────────────────────────────────
private val WdsColorLineDefault  = Color(0xFFE0E0E0)
private val WdsColorBtnDefault   = Color(0xFF00CBD5)
private val WdsColorTextDefault  = Color(0xFF000000)
private val WdsColorTextHint     = Color(0x4D000000) // rgba(0,0,0,0.3)
private val WdsColorTextSub      = Color(0x80000000) // rgba(0,0,0,0.5)
private val WdsColorError        = Color(0xFFF44336)
private val WdsColorSurface      = Color(0xFFFFFFFF)

// ── WDSTextField ──────────────────────────────────────────────────────────────
@Composable
fun WDSTextField(
    modifier: Modifier = Modifier,
    title: String = "입력 필드",
    hintText: String = "",
    guideMessage: String = "Guide Message",
    maxLength: Int = 200,
    visibleTitle: Boolean = true,
    visibleCounter: Boolean = false,
    visibleBottomMessage: Boolean = false,
    required: Boolean = false,
    enabled: Boolean = true,
    maxLines: Int = 1,
    textFieldValue: String,
    onTextChanged: (String) -> Unit,
    onClearText: () -> Unit = {}
) {
    val interactionSource = remember { MutableInteractionSource() }
    val isFocused by interactionSource.collectIsFocusedAsState()
    val isOverLimit = textFieldValue.length > maxLength

    val borderColor = when {
        isOverLimit -> WdsColorError
        isFocused   -> WdsColorBtnDefault
        else        -> WdsColorLineDefault
    }

    Column(
        modifier = modifier.alpha(if (enabled) 1f else 0.38f),
        verticalArrangement = Arrangement.spacedBy(4.dp)
    ) {
        // Title row — counter를 우측에 배치 (Figma 명세)
        if (visibleTitle || visibleCounter) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    horizontalArrangement = Arrangement.spacedBy(2.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    if (visibleTitle) {
                        Text(
                            text = title,
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Medium,
                            color = WdsColorTextDefault
                        )
                        if (required) {
                            Text(
                                text = "*",
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Medium,
                                color = WdsColorError
                            )
                        }
                    }
                }
                if (visibleCounter) {
                    Text(
                        text = "${textFieldValue.length}/$maxLength",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Normal,
                        color = if (isOverLimit) WdsColorError else WdsColorTextSub
                    )
                }
            }
        }

        // Input row
        BasicTextField(
            value = textFieldValue,
            onValueChange = { newVal ->
                if (newVal.length <= maxLength) onTextChanged(newVal)
            },
            enabled = enabled,
            maxLines = maxLines,
            textStyle = TextStyle(
                fontSize = 15.sp,
                fontWeight = FontWeight.Normal,
                color = WdsColorTextDefault
            ),
            cursorBrush = SolidColor(WdsColorBtnDefault),
            interactionSource = interactionSource,
            keyboardOptions = KeyboardOptions(imeAction = if (maxLines == 1) ImeAction.Done else ImeAction.Default),
            decorationBox = { innerTextField ->
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(48.dp)
                        .clip(RoundedCornerShape(8.dp))
                        .background(WdsColorSurface)
                        .border(1.dp, borderColor, RoundedCornerShape(8.dp))
                        .padding(horizontal = 12.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Box(modifier = Modifier.weight(1f)) {
                        if (textFieldValue.isEmpty()) {
                            Text(
                                text = hintText,
                                fontSize = 15.sp,
                                fontWeight = FontWeight.Normal,
                                color = WdsColorTextHint
                            )
                        }
                        innerTextField()
                    }

                    if (textFieldValue.isNotEmpty() && enabled) {
                        IconButton(
                            onClick = {
                                onTextChanged("")
                                onClearText()
                            },
                            modifier = Modifier.size(20.dp)
                        ) {
                            Box(
                                contentAlignment = Alignment.Center,
                                modifier = Modifier
                                    .size(20.dp)
                                    .clip(RoundedCornerShape(50))
                                    .background(Color.Black.copy(alpha = 0.15f))
                            ) {
                                Text(
                                    text = "×",
                                    fontSize = 14.sp,
                                    color = WdsColorTextDefault,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }
                    }
                }
            },
            modifier = Modifier.fillMaxWidth()
        )

        // Footer row — guide/error 메시지만 (counter는 title row에)
        if (visibleBottomMessage) {
            Text(
                text = guideMessage,
                fontSize = 11.sp,
                fontWeight = FontWeight.Normal,
                color = if (isOverLimit) WdsColorError else WdsColorTextSub,
                modifier = Modifier.fillMaxWidth()
            )
        }
    }
}
