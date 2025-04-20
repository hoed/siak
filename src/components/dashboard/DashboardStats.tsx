
import React from 'react';
import { ArrowUpCircle, ArrowDownCircle, BadgeIndianRupee, Calendar } from 'lucide-react';
import { FinancialSummary } from '../../types/finance';
import { formatRupiah } from '@/utils/currency';

interface DashboardStatsProps {
  summary: FinancialSummary;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ summary }) => {
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
