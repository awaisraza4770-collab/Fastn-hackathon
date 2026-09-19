import React, { useState } from "react";
import { 
  Check, 
  X, 
  Edit3, 
  FileSpreadsheet, 
  CheckCheck, 
  AlertTriangle, 
  Sparkles, 
  Mail, 
  ArrowRight,
  Info
} from "lucide-react";
import confetti from "canvas-confetti";
import { ExpenseTransaction, ExpenseCategory } from "../types";
import { CATEGORY_COLORS } from "../mockData";

interface ApprovalHubProps {
  transactions: ExpenseTransaction[];
  onApprove: (id: string) => void;
  onApproveAll: () => void;
  onIgnore: (id: string) => void;
  onEdit: (transaction: ExpenseTransaction) => void;
  onSyncToSheets: () => void;
  isSyncing: boolean;
  onViewEmail: (msgId: string) => void;
}

export function ApprovalHub({
  transactions,
  onApprove,
  onApproveAll,
  onIgnore,
  onEdit,
  onSyncToSheets,
  isSyncing,
  onViewEmail,
}: ApprovalHubProps) {
  // Pending review or approved (not yet synced to sheets)
  const pendingItems = transactions.filter(
    (t) => t.status === "pending_review" || t.status === "approved"
  );
  const approvedItems = transactions.filter((t) => t.status === "approved");

  const handleSyncWithCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
      colors: ["#10B981", "#3B82F6", "#F59E0B", "#10B981"],
    });
    onSyncToSheets();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Top Banner Header */}
      <div className="p-6 bg-slate-50/70 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-1">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            AI Extraction Review
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            We found {pendingItems.length} potential expense{pendingItems.length === 1 ? "" : "s"}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Parsed from your Gmail inbox. Verify or edit categories before syncing to Google Sheets.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {pendingItems.length > 0 && (
            <button
              onClick={onApproveAll}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-2xs transition-all"
            >
              <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
              Approve All ({pendingItems.length})
            </button>
          )}

          <button
            onClick={handleSyncWithCelebration}
            disabled={isSyncing || approvedItems.length === 0}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm ${
              approvedItems.length > 0
                ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30 active:scale-95"
                : "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-100" />
            <span>Sync to Google Sheets</span>
            {approvedItems.length > 0 && (
              <span className="bg-emerald-700 text-emerald-100 px-1.5 py-0.2 text-[10px] rounded-full">
                {approvedItems.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Table of pending items */}
      {pendingItems.length === 0 ? (
        <div className="py-16 text-center px-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
            <CheckCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-sm">All caught up!</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            All detected receipts have been reviewed and synchronized into your Google Sheets ledger.
          </p>
          <div className="mt-4">
            <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-semibold bg-emerald-50 px-3 py-1 rounded-lg">
              Check the "Google Sheets" tab to view your full live ledger.
            </span>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Merchant</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pendingItems.map((item) => {
                const isNeedsReview = item.confidence < 0.85;
                const isApproved = item.status === "approved";

                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      isApproved ? "bg-emerald-50/30" : ""
                    }`}
                  >
                    {/* Merchant */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        {item.merchant}
                        {item.isSubscription && (
                          <span className="text-[10px] font-semibold bg-teal-50 text-teal-700 px-1.5 py-0.2 rounded-md border border-teal-200">
                            Recurring
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[200px]" title={item.description}>
                        {item.description}
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-slate-600 font-medium whitespace-nowrap">
                      {item.date}
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                      ${item.amount.toFixed(2)}
                      <span className="text-[10px] font-normal text-slate-400 ml-1">{item.currency}</span>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold"
                        style={{
                          backgroundColor: `${CATEGORY_COLORS[item.category] || "#64748B"}15`,
                          color: CATEGORY_COLORS[item.category] || "#64748B",
                        }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: CATEGORY_COLORS[item.category] || "#64748B" }}
                        />
                        {item.category}
                      </span>
                    </td>

                    {/* Confidence */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {isNeedsReview ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          Needs Review
                        </span>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <div className="w-12 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-emerald-500 h-full rounded-full"
                              style={{ width: `${Math.round(item.confidence * 100)}%` }}
                            />
                          </div>
                          <span className="text-[11px] font-semibold text-slate-600">
                            {Math.round(item.confidence * 100)}%
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Source / Gmail Email Link */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <button
                        onClick={() => onViewEmail(item.gmailMessageId)}
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-slate-800 hover:underline cursor-pointer"
                        title="View original Gmail receipt body"
                      >
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span>Email View</span>
                      </button>
                    </td>

                    {/* Actions: Approve / Edit / Ignore */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        {/* Approve Button */}
                        <button
                          onClick={() => onApprove(item.id)}
                          className={`p-1.5 rounded-md transition-all ${
                            isApproved
                              ? "bg-emerald-600 text-white shadow-2xs"
                              : "text-slate-500 hover:text-emerald-700 hover:bg-emerald-50"
                          }`}
                          title={isApproved ? "Approved (Ready to Sync)" : "Approve this transaction"}
                        >
                          <Check className="w-4 h-4" />
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={() => onEdit(item)}
                          className="p-1.5 rounded-md text-slate-500 hover:text-blue-700 hover:bg-blue-50 transition-all"
                          title="Edit merchant, amount, or category"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        {/* Ignore Button */}
                        <button
                          onClick={() => onIgnore(item.id)}
                          className="p-1.5 rounded-md text-slate-400 hover:text-rose-700 hover:bg-rose-50 transition-all"
                          title="Ignore (Exclude from Google Sheets)"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer Info Notice */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 text-slate-500 text-xs flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>
            Checking <strong>Gmail Message ID</strong> prevents duplicate entries from being written twice.
          </span>
        </div>
        <div className="text-[11px] font-medium text-slate-500">
          Ready to sync: <strong className="text-emerald-700 font-bold">{approvedItems.length}</strong> items
        </div>
      </div>
    </div>
  );
}
