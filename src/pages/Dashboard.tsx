import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

// Placeholder components
const IncomeExpenseChart: React.FC<{
  monthlyData: { month: string; income: number; expense: number }[];
  yearlyData: { year: number; income: number; expense: number }[];
}> = ({ monthlyData, yearlyData }) => (
  <Card>
    <CardHeader>
      <CardTitle>Income vs Expense</CardTitle>
    </CardHeader>
    <CardContent>
      <p>Monthly: {JSON.stringify(monthlyData)}</p>
      <p>Yearly: {JSON.stringify(yearlyData)}</p>
    </CardContent>
  </Card>
);

const DashboardCalendar: React.FC<{
  transactions: { id: string; date: string; description: string; amount: number }[];
}> = ({ transactions }) => (
  <Card>
    <CardHeader>
      <CardTitle>Transaction Calendar</CardTitle>
    </CardHeader>
    <CardContent>
      <p>Transactions: {transactions.length}</p>
    </CardContent>
  </Card>
);

const RecentTransactions: React.FC<{
  transactions: { id: string; description: string; amount: number; date: string; category_id: string }[];
  categories: string[];
}> = ({ transactions }) => (
  <Card>
    <CardHeader>
      <CardTitle>Recent Transactions</CardTitle>
    </CardHeader>
    <CardContent>
      {transactions.map((txn) => (
        <p key={txn.id}>
          {txn.description}: Rp{txn.amount.toLocaleString('id-ID')} ({txn.date})
        </p>
      ))}
    </CardContent>
  </Card>
);

interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  category_id: string;
  account_id?: string;
  created_at?: string;
  created_by?: string;
  type?: 'income' | 'expense';
  updated_at?: string;
}

interface DebtReceivable {
  id: string;
  description: string;
  amount: number;
  due_date: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [debts, setDebts] = useState<DebtReceivable[]>([]);
  const [receivables, setReceivables] = useState<DebtReceivable[]>([]);
  const [monthlyChartData, setMonthlyChartData] = useState<
    { month: string; income: number; expense: number }[]
  >([]);
  const [yearlyChartData, setYearlyChartData] = useState<
    { year: number; income: number; expense: number }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch transactions
        const { data: txnData, error: txnError } = await supabase
          .from('transactions')
          .select('id, description, amount, date, category_id, account_id, created_at, created_by, type, updated_at')
          .eq('created_by', user.id)
          .order('date', { ascending: false })
          .limit(50);

        console.log('Transactions fetch:', { txnData, txnError });
        if (txnError) throw new Error(txnError.message);
        setTransactions(txnData || []);

        // Fetch categories
        const { data: catData, error: catError } = await supabase
          .from('categories')
          .select('name');

        console.log('Categories fetch:', { catData, catError });
        if (catError) throw new Error(catError.message);
        setCategories(catData?.map((c: any) => c.name) || []);

        // Fetch debts
        const { data: debtData, error: debtError } = await supabase
          .from('debts')
          .select('id, description, amount, due_date');

        console.log('Debts fetch:', { debtData, debtError });
        if (debtError) throw new Error(debtError.message);
        setDebts(debtData || []);

        // Fetch receivables
        const { data: recvData, error: recvError } = await supabase
          .from('receivables')
          .select('id, description, amount, due_date');

        console.log('Receivables fetch:', { recvData, recvError });
        if (recvError) throw new Error(recvError.message);
        setReceivables(recvData || []);

        // Aggregate monthly chart data
        const { data: monthlyData, error: monthlyError } = await supabase
          .from('transactions')
          .select('date, amount, type')
          .eq('created_by', user.id)
          .gte('date', new Date(new Date().setMonth(new Date().getMonth() - 12)).toISOString());

        console.log('Monthly data fetch:', { monthlyData, monthlyError });
        if (monthlyError) throw new Error(monthlyError.message);

        const monthlyAggregated: { month: string; income: number; expense: number }[] = [];
        monthlyData?.forEach((txn: any) => {
          const date = new Date(txn.date);
          const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
          let monthEntry = monthlyAggregated.find((m) => m.month === monthKey);
          if (!monthEntry) {
            monthEntry = { month: monthKey, income: 0, expense: 0 };
            monthlyAggregated.push(monthEntry);
          }
          if (txn.type === 'income') {
            monthEntry.income += txn.amount;
          } else {
            monthEntry.expense += txn.amount;
          }
        });
        setMonthlyChartData(monthlyAggregated);

        // Aggregate yearly chart data
        const { data: yearlyData, error: yearlyError } = await supabase
          .from('transactions')
          .select('date, amount, type')
          .eq('created_by', user.id)
          .gte('date', new Date(new Date().setFullYear(new Date().getFullYear() - 5)).toISOString());

        console.log('Yearly data fetch:', { yearlyData, yearlyError });
        if (yearlyError) throw new Error(yearlyError.message);

        const yearlyAggregated: { year: number; income: number; expense: number }[] = [];
        yearlyData?.forEach((txn: any) => {
          const year = new Date(txn.date).getFullYear();
          let yearEntry = yearlyAggregated.find((y) => y.year === year);
          if (!yearEntry) {
            yearEntry = { year, income: 0, expense: 0 };
            yearlyAggregated.push(yearEntry);
          }
          if (txn.type === 'income') {
            yearEntry.income += txn.amount;
          } else {
            yearEntry.expense += txn.amount;
          }
        });
        setYearlyChartData(yearlyAggregated);

      } catch (err: any) {
        console.error('Dashboard fetch error:', err);
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Debug state
  useEffect(() => {
    console.log('Dashboard state:', {
      user,
      transactions,
      categories,
      debts,
      receivables,
      monthlyChartData,
      yearlyChartData,
      loading,
      error,
    });
  }, [user, transactions, categories, debts, receivables, monthlyChartData, yearlyChartData, loading, error]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-full">
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

  return (
    <MainLayout>
      <div className="pb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Selamat datang kembali, {user?.name || 'User'}! Berikut ringkasan keuangan Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <IncomeExpenseChart monthlyData={monthlyChartData} yearlyData={yearlyChartData} />
        </div>
        <div>
          <DashboardCalendar transactions={transactions} />
        </div>
      </div>

      <div className="mb-6">
        <RecentTransactions transactions={transactions} categories={categories} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pembayaran Akan Datang</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {debts.map((debt) => (
              <div key={debt.id} className="flex justify-between items-center pb-2 border-b">
                <div>
                  <p className="font-medium text-sm">{debt.description}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-red-600">Rp{debt.amount.toLocaleString('id-ID')}</p>
                  <p className="text-xs text-muted-foreground">
                    {debt.due_date ? new Date(debt.due_date).toLocaleDateString('id-ID') : 'Tanpa tanggal'}
                  </p>
                </div>
              </div>
            ))}
            {debts.length === 0 && (
              <p className="text-muted-foreground text-center py-3">Tidak ada pembayaran akan datang</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Penerimaan Akan Datang</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {receivables.map((receivable) => (
              <div key={receivable.id} className="flex justify-between items-center pb-2 border-b">
                <div>
                  <p className="font-medium text-sm">{receivable.description}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">Rp{receivable.amount.toLocaleString('id-ID')}</p>
                  <p className="text-xs text-muted-foreground">
                    {receivable.due_date ? new Date(receivable.due_date).toLocaleDateString('id-ID') : 'Tanpa tanggal'}
                  </p>
                </div>
              </div>
            ))}
            {receivables.length === 0 && (
              <p className="text-muted-foreground text-center py-3">Tidak ada penerimaan akan datang</p>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Dashboard;