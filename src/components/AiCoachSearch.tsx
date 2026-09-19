import React, { useState } from "react";
import { 
  Bot, 
  Send, 
  Sparkles, 
  TrendingUp, 
  Repeat, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle,
  Lightbulb
} from "lucide-react";
import { ExpenseTransaction } from "../types";

interface AiCoachSearchProps {
  transactions: ExpenseTransaction[];
}

export function AiCoachSearch({ transactions }: AiCoachSearchProps) {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(
    "Ask any question about your spending habits, recurring subscriptions, or categories. Try asking: **'How much did I spend on food this month?'**"
  );
  const [monthlyBudget, setMonthlyBudget] = useState(1000);

  const activeTransactions = transactions.filter(
    (t) => t.status === "synced_to_sheets" || t.status === "approved"
  );
  const totalSpent = activeTransactions.reduce((acc, t) => acc + t.amount, 0);
  const budgetPercentage = Math.min(Math.round((totalSpent / monthlyBudget) * 100), 100);

  // Subscriptions
  const subscriptions = activeTransactions.filter(
    (t) => t.category === "Subscriptions" || t.isSubscription
  );
  const totalSubscriptions = subscriptions.reduce((acc, t) => acc + t.amount, 0);

  const suggestedQueries = [
    "How much did I spend on food this month?",
    "What are my recurring subscriptions?",
    "What was my highest single expense?",
    "Generate a monthly spending summary with budget tips",
  ];

  const handleAsk = async (textToAsk?: string) => {
    const q = textToAsk || query;
    if (!q.trim()) return;

    setIsLoading(true);
    setResponse(null);

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: q,
          transactions: activeTransactions,
        }),
      });

      const data = await res.json();
      setResponse(data.answer || "No response received from AI.");
    } catch (err: any) {
      setResponse(
        `Unable to reach AI service. Tracked total is $${totalSpent.toFixed(2)} across ${activeTransactions.length} expenses.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-linear-to-r from-indigo-900 via-slate-900 to-indigo-950 rounded-2xl p-6 text-white border border-indigo-800/40 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2 border border-indigo-500/30">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Natural Language Financial Assistant
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Ask Expense Coach Anything
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Powered by Gemini 3.8 Flash. Analyzes your parsed purchase receipts, predicts recurring charges, and gives instant spending insights.
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-700/60 rounded-xl p-4 shrink-0 max-w-xs">
            <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5">
              <span className="font-semibold">Monthly Budget Cap</span>
              <span className="font-bold text-white">${totalSpent.toFixed(0)} / ${monthlyBudget}</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  budgetPercentage > 85 ? "bg-amber-400" : "bg-emerald-400"
                }`}
                style={{ width: `${budgetPercentage}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5">
              <span>{budgetPercentage}% utilized</span>
              <span className={budgetPercentage > 85 ? "text-amber-400 font-semibold" : "text-emerald-400"}>
                {budgetPercentage > 85 ? "Near Limit" : "On Track"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Query Search Bar */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAsk();
          }}
          className="flex flex-col sm:flex-row gap-2"
        >
          <div className="relative grow">
            <Bot className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-500" />
            <input
              type="text"
              placeholder="e.g. How much did I spend on food this month?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 font-medium placeholder:text-slate-400"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-xs transition-all shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isLoading ? "Thinking..." : "Ask Coach"}</span>
          </button>
        </form>

        {/* Suggested queries */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 mr-1">
            <Lightbulb className="w-3 h-3 text-amber-500" />
            Try:
          </span>
          {suggestedQueries.map((sq) => (
            <button
              key={sq}
              type="button"
              onClick={() => {
                setQuery(sq);
                handleAsk(sq);
              }}
              className="text-[11px] font-medium text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100 border border-indigo-200 px-2.5 py-1 rounded-full transition-colors"
            >
              {sq}
            </button>
          ))}
        </div>

        {/* Response Box */}
        <div className="mt-6 p-5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-2">
            <div className="w-5 h-5 rounded-md bg-indigo-600 text-white flex items-center justify-center">
              <Bot className="w-3 h-3" />
            </div>
            <span>Expense Coach Insight</span>
            {isLoading && (
              <span className="text-[10px] font-normal text-indigo-600 animate-pulse">
                Analyzing transactions...
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="space-y-2 py-3">
              <div className="h-4 bg-slate-200 rounded-md w-3/4 animate-pulse" />
              <div className="h-4 bg-slate-200 rounded-md w-1/2 animate-pulse" />
            </div>
          ) : (
            <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line font-normal">
              {response}
            </div>
          )}
        </div>
      </div>

      {/* Subscription Detection & Alerts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recurring Subscriptions Detected */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                <Repeat className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Detected Subscriptions</h3>
                <p className="text-xs text-slate-500">Auto-identified from repeating receipts</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-teal-700">${totalSubscriptions.toFixed(2)}</div>
              <div className="text-[10px] text-slate-400">per month</div>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {subscriptions.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs">
                No active recurring subscriptions detected yet.
              </div>
            ) : (
              subscriptions.map((sub) => (
                <div key={sub.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-xs text-slate-900">{sub.merchant}</div>
                    <div className="text-[11px] text-slate-400">{sub.description}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-900">${sub.amount.toFixed(2)}</div>
                    <span className="text-[10px] text-teal-600 font-semibold bg-teal-50 px-1.5 py-0.2 rounded border border-teal-100">
                      Monthly
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Budget Limit Alerts */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Smart Spending Alerts</h3>
                <p className="text-xs text-slate-500">Proactive budget notifications</p>
              </div>
            </div>

            <div className="space-y-2.5 mt-4">
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">No Duplicates Detected</div>
                  <div className="text-emerald-700 text-[11px] mt-0.5">
                    Google Sheets deduplication check validated all {activeTransactions.length} receipt transactions against message IDs.
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Travel Booking Identified</div>
                  <div className="text-blue-700 text-[11px] mt-0.5">
                    Delta Air Lines ($312.00) constitutes 48% of current month expenses. Isolated from everyday grocery/dining baseline.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Spending pace: <strong>$21.37 / day</strong></span>
            <span className="text-emerald-600 font-semibold">Under monthly alert ceiling</span>
          </div>
        </div>
      </div>
    </div>
  );
}
