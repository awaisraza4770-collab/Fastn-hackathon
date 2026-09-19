import React, { useState } from "react";
import { 
  FileSpreadsheet, 
  Download, 
  Search, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle,
  Copy,
  TableProperties,
  Sparkles
} from "lucide-react";
import { ExpenseTransaction } from "../types";
import { CATEGORY_COLORS } from "../mockData";

interface GoogleSheetsViewProps {
  transactions: ExpenseTransaction[];
  spreadsheetName?: string;
  onViewEmail: (msgId: string) => void;
}

export function GoogleSheetsView({
  transactions,
  spreadsheetName = "Expenses — Personal Tracking 2026",
  onViewEmail,
}: GoogleSheetsViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedCell, setCopiedCell] = useState<string | null>(null);

  // Only transactions that have been synced to the sheet
  const syncedTransactions = transactions.filter(
    (t) => t.status === "synced_to_sheets"
  );

  const filtered = syncedTransactions.filter((t) => {
    const q = searchQuery.toLowerCase();
    return (
      t.merchant.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.date.includes(q) ||
      t.gmailMessageId.toLowerCase().includes(q)
    );
  });

  const totalSum = syncedTransactions.reduce((acc, t) => acc + t.amount, 0);

  // Check for duplicate detection
  const messageIdCounts: Record<string, number> = {};
  syncedTransactions.forEach((t) => {
    messageIdCounts[t.gmailMessageId] = (messageIdCounts[t.gmailMessageId] || 0) + 1;
  });

  // Export to CSV feature
  const exportToCSV = () => {
    const headers = [
      "Date",
      "Merchant",
      "Amount",
      "Currency",
      "Category",
      "Description",
      "Confidence",
      "Gmail Message ID",
      "Order ID",
      "Sender Email"
    ];

    const rows = syncedTransactions.map((t) => [
      `"${t.date}"`,
      `"${t.merchant.replace(/"/g, '""')}"`,
      t.amount.toFixed(2),
      `"${t.currency}"`,
      `"${t.category}"`,
      `"${t.description.replace(/"/g, '""')}"`,
      (t.confidence * 100).toFixed(1) + "%",
      `"${t.gmailMessageId}"`,
      `"${t.orderId || ""}"`,
      `"${t.senderEmail || ""}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `expenses_coach_ledger_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyCellContent = (text: string, cellKey: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedCell(cellKey);
    setTimeout(() => setCopiedCell(null), 1500);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Sheets Top Bar */}
      <div className="bg-[#0F9D58]/10 border-b border-[#0F9D58]/20 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0F9D58] flex items-center justify-center text-white shadow-sm">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-base text-slate-900">{spreadsheetName}</h2>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0F9D58] bg-[#0F9D58]/10 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3 h-3" />
                Live Cloud Sheet
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Columns: Date | Merchant | Amount | Currency | Category | Description | Confidence | Gmail Message ID
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search ledger..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F9D58] w-36 sm:w-48"
            />
          </div>

          {/* Export to CSV */}
          <button
            onClick={exportToCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-2xs transition-colors"
            title="Download CSV spreadsheet file"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Google Sheets Formula Bar Simulation */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex items-center gap-3 text-xs font-mono text-slate-600">
        <div className="px-2 py-0.5 bg-white border border-slate-300 rounded text-slate-700 font-bold shrink-0">
          fx
        </div>
        <div className="bg-white border border-slate-200 rounded px-3 py-1 grow text-slate-800 text-xs overflow-x-auto whitespace-nowrap">
          =SUM(C2:C{syncedTransactions.length + 1}) &rarr; <span className="font-bold text-[#0F9D58]">${totalSum.toFixed(2)} USD</span>
        </div>
        <div className="text-[11px] text-slate-400 hidden md:block shrink-0">
          Tab: <span className="font-semibold text-slate-700">Expenses</span> ({syncedTransactions.length} rows)
        </div>
      </div>

      {/* Spreadsheet Grid Table */}
      <div className="overflow-x-auto max-h-[500px]">
        <table className="w-full text-left text-xs border-collapse font-sans">
          {/* Column identifiers (A, B, C, D...) */}
          <thead>
            <tr className="bg-slate-100 text-slate-400 text-[10px] font-mono border-b border-slate-200 select-none">
              <th className="w-10 text-center py-1 bg-slate-200/60 border-r border-slate-300">#</th>
              <th className="py-1 px-3 border-r border-slate-200">A (Date)</th>
              <th className="py-1 px-3 border-r border-slate-200">B (Merchant)</th>
              <th className="py-1 px-3 border-r border-slate-200">C (Amount)</th>
              <th className="py-1 px-3 border-r border-slate-200">D (Currency)</th>
              <th className="py-1 px-3 border-r border-slate-200">E (Category)</th>
              <th className="py-1 px-3 border-r border-slate-200">F (Description)</th>
              <th className="py-1 px-3 border-r border-slate-200">G (Confidence)</th>
              <th className="py-1 px-3">H (Gmail Message ID)</th>
            </tr>
            {/* Header row 1 */}
            <tr className="bg-slate-50 font-bold text-slate-700 border-b border-slate-300 select-none">
              <td className="text-center py-2 bg-slate-200/50 border-r border-slate-300 font-mono text-[10px] text-slate-400">1</td>
              <td className="py-2 px-3 border-r border-slate-200 font-semibold text-slate-800">Date</td>
              <td className="py-2 px-3 border-r border-slate-200 font-semibold text-slate-800">Merchant</td>
              <td className="py-2 px-3 border-r border-slate-200 font-semibold text-slate-800">Amount</td>
              <td className="py-2 px-3 border-r border-slate-200 font-semibold text-slate-800">Currency</td>
              <td className="py-2 px-3 border-r border-slate-200 font-semibold text-slate-800">Category</td>
              <td className="py-2 px-3 border-r border-slate-200 font-semibold text-slate-800">Description</td>
              <td className="py-2 px-3 border-r border-slate-200 font-semibold text-slate-800">Confidence</td>
              <td className="py-2 px-3 font-semibold text-slate-800">Gmail Message ID</td>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-400 text-xs">
                  {searchQuery ? "No transactions matched your search query." : "No synced expenses yet. Approve items in the Review Hub to populate Google Sheets."}
                </td>
              </tr>
            ) : (
              filtered.map((t, index) => {
                const rowNum = index + 2;
                const isDuplicate = (messageIdCounts[t.gmailMessageId] || 0) > 1;

                return (
                  <tr key={t.id} className="hover:bg-blue-50/40 transition-colors group">
                    {/* Row Number */}
                    <td className="text-center py-2 bg-slate-100/60 border-r border-slate-300 font-mono text-[10px] text-slate-400 select-none">
                      {rowNum}
                    </td>

                    {/* Column A: Date */}
                    <td className="py-2 px-3 border-r border-slate-200 font-mono text-[11px] text-slate-700 whitespace-nowrap">
                      {t.date}
                    </td>

                    {/* Column B: Merchant */}
                    <td className="py-2 px-3 border-r border-slate-200 font-semibold text-slate-900 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span>{t.merchant}</span>
                        {t.isSubscription && (
                          <span className="text-[9px] font-bold text-teal-700 bg-teal-50 px-1 py-0.2 rounded border border-teal-200">
                            Sub
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Column C: Amount */}
                    <td className="py-2 px-3 border-r border-slate-200 font-mono text-[11px] font-bold text-slate-900 text-right whitespace-nowrap">
                      ${t.amount.toFixed(2)}
                    </td>

                    {/* Column D: Currency */}
                    <td className="py-2 px-3 border-r border-slate-200 text-slate-600 font-mono text-[11px] whitespace-nowrap">
                      {t.currency}
                    </td>

                    {/* Column E: Category */}
                    <td className="py-2 px-3 border-r border-slate-200 whitespace-nowrap">
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold"
                        style={{
                          backgroundColor: `${CATEGORY_COLORS[t.category] || "#64748B"}15`,
                          color: CATEGORY_COLORS[t.category] || "#64748B",
                        }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: CATEGORY_COLORS[t.category] || "#64748B" }}
                        />
                        {t.category}
                      </span>
                    </td>

                    {/* Column F: Description */}
                    <td className="py-2 px-3 border-r border-slate-200 text-slate-600 text-[11px] max-w-[220px] truncate" title={t.description}>
                      {t.description}
                    </td>

                    {/* Column G: Confidence */}
                    <td className="py-2 px-3 border-r border-slate-200 font-mono text-[11px] text-slate-700 whitespace-nowrap">
                      {(t.confidence * 100).toFixed(1)}%
                    </td>

                    {/* Column H: Gmail Message ID */}
                    <td className="py-2 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      <div className="flex items-center justify-between gap-2">
                        <button
                          onClick={() => onViewEmail(t.gmailMessageId)}
                          className="hover:text-blue-600 hover:underline cursor-pointer"
                          title="Click to view original email"
                        >
                          {t.gmailMessageId}
                        </button>

                        <button
                          onClick={() => copyCellContent(t.gmailMessageId, `msg_${t.id}`)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-slate-700"
                          title="Copy ID"
                        >
                          {copiedCell === `msg_${t.id}` ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Sheets Bottom Sheet Bar (Tab list and totals) */}
      <div className="bg-slate-100 border-t border-slate-200 px-4 py-2 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="bg-white border-b-2 border-[#0F9D58] px-4 py-1 font-semibold text-slate-800 rounded-t shadow-2xs">
            Expenses
          </div>
          <div className="px-3 py-1 text-slate-500 hover:bg-slate-200/60 rounded cursor-not-allowed">
            Summary (Pivot)
          </div>
          <div className="px-3 py-1 text-slate-500 hover:bg-slate-200/60 rounded cursor-not-allowed">
            Category Breakdown
          </div>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-slate-600">
          <span>
            Total Synced: <strong className="text-slate-900">${totalSum.toFixed(2)}</strong>
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-emerald-700 font-medium">
            Duplication Check: Active
          </span>
        </div>
      </div>
    </div>
  );
}
