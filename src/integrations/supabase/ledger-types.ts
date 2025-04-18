
import { Database } from './types';

// Extend the Database type to include ledger tables
export interface LedgerDatabase extends Database {
  public: Database['public'] & {
    Tables: Database['public']['Tables'] & {
      journal_entries: {
        Row: {
          id: string;
          date: string;
          description: string;
          entry_number: string;
          is_posted: boolean;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          date: string;
          description: string;
          entry_number: string;
          is_posted?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          date?: string;
          description?: string;
          entry_number?: string;
          is_posted?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      journal_entry_lines: {
        Row: {
          id: string;
          journal_entry_id: string;
          account_id: string;
          description: string | null;
          debit: number;
          credit: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          journal_entry_id: string;
          account_id: string;
          description?: string | null;
          debit: number;
          credit: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          journal_entry_id?: string;
          account_id?: string;
          description?: string | null;
          debit?: number;
          credit?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

// Create a client with extended types
export type SupabaseClientWithLedger = ReturnType<typeof createLedgerClient>;

// Helper function to create a client with the extended types
import { createClient } from '@supabase/supabase-js';
export const createLedgerClient = (
  supabaseUrl: string,
  supabaseKey: string,
  options?: Parameters<typeof createClient>[2]
) => createClient<LedgerDatabase>(supabaseUrl, supabaseKey, options);
