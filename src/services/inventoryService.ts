
import { supabase } from '@/integrations/supabase/client';
import { InventoryItem, InventoryTransaction } from '@/types/inventory';
import { toast } from 'sonner';

// ============= Inventory API =============
export const getInventoryItems = async (): Promise<InventoryItem[]> => {
  try {
    const { data, error } = await supabase
      .from('inventory_items')
      .select('*')
      .order('name');
      
    if (error) throw error;
    
    return data.map(item => ({
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
    const { data, error } = await supabase
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
    const { error } = await supabase
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
    const { error } = await supabase
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
    const { data, error } = await supabase
      .from('inventory_transactions')
      .select(`
        *,
        inventory_items:item_id (id, name, sku)
      `)
      .order('date', { ascending: false });
      
    if (error) throw error;
    
    return data.map(transaction => ({
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
    // Start a Supabase transaction
    const { data: transactionData, error: transactionError } = await supabase
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
      
    if (transactionError) throw transactionError;
    
    // Update inventory quantity based on transaction type
    const { data: itemData, error: itemError } = await supabase
      .from('inventory_items')
      .select('quantity')
      .eq('id', transaction.itemId)
      .single();
      
    if (itemError) throw itemError;
    
    let newQuantity = itemData.quantity;
    
    switch (transaction.type) {
      case 'purchase':
      case 'return':
        newQuantity += transaction.quantity;
        break;
      case 'sale':
        newQuantity -= transaction.quantity;
        break;
      case 'adjustment':
        // For adjustment, the quantity could be positive or negative
        newQuantity += transaction.quantity;
        break;
    }
    
    const { error: updateError } = await supabase
      .from('inventory_items')
      .update({ quantity: newQuantity })
      .eq('id', transaction.itemId);
      
    if (updateError) throw updateError;
    
    return {
      id: transactionData.id,
      itemId: transactionData.item_id,
      type: transactionData.type,
      quantity: transactionData.quantity,
      unitPrice: transactionData.unit_price,
      totalPrice: transactionData.total_price,
      reference: transactionData.reference,
      date: transactionData.date,
      customerId: transactionData.customer_id,
      supplierId: transactionData.supplier_id,
      notes: transactionData.notes,
      createdAt: transactionData.created_at,
      updatedAt: transactionData.updated_at
    };
  } catch (error: any) {
    toast.error(`Error creating inventory transaction: ${error.message}`);
    return null;
  }
};

export const getInventorySummary = async () => {
  try {
    // Get total items count
    const { count: totalItems, error: countError } = await supabase
      .from('inventory_items')
      .select('*', { count: 'exact', head: true });
      
    if (countError) throw countError;
    
    // Get total inventory value
    const { data: valueData, error: valueError } = await supabase
      .from('inventory_items')
      .select('quantity, unit_price');
      
    if (valueError) throw valueError;
    
    const totalValue = valueData.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
    
    // Get low stock items
    const { data: lowStockData, error: lowStockError } = await supabase
      .from('inventory_items')
      .select('*')
      .lt('quantity', supabase.raw('minimum_stock'))
      .order('quantity');
      
    if (lowStockError) throw lowStockError;
    
    const lowStockItems = lowStockData.map(item => ({
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
    
    // Get recent transactions
    const { data: recentTransactionsData, error: recentTransactionsError } = await supabase
      .from('inventory_transactions')
      .select(`
        *,
        inventory_items:item_id (id, name, sku)
      `)
      .order('date', { ascending: false })
      .limit(5);
      
    if (recentTransactionsError) throw recentTransactionsError;
    
    const recentTransactions = recentTransactionsData.map(transaction => ({
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
    
    return {
      totalItems: totalItems || 0,
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
