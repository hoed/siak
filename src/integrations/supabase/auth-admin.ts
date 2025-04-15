
import { supabase } from './client';

/**
 * Note: This file contains functions for administrator use only.
 * In a real production environment, these functions should be performed
 * via server-side admin APIs, not exposed in client code.
 */

export const createTestUsers = async () => {
  try {
    // Create admin user
    const { data: adminData, error: adminError } = await supabase.auth.admin.createUser({
      email: 'admin@example.com',
      password: 'admin123',
      user_metadata: { name: 'Admin User' },
      email_confirm: true
    });
    
    if (adminError) throw adminError;
    console.log('Admin user created:', adminData);
    
    // Create manager user
    const { data: managerData, error: managerError } = await supabase.auth.admin.createUser({
      email: 'accountant@example.com',
      password: 'accountant123',
      user_metadata: { name: 'Accountant User' },
      email_confirm: true
    });
    
    if (managerError) throw managerError;
    console.log('Manager user created:', managerData);
    
    return { adminData, managerData };
  } catch (error) {
    console.error('Error creating test users:', error);
    throw error;
  }
};
