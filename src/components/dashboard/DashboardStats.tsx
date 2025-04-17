
import React from 'react';
import { ArrowUpCircle, ArrowDownCircle, DollarSign, Calendar } from 'lucide-react';
import { FinancialSummary } from '../../types/finance';

interface DashboardStatsProps {
  summary: FinancialSummary;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ summary }) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  const stats = [
    {
      title: 'Total Income',
      icon: <ArrowUpCircle size={24} />,
      value: formatter.format(summary.totalIncome.month),
      change: '+5.2%',
      period: 'This Month',
      color: 'bg-finance-income',
    },
    {
      title: 'Total Expenses',
      icon: <ArrowDownCircle size={24} />,
      value: formatter.format(summary.totalExpense.month),
      change: '-2.1%',
      period: 'This Month',
      color: 'bg-finance-expense',
    },
    {
      title: 'Balance',
      icon: <DollarSign size={24} />,
      value: formatter.format(summary.balance),
      change: '+3.5%',
      period: 'Current Balance',
      color: 'bg-finance-neutral',
    },
    {
      title: 'Upcoming Payments',
      icon: <Calendar size={24} />,
      value: formatter.format(summary.upcomingDebts.reduce((acc, debt) => acc + debt.amount, 0)),
      change: '',
      period: 'Due this week',
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
