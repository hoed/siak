
import React, { useEffect, useState } from 'react';
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

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState(getAllData());
  
  // Daily income and expense data for today
  const [dailyData, setDailyData] = useState([
    { hour: '06:00', income: 0, expense: 0 },
    { hour: '09:00', income: 120000, expense: 0 },
    { hour: '12:00', income: 250000, expense: 75000 },
    { hour: '15:00', income: 350000, expense: 150000 },
    { hour: '18:00', income: 520000, expense: 230000 },
    { hour: '21:00', income: 680000, expense: 280000 },
  ]);

  useEffect(() => {
    // In a real app, this would fetch data from an API
    setData(getAllData());
  }, []);

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

      {/* Main stats - now we pass the summary as a prop */}
      <DashboardStats summary={data.financialSummary} />

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
                        data={data.monthlyChartData} 
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
                        data={data.yearlyChartData} 
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
