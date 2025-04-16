
// Chart of Accounts types
export type AccountType = 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';

export interface ChartOfAccount {
  id: string;
  code: string;
  name: string;
  type: AccountType;
  description?: string;
  parentId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChartOfAccountNode extends ChartOfAccount {
  children?: ChartOfAccountNode[];
  balance?: number;
  level: number;
}
