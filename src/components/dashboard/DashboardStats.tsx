import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowUpCircle, ArrowDownCircle, BadgeIndianRupee, Calendar } from 'lucide-react';
import { formatRupiah } from '@/utils/currency';
import { supabase } from '@/integrations/supabase/client';
import { FinancialSummary } from '@/types/finance';

interface DashboardStatsProps {
  summary?: FinancialSummary;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ summary: propsSummary }) => {
  const { data: fetchedSummary, isLoading } = useQuery({
    queryKey: ['financial-summary'],
    queryFn: async () => {
      try {
        // Get month's income
        const { data: monthlyIncome, error: incomeError } = await supabase
          .from('transactions')
          .select('amount')
          .eq('type', 'income')
          .gte('date', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
          .lt('date', new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString());

        if (incomeError) {
          console.error('Error fetching income:', incomeError);
          throw incomeError;
        }

        // Get month's expenses
        const { data: monthlyExpenses, error: expenseError } = await supabase
          .from('transactions')
          .select('amount')
          .eq('type', 'expense')
          .gte('date', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
          .lt('date', new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString());

        if (expenseError) {
          console.error('Error fetching expenses:', expenseError);
          throw expenseError;
        }

        // Get upcoming debts (payments due in the next 7 days)
        const { data: upcomingDebts, error: debtsError } = await supabase
          .from('debts')
          .select('*')
          .eq('is_paid', false)
          .gte('due_date', new Date().toISOString())
          .lte('due_date', new Date(new Date().setDate(new Date().getDate() + 7)).toISOString());

        if (debtsError) {
          console.error('Error fetching debts:', debtsError);
          throw debtsError;
        }

        // Get upcoming receivables (payments due in the next 7 days)
        const { data: upcomingReceivables, error: receivablesError } = await supabase
          .from('receivables')
          .select('*')
          .eq('is_received', false)
          .gte('due_date', new Date().toISOString())
          .lte('due_date', new Date(new Date().setDate(new Date().getDate() + 7)).toISOString());

        if (receivablesError) {
          console.error('Error fetching receivables:', receivablesError);
          throw receivablesError;
        }

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
          recentTransactions: [],
          upcomingDebts: formattedDebts,
          upcomingReceivables: formattedReceivables
        };
      } catch (error) {
        console.error('Error fetching financial summary:', error);
        // Return default values if error
        return {
          totalIncome: { month: 0, week: 0, day: 0, year: 0, all: 0 },
          totalExpense: { month: 0, week: 0, day: 0, year: 0, all: 0 },
          balance: 0,
          recentTransactions: [],
          upcomingDebts: [],
          upcomingReceivables: []
        };
      }
    },
    // Skip fetching if we already have data from props
    enabled: !propsSummary
  });

  const summary = propsSummary || fetchedSummary;

  if (isLoading || !summary) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="info-box animate-pulse">
            <div className="info-box-icon bg-gray-200 text-gray-300">
              <div className="h-6 w-6 rounded-full bg-gray-300"></div>
            </div>
            <div className="info-box-content">
              <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
              <div className="h-6 w-32 bg-gray-200 rounded mb-1"></div>
              <div className="h-3 w-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Pendapatan',
      icon: <ArrowUpCircle size={24} />,
      value: formatRupiah(summary.totalIncome.month),
      description: 'Total pendapatan bulan ini', // Added description
      color: 'bg-finance-income',
    },
    {
      title: 'Total Pengeluaran',
      icon: <ArrowDownCircle size={24} />,
      value: formatRupiah(summary.totalExpense.month),
      description: 'Total pengeluaran bulan ini', // Added description
      color: 'bg-finance-expense',
    },
    {
      title: 'Saldo',
      icon: <BadgeIndianRupee size={24} />,
      value: formatRupiah(summary.balance),
      description: 'Saldo saat ini', // Added description
      color: 'bg-finance-neutral',
    },
    {
      title: 'Pembayaran Akan Datang',
      icon: <Calendar size={24} />,
      value: formatRupiah(summary.upcomingDebts.reduce((acc, debt) => acc + debt.amount, 0)),
      description: `${summary.upcomingDebts.length} hutang jatuh tempo minggu ini`, // Added description
      color: 'bg-finance-debt',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className="info-box animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
          <div className={`info-box-icon ${stat.color}`}>
            {stat.icon}
          </div>
          <div className="info-box-content">
            <div className="info-box-text">{stat.title}</div>
            <div className="info-box-number">{stat.value}</div>
            <div className="mt-1 text-xs text-muted-foreground">{stat.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
