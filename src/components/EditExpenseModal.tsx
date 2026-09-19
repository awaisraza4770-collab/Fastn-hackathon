import React, { useState, useEffect } from "react";
import { X, Check, Save } from "lucide-react";
import { ExpenseTransaction, ExpenseCategory } from "../types";

interface EditExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: ExpenseTransaction | null;
  onSave: (updated: ExpenseTransaction) => void;
}

const CATEGORIES: ExpenseCategory[] = [
  "Food & Dining",
  "Groceries",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Healthcare",
  "Education",
  "Travel",
  "Subscriptions",
  "Other",
];

export function EditExpenseModal({
  isOpen,
  onClose,
  transaction,
  onSave,
}: EditExpenseModalProps) {
  if (!isOpen || !transaction) return null;

  const [merchant, setMerchant] = useState(transaction.merchant);
  const [amount, setAmount] = useState(transaction.amount.toString());
  const [date, setDate] = useState(transaction.date);
  const [category, setCategory] = useState<ExpenseCategory>(transaction.category);
  const [description, setDescription] = useState(transaction.description);
  const [isSubscription, setIsSubscription] = useState(!!transaction.isSubscription);

  useEffect(() => {
    if (transaction) {
      setMerchant(transaction.merchant);
      setAmount(transaction.amount.toString());
      setDate(transaction.date);
      setCategory(transaction.category);
      setDescription(transaction.description);
      setIsSubscription(!!transaction.isSubscription);
    }
  }, [transaction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount) || 0;
    onSave({
      ...transaction,
      merchant,
      amount: parsedAmount,
      date,
      category,
      description,
      isSubscription,
      confidence: 1.0, // Manually verified
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200">
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <h3 className="font-bold text-sm">Edit Expense Details</h3>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Merchant Name</label>
            <input
              type="text"
              required
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Amount ($)</label>
              <input
                type="number"
                step="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Description / Notes</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isSubscriptionCheck"
              checked={isSubscription}
              onChange={(e) => setIsSubscription(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
            />
            <label htmlFor="isSubscriptionCheck" className="text-slate-700 font-medium cursor-pointer">
              Mark as recurring subscription (e.g. Netflix, gym, monthly bill)
            </label>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save & Verify</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
