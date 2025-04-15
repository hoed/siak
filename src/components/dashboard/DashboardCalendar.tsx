
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Transaction } from '@/types/finance';
import { cn } from '@/lib/utils';

interface DashboardCalendarProps {
  transactions: Transaction[];
}

const DashboardCalendar: React.FC<DashboardCalendarProps> = ({ transactions }) => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Group transactions by date
  const transactionsByDate = transactions.reduce<Record<string, Transaction[]>>(
    (acc, transaction) => {
      const dateStr = new Date(transaction.date).toISOString().split('T')[0];
      if (!acc[dateStr]) {
        acc[dateStr] = [];
      }
      acc[dateStr].push(transaction);
      return acc;
    },
    {}
  );

  // Create a day content renderer that highlights days with transactions
  const dayContent = (day: Date) => {
    const dateStr = day.toISOString().split('T')[0];
    const hasTransactions = transactionsByDate[dateStr]?.length > 0;
    
    return (
      <div className="relative flex h-9 w-9 items-center justify-center">
        <span>{day.getDate()}</span>
        {hasTransactions && (
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-primary"></div>
        )}
      </div>
    );
  };
  
  // Calculate totals for selected date
  const selectedDateStr = date?.toISOString().split('T')[0];
  const selectedTransactions = selectedDateStr ? transactionsByDate[selectedDateStr] || [] : [];

  const totalIncome = selectedTransactions
    .filter(t => 'type' in t && t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpense = selectedTransactions
    .filter(t => 'type' in t && t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // Format currency
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return (
    <Card className="dashboard-card">
      <CardHeader className="dashboard-card-header">
        <CardTitle>Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="p-2">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
            components={{
              DayContent: ({ date }) => dayContent(date),
            }}
          />
          
          {selectedTransactions.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium text-sm mb-2">
                Transactions for {date?.toLocaleDateString()}
              </h3>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">Income:</span>
                <span className="text-sm text-finance-income font-medium">
                  {formatter.format(totalIncome)}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">Expenses:</span>
                <span className="text-sm text-finance-expense font-medium">
                  {formatter.format(totalExpense)}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="text-sm font-medium">Balance:</span>
                <span className={cn(
                  "text-sm font-medium",
                  totalIncome - totalExpense >= 0 ? "text-finance-income" : "text-finance-expense"
                )}>
                  {formatter.format(totalIncome - totalExpense)}
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardCalendar;
