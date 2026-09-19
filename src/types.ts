export type ExpenseCategory =
  | "Food & Dining"
  | "Groceries"
  | "Transportation"
  | "Shopping"
  | "Entertainment"
  | "Bills & Utilities"
  | "Healthcare"
  | "Education"
  | "Travel"
  | "Subscriptions"
  | "Other";

export interface ExpenseTransaction {
  id: string;
  merchant: string;
  amount: number;
  currency: string;
  date: string; // YYYY-MM-DD
  category: ExpenseCategory;
  description: string;
  confidence: number; // 0 to 1
  gmailMessageId: string;
  senderEmail?: string;
  orderId?: string;
  items?: string[];
  isSubscription?: boolean;
  status: "pending_review" | "approved" | "ignored" | "synced_to_sheets";
  syncedAt?: string;
}

export interface SampleEmailReceipt {
  id: string;
  sender: string;
  senderName: string;
  subject: string;
  date: string;
  receivedTime: string;
  preview: string;
  rawBody: string;
  expectedMerchant: string;
  expectedAmount: number;
  expectedCategory: ExpenseCategory;
  status: "unread" | "scanned" | "extracted";
}

export interface SpendingByCategory {
  category: ExpenseCategory;
  total: number;
  count: number;
  percentage: number;
  color: string;
}

export interface MonthlyTrend {
  month: string;
  total: number;
}
