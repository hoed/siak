
export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  description?: string;
  category?: string;
  quantity: number;
  unitPrice: number;
  costPrice: number;
  supplier_id?: string;
  minimumStock?: number;
  location?: string;
  imageUrl?: string;
  barcode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryTransaction {
  id: string;
  itemId: string;
  type: 'purchase' | 'sale' | 'adjustment' | 'return';
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  reference?: string;
  date: string;
  customerId?: string;
  supplierId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InventorySummary {
  totalItems: number;
  totalValue: number;
  lowStockItems: InventoryItem[];
  topSellingItems: {
    item: InventoryItem;
    soldQuantity: number;
  }[];
  recentTransactions: InventoryTransaction[];
}
