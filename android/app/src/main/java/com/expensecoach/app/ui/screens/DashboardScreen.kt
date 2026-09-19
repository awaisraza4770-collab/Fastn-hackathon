package com.expensecoach.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.PendingActions
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.TableChart
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.expensecoach.app.data.model.Expense
import com.expensecoach.app.data.model.ExpenseStatus
import com.expensecoach.app.ui.ExpenseViewModel
import com.expensecoach.app.ui.theme.*

@Composable
fun DashboardScreen(
    viewModel: ExpenseViewModel,
    onNavigateToReview: () -> Unit,
    onNavigateToSheets: () -> Unit
) {
    val metrics by viewModel.metrics.collectAsState()
    val expenses by viewModel.expenses.collectAsState()
    val isScanning by viewModel.isScanning.collectAsState()

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(Slate50)
            .padding(horizontal = 16.dp),
        contentPadding = PaddingValues(top = 16.dp, bottom = 96.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Top Hero Banner
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = Slate900)
            ) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(
                                text = "SEPTEMBER SPENDING",
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold,
                                color = Emerald500
                            )
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = "$%.2f".format(metrics.totalSpend),
                                fontSize = 32.sp,
                                fontWeight = FontWeight.ExtraBold,
                                color = Color.White
                            )
                        }

                        Button(
                            onClick = { viewModel.scanInbox() },
                            enabled = !isScanning,
                            colors = ButtonDefaults.buttonColors(containerColor = Emerald600),
                            shape = RoundedCornerShape(12.dp)
                        ) {
                            if (isScanning) {
                                CircularProgressIndicator(
                                    modifier = Modifier.size(16.dp),
                                    color = Color.White,
                                    strokeWidth = 2.dp
                                )
                            } else {
                                Icon(Icons.Default.Refresh, contentDescription = null, modifier = Modifier.size(16.dp))
                                Spacer(modifier = Modifier.width(6.dp))
                                Text("Scan Inbox", fontSize = 13.sp)
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))
                    Divider(color = Slate800)
                    Spacer(modifier = Modifier.height(12.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(
                            text = "AI Extracted: ${expenses.size} receipts",
                            color = Slate400,
                            fontSize = 12.sp
                        )
                        Text(
                            text = "Auto-Synced to Sheets",
                            color = Emerald500,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Medium
                        )
                    }
                }
            }
        }

        // Metrics Grid
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                MetricSmallCard(
                    title = "Pending Review",
                    value = "${metrics.pendingCount}",
                    subtitle = "Needs approval",
                    icon = Icons.Default.PendingActions,
                    accentColor = Amber500,
                    modifier = Modifier.weight(1f),
                    onClick = onNavigateToReview
                )
                MetricSmallCard(
                    title = "Google Sheets",
                    value = "${metrics.syncedCount}",
                    subtitle = "Live synced",
                    icon = Icons.Default.TableChart,
                    accentColor = Emerald600,
                    modifier = Modifier.weight(1f),
                    onClick = onNavigateToSheets
                )
            }
        }

        // Recent Receipts Header
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Recent Receipts",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = Slate900
                )
                TextButton(onClick = onNavigateToReview) {
                    Text("View All", color = Emerald600, fontWeight = FontWeight.SemiBold)
                }
            }
        }

        // Recent Expenses List
        items(expenses.take(6)) { expense ->
            ExpenseRowCard(expense)
        }
    }
}

@Composable
fun MetricSmallCard(
    title: String,
    value: String,
    subtitle: String,
    icon: ImageVector,
    accentColor: Color,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    Card(
        onClick = onClick,
        modifier = modifier,
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Box(
                modifier = Modifier
                    .size(36.dp)
                    .clip(RoundedCornerShape(10.dp))
                    .background(accentColor.copy(alpha = 0.12f)),
                contentAlignment = Alignment.Center
            ) {
                Icon(icon, contentDescription = null, tint = accentColor, modifier = Modifier.size(20.dp))
            }
            Spacer(modifier = Modifier.height(12.dp))
            Text(value, fontSize = 24.sp, fontWeight = FontWeight.Bold, color = Slate900)
            Text(title, fontSize = 12.sp, fontWeight = FontWeight.Medium, color = Slate700)
            Text(subtitle, fontSize = 11.sp, color = Slate500)
        }
    }
}

@Composable
fun ExpenseRowCard(expense: Expense) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 0.5.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(14.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = expense.merchant,
                        fontSize = 15.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = Slate900
                    )
                    if (expense.confidence >= 0.95) {
                        Spacer(modifier = Modifier.width(6.dp))
                        Icon(
                            Icons.Default.AutoAwesome,
                            contentDescription = "AI Confident",
                            tint = Emerald600,
                            modifier = Modifier.size(14.dp)
                        )
                    }
                }
                Spacer(modifier = Modifier.height(2.dp))
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(expense.category, fontSize = 12.sp, color = Slate500)
                    Text(" • ", fontSize = 12.sp, color = Slate400)
                    Text(expense.date, fontSize = 12.sp, color = Slate500)
                }
            }

            Column(horizontalAlignment = Alignment.End) {
                Text(
                    text = "$%.2f".format(expense.amount),
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    color = Slate900
                )
                Spacer(modifier = Modifier.height(4.dp))
                StatusChip(expense.status)
            }
        }
    }
}

@Composable
fun StatusChip(status: ExpenseStatus) {
    val (bgColor, textColor, label) = when (status) {
        ExpenseStatus.PENDING_REVIEW -> Triple(Amber100, Amber500, "Review")
        ExpenseStatus.APPROVED -> Triple(Blue100, Blue500, "Approved")
        ExpenseStatus.SYNCED_TO_SHEETS -> Triple(Emerald100, Emerald700, "Synced")
        ExpenseStatus.REJECTED -> Triple(Rose100, Rose500, "Rejected")
    }

    Box(
        modifier = Modifier
            .clip(RoundedCornerShape(6.dp))
            .background(bgColor)
            .padding(horizontal = 6.dp, vertical = 2.dp)
    ) {
        Text(text = label, fontSize = 10.sp, fontWeight = FontWeight.Bold, color = textColor)
    }
}
