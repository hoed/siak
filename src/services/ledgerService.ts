
import { supabase } from '@/integrations/supabase/client';
import { LedgerAccount, LedgerEntry } from '@/types/food-manufacturing';
import { toast } from 'sonner';

export interface LedgerFilter {
  accountId?: string;
  dateRange?: {
    start?: string;
    end?: string;
  };
  searchQuery?: string;
}

// Get ledger accounts
export const getLedgerAccounts = async (): Promise<LedgerAccount[]> => {
  try {
    // Mock ledger accounts (temporary until database tables are set up)
    const mockLedgerAccounts: LedgerAccount[] = [
      {
        id: '1',
        code: '1101',
        name: 'Kas',
        type: 'asset',
        subtype: 'Current Asset',
        description: 'Kas fisik perusahaan',
        isActive: true,
        balance: 15000000,
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-04-18T12:30:00Z'
      },
      {
        id: '2',
        code: '1102',
        name: 'Bank',
        type: 'asset',
        subtype: 'Current Asset',
        description: 'Rekening bank perusahaan',
        isActive: true,
        balance: 85000000,
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-04-18T12:30:00Z'
      },
      {
        id: '3',
        code: '1201',
        name: 'Piutang Dagang',
        type: 'asset',
        subtype: 'Current Asset',
        description: 'Piutang dari pelanggan',
        isActive: true,
        balance: 25000000,
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-04-18T12:30:00Z'
      },
      {
        id: '4',
        code: '1301',
        name: 'Persediaan Bahan Baku',
        type: 'asset',
        subtype: 'Current Asset',
        description: 'Persediaan bahan baku produksi',
        isActive: true,
        balance: 35000000,
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-04-18T12:30:00Z'
      },
      {
        id: '5',
        code: '1302',
        name: 'Persediaan Barang Jadi',
        type: 'asset',
        subtype: 'Current Asset',
        description: 'Persediaan produk jadi siap jual',
        isActive: true,
        balance: 40000000,
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-04-18T12:30:00Z'
      },
      {
        id: '6',
        code: '1401',
        name: 'Peralatan',
        type: 'asset',
        subtype: 'Fixed Asset',
        description: 'Mesin dan peralatan produksi',
        isActive: true,
        balance: 150000000,
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-04-18T12:30:00Z'
      },
      {
        id: '7',
        code: '2101',
        name: 'Hutang Dagang',
        type: 'liability',
        subtype: 'Current Liability',
        description: 'Hutang kepada supplier',
        isActive: true,
        balance: 45000000,
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-04-18T12:30:00Z'
      },
      {
        id: '8',
        code: '3101',
        name: 'Modal',
        type: 'equity',
        description: 'Modal pemilik',
        isActive: true,
        balance: 250000000,
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-04-18T12:30:00Z'
      },
      {
        id: '9',
        code: '4101',
        name: 'Pendapatan Penjualan',
        type: 'revenue',
        description: 'Pendapatan dari penjualan produk',
        isActive: true,
        balance: 180000000,
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-04-18T12:30:00Z'
      },
      {
        id: '10',
        code: '5101',
        name: 'Biaya Bahan Baku',
        type: 'expense',
        description: 'Biaya pembelian bahan baku',
        isActive: true,
        balance: 85000000,
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-04-18T12:30:00Z'
      },
      {
        id: '11',
        code: '5102',
        name: 'Biaya Tenaga Kerja',
        type: 'expense',
        description: 'Biaya gaji dan upah',
        isActive: true,
        balance: 45000000,
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-04-18T12:30:00Z'
      },
      {
        id: '12',
        code: '5103',
        name: 'Biaya Overhead Pabrik',
        type: 'expense',
        description: 'Biaya operasional pabrik',
        isActive: true,
        balance: 25000000,
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-04-18T12:30:00Z'
      }
    ];

    return mockLedgerAccounts;

    // When database is ready, uncomment and use this code instead
    /*
    const { data, error } = await supabase
      .from('ledger_accounts')
      .select('*')
      .order('code');

    if (error) throw error;

    return (data || []).map(item => ({
      id: item.id,
      code: item.code,
      name: item.name,
      type: item.type,
      subtype: item.subtype,
      description: item.description,
      isActive: item.is_active,
      balance: item.balance,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }));
    */
  } catch (error: any) {
    toast.error(`Error fetching ledger accounts: ${error.message}`);
    console.error('Error fetching ledger accounts:', error);
    return [];
  }
};

// Get ledger entries
export const getLedgerEntries = async (filter?: LedgerFilter): Promise<LedgerEntry[]> => {
  try {
    // Mock ledger entries (temporary until database tables are set up)
    const mockLedgerEntries: LedgerEntry[] = [
      {
        id: '1',
        date: '2025-04-15',
        journalEntryId: 'J-2025-04-001',
        accountId: '1101',
        description: 'Pembayaran tunai dari pelanggan',
        debit: 5000000,
        credit: 0,
        balance: 15000000,
        createdAt: '2025-04-15T10:30:00Z',
        updatedAt: '2025-04-15T10:30:00Z'
      },
      {
        id: '2',
        date: '2025-04-15',
        journalEntryId: 'J-2025-04-001',
        accountId: '4101',
        description: 'Penjualan produk',
        debit: 0,
        credit: 5000000,
        balance: 180000000,
        createdAt: '2025-04-15T10:30:00Z',
        updatedAt: '2025-04-15T10:30:00Z'
      },
      {
        id: '3',
        date: '2025-04-14',
        journalEntryId: 'J-2025-04-002',
        accountId: '5101',
        description: 'Pembelian bahan baku',
        debit: 3500000,
        credit: 0,
        balance: 85000000,
        createdAt: '2025-04-14T14:20:00Z',
        updatedAt: '2025-04-14T14:20:00Z'
      },
      {
        id: '4',
        date: '2025-04-14',
        journalEntryId: 'J-2025-04-002',
        accountId: '1102',
        description: 'Pembayaran bahan baku',
        debit: 0,
        credit: 3500000,
        balance: 85000000,
        createdAt: '2025-04-14T14:20:00Z',
        updatedAt: '2025-04-14T14:20:00Z'
      },
      {
        id: '5',
        date: '2025-04-12',
        journalEntryId: 'J-2025-04-003',
        accountId: '1102',
        description: 'Penerimaan pembayaran piutang',
        debit: 7500000,
        credit: 0,
        balance: 88500000,
        createdAt: '2025-04-12T09:45:00Z',
        updatedAt: '2025-04-12T09:45:00Z'
      },
      {
        id: '6',
        date: '2025-04-12',
        journalEntryId: 'J-2025-04-003',
        accountId: '1201',
        description: 'Penerimaan pembayaran piutang',
        debit: 0,
        credit: 7500000,
        balance: 25000000,
        createdAt: '2025-04-12T09:45:00Z',
        updatedAt: '2025-04-12T09:45:00Z'
      },
      {
        id: '7',
        date: '2025-04-10',
        journalEntryId: 'J-2025-04-004',
        accountId: '2101',
        description: 'Pembayaran hutang kepada supplier',
        debit: 4500000,
        credit: 0,
        balance: 45000000,
        createdAt: '2025-04-10T15:30:00Z',
        updatedAt: '2025-04-10T15:30:00Z'
      },
      {
        id: '8',
        date: '2025-04-10',
        journalEntryId: 'J-2025-04-004',
        accountId: '1102',
        description: 'Pembayaran hutang kepada supplier',
        debit: 0,
        credit: 4500000,
        balance: 84000000,
        createdAt: '2025-04-10T15:30:00Z',
        updatedAt: '2025-04-10T15:30:00Z'
      },
      {
        id: '9',
        date: '2025-04-05',
        journalEntryId: 'J-2025-04-005',
        accountId: '5102',
        description: 'Pembayaran gaji karyawan',
        debit: 12000000,
        credit: 0,
        balance: 45000000,
        createdAt: '2025-04-05T16:15:00Z',
        updatedAt: '2025-04-05T16:15:00Z'
      },
      {
        id: '10',
        date: '2025-04-05',
        journalEntryId: 'J-2025-04-005',
        accountId: '1102',
        description: 'Pembayaran gaji karyawan',
        debit: 0,
        credit: 12000000,
        balance: 80000000,
        createdAt: '2025-04-05T16:15:00Z',
        updatedAt: '2025-04-05T16:15:00Z'
      }
    ];

    // Apply filters
    let filteredEntries = [...mockLedgerEntries];

    if (filter) {
      if (filter.accountId) {
        filteredEntries = filteredEntries.filter(entry => entry.accountId === filter.accountId);
      }

      if (filter.dateRange) {
        if (filter.dateRange.start) {
          filteredEntries = filteredEntries.filter(
            entry => new Date(entry.date) >= new Date(filter.dateRange!.start!)
          );
        }
        if (filter.dateRange.end) {
          filteredEntries = filteredEntries.filter(
            entry => new Date(entry.date) <= new Date(filter.dateRange!.end!)
          );
        }
      }

      if (filter.searchQuery) {
        const searchLower = filter.searchQuery.toLowerCase();
        filteredEntries = filteredEntries.filter(
          entry => entry.description.toLowerCase().includes(searchLower)
        );
      }
    }

    // Sort by date (most recent first)
    filteredEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return filteredEntries;

    // When database is ready, uncomment and use this code instead
    /*
    let query = supabase
      .from('ledger_entries')
      .select(`
        *,
        ledger_accounts:account_id (code, name)
      `)
      .order('date', { ascending: false });

    if (filter) {
      if (filter.accountId) {
        query = query.eq('account_id', filter.accountId);
      }

      if (filter.dateRange) {
        if (filter.dateRange.start) {
          query = query.gte('date', filter.dateRange.start);
        }
        if (filter.dateRange.end) {
          query = query.lte('date', filter.dateRange.end);
        }
      }

      if (filter.searchQuery) {
        query = query.ilike('description', `%${filter.searchQuery}%`);
      }
    }

    const { data, error } = await query;

    if (error) throw error;

    return (data || []).map(item => ({
      id: item.id,
      date: item.date,
      journalEntryId: item.journal_entry_id,
      accountId: item.account_id,
      accountCode: item.ledger_accounts?.code || '',
      accountName: item.ledger_accounts?.name || '',
      description: item.description,
      debit: item.debit,
      credit: item.credit,
      balance: item.balance,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }));
    */
  } catch (error: any) {
    toast.error(`Error fetching ledger entries: ${error.message}`);
    console.error('Error fetching ledger entries:', error);
    return [];
  }
};

// Get journal entries
export const getJournalEntries = async (filter?: any) => {
  try {
    const { data, error } = await supabase
      .from('journal_entries')
      .select(`
        *
      `)
      .order('date', { ascending: false });

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
    console.error('Error fetching journal entries:', error);
    return [];
  }
};

// Get journal summary
export const getJournalSummary = async () => {
  try {
    // For now, provide mock data
    return {
      totalEntries: 25,
      totalDebits: 45000000,
      totalCredits: 45000000,
      recentEntries: await getJournalEntries().then(entries => entries.slice(0, 5))
    };
  } catch (error: any) {
    toast.error(`Error fetching journal summary: ${error.message}`);
    console.error('Error fetching journal summary:', error);
    return {
      totalEntries: 0,
      totalDebits: 0,
      totalCredits: 0,
      recentEntries: []
    };
  }
};
