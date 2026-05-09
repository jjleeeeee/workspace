// WDSButton.kt
// Chord Design System — Text Button
// Spec: 576 variants · Mode × Type × Size × Color × Status × Radius

package com.weverse.ds.component

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Shape
import androidx.compose.ui.semantics.*
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

// ── Token Colors ─────────────────────────────────────────────────────────────
private val WdsColorBtnDefault     = Color(0xFF00CBD5)
private val WdsColorBtnBlack       = Color(0xFF000000)
private val WdsColorBtnOutlinedGray = Color(0xFFDEDEDE)
private val WdsColorTextReverse    = Color(0xFFFFFFFF)
private val WdsColorTextDefault    = Color(0xFF000000)
private val WdsColorTextGray700    = Color(0xFF484848)

// ── Enums ─────────────────────────────────────────────────────────────────────
enum class WDSButtonType { Filled, OutlinedColor, OutlinedGray, Ghost }
enum class WDSButtonSize { XLarge, Large, Medium, Small, XSmall, XXSmall }
enum class WDSButtonColor { Default, Black }
enum class WDSButtonStatus { Default, Hover, Loading, Disabled }
enum class WDSButtonRadius { Off, On }
enum class WDSButtonMode { Default, Fixed }
enum class WDSButtonTrailingMode { Icon, Text }

// ── Size Tokens ───────────────────────────────────────────────────────────────
private val WDSButtonSize.height: Dp get() = when (this) {
    WDSButtonSize.XLarge  -> 52.dp
    WDSButtonSize.Large   -> 44.dp
    WDSButtonSize.Medium  -> 40.dp
    WDSButtonSize.Small   -> 36.dp
    WDSButtonSize.XSmall  -> 32.dp
    WDSButtonSize.XXSmall -> 24.dp
}

private val WDSButtonSize.horizontalPadding: Dp get() = when (this) {
    WDSButtonSize.XLarge  -> 24.dp
    WDSButtonSize.Large   -> 20.dp
    WDSButtonSize.Medium  -> 16.dp
    WDSButtonSize.Small   -> 12.dp
    WDSButtonSize.XSmall, WDSButtonSize.XXSmall -> 8.dp
}

private val WDSButtonSize.iconSize: Dp get() = when (this) {
    WDSButtonSize.XLarge             -> 20.dp
    WDSButtonSize.Large,
    WDSButtonSize.Medium             -> 16.dp
    WDSButtonSize.Small,
    WDSButtonSize.XSmall             -> 12.dp
    WDSButtonSize.XXSmall            -> 10.dp
}

private val WDSButtonSize.fontSize: TextUnit get() = when (this) {
    WDSButtonSize.XLarge,
    WDSButtonSize.Large   -> 17.sp
    WDSButtonSize.Medium  -> 15.sp
    WDSButtonSize.Small,
    WDSButtonSize.XSmall  -> 13.sp
    WDSButtonSize.XXSmall -> 11.sp
}

// ── WDSButton ─────────────────────────────────────────────────────────────────
@Composable
fun WDSButton(
    text: String,
    modifier: Modifier = Modifier,
    type: WDSButtonType = WDSButtonType.Filled,
    size: WDSButtonSize = WDSButtonSize.Medium,
    buttonColor: WDSButtonColor = WDSButtonColor.Default,
    status: WDSButtonStatus = WDSButtonStatus.Default,
    radius: WDSButtonRadius = WDSButtonRadius.Off,
    mode: WDSButtonMode = WDSButtonMode.Default,
    showLeading: Boolean = false,
    showTrailing: Boolean = false,
    trailingMode: WDSButtonTrailingMode = WDSButtonTrailingMode.Icon,
    trailingText: String? = null,
    leadingContent: (@Composable () -> Unit)? = null,
    trailingContent: (@Composable () -> Unit)? = null,
    onClick: () -> Unit = {}
) {
    val isDisabled = status == WDSButtonStatus.Disabled
    val isLoading  = status == WDSButtonStatus.Loading

    // Derived tokens
    val bgColor: Color = when (type) {
        WDSButtonType.Filled ->
            if (buttonColor == WDSButtonColor.Black) WdsColorBtnBlack else WdsColorBtnDefault
        else -> Color.Transparent
    }

    val textColor: Color = when (type) {
        WDSButtonType.Filled         -> WdsColorTextReverse
        WDSButtonType.OutlinedColor  ->
            if (buttonColor == WDSButtonColor.Black) WdsColorBtnBlack else WdsColorBtnDefault
        WDSButtonType.OutlinedGray   -> WdsColorTextDefault
        WDSButtonType.Ghost          -> WdsColorTextGray700
    }

    val borderColor: Color? = when (type) {
        WDSButtonType.OutlinedColor ->
            if (buttonColor == WDSButtonColor.Black) WdsColorBtnBlack else WdsColorBtnDefault
        WDSButtonType.OutlinedGray  -> WdsColorBtnOutlinedGray
        else -> null
    }

    val cornerRadius: Dp = if (radius == WDSButtonRadius.On) 999.dp else 10.dp
    val shape: Shape = RoundedCornerShape(cornerRadius)

    val fontWeight: FontWeight = if (type == WDSButtonType.Ghost) FontWeight.Medium else FontWeight.Bold

    val interactionSource = remember { MutableInteractionSource() }

    Box(
        modifier = modifier
            .height(size.height)
            .alpha(if (isDisabled) 0.38f else 1f)
            .clip(shape)
            .background(bgColor, shape)
            .then(
                if (borderColor != null) {
                    val borderWidth = if (type == WDSButtonType.OutlinedGray) 1.dp else 1.5.dp
                    Modifier.border(borderWidth, borderColor, shape)
                } else {
                    Modifier
                }
            )
            .clickable(
                enabled = !isDisabled,
                interactionSource = interactionSource,
                indication = null,
                onClick = onClick
            )
            .semantics {
                role = Role.Button
                if (isDisabled) disabled()
                if (isLoading) stateDescription = "로딩 중"
            },
        contentAlignment = Alignment.Center
    ) {
        Row(
            modifier = Modifier.padding(horizontal = size.horizontalPadding),
            horizontalArrangement = Arrangement.spacedBy(4.dp, Alignment.CenterHorizontally),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Leading slot — collapses when showLeading=false
            if (showLeading && leadingContent != null) {
                Box(Modifier.size(size.iconSize)) { leadingContent() }
            }

            // Label or Loading Dots — Box preserves width during loading
            Box(contentAlignment = Alignment.Center) {
                Text(
                    text = text,
                    color = if (isLoading) Color.Transparent else textColor,
                    fontSize = size.fontSize,
                    fontWeight = fontWeight,
                    maxLines = 1
                )
                if (isLoading) {
                    WDSLoadingDots(color = textColor)
                }
            }

            // Trailing slot — collapses when showTrailing=false
            if (showTrailing) {
                when {
                    trailingMode == WDSButtonTrailingMode.Text && trailingText != null ->
                        Text(
                            text = trailingText,
                            color = textColor,
                            fontSize = size.fontSize,
                            fontWeight = fontWeight,
                            maxLines = 1
                        )
                    trailingContent != null ->
                        Box(Modifier.size(size.iconSize)) { trailingContent() }
                }
            }
        }
    }
}

// ── Convenience factories (mirrors Code Connect) ──────────────────────────────
object WDSButtonFactory {
    @Composable
    fun Filled(
        text: String,
        modifier: Modifier = Modifier,
        size: WDSButtonSize = WDSButtonSize.Medium,
        buttonColor: WDSButtonColor = WDSButtonColor.Default,
        status: WDSButtonStatus = WDSButtonStatus.Default,
        radius: WDSButtonRadius = WDSButtonRadius.Off,
        onClick: () -> Unit = {}
    ) = WDSButton(
        text = text, modifier = modifier,
        type = WDSButtonType.Filled, size = size,
        buttonColor = buttonColor, status = status, radius = radius, onClick = onClick
    )

    @Composable
    fun OutlinedColor(
        text: String,
        modifier: Modifier = Modifier,
        size: WDSButtonSize = WDSButtonSize.Medium,
        buttonColor: WDSButtonColor = WDSButtonColor.Default,
        status: WDSButtonStatus = WDSButtonStatus.Default,
        radius: WDSButtonRadius = WDSButtonRadius.Off,
        onClick: () -> Unit = {}
    ) = WDSButton(
        text = text, modifier = modifier,
        type = WDSButtonType.OutlinedColor, size = size,
        buttonColor = buttonColor, status = status, radius = radius, onClick = onClick
    )

    @Composable
    fun OutlinedGray(
        text: String,
        modifier: Modifier = Modifier,
        size: WDSButtonSize = WDSButtonSize.Medium,
        status: WDSButtonStatus = WDSButtonStatus.Default,
        radius: WDSButtonRadius = WDSButtonRadius.Off,
        onClick: () -> Unit = {}
    ) = WDSButton(
        text = text, modifier = modifier,
        type = WDSButtonType.OutlinedGray, size = size,
        status = status, radius = radius, onClick = onClick
    )

    @Composable
    fun Ghost(
        text: String,
        modifier: Modifier = Modifier,
        size: WDSButtonSize = WDSButtonSize.Medium,
        status: WDSButtonStatus = WDSButtonStatus.Default,
        radius: WDSButtonRadius = WDSButtonRadius.Off,
        onClick: () -> Unit = {}
    ) = WDSButton(
        text = text, modifier = modifier,
        type = WDSButtonType.Ghost, size = size,
        status = status, radius = radius, onClick = onClick
    )
}

// ── Loading Dots ──────────────────────────────────────────────────────────────
@Composable
private fun WDSLoadingDots(
    color: Color,
    dotSize: Dp = 5.dp
) {
    val delays = listOf(0, 180, 360)
    Row(
        horizontalArrangement = Arrangement.spacedBy(3.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        delays.forEach { delayMs ->
            val infiniteTransition = rememberInfiniteTransition(label = "dot_$delayMs")
            val offsetY by infiniteTransition.animateFloat(
                initialValue = 0f,
                targetValue = -5f,
                animationSpec = infiniteRepeatable(
                    animation = keyframes {
                        durationMillis = 1200
                        0f at 0 with LinearEasing
                        -5f at 300 with LinearEasing
                        0f at 600 with LinearEasing
                        0f at 1200 with LinearEasing
                    },
                    repeatMode = RepeatMode.Restart,
                    initialStartOffset = StartOffset(delayMs)
                ),
                label = "offsetY_$delayMs"
            )
            val alpha by infiniteTransition.animateFloat(
                initialValue = 0.55f,
                targetValue = 1f,
                animationSpec = infiniteRepeatable(
                    animation = keyframes {
                        durationMillis = 1200
                        0.55f at 0 with LinearEasing
                        1f at 300 with LinearEasing
                        0.55f at 600 with LinearEasing
                        0.55f at 1200 with LinearEasing
                    },
                    repeatMode = RepeatMode.Restart,
                    initialStartOffset = StartOffset(delayMs)
                ),
                label = "alpha_$delayMs"
            )
            Box(
                modifier = Modifier
                    .size(dotSize)
                    .offset(y = offsetY.dp)
                    .alpha(alpha)
                    .background(color, RoundedCornerShape(50))
            )
        }
    }
}
