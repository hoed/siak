import React, { useEffect, useState, useMemo } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import DashboardStats from '@/components/dashboard/DashboardStats';
import IncomeExpenseChart from '@/components/dashboard/IncomeExpenseChart';
import DashboardCalendar from '@/components/dashboard/DashboardCalendar';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import { Database } from '@/integrations/supabase/types';

// Use Supabase-generated types
type TransactionRow = Database['public']['Tables']['transactions']['Row'];
type CategoryRow = Database['public']['Tables']['categories']['Row'];

// Define FinancialSummary to match DashboardStatsProps
interface FinancialSummary {
  totalIncome: {
    month: number;
  };
  totalExpense: {
    month: number;
  };
  balance: number;
  recentTransactions: TransactionRow[];
  upcomingReceivables: any[]; // Adjust based on your schema (e.g., receivables type)
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<any | null>(null);
  const [yearlyData, setYearlyData] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [calendarTransactions, setCalendarTransactions] = useState<TransactionRow[]>([]);
  const [recentTransactionsData, setRecentTransactionsData] = useState<TransactionRow[]>([]);
  const [categories, setCategories] = useState<CategoryRow[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch financial summary
        const { data: incomeData } = await supabase
        .from('transactions')
        .select('amount, date')
        .eq('type', 'income')
        .gte('date', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
        .lte('date', new Date().toISOString());

        const { data: expenseData } = await supabase
        .from('transactions')
        .select('amount, date')
        .eq('type', 'expense')
        .gte('date', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
        .lte('date', new Date().toISOString());

        const totalIncome = incomeData?.reduce((sum, t) => sum + t.amount, 0) ?? 0;
        const totalExpense = expenseData?.reduce((sum, t) => sum + t.amount, 0) ?? 0;

        const { data: allIncomeData } = await supabase
        .from('transactions')
        .select('amount')
        .eq('type', 'income');
        const { data: allExpenseData } = await supabase
        .from('transactions')
        .select('amount')
        .eq('type', 'expense');
        const netIncome = totalIncome - totalExpense;

        // Fetch recent transactions (adjust limit as needed)
        const { data: recentTxns } = await supabase
          .from('transactions')
          .select('*')
          .order('date', { ascending: false })
          .limit(5);

        // Fetch upcoming receivables (example, adjust based on your schema)
        const { data: receivables } = await supabase
          .from('receivables')
          .select('*')
          .gte('due_date', new Date().toISOString().split('T')[0]);

        setSummary({
          totalIncome: {
            month: totalIncome,
          },
          totalExpense: {
            month: totalExpense,
          },
          recentTransactions: recentTxns || [],
          upcomingReceivables: receivables || [],
        });

        // Fetch yearly data (convert year to string)
        const { data: yearlyTxns } = await supabase
          .from('transactions')
          .select('date, amount, type')
          .gte('date', new Date(new Date().getFullYear() - 1, 0, 1).toISOString())
          .lte('date', new Date().toISOString());
        const yearlySummary = yearlyTxns?.reduce((acc, txn) => {
          const year = new Date(txn.date).getFullYear().toString();
          if (!acc[year]) acc[year] = { year, income: 0, expense: 0 };
          acc[year][txn.type === 'income' ? 'income' : 'expense'] += txn.amount;
          return acc;
        }, {} as { [key: string]: { year: string; income: number; expense: number } });
        setYearlyData(Object.values(yearlySummary));

        // Fetch monthly data
        const { data: monthlyTxns } = await supabase
          .from('transactions')
          .select('date, amount, type')
          .gte('date', new Date(new Date().getFullYear(), new Date().getMonth() - 11, 1).toISOString())
          .lte('date', new Date().toISOString());
        const monthlySummary = monthlyTxns?.reduce((acc, txn) => {
          const month = new Date(txn.date).toLocaleString('default', { month: 'short' });
          if (!acc[month]) acc[month] = { month, income: 0, expense: 0 };
          acc[month][txn.type === 'income' ? 'income' : 'expense'] += txn.amount;
          return acc;
        }, {} as { [key: string]: { month: string; income: number; expense: number } });
        setMonthlyData(Object.values(monthlySummary));


        // Fetch transactions for calendar
        const { data: calendarTxns } = await supabase
          .from('transactions')
          .select('*')
          .order('date', { ascending: false })
          .limit(30);
        setCalendarTransactions(calendarTxns || []);

        // Fetch recent transactions for display
        const { data: recentData } = await supabase
          .from('transactions')
          .select('*')
          .order('date', { ascending: false })
          .limit(5);
        setRecentTransactionsData(recentData || []);

        // Fetch categories
        const { data: categoriesData } = await supabase
          .from('categories')
          .select('*');
        setCategories(categoriesData || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const balance = useMemo(() => {
    if (!summary) return 0;
    const totalIncome = summary.totalIncome.month;
    const totalExpense = summary.totalExpense.month;
    return totalIncome - totalExpense;
  }, [summary]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return (
      <MainLayout>
        <div className="p-4 bg-red-100 text-red-700 rounded">
          Please log in to view the dashboard.
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        {summary && (
          <DashboardStats summary={summary} />
          )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <IncomeExpenseChart monthlyData={monthlyData} yearlyData={yearlyData} />
          <DashboardCalendar
            transactions={calendarTransactions.map(transaction => ({
              ...transaction,
              categoryId: transaction.category_id,
              accountId: transaction.account_id,
              createdBy: transaction.created_by,
              createdAt: transaction.created_at,
              updatedAt: transaction.updated_at,
            }))}
          />
        </div>
        <RecentTransactions
          transactions={recentTransactionsData.map(transaction => ({
            ...transaction,
            categoryId: transaction.category_id,
            accountId: transaction.account_id,
            createdBy: transaction.created_by,
            createdAt: transaction.created_at,
            updatedAt: transaction.updated_at,
          }))}
          categories={categories}
        />
      </div>
    </MainLayout>
  );
};

export default Dashboard;
