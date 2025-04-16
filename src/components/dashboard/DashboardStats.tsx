import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExtendedDatabase } from '@/integrations/supabase/chart-of-accounts-types';

type Transaction = ExtendedDatabase['public']['Tables']['transactions']['Row'];

interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  netIncome: number;
  recentTransactions: Transaction[];
  upcomingReceivables: any[];
}

interface DashboardStatsProps {
  summary: FinancialSummary;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Total Income</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{summary.totalIncome.toLocaleString()}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Expense</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{summary.totalExpense.toLocaleString()}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Net Income</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{summary.netIncome.toLocaleString()}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;