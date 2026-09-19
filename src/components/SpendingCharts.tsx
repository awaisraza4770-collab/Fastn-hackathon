import { useState } from "react";
import { ExpenseTransaction, ExpenseCategory } from "../types";
import { CATEGORY_COLORS } from "../mockData";
import { PieChart, BarChart3, Info } from "lucide-react";

interface SpendingChartsProps {
  transactions: ExpenseTransaction[];
  currencySymbol?: string;
}

export function SpendingCharts({ transactions, currencySymbol = "$" }: SpendingChartsProps) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const active = transactions.filter(
    (t) => t.status === "synced_to_sheets" || t.status === "approved"
  );
  const totalSpend = active.reduce((acc, t) => acc + t.amount, 0);

  // Group by category
  const categoryMap: Partial<Record<ExpenseCategory, { total: number; count: number }>> = {};
  active.forEach((t) => {
    if (!categoryMap[t.category]) {
      categoryMap[t.category] = { total: 0, count: 0 };
    }
    categoryMap[t.category]!.total += t.amount;
    categoryMap[t.category]!.count += 1;
  });

  const categoryList = Object.entries(categoryMap)
    .map(([category, data]) => ({
      category: category as ExpenseCategory,
      total: data!.total,
      count: data!.count,
      percentage: totalSpend > 0 ? (data!.total / totalSpend) * 100 : 0,
      color: CATEGORY_COLORS[category as ExpenseCategory] || "#64748B",
    }))
    .sort((a, b) => b.total - a.total);

  // Mock monthly trend data based on current transactions + past months for a nice curve
  const monthlyTrends = [
    { month: "May 26", amount: 480.20 },
    { month: "Jun 26", amount: 560.10 },
    { month: "Jul 26", amount: 620.00 },
    { month: "Aug 26", amount: 590.40 },
    { month: "Sep 26", amount: totalSpend > 0 ? totalSpend : 641.04 },
  ];

  const maxMonthAmount = Math.max(...monthlyTrends.map((m) => m.amount), 700);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Category Breakdown (7 cols on lg) */}
      <div className="lg:col-span-7 bg-white rounded-xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <PieChart className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Spending by Category</h3>
              <p className="text-xs text-slate-500">Auto-classified by Gemini AI</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
            {categoryList.length} categories
          </span>
        </div>

        {/* Stacked visual progress bar */}
        <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden flex mb-6">
          {categoryList.map((cat) => (
            <div
              key={cat.category}
              style={{
                width: `${cat.percentage}%`,
                backgroundColor: cat.color,
              }}
              title={`${cat.category}: ${currencySymbol}${cat.total.toFixed(2)} (${cat.percentage.toFixed(1)}%)`}
              className="h-full transition-all duration-300 hover:opacity-80 cursor-pointer"
              onMouseEnter={() => setHoveredCategory(cat.category)}
              onMouseLeave={() => setHoveredCategory(null)}
            />
          ))}
        </div>

        {/* Category List Rows with Exact Amounts */}
        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
          {categoryList.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              No categorized expenses yet. Run a demo scan to populate.
            </div>
          ) : (
            categoryList.map((cat) => {
              const isHovered = hoveredCategory === cat.category;
              return (
                <div
                  key={cat.category}
                  onMouseEnter={() => setHoveredCategory(cat.category)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  className={`flex items-center justify-between p-2 rounded-lg transition-all ${
                    isHovered ? "bg-slate-50 scale-[1.01]" : ""
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <div className="truncate">
                      <div className="text-xs font-semibold text-slate-800 truncate">
                        {cat.category}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {cat.count} receipt{cat.count > 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-bold text-slate-900">
                      {currencySymbol}{cat.total.toFixed(2)}
                    </div>
                    <div className="text-[11px] font-medium text-slate-400">
                      {cat.percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Monthly Spending Trend (5 cols on lg) */}
      <div className="lg:col-span-5 bg-white rounded-xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Monthly Spending Trend</h3>
                <p className="text-xs text-slate-500">Historical velocity</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-emerald-600">
                {currencySymbol}{monthlyTrends[monthlyTrends.length - 1].amount.toFixed(2)}
              </div>
              <div className="text-[10px] text-slate-400">Current Month</div>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-44 flex items-end justify-between gap-3 pt-6 pb-2 px-2">
            {monthlyTrends.map((trend, index) => {
              const heightPercent = Math.round((trend.amount / maxMonthAmount) * 100);
              const isCurrent = index === monthlyTrends.length - 1;

              return (
                <div key={trend.month} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    {currencySymbol}{Math.round(trend.amount)}
                  </div>
                  <div className="w-full bg-slate-100 rounded-t-lg relative flex items-end h-32 overflow-hidden">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-t-md transition-all duration-500 ${
                        isCurrent
                          ? "bg-linear-to-t from-emerald-600 to-emerald-400 shadow-sm"
                          : "bg-slate-300 group-hover:bg-slate-400"
                      }`}
                    />
                  </div>
                  <span
                    className={`text-[11px] font-medium ${
                      isCurrent ? "text-emerald-700 font-bold" : "text-slate-500"
                    }`}
                  >
                    {trend.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Insight footer */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-start gap-2 text-[11px] text-slate-500">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
          <span>
            Spending is steady this billing cycle. AI estimates projected month-end at ~{currencySymbol}680 based on recurring receipts.
          </span>
        </div>
      </div>
    </div>
  );
}
