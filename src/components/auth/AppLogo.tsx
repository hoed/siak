
import React from 'react';
import { Wallet } from 'lucide-react';

export const AppLogo: React.FC = () => {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="p-3 rounded-full bg-primary/10 mb-2">
        <Wallet className="h-8 w-8 text-primary" />
      </div>
      <h1 className="text-3xl font-bold">Sistem Administrasi Keuangan</h1>
      <p className="text-muted-foreground mt-2">Sistem Manajemen Keuangan</p>
    </div>
  );
};
