import { 
  TrendingUp, 
  CreditCard, 
  ShoppingBag, 
  Calendar, 
  Repeat, 
  ArrowUpRight,
  ShieldCheck
} from "lucide-react";
import { ExpenseTransaction, ExpenseCategory } from "../types";

interface MetricCardsProps {
  transactions: ExpenseTransaction[];
  currencySymbol?: string;
}

export function MetricCards({ transactions, currencySymbol = "$" }: MetricCardsProps) {
  // Only calculate based on approved or synced transactions
  const activeTransactions = transactions.filter(
    (t) => t.status === "synced_to_sheets" || t.status === "approved"
  );

  const totalSpending = activeTransactions.reduce((acc, t) => acc + t.amount, 0);

  // Spending this month (Sep 2026 based on timestamp 2026-09)
  const currentMonth = "2026-09";
  const thisMonthTransactions = activeTransactions.filter((t) => t.date.startsWith(currentMonth));
  const thisMonthSpending = thisMonthTransactions.reduce((acc, t) => acc + t.amount, 0);

  // Top spending category
  const categoryTotals: Partial<Record<ExpenseCategory, number>> = {};
  activeTransactions.forEach((t) => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
  });

  let topCategory: ExpenseCategory = "Other";
  let topCategoryAmount = 0;
  Object.entries(categoryTotals).forEach(([cat, amount]) => {
    if (amount && amount > topCategoryAmount) {
      topCategoryAmount = amount;
      topCategory = cat as ExpenseCategory;
    }
  });

  // Recurring Subscriptions
  const subscriptionTransactions = activeTransactions.filter(
    (t) => t.category === "Subscriptions" || t.isSubscription
  );
  const monthlySubscriptionCost = subscriptionTransactions.reduce((acc, t) => acc + t.amount, 0);

  // High confidence rate
  const highConfidenceCount = activeTransactions.filter((t) => t.confidence >= 0.9).length;
  const confidenceRate = activeTransactions.length > 0 
    ? Math.round((highConfidenceCount / activeTransactions.length) * 100) 
    : 100;

  return (
    <div className="space-y-6">
      {/* Hero Headline and Big Spending Number */}
      <div className="bg-linear-to-br from-emerald-950 via-slate-900 to-slate-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-emerald-900/40">
        {/* Subtle background glow effect */}
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-20 w-60 h-60 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Automated Financial Ledger
            </div>
            <p className="text-sm font-medium text-slate-400">Total Tracked Spending</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white">
                {currencySymbol}{totalSpending.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/60 flex items-center">
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
                Live Sync
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Extracted from verified Gmail purchase confirmations & synced to Google Sheets.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-slate-800">
            <div className="bg-slate-900/80 backdrop-blur-xs border border-slate-800 rounded-xl px-4 py-3 min-w-[140px]">
              <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">This Month</div>
              <div className="text-xl font-bold text-white mt-0.5">
                {currencySymbol}{thisMonthSpending.toFixed(2)}
              </div>
              <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
                <TrendingUp className="w-3 h-3" />
                September 2026
              </div>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-xs border border-slate-800 rounded-xl px-4 py-3 min-w-[140px]">
              <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">AI Confidence</div>
              <div className="text-xl font-bold text-emerald-300 mt-0.5">
                {confidenceRate}%
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                High accuracy
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Transactions */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Transactions</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {activeTransactions.length}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Receipts verified in ledger
          </p>
        </div>

        {/* Card 2: Top Spending Category */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Top Category</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 truncate" title={topCategory}>
            {topCategory}
          </div>
          <p className="text-xs text-emerald-600 font-medium mt-1">
            {currencySymbol}{topCategoryAmount.toFixed(2)} total spend
          </p>
        </div>

        {/* Card 3: Monthly Subscriptions */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Subscriptions</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
              <Repeat className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {currencySymbol}{monthlySubscriptionCost.toFixed(2)}
            <span className="text-xs font-normal text-slate-400 ml-1">/mo</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {subscriptionTransactions.length} active recurring charges
          </p>
        </div>

        {/* Card 4: Average Receipt */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg. Ticket</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {currencySymbol}
            {activeTransactions.length > 0 
              ? (totalSpending / activeTransactions.length).toFixed(2)
              : "0.00"}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Per receipt across all merchants
          </p>
        </div>
      </div>
    </div>
  );
}
