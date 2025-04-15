
// Base transaction type
export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  categoryId: string;
  accountId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Income extends the base transaction
export interface Income extends Transaction {
  type: 'income';
}

// Expense extends the base transaction
export interface Expense extends Transaction {
  type: 'expense';
}

// Category type
export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  icon?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

// Bank account type
export interface Account {
  id: string;
  name: string;
  balance: number;
  accountNumber?: string;
  bankName?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// Debt record type
export interface Debt {
  id: string;
  amount: number;
  description: string;
  personName: string;
  contactInfo?: string;
  dueDate?: string;
  isPaid: boolean;
  date: string;
  accountId?: string;
  createdAt: string;
  updatedAt: string;
}

// Receivable record type
export interface Receivable {
  id: string;
  amount: number;
  description: string;
  personName: string;
  contactInfo?: string;
  dueDate?: string;
  isReceived: boolean;
  date: string;
  accountId?: string;
  createdAt: string;
  updatedAt: string;
}

// Summary type for dashboard
export interface FinancialSummary {
  totalIncome: {
    day: number;
    week: number;
    month: number;
    year: number;
    all: number;
  };
  totalExpense: {
    day: number;
    week: number;
    month: number;
    year: number;
    all: number;
  };
  balance: number;
  recentTransactions: (Income | Expense)[];
  upcomingDebts: Debt[];
  upcomingReceivables: Receivable[];
}

// Report filter types
export type DateFilterType = 'day' | 'week' | 'month' | 'year' | 'custom';

export interface ReportFilter {
  dateRange: {
    start: string;
    end: string;
  };
  filterType: DateFilterType;
  categoryIds?: string[];
  accountIds?: string[];
  searchQuery?: string;
}

// Chart data types
export interface ChartData {
  month?: string;
  year?: string;
  income: number;
  expense: number;
}
