
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
  createdAt: string;
  updatedAt: string;
}

// Define an interface that conforms to the expected InventoryItem shape
export interface InventoryItem {
  id: string;
  itemType: string;
  itemId: string;
  name: string;
  sku: string;
  description?: string;
  category?: string;
  quantity: number;
  unitPrice: number;
  costPrice: number;
  minimumStock?: number;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}

// Helper functions to convert between different inventory item types
export const convertToFoodInventoryItem = (item: BaseInventoryItem): InventoryItem => {
  return {
    id: item.id,
    itemType: item.category ? 'product' : 'ingredient',
    itemId: item.id,
    name: item.name,
    sku: item.sku,
    description: item.description || '',
    category: item.category || '',
    quantity: item.quantity,
    minimumStock: item.minimumStock || 0,
    unitPrice: item.unitPrice,
    costPrice: item.costPrice,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    isActive: item.isActive !== undefined ? item.isActive : true
  };
};

export const convertFromFoodInventoryItem = (item: InventoryItem): BaseInventoryItem => {
  return {
    id: item.id,
    name: item.name,
    sku: item.sku,
    description: item.description || '',
    category: item.category || '',
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    costPrice: item.costPrice,
    minimumStock: item.minimumStock || 0,
    isActive: item.isActive !== undefined ? item.isActive : true,
    createdAt: item.createdAt || new Date().toISOString(),
    updatedAt: item.updatedAt || new Date().toISOString()
  };
};
