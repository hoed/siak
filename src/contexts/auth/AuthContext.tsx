import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type User = {
  id: string;
  email: string;
  role: Database['public']['Enums']['user_role'];
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Validate role to ensure it matches user_role enum
const validRoles: Database['public']['Enums']['user_role'][] = ['admin', 'manager', 'accountant', 'user'];
const isValidRole = (role: any): role is Database['public']['Enums']['user_role'] =>
  validRoles.includes(role);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData.session) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('id, email, role')
          .eq('id', sessionData.session.user.id)
          .single() as { data: Database['public']['Tables']['profiles']['Row'] | null; error: any };

        if (error || !profile) {
          console.error('Error fetching profile:', error);
        } else {
          const role = isValidRole(profile.role) ? profile.role : 'user';
          setUser({
            id: profile.id,
            email: profile.email,
            role,
          });
        }
      }
      setLoading(false);
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        supabase
          .from('profiles')
          .select('id, email, role')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profile, error }) => {
            if (error || !profile) {
              console.error('Error fetching profile:', error);
            } else {
              const role = isValidRole(profile.role) ? profile.role : 'user';
              setUser({
                id: profile.id,
                email: profile.email,
                role,
              });
            }
            setLoading(false);
          });
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
