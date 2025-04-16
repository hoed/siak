const { createClient } = require('@supabase/supabase-js');
const coaData = require('./CoA_CashFlow.json');

const supabaseUrl = 'your-supabase-url';
const supabaseKey = 'your-supabase-anon-key';
const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateCoA() {
  try {
    // Check if table exists and has data
    const { data: existingData, error: checkError } = await supabase
      .from('chart_of_accounts')
      .select('id')
      .limit(1);

    if (checkError) throw checkError;
    if (existingData.length > 0) {
      console.log('Chart of Accounts data already exists, skipping migration.');
      return;
    }

    const { data, error } = await supabase
      .from('chart_of_accounts')
      .insert(
        coaData.map(item => ({
          code: item['Account Code'],
          name: item['Account Name'],
          category: item.Category,
          subcategory: item.Subcategory || null,
          cash_flow_relevance: item['Cash Flow Relevance']
        }))
      );

    if (error) throw error;
    console.log('CoA data migrated successfully:', data);
  } catch (error) {
    console.error('Error migrating CoA data:', error);
  }
}

migrateCoA();