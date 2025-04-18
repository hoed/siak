
import { supabase } from '@/integrations/supabase/client';
import { InventoryItem, InventoryTransaction } from '@/types/inventory';
import { toast } from 'sonner';

// ============= Inventory API =============
export const getInventoryItems = async (): Promise<InventoryItem[]> => {
  try {
    // Use raw SQL query instead of from() since table might not be defined in types
    const { data, error } = await supabase
      .rpc('get_inventory_items');
      
    if (error) throw error;
    
    if (!data) return [];
    
    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      sku: item.sku,
      description: item.description,
      category: item.category,
      quantity: item.quantity,
      unitPrice: item.unit_price,
      costPrice: item.cost_price,
      supplier_id: item.supplier_id,
      minimumStock: item.minimum_stock,
      location: item.location,
      imageUrl: item.image_url,
      barcode: item.barcode,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }));
  } catch (error: any) {
    toast.error(`Error fetching inventory items: ${error.message}`);
    return [];
  }
};

export const createInventoryItem = async (item: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<InventoryItem | null> => {
  try {
    // Use raw SQL insert instead of from() since table might not be defined in types
    const { data, error } = await supabase
      .rpc('create_inventory_item', {
        p_name: item.name,
        p_sku: item.sku,
        p_description: item.description,
        p_category: item.category,
        p_quantity: item.quantity,
        p_unit_price: item.unitPrice,
        p_cost_price: item.costPrice,
        p_supplier_id: item.supplier_id,
        p_minimum_stock: item.minimumStock,
        p_location: item.location,
        p_image_url: item.imageUrl,
        p_barcode: item.barcode
      });
      
    if (error) throw error;
    
    if (!data) return null;
    
    return {
      id: data.id,
      name: data.name,
      sku: data.sku,
      description: data.description,
      category: data.category,
      quantity: data.quantity,
      unitPrice: data.unit_price,
      costPrice: data.cost_price,
      supplier_id: data.supplier_id,
      minimumStock: data.minimum_stock,
      location: data.location,
      imageUrl: data.image_url,
      barcode: data.barcode,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (error: any) {
    toast.error(`Error creating inventory item: ${error.message}`);
    return null;
  }
};

export const updateInventoryItem = async (item: InventoryItem): Promise<boolean> => {
  try {
    // Use raw SQL update instead of from() since table might not be defined in types
    const { error } = await supabase
      .rpc('update_inventory_item', {
        p_id: item.id,
        p_name: item.name,
        p_sku: item.sku,
        p_description: item.description,
        p_category: item.category,
        p_quantity: item.quantity,
        p_unit_price: item.unitPrice,
        p_cost_price: item.costPrice,
        p_supplier_id: item.supplier_id,
        p_minimum_stock: item.minimumStock,
        p_location: item.location,
        p_image_url: item.imageUrl,
        p_barcode: item.barcode
      });
      
    if (error) throw error;
    
    return true;
  } catch (error: any) {
    toast.error(`Error updating inventory item: ${error.message}`);
    return false;
  }
};

export const deleteInventoryItem = async (id: string): Promise<boolean> => {
  try {
    // Use raw SQL delete instead of from() since table might not be defined in types
    const { error } = await supabase
      .rpc('delete_inventory_item', { p_id: id });
      
    if (error) throw error;
    
    return true;
  } catch (error: any) {
    toast.error(`Error deleting inventory item: ${error.message}`);
    return false;
  }
};

// ============= Inventory Transactions API =============
export const getInventoryTransactions = async (): Promise<InventoryTransaction[]> => {
  try {
    // Use raw SQL query instead of from() since table might not be defined in types
    const { data, error } = await supabase
      .rpc('get_inventory_transactions');
      
    if (error) throw error;
    
    if (!data) return [];
    
    return data.map((transaction: any) => ({
      id: transaction.id,
      itemId: transaction.item_id,
      type: transaction.type,
      quantity: transaction.quantity,
      unitPrice: transaction.unit_price,
      totalPrice: transaction.total_price,
      reference: transaction.reference,
      date: transaction.date,
      customerId: transaction.customer_id,
      supplierId: transaction.supplier_id,
      notes: transaction.notes,
      createdAt: transaction.created_at,
      updatedAt: transaction.updated_at
    }));
  } catch (error: any) {
    toast.error(`Error fetching inventory transactions: ${error.message}`);
    return [];
  }
};

export const createInventoryTransaction = async (transaction: Omit<InventoryTransaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<InventoryTransaction | null> => {
  try {
    // Use raw SQL insert instead of from() since table might not be defined in types
    const { data, error } = await supabase
      .rpc('create_inventory_transaction', {
        p_item_id: transaction.itemId,
        p_type: transaction.type,
        p_quantity: transaction.quantity,
        p_unit_price: transaction.unitPrice,
        p_total_price: transaction.totalPrice,
        p_reference: transaction.reference,
        p_date: transaction.date,
        p_customer_id: transaction.customerId,
        p_supplier_id: transaction.supplierId,
        p_notes: transaction.notes
      });
      
    if (error) throw error;
    
    if (!data) return null;
    
    return {
      id: data.id,
      itemId: data.item_id,
      type: data.type,
      quantity: data.quantity,
      unitPrice: data.unit_price,
      totalPrice: data.total_price,
      reference: data.reference,
      date: data.date,
      customerId: data.customer_id,
      supplierId: data.supplier_id,
      notes: data.notes,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (error: any) {
    toast.error(`Error creating inventory transaction: ${error.message}`);
    return null;
  }
};

export const getInventorySummary = async () => {
  try {
    // Use raw SQL queries instead of from() since tables might not be defined in types
    const { data: summaryData, error: summaryError } = await supabase
      .rpc('get_inventory_summary');
      
    if (summaryError) throw summaryError;
    
    if (!summaryData) {
      return {
        totalItems: 0,
        totalValue: 0,
        lowStockItems: [],
        topSellingItems: [],
        recentTransactions: []
      };
    }
    
    const { 
      total_items: totalItems, 
      total_value: totalValue,
      low_stock_items: lowStockItemsRaw,
      recent_transactions: recentTransactionsRaw
    } = summaryData;
    
    // Transform low stock items
    const lowStockItems = lowStockItemsRaw ? lowStockItemsRaw.map((item: any) => ({
      id: item.id,
      name: item.name,
      sku: item.sku,
      description: item.description,
      category: item.category,
      quantity: item.quantity,
      unitPrice: item.unit_price,
      costPrice: item.cost_price,
      supplier_id: item.supplier_id,
      minimumStock: item.minimum_stock,
      location: item.location,
      imageUrl: item.image_url,
      barcode: item.barcode,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    })) : [];
    
    // Transform recent transactions
    const recentTransactions = recentTransactionsRaw ? recentTransactionsRaw.map((transaction: any) => ({
      id: transaction.id,
      itemId: transaction.item_id,
      type: transaction.type,
      quantity: transaction.quantity,
      unitPrice: transaction.unit_price,
      totalPrice: transaction.total_price,
      reference: transaction.reference,
      date: transaction.date,
      customerId: transaction.customer_id,
      supplierId: transaction.supplier_id,
      notes: transaction.notes,
      createdAt: transaction.created_at,
      updatedAt: transaction.updated_at
    })) : [];
    
    return {
      totalItems,
      totalValue,
      lowStockItems,
      topSellingItems: [], // This would require more complex queries
      recentTransactions
    };
  } catch (error: any) {
    toast.error(`Error fetching inventory summary: ${error.message}`);
    return {
      totalItems: 0,
      totalValue: 0,
      lowStockItems: [],
      topSellingItems: [],
      recentTransactions: []
    };
  }
};
