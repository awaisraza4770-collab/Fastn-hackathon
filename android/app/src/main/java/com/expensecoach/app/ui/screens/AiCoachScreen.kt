package com.expensecoach.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.Send
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.expensecoach.app.ui.ExpenseViewModel
import com.expensecoach.app.ui.theme.*

data class ChatMessage(
    val id: String,
    val text: String,
    val isUser: Boolean,
    val timestamp: String = "Just now"
)

@Composable
fun AiCoachScreen(viewModel: ExpenseViewModel) {
    val metrics by viewModel.metrics.collectAsState()
    var inputText by remember { mutableStateOf("") }
    val messages = remember {
        mutableStateListOf(
            ChatMessage(
                id = "1",
                text = "Hello! I'm your Expense Coach AI. I analyze your Gmail receipts and Google Sheets spending data. How can I help you today?",
                isUser = false
            ),
            ChatMessage(
                id = "2",
                text = "What is my total spending this month?",
                isUser = true
            ),
            ChatMessage(
                id = "3",
                text = "You've spent a total of $%.2f across your parsed purchase receipts. Your largest category is Supplies & Equipment, followed by Dining.".format(metrics.totalSpend),
                isUser = false
            )
        )
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Slate50)
            .padding(horizontal = 16.dp)
    ) {
        // Chat Header
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = 16.dp),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
        ) {
            Row(
                modifier = Modifier.padding(14.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .size(36.dp)
                        .background(Emerald100, RoundedCornerShape(10.dp)),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(Icons.Default.AutoAwesome, contentDescription = null, tint = Emerald700, modifier = Modifier.size(20.dp))
                }
                Spacer(modifier = Modifier.width(10.dp))
                Column {
                    Text("Expense Coach AI", fontWeight = FontWeight.Bold, fontSize = 15.sp, color = Slate900)
                    Text("Powered by Gemini 3.8 Flash • Real-time Financial Q&A", fontSize = 11.sp, color = Slate500)
                }
            }
        }

        // Messages List
        LazyColumn(
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth()
                .padding(vertical = 12.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            items(messages, key = { it.id }) { msg ->
                ChatBubble(msg)
            }
        }

        // Input Field
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 90.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            TextField(
                value = inputText,
                onValueChange = { inputText = it },
                placeholder = { Text("Ask about your spending, coffee, or Uber...", fontSize = 13.sp) },
                modifier = Modifier
                    .weight(1f)
                    .clip(RoundedCornerShape(24.dp)),
                colors = TextFieldDefaults.colors(
                    focusedContainerColor = Color.White,
                    unfocusedContainerColor = Color.White,
                    disabledContainerColor = Color.White,
                    focusedIndicatorColor = Color.Transparent,
                    unfocusedIndicatorColor = Color.Transparent
                ),
                singleLine = true
            )
            Spacer(modifier = Modifier.width(8.dp))
            IconButton(
                onClick = {
                    if (inputText.isNotBlank()) {
                        val userText = inputText
                        messages.add(ChatMessage(System.currentTimeMillis().toString(), userText, true))
                        inputText = ""

                        // Simple contextual response
                        val reply = if (userText.contains("coffee", ignoreCase = true) || userText.contains("starbucks", ignoreCase = true)) {
                            "You spent $14.85 on Starbucks Coffee on Sep 14. Your coffee spending is steady at ~5% of monthly outlay."
                        } else if (userText.contains("subscription", ignoreCase = true) || userText.contains("recurring", ignoreCase = true)) {
                            "You have 1 active recurring subscription detected: GitHub Inc ($10.00/month)."
                        } else {
                            "Based on your Google Sheets ledger with %d synced expenses totaling $%.2f, your current burn rate is healthy!".format(metrics.syncedCount, metrics.totalSpend)
                        }

                        messages.add(ChatMessage((System.currentTimeMillis() + 1).toString(), reply, false))
                    }
                },
                modifier = Modifier
                    .size(44.dp)
                    .background(Emerald600, RoundedCornerShape(22.dp))
            ) {
                Icon(Icons.Default.Send, contentDescription = "Send", tint = Color.White, modifier = Modifier.size(18.dp))
            }
        }
    }
}

@Composable
fun ChatBubble(msg: ChatMessage) {
    Column(
        modifier = Modifier.fillMaxWidth(),
        horizontalAlignment = if (msg.isUser) Alignment.End else Alignment.Start
    ) {
        Box(
            modifier = Modifier
                .widthIn(max = 280.dp)
                .clip(
                    RoundedCornerShape(
                        topStart = 16.dp,
                        topEnd = 16.dp,
                        bottomStart = if (msg.isUser) 16.dp else 4.dp,
                        bottomEnd = if (msg.isUser) 4.dp else 16.dp
                    )
                )
                .background(if (msg.isUser) Emerald600 else Color.White)
                .padding(14.dp)
        ) {
            Text(
                text = msg.text,
                color = if (msg.isUser) Color.White else Slate800,
                fontSize = 13.sp,
                lineHeight = 18.sp
            )
        }
    }
}
