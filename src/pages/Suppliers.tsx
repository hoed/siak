
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Suppliers: React.FC = () => {
  return (
    <MainLayout>
      <div className="pb-4">
        <h1 className="text-2xl font-bold">Pemasok</h1>
        <p className="text-muted-foreground">
          Kelola data pemasok Anda
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Pemasok</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center py-10 text-muted-foreground">
            Halaman ini sedang dalam pengembangan. Fitur pengelolaan pemasok akan tersedia segera.
          </p>
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default Suppliers;
