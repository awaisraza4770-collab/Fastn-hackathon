package com.expensecoach.app.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.expensecoach.app.data.ExpenseRepository
import com.expensecoach.app.data.model.Expense
import com.expensecoach.app.data.model.ExpenseStatus
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

data class DashboardMetrics(
    val totalSpend: Double,
    val pendingCount: Int,
    val approvedCount: Int,
    val syncedCount: Int
)

class ExpenseViewModel(
    private val repository: ExpenseRepository = ExpenseRepository()
) : ViewModel() {

    val expenses: StateFlow<List<Expense>> = repository.expenses

    val metrics: StateFlow<DashboardMetrics> = expenses.map { list ->
        val total = list.filter { it.status != ExpenseStatus.REJECTED }.sumOf { it.amount }
        val pending = list.count { it.status == ExpenseStatus.PENDING_REVIEW }
        val approved = list.count { it.status == ExpenseStatus.APPROVED }
        val synced = list.count { it.status == ExpenseStatus.SYNCED_TO_SHEETS }
        DashboardMetrics(total, pending, approved, synced)
    }.stateIn(
        viewModelScope,
        SharingStarted.WhileSubscribed(5000),
        DashboardMetrics(0.0, 0, 0, 0)
    )

    private val _isScanning = MutableStateFlow(false)
    val isScanning: StateFlow<Boolean> = _isScanning.asStateFlow()

    private val _scanMessage = MutableStateFlow<String?>(null)
    val scanMessage: StateFlow<String?> = _scanMessage.asStateFlow()

    fun approve(id: String) {
        repository.approveExpense(id)
    }

    fun reject(id: String) {
        repository.rejectExpense(id)
    }

    fun syncApprovedToSheets() {
        val count = repository.syncApprovedToSheets()
        _scanMessage.value = "Synced $count expense(s) to Google Sheets!"
    }

    fun scanInbox() {
        viewModelScope.launch {
            _isScanning.value = true
            delay(1500)
            val newItems = repository.simulateEmailScan()
            _isScanning.value = false
            _scanMessage.value = "Found and parsed ${newItems.size} new receipts with Gemini AI!"
        }
    }

    fun clearMessage() {
        _scanMessage.value = null
    }

    fun addManualExpense(merchant: String, amount: Double, category: String, date: String, notes: String?) {
        repository.addManualExpense(merchant, amount, category, date, notes)
    }
}
