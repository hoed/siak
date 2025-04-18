
import { createClient } from '@supabase/supabase-js';

// Use environment variables for connection or fallback to demo values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-supabase-url.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Create a Supabase client specifically for inventory operations
export const inventoryClient = createClient(supabaseUrl, supabaseKey);
