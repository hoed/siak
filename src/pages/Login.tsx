import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { initializeTestUsers, directSignInAsAdmin, directSignInAsCustomAdmin } from '@/integrations/supabase/auth-admin';
import { importChartOfAccounts } from '@/services/coaImportService';
import { chartOfAccountsData } from '@/data/chartOfAccountsData';

const Login: React.FC = () => {
  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Signup form state
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupLoading, setSignupLoading] = useState(false);
  
  // Creating test users state
  const [creatingTestUsers, setCreatingTestUsers] = useState(false);
  
  // Importing CoA state
  const [importingCoA, setImportingCoA] = useState(false);
  
  // Auth state
  const { login, signup, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Attempting login with:', email, password);
      await login(email, password);
      // Navigation handled in AuthContext
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(`Login gagal: ${error.message || 'Terjadi kesalahan'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupLoading(true);

    try {
      await signup(signupEmail, signupPassword, signupName);
      // Reset form
      setSignupEmail('');
      setSignupPassword('');
      setSignupName('');
      toast.success('Pendaftaran berhasil! Silahkan periksa email Anda untuk konfirmasi akun.');
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(`Pendaftaran gagal: ${error.message || 'Terjadi kesalahan'}`);
    } finally {
      setSignupLoading(false);
    }
  };

  // For quick testing
  const fillAdminCredentials = () => {
    setEmail('admin@example.com');
    setPassword('admin123');
  };
  
  const fillCustomAdminCredentials = () => {
    setEmail('hoedhud@gmail.com');
    setPassword('hoedhud12345');
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
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and app name */}
        <div className="flex flex-col items-center text-center">
          <div className="p-3 rounded-full bg-primary/10 mb-2">
            <Wallet className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Sistem Administrasi Keuangan</h1>
          <p className="text-muted-foreground mt-2">Sistem Manajemen Keuangan</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Selamat Datang</CardTitle>
            <CardDescription>
              Kelola keuangan Anda dengan mudah
            </CardDescription>
          </CardHeader>
          
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2 mb-4 px-6">
              <TabsTrigger value="login">Masuk</TabsTrigger>
              <TabsTrigger value="signup">Daftar</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email.anda@contoh.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Kata Sandi</Label>
                      <a 
                        href="#" 
                        className="text-xs text-primary hover:underline"
                        onClick={(e) => {
                          e.preventDefault();
                          toast.info('Fungsi reset kata sandi akan segera diimplementasikan.');
                        }}
                      >
                        Lupa kata sandi?
                      </a>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
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
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Masuk...' : 'Masuk'}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignup}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Nama Lengkap</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="John Doe"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="email.anda@contoh.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Kata Sandi</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                    <p className="text-xs text-muted-foreground">
                      Kata sandi harus minimal 6 karakter
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={signupLoading}>
                    {signupLoading ? 'Membuat akun...' : 'Buat Akun'}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Login;
