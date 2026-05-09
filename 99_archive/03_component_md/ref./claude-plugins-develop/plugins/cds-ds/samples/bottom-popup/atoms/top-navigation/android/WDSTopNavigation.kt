// WDSTopNavigation.kt
// Chord Design System — Top Navigation Atom

package com.weverse.ds.component

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

// ── Enums ─────────────────────────────────────────────────────────────────────
enum class WDSTopNavigationLeft { None, Back, Custom }

// ── Token Colors ──────────────────────────────────────────────────────────────
private val WdsColorTextDefault = Color(0xFF000000)
private val WdsColorSurface     = Color(0xFFFFFFFF)

// ── WDSTopNavigation ──────────────────────────────────────────────────────────
@Composable
fun WDSTopNavigation(
    modifier: Modifier = Modifier,
    title: String,
    showClose: Boolean = true,
    leftType: WDSTopNavigationLeft = WDSTopNavigationLeft.None,
    onClose: () -> Unit = {},
    onBack: () -> Unit = {},
    customLeft: (@Composable () -> Unit)? = null
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .height(48.dp)
            .background(WdsColorSurface)
            .padding(horizontal = 4.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        // Left slot — 빈 자리도 40dp 유지하여 title 좌측 정렬 보장
        Box(modifier = Modifier.size(40.dp), contentAlignment = Alignment.Center) {
            when (leftType) {
                WDSTopNavigationLeft.Back -> {
                    IconButton(
                        onClick = onBack,
                        modifier = Modifier.size(40.dp).semantics { contentDescription = "뒤로가기" }
                    ) {
                        Text("‹", fontSize = 22.sp, color = WdsColorTextDefault, fontWeight = FontWeight.Light)
                    }
                }
                WDSTopNavigationLeft.Custom -> {
                    customLeft?.invoke()
                }
                WDSTopNavigationLeft.None -> { /* empty spacer */ }
            }
        }

        // Title — 좌측 정렬 (BottomPopup 명세)
        Text(
            text = title,
            modifier = Modifier
                .weight(1f)
                .padding(horizontal = 4.dp),
            fontSize = 16.sp,
            fontWeight = FontWeight.Bold,
            color = WdsColorTextDefault,
            maxLines = 1,
            overflow = TextOverflow.Ellipsis
        )

        // Close button
        Box(modifier = Modifier.size(40.dp), contentAlignment = Alignment.Center) {
            if (showClose) {
                IconButton(
                    onClick = onClose,
                    modifier = Modifier.size(40.dp).semantics { contentDescription = "닫기" }
                ) {
                    Text(
                        text = "×",
                        fontSize = 22.sp,
                        color = WdsColorTextDefault,
                        fontWeight = FontWeight.Light
                    )
                }
            }
        }
    }
}
