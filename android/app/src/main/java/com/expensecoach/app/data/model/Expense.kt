package com.expensecoach.app.data.model

data class ExpenseItem(
    val description: String,
    val quantity: Int = 1,
    val unitPrice: Double? = null,
    val totalPrice: Double
)

enum class ExpenseStatus {
    PENDING_REVIEW,
    APPROVED,
    SYNCED_TO_SHEETS,
    REJECTED
}

data class Expense(
    val id: String,
    val merchant: String,
    val amount: Double,
    val currency: String = "USD",
    val date: String,
    val category: String,
    val status: ExpenseStatus,
    val confidence: Double = 0.95,
    val emailSubject: String? = null,
    val emailSender: String? = null,
    val emailDate: String? = null,
    val orderNumber: String? = null,
    val items: List<ExpenseItem> = emptyList(),
    val isRecurring: Boolean = false,
    val notes: String? = null
)
