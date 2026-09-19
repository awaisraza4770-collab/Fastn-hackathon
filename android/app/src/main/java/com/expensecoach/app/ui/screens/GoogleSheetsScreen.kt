package com.expensecoach.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.TableChart
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.expensecoach.app.data.model.Expense
import com.expensecoach.app.data.model.ExpenseStatus
import com.expensecoach.app.ui.ExpenseViewModel
import com.expensecoach.app.ui.theme.*

@Composable
fun GoogleSheetsScreen(viewModel: ExpenseViewModel) {
    val expenses by viewModel.expenses.collectAsState()
    val syncedExpenses = expenses.filter { it.status == ExpenseStatus.SYNCED_TO_SHEETS }
    val horizontalScrollState = rememberScrollState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Slate50)
            .padding(16.dp)
    ) {
        // Sheet Header Info
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
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(36.dp)
                                .background(Emerald100, RoundedCornerShape(8.dp)),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(Icons.Default.TableChart, contentDescription = null, tint = Emerald700)
                        }
                        Spacer(modifier = Modifier.width(10.dp))
                        Column {
                            Text(
                                text = "2026_Personal_Expenses",
                                fontSize = 15.sp,
                                fontWeight = FontWeight.Bold,
                                color = Slate900
                            )
                            Text(
                                text = "Sheet1 • Auto-synced from Gemini AI",
                                fontSize = 11.sp,
                                color = Slate500
                            )
                        }
                    }

                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.CheckCircle, contentDescription = null, tint = Emerald600, modifier = Modifier.size(14.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Live Synced", fontSize = 11.sp, fontWeight = FontWeight.Medium, color = Emerald700)
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))
                // Formula Bar look
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(Slate100, RoundedCornerShape(6.dp))
                        .padding(horizontal = 10.dp, vertical = 6.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text("fx", fontWeight = FontWeight.Bold, color = Slate400, fontSize = 12.sp)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "=SUM(D2:D${syncedExpenses.size + 1}) → $%.2f".format(syncedExpenses.sumOf { it.amount }),
                        fontFamily = FontFamily.Monospace,
                        fontSize = 12.sp,
                        color = Slate700
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Spreadsheet Table View
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .weight(1f),
            shape = RoundedCornerShape(12.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
        ) {
            Box(modifier = Modifier.horizontalScroll(horizontalScrollState)) {
                Column {
                    // Header Row
                    Row(
                        modifier = Modifier
                            .background(Slate100)
                            .padding(vertical = 10.dp, horizontal = 12.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text("Date", modifier = Modifier.width(90.dp), fontWeight = FontWeight.Bold, fontSize = 12.sp, color = Slate700)
                        Text("Merchant", modifier = Modifier.width(140.dp), fontWeight = FontWeight.Bold, fontSize = 12.sp, color = Slate700)
                        Text("Category", modifier = Modifier.width(130.dp), fontWeight = FontWeight.Bold, fontSize = 12.sp, color = Slate700)
                        Text("Amount", modifier = Modifier.width(80.dp), fontWeight = FontWeight.Bold, fontSize = 12.sp, color = Slate700)
                        Text("Order / Email Ref", modifier = Modifier.width(180.dp), fontWeight = FontWeight.Bold, fontSize = 12.sp, color = Slate700)
                    }

                    Divider(color = Slate200)

                    LazyColumn(
                        modifier = Modifier.fillMaxWidth(),
                        contentPadding = PaddingValues(bottom = 80.dp)
                    ) {
                        itemsIndexed(syncedExpenses) { index, item ->
                            val rowBg = if (index % 2 == 0) Color.White else Slate50
                            Row(
                                modifier = Modifier
                                    .background(rowBg)
                                    .padding(vertical = 8.dp, horizontal = 12.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(item.date, modifier = Modifier.width(90.dp), fontSize = 12.sp, color = Slate600)
                                Text(item.merchant, modifier = Modifier.width(140.dp), fontWeight = FontWeight.Medium, fontSize = 12.sp, color = Slate900)
                                Text(item.category, modifier = Modifier.width(130.dp), fontSize = 12.sp, color = Slate600)
                                Text("$%.2f".format(item.amount), modifier = Modifier.width(80.dp), fontWeight = FontWeight.Bold, fontSize = 12.sp, color = Emerald700)
                                Text(item.orderNumber ?: item.emailSender ?: "—", modifier = Modifier.width(180.dp), fontSize = 11.sp, color = Slate400)
                            }
                            Divider(color = Slate100)
                        }
                    }
                }
            }
        }
    }
}
