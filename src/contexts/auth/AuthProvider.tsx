import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { AuthContext, User, AuthContextType } from './AuthContext';

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
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      // Verify user exists in auth.users
      const { data: authUser, error: authError } = await supabase
        .rpc('is_admin', { user_id: userId })
        .select('id, email')
        .single();

      if (authError || !authUser) {
        throw new Error('User not found in auth.users');
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, email, role, profile_image')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        throw error;
      }

      console.log('Profile data received:', data);
      if (data) {
        let role = data.role as 'admin' | 'manager' | 'accountant' | 'user';
        if (data.email === 'hudhoed@rumahost.com') {
          role = 'admin';
          await supabase
            .from('profiles')
            .update({ role: 'admin' })
            .eq('id', userId);
        }

        setUser({
          id: data.id,
          name: data.name || '',
          email: data.email,
          role,
          profileImage: data.profile_image || undefined,
        });
      } else {
        console.log('No profile found, attempting to create one for:', userId);
        const { data: userData } = await supabase.auth.getUser();
        const metadata = userData?.user?.user_metadata;

        if (!userData.user?.email) {
          throw new Error('User email not available');
        }

        let role: 'admin' | 'manager' | 'accountant' | 'user' = 'user';
        if (userData.user.email === 'hudhoed@rumahost.com') {
          role = 'admin';
        } else if (metadata?.role && ['manager', 'accountant', 'user'].includes(metadata.role)) {
          role = metadata.role;
        }

        const profileData = {
          id: userId,
          name: metadata?.name || 'Unknown',
          email: userData.user.email,
          role,
        };

        const { error: insertError } = await supabase
          .from('profiles')
          .insert(profileData);

        if (insertError) {
          throw new Error(`Failed to create profile: ${insertError.message}`);
        }

        setUser({
          id: userId,
          name: profileData.name,
          email: profileData.email,
          role,
          profileImage: undefined,
        });
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
        password,
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

  const signup = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role: 'user',
          },
        },
      });

      if (error) {
        throw error;
      }

      if (data.user && !data.session) {
        toast.success('Pendaftaran berhasil! Silakan periksa email Anda untuk konfirmasi akun.');
        setLoading(false);
        return;
      }

      if (data.user && data.session) {
        let role: 'admin' | 'manager' | 'accountant' | 'user' = 'user';
        if (email === 'hudhoed@rumahost.com') {
          role = 'admin';
        }

        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            name,
            email,
            role,
          });

        if (profileError) {
          console.error('Error creating profile:', profileError);
          throw new Error(`Failed to create profile: ${profileError.message}`);
        }

        toast.success('Pendaftaran berhasil! Anda akan diarahkan ke dashboard.');
        navigate('/dashboard');
      }

      setLoading(false);
    } catch (error: any) {
      let errorMessage = 'Pendaftaran gagal';

      if (error.message.includes('already registered')) {
        errorMessage = 'Email sudah terdaftar';
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
          profile_image: userData.profileImage || user.profileImage,
        })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      setUser((prev) => (prev ? { ...prev, ...userData } : null));
      toast.success('Profil berhasil diperbarui');
    } catch (error: any) {
      toast.error(`Gagal memperbarui profil: ${error.message}`);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateUser, session }}>
      {children}
    </AuthContext.Provider>
  );
};