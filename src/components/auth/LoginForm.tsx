
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardContent, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth';
import { AdminTools } from './AdminTools';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

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

  const handleSetCredentials = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
  };

  return (
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
        <AdminTools onSetCredentials={handleSetCredentials} />
      </CardContent>
      <CardFooter>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Masuk...' : 'Masuk'}
        </Button>
      </CardFooter>
    </form>
  );
};
