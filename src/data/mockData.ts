
import { 
  Account, 
  Category, 
  Debt, 
  Expense, 
  Income, 
  Receivable,
  FinancialSummary,
  ChartData
} from '../types/finance';

// Helper function to generate dates
const getDateString = (daysAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

// Mock Categories
export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Salary',
    type: 'income',
    icon: 'banknote',
    color: '#4CAF50',
    createdAt: getDateString(90),
    updatedAt: getDateString(90),
  },
  {
    id: '2',
    name: 'Freelance',
    type: 'income',
    icon: 'laptop',
    color: '#2196F3',
    createdAt: getDateString(85),
    updatedAt: getDateString(80),
  },
  {
    id: '3',
    name: 'Investments',
    type: 'income',
    icon: 'trending-up',
    color: '#9C27B0',
    createdAt: getDateString(75),
    updatedAt: getDateString(70),
  },
  {
    id: '4',
    name: 'Food & Dining',
    type: 'expense',
    icon: 'utensils',
    color: '#F44336',
    createdAt: getDateString(95),
    updatedAt: getDateString(90),
  },
  {
    id: '5',
    name: 'Rent',
    type: 'expense',
    icon: 'home',
    color: '#FF9800',
    createdAt: getDateString(93),
    updatedAt: getDateString(93),
  },
  {
    id: '6',
    name: 'Transportation',
    type: 'expense',
    icon: 'car',
    color: '#795548',
    createdAt: getDateString(92),
    updatedAt: getDateString(85),
  },
  {
    id: '7',
    name: 'Utilities',
    type: 'expense',
    icon: 'zap',
    color: '#607D8B',
    createdAt: getDateString(91),
    updatedAt: getDateString(91),
  },
  {
    id: '8',
    name: 'Entertainment',
    type: 'expense',
    icon: 'film',
    color: '#673AB7',
    createdAt: getDateString(89),
    updatedAt: getDateString(89),
  },
  {
    id: '9',
    name: 'Shopping',
    type: 'expense',
    icon: 'shopping-bag',
    color: '#E91E63',
    createdAt: getDateString(88),
    updatedAt: getDateString(85),
  },
  {
    id: '10',
    name: 'Healthcare',
    type: 'expense',
    icon: 'activity',
    color: '#00BCD4',
    createdAt: getDateString(87),
    updatedAt: getDateString(87),
  },
];

// Mock Accounts
export const mockAccounts: Account[] = [
  {
    id: '1',
    name: 'Main Checking',
    balance: 5780.42,
    accountNumber: '****4567',
    bankName: 'National Bank',
    description: 'Primary checking account',
    createdAt: getDateString(100),
    updatedAt: getDateString(5),
  },
  {
    id: '2',
    name: 'Savings',
    balance: 12350.00,
    accountNumber: '****7890',
    bankName: 'National Bank',
    description: 'Emergency fund',
    createdAt: getDateString(95),
    updatedAt: getDateString(10),
  },
  {
    id: '3',
    name: 'Investment Account',
    balance: 32500.75,
    accountNumber: '****2345',
    bankName: 'Wealth Invest',
    description: 'Long-term investments',
    createdAt: getDateString(80),
    updatedAt: getDateString(15),
  },
  {
    id: '4',
    name: 'Cash',
    balance: 250.00,
    description: 'Physical cash',
    createdAt: getDateString(100),
    updatedAt: getDateString(1),
  },
];

// Mock Incomes
export const mockIncomes: Income[] = [
  {
    id: '1',
    type: 'income',
    amount: 3500.00,
    description: 'Monthly salary',
    date: getDateString(1),
    categoryId: '1',
    accountId: '1',
    createdBy: '1',
    createdAt: getDateString(1),
    updatedAt: getDateString(1),
  },
  {
    id: '2',
    type: 'income',
    amount: 850.00,
    description: 'Freelance project',
    date: getDateString(5),
    categoryId: '2',
    accountId: '1',
    createdBy: '1',
    createdAt: getDateString(5),
    updatedAt: getDateString(5),
  },
  {
    id: '3',
    type: 'income',
    amount: 125.50,
    description: 'Dividend payment',
    date: getDateString(10),
    categoryId: '3',
    accountId: '3',
    createdBy: '1',
    createdAt: getDateString(10),
    updatedAt: getDateString(10),
  },
  {
    id: '4',
    type: 'income',
    amount: 3500.00,
    description: 'Monthly salary',
    date: getDateString(31),
    categoryId: '1',
    accountId: '1',
    createdBy: '1',
    createdAt: getDateString(31),
    updatedAt: getDateString(31),
  },
  {
    id: '5',
    type: 'income',
    amount: 250.00,
    description: 'Part-time work',
    date: getDateString(15),
    categoryId: '2',
    accountId: '1',
    createdBy: '1',
    createdAt: getDateString(15),
    updatedAt: getDateString(15),
  },
];

// Mock Expenses
export const mockExpenses: Expense[] = [
  {
    id: '1',
    type: 'expense',
    amount: 125.30,
    description: 'Grocery shopping',
    date: getDateString(2),
    categoryId: '4',
    accountId: '1',
    createdBy: '1',
    createdAt: getDateString(2),
    updatedAt: getDateString(2),
  },
  {
    id: '2',
    type: 'expense',
    amount: 1200.00,
    description: 'Rent payment',
    date: getDateString(3),
    categoryId: '5',
    accountId: '1',
    createdBy: '1',
    createdAt: getDateString(3),
    updatedAt: getDateString(3),
  },
  {
    id: '3',
    type: 'expense',
    amount: 45.00,
    description: 'Gas refill',
    date: getDateString(4),
    categoryId: '6',
    accountId: '1',
    createdBy: '1',
    createdAt: getDateString(4),
    updatedAt: getDateString(4),
  },
  {
    id: '4',
    type: 'expense',
    amount: 89.99,
    description: 'Internet bill',
    date: getDateString(6),
    categoryId: '7',
    accountId: '1',
    createdBy: '1',
    createdAt: getDateString(6),
    updatedAt: getDateString(6),
  },
  {
    id: '5',
    type: 'expense',
    amount: 35.50,
    description: 'Movie night',
    date: getDateString(8),
    categoryId: '8',
    accountId: '1',
    createdBy: '1',
    createdAt: getDateString(8),
    updatedAt: getDateString(8),
  },
  {
    id: '6',
    type: 'expense',
    amount: 75.20,
    description: 'New shirt',
    date: getDateString(9),
    categoryId: '9',
    accountId: '1',
    createdBy: '1',
    createdAt: getDateString(9),
    updatedAt: getDateString(9),
  },
  {
    id: '7',
    type: 'expense',
    amount: 120.00,
    description: 'Doctor visit',
    date: getDateString(12),
    categoryId: '10',
    accountId: '1',
    createdBy: '1',
    createdAt: getDateString(12),
    updatedAt: getDateString(12),
  },
];

// Mock Debts
export const mockDebts: Debt[] = [
  {
    id: '1',
    amount: 500.00,
    description: 'Personal loan',
    personName: 'John Smith',
    contactInfo: 'john@example.com',
    dueDate: getDateString(-10),
    isPaid: false,
    date: getDateString(30),
    accountId: '1',
    createdAt: getDateString(30),
    updatedAt: getDateString(30),
  },
  {
    id: '2',
    amount: 250.00,
    description: 'Borrowed for dinner',
    personName: 'Sarah Johnson',
    contactInfo: '555-123-4567',
    dueDate: getDateString(-2),
    isPaid: false,
    date: getDateString(25),
    accountId: '1',
    createdAt: getDateString(25),
    updatedAt: getDateString(25),
  },
];

// Mock Receivables
export const mockReceivables: Receivable[] = [
  {
    id: '1',
    amount: 350.00,
    description: 'Lent for car repair',
    personName: 'Mike Brown',
    contactInfo: 'mike@example.com',
    dueDate: getDateString(-5),
    isReceived: false,
    date: getDateString(20),
    accountId: '1',
    createdAt: getDateString(20),
    updatedAt: getDateString(20),
  },
  {
    id: '2',
    amount: 125.00,
    description: 'Group lunch payment',
    personName: 'Lisa Wilson',
    contactInfo: '555-987-6543',
    dueDate: getDateString(-1),
    isReceived: false,
    date: getDateString(15),
    accountId: '1',
    createdAt: getDateString(15),
    updatedAt: getDateString(15),
  },
];

// Financial Summary for Dashboard
export const mockFinancialSummary: FinancialSummary = {
  totalIncome: {
    day: 0,
    week: 4350,
    month: 8225.50,
    year: 52250.30,
    all: 52250.30,
  },
  totalExpense: {
    day: 125.30,
    week: 1550.79,
    month: 3265.99,
    year: 24589.45,
    all: 24589.45,
  },
  balance: 27660.85,
  recentTransactions: [
    ...mockIncomes.slice(0, 3),
    ...mockExpenses.slice(0, 4),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
  upcomingDebts: mockDebts,
  upcomingReceivables: mockReceivables,
};

// Monthly chart data
export const mockMonthlyChartData: ChartData[] = [
  { month: 'Jan', income: 4200, expense: 3100 },
  { month: 'Feb', income: 4500, expense: 3300 },
  { month: 'Mar', income: 4100, expense: 2900 },
  { month: 'Apr', income: 4800, expense: 3200 },
  { month: 'May', income: 5200, expense: 3400 },
  { month: 'Jun', income: 5100, expense: 3600 },
  { month: 'Jul', income: 4900, expense: 3500 },
  { month: 'Aug', income: 5300, expense: 3800 },
  { month: 'Sep', income: 5500, expense: 3700 },
  { month: 'Oct', income: 5700, expense: 3900 },
  { month: 'Nov', income: 5400, expense: 3600 },
  { month: 'Dec', income: 6000, expense: 4200 },
];

// Yearly chart data
export const mockYearlyChartData: ChartData[] = [
  { year: '2020', income: 48000, expense: 36000 },
  { year: '2021', income: 52000, expense: 38000 },
  { year: '2022', income: 58000, expense: 42000 },
  { year: '2023', income: 64000, expense: 45000 },
  { year: '2024', income: 60500, expense: 41000 },
];

// Combined array of all transactions for easier filtering
export const mockTransactions = [...mockIncomes, ...mockExpenses].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
);

// Function to get all data
export const getAllData = () => {
  return {
    categories: mockCategories,
    accounts: mockAccounts,
    incomes: mockIncomes,
    expenses: mockExpenses,
    debts: mockDebts,
    receivables: mockReceivables,
    transactions: mockTransactions,
    financialSummary: mockFinancialSummary,
    monthlyChartData: mockMonthlyChartData,
    yearlyChartData: mockYearlyChartData,
  };
};

// Helper functions for filtering data
export const filterTransactionsByDate = (
  transactions: (Income | Expense)[],
  startDate: string,
  endDate: string
) => {
  return transactions.filter(
    (t) => new Date(t.date) >= new Date(startDate) && new Date(t.date) <= new Date(endDate)
  );
};

export const filterTransactionsByCategory = (
  transactions: (Income | Expense)[],
  categoryIds: string[]
) => {
  return transactions.filter((t) => categoryIds.includes(t.categoryId));
};

export const filterTransactionsByType = (
  transactions: (Income | Expense)[],
  type: 'income' | 'expense'
) => {
  return transactions.filter((t) => t.type === type);
};

export const calculateTotalAmount = (transactions: (Income | Expense)[]) => {
  return transactions.reduce((total, t) => total + t.amount, 0);
};
