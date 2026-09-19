package com.expensecoach.app.data

import com.expensecoach.app.data.model.Expense
import com.expensecoach.app.data.model.ExpenseItem
import com.expensecoach.app.data.model.ExpenseStatus
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import java.util.UUID

class ExpenseRepository {
    private val _expenses = MutableStateFlow<List<Expense>>(getSeedExpenses())
    val expenses: StateFlow<List<Expense>> = _expenses.asStateFlow()

    fun approveExpense(id: String) {
        _expenses.value = _expenses.value.map {
            if (it.id == id) it.copy(status = ExpenseStatus.APPROVED) else it
        }
    }

    fun rejectExpense(id: String) {
        _expenses.value = _expenses.value.map {
            if (it.id == id) it.copy(status = ExpenseStatus.REJECTED) else it
        }
    }

    fun syncApprovedToSheets(): Int {
        var count = 0
        _expenses.value = _expenses.value.map {
            if (it.status == ExpenseStatus.APPROVED) {
                count++
                it.copy(status = ExpenseStatus.SYNCED_TO_SHEETS)
            } else it
        }
        return count
    }

    fun addManualExpense(
        merchant: String,
        amount: Double,
        category: String,
        date: String,
        notes: String? = null
    ) {
        val newExpense = Expense(
            id = UUID.randomUUID().toString(),
            merchant = merchant,
            amount = amount,
            category = category,
            date = date,
            status = ExpenseStatus.PENDING_REVIEW,
            confidence = 1.0,
            notes = notes
        )
        _expenses.value = listOf(newExpense) + _expenses.value
    }

    fun simulateEmailScan(): List<Expense> {
        val simulated = listOf(
            Expense(
                id = UUID.randomUUID().toString(),
                merchant = "Whole Foods Market",
                amount = 76.45,
                category = "Groceries",
                date = "2026-09-18",
                status = ExpenseStatus.PENDING_REVIEW,
                confidence = 0.98,
                emailSubject = "Your Whole Foods Market Digital Receipt",
                emailSender = "receipts@wholefoods.com",
                items = listOf(
                    ExpenseItem("Organic Honeycrisp Apples", 1, 4.99, 4.99),
                    ExpenseItem("Almond Milk 64oz", 2, 3.49, 6.98),
                    ExpenseItem("Fresh Atlantic Salmon", 1, 16.48, 16.48)
                )
            ),
            Expense(
                id = UUID.randomUUID().toString(),
                merchant = "Steam Games",
                amount = 19.99,
                category = "Entertainment",
                date = "2026-09-17",
                status = ExpenseStatus.PENDING_REVIEW,
                confidence = 0.94,
                emailSubject = "Thank you for your Steam purchase!",
                emailSender = "noreply@steampowered.com",
                orderNumber = "STM-98124501",
                items = listOf(
                    ExpenseItem("Indie Strategy Game", 1, 19.99, 19.99)
                )
            )
        )
        _expenses.value = simulated + _expenses.value
        return simulated
    }

    private fun getSeedExpenses(): List<Expense> = listOf(
        Expense(
            id = "exp-1",
            merchant = "Amazon.com",
            amount = 49.99,
            category = "Supplies & Equipment",
            date = "2026-09-15",
            status = ExpenseStatus.PENDING_REVIEW,
            confidence = 0.98,
            emailSubject = "Your Amazon.com order #114-892182-381928",
            emailSender = "auto-confirm@amazon.com",
            orderNumber = "114-892182-381928",
            items = listOf(
                ExpenseItem("USB-C Ergonomic Hub Multiport Adapter", 1, 49.99, 49.99)
            )
        ),
        Expense(
            id = "exp-2",
            merchant = "Starbucks Coffee",
            amount = 14.85,
            category = "Dining & Drinks",
            date = "2026-09-14",
            status = ExpenseStatus.APPROVED,
            confidence = 0.92,
            emailSubject = "Your Starbucks e-Receipt",
            emailSender = "orders@starbucks.com",
            items = listOf(
                ExpenseItem("Caramel Macchiato (Venti)", 2, 5.95, 11.90),
                ExpenseItem("Butter Croissant", 1, 2.95, 2.95)
            )
        ),
        Expense(
            id = "exp-3",
            merchant = "GitHub Inc.",
            amount = 10.00,
            category = "Software & Subscriptions",
            date = "2026-09-01",
            status = ExpenseStatus.SYNCED_TO_SHEETS,
            confidence = 0.99,
            isRecurring = true,
            emailSubject = "[GitHub] Payment receipt for invoice GH-98120",
            emailSender = "billing@github.com",
            orderNumber = "INV-GH-98120"
        ),
        Expense(
            id = "exp-4",
            merchant = "Uber Technologies",
            amount = 28.50,
            category = "Transportation",
            date = "2026-09-12",
            status = ExpenseStatus.SYNCED_TO_SHEETS,
            confidence = 0.96,
            emailSubject = "Your Tuesday morning trip with Uber",
            emailSender = "uber.us@uber.com"
        )
    )
}
