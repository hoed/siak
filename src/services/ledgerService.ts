
import { ledgerClient } from '@/integrations/supabase/ledger-client';
import { extendedSupabase } from '@/integrations/supabase/extended-client';
import { JournalEntry, JournalEntryLine, JournalSummary, JournalFilter, JournalViewPeriod } from '@/types/ledger';
import { toast } from 'sonner';
import { format, startOfMonth, endOfMonth, startOfDay, endOfDay, parseISO } from 'date-fns';

// Get journal entries
export const getJournalEntries = async (
  viewPeriod: JournalViewPeriod = 'daily',
  filter?: JournalFilter
): Promise<JournalEntry[]> => {
  try {
    let query = ledgerClient
      .from('journal_entries')
      .select(`
        *,
        journal_entry_lines(
          *,
          chart_of_accounts:account_id(id, code, name)
        )
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

// Get journal entry details
export const getJournalEntryDetails = async (journalEntryId: string): Promise<{
  entry: JournalEntry | null;
  lines: JournalEntryLine[];
}> => {
  try {
    // Get the entry
    const { data: entryData, error: entryError } = await ledgerClient
      .from('journal_entries')
      .select('*')
      .eq('id', journalEntryId)
      .single();

    if (entryError) throw entryError;

    // Get the lines with account info
    const { data: linesData, error: linesError } = await ledgerClient
      .from('journal_entry_lines')
      .select(`
        *,
        chart_of_accounts:account_id(id, code, name)
      `)
      .eq('journal_entry_id', journalEntryId);

    if (linesError) throw linesError;

    const entry = entryData ? {
      id: entryData.id,
      date: entryData.date,
      description: entryData.description,
      entryNumber: entryData.entry_number,
      isPosted: entryData.is_posted,
      createdBy: entryData.created_by || '',
      createdAt: entryData.created_at,
      updatedAt: entryData.updated_at
    } : null;

    const lines = (linesData || []).map(line => {
      const account = line.chart_of_accounts;
      return {
        id: line.id,
        journalEntryId: line.journal_entry_id,
        accountId: line.account_id,
        accountCode: account?.code,
        accountName: account?.name,
        description: line.description || undefined,
        debit: line.debit,
        credit: line.credit,
        createdAt: line.created_at,
        updatedAt: line.updated_at
      };
    });

    return { entry, lines };
  } catch (error: any) {
    toast.error(`Error fetching journal entry details: ${error.message}`);
    return { entry: null, lines: [] };
  }
};

// Create a journal entry
export const createJournalEntry = async (
  entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>,
  lines: Omit<JournalEntryLine, 'id' | 'journalEntryId' | 'createdAt' | 'updatedAt'>[]
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

    // Insert lines
    if (lines.length > 0) {
      const linesForInsert = lines.map(line => ({
        journal_entry_id: entryData.id,
        account_id: line.accountId,
        description: line.description || null,
        debit: line.debit,
        credit: line.credit
      }));

      const { error: linesError } = await ledgerClient
        .from('journal_entry_lines')
        .insert(linesForInsert);

      if (linesError) throw linesError;
    }

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
export const getJournalSummary = async (
  period: JournalViewPeriod = 'daily',
  date: Date = new Date()
): Promise<JournalSummary> => {
  try {
    let startDate: string;
    let endDate: string;

    if (period === 'daily') {
      startDate = format(startOfDay(date), 'yyyy-MM-dd');
      endDate = format(endOfDay(date), 'yyyy-MM-dd');
    } else {
      startDate = format(startOfMonth(date), 'yyyy-MM-dd');
      endDate = format(endOfMonth(date), 'yyyy-MM-dd');
    }

    // Get entries for the period
    const { data: entries, error: entriesError } = await ledgerClient
      .from('journal_entries')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false });

    if (entriesError) throw entriesError;

    // Get totals for the period
    const { data: totals, error: totalsError } = await ledgerClient
      .from('journal_entry_lines')
      .select(`
        journal_entry_id,
        debit,
        credit
      `)
      .in(
        'journal_entry_id',
        entries ? entries.map(e => e.id) : []
      );

    if (totalsError) throw totalsError;

    const totalDebits = totals ? totals.reduce((sum, line) => sum + line.debit, 0) : 0;
    const totalCredits = totals ? totals.reduce((sum, line) => sum + line.credit, 0) : 0;

    return {
      totalEntries: entries ? entries.length : 0,
      totalDebits,
      totalCredits,
      recentEntries: entries ? entries.slice(0, 5).map(entry => ({
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

// Generate filter dates based on period and selected date
export const generateJournalFilterDates = (
  period: JournalViewPeriod,
  date: Date = new Date()
): { start: string; end: string } => {
  if (period === 'daily') {
    return {
      start: format(startOfDay(date), 'yyyy-MM-dd'),
      end: format(endOfDay(date), 'yyyy-MM-dd')
    };
  } else {
    return {
      start: format(startOfMonth(date), 'yyyy-MM-dd'),
      end: format(endOfMonth(date), 'yyyy-MM-dd')
    };
  }
};
