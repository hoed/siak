
// Common interface to resolve conflicts between different inventory item types
export interface BaseInventoryItem {
  id: string;
  name: string;
  sku: string;
  description?: string;
  category?: string;
  quantity: number;
  unitPrice: number;
  costPrice: number;
  minimumStock?: number;
  isActive?: boolean;
}

// Helper functions to convert between different inventory item types
export const convertToFoodInventoryItem = (item: any): any => {
  return {
    id: item.id,
    itemType: item.category ? 'product' : 'ingredient',
    itemId: item.id,
    name: item.name,
    sku: item.sku,
    category: item.category || '',
    quantity: item.quantity,
    minimumStock: item.minimumStock || 0,
    unitPrice: item.unitPrice,
    isActive: item.isActive !== undefined ? item.isActive : true
  };
};

export const convertFromFoodInventoryItem = (item: any): any => {
  return {
    id: item.id,
    name: item.name,
    sku: item.sku,
    description: item.description || '',
    category: item.category || '',
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    costPrice: item.costPrice || item.unitPrice,
    minimumStock: item.minimumStock || 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};
