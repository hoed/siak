
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Search, Plus, FileText, Calendar as CalendarIcon, Trash2, Eye, MoreVertical, PlusCircle, MinusCircle } from 'lucide-react';
import { toast } from 'sonner';
import { ChartOfAccount } from '@/types/accounting';
import { JournalEntry, JournalEntryLine, JournalViewPeriod, JournalFilter } from '@/types/ledger';
import { format, parseISO } from 'date-fns';
import { getChartOfAccounts } from '@/services/accountingService';
import {
  getJournalEntries,
  getJournalEntryDetails,
  createJournalEntry,
  deleteJournalEntry,
  getJournalSummary,
  generateJournalFilterDates,
} from '@/services/ledgerService';

const Journals: React.FC = () => {
  const [viewPeriod, setViewPeriod] = useState<JournalViewPeriod>('daily');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddEntryOpen, setIsAddEntryOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isViewEntryOpen, setIsViewEntryOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewEntryId, setViewEntryId] = useState<string | null>(null);
  const [selectedDateString, setSelectedDateString] = useState<string>(format(new Date(), 'yyyy-MM-dd'));

  // New entry form state
  const [entryForm, setEntryForm] = useState<{
    date: string;
    description: string;
    entryNumber: string;
    isPosted: boolean;
    lines: {
      accountId: string;
      description: string;
      isDebit: boolean;
      amount: number;
    }[];
  }>({
    date: format(new Date(), 'yyyy-MM-dd'),
    description: '',
    entryNumber: `JE-${format(new Date(), 'yyyyMMdd')}-`,
    isPosted: false,
    lines: [
      {
        accountId: '',
        description: '',
        isDebit: true,
        amount: 0,
      },
      {
        accountId: '',
        description: '',
        isDebit: false,
        amount: 0,
      },
    ],
  });

  const queryClient = useQueryClient();

  // Generate the filter dates based on the view period and selected date
  const filterDates = generateJournalFilterDates(viewPeriod, selectedDate);

  // Journal entry query
  const { data: journalEntries = [], isLoading: isLoadingEntries } = useQuery({
    queryKey: ['journalEntries', viewPeriod, filterDates],
    queryFn: () => getJournalEntries(viewPeriod, {
      dateRange: filterDates,
      searchQuery: searchTerm,
    }),
  });

  // Chart of accounts query
  const { data: accounts = [], isLoading: isLoadingAccounts } = useQuery({
    queryKey: ['chartOfAccounts'],
    queryFn: getChartOfAccounts,
  });

  // Journal summary query
  const { data: journalSummary, isLoading: isLoadingSummary } = useQuery({
    queryKey: ['journalSummary', viewPeriod, selectedDate],
    queryFn: () => getJournalSummary(viewPeriod, selectedDate),
  });

  // View journal entry details query
  const { data: viewEntryDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ['journalEntryDetails', viewEntryId],
    queryFn: () => viewEntryId ? getJournalEntryDetails(viewEntryId) : Promise.resolve({ entry: null, lines: [] }),
    enabled: !!viewEntryId,
  });

  // Create journal entry mutation
  const createEntryMutation = useMutation({
    mutationFn: ({ entry, lines }: { entry: any, lines: any[] }) => 
      createJournalEntry(entry, lines),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journalEntries'] });
      queryClient.invalidateQueries({ queryKey: ['journalSummary'] });
      setIsAddEntryOpen(false);
      resetEntryForm();
      toast.success('Journal entry created successfully');
    },
    onError: (error: any) => {
      toast.error(`Error creating journal entry: ${error.message}`);
    },
  });

  // Delete journal entry mutation
  const deleteEntryMutation = useMutation({
    mutationFn: (id: string) => deleteJournalEntry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journalEntries'] });
      queryClient.invalidateQueries({ queryKey: ['journalSummary'] });
      setIsDeleteConfirmOpen(false);
      toast.success('Journal entry deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Error deleting journal entry: ${error.message}`);
    },
  });

  // Filter entries by search term
  const filteredEntries = journalEntries.filter(entry => {
    const matchesSearch = 
      entry.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
      entry.entryNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const resetEntryForm = () => {
    setEntryForm({
      date: format(new Date(), 'yyyy-MM-dd'),
      description: '',
      entryNumber: `JE-${format(new Date(), 'yyyyMMdd')}-`,
      isPosted: false,
      lines: [
        {
          accountId: '',
          description: '',
          isDebit: true,
          amount: 0,
        },
        {
          accountId: '',
          description: '',
          isDebit: false,
          amount: 0,
        },
      ],
    });
  };

  const handleEntrySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that debits equal credits
    const totalDebits = entryForm.lines
      .filter(line => line.isDebit)
      .reduce((sum, line) => sum + Number(line.amount), 0);

    const totalCredits = entryForm.lines
      .filter(line => !line.isDebit)
      .reduce((sum, line) => sum + Number(line.amount), 0);

    if (Math.abs(totalDebits - totalCredits) > 0.01) {
      toast.error('Debits must equal credits');
      return;
    }

    // Transform the form data to the expected format for the API
    const entry = {
      date: entryForm.date,
      description: entryForm.description,
      entryNumber: entryForm.entryNumber,
      isPosted: entryForm.isPosted,
    };

    const lines = entryForm.lines.map(line => ({
      accountId: line.accountId,
      description: line.description,
      debit: line.isDebit ? Number(line.amount) : 0,
      credit: !line.isDebit ? Number(line.amount) : 0,
    }));

    createEntryMutation.mutate({ entry, lines });
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteEntryMutation.mutate(deleteId);
    }
  };

  const handleViewEntry = (id: string) => {
    setViewEntryId(id);
    setIsViewEntryOpen(true);
  };

  const addJournalLine = () => {
    setEntryForm({
      ...entryForm,
      lines: [
        ...entryForm.lines,
        {
          accountId: '',
          description: '',
          isDebit: entryForm.lines.length % 2 === 0,
          amount: 0,
        },
      ],
    });
  };

  const removeJournalLine = (index: number) => {
    if (entryForm.lines.length <= 2) {
      toast.error('A journal entry must have at least two lines');
      return;
    }

    const newLines = [...entryForm.lines];
    newLines.splice(index, 1);
    setEntryForm({
      ...entryForm,
      lines: newLines,
    });
  };

  const updateJournalLine = (index: number, field: string, value: any) => {
    const newLines = [...entryForm.lines];
    (newLines[index] as any)[field] = value;
    setEntryForm({
      ...entryForm,
      lines: newLines,
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getAccountById = (id: string): ChartOfAccount | undefined => {
    return accounts.find(account => account.id === id);
  };

  return (
    <MainLayout>
      <div className="pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Jurnal</h1>
          <p className="text-muted-foreground">
            Kelola catatan transaksi keuangan harian dan bulanan
          </p>
        </div>
        <Button onClick={() => setIsAddEntryOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Entri Jurnal
        </Button>
      </div>

      {journalSummary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Entri</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{journalSummary.totalEntries}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Debit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(journalSummary.totalDebits)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Kredit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(journalSummary.totalCredits)}</div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Entri Jurnal</CardTitle>
          <CardDescription>
            Lihat dan kelola entri jurnal
          </CardDescription>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari entri jurnal..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-4">
              <Tabs defaultValue={viewPeriod} value={viewPeriod} onValueChange={(value) => setViewPeriod(value as JournalViewPeriod)}>
                <TabsList>
                  <TabsTrigger value="daily">Harian</TabsTrigger>
                  <TabsTrigger value="monthly">Bulanan</TabsTrigger>
                </TabsList>
              </Tabs>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {viewPeriod === 'daily' 
                      ? format(selectedDate, 'PPP') 
                      : format(selectedDate, 'MMMM yyyy')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode={viewPeriod === 'monthly' ? "month" : "single"}
                    selected={selectedDate}
                    onSelect={(date) => {
                      if (date) {
                        setSelectedDate(date);
                        setSelectedDateString(format(date, 'yyyy-MM-dd'));
                      }
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nomor</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead className="text-right">Debit</TableHead>
                  <TableHead className="text-right">Kredit</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingEntries ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                      Memuat data jurnal...
                    </TableCell>
                  </TableRow>
                ) : filteredEntries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                      Tidak ada entri jurnal pada periode yang dipilih.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">{entry.entryNumber}</TableCell>
                      <TableCell>{format(parseISO(entry.date), 'dd MMM yyyy')}</TableCell>
                      <TableCell>{entry.description}</TableCell>
                      <TableCell className="text-right">{formatCurrency(0)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(0)}</TableCell>
                      <TableCell className="text-center">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          entry.isPosted 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {entry.isPosted ? 'Posted' : 'Draft'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center space-x-2">
                          <Button variant="ghost" size="icon" onClick={() => handleViewEntry(entry.id)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(entry.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Menampilkan {filteredEntries.length} entri jurnal
          </div>
        </CardFooter>
      </Card>

      <Sheet open={isAddEntryOpen} onOpenChange={setIsAddEntryOpen}>
        <SheetContent className="sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Tambah Entri Jurnal Baru</SheetTitle>
            <SheetDescription>
              Isi detail untuk mencatat entri jurnal baru.
            </SheetDescription>
          </SheetHeader>
          <form onSubmit={handleEntrySubmit} className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="entryNumber">Nomor Entri *</Label>
                <Input 
                  id="entryNumber" 
                  value={entryForm.entryNumber} 
                  onChange={(e) => setEntryForm({...entryForm, entryNumber: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Tanggal *</Label>
                <Input 
                  id="date" 
                  type="date" 
                  value={entryForm.date} 
                  onChange={(e) => setEntryForm({...entryForm, date: e.target.value})}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi *</Label>
              <Textarea 
                id="description" 
                value={entryForm.description} 
                onChange={(e) => setEntryForm({...entryForm, description: e.target.value})}
                required
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Detail Akun</h3>
                <Button type="button" variant="outline" size="sm" onClick={addJournalLine}>
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Baris
                </Button>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Akun</TableHead>
                      <TableHead>Deskripsi</TableHead>
                      <TableHead className="w-[120px]">Debit</TableHead>
                      <TableHead className="w-[120px]">Kredit</TableHead>
                      <TableHead className="w-[70px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {entryForm.lines.map((line, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Select 
                            value={line.accountId} 
                            onValueChange={(value) => updateJournalLine(index, 'accountId', value)}
                            required
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih akun" />
                            </SelectTrigger>
                            <SelectContent>
                              {accounts.map((account) => (
                                <SelectItem key={account.id} value={account.id}>
                                  {account.code} - {account.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input 
                            value={line.description} 
                            onChange={(e) => updateJournalLine(index, 'description', e.target.value)}
                            placeholder="Deskripsi akun"
                          />
                        </TableCell>
                        <TableCell>
                          <Input 
                            type="number"
                            min="0"
                            step="0.01"
                            value={line.isDebit ? line.amount : 0} 
                            onChange={(e) => {
                              if (line.isDebit) {
                                updateJournalLine(index, 'amount', Number(e.target.value));
                              } else {
                                updateJournalLine(index, 'isDebit', true);
                                updateJournalLine(index, 'amount', Number(e.target.value));
                              }
                            }}
                            disabled={!line.isDebit}
                          />
                        </TableCell>
                        <TableCell>
                          <Input 
                            type="number"
                            min="0"
                            step="0.01"
                            value={!line.isDebit ? line.amount : 0} 
                            onChange={(e) => {
                              if (!line.isDebit) {
                                updateJournalLine(index, 'amount', Number(e.target.value));
                              } else {
                                updateJournalLine(index, 'isDebit', false);
                                updateJournalLine(index, 'amount', Number(e.target.value));
                              }
                            }}
                            disabled={line.isDebit}
                          />
                        </TableCell>
                        <TableCell>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => removeJournalLine(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-between">
                <div>
                  <span className="text-sm text-muted-foreground">
                    Total Debit: {formatCurrency(entryForm.lines
                      .filter(line => line.isDebit)
                      .reduce((sum, line) => sum + Number(line.amount), 0)
                    )}
                  </span>
                  <span className="block text-sm text-muted-foreground">
                    Total Kredit: {formatCurrency(entryForm.lines
                      .filter(line => !line.isDebit)
                      .reduce((sum, line) => sum + Number(line.amount), 0)
                    )}
                  </span>
                </div>
                <div className="space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      resetEntryForm();
                      setIsAddEntryOpen(false);
                    }}
                  >
                    Batal
                  </Button>
                  <Button type="submit">
                    Simpan Entri
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </SheetContent>
      </Sheet>

      <Sheet open={isViewEntryOpen} onOpenChange={setIsViewEntryOpen}>
        <SheetContent className="sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Detail Entri Jurnal</SheetTitle>
          </SheetHeader>
          {isLoadingDetails ? (
            <div className="py-10 text-center">Memuat detail...</div>
          ) : viewEntryDetails?.entry ? (
            <div className="mt-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Nomor Entri</h3>
                  <p className="mt-1">{viewEntryDetails.entry.entryNumber}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Tanggal</h3>
                  <p className="mt-1">{format(parseISO(viewEntryDetails.entry.date), 'dd MMMM yyyy')}</p>
                </div>
                <div className="col-span-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Deskripsi</h3>
                  <p className="mt-1">{viewEntryDetails.entry.description}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                  <p className="mt-1">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      viewEntryDetails.entry.isPosted 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {viewEntryDetails.entry.isPosted ? 'Posted' : 'Draft'}
                    </span>
                  </p>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Kode</TableHead>
                      <TableHead>Akun</TableHead>
                      <TableHead>Deskripsi</TableHead>
                      <TableHead className="text-right">Debit</TableHead>
                      <TableHead className="text-right">Kredit</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {viewEntryDetails.lines.map((line) => (
                      <TableRow key={line.id}>
                        <TableCell className="font-medium">{line.accountCode}</TableCell>
                        <TableCell>{line.accountName}</TableCell>
                        <TableCell>{line.description || '-'}</TableCell>
                        <TableCell className="text-right">{line.debit > 0 ? formatCurrency(line.debit) : '-'}</TableCell>
                        <TableCell className="text-right">{line.credit > 0 ? formatCurrency(line.credit) : '-'}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} className="text-right font-medium">Total</TableCell>
                      <TableCell className="text-right font-bold">
                        {formatCurrency(viewEntryDetails.lines.reduce((sum, line) => sum + line.debit, 0))}
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        {formatCurrency(viewEntryDetails.lines.reduce((sum, line) => sum + line.credit, 0))}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <SheetFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setViewEntryId(null);
                    setIsViewEntryOpen(false);
                  }}
                >
                  Tutup
                </Button>
              </SheetFooter>
            </div>
          ) : (
            <div className="py-10 text-center">Tidak ada data detail entri jurnal.</div>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus entri jurnal ini? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Journals;
