
import { toast } from 'sonner';
import { inventoryClient } from '@/integrations/supabase/inventory-client';
import { InventoryItem, InventoryTransaction } from '@/types/inventory';

// Update the updateInventoryItem function to accept a single parameter:
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

// Get all inventory items
export const getInventoryItems = async (): Promise<InventoryItem[]> => {
  try {
    const { data, error } = await inventoryClient
      .from('inventory_items')
      .select('*')
      .order('name');
      
    if (error) throw error;
    
    return (data || []).map(item => ({
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

// Create a new inventory item
export const createInventoryItem = async (
  item: Omit<InventoryItem, "id" | "createdAt" | "updatedAt">
): Promise<InventoryItem | null> => {
  try {
    const { data, error } = await inventoryClient
      .from('inventory_items')
      .insert({
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

// Delete an inventory item
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

// Get inventory summary
export const getInventorySummary = async (): Promise<{
  totalItems: number;
  totalValue: number;
  lowStockItems: InventoryItem[];
  recentTransactions: {
    id: string;
    itemId: string;
    itemName?: string;
    itemSku?: string;
    type: 'purchase' | 'sale' | 'adjustment' | 'return';
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    date: string;
    reference?: string;
  }[];
}> => {
  try {
    // Get inventory items
    const { data: inventoryItems, error: itemsError } = await inventoryClient
      .from('inventory_items')
      .select('*');
      
    if (itemsError) throw itemsError;
    
    // Get recent transactions
    const { data: transactions, error: transactionsError } = await inventoryClient
      .from('inventory_transactions')
      .select(`
        *,
        inventory_items!inner(id, name, sku)
      `)
      .order('created_at', { ascending: false })
      .limit(5);
      
    if (transactionsError) throw transactionsError;
    
    // Calculate totals and find low stock items
    const items = (inventoryItems || []).map(item => ({
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
    
    const totalItems = items.length;
    const totalValue = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const lowStockItems = items.filter(item => item.minimumStock && item.quantity <= item.minimumStock);
    
    // Format transactions
    const recentTransactions = (transactions || []).map(tx => {
      const item = tx.inventory_items;
      return {
        id: tx.id,
        itemId: tx.item_id,
        itemName: item ? item.name : undefined,
        itemSku: item ? item.sku : undefined,
        type: tx.type,
        quantity: tx.quantity,
        unitPrice: tx.unit_price,
        totalPrice: tx.total_price,
        date: tx.date,
        reference: tx.reference
      };
    });
    
    return {
      totalItems,
      totalValue,
      lowStockItems,
      recentTransactions
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

// Create an inventory transaction
export const createInventoryTransaction = async (
  transaction: {
    itemId: string;
    type: 'purchase' | 'sale' | 'adjustment' | 'return';
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    reference?: string;
    date: string;
    notes?: string;
  }
): Promise<InventoryTransaction | null> => {
  try {
    // Start a transaction
    // First insert the transaction record
    const { data: txData, error: txError } = await inventoryClient
      .from('inventory_transactions')
      .insert({
        item_id: transaction.itemId,
        type: transaction.type,
        quantity: transaction.quantity,
        unit_price: transaction.unitPrice,
        total_price: transaction.totalPrice,
        reference: transaction.reference,
        date: transaction.date,
        notes: transaction.notes
      })
      .select()
      .single();
      
    if (txError) throw txError;
    
    if (!txData) {
      throw new Error('Failed to create transaction');
    }
    
    // Then update the inventory quantity based on transaction type
    const { data: itemData, error: itemError } = await inventoryClient
      .from('inventory_items')
      .select('quantity')
      .eq('id', transaction.itemId)
      .single();
      
    if (itemError) throw itemError;
    
    if (!itemData) {
      throw new Error('Item not found');
    }
    
    let newQuantity = itemData.quantity;
    
    switch (transaction.type) {
      case 'purchase':
      case 'return':
        newQuantity += transaction.quantity;
        break;
      case 'sale':
        newQuantity -= transaction.quantity;
        break;
      // For adjustments, the quantity is set directly
      case 'adjustment':
        newQuantity = transaction.quantity;
        break;
    }
    
    // Update the inventory item quantity
    const { error: updateError } = await inventoryClient
      .from('inventory_items')
      .update({ quantity: newQuantity })
      .eq('id', transaction.itemId);
      
    if (updateError) throw updateError;
    
    return {
      id: txData.id,
      itemId: txData.item_id,
      type: txData.type,
      quantity: txData.quantity,
      unitPrice: txData.unit_price,
      totalPrice: txData.total_price,
      reference: txData.reference,
      date: txData.date,
      customerId: txData.customer_id,
      supplierId: txData.supplier_id,
      notes: txData.notes,
      createdAt: txData.created_at,
      updatedAt: txData.updated_at
    };
  } catch (error: any) {
    toast.error(`Error creating inventory transaction: ${error.message}`);
    return null;
  }
};
