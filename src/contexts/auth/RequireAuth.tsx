
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';

// Route guard component for protected routes
export const RequireAuth: React.FC<{ 
  children: React.ReactNode;
  requiredRole?: 'admin' | 'manager';
}> = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    } else if (!loading && user && requiredRole && user.role !== requiredRole) {
      toast.error('You do not have permission to access this page');
      navigate('/dashboard');
    }
  }, [user, loading, navigate, requiredRole]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  if (requiredRole && user.role !== requiredRole) {
    return null;
  }

  return <>{children}</>;
};
