import { useState } from "react";
import { 
  Receipt, 
  FileSpreadsheet, 
  Sparkles, 
  Mail, 
  CheckCircle2, 
  Plus, 
  RefreshCw,
  SlidersHorizontal,
  Bot,
  Smartphone
} from "lucide-react";

interface HeaderProps {
  activeTab: "dashboard" | "approval" | "sheets" | "aicoach";
  setActiveTab: (tab: "dashboard" | "approval" | "sheets" | "aicoach") => void;
  pendingCount: number;
  syncedCount: number;
  onRunDemoScan: () => void;
  isScanning: boolean;
  onOpenManualModal: () => void;
  onOpenAndroidModal: () => void;
}

export function Header({
  activeTab,
  setActiveTab,
  pendingCount,
  syncedCount,
  onRunDemoScan,
  isScanning,
  onOpenManualModal,
  onOpenAndroidModal,
}: HeaderProps) {
  const [showStatusTooltip, setShowStatusTooltip] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Product Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-500/20">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-slate-900">Expense Coach</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  Gemini AI
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Gmail Receipts → AI Categorization → Google Sheets</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "dashboard"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab("approval")}
              className={`relative px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === "approval"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
              }`}
            >
              Review Hub
              {pendingCount > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-500 text-white">
                  {pendingCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("sheets")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === "sheets"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              Google Sheets
              <span className="text-[10px] font-semibold text-slate-400">({syncedCount})</span>
            </button>
            <button
              onClick={() => setActiveTab("aicoach")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === "aicoach"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-indigo-600" />
              Ask AI Coach
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Android App Button */}
            <button
              onClick={onOpenAndroidModal}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300/80 rounded-lg shadow-2xs transition-all"
              title="Android App (WebAPK & Native Kotlin Compose)"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
              <span>Android App</span>
            </button>

            {/* Status indicators */}
            <div 
              className="relative hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer"
              onMouseEnter={() => setShowStatusTooltip(true)}
              onMouseLeave={() => setShowStatusTooltip(false)}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-medium text-slate-700">Gmail: Ready</span>
                <span className="text-slate-300">|</span>
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-medium text-slate-700">Sheets: Synced</span>
              </div>

              {showStatusTooltip && (
                <div className="absolute right-0 top-9 w-64 p-3 bg-white rounded-xl shadow-xl border border-slate-200 text-xs text-slate-600 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="font-semibold text-slate-900 mb-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Integration Status
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-500">
                    Live demo environment with simulated Gmail receipt scanner, Gemini 3.8 Flash LLM extraction, and auto-syncing to Google Sheets spreadsheet.
                  </p>
                </div>
              )}
            </div>

            {/* Quick add / paste receipt */}
            <button
              onClick={onOpenManualModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-2xs transition-colors"
              title="Paste email text or enter manual receipt"
            >
              <Plus className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Add Receipt</span>
            </button>

            {/* Run Demo Scan CTA */}
            <button
              onClick={onRunDemoScan}
              disabled={isScanning}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-75 rounded-lg shadow-xs shadow-emerald-600/25 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? "animate-spin" : ""}`} />
              <span>{isScanning ? "Scanning..." : "Scan Demo Inbox"}</span>
            </button>
          </div>
        </div>

        {/* Mobile Top Navigation bar */}
        <div className="flex md:hidden border-t border-slate-100 py-2 space-x-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap ${
              activeTab === "dashboard" ? "bg-slate-900 text-white" : "text-slate-600 bg-slate-100"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("approval")}
            className={`px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap flex items-center gap-1 ${
              activeTab === "approval" ? "bg-slate-900 text-white" : "text-slate-600 bg-slate-100"
            }`}
          >
            Review ({pendingCount})
          </button>
          <button
            onClick={() => setActiveTab("sheets")}
            className={`px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap flex items-center gap-1 ${
              activeTab === "sheets" ? "bg-slate-900 text-white" : "text-slate-600 bg-slate-100"
            }`}
          >
            Sheets ({syncedCount})
          </button>
          <button
            onClick={() => setActiveTab("aicoach")}
            className={`px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap flex items-center gap-1 ${
              activeTab === "aicoach" ? "bg-slate-900 text-white" : "text-slate-600 bg-slate-100"
            }`}
          >
            Ask AI
          </button>
        </div>
      </div>
    </header>
  );
}
