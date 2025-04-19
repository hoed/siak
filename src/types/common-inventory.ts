
import { InventoryItemType } from './food-manufacturing';

// Common interface to resolve conflicts between different inventory item types
export interface BaseInventoryItem {
  id: string;
  name: string;
  sku: string;
  description?: string;
  category: string; // Changed from optional to required to match food-manufacturing.ts
  quantity: number;
  unitPrice: number;
  costPrice: number;
  minimumStock: number; // Changed from optional to required to match food-manufacturing.ts
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}

// Define an interface that conforms to the expected InventoryItem shape
export interface InventoryItem {
  id: string;
  itemType: InventoryItemType;
  itemId: string;
  name: string;
  sku: string;
  description?: string;
  category: string; // Changed from optional to required to match food-manufacturing.ts
  quantity: number;
  unitPrice: number;
  costPrice: number;
  minimumStock: number; // Changed from optional to required to match food-manufacturing.ts
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}

// Helper functions to convert between different inventory item types
export const convertToFoodInventoryItem = (item: BaseInventoryItem): InventoryItem => {
  return {
    id: item.id,
    itemType: determineItemType(item),
    itemId: item.id,
    name: item.name,
    sku: item.sku,
    description: item.description || '',
    category: item.category, // Category is now required
    quantity: item.quantity,
    minimumStock: item.minimumStock,
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
    category: item.category, // Category is now required
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    costPrice: item.costPrice,
    minimumStock: item.minimumStock,
    isActive: item.isActive !== undefined ? item.isActive : true,
    createdAt: item.createdAt || new Date().toISOString(),
    updatedAt: item.updatedAt || new Date().toISOString()
  };
};

// Helper function to determine the item type based on category
const determineItemType = (item: BaseInventoryItem): InventoryItemType => {
  if (item.category === 'Produk') {
    return 'product';
  } else if (item.category === 'Bahan Baku') {
    return 'ingredient';
  } else if (item.category === 'Aset' || item.category === 'Aset Tetap' || item.category === 'Aset Tidak Tetap') {
    return 'asset';
  }
  // Default to product if no category matches
  return 'product';
};
