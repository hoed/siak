import { supabase } from '@/integrations/supabase/client';
import { ChartOfAccount, ChartOfAccountNode } from '@/types/accounting';
import { toast } from 'sonner';

interface ChartOfAccountDB {
  id: string;
  code: string;
  name: string;
  type: string;
  description?: string;
  parent_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ============= Chart of Accounts API =============
export const getChartOfAccounts = async (): Promise<ChartOfAccount[]> => {
  try {
    const { data, error } = await supabase
      .from('chart_of_accounts')
      .select('*')
      .order('code') as { data: ChartOfAccountDB[], error: any };
      
    if (error) throw error;
    
    return data.map(account => ({
      id: account.id,
      code: account.code,
      name: account.name,
      type: account.type as any,
      description: account.description || undefined,
      parentId: account.parent_id || undefined,
      isActive: account.is_active,
      createdAt: account.created_at,
      updatedAt: account.updated_at
    }));
  } catch (error: any) {
    toast.error(`Error fetching chart of accounts: ${error.message}`);
    return [];
  }
};

export const createChartOfAccount = async (account: Omit<ChartOfAccount, 'id' | 'createdAt' | 'updatedAt'>): Promise<ChartOfAccount | null> => {
  try {
    const { data, error } = await supabase
      .from('chart_of_accounts')
      .insert({
        code: account.code,
        name: account.name,
        type: account.type,
        description: account.description,
        parent_id: account.parentId,
        is_active: account.isActive
      })
      .select()
      .single() as { data: ChartOfAccountDB, error: any };
      
    if (error) throw error;
    
    toast.success('Akun berhasil dibuat');
    
    return {
      id: data.id,
      code: data.code,
      name: data.name,
      type: data.type as any,
      description: data.description || undefined,
      parentId: data.parent_id || undefined,
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (error: any) {
    toast.error(`Error creating account: ${error.message}`);
    return null;
  }
};

export const updateChartOfAccount = async (id: string, account: Partial<Omit<ChartOfAccount, 'id' | 'createdAt' | 'updatedAt'>>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('chart_of_accounts')
      .update({
        code: account.code,
        name: account.name,
        type: account.type,
        description: account.description,
        parent_id: account.parentId,
        is_active: account.isActive !== undefined ? account.isActive : true
      })
      .eq('id', id) as { error: any };
      
    if (error) throw error;
    
    toast.success('Akun berhasil diperbarui');
    return true;
  } catch (error: any) {
    toast.error(`Error updating account: ${error.message}`);
    return false;
  }
};

export const deleteChartOfAccount = async (id: string): Promise<boolean> => {
  try {
    const { data: children, error: childrenError } = await supabase
      .from('chart_of_accounts')
      .select('id')
      .eq('parent_id', id) as { data: any[], error: any };
      
    if (childrenError) throw childrenError;
    
    if (children && children.length > 0) {
      toast.error('Tidak dapat menghapus akun yang memiliki sub-akun');
      return false;
    }
    
    const { error } = await supabase
      .from('chart_of_accounts')
      .delete()
      .eq('id', id) as { error: any };
      
    if (error) throw error;
    
    toast.success('Akun berhasil dihapus');
    return true;
  } catch (error: any) {
    toast.error(`Error deleting account: ${error.message}`);
    return false;
  }
};

export const buildAccountTree = (accounts: ChartOfAccount[]): ChartOfAccountNode[] => {
  const accountMap = new Map<string, ChartOfAccountNode>();
  
  accounts.forEach(account => {
    accountMap.set(account.id, {
      ...account,
      children: [],
      level: 0
    });
  });
  
  const rootNodes: ChartOfAccountNode[] = [];
  
  accounts.forEach(account => {
    const node = accountMap.get(account.id)!;
    
    if (account.parentId && accountMap.has(account.parentId)) {
      const parent = accountMap.get(account.parentId)!;
      node.level = parent.level + 1;
      parent.children?.push(node);
    } else {
      node.level = 0;
      rootNodes.push(node);
    }
  });
  
  return rootNodes;
};
