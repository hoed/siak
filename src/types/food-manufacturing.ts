export interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  category: string;
  unitPrice: number;
  costPrice: number;
  quantity: number;
  minimumStock: number;
  image?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Ingredient {
  id: string;
  name: string;
  sku: string;
  description: string;
  unit: string; // e.g., kg, liter, piece
  unitPrice: number;
  quantity: number;
  minimumStock: number;
  supplierId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Recipe {
  id: string;
  productId: string;
  name: string;
  description: string;
  yield: number; // How many units this recipe produces
  yieldUnit: string; // e.g., pieces, kg
  ingredients: RecipeIngredient[];
  instructions: string;
  costPerUnit: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RecipeIngredient {
  ingredientId: string;
  quantity: number;
  unit: string;
}

export interface ProductionBatch {
  id: string;
  recipeId: string;
  batchNumber: string;
  quantity: number;
  startDate: string;
  endDate: string;
  status: 'planned' | 'in-progress' | 'completed' | 'cancelled';
  notes: string;
  costTotal: number;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  taxId?: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  taxId?: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Sale {
  id: string;
  customerId: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  items: SaleItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount: number;
  total: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SaleItem {
  id: string;
  saleId: string;
  productId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  discount: number;
  total: number;
}

export interface Purchase {
  id: string;
  supplierId: string;
  purchaseOrderNumber: string;
  date: string;
  dueDate: string;
  status: 'draft' | 'ordered' | 'received' | 'paid' | 'cancelled';
  items: PurchaseItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount: number;
  total: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseItem {
  id: string;
  purchaseId: string;
  ingredientId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  discount: number;
  total: number;
}

export interface Asset {
  id: string;
  name: string;
  category: 'fixed' | 'non-fixed';
  purchaseDate: string;
  purchasePrice: number;
  currentValue: number;
  depreciationRate?: number;
  serialNumber?: string;
  location?: string;
  notes?: string;
  status: 'active' | 'maintenance' | 'retired';
  createdAt: string;
  updatedAt: string;
}

export type TaxReportType = 'vat' | 'income' | 'withholding' | 'annual-return' | 'monthly-return' | 'other';
export type TaxReportStatus = 'draft' | 'submitted' | 'verified' | 'paid' | 'rejected';

export interface TaxReport {
  id: string;
  reportType: TaxReportType;
  periodStart: string;
  periodEnd: string;
  dueDate: string;
  status: TaxReportStatus;
  totalTaxAmount: number;
  referenceNumber?: string;
  taxOffice?: string;
  taxFormNumber?: string;  // For specific Indonesian tax form numbers
  taxpayerIdNumber?: string; // NPWP in Indonesia
  notes?: string;
  attachments?: string[]; // URLs to attachment files
  createdAt: string;
  updatedAt: string;
}

export type InventoryItemType = 'product' | 'ingredient' | 'asset';

export interface InventoryItem {
  id: string;
  itemType: InventoryItemType;
  itemId: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  minimumStock: number;
  unitPrice: number;
  isActive: boolean;
}

export interface LedgerAccount {
  id: string;
  code: string;
  name: string;
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  subtype?: string;
  description?: string;
  isActive: boolean;
  balance: number;
  createdAt: string;
  updatedAt: string;
}

export interface LedgerEntry {
  id: string;
  date: string;
  journalEntryId: string;
  accountId: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
  createdAt: string;
  updatedAt: string;
}
