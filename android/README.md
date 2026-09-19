# Expense Coach — Native Android App (Jetpack Compose)

This directory contains the complete native Android project for **Expense Coach**, built using **Kotlin**, **Jetpack Compose**, and **Material 3**.

## Architecture & Features
- **UI Framework**: Modern Jetpack Compose with Edge-to-Edge display and Material 3 design system.
- **Theme**: Expense Coach emerald & slate palette (`#059669` primary, `#0F172A` background).
- **Navigation**: Jetpack Compose Navigation bar with dynamic badge counts for pending receipts.
- **State Management**: `ViewModel` + Kotlin `StateFlow` reactive stream architecture.
- **Screens**:
  1. `DashboardScreen`: Monthly spend hero card, one-tap inbox scanner, spending metrics, and recent receipts.
  2. `ApprovalHubScreen`: Approval queue for parsed receipts with itemized breakdown and one-tap approval / rejection.
  3. `GoogleSheetsScreen`: Real-time spreadsheet ledger with live formula bar (`=SUM(...)`) and scrollable column views.
  4. `AiCoachScreen`: Financial AI Coach chat with contextual query answering powered by Gemini.

## Requirements
- Android Studio Ladybug (2024.2+) or newer
- JDK 17 or higher
- Android SDK 35 (compileSdk 35, minSdk 26)

## How to Build in Android Studio
1. Open Android Studio.
2. Select **Open an Existing Project** and browse to the `/android` directory.
3. Allow Gradle to sync dependencies from Google & Maven Central.
4. Select an Android device or emulator (API 26+) and click **Run** (`Shift + F10`).

## Command Line Build
```bash
cd android
./gradlew assembleDebug
```
The output APK will be generated at:
`android/app/build/outputs/apk/debug/app-debug.apk`

## Android WebAPK / PWA Option
In addition to this native Kotlin codebase, the web version of Expense Coach is a fully compliant Progressive Web App. On Android Chrome or Samsung Internet, users can tap **"Install App"** to install it directly to their home screen with native WebAPK capabilities, offline caching, and push notifications.
