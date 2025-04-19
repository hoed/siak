
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CalendarIcon, Download, Filter, Printer, Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getLedgerAccounts, getLedgerEntries } from '@/services/ledgerService';
import { toast } from 'sonner';
import { Button as ShadcnButton } from '@/components/ui/button';
import { DateRange } from 'react-day-picker';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { LedgerAccount, LedgerEntry } from '@/types/food-manufacturing';

const Ledger: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  });

  // Fetch ledger accounts
  const {
    data: accounts = [],
    isLoading: isLoadingAccounts,
    error: accountsError,
  } = useQuery({
    queryKey: ['ledgerAccounts'],
    queryFn: getLedgerAccounts,
  });

  // Fetch ledger entries
  const {
    data: entries = [],
    isLoading: isLoadingEntries,
    error: entriesError,
  } = useQuery({
    queryKey: ['ledgerEntries', selectedAccount, date],
    queryFn: () =>
      getLedgerEntries({
        accountId: selectedAccount || undefined,
        dateRange: date
          ? {
              start: date.from ? format(date.from, 'yyyy-MM-dd') : undefined,
              end: date.to ? format(date.to, 'yyyy-MM-dd') : undefined,
            }
          : undefined,
        searchQuery: searchQuery || undefined,
      }),
  });

  if (accountsError) {
    toast.error('Gagal memuat data akun buku besar');
  }

  if (entriesError) {
    toast.error('Gagal memuat data transaksi buku besar');
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const filteredEntries = entries.filter(
    (entry) =>
      entry.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.accountId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Buku Besar</h1>
          <p className="text-muted-foreground">
            Kelola dan lihat transaksi buku besar untuk setiap akun
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Cetak Laporan
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Ekspor Excel
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filter Buku Besar</CardTitle>
          <CardDescription>Pilih akun dan periode untuk melihat transaksi</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">Akun</label>
              <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih akun" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Akun</SelectItem>
                  {accounts.map((account: LedgerAccount) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.code} - {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">Periode</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, 'dd MMMM yyyy', { locale: id })} -{' '}
                          {format(date.to, 'dd MMMM yyyy', { locale: id })}
                        </>
                      ) : (
                        format(date.from, 'dd MMMM yyyy', { locale: id })
                      )
                    ) : (
                      <span>Pilih tanggal</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    locale={id}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">Cari</label>
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari deskripsi atau kode akun"
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transaksi Buku Besar</CardTitle>
          <CardDescription>
            {selectedAccount
              ? `Menampilkan transaksi untuk ${
                  accounts.find((a: LedgerAccount) => a.id === selectedAccount)?.name ||
                  'akun yang dipilih'
                }`
              : 'Menampilkan semua transaksi buku besar'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Kode Akun</TableHead>
                  <TableHead>Nama Akun</TableHead>
                  <TableHead className="text-right">Debit</TableHead>
                  <TableHead className="text-right">Kredit</TableHead>
                  <TableHead className="text-right">Saldo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingEntries ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6">
                      Memuat data...
                    </TableCell>
                  </TableRow>
                ) : filteredEntries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6">
                      Tidak ditemukan data transaksi. Ubah filter atau periode untuk melihat data.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEntries.map((entry: LedgerEntry) => {
                    const account = accounts.find((a: LedgerAccount) => a.id === entry.accountId);
                    return (
                      <TableRow key={entry.id}>
                        <TableCell>{format(new Date(entry.date), 'dd/MM/yyyy')}</TableCell>
                        <TableCell>{entry.description}</TableCell>
                        <TableCell>{account?.code || 'N/A'}</TableCell>
                        <TableCell>{account?.name || 'N/A'}</TableCell>
                        <TableCell className="text-right">
                          {entry.debit > 0 ? formatCurrency(entry.debit) : '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          {entry.credit > 0 ? formatCurrency(entry.credit) : '-'}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(entry.balance)}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            Menampilkan {filteredEntries.length} transaksi
          </p>
        </CardFooter>
      </Card>
    </MainLayout>
  );
};

export default Ledger;
