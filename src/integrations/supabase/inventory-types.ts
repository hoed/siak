
import { Database } from './types';

// Extend the Database type to include inventory tables
export interface InventoryDatabase extends Database {
  public: Database['public'] & {
    Tables: Database['public']['Tables'] & {
      inventory_items: {
        Row: {
          id: string;
          name: string;
          sku: string;
          description: string | null;
          category: string | null;
          quantity: number;
          unit_price: number;
          cost_price: number;
          supplier_id: string | null;
          minimum_stock: number | null;
          location: string | null;
          image_url: string | null;
          barcode: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          sku: string;
          description?: string | null;
          category?: string | null;
          quantity?: number;
          unit_price?: number;
          cost_price?: number;
          supplier_id?: string | null;
          minimum_stock?: number | null;
          location?: string | null;
          image_url?: string | null;
          barcode?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          sku?: string;
          description?: string | null;
          category?: string | null;
          quantity?: number;
          unit_price?: number;
          cost_price?: number;
          supplier_id?: string | null;
          minimum_stock?: number | null;
          location?: string | null;
          image_url?: string | null;
          barcode?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      inventory_transactions: {
        Row: {
          id: string;
          item_id: string;
          type: string;
          quantity: number;
          unit_price: number;
          total_price: number;
          reference: string | null;
          date: string;
          customer_id: string | null;
          supplier_id: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          item_id: string;
          type: string;
          quantity: number;
          unit_price: number;
          total_price: number;
          reference?: string | null;
          date: string;
          customer_id?: string | null;
          supplier_id?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          item_id?: string;
          type?: string;
          quantity?: number;
          unit_price?: number;
          total_price?: number;
          reference?: string | null;
          date?: string;
          customer_id?: string | null;
          supplier_id?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

// Create a client with extended types
export type SupabaseClientWithInventory = ReturnType<typeof createInventoryClient>;

// Helper function to create a client with the extended types
import { createClient } from '@supabase/supabase-js';
export const createInventoryClient = (
  supabaseUrl: string,
  supabaseKey: string,
  options?: Parameters<typeof createClient>[2]
) => createClient<InventoryDatabase>(supabaseUrl, supabaseKey, options);
