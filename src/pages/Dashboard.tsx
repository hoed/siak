
import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import DashboardCalendar from '@/components/dashboard/DashboardCalendar';
import IncomeExpenseChart from '@/components/dashboard/IncomeExpenseChart';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import { getAllData } from '@/data/mockData';
import { useAuth } from '@/contexts/auth/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState(getAllData());

  useEffect(() => {
    // In a real app, this would fetch data from an API
    setData(getAllData());
  }, []);

  return (
    <MainLayout>
      <div className="pb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Selamat datang kembali, {user?.name}! Berikut ringkasan keuangan Anda.
        </p>
      </div>

      {/* Main stats */}
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
                  <p className="font-medium text-finance-expense">Rp{debt.amount.toLocaleString('id-ID')}</p>
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
                  <p className="font-medium text-finance-income">Rp{receivable.amount.toLocaleString('id-ID')}</p>
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
