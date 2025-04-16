import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExtendedDatabase } from '@/integrations/supabase/chart-of-accounts-types';

type Transaction = ExtendedDatabase['public']['Tables']['transactions']['Row'];

interface RecentTransactionsProps {
  transactions: Transaction[];
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          {transactions.length > 0 ? (
            <ul>
              {transactions.map(txn => (
                <li key={txn.id}>
                  {txn.date}: {txn.type} - {txn.amount} - {txn.description || 'No description'}
                </li>
              ))}
            </ul>
          ) : (
            <p>No recent transactions to display.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;