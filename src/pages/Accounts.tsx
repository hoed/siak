
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Accounts: React.FC = () => {
  return (
    <MainLayout>
      <div className="pb-4">
        <h1 className="text-2xl font-bold">Akun</h1>
        <p className="text-muted-foreground">
          Kelola akun perbankan Anda
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Akun Bank</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center py-10 text-muted-foreground">
            Halaman ini sedang dalam pengembangan. Fitur pengelolaan akun bank akan tersedia segera.
          </p>
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default Accounts;
