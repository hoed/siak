import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ChartData {
  year: string;
  income: number;
  expense: number;
}

interface IncomeExpenseChartProps {
  yearlyData: ChartData[];
}

const IncomeExpenseChart: React.FC<IncomeExpenseChartProps> = ({ yearlyData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Income vs Expense (Yearly)</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          {yearlyData.length > 0 ? (
            <ul>
              {yearlyData.map(data => (
                <li key={data.year}>
                  {data.year}: Income: {data.income}, Expense: {data.expense}
                </li>
              ))}
            </ul>
          ) : (
            <p>No data available for chart.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default IncomeExpenseChart;