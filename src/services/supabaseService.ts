
import { supabase } from '@/integrations/supabase/client';
import { 
  Category, 
  Account, 
  Transaction, 
  Debt, 
  Receivable,
  Income,
  Expense
} from '@/types/finance';
import { toast } from 'sonner';

// ============= Categories API =============
export const getCategories = async (): Promise<Category[]> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
      
    if (error) throw error;
    
    return data.map(category => ({
      id: category.id,
      name: category.name,
      type: category.type,
      icon: category.description?.split('|')[0] || undefined,
      color: category.description?.split('|')[1] || undefined,
      createdAt: category.created_at,
      updatedAt: category.updated_at
    }));
  } catch (error: any) {
    toast.error(`Error fetching categories: ${error.message}`);
    return [];
  }
};

// ============= Accounts API =============
export const getAccounts = async (): Promise<Account[]> => {
  try {
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .order('name');
      
    if (error) throw error;
    
    return data.map(account => ({
      id: account.id,
      name: account.name,
      balance: account.balance,
      accountNumber: account.account_number || undefined,
      bankName: account.description?.split('|')[0] || undefined,
      description: account.description?.split('|')[1] || undefined,
      createdAt: account.created_at,
      updatedAt: account.updated_at
    }));
  } catch (error: any) {
    toast.error(`Error fetching accounts: ${error.message}`);
    return [];
  }
};

// ============= Transactions API =============
export const getTransactions = async (): Promise<(Income | Expense)[]> => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        categories:category_id (id, name, type),
        accounts:account_id (id, name)
      `)
      .order('date', { ascending: false });
      
    if (error) throw error;
    
    return data.map(transaction => {
      const baseTransaction = {
        id: transaction.id,
        amount: transaction.amount,
        description: transaction.description || '',
        date: transaction.date,
        categoryId: transaction.category_id || '',
        accountId: transaction.account_id,
        createdBy: transaction.created_by || '',
        createdAt: transaction.created_at,
        updatedAt: transaction.updated_at
      };
      
      if (transaction.type === 'income') {
        return {
          ...baseTransaction,
          type: 'income' as const
        } as Income;
      } else {
        return {
          ...baseTransaction,
          type: 'expense' as const
        } as Expense;
      }
    });
  } catch (error: any) {
    toast.error(`Error fetching transactions: ${error.message}`);
    return [];
  }
};

// ============= Debts API =============
export const getDebts = async (): Promise<Debt[]> => {
  try {
    const { data, error } = await supabase
      .from('debts')
      .select('*')
      .order('due_date');
      
    if (error) throw error;
    
    return data.map(debt => ({
      id: debt.id,
      amount: debt.amount,
      description: debt.description,
      personName: debt.description.split(':')[0] || '',
      contactInfo: debt.description.split(':')[1] || undefined,
      dueDate: debt.due_date,
      isPaid: debt.is_paid,
      date: debt.due_date,
      accountId: undefined,
      createdAt: debt.created_at,
      updatedAt: debt.updated_at
    }));
  } catch (error: any) {
    toast.error(`Error fetching debts: ${error.message}`);
    return [];
  }
};

// ============= Receivables API =============
export const getReceivables = async (): Promise<Receivable[]> => {
  try {
    const { data, error } = await supabase
      .from('receivables')
      .select('*')
      .order('due_date');
      
    if (error) throw error;
    
    return data.map(receivable => ({
      id: receivable.id,
      amount: receivable.amount,
      description: receivable.description,
      personName: receivable.description.split(':')[0] || '',
      contactInfo: receivable.description.split(':')[1] || undefined,
      dueDate: receivable.due_date,
      isReceived: receivable.is_received,
      date: receivable.due_date,
      accountId: undefined,
      createdAt: receivable.created_at,
      updatedAt: receivable.updated_at
    }));
  } catch (error: any) {
    toast.error(`Error fetching receivables: ${error.message}`);
    return [];
  }
};
