
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Income, Expense } from '@/types/finance';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RecentTransactionsProps {
  transactions: (Income | Expense)[];
  categories: { id: string; name: string; type: string }[];
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions, categories }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Uncategorized';
  };

  return (
    <Card className="dashboard-card">
      <CardHeader className="dashboard-card-header">
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent className="px-0 py-2">
        <div className="space-y-1">
          {transactions.slice(0, 5).map((transaction) => (
            <div 
              key={transaction.id} 
              className="flex items-center justify-between px-6 py-3 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center mr-3",
                  transaction.type === 'income' ? 'bg-finance-income/20 text-finance-income' : 'bg-finance-expense/20 text-finance-expense'
                )}>
                  {transaction.type === 'income' ? 
                    <ArrowUpCircle size={18} /> : 
                    <ArrowDownCircle size={18} />
                  }
                </div>
                <div>
                  <p className="text-sm font-medium">{transaction.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {getCategoryName(transaction.categoryId)} • {formatDate(transaction.date)}
                  </p>
                </div>
              </div>
              <span className={cn(
                "text-sm font-medium",
                transaction.type === 'income' ? 'text-finance-income' : 'text-finance-expense'
              )}>
                {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
              </span>
            </div>
          ))}
        </div>
        <div className="px-6 pt-4 pb-2 border-t mt-2">
          <a href="/transactions" className="text-sm text-primary hover:underline">
            View all transactions
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;
