package com.expensecoach.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.Dashboard
import androidx.compose.material.icons.filled.PendingActions
import androidx.compose.material.icons.filled.TableChart
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp
import com.expensecoach.app.ui.ExpenseViewModel
import com.expensecoach.app.ui.screens.AiCoachScreen
import com.expensecoach.app.ui.screens.ApprovalHubScreen
import com.expensecoach.app.ui.screens.DashboardScreen
import com.expensecoach.app.ui.screens.GoogleSheetsScreen
import com.expensecoach.app.ui.theme.Emerald600
import com.expensecoach.app.ui.theme.ExpenseCoachTheme

enum class AppTab(val title: String, val icon: ImageVector) {
    DASHBOARD("Dashboard", Icons.Default.Dashboard),
    REVIEW("Review", Icons.Default.PendingActions),
    SHEETS("Sheets", Icons.Default.TableChart),
    COACH("AI Coach", Icons.Default.AutoAwesome)
}

class MainActivity : ComponentActivity() {
    private val viewModel: ExpenseViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        setContent {
            ExpenseCoachTheme {
                var currentTab by remember { mutableStateOf(AppTab.DASHBOARD) }
                val metrics by viewModel.metrics.collectAsState()
                val scanMessage by viewModel.scanMessage.collectAsState()
                val snackbarHostState = remember { SnackbarHostState() }

                LaunchedEffect(scanMessage) {
                    scanMessage?.let {
                        snackbarHostState.showSnackbar(it)
                        viewModel.clearMessage()
                    }
                }

                Scaffold(
                    modifier = Modifier.fillMaxSize(),
                    snackbarHost = { SnackbarHost(snackbarHostState) },
                    bottomBar = {
                        NavigationBar(
                            tonalElevation = 8.dp
                        ) {
                            AppTab.values().forEach { tab ->
                                val selected = currentTab == tab
                                NavigationBarItem(
                                    selected = selected,
                                    onClick = { currentTab = tab },
                                    label = { Text(tab.title) },
                                    icon = {
                                        BadgedBox(
                                            badge = {
                                                if (tab == AppTab.REVIEW && metrics.pendingCount > 0) {
                                                    Badge { Text("${metrics.pendingCount}") }
                                                }
                                            }
                                        ) {
                                            Icon(tab.icon, contentDescription = tab.title)
                                        }
                                    },
                                    colors = NavigationBarItemDefaults.colors(
                                        selectedIconColor = Emerald600,
                                        indicatorColor = Emerald600.copy(alpha = 0.15f)
                                    )
                                )
                            }
                        }
                    }
                ) { innerPadding ->
                    Box(modifier = Modifier.padding(innerPadding)) {
                        when (currentTab) {
                            AppTab.DASHBOARD -> DashboardScreen(
                                viewModel = viewModel,
                                onNavigateToReview = { currentTab = AppTab.REVIEW },
                                onNavigateToSheets = { currentTab = AppTab.SHEETS }
                            )
                            AppTab.REVIEW -> ApprovalHubScreen(viewModel = viewModel)
                            AppTab.SHEETS -> GoogleSheetsScreen(viewModel = viewModel)
                            AppTab.COACH -> AiCoachScreen(viewModel = viewModel)
                        }
                    }
                }
            }
        }
    }
}
