
import { toast } from 'sonner';
import { extendedSupabase } from '@/integrations/supabase/extended-client';
import { AccountType } from '@/types/accounting';

interface CoaImportItem {
  "Account Code": string;
  "Account Name": string;
  "Category": string;
  "Subcategory": string;
  "Cash Flow Relevance": string;
}

const mapCategoryToType = (category: string): AccountType => {
  switch (category.toLowerCase()) {
    case 'asset':
      return 'asset';
    case 'liabilities':
      return 'liability';
    case 'equity':
      return 'equity';
    case 'revenue':
      return 'revenue';
    case 'expense':
      return 'expense';
    default:
      return 'asset';
  }
};

export const importChartOfAccounts = async (coaData: CoaImportItem[]): Promise<boolean> => {
  try {
    // First, get all existing accounts to check for parent relationships
    const { data: existingAccounts, error: fetchError } = await extendedSupabase
      .from('chart_of_accounts')
      .select('id, code, name')
      .order('code');
      
    if (fetchError) {
      console.error('Error fetching existing accounts:', fetchError);
      throw fetchError;
    }
    
    // Create a map of account codes to their IDs
    const accountCodeMap = new Map<string, string>();
    existingAccounts?.forEach(account => {
      accountCodeMap.set(account.code, account.id);
    });
    
    // First pass: Create all accounts
    for (const item of coaData) {
      const accountType = mapCategoryToType(item.Category);
      
      // Skip if account already exists
      if (accountCodeMap.has(item["Account Code"])) {
        console.log(`Account ${item["Account Code"]} already exists, skipping...`);
        continue;
      }
      
      // Create the account
      const { data, error } = await extendedSupabase
        .from('chart_of_accounts')
        .insert({
          code: item["Account Code"],
          name: item["Account Name"],
          type: accountType,
          description: `Cash Flow: ${item["Cash Flow Relevance"]}`,
          is_active: true
        })
        .select()
        .single();
        
      if (error) {
        console.error(`Error creating account ${item["Account Code"]}:`, error);
        continue;
      }
      
      // Add to the map
      if (data) {
        accountCodeMap.set(item["Account Code"], data.id);
      }
    }
    
    // Second pass: Update parent relationships
    for (const item of coaData) {
      if (item.Subcategory && item.Subcategory !== '') {
        // Find the parent account ID by name
        const parentAccount = existingAccounts?.find(acc => acc.name === item.Subcategory) || 
          Array.from(accountCodeMap.entries()).find(([_, id]) => {
            const foundAccount = coaData.find(coa => coa["Account Name"] === item.Subcategory);
            return foundAccount && foundAccount["Account Code"];
          });
          
        if (parentAccount) {
          const parentId = typeof parentAccount === 'object' ? parentAccount.id : accountCodeMap.get(parentAccount[0]);
          const currentAccountId = accountCodeMap.get(item["Account Code"]);
          
          if (parentId && currentAccountId) {
            const { error } = await extendedSupabase
              .from('chart_of_accounts')
              .update({ parent_id: parentId })
              .eq('id', currentAccountId);
              
            if (error) {
              console.error(`Error updating parent for ${item["Account Code"]}:`, error);
            }
          }
        }
      }
    }
    
    toast.success('Chart of Accounts successfully imported');
    return true;
  } catch (error: any) {
    console.error('Error importing Chart of Accounts:', error);
    toast.error(`Error importing Chart of Accounts: ${error.message}`);
    return false;
  }
};
