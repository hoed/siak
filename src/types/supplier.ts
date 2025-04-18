
export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface SupplierPayment {
  id: string;
  supplier_id: string;
  amount: number;
  payment_date: string;
  payment_method: string;
  reference: string;
  notes?: string;
  is_recorded_as_expense: boolean;
  transaction_id?: string;
  created_at: string;
  updated_at: string;
}

export interface SupplierInvoice {
  id: string;
  supplier_id: string;
  invoice_number: string;
  issue_date: string;
  due_date: string;
  total_amount: number;
  paid_amount: number;
  status: 'pending' | 'partial' | 'paid' | 'overdue' | 'cancelled';
  notes?: string;
  items: PurchaseItem[];
  payment_id?: string;
  created_at: string;
  updated_at: string;
}

export interface PurchaseItem {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
  inventory_item_id?: string;
  created_at: string;
  updated_at: string;
}
