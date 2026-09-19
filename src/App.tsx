import React, { useState, useEffect } from "react";
import { 
  Header 
} from "./components/Header";
import { 
  MetricCards 
} from "./components/MetricCards";
import { 
  SpendingCharts 
} from "./components/SpendingCharts";
import { 
  ApprovalHub 
} from "./components/ApprovalHub";
import { 
  GoogleSheetsView 
} from "./components/GoogleSheetsView";
import { 
  AiCoachSearch 
} from "./components/AiCoachSearch";
import { 
  ReceiptInboxModal 
} from "./components/ReceiptInboxModal";
import { 
  EditExpenseModal 
} from "./components/EditExpenseModal";
import { 
  ManualReceiptModal 
} from "./components/ManualReceiptModal";
import { 
  AndroidAppModal 
} from "./components/AndroidAppModal";
import { 
  AndroidBottomNav 
} from "./components/AndroidBottomNav";
import { 
  SAMPLE_RECEIPT_EMAILS, 
  INITIAL_SYNCED_EXPENSES,
  CATEGORY_COLORS 
} from "./mockData";
import { 
  ExpenseTransaction, 
  SampleEmailReceipt, 
  ExpenseCategory 
} from "./types";
import { 
  Mail, 
  Sparkles, 
  FileSpreadsheet, 
  ArrowRight, 
  CheckCircle2, 
  RefreshCw, 
  Layers, 
  ShieldCheck,
  Zap,
  ExternalLink,
  Bot
} from "lucide-react";
import confetti from "canvas-confetti";

export default function App() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "approval" | "sheets" | "aicoach">("dashboard");
  const [transactions, setTransactions] = useState<ExpenseTransaction[]>(INITIAL_SYNCED_EXPENSES);
  const [sampleEmails, setSampleEmails] = useState<SampleEmailReceipt[]>(SAMPLE_RECEIPT_EMAILS);
  
  // Modals
  const [isInboxModalOpen, setIsInboxModalOpen] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isAndroidModalOpen, setIsAndroidModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<ExpenseTransaction | null>(null);
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);

  // Android PWA Install state
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if running standalone (WebAPK on Android)
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleTriggerInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    }
  };

  // Scan state
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState<string | null>(null);

  const pendingTransactions = transactions.filter(
    (t) => t.status === "pending_review" || t.status === "approved"
  );
  const syncedTransactions = transactions.filter(
    (t) => t.status === "synced_to_sheets"
  );

  // Handle Full Demo Scan
  const handleRunDemoScan = async () => {
    setIsScanning(true);
    setScanProgress("Searching Gmail: receipt OR invoice OR order OR purchase...");

    // Pick unscanned or unextracted emails
    const existingMsgIds = new Set(transactions.map((t) => t.gmailMessageId));
    const emailsToProcess = sampleEmails.filter((e) => !existingMsgIds.has(e.id));

    // If all are already processed, reset with fresh copy so demo is reusable infinite times
    const pool = emailsToProcess.length > 0 ? emailsToProcess : sampleEmails.slice(0, 5);

    try {
      const newExtracted: ExpenseTransaction[] = [];

      for (let i = 0; i < pool.length; i++) {
        const email = pool[i];
        setScanProgress(`Analyzing receipt ${i + 1}/${pool.length}: ${email.expectedMerchant} with Gemini AI...`);

        try {
          const res = await fetch("/api/extract-receipt", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              rawText: email.rawBody,
              subject: email.subject,
              senderEmail: email.sender,
              messageId: email.id,
            }),
          });

          if (res.ok) {
            const data = await res.json();
            newExtracted.push({
              id: `exp_${Date.now()}_${i}`,
              merchant: data.merchant || email.expectedMerchant,
              amount: Number(data.amount) || email.expectedAmount,
              currency: data.currency || "USD",
              date: data.date || email.date,
              category: (data.category as ExpenseCategory) || email.expectedCategory,
              description: data.description || email.subject,
              confidence: Number(data.confidence) || 0.95,
              gmailMessageId: email.id,
              senderEmail: email.sender,
              orderId: data.orderId,
              isSubscription: !!data.isSubscription,
              status: "pending_review",
            });
          }
        } catch (e) {
          // Fallback if network interrupted
          newExtracted.push({
            id: `exp_${Date.now()}_${i}`,
            merchant: email.expectedMerchant,
            amount: email.expectedAmount,
            currency: "USD",
            date: email.date,
            category: email.expectedCategory,
            description: email.subject,
            confidence: 0.94,
            gmailMessageId: email.id,
            senderEmail: email.sender,
            status: "pending_review",
          });
        }
      }

      // Add to transactions (avoiding duplicate message IDs)
      setTransactions((prev) => {
        const existing = new Set(prev.map((t) => t.gmailMessageId));
        const filteredNew = newExtracted.filter((t) => !existing.has(t.gmailMessageId));
        return [...filteredNew, ...prev];
      });

      // Switch to Review Hub so user sees "We found X potential expenses."
      setActiveTab("approval");
    } finally {
      setIsScanning(false);
      setScanProgress(null);
    }
  };

  // Extract single email from inbox modal
  const handleExtractSingle = async (email: SampleEmailReceipt) => {
    setIsScanning(true);
    try {
      const res = await fetch("/api/extract-receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawText: email.rawBody,
          subject: email.subject,
          senderEmail: email.sender,
          messageId: email.id,
        }),
      });

      const data = await res.json();
      const newTx: ExpenseTransaction = {
        id: `exp_${Date.now()}`,
        merchant: data.merchant || email.expectedMerchant,
        amount: Number(data.amount) || email.expectedAmount,
        currency: data.currency || "USD",
        date: data.date || email.date,
        category: (data.category as ExpenseCategory) || email.expectedCategory,
        description: data.description || email.subject,
        confidence: Number(data.confidence) || 0.95,
        gmailMessageId: email.id,
        senderEmail: email.sender,
        orderId: data.orderId,
        isSubscription: !!data.isSubscription,
        status: "pending_review",
      };

      setTransactions((prev) => [newTx, ...prev.filter((t) => t.gmailMessageId !== email.id)]);
      setIsInboxModalOpen(false);
      setActiveTab("approval");
    } finally {
      setIsScanning(false);
    }
  };

  // Transaction Actions
  const handleApprove = (id: string) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "approved" as const } : t))
    );
  };

  const handleApproveAll = () => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.status === "pending_review" ? { ...t, status: "approved" as const } : t
      )
    );
  };

  const handleIgnore = (id: string) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "ignored" as const } : t))
    );
  };

  const handleSaveEdit = (updated: ExpenseTransaction) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === updated.id ? updated : t))
    );
  };

  const handleSyncToSheets = () => {
    const timestamp = new Date().toISOString();
    setTransactions((prev) =>
      prev.map((t) =>
        t.status === "approved"
          ? { ...t, status: "synced_to_sheets" as const, syncedAt: timestamp }
          : t
      )
    );
  };

  const handleViewEmail = (msgId: string) => {
    setSelectedEmailId(msgId);
    setIsInboxModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      {/* Sticky Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingCount={pendingTransactions.length}
        syncedCount={syncedTransactions.length}
        onRunDemoScan={handleRunDemoScan}
        isScanning={isScanning}
        onOpenManualModal={() => setIsManualModalOpen(true)}
        onOpenAndroidModal={() => setIsAndroidModalOpen(true)}
      />

      {/* Main Container */}
      <main className="grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-6 space-y-6 w-full">
        {/* Landing Hero Bar (Startup Feel as requested) */}
        {activeTab === "dashboard" && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-2.5 border border-emerald-200/80">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Zero-Manual-Entry Personal Expense Pipeline
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Turn your inbox into your expense tracker.
              </h1>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Expense Coach finds your receipts, understands your spending with AI, and automatically organizes everything into Google Sheets.
              </p>

              {/* Primary & Secondary CTAs from user prompt */}
              <div className="flex flex-wrap items-center gap-3 mt-5">
                <button
                  onClick={handleRunDemoScan}
                  disabled={isScanning}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 shadow-sm shadow-emerald-600/30 transition-all cursor-pointer"
                >
                  <Mail className="w-4 h-4 text-white" />
                  <span>{isScanning ? "Scanning Receipts..." : "Connect Gmail & Scan"}</span>
                </button>

                <button
                  onClick={() => setIsInboxModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  <span>Explore Sample Receipts (10)</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Quick Pipeline Flow Badges */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 w-full lg:w-auto shrink-0 space-y-2 text-xs">
              <div className="font-bold text-slate-800 flex items-center gap-1.5 mb-2">
                <Zap className="w-4 h-4 text-emerald-600" />
                Automated 4-Step Pipeline
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[10px]">1</span>
                <span>Gmail Search: <code className="bg-white px-1 py-0.5 rounded border border-slate-200 text-[10px]">receipt OR purchase</code></span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[10px]">2</span>
                <span>Gemini 3.8 Flash extracts items & category</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[10px]">3</span>
                <span>User Review Hub (Approve / Edit / Ignore)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[10px]">4</span>
                <span>Auto-writes row into Google Sheets</span>
              </div>
            </div>
          </div>
        )}

        {/* Scan Progress Toast */}
        {scanProgress && (
          <div className="p-3 bg-emerald-950 text-emerald-100 rounded-xl flex items-center gap-3 text-xs font-medium shadow-lg animate-pulse border border-emerald-800">
            <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin shrink-0" />
            <span>{scanProgress}</span>
          </div>
        )}

        {/* Tab Content 1: Dashboard */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <MetricCards transactions={transactions} />
            <SpendingCharts transactions={transactions} />

            {/* Recent Verified Transactions Table */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Recent Receipts in Ledger</h3>
                  <p className="text-xs text-slate-500">Live verified transactions synchronized to Google Sheets</p>
                </div>
                <button
                  onClick={() => setActiveTab("sheets")}
                  className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700"
                >
                  <span>View All in Google Sheets</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {syncedTransactions.slice(0, 6).map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between hover:bg-slate-50/80 px-2 rounded-lg transition-colors">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                        style={{ backgroundColor: CATEGORY_COLORS[item.category] || "#10B981" }}
                      >
                        {item.merchant.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                          {item.merchant}
                          {item.isSubscription && (
                            <span className="text-[10px] font-medium bg-teal-50 text-teal-700 px-1.5 py-0.2 rounded border border-teal-200">
                              Subscription
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400">{item.description} &bull; {item.date}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-bold text-slate-900">${item.amount.toFixed(2)}</div>
                      <div className="text-[10px] text-slate-400">
                        {item.category}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab Content 2: Review & Approval Hub */}
        {activeTab === "approval" && (
          <ApprovalHub
            transactions={transactions}
            onApprove={handleApprove}
            onApproveAll={handleApproveAll}
            onIgnore={handleIgnore}
            onEdit={(tx) => setEditingTransaction(tx)}
            onSyncToSheets={handleSyncToSheets}
            isSyncing={false}
            onViewEmail={handleViewEmail}
          />
        )}

        {/* Tab Content 3: Google Sheets Live Ledger */}
        {activeTab === "sheets" && (
          <GoogleSheetsView
            transactions={transactions}
            onViewEmail={handleViewEmail}
          />
        )}

        {/* Tab Content 4: AI Coach & Search */}
        {activeTab === "aicoach" && (
          <AiCoachSearch transactions={transactions} />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">Expense Coach</span>
            <span>&bull;</span>
            <span>Hackathon MVP Edition</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Powered by Gmail API &bull; Gemini 3.8 Flash &bull; Google Sheets API &bull; React & Tailwind
          </p>
        </div>
      </footer>

      {/* Android Mobile Touch Bottom Navigation */}
      <AndroidBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingCount={pendingTransactions.length}
        onOpenManualModal={() => setIsManualModalOpen(true)}
      />

      {/* Modals */}
      <AndroidAppModal
        isOpen={isAndroidModalOpen}
        onClose={() => setIsAndroidModalOpen(false)}
        deferredPrompt={deferredPrompt}
        onTriggerInstall={handleTriggerInstall}
        isInstalled={isInstalled}
      />

      <ReceiptInboxModal
        isOpen={isInboxModalOpen}
        onClose={() => setIsInboxModalOpen(false)}
        sampleEmails={sampleEmails}
        selectedEmailId={selectedEmailId}
        onSelectEmail={(id) => setSelectedEmailId(id)}
        onExtractSingle={handleExtractSingle}
        isExtracting={isScanning}
      />

      <EditExpenseModal
        isOpen={!!editingTransaction}
        onClose={() => setEditingTransaction(null)}
        transaction={editingTransaction}
        onSave={handleSaveEdit}
      />

      <ManualReceiptModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        onAddTransaction={(tx) => {
          setTransactions((prev) => [tx, ...prev]);
          setActiveTab("approval");
        }}
      />
    </div>
  );
}
