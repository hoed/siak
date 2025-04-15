import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

// Define custom User type
interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager';
  profileImage?: string;
}

// Auth context type
type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  session: Session | null;
};

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  updateUser: async () => {},
  session: null,
});

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check initial session
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('Initial session check:', { session, error }); // Debugging
        if (error) {
          console.error('Session error:', error.message);
          setLoading(false);
          return;
        }
        setSession(session);
        if (session?.user) {
          const userData: User = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || 'User',
            role: session.user.user_metadata?.role || 'manager',
            profileImage: session.user.user_metadata?.profileImage,
          };
          setUser(userData);
        }
      } catch (err) {
        console.error('Unexpected error in checkSession:', err);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log('Auth event:', event, 'Session:', newSession); // Debugging
      setSession(newSession);
      if (event === 'SIGNED_IN' && newSession?.user) {
        setUser({
          id: newSession.user.id,
          email: newSession.user.email || '',
          name: newSession.user.user_metadata?.name || 'User',
          role: newSession.user.user_metadata?.role || 'manager',
          profileImage: newSession.user.user_metadata?.profileImage,
        });
        navigate('/dashboard');
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        navigate('/login');
      }
      setLoading(false);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [navigate]);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      console.log('Login attempt:', { data, error }); // Debugging
      if (error) {
        throw new Error(error.message);
      }
      if (!data.user) {
        throw new Error('No user data returned after login');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      throw new Error(err.message || 'Failed to log in');
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role: 'manager',
          },
        },
      });
      console.log('Signup attempt:', { data, error }); // Debugging
      if (error) {
        throw new Error(error.message);
      }
      if (!data.user) {
        throw new Error('No user data returned after signup');
      }
    } catch (err: any) {
      console.error('Signup error:', err);
      throw new Error(err.message || 'Failed to create account');
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      console.log('Logout attempt:', { error }); // Debugging
      if (error) {
        throw new Error(error.message);
      }
    } catch (err: any) {
      console.error('Logout error:', err);
      throw new Error(err.message || 'Failed to log out');
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!user) {
      throw new Error('No user logged in');
    }
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          name: userData.name ?? user.name,
          role: userData.role ?? user.role,
          profileImage: userData.profileImage ?? user.profileImage,
        },
      });
      console.log('Update user attempt:', { error }); // Debugging
      if (error) {
        throw new Error(error.message);
      }
      setUser((prev) =>
        prev
          ? {
              ...prev,
              ...userData,
            }
          : null
      );
    } catch (err: any) {
      console.error('Update user error:', err);
      throw new Error(err.message || 'Failed to update user');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        updateUser,
        session,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Export the context and type
export { AuthContext };
export type { AuthContextType };