import React, { useState } from "react";
import { X, Sparkles, Receipt, ArrowRight } from "lucide-react";
import { ExpenseTransaction, ExpenseCategory } from "../types";

interface ManualReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction: (transaction: ExpenseTransaction) => void;
}

export function ManualReceiptModal({
  isOpen,
  onClose,
  onAddTransaction,
}: ManualReceiptModalProps) {
  if (!isOpen) return null;

  const [subject, setSubject] = useState("Your Apple Store Order Receipt — iPhone Case");
  const [sender, setSender] = useState("order-notification@apple.com");
  const [rawText, setRawText] = useState(
`Apple Store Receipt
Order Number: W849102849
Date: September 18, 2026

iPhone 16 Pro Silicone Case with MagSafe - Denim
Qty: 1
Price: $49.00

Subtotal: $49.00
Sales Tax: $4.35
Total Paid: $53.35

Payment Method: Apple Card (Mastercard ending in 1904)
Ships to: Awais Raza`
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRunExtraction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawText.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/extract-receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawText,
          subject,
          senderEmail: sender,
          messageId: `msg_manual_${Date.now()}`,
        }),
      });

      if (!res.ok) {
        throw new Error("Extraction endpoint error");
      }

      const data = await res.json();

      const newExpense: ExpenseTransaction = {
        id: `exp_${Date.now()}`,
        merchant: data.merchant || "Unknown Store",
        amount: Number(data.amount) || 0,
        currency: data.currency || "USD",
        date: data.date || new Date().toISOString().split("T")[0],
        category: (data.category as ExpenseCategory) || "Shopping",
        description: data.description || "Manual receipt entry",
        confidence: Number(data.confidence) || 0.9,
        gmailMessageId: data.messageId || `msg_manual_${Date.now()}`,
        senderEmail: sender,
        orderId: data.orderId || "",
        isSubscription: !!data.isSubscription,
        status: "pending_review",
      };

      onAddTransaction(newExpense);
      onClose();
    } catch (err: any) {
      setError("Extraction failed. Please check inputs and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200">
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Add Custom Receipt Email</h3>
              <p className="text-[10px] text-slate-400">Gemini 3.8 Flash LLM extraction</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleRunExtraction} className="p-5 space-y-3.5 text-xs">
          {error && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Email Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Your Uber receipt from Friday"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Sender Email</label>
            <input
              type="email"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              placeholder="e.g. receipts@uber.com"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Receipt / Invoice Text Body
            </label>
            <textarea
              rows={6}
              required
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Paste raw email body, items list, or payment confirmation text..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none select-text"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !rawText.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-xs transition-all disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isLoading ? "Analyzing..." : "Extract with AI"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
