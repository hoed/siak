
export interface JournalEntry {
  id: string;
  date: string;
  description: string;
  entryNumber: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  isPosted: boolean;
}

export interface JournalEntryLine {
  id: string;
  journalEntryId: string;
  accountId: string;
  accountCode?: string;
  accountName?: string;
  description?: string;
  debit: number;
  credit: number;
  createdAt: string;
  updatedAt: string;
}

export interface JournalSummary {
  totalEntries: number;
  totalDebits: number;
  totalCredits: number;
  recentEntries: JournalEntry[];
}

export type JournalViewPeriod = 'daily' | 'monthly';

export interface JournalFilter {
  dateRange: {
    start: string;
    end: string;
  };
  accountIds?: string[];
  searchQuery?: string;
}
