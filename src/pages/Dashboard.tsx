
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import MainLayout from '@/components/layout/MainLayout';
import DashboardCalendar from '@/components/dashboard/DashboardCalendar';
import IncomeExpenseChart from '@/components/dashboard/IncomeExpenseChart';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import DashboardStats from '@/components/dashboard/DashboardStats';
import { getAllData } from '@/data/mockData';
import { useAuth } from '@/contexts/auth/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatRupiah } from '@/utils/currency';
import { supabase } from '@/integrations/supabase/client';
import { FinancialSummary, ChartData } from '@/types/finance';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState(getAllData());
  
  // Daily income and expense data for today
  const [dailyData, setDailyData] = useState([
    { hour: '06:00', income: 0, expense: 0 },
    { hour: '09:00', income: 0, expense: 0 },
    { hour: '12:00', income: 0, expense: 0 },
    { hour: '15:00', income: 0, expense: 0 },
    { hour: '18:00', income: 0, expense: 0 },
    { hour: '21:00', income: 0, expense: 0 },
  ]);

  // Fetch real transaction data
  const { data: transactions = [], isLoading: isLoadingTransactions } = useQuery({
    queryKey: ['dashboard-transactions'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('transactions')
          .select(`
            *,
            categories:category_id (id, name, type)
          `)
          .order('date', { ascending: false })
          .limit(10);
          
        if (error) throw error;
        
        return data || [];
      } catch (error) {
        console.error('Error fetching transactions:', error);
        return [];
      }
    },
  });

  // Fetch real monthly chart data
  const { data: monthlyChartData = [], isLoading: isLoadingMonthly } = useQuery({
    queryKey: ['dashboard-monthly-chart'],
    queryFn: async () => {
      try {
        // Get current year
        const currentYear = new Date().getFullYear();
        const monthData: ChartData[] = [];
        
        // Fetch data for each month of the current year
        for (let month = 0; month < 12; month++) {
          const startDate = new Date(currentYear, month, 1).toISOString();
          const endDate = new Date(currentYear, month + 1, 0).toISOString();
          
          // Fetch income for this month
          const { data: incomeData, error: incomeError } = await supabase
            .from('transactions')
            .select('amount')
            .eq('type', 'income')
            .gte('date', startDate)
            .lte('date', endDate);
            
          if (incomeError) throw incomeError;
          
          // Fetch expenses for this month
          const { data: expenseData, error: expenseError } = await supabase
            .from('transactions')
            .select('amount')
            .eq('type', 'expense')
            .gte('date', startDate)
            .lte('date', endDate);
            
          if (expenseError) throw expenseError;
          
          // Calculate totals
          const income = incomeData ? incomeData.reduce((sum, t) => sum + (t.amount || 0), 0) : 0;
          const expense = expenseData ? expenseData.reduce((sum, t) => sum + (t.amount || 0), 0) : 0;
          
          // Get month name
          const monthName = new Date(currentYear, month, 1).toLocaleDateString('id-ID', { month: 'short' });
          
          monthData.push({
            month: monthName,
            income,
            expense
          });
        }
        
        return monthData;
      } catch (error) {
        console.error('Error fetching monthly chart data:', error);
        return data.monthlyChartData;
      }
    },
  });

  // Fetch real yearly chart data
  const { data: yearlyChartData = [], isLoading: isLoadingYearly } = useQuery({
    queryKey: ['dashboard-yearly-chart'],
    queryFn: async () => {
      try {
        const currentYear = new Date().getFullYear();
        const yearData: ChartData[] = [];
        
        // Get data for last 5 years
        for (let i = 4; i >= 0; i--) {
          const year = currentYear - i;
          const startDate = new Date(year, 0, 1).toISOString();
          const endDate = new Date(year, 11, 31).toISOString();
          
          // Fetch income for this year
          const { data: incomeData, error: incomeError } = await supabase
            .from('transactions')
            .select('amount')
            .eq('type', 'income')
            .gte('date', startDate)
            .lte('date', endDate);
            
          if (incomeError) throw incomeError;
          
          // Fetch expenses for this year
          const { data: expenseData, error: expenseError } = await supabase
            .from('transactions')
            .select('amount')
            .eq('type', 'expense')
            .gte('date', startDate)
            .lte('date', endDate);
            
          if (expenseError) throw expenseError;
          
          // Calculate totals
          const income = incomeData ? incomeData.reduce((sum, t) => sum + (t.amount || 0), 0) : 0;
          const expense = expenseData ? expenseData.reduce((sum, t) => sum + (t.amount || 0), 0) : 0;
          
          yearData.push({
            year: year.toString(),
            income,
            expense
          });
        }
        
        return yearData;
      } catch (error) {
        console.error('Error fetching yearly chart data:', error);
        return data.yearlyChartData;
      }
    },
  });

  // Fetch real daily data
  const { data: realDailyData = dailyData, isLoading: isLoadingDaily } = useQuery({
    queryKey: ['dashboard-daily-chart'],
    queryFn: async () => {
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const hourRanges = [
          { label: '06:00', start: 6, end: 8 },
          { label: '09:00', start: 9, end: 11 },
          { label: '12:00', start: 12, end: 14 },
          { label: '15:00', start: 15, end: 17 },
          { label: '18:00', start: 18, end: 20 },
          { label: '21:00', start: 21, end: 23 },
        ];
        
        const result = [];
        
        for (const range of hourRanges) {
          const startTime = new Date(today);
          startTime.setHours(range.start, 0, 0, 0);
          
          const endTime = new Date(today);
          endTime.setHours(range.end, 59, 59, 999);
          
          // Fetch income for this time range
          const { data: incomeData, error: incomeError } = await supabase
            .from('transactions')
            .select('amount')
            .eq('type', 'income')
            .gte('date', startTime.toISOString())
            .lte('date', endTime.toISOString());
            
          if (incomeError) throw incomeError;
          
          // Fetch expenses for this time range
          const { data: expenseData, error: expenseError } = await supabase
            .from('transactions')
            .select('amount')
            .eq('type', 'expense')
            .gte('date', startTime.toISOString())
            .lte('date', endTime.toISOString());
            
          if (expenseError) throw expenseError;
          
          // Calculate totals
          const income = incomeData ? incomeData.reduce((sum, t) => sum + (t.amount || 0), 0) : 0;
          const expense = expenseData ? expenseData.reduce((sum, t) => sum + (t.amount || 0), 0) : 0;
          
          result.push({
            hour: range.label,
            income,
            expense
          });
        }
        
        return result;
      } catch (error) {
        console.error('Error fetching daily chart data:', error);
        return dailyData;
      }
    },
  });

  // Fetch financial summary (income, expenses, debts, receivables)
  const { data: financialSummary, isLoading: isLoadingSummary } = useQuery({
    queryKey: ['dashboard-financial-summary'],
    queryFn: async () => {
      try {
        // Get month's income
        const { data: monthlyIncome, error: incomeError } = await supabase
          .from('transactions')
          .select('amount')
          .eq('type', 'income')
          .gte('date', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
          .lt('date', new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString());

        if (incomeError) throw incomeError;

        // Get month's expenses
        const { data: monthlyExpenses, error: expenseError } = await supabase
          .from('transactions')
          .select('amount')
          .eq('type', 'expense')
          .gte('date', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
          .lt('date', new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString());

        if (expenseError) throw expenseError;

        // Get upcoming debts (payments due in the next 14 days)
        const { data: upcomingDebts, error: debtsError } = await supabase
          .from('debts')
          .select('*')
          .eq('is_paid', false)
          .gte('due_date', new Date().toISOString())
          .lte('due_date', new Date(new Date().setDate(new Date().getDate() + 14)).toISOString());

        if (debtsError) throw debtsError;

        // Get upcoming receivables (payments due in the next 14 days)
        const { data: upcomingReceivables, error: receivablesError } = await supabase
          .from('receivables')
          .select('*')
          .eq('is_received', false)
          .gte('due_date', new Date().toISOString())
          .lte('due_date', new Date(new Date().setDate(new Date().getDate() + 14)).toISOString());

        if (receivablesError) throw receivablesError;

        // Calculate totals
        const totalIncome = monthlyIncome ? monthlyIncome.reduce((sum, t) => sum + (t.amount || 0), 0) : 0;
        const totalExpense = monthlyExpenses ? monthlyExpenses.reduce((sum, t) => sum + (t.amount || 0), 0) : 0;
        const balance = totalIncome - totalExpense;
        
        // Format debts for display
        const formattedDebts = upcomingDebts ? upcomingDebts.map(debt => ({
          id: debt.id,
          amount: debt.amount,
          description: debt.description,
          personName: debt.description.split(':')[0] || 'Unknown Supplier',
          dueDate: debt.due_date,
          isPaid: debt.is_paid,
          contactInfo: debt.description.split(':')[1] || '',
        })) : [];

        // Format receivables for display
        const formattedReceivables = upcomingReceivables ? upcomingReceivables.map(receivable => ({
          id: receivable.id,
          amount: receivable.amount,
          description: receivable.description,
          personName: receivable.description.split(':')[0] || 'Unknown Customer',
          dueDate: receivable.due_date,
          isReceived: receivable.is_received,
          contactInfo: receivable.description.split(':')[1] || '',
        })) : [];

        return {
          totalIncome: { 
            month: totalIncome,
            week: 0,
            day: 0,
            year: 0,
            all: 0
          },
          totalExpense: { 
            month: totalExpense,
            week: 0,
            day: 0,
            year: 0,
            all: 0
          },
          balance,
          recentTransactions: transactions as any || [],
          upcomingDebts: formattedDebts,
          upcomingReceivables: formattedReceivables
        } as FinancialSummary;
      } catch (error) {
        console.error('Error fetching financial summary:', error);
        // Return default values if error
        return data.financialSummary;
      }
    },
  });

  // Update data with real values when available
  useEffect(() => {
    if (!isLoadingTransactions && !isLoadingMonthly && !isLoadingYearly && !isLoadingDaily && !isLoadingSummary) {
      const updatedData = {
        ...data,
        transactions: transactions.map(transaction => ({
          ...transaction,
          categoryId: transaction.categories?.id || null,
          accountId: transaction.account_id,
          createdBy: transaction.created_by || null,
          createdAt: transaction.created_at,
          updatedAt: transaction.updated_at,
        })),
        monthlyChartData: monthlyChartData,
        yearlyChartData: yearlyChartData,
        financialSummary: financialSummary || data.financialSummary,
      };
      setData(updatedData as any);
      setDailyData(realDailyData);
    }
  }, [transactions, monthlyChartData, yearlyChartData, realDailyData, financialSummary, isLoadingTransactions, isLoadingMonthly, isLoadingYearly, isLoadingDaily, isLoadingSummary]);

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border p-3 rounded-md shadow-md">
          <p className="font-medium">{label}</p>
          <p className="text-green-600">
            Pendapatan: {formatRupiah(payload[0].value)}
          </p>
          <p className="text-red-600">
            Pengeluaran: {formatRupiah(payload[1].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <MainLayout>
      <div className="pb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Selamat datang kembali, {user?.name || 'User'}! Berikut ringkasan keuangan Anda.
        </p>
      </div>

      {/* Main stats - we pass the summary as a prop */}
      {financialSummary && <DashboardStats summary={financialSummary} />}
      {!financialSummary && <DashboardStats />}

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Card className="dashboard-card">
            <CardHeader className="dashboard-card-header">
              <CardTitle>Pendapatan & Pengeluaran</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-6">
                <Tabs defaultValue="daily">
                  <TabsList>
                    <TabsTrigger value="daily">Harian</TabsTrigger>
                    <TabsTrigger value="monthly">Bulanan</TabsTrigger>
                    <TabsTrigger value="yearly">Tahunan</TabsTrigger>
                  </TabsList>
                  
                  {/* Daily chart */}
                  <TabsContent value="daily" className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={dailyData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="hour" />
                        <YAxis tickFormatter={(value) => `Rp${value/1000}k`} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar name="Pendapatan" dataKey="income" fill="#4CAF50" />
                        <Bar name="Pengeluaran" dataKey="expense" fill="#F44336" />
                      </BarChart>
                    </ResponsiveContainer>
                  </TabsContent>
                  
                  {/* Monthly chart */}
                  <TabsContent value="monthly" className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart 
                        data={monthlyChartData} 
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="month" />
                        <YAxis tickFormatter={(value) => `Rp${value/1000000}jt`} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar name="Pendapatan" dataKey="income" fill="#4CAF50" />
                        <Bar name="Pengeluaran" dataKey="expense" fill="#F44336" />
                      </BarChart>
                    </ResponsiveContainer>
                  </TabsContent>
                  
                  {/* Yearly chart */}
                  <TabsContent value="yearly" className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart 
                        data={yearlyChartData} 
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="year" />
                        <YAxis tickFormatter={(value) => `Rp${value/1000000}jt`} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar name="Pendapatan" dataKey="income" fill="#4CAF50" />
                        <Bar name="Pengeluaran" dataKey="expense" fill="#F44336" />
                      </BarChart>
                    </ResponsiveContainer>
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <DashboardCalendar transactions={data.transactions} />
        </div>
      </div>

      {/* Recent transactions */}
      <div className="mb-6">
        <RecentTransactions
          transactions={data.transactions}
          categories={data.categories}
        />
      </div>

      {/* Additional cards for account summaries or pending items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">Pembayaran Akan Datang</h3>
          </div>
          <div className="dashboard-card-body space-y-3">
            {data.financialSummary.upcomingDebts.map((debt) => (
              <div key={debt.id} className="flex justify-between items-center pb-2 border-b">
                <div>
                  <p className="font-medium text-sm">{debt.description}</p>
                  <p className="text-xs text-muted-foreground">Kepada {debt.personName}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-finance-expense">{formatRupiah(debt.amount)}</p>
                  <p className="text-xs text-muted-foreground">
                    {debt.dueDate ? new Date(debt.dueDate).toLocaleDateString('id-ID') : 'Tanpa tanggal'}
                  </p>
                </div>
              </div>
            ))}
            {data.financialSummary.upcomingDebts.length === 0 && (
              <p className="text-muted-foreground text-center py-3">Tidak ada pembayaran akan datang</p>
            )}
          </div>
        </div>
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">Penerimaan Akan Datang</h3>
          </div>
          <div className="dashboard-card-body space-y-3">
            {data.financialSummary.upcomingReceivables.map((receivable) => (
              <div key={receivable.id} className="flex justify-between items-center pb-2 border-b">
                <div>
                  <p className="font-medium text-sm">{receivable.description}</p>
                  <p className="text-xs text-muted-foreground">Dari {receivable.personName}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-finance-income">{formatRupiah(receivable.amount)}</p>
                  <p className="text-xs text-muted-foreground">
                    {receivable.dueDate ? new Date(receivable.dueDate).toLocaleDateString('id-ID') : 'Tanpa tanggal'}
                  </p>
                </div>
              </div>
            ))}
            {data.financialSummary.upcomingReceivables.length === 0 && (
              <p className="text-muted-foreground text-center py-3">Tidak ada penerimaan akan datang</p>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
