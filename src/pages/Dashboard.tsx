// src/pages/Dashboard.tsx

import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import DashboardCalendar from '@/components/dashboard/DashboardCalendar';
import IncomeExpenseChart from '@/components/dashboard/IncomeExpenseChart';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import { getAllData } from '@/data/mockData'; 
import { useAuth } from '@/contexts/auth/AuthContext.tsx'; // <-- Added /auth and .tsx

const Dashboard: React.FC = () => {
  const { user } = useAuth(); // This should now work
  const [data, setData] = useState(getAllData());

  useEffect(() => {
    // In a real app, this would fetch data from an API
    setData(getAllData());
  }, []);

  // ... rest of the component remains the same
  return (
    <MainLayout>
      <div className="pb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}! Here's an overview of your finances.
        </p>
      </div>

      {/* Main stats */}

      {/* Charts and info grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <IncomeExpenseChart
            monthlyData={data.monthlyChartData}
            yearlyData={data.yearlyChartData}
          />
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
            <h3 className="dashboard-card-title">Upcoming Payments</h3>
          </div>
          <div className="dashboard-card-body space-y-3">
            {data.financialSummary.upcomingDebts.map((debt) => (
              <div key={debt.id} className="flex justify-between items-center pb-2 border-b">
                <div>
                  <p className="font-medium text-sm">{debt.description}</p>
                  <p className="text-xs text-muted-foreground">Due to {debt.personName}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-finance-expense">${debt.amount.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">
                    {debt.dueDate ? new Date(debt.dueDate).toLocaleDateString() : 'No date'}
                  </p>
                </div>
              </div>
            ))}
            {data.financialSummary.upcomingDebts.length === 0 && (
              <p className="text-muted-foreground text-center py-3">No upcoming payments</p>
            )}
          </div>
        </div>
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">Incoming Payments</h3>
          </div>
          <div className="dashboard-card-body space-y-3">
            {data.financialSummary.upcomingReceivables.map((receivable) => (
              <div key={receivable.id} className="flex justify-between items-center pb-2 border-b">
                <div>
                  <p className="font-medium text-sm">{receivable.description}</p>
                  <p className="text-xs text-muted-foreground">From {receivable.personName}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-finance-income">${receivable.amount.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">
                    {receivable.dueDate ? new Date(receivable.dueDate).toLocaleDateString() : 'No date'}
                  </p>
                </div>
              </div>
            ))}
            {data.financialSummary.upcomingReceivables.length === 0 && (
              <p className="text-muted-foreground text-center py-3">No incoming payments</p>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
