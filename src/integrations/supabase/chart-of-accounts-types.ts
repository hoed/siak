
import { Database } from './types';

// Extend the Database type to include chart_of_accounts
export interface ExtendedDatabase extends Database {
  public: Database['public'] & {
    Tables: Database['public']['Tables'] & {
      chart_of_accounts: {
        Row: {
          id: string;
          code: string;
          name: string;
          type: string;
          description: string | null;
          parent_id: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          code: string;
          name: string;
          type: string;
          description?: string | null;
          parent_id?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
        };
        Update: {
          id?: string;
          code?: string;
          name?: string;
          type?: string;
          description?: string | null;
          parent_id?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "chart_of_accounts_parent_id_fkey";
            columns: ["parent_id"];
            isOneToOne: false;
            referencedRelation: "chart_of_accounts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "chart_of_accounts_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
    };
  };
}

// Create a client with extended types
export type SupabaseClientWithChartOfAccounts = ReturnType<typeof createExtendedClient>;

// Helper function to create a client with the extended types
import { createClient } from '@supabase/supabase-js';
export const createExtendedClient = (
  supabaseUrl: string,
  supabaseKey: string,
  options?: Parameters<typeof createClient>[2]
) => createClient<ExtendedDatabase>(supabaseUrl, supabaseKey, options);
