
import { inventoryClient } from '@/integrations/supabase/inventory-client';
import { InventoryItem, InventoryTransaction } from '@/types/inventory';
import { toast } from 'sonner';

// ============= Inventory API =============
export const getInventoryItems = async (): Promise<InventoryItem[]> => {
  try {
    // Using the custom client with proper types
    const { data, error } = await inventoryClient
      .from('inventory_items')
      .select('*');
      
    if (error) throw error;
    
    if (!data) return [];
    
    return data.map((item) => ({
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
    const { data, error } = await inventoryClient
      .from('inventory_items')
      .insert([{
        name: item.name,
        sku: item.sku,
        description: item.description,
        category: item.category,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        cost_price: item.costPrice,
        supplier_id: item.supplier_id,
        minimum_stock: item.minimumStock,
        location: item.location,
        image_url: item.imageUrl,
        barcode: item.barcode
      }])
      .select()
      .single();
      
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
    const { error } = await inventoryClient
      .from('inventory_items')
      .update({
        name: item.name,
        sku: item.sku,
        description: item.description,
        category: item.category,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        cost_price: item.costPrice,
        supplier_id: item.supplier_id,
        minimum_stock: item.minimumStock,
        location: item.location,
        image_url: item.imageUrl,
        barcode: item.barcode
      })
      .eq('id', item.id);
      
    if (error) throw error;
    
    return true;
  } catch (error: any) {
    toast.error(`Error updating inventory item: ${error.message}`);
    return false;
  }
};

export const deleteInventoryItem = async (id: string): Promise<boolean> => {
  try {
    const { error } = await inventoryClient
      .from('inventory_items')
      .delete()
      .eq('id', id);
      
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
    const { data, error } = await inventoryClient
      .from('inventory_transactions')
      .select('*');
      
    if (error) throw error;
    
    if (!data) return [];
    
    return data.map((transaction) => ({
      id: transaction.id,
      itemId: transaction.item_id,
      type: transaction.type as 'purchase' | 'sale' | 'adjustment' | 'return',
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
    const { data, error } = await inventoryClient
      .from('inventory_transactions')
      .insert([{
        item_id: transaction.itemId,
        type: transaction.type,
        quantity: transaction.quantity,
        unit_price: transaction.unitPrice,
        total_price: transaction.totalPrice,
        reference: transaction.reference,
        date: transaction.date,
        customer_id: transaction.customerId,
        supplier_id: transaction.supplierId,
        notes: transaction.notes
      }])
      .select()
      .single();
      
    if (error) throw error;
    
    if (!data) return null;
    
    return {
      id: data.id,
      itemId: data.item_id,
      type: data.type as 'purchase' | 'sale' | 'adjustment' | 'return',
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
    // Get total items count
    const { count: totalItems, error: countError } = await inventoryClient
      .from('inventory_items')
      .select('*', { count: 'exact', head: true });
      
    if (countError) throw countError;
    
    // Get total inventory value
    const { data: itemsData, error: itemsError } = await inventoryClient
      .from('inventory_items')
      .select('quantity, unit_price');
      
    if (itemsError) throw itemsError;
    
    const totalValue = itemsData ? itemsData.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0) : 0;
    
    // Get low stock items
    const { data: lowStockItems, error: lowStockError } = await inventoryClient
      .from('inventory_items')
      .select('*')
      .lt('quantity', 'minimum_stock');
      
    if (lowStockError) throw lowStockError;
    
    // Get recent transactions
    const { data: recentTransactions, error: transactionsError } = await inventoryClient
      .from('inventory_transactions')
      .select(`
        *,
        inventory_items(id, name, sku)
      `)
      .order('date', { ascending: false })
      .limit(5);
      
    if (transactionsError) throw transactionsError;
    
    return {
      totalItems: totalItems || 0,
      totalValue: totalValue,
      lowStockItems: lowStockItems ? lowStockItems.map(item => ({
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
      })) : [],
      recentTransactions: recentTransactions ? recentTransactions.map(transaction => ({
        id: transaction.id,
        itemId: transaction.item_id,
        itemName: transaction.inventory_items?.name || '',
        itemSku: transaction.inventory_items?.sku || '',
        type: transaction.type as 'purchase' | 'sale' | 'adjustment' | 'return',
        quantity: transaction.quantity,
        unitPrice: transaction.unit_price,
        totalPrice: transaction.total_price,
        date: transaction.date,
        reference: transaction.reference
      })) : []
    };
  } catch (error: any) {
    toast.error(`Error fetching inventory summary: ${error.message}`);
    return {
      totalItems: 0,
      totalValue: 0,
      lowStockItems: [],
      recentTransactions: []
    };
  }
};
