
import { createExtendedClient } from './chart-of-accounts-types';

const SUPABASE_URL = "https://dfdmtpbvinkbizxwwzvb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmZG10cGJ2aW5rYml6eHd3enZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3MjAxMDEsImV4cCI6MjA2MDI5NjEwMX0.umm4eJ5EVm2Of1Yg7bGeTaUrCh22dNYI5GeMkEoCROU";

// Export the extended client
export const extendedSupabase = createExtendedClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: localStorage
  }
});
