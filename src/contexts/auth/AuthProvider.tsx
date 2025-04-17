
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

  // Set up auth state listener
  useEffect(() => {
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('Auth state changed:', event, currentSession);
        setSession(currentSession);
        
        if (currentSession?.user) {
          // Fetch user profile after session is set
          // Use setTimeout to prevent Supabase auth deadlock
          setTimeout(() => {
            fetchUserProfile(currentSession.user.id);
          }, 0);
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    );

    // Check for existing session
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

  // Fetch user profile from the profiles table
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
        // Check if user email is hudhoed@rumahost.com and set role to admin
        let role = data.role as 'admin' | 'manager' | 'user';
        if (data.email === 'hudhoed@rumahost.com') {
          role = 'admin';
          // Update the role in the database to admin
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
        
        // Check if we can create the profile from user metadata
        const { data: userData } = await supabase.auth.getUser();
        const metadata = userData?.user?.user_metadata;
        
        if (metadata?.name) {
          console.log('Creating profile from metadata:', metadata);
          // Create profile from metadata
          let role = metadata.role || 'user';
          
          // If email is hudhoed@rumahost.com, set role to admin
          if (userData.user.email === 'hudhoed@rumahost.com') {
            role = 'admin';
          }
          
          await supabase.from('profiles').insert({
            id: userId,
            name: metadata.name,
            email: userData.user.email,
            role: role // Set to admin if special email, otherwise use metadata or default
          });
          
          setUser({
            id: userId,
            name: metadata.name,
            email: userData.user.email || '',
            role: (role as 'admin' | 'manager' | 'user'),
            profileImage: undefined
          });
        } else {
          toast.error('Profil pengguna tidak ditemukan');
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast.error('Gagal memuat profil pengguna');
    } finally {
      setLoading(false);
    }
  };

  // Login function
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
      
      // Translate common Supabase errors
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

  // Signup function
  const signup = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role: 'user' // Default role for new users is now 'user'
          }
        }
      });

      if (error) {
        throw error;
      }

      // If auto-confirmation is enabled, also create the profile right away
      if (data.user && !data.session) {
        // Email confirmation required
        toast.success('Pendaftaran berhasil! Silakan periksa email Anda untuk konfirmasi akun.');
      } else if (data.user && data.session) {
        // Special case for hudhoed@rumahost.com
        let role = 'user';
        if (email === 'hudhoed@rumahost.com') {
          role = 'admin';
        }
        
        // Auto-confirmed, create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            name: name,
            email: email,
            role: role
          });
          
        if (profileError) {
          console.error('Error creating profile:', profileError);
          toast.error('Pendaftaran berhasil tetapi gagal membuat profil');
        } else {
          toast.success('Pendaftaran berhasil! Anda akan diarahkan ke dashboard.');
          navigate('/dashboard');
        }
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

  // Logout function
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
      toast.info('Anda telah keluar');
    } catch (error: any) {
      toast.error(`Gagal keluar: ${error.message}`);
    }
  };

  // Update user function
  const updateUser = async (userData: Partial<User>) => {
    if (!user) return;
    
    try {
      // Update profile in Supabase
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

      // Update local state
      setUser(prev => prev ? { ...prev, ...userData } : null);
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
