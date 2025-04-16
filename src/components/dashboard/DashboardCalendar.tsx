import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExtendedDatabase } from '@/integrations/supabase/chart-of-accounts-types';

type Transaction = ExtendedDatabase['public']['Tables']['transactions']['Row'];

interface DashboardCalendarProps {
  transactions: Transaction[];
}

const DashboardCalendar: React.FC<DashboardCalendarProps> = ({ transactions }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          {transactions.length > 0 ? (
            <ul>
              {transactions.map(txn => (
                <li key={txn.id}>
                  {txn.date}: {txn.type} - {txn.amount}
                </li>
              ))}
            </ul>
          ) : (
            <p>No transactions to display.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardCalendar;