import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import DashboardStats from '@/components/dashboard/DashboardStats';
import IncomeExpenseChart from '@/components/dashboard/IncomeExpenseChart';
import DashboardCalendar from '@/components/dashboard/DashboardCalendar';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import { ExtendedDatabase } from '@/integrations/supabase/chart-of-accounts-types';

// Use Supabase-generated types
type Transaction = ExtendedDatabase['public']['Tables']['transactions']['Row'];

// Define FinancialSummary to match DashboardStatsProps
interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  netIncome: number;
  recentTransactions: Transaction[];
  upcomingReceivables: any[];
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [yearlyData, setYearlyData] = useState<any[]>([]);
  const [calendarTransactions, setCalendarTransactions] = useState<Transaction[]>([]);
  const [recentTransactionsData, setRecentTransactionsData] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        console.log('User:', user);

        const { data: incomeData, error: incomeError } = await supabase
          .from('transactions')
          .select('amount')
          .eq('type', 'income');
        if (incomeError) throw new Error('Failed to fetch income: ' + incomeError.message);
        console.log('Income Data:', incomeData);

        const { data: expenseData, error: expenseError } = await supabase
          .from('transactions')
          .select('amount')
          .eq('type', 'expense');
        if (expenseError) throw new Error('Failed to fetch expenses: ' + expenseError.message);
        console.log('Expense Data:', expenseData);

        const totalIncome = incomeData?.reduce((sum, t) => sum + t.amount, 0) || 0;
        const totalExpense = expenseData?.reduce((sum, t) => sum + t.amount, 0) || 0;
        const netIncome = totalIncome - totalExpense;

        const { data: recentTxns, error: recentTxnsError } = await supabase
          .from('transactions')
          .select('*')
          .order('date', { ascending: false })
          .limit(5);
        if (recentTxnsError) throw new Error('Failed to fetch recent transactions: ' + recentTxnsError.message);
        console.log('Recent Transactions:', recentTxns);

        const { data: receivables, error: receivablesError } = await supabase
          .from('receivables')
          .select('*')
          .gte('due_date', new Date().toISOString().split('T')[0]);
        if (receivablesError) throw new Error('Failed to fetch receivables: ' + receivablesError.message);
        console.log('Receivables:', receivables);

        setSummary({
          totalIncome,
          totalExpense,
          netIncome,
          recentTransactions: recentTxns || [],
          upcomingReceivables: receivables || [],
        });

        const { data: yearlyTxns, error: yearlyTxnsError } = await supabase
          .from('transactions')
          .select('date, amount, type')
          .gte('date', new Date(new Date().getFullYear() - 1, 0, 1).toISOString())
          .lte('date', new Date().toISOString());
        if (yearlyTxnsError) throw new Error('Failed to fetch yearly transactions: ' + yearlyTxnsError.message);
        console.log('Yearly Transactions:', yearlyTxns);

        const yearlySummary = yearlyTxns?.reduce((acc, txn) => {
          const year = new Date(txn.date).getFullYear().toString();
          if (!acc[year]) acc[year] = { year, income: 0, expense: 0 };
          acc[year][txn.type === 'income' ? 'income' : 'expense'] += txn.amount;
          return acc;
        }, {} as { [key: string]: { year: string; income: number; expense: number } });
        setYearlyData(Object.values(yearlySummary || {}));
        console.log('Yearly Data:', Object.values(yearlySummary || {}));

        const { data: calendarTxns, error: calendarTxnsError } = await supabase
          .from('transactions')
          .select('*')
          .order('date', { ascending: false })
          .limit(30);
        if (calendarTxnsError) throw new Error('Failed to fetch calendar transactions: ' + calendarTxnsError.message);
        console.log('Calendar Transactions:', calendarTxns);
        setCalendarTransactions(calendarTxns || []);

        const { data: recentData, error: recentDataError } = await supabase
          .from('transactions')
          .select('*')
          .order('date', { ascending: false })
          .limit(5);
        if (recentDataError) throw new Error('Failed to fetch recent transactions: ' + recentDataError.message);
        console.log('Recent Transactions Data:', recentData);
        setRecentTransactionsData(recentData || []);
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  console.log('Rendering Dashboard - Loading:', loading, 'Summary:', summary, 'Error:', error);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="p-4 bg-red-100 text-red-700 rounded">
          Error: {error}
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
        {summary ? (
          <DashboardStats summary={summary} />
        ) : (
          <div>No summary data available.</div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {yearlyData.length > 0 ? (
            <IncomeExpenseChart yearlyData={yearlyData} />
          ) : (
            <div>No yearly data available.</div>
          )}
          {calendarTransactions.length > 0 ? (
            <DashboardCalendar transactions={calendarTransactions} />
          ) : (
            <div>No calendar transactions available.</div>
          )}
        </div>
        {recentTransactionsData.length > 0 ? (
          <RecentTransactions transactions={recentTransactionsData} />
        ) : (
          <div>No recent transactions available.</div>
        )}
      </div>
    </MainLayout>
  );
};

export default Dashboard;