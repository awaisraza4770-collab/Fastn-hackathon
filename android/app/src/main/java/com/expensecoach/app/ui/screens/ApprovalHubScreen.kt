package com.expensecoach.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Clear
import androidx.compose.material.icons.filled.CloudUpload
import androidx.compose.material.icons.filled.Email
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.expensecoach.app.data.model.Expense
import com.expensecoach.app.data.model.ExpenseStatus
import com.expensecoach.app.ui.ExpenseViewModel
import com.expensecoach.app.ui.theme.*

@Composable
fun ApprovalHubScreen(
    viewModel: ExpenseViewModel
) {
    val expenses by viewModel.expenses.collectAsState()
    val pendingList = expenses.filter { it.status == ExpenseStatus.PENDING_REVIEW }
    val approvedList = expenses.filter { it.status == ExpenseStatus.APPROVED }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(Slate50)
            .padding(horizontal = 16.dp),
        contentPadding = PaddingValues(top = 16.dp, bottom = 96.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Top Sync Banner if there are approved items ready for Google Sheets
        if (approvedList.isNotEmpty()) {
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = Emerald50)
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = "${approvedList.size} Ready for Google Sheets",
                                fontWeight = FontWeight.Bold,
                                color = Emerald900,
                                fontSize = 14.sp
                            )
                            Text(
                                text = "Approved receipts will sync automatically",
                                color = Emerald700,
                                fontSize = 12.sp
                            )
                        }
                        Button(
                            onClick = { viewModel.syncApprovedToSheets() },
                            colors = ButtonDefaults.buttonColors(containerColor = Emerald600),
                            shape = RoundedCornerShape(10.dp)
                        ) {
                            Icon(Icons.Default.CloudUpload, contentDescription = null, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("Sync All", fontSize = 12.sp)
                        }
                    }
                }
            }
        }

        // Header Title
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Review Extracted Receipts",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = Slate900
                )
                Text(
                    text = "${pendingList.size} Pending",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = Amber500
                )
            }
        }

        if (pendingList.isEmpty()) {
            item {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 48.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(
                            text = "🎉 All Caught Up!",
                            fontSize = 20.sp,
                            fontWeight = FontWeight.Bold,
                            color = Slate800
                        )
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = "No pending receipts in your Gmail queue.",
                            fontSize = 14.sp,
                            color = Slate500
                        )
                    }
                }
            }
        } else {
            items(pendingList, key = { it.id }) { expense ->
                ReviewExpenseCard(
                    expense = expense,
                    onApprove = { viewModel.approve(expense.id) },
                    onReject = { viewModel.reject(expense.id) }
                )
            }
        }
    }
}

@Composable
fun ReviewExpenseCard(
    expense: Expense,
    onApprove: () -> Unit,
    onReject: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = expense.merchant,
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold,
                        color = Slate900
                    )
                    Text(
                        text = "${expense.category} • ${expense.date}",
                        fontSize = 12.sp,
                        color = Slate500
                    )
                }

                Text(
                    text = "$%.2f".format(expense.amount),
                    fontSize = 20.sp,
                    fontWeight = FontWeight.ExtraBold,
                    color = Slate900
                )
            }

            // Email source pill if extracted from Gmail
            if (expense.emailSubject != null) {
                Spacer(modifier = Modifier.height(10.dp))
                Row(
                    modifier = Modifier
                        .clip(RoundedCornerShape(8.dp))
                        .background(Slate100)
                        .padding(horizontal = 8.dp, vertical = 4.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(Icons.Default.Email, contentDescription = null, tint = Slate500, modifier = Modifier.size(12.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = expense.emailSubject,
                        fontSize = 11.sp,
                        color = Slate700,
                        maxLines = 1
                    )
                }
            }

            // Item breakdown
            if (expense.items.isNotEmpty()) {
                Spacer(modifier = Modifier.height(8.dp))
                expense.items.forEach { item ->
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(item.description, fontSize = 12.sp, color = Slate600)
                        Text("$%.2f".format(item.totalPrice), fontSize = 12.sp, color = Slate700)
                    }
                }
            }

            Spacer(modifier = Modifier.height(14.dp))
            Divider(color = Slate100)
            Spacer(modifier = Modifier.height(10.dp))

            // Action buttons
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.End,
                verticalAlignment = Alignment.CenterVertically
            ) {
                OutlinedButton(
                    onClick = onReject,
                    colors = ButtonDefaults.outlinedButtonColors(contentColor = Slate600),
                    shape = RoundedCornerShape(8.dp)
                ) {
                    Icon(Icons.Default.Clear, contentDescription = null, modifier = Modifier.size(14.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("Reject", fontSize = 12.sp)
                }

                Spacer(modifier = Modifier.width(8.dp))

                Button(
                    onClick = onApprove,
                    colors = ButtonDefaults.buttonColors(containerColor = Emerald600),
                    shape = RoundedCornerShape(8.dp)
                ) {
                    Icon(Icons.Default.Check, contentDescription = null, modifier = Modifier.size(14.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("Approve Expense", fontSize = 12.sp)
                }
            }
        }
    }
}
