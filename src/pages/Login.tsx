import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppLogo } from '@/components/auth/AppLogo';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';

const Login: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-background p-4">
      <div className="w-full max-w-md space-y-8 text-center">
        {/* Logo and app name */}
        <AppLogo />

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-center">Selamat Datang</CardTitle>
            <CardDescription className="text-center">
              Kelola keuangan Anda dengan mudah
            </CardDescription>
          </CardHeader>
          
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2 mb-4 px-6">
              <TabsTrigger value="login">Masuk</TabsTrigger>
              <TabsTrigger value="signup">Daftar</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <LoginForm />
            </TabsContent>
            
            <TabsContent value="signup">
              <SignupForm />
            </TabsContent>
          </Tabs>
        </Card>
      </div>

      {/* Footer Section */}
      <footer className="w-full text-center py-4 text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} Hoed's Project. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Login;