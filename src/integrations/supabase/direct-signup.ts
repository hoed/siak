
import { supabase } from './client';

export const createUserDirectly = async (email: string, password: string, name: string, role: 'admin' | 'manager') => {
  try {
    // Create the user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    });
    
    if (authError) throw authError;
    
    // If successful, the trigger should create a profile entry
    // But we can manually ensure it exists with the right role
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: authData.user.id,
          email,
          name,
          role
        });
      
      if (profileError) throw profileError;
    }
    
    return { success: true, user: authData.user };
  } catch (error) {
    console.error('Error creating user directly:', error);
    throw error;
  }
};
