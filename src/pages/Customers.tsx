
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Customers: React.FC = () => {
  return (
    <MainLayout>
      <div className="pb-4">
        <h1 className="text-2xl font-bold">Pelanggan</h1>
        <p className="text-muted-foreground">
          Kelola data pelanggan Anda
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Pelanggan</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center py-10 text-muted-foreground">
            Halaman ini sedang dalam pengembangan. Fitur pengelolaan pelanggan akan tersedia segera.
          </p>
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default Customers;
