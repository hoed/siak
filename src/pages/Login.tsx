
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AppLogo } from '@/components/auth/AppLogo';
import { LoginForm } from '@/components/auth/LoginForm';

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
            <CardTitle className="text-center">Login</CardTitle>
            <CardDescription className="text-center">
              Please enter your credentials to access your account.
            </CardDescription>
          </CardHeader>
          
          <LoginForm />
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
