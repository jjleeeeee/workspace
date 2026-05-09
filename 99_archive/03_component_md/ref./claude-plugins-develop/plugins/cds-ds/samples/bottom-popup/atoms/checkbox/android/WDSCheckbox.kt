// WDSCheckbox.kt
// Chord Design System — Checkbox Atom

package com.weverse.ds.component

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.remember
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Shape
import androidx.compose.ui.semantics.*
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

// ── Enums ─────────────────────────────────────────────────────────────────────
enum class WDSCheckboxType { Circle, Square }

// ── Token Colors ──────────────────────────────────────────────────────────────
private val WdsColorLineDefault = Color(0xFFE0E0E0)
private val WdsColorBtnDefault  = Color(0xFF00CBD5)
private val WdsColorTextSub     = Color(0x80000000) // rgba(0,0,0,0.5)
private val WdsColorTextReverse = Color(0xFFFFFFFF)

// ── WDSCheckbox ───────────────────────────────────────────────────────────────
@Composable
fun WDSCheckbox(
    modifier: Modifier = Modifier,
    label: String = "텍스트를 입력해주세요",
    type: WDSCheckboxType = WDSCheckboxType.Circle,
    enabled: Boolean = true,
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit
) {
    val interactionSource = remember { MutableInteractionSource() }

    val shape: Shape = when (type) {
        WDSCheckboxType.Circle -> CircleShape
        WDSCheckboxType.Square -> RoundedCornerShape(4.dp)
    }

    Row(
        modifier = modifier
            .alpha(if (enabled) 1f else 0.38f)
            .clickable(
                enabled = enabled,
                interactionSource = interactionSource,
                indication = null,
                onClick = { onCheckedChange(!checked) }
            )
            .semantics {
                role = Role.Checkbox
                this.contentDescription = label
                if (!enabled) disabled()
            },
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        // Indicator box
        Box(
            modifier = Modifier
                .size(24.dp)
                .clip(shape)
                .background(if (checked) WdsColorBtnDefault else Color.Transparent)
                .border(1.5.dp, if (checked) WdsColorBtnDefault else WdsColorLineDefault, shape),
            contentAlignment = Alignment.Center
        ) {
            if (checked) {
                Text(
                    text = "✓",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold,
                    color = WdsColorTextReverse
                )
            }
        }

        // Label
        Text(
            text = label,
            fontSize = 15.sp,
            fontWeight = FontWeight.Normal,
            color = WdsColorTextSub
        )
    }
}
