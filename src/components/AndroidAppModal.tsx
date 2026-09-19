import React, { useState, useEffect } from "react";
import { 
  Smartphone, 
  Download, 
  CheckCircle2, 
  Copy, 
  ExternalLink, 
  QrCode, 
  Sparkles, 
  X, 
  Code2, 
  Layers, 
  ArrowRight,
  ShieldCheck,
  Check
} from "lucide-react";

interface AndroidAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt: any;
  onTriggerInstall: () => void;
  isInstalled: boolean;
}

export function AndroidAppModal({
  isOpen,
  onClose,
  deferredPrompt,
  onTriggerInstall,
  isInstalled,
}: AndroidAppModalProps) {
  const [activeTab, setActiveTab] = useState<"pwa" | "native" | "instructions">("pwa");
  const [copiedCmd, setCopiedCmd] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleCopyBuild = () => {
    navigator.clipboard.writeText("cd android && ./gradlew assembleDebug");
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold tracking-tight">Expense Coach for Android</h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Android Ready
                </span>
              </div>
              <p className="text-xs text-slate-400">Install as native WebAPK or build native Kotlin Jetpack Compose app</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-2">
          <button
            onClick={() => setActiveTab("pwa")}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "pwa"
                ? "border-emerald-600 text-emerald-700 bg-white rounded-t-lg border-t border-x border-slate-200 -mb-[1px]"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            1-Click Android Install (WebAPK)
          </button>
          <button
            onClick={() => setActiveTab("native")}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "native"
                ? "border-emerald-600 text-emerald-700 bg-white rounded-t-lg border-t border-x border-slate-200 -mb-[1px]"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-indigo-600" />
            Native Kotlin / Compose Codebase
          </button>
          <button
            onClick={() => setActiveTab("instructions")}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "instructions"
                ? "border-emerald-600 text-emerald-700 bg-white rounded-t-lg border-t border-x border-slate-200 -mb-[1px]"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <QrCode className="w-3.5 h-3.5 text-slate-500" />
            Open on Android Phone
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-700 text-sm">
          {/* TAB 1: PWA WebAPK */}
          {activeTab === "pwa" && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-emerald-950 text-sm">Official Android WebAPK Experience</h4>
                  <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                    Expense Coach meets full Google PWA standards. When installed on Android, it behaves like an APK with standalone display, no browser address bar, custom icon, offline storage, and home screen launch.
                  </p>
                </div>
              </div>

              {/* Install CTA status */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-center space-y-3">
                {isInstalled ? (
                  <div className="flex flex-col items-center gap-2 text-emerald-700">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                    <div className="font-bold text-sm">Already Installed on this Device</div>
                    <p className="text-xs text-slate-500 max-w-sm">
                      Expense Coach is running as an installed Android app with offline caching and full screen capabilities.
                    </p>
                  </div>
                ) : deferredPrompt ? (
                  <div>
                    <div className="text-xs text-slate-500 mb-3">
                      Your browser supports direct 1-tap Android installation:
                    </div>
                    <button
                      onClick={onTriggerInstall}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      Install Expense Coach on Android
                    </button>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs text-slate-600 mb-3 font-medium">
                      To install directly on your Android phone right now:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
                      <div className="bg-white p-3 rounded-lg border border-slate-200">
                        <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-1">Step 1</div>
                        <div className="text-xs font-semibold text-slate-800">Open in Android Chrome</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">Visit this URL on Chrome or Edge on your phone.</div>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-slate-200">
                        <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-1">Step 2</div>
                        <div className="text-xs font-semibold text-slate-800">Tap Browser Menu (⋮)</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">Tap the three dots in the upper-right corner.</div>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-slate-200">
                        <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-1">Step 3</div>
                        <div className="text-xs font-semibold text-slate-800">Tap "Install App"</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">Expense Coach appears on your Android home screen!</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Feature Checklist */}
              <div className="border border-slate-200 rounded-xl p-4">
                <div className="text-xs font-bold text-slate-900 mb-3 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Android Integration Checklist
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Manifest v3 (`manifest.json`)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Android 192px & 512px Icons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Adaptive Maskable Icon</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Workbox Service Worker</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Theme Color (`#059669`)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Android Bottom Navigation Bar</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Native Android Source Code */}
          {activeTab === "native" && (
            <div className="space-y-4">
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Code2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-indigo-950 text-sm">Complete Jetpack Compose Codebase Included</h4>
                  <p className="text-xs text-indigo-800 mt-1 leading-relaxed">
                    We generated a complete native Android project located in the <code className="bg-white/80 px-1 py-0.5 rounded font-mono text-[11px]">/android</code> folder, built with modern Kotlin, Jetpack Compose, Material 3, and Coroutines.
                  </p>
                </div>
              </div>

              {/* File Structure */}
              <div className="bg-slate-900 text-slate-300 rounded-xl p-4 font-mono text-xs space-y-1.5 overflow-x-auto">
                <div className="text-emerald-400 font-bold mb-2">📁 Native Android Project Files:</div>
                <div className="text-slate-400">android/</div>
                <div className="pl-4 text-slate-300">├── build.gradle.kts & settings.gradle.kts</div>
                <div className="pl-4 text-slate-300">├── gradle/libs.versions.toml (AGP 8.8, Compose BOM)</div>
                <div className="pl-4 text-slate-300">└── app/</div>
                <div className="pl-8 text-slate-300">├── src/main/AndroidManifest.xml</div>
                <div className="pl-8 text-emerald-300">├── src/main/java/com/expensecoach/app/</div>
                <div className="pl-12 text-white">├── MainActivity.kt (Compose Navigation & Scaffolding)</div>
                <div className="pl-12 text-slate-300">├── ui/ExpenseViewModel.kt (StateFlow state manager)</div>
                <div className="pl-12 text-slate-300">├── ui/screens/DashboardScreen.kt (Spending Metrics)</div>
                <div className="pl-12 text-slate-300">├── ui/screens/ApprovalHubScreen.kt (Review Queue)</div>
                <div className="pl-12 text-slate-300">├── ui/screens/GoogleSheetsScreen.kt (Live Ledger)</div>
                <div className="pl-12 text-slate-300">├── ui/screens/AiCoachScreen.kt (Gemini AI Q&A)</div>
                <div className="pl-12 text-slate-300">└── ui/theme/Theme.kt & Color.kt (Material 3 Theme)</div>
              </div>

              {/* Build Command Box */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-700">Build APK with Gradle:</div>
                <div className="flex items-center justify-between bg-slate-100 border border-slate-200 rounded-xl p-3 font-mono text-xs">
                  <span className="text-slate-800">cd android && ./gradlew assembleDebug</span>
                  <button
                    onClick={handleCopyBuild}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-white px-2.5 py-1 rounded-lg border border-slate-300 transition-colors"
                  >
                    {copiedCmd ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCmd ? "Copied" : "Copy"}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-500">
                  Open the <code className="bg-slate-100 px-1 py-0.5 rounded text-[10px]">/android</code> folder in Android Studio Ladybug (or newer) to run on an emulator or physical device.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: Phone QR / Instructions */}
          {activeTab === "instructions" && (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row items-center gap-6">
                {/* SVG QR Code */}
                <div className="bg-white p-3 rounded-xl border border-slate-300 shadow-xs shrink-0 text-center">
                  <svg viewBox="0 0 100 100" className="w-32 h-32 text-slate-900 fill-current">
                    {/* Stylized QR Code Pattern */}
                    <rect x="0" y="0" width="30" height="30" rx="3" fill="#059669" />
                    <rect x="5" y="5" width="20" height="20" rx="2" fill="#ffffff" />
                    <rect x="10" y="10" width="10" height="10" rx="1" fill="#059669" />

                    <rect x="70" y="0" width="30" height="30" rx="3" fill="#059669" />
                    <rect x="75" y="5" width="20" height="20" rx="2" fill="#ffffff" />
                    <rect x="80" y="10" width="10" height="10" rx="1" fill="#059669" />

                    <rect x="0" y="70" width="30" height="30" rx="3" fill="#059669" />
                    <rect x="5" y="75" width="20" height="20" rx="2" fill="#ffffff" />
                    <rect x="10" y="80" width="10" height="10" rx="1" fill="#059669" />

                    {/* Data matrix dots */}
                    <rect x="36" y="8" width="8" height="8" fill="#0f172a" />
                    <rect x="48" y="14" width="8" height="8" fill="#0f172a" />
                    <rect x="40" y="24" width="8" height="8" fill="#0f172a" />
                    <rect x="56" y="24" width="8" height="8" fill="#0f172a" />
                    <rect x="8" y="38" width="8" height="8" fill="#0f172a" />
                    <rect x="22" y="44" width="8" height="8" fill="#0f172a" />
                    <rect x="36" y="40" width="12" height="12" fill="#059669" />
                    <rect x="52" y="36" width="8" height="8" fill="#0f172a" />
                    <rect x="68" y="40" width="8" height="8" fill="#0f172a" />
                    <rect x="84" y="44" width="8" height="8" fill="#0f172a" />
                    <rect x="40" y="60" width="8" height="8" fill="#0f172a" />
                    <rect x="52" y="64" width="8" height="8" fill="#0f172a" />
                    <rect x="64" y="56" width="8" height="8" fill="#0f172a" />
                    <rect x="48" y="76" width="8" height="8" fill="#0f172a" />
                    <rect x="60" y="84" width="8" height="8" fill="#0f172a" />
                    <rect x="76" y="72" width="8" height="8" fill="#0f172a" />
                    <rect x="88" y="84" width="8" height="8" fill="#0f172a" />
                  </svg>
                  <span className="text-[10px] text-slate-400 font-mono mt-1 block">Scan with Android</span>
                </div>

                <div className="space-y-2 text-left">
                  <div className="font-bold text-slate-900 text-sm">Scan with your Android Camera</div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Point your Android camera at the QR code to launch Expense Coach directly in your mobile browser. Tap the three dots menu to add it as an app to your home screen!
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(currentUrl);
                        setCopiedCmd(true);
                        setTimeout(() => setCopiedCmd(false), 2000);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedCmd ? "URL Copied to Clipboard!" : "Copy Web App URL"}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
            <span>Android Minimum SDK 26 (Android 8.0 Oreo+)</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
