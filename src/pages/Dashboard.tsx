import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/auth/AuthContext.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <MainLayout>
      <div className="pb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}! Here's an overview of your finances.
        </p>
      </div>

      {/* Placeholder for financial data */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Financial data will be displayed here once implemented.
          </p>
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default Dashboard;