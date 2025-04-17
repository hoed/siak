
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';

const Receivables: React.FC = () => {
  return (
    <MainLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Piutang</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-muted-foreground">
            Halaman ini akan menampilkan daftar dan manajemen piutang Anda.
          </p>
          <div className="flex justify-center items-center h-64 border border-dashed rounded-lg mt-4">
            <p className="text-center text-muted-foreground">
              Fitur ini sedang dalam pengembangan
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Receivables;
