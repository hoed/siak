
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { initializeTestUsers, directSignInAsAdmin, directSignInAsCustomAdmin } from '@/integrations/supabase/auth-admin';
import { importChartOfAccounts } from '@/services/coaImportService';
import { chartOfAccountsData } from '@/data/chartOfAccountsData';
import { useNavigate } from 'react-router-dom';

type AdminToolsProps = {
  onSetCredentials: (email: string, password: string) => void;
};

export const AdminTools: React.FC<AdminToolsProps> = ({ onSetCredentials }) => {
  const [creatingTestUsers, setCreatingTestUsers] = useState(false);
  const [importingCoA, setImportingCoA] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // For quick testing
  const fillAdminCredentials = () => {
    onSetCredentials('admin@example.com', 'admin123');
  };
  
  const fillCustomAdminCredentials = () => {
    onSetCredentials('hoedhud@gmail.com', 'hoedhud12345');
  };
  
  // Create test users for development
  const handleCreateTestUsers = async () => {
    setCreatingTestUsers(true);
    try {
      const result = await initializeTestUsers();
      if (result.success) {
        toast.success('Pengguna test berhasil dibuat!');
        fillAdminCredentials();
      } else {
        toast.error('Gagal membuat pengguna test');
      }
    } catch (error: any) {
      console.error('Create test users error:', error);
      toast.error(`Gagal membuat pengguna test: ${error.message || 'Terjadi kesalahan'}`);
    } finally {
      setCreatingTestUsers(false);
    }
  };
  
  // Direct admin login (development only)
  const handleDirectAdminLogin = async () => {
    setLoading(true);
    try {
      const result = await directSignInAsAdmin();
      if (result.success) {
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Direct admin login error:', error);
      toast.error(`Login langsung gagal: ${error.message || 'Terjadi kesalahan'}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Direct custom admin login (development only)
  const handleDirectCustomAdminLogin = async () => {
    setLoading(true);
    try {
      const result = await directSignInAsCustomAdmin();
      if (result.success) {
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Direct custom admin login error:', error);
      toast.error(`Login langsung gagal: ${error.message || 'Terjadi kesalahan'}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Import Chart of Accounts
  const handleImportCoA = async () => {
    setImportingCoA(true);
    try {
      const result = await importChartOfAccounts(chartOfAccountsData);
      if (result) {
        toast.success('Chart of Accounts berhasil diimpor!');
      } else {
        toast.error('Gagal mengimpor Chart of Accounts');
      }
    } catch (error: any) {
      console.error('Import CoA error:', error);
      toast.error(`Gagal mengimpor Chart of Accounts: ${error.message || 'Terjadi kesalahan'}`);
    } finally {
      setImportingCoA(false);
    }
  };

  return (
    <div className="flex flex-col space-y-2 text-xs text-muted-foreground">
      <button 
        type="button" 
        className="text-primary hover:underline text-left" 
        onClick={fillAdminCredentials}
      >
        Isi kredensial admin untuk pengujian
      </button>
      <button 
        type="button" 
        className="text-primary hover:underline text-left" 
        onClick={fillCustomAdminCredentials}
      >
        Isi kredensial custom admin (hoedhud@gmail.com)
      </button>
      <button 
        type="button" 
        className="text-primary hover:underline text-left" 
        onClick={handleCreateTestUsers}
        disabled={creatingTestUsers}
      >
        {creatingTestUsers ? 'Membuat pengguna test...' : 'Buat pengguna test'}
      </button>
      <button 
        type="button" 
        className="text-primary hover:underline text-left" 
        onClick={handleDirectAdminLogin}
        disabled={loading}
      >
        Login langsung sebagai admin
      </button>
      <button 
        type="button" 
        className="text-primary hover:underline text-left" 
        onClick={handleDirectCustomAdminLogin}
        disabled={loading}
      >
        Login langsung sebagai custom admin
      </button>
      <button 
        type="button" 
        className="text-primary hover:underline text-left" 
        onClick={handleImportCoA}
        disabled={importingCoA}
      >
        {importingCoA ? 'Mengimpor Chart of Accounts...' : 'Import Chart of Accounts'}
      </button>
    </div>
  );
};
