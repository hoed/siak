import { createContext, useContext } from 'react';
import type { Database } from '@/integrations/supabase/types';
import { Session } from '@supabase/supabase-js';

export type User = {
  id: string;
  name: string;
  email: string;
  role: Database['public']['Enums']['user_role'];
  profileImage?: string;
};

export type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  session: Session | null;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};