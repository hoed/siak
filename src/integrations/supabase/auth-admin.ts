
import { supabase } from './client';
import { toast } from 'sonner';

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
      
      // First create auth user directly with Supabase Auth API
      const { data: adminAuthData, error: adminAuthError } = await supabase.auth.admin.createUser({
        email: 'admin@example.com',
        password: 'admin123',
        user_metadata: {
          name: 'Admin User',
          role: 'admin'
        },
        email_confirm: true
      });
      
      if (adminAuthError) {
        console.error('Admin auth creation error:', adminAuthError);
        // Fallback to regular signup if admin API fails
        const { data: fallbackAdminData, error: fallbackError } = await supabase.auth.signUp({
          email: 'admin@example.com',
          password: 'admin123',
          options: {
            data: {
              name: 'Admin User',
              role: 'admin'
            }
          }
        });
        
        if (fallbackError) {
          throw fallbackError;
        }
        
        // If fallback worked, manually update user as confirmed
        if (fallbackAdminData?.user) {
          console.log('Admin created via fallback method:', fallbackAdminData);
          
          // Manually insert admin profile
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: fallbackAdminData.user.id,
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
      } else if (adminAuthData?.user) {
        console.log('Admin auth user created:', adminAuthData);
        
        // Manually insert admin profile
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
      
      // Create manager auth user with admin API first
      const { data: managerAuthData, error: managerAuthError } = await supabase.auth.admin.createUser({
        email: 'accountant@example.com',
        password: 'accountant123',
        user_metadata: {
          name: 'Accountant User',
          role: 'manager'
        },
        email_confirm: true
      });
      
      if (managerAuthError) {
        console.error('Manager auth creation error:', managerAuthError);
        // Fallback to regular signup
        const { data: fallbackManagerData, error: fallbackError } = await supabase.auth.signUp({
          email: 'accountant@example.com',
          password: 'accountant123',
          options: {
            data: {
              name: 'Accountant User',
              role: 'manager'
            }
          }
        });
        
        if (fallbackError) {
          throw fallbackError;
        }
        
        // If fallback worked, use the created user
        if (fallbackManagerData?.user) {
          console.log('Manager created via fallback method:', fallbackManagerData);
          
          // Manually insert manager profile
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: fallbackManagerData.user.id,
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
      } else if (managerAuthData?.user) {
        console.log('Manager auth user created:', managerAuthData);
        
        // Manually insert manager profile
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

    // Alternative: Create users directly with SQL if needed
    try {
      // Create admin user
      await supabase.rpc('create_test_admin_user');
      console.log('Admin user created via RPC');
      
      // Create accountant user
      await supabase.rpc('create_test_accountant_user');
      console.log('Accountant user created via RPC');
    } catch (rpcError) {
      console.log('RPC method not available, skipping', rpcError);
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

// Add a utility to directly sign in as admin (for development only)
export const directSignInAsAdmin = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'admin@example.com',
      password: 'admin123'
    });
    
    if (error) {
      console.error('Direct admin signin error:', error);
      toast.error(`Login gagal: ${error.message}`);
      return { success: false, error };
    }
    
    console.log('Direct admin signin successful:', data);
    toast.success('Login berhasil sebagai admin!');
    return { success: true, data };
  } catch (error) {
    console.error('Exception during direct admin signin:', error);
    return { success: false, error };
  }
};
