
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

      // Get upcoming debts
      const { data: upcomingDebts, error: debtsError } = await supabase
        .from('debts')
        .select('*')
        .eq('is_paid', false)
        .gte('due_date', new Date().toISOString())
        .lte('due_date', new Date(new Date().setDate(new Date().getDate() + 7)).toISOString());

      if (debtsError) throw debtsError;

      const totalIncome = monthlyIncome.reduce((sum, t) => sum + t.amount, 0);
      const totalExpense = monthlyExpenses.reduce((sum, t) => sum + t.amount, 0);
      const balance = totalIncome - totalExpense;
      const upcomingDebtTotal = upcomingDebts.reduce((sum, d) => sum + d.amount, 0);

      return {
        totalIncome: { month: totalIncome },
        totalExpense: { month: totalExpense },
        balance,
        upcomingDebts
      };
    },
    // Skip fetching if we already have data from props
    enabled: !propsSummary
  });

  const summary = propsSummary || fetchedSummary;

  if (isLoading || !summary) {
    return <div>Loading...</div>;
  }

  const stats = [
    {
      title: 'Total Pendapatan',
      icon: <ArrowUpCircle size={24} />,
      value: formatRupiah(summary.totalIncome.month),
      change: '+5,2%',
      period: 'Bulan Ini',
      color: 'bg-finance-income',
    },
    {
      title: 'Total Pengeluaran',
      icon: <ArrowDownCircle size={24} />,
      value: formatRupiah(summary.totalExpense.month),
      change: '-2,1%',
      period: 'Bulan Ini',
      color: 'bg-finance-expense',
    },
    {
      title: 'Saldo',
      icon: <BadgeIndianRupee size={24} />,
      value: formatRupiah(summary.balance),
      change: '+3,5%',
      period: 'Saldo Saat Ini',
      color: 'bg-finance-neutral',
    },
    {
      title: 'Pembayaran Akan Datang',
      icon: <Calendar size={24} />,
      value: formatRupiah(summary.upcomingDebts.reduce((acc, debt) => acc + debt.amount, 0)),
      change: '',
      period: 'Jatuh tempo minggu ini',
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
            <span className="info-box-text">{stat.title}</span>
            <span className="info-box-number">{stat.value}</span>
            <div className="mt-1 text-xs">
              {stat.change && (
                <span className={stat.change.startsWith('+') ? 'text-finance-income' : 'text-finance-expense'}>
                  {stat.change}
                </span>
              )}
              <span className="text-muted-foreground ml-1">{stat.period}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
