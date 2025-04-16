
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartData } from '@/types/finance';

interface IncomeExpenseChartProps {
  monthlyData: ChartData[];
  yearlyData: ChartData[];
}

const IncomeExpenseChart: React.FC<IncomeExpenseChartProps> = ({ monthlyData, yearlyData }) => {
  const [activeTab, setActiveTab] = useState('monthly');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border p-3 rounded-md shadow-md">
          <p className="font-medium">{label}</p>
          <p className="text-finance-income">
            Income: {formatCurrency(payload[0].value)}
          </p>
          <p className="text-finance-expense">
            Expense: {formatCurrency(payload[1].value)}
          </p>
          <p className="font-medium">
            Net: {formatCurrency(payload[0].value - payload[1].value)}
          </p>
        </div>
      );
    }
  
    return null;
  };

  return (
    <Card className="dashboard-card">
      <CardHeader className="dashboard-card-header">
        <CardTitle>Income & Expenses</CardTitle>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="p-0">
        <div className="p-6">
          <TabsContent value="monthly" className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `$${value}`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="income" fill="#4CAF50" name="Income" />
                <Bar dataKey="expense" fill="#F44336" name="Expense" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          <TabsContent value="yearly" className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yearlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="year" />
                <YAxis tickFormatter={(value) => `$${value}`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="income" fill="#4CAF50" name="Income" />
                <Bar dataKey="expense" fill="#F44336" name="Expense" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </div>
      </CardContent>
    </Card>
  );
};

export default IncomeExpenseChart;
