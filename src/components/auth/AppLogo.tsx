import React from 'react';

export const AppLogo: React.FC = () => {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="p-3 rounded-full bg-primary/10 mb-2">
        <img src="/finance.png" alt="Finance Logo" className="h-8 w-8" />
      </div>
      <h1 className="text-3xl font-bold">Sistem Manajemen Keuangan</h1>
      <p className="text-muted-foreground mt-2">PT Finance Manufaktur Indonesia</p>
    </div>
  );
};
