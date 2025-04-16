
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardContent, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth';

export const SignupForm: React.FC = () => {
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupLoading, setSignupLoading] = useState(false);
  const { signup } = useAuth();

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

  return (
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
  );
};
