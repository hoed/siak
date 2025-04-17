// src/contexts/auth/AuthContext.tsx

import React, { createContext, useContext, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { User } from './types'; // Assuming types.ts is in the same 'auth' folder

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

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Export the context itself if needed elsewhere (e.g., for the Provider)
export { AuthContext };
export type { AuthContextType }; // Export the type if needed
