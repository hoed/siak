
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
      await login(email, password);
      // Navigation handled in AuthContext
    } catch (error) {
      console.error('Login error:', error);
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
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setSignupLoading(false);
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
          <p className="text-muted-foreground mt-2">Financial Management System</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome to Sistem Administrasi Keuangan</CardTitle>
            <CardDescription>
              Manage your finances with ease
            </CardDescription>
          </CardHeader>
          
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2 mb-4 px-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <a 
                        href="#" 
                        className="text-xs text-primary hover:underline"
                        onClick={(e) => {
                          e.preventDefault();
                          toast.info('Password reset functionality will be implemented soon.');
                        }}
                      >
                        Forgot password?
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
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign in'}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignup}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
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
                      placeholder="your.email@example.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
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
                      Password must be at least 6 characters
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={signupLoading}>
                    {signupLoading ? 'Creating account...' : 'Create account'}
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
