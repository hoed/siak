
import { ledgerClient } from '@/integrations/supabase/ledger-client';
import { JournalEntry, JournalEntryLine, JournalSummary, JournalFilter, JournalViewPeriod } from '@/types/ledger';
import { toast } from 'sonner';
import { format, startOfMonth, endOfMonth, startOfDay, endOfDay } from 'date-fns';

// Get journal entries with filter param
export const getJournalEntries = async (filter?: JournalFilter): Promise<JournalEntry[]> => {
  try {
    let query = ledgerClient
      .from('journal_entries')
      .select(`
        *
      `)
      .order('date', { ascending: false });

    if (filter?.dateRange) {
      query = query.gte('date', filter.dateRange.start).lte('date', filter.dateRange.end);
    }

    if (filter?.searchQuery) {
      query = query.ilike('description', `%${filter.searchQuery}%`);
    }

    const { data, error } = await query;

    if (error) throw error;

    return (data || []).map(entry => {
      return {
        id: entry.id,
        date: entry.date,
        description: entry.description,
        entryNumber: entry.entry_number,
        isPosted: entry.is_posted,
        createdBy: entry.created_by || '',
        createdAt: entry.created_at,
        updatedAt: entry.updated_at
      };
    });
  } catch (error: any) {
    toast.error(`Error fetching journal entries: ${error.message}`);
    return [];
  }
};

// Create a journal entry
export const createJournalEntry = async (
  entry: Omit<JournalEntry, "id" | "createdAt" | "updatedAt" | "createdBy">
): Promise<JournalEntry | null> => {
  try {
    // Start a transaction
    const { data: entryData, error: entryError } = await ledgerClient
      .from('journal_entries')
      .insert({
        date: entry.date,
        description: entry.description,
        entry_number: entry.entryNumber,
        is_posted: entry.isPosted
      })
      .select()
      .single();

    if (entryError) throw entryError;
    if (!entryData) throw new Error("Failed to create journal entry");

    toast.success('Journal entry created successfully');

    return {
      id: entryData.id,
      date: entryData.date,
      description: entryData.description,
      entryNumber: entryData.entry_number,
      isPosted: entryData.is_posted,
      createdBy: entryData.created_by || '',
      createdAt: entryData.created_at,
      updatedAt: entryData.updated_at
    };
  } catch (error: any) {
    toast.error(`Error creating journal entry: ${error.message}`);
    return null;
  }
};

// Delete a journal entry
export const deleteJournalEntry = async (journalEntryId: string): Promise<boolean> => {
  try {
    // First delete the lines
    const { error: linesError } = await ledgerClient
      .from('journal_entry_lines')
      .delete()
      .eq('journal_entry_id', journalEntryId);

    if (linesError) throw linesError;

    // Then delete the entry
    const { error: entryError } = await ledgerClient
      .from('journal_entries')
      .delete()
      .eq('id', journalEntryId);

    if (entryError) throw entryError;

    toast.success('Journal entry deleted successfully');
    return true;
  } catch (error: any) {
    toast.error(`Error deleting journal entry: ${error.message}`);
    return false;
  }
};

// Get journal summary
export const getJournalSummary = async (): Promise<JournalSummary> => {
  try {
    // Get entries count
    const { count: totalEntries, error: entriesError } = await ledgerClient
      .from('journal_entries')
      .select('*', { count: 'exact', head: true });

    if (entriesError) throw entriesError;

    // Get totals
    const { data: totals, error: totalsError } = await ledgerClient
      .from('journal_entry_lines')
      .select(`
        debit,
        credit
      `);

    if (totalsError) throw totalsError;

    // Get recent entries
    const { data: recentEntries, error: recentError } = await ledgerClient
      .from('journal_entries')
      .select('*')
      .order('date', { ascending: false })
      .limit(5);

    if (recentError) throw recentError;

    const totalDebits = totals ? totals.reduce((sum, line) => sum + line.debit, 0) : 0;
    const totalCredits = totals ? totals.reduce((sum, line) => sum + line.credit, 0) : 0;

    return {
      totalEntries: totalEntries || 0,
      totalDebits,
      totalCredits,
      recentEntries: recentEntries ? recentEntries.map(entry => ({
        id: entry.id,
        date: entry.date,
        description: entry.description,
        entryNumber: entry.entry_number,
        isPosted: entry.is_posted,
        createdBy: entry.created_by || '',
        createdAt: entry.created_at,
        updatedAt: entry.updated_at
      })) : []
    };
  } catch (error: any) {
    toast.error(`Error fetching journal summary: ${error.message}`);
    return {
      totalEntries: 0,
      totalDebits: 0,
      totalCredits: 0,
      recentEntries: []
    };
  }
};

// Create journal entry line
export const createJournalEntryLine = async (
  line: Omit<JournalEntryLine, "id" | "createdAt" | "updatedAt">
): Promise<JournalEntryLine | null> => {
  try {
    const { data, error } = await ledgerClient
      .from('journal_entry_lines')
      .insert({
        journal_entry_id: line.journalEntryId,
        account_id: line.accountId,
        description: line.description || null,
        debit: line.debit,
        credit: line.credit
      })
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error("Failed to create journal entry line");

    return {
      id: data.id,
      journalEntryId: data.journal_entry_id,
      accountId: data.account_id,
      accountCode: data.account_code,
      accountName: data.account_name,
      description: data.description,
      debit: data.debit,
      credit: data.credit,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (error: any) {
    toast.error(`Error creating journal entry line: ${error.message}`);
    return null;
  }
};
