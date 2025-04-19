
import { supabase } from '@/integrations/supabase/client';
import { 
  JournalEntry, JournalEntryLine, JournalSummary, 
  JournalFilter, JournalViewPeriod 
} from '@/types/ledger';
import { format, subMonths, subWeeks, parseISO } from 'date-fns';
import { ChartOfAccount } from '@/types/accounting';

// Types for Ledger functionality
export interface LedgerAccount {
  id: string;
  code: string;
  name: string;
  type: string;
  balance?: number;
}

export interface LedgerEntry {
  id: string;
  date: string;
  description: string;
  accountId: string;
  debit: number;
  credit: number;
  balance: number;
  reference?: string;
}

export interface LedgerFilter {
  accountId?: string;
  dateRange?: {
    start?: string;
    end?: string;
  };
  searchQuery?: string;
}

// Mock data for development - will be replaced with real API calls
const mockJournalEntries: JournalEntry[] = [
  {
    id: '1',
    date: '2025-04-15',
    entryNumber: 'JE-2025-0001',
    description: 'Initial inventory purchase',
    isPosted: true,
    createdAt: '2025-04-15T10:00:00Z',
    createdBy: 'system',
    updatedAt: '2025-04-15T10:00:00Z'
  },
  {
    id: '2',
    date: '2025-04-16',
    entryNumber: 'JE-2025-0002',
    description: 'Monthly rent payment',
    isPosted: true,
    createdAt: '2025-04-16T11:30:00Z',
    createdBy: 'system',
    updatedAt: '2025-04-16T11:30:00Z'
  },
  {
    id: '3',
    date: '2025-04-17',
    entryNumber: 'JE-2025-0003',
    description: 'Sales revenue recording',
    isPosted: false,
    createdAt: '2025-04-17T14:45:00Z',
    createdBy: 'system',
    updatedAt: '2025-04-17T14:45:00Z'
  }
];

const mockJournalLines: JournalEntryLine[] = [
  {
    id: '1',
    journalEntryId: '1',
    accountId: '101',
    description: 'Cash payment for inventory',
    debit: 0,
    credit: 5000000,
    createdAt: '2025-04-15T10:00:00Z',
    updatedAt: '2025-04-15T10:00:00Z'
  },
  {
    id: '2',
    journalEntryId: '1',
    accountId: '201',
    description: 'Inventory received',
    debit: 5000000,
    credit: 0,
    createdAt: '2025-04-15T10:00:00Z',
    updatedAt: '2025-04-15T10:00:00Z'
  },
  {
    id: '3',
    journalEntryId: '2',
    accountId: '101',
    description: 'Rent payment',
    debit: 0,
    credit: 2500000,
    createdAt: '2025-04-16T11:30:00Z',
    updatedAt: '2025-04-16T11:30:00Z'
  },
  {
    id: '4',
    journalEntryId: '2',
    accountId: '610',
    description: 'Rent expense',
    debit: 2500000,
    credit: 0,
    createdAt: '2025-04-16T11:30:00Z',
    updatedAt: '2025-04-16T11:30:00Z'
  }
];

// Mock ledger accounts data
const mockLedgerAccounts: LedgerAccount[] = [
  { id: '101', code: '1001', name: 'Cash', type: 'asset' },
  { id: '201', code: '2001', name: 'Inventory', type: 'asset' },
  { id: '301', code: '3001', name: 'Accounts Payable', type: 'liability' },
  { id: '401', code: '4001', name: 'Sales Revenue', type: 'revenue' },
  { id: '610', code: '6101', name: 'Rent Expense', type: 'expense' },
];

// Mock ledger entries
const mockLedgerEntries: LedgerEntry[] = [
  {
    id: '1',
    date: '2025-04-15',
    description: 'Initial inventory purchase',
    accountId: '101',
    debit: 0,
    credit: 5000000,
    balance: -5000000
  },
  {
    id: '2',
    date: '2025-04-15',
    description: 'Initial inventory purchase',
    accountId: '201',
    debit: 5000000,
    credit: 0,
    balance: 5000000
  },
  {
    id: '3',
    date: '2025-04-16',
    description: 'Monthly rent payment',
    accountId: '101',
    debit: 0,
    credit: 2500000,
    balance: -7500000
  },
  {
    id: '4',
    date: '2025-04-16',
    description: 'Monthly rent payment',
    accountId: '610',
    debit: 2500000,
    credit: 0,
    balance: 2500000
  }
];

// Function to get journal entries
export const getJournalEntries = async (filter?: JournalFilter): Promise<JournalEntry[]> => {
  try {
    // In a real implementation, we would fetch data from Supabase
    console.log('Fetching journal entries with filter:', filter);
    
    // For now, return mock data with filtering
    let filteredEntries = [...mockJournalEntries];
    
    if (filter?.dateRange) {
      filteredEntries = filteredEntries.filter(entry => {
        const entryDate = entry.date;
        return entryDate >= filter.dateRange.start && entryDate <= filter.dateRange.end;
      });
    }
    
    return filteredEntries;
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    throw error;
  }
};

// Function to get journal entry lines
export const getJournalEntryLines = async (journalEntryId: string): Promise<JournalEntryLine[]> => {
  try {
    // In a real implementation, we would fetch data from Supabase
    console.log('Fetching journal entry lines for entry:', journalEntryId);
    
    // Return mock data
    return mockJournalLines.filter(line => line.journalEntryId === journalEntryId);
  } catch (error) {
    console.error('Error fetching journal entry lines:', error);
    throw error;
  }
};

// Function to get journal summary
export const getJournalSummary = async (): Promise<JournalSummary> => {
  try {
    // Calculate totals from mock data
    const totalEntries = mockJournalEntries.length;
    
    const totalDebits = mockJournalLines.reduce((sum, line) => sum + line.debit, 0);
    const totalCredits = mockJournalLines.reduce((sum, line) => sum + line.credit, 0);
    
    return {
      totalEntries,
      totalDebits,
      totalCredits,
      recentEntries: mockJournalEntries.slice(0, 3)
    };
  } catch (error) {
    console.error('Error fetching journal summary:', error);
    throw error;
  }
};

// Create journal entry function
export const createJournalEntry = async (entry: {
  date: string;
  description: string;
  entryNumber: string;
  isPosted: boolean;
}): Promise<JournalEntry> => {
  try {
    console.log('Creating journal entry:', entry);
    
    // In real implementation, insert into Supabase
    const newEntry: JournalEntry = {
      id: Math.random().toString(36).substring(2, 11),
      ...entry,
      createdAt: new Date().toISOString(),
      createdBy: 'current-user',
      updatedAt: new Date().toISOString()
    };
    
    // Add to mock data (would be database in real implementation)
    mockJournalEntries.push(newEntry);
    
    return newEntry;
  } catch (error) {
    console.error('Error creating journal entry:', error);
    throw error;
  }
};

// Delete journal entry function
export const deleteJournalEntry = async (id: string): Promise<void> => {
  try {
    console.log('Deleting journal entry:', id);
    
    // In real implementation, delete from Supabase
    const entryIndex = mockJournalEntries.findIndex(entry => entry.id === id);
    
    if (entryIndex >= 0) {
      mockJournalEntries.splice(entryIndex, 1);
      
      // Also remove associated lines
      const linesToRemove = mockJournalLines.filter(line => line.journalEntryId === id);
      linesToRemove.forEach(line => {
        const lineIndex = mockJournalLines.findIndex(l => l.id === line.id);
        if (lineIndex >= 0) {
          mockJournalLines.splice(lineIndex, 1);
        }
      });
    }
  } catch (error) {
    console.error('Error deleting journal entry:', error);
    throw error;
  }
};

// Create journal entry line function
export const createJournalEntryLine = async (line: {
  journalEntryId: string;
  accountId: string;
  description: string;
  debit: number;
  credit: number;
}): Promise<JournalEntryLine> => {
  try {
    console.log('Creating journal entry line:', line);
    
    // In real implementation, insert into Supabase
    const newLine: JournalEntryLine = {
      id: Math.random().toString(36).substring(2, 11),
      ...line,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Add to mock data (would be database in real implementation)
    mockJournalLines.push(newLine);
    
    return newLine;
  } catch (error) {
    console.error('Error creating journal entry line:', error);
    throw error;
  }
};

// Function to get ledger accounts
export const getLedgerAccounts = async (): Promise<LedgerAccount[]> => {
  try {
    // In a real implementation, we would fetch data from Supabase
    console.log('Fetching ledger accounts');
    
    // Return mock data
    return mockLedgerAccounts;
  } catch (error) {
    console.error('Error fetching ledger accounts:', error);
    throw error;
  }
};

// Function to get ledger entries
export const getLedgerEntries = async (filter?: LedgerFilter): Promise<LedgerEntry[]> => {
  try {
    // In a real implementation, we would fetch data from Supabase
    console.log('Fetching ledger entries with filter:', filter);
    
    // Filter entries based on the provided filter
    let filteredEntries = [...mockLedgerEntries];
    
    if (filter?.accountId) {
      filteredEntries = filteredEntries.filter(entry => entry.accountId === filter.accountId);
    }
    
    if (filter?.dateRange?.start || filter?.dateRange?.end) {
      filteredEntries = filteredEntries.filter(entry => {
        const entryDate = entry.date;
        
        if (filter.dateRange?.start && filter.dateRange?.end) {
          return entryDate >= filter.dateRange.start && entryDate <= filter.dateRange.end;
        } else if (filter.dateRange?.start) {
          return entryDate >= filter.dateRange.start;
        } else if (filter.dateRange?.end) {
          return entryDate <= filter.dateRange.end;
        }
        
        return true;
      });
    }
    
    if (filter?.searchQuery) {
      const searchLower = filter.searchQuery.toLowerCase();
      filteredEntries = filteredEntries.filter(entry => 
        entry.description.toLowerCase().includes(searchLower) || 
        mockLedgerAccounts.find(acc => acc.id === entry.accountId)?.name.toLowerCase().includes(searchLower) ||
        mockLedgerAccounts.find(acc => acc.id === entry.accountId)?.code.toLowerCase().includes(searchLower)
      );
    }
    
    return filteredEntries;
  } catch (error) {
    console.error('Error fetching ledger entries:', error);
    throw error;
  }
};
