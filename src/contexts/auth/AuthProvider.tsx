
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { AuthContext } from './AuthContext';
import { User } from './types';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('Auth state changed:', event, currentSession);
        setSession(currentSession);
        
        if (currentSession?.user) {
          setTimeout(() => {
            fetchUserProfile(currentSession.user.id);
          }, 0);
        } else {
          setUser(null);
          setLoading(false);
          // Redirect to login when logged out
          if (event === 'SIGNED_OUT') {
            navigate('/login');
          }
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log('Initial session check:', currentSession);
      setSession(currentSession);
      
      if (currentSession?.user) {
        fetchUserProfile(currentSession.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        throw error;
      }

      console.log('Profile data received:', data);
      if (data) {
        let role = data.role as 'admin' | 'manager' | 'user';
        if (data.email === 'hudhoed@rumahost.com') {
          role = 'admin';
          await supabase
            .from('profiles')
            .update({ role: 'admin' })
            .eq('id', userId);
        }
        
        setUser({
          id: data.id,
          name: data.name,
          email: data.email,
          role: role,
          profileImage: data.profile_image || undefined
        });
      } else {
        console.error('No profile found for user:', userId);
        toast.error('Profil pengguna tidak ditemukan');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast.error('Gagal memuat profil pengguna');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('Attempting login with:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      console.log('Login successful:', data);
      toast.success('Login berhasil!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      
      let errorMessage = 'Login gagal';
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Email atau kata sandi tidak valid';
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'Email belum dikonfirmasi. Periksa kotak masuk email Anda.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
      toast.info('Anda telah keluar');
    } catch (error: any) {
      toast.error(`Gagal keluar: ${error.message}`);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: userData.name || user.name,
          profile_image: userData.profileImage || user.profileImage
        })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      setUser(prev => prev ? { ...prev, ...userData } : null);
      toast.success('Profil berhasil diperbarui');
    } catch (error: any) {
      toast.error(`Gagal memperbarui profil: ${error.message}`);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser, session }}>
      {children}
    </AuthContext.Provider>
  );
};
