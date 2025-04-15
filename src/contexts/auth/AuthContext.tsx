
import React, { createContext, useContext, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { User } from './types';

// Auth context type
type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  session: Session | null;
};

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
  updateUser: () => {},
  session: null
});

export const useAuth = () => useContext(AuthContext);

export { AuthContext };
export type { AuthContextType };
