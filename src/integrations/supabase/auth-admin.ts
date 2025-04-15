
import { supabase } from './client';

/**
 * Note: This file contains functions for administrator use only.
 * In a real production environment, these functions should be performed
 * via server-side admin APIs, not exposed in client code.
 */

export const createTestUsers = async () => {
  try {
    // Check if admin user exists
    const { data: existingAdminData, error: existingAdminError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', 'admin@example.com')
      .maybeSingle();

    if (existingAdminError) {
      console.error('Error checking for existing admin:', existingAdminError);
    }

    // If admin does not exist, create it
    if (!existingAdminData) {
      console.log('Creating admin user...');
      // First create auth user
      const { data: adminAuthData, error: adminAuthError } = await supabase.auth.signUp({
        email: 'admin@example.com',
        password: 'admin123',
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            name: 'Admin User',
            role: 'admin'
          }
        }
      });
      
      if (adminAuthError) {
        throw adminAuthError;
      }
      
      console.log('Admin auth user created:', adminAuthData);
      
      // Manually insert admin profile if needed
      if (adminAuthData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: adminAuthData.user.id,
            name: 'Admin User',
            email: 'admin@example.com',
            role: 'admin'
          });
          
        if (profileError) {
          console.error('Error creating admin profile:', profileError);
        } else {
          console.log('Admin profile created successfully');
        }
      }
    } else {
      console.log('Admin user already exists');
    }
    
    // Check if manager user exists
    const { data: existingManagerData, error: existingManagerError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', 'accountant@example.com')
      .maybeSingle();

    if (existingManagerError) {
      console.error('Error checking for existing manager:', existingManagerError);
    }

    // If manager does not exist, create it
    if (!existingManagerData) {
      console.log('Creating manager user...');
      // Create manager auth user
      const { data: managerAuthData, error: managerAuthError } = await supabase.auth.signUp({
        email: 'accountant@example.com',
        password: 'accountant123',
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            name: 'Accountant User',
            role: 'manager'
          }
        }
      });
      
      if (managerAuthError) {
        throw managerAuthError;
      }
      
      console.log('Manager auth user created:', managerAuthData);
      
      // Manually insert manager profile if needed
      if (managerAuthData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: managerAuthData.user.id,
            name: 'Accountant User',
            email: 'accountant@example.com',
            role: 'manager'
          });
          
        if (profileError) {
          console.error('Error creating manager profile:', profileError);
        } else {
          console.log('Manager profile created successfully');
        }
      }
    } else {
      console.log('Manager user already exists');
    }

    return { success: true };
  } catch (error) {
    console.error('Error creating test users:', error);
    throw error;
  }
};

// Add a utility to initialize users
export const initializeTestUsers = async () => {
  try {
    const result = await createTestUsers();
    console.log('Test users initialization result:', result);
    return result;
  } catch (error) {
    console.error('Failed to initialize test users:', error);
    return { success: false, error };
  }
};
