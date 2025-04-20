import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { PlusCircle, Search, Filter, Trash2, Edit, Calendar, DollarSign, User, Phone, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { formatRupiah } from '@/utils/currency';

// Define types for Customer and Receivable
type Customer = {
  id: string;
  name: string;
  contact_info?: string;
  created_at?: string;
};

type Receivable = {
  id: number;
  customer_id: string;
  amount: number;
  due_date: string;
  created_at?: string;
  customer_name: string; // Add customer_name to Receivable type
  contact_info?: string; // Add contact_info to Receivable type
  status: string;
  invoice_number: string;
  description: string;
  is_received: boolean;
  remaining_amount: number;
  issue_date: string;
  paid_date?: string;
};

const statusOptions = [
  { value: 'sent', label: 'Belum Dibayar' },
  { value: 'paid', label: 'Sudah Dibayar' },
  { value: 'overdue', label: 'Terlambat' },
];

const Receivables: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>('');
  const [receivables, setReceivables] = useState<Receivable[]>([]);
  const [isAddReceivableOpen, setIsAddReceivableOpen] = useState(false);
  const [newReceivable, setNewReceivable] = useState({
    invoice_number: '',
    issue_date: '',
    due_date: '',
    customer_name: '',
    customer_id: '',
    contact_info: '',
    description: '',
    amount: '',
    is_received: false,
  });
  const [customers, setCustomers] = useState<Customer[]>([]);

  // Fetch receivables from Supabase
  const { data: customerInvoices, error: customerInvoicesError, isLoading } = useQuery({
    queryKey: ['customer-invoices'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('receivables')
          .select(`
            id,
            customer_id,
            amount,
            due_date,
            created_at,
            customers (
              name,
              contact_info
            )
          `);

        if (error) throw error;

        if (data && data.length > 0) {
          return data.map(item => ({
            id: Number(item.id),
            customer_id: item.customer_id,
            amount: item.amount,
            due_date: item.due_date,
            created_at: item.created_at,
            customer_name: (item.customers as any)?.name || 'Unknown Customer', // Access customer name from joined table
            contact_info: (item.customers as any)?.contact_info || '', // Access customer contact info from joined table
            status: new Date(item.due_date).toLocaleDateString() < new Date().toLocaleDateString() ? 'overdue' : 'sent',
            invoice_number: '',
            description: '',
            is_received: false,
            remaining_amount: 0,
            issue_date: '',
            paid_date: '',
          })) as Receivable[];
        }

        return []; // Return an empty array instead of dummy data
      } catch (error) {
        console.error("Error fetching customer invoices:", error);
        toast.error("Gagal memuat data piutang pelanggan");
        return []; // Return an empty array instead of dummy data
      }
    },
  });

  useEffect(() => {
    if (customerInvoices) {
      setReceivables(customerInvoices);
    }
  }, [customerInvoices]);

  // Fetch customers from Supabase
  const { data: fetchedCustomers, isLoading: isLoadingCustomers } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.from('customers').select('*');
        if (error) {
          console.error('Error fetching customers:', error);
          toast.error('Failed to load customers');
          return [];
        }
        return data as Customer[];
      } catch (error) {
        console.error("Error fetching customers:", error);
        toast.error("Gagal memuat data pelanggan");
        return [];
      }
    },
  });

  useEffect(() => {
    if (fetchedCustomers) {
      setCustomers(fetchedCustomers);
    }
  }, [fetchedCustomers]);

  const filteredReceivables = receivables.filter(receivable => {
    const matchesSearch =
      receivable.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receivable.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receivable.invoice_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === '' ? true : receivable.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddReceivable = async () => {
    if (!newReceivable.invoice_number || !newReceivable.issue_date || !newReceivable.due_date ||
      !newReceivable.customer_name || !newReceivable.description || !newReceivable.amount) {
      toast.error('Semua field harus diisi');
      return;
    }

    const amount = parseFloat(newReceivable.amount);

    try {
      const { data, error } = await supabase
        .from('receivables').insert(
          [{
            customer_id: newReceivable.customer_id, amount: amount, due_date: newReceivable.due_date,
          }],
        )

      if (error) throw error;

      toast.success("Piutang berhasil ditambahkan");
      setIsAddReceivableOpen(false);
    } catch (error) {
      console.error("Error adding receivable:", error);
      toast.error("Gagal menambahkan piutang");
    }
  };

  const toggleReceivableStatus = async (id: number) => {
    try {
      const receivableToUpdate = receivables.find(r => r.id === id);
      if (!receivableToUpdate) return;

      const newStatus = !receivableToUpdate.is_received;

      const { data, error } = await supabase
        .from('receivables')
        .update({
          is_received: newStatus,
        })
        .eq('id', id);

      if (error) throw error;

      setReceivables(prevReceivables =>
        prevReceivables.map(receivable => {
          if (receivable.id === id) {
            return {
              ...receivable,
              is_received: newStatus,
              status: newStatus ? 'paid' : 'sent',
            };
          }
          return receivable;
        })
      );

      toast.success(`Piutang berhasil ${newStatus ? 'ditandai lunas' : 'ditandai belum lunas'}`);
    } catch (error) {
      console.error("Error updating receivable status:", error);
      toast.error("Gagal memperbarui status piutang");
    }
  };

  const getTotalReceivable = () => {
    return receivables.reduce((total, receivable) => {
      if (receivable.status !== 'paid') {
        return total + receivable.amount;
      }
      return total;
    }, 0);
  };

  const getOverdueReceivables = () => {
    const today = new Date();
    return receivables.filter(receivable => {
      const dueDate = new Date(receivable.due_date);
      return receivable.status !== 'paid' && dueDate < today;
    }).length;
  };

  const getStatusBadge = (status: string) => {
    if (status === 'sent') {
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Belum Dibayar</Badge>;
    } else if (status === 'paid') {
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Lunas</Badge>;
    } else if (status === 'overdue') {
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Terlambat</Badge>;
    }
    return null;
  };

  return (
    <MainLayout>
      <div className="pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Piutang</h1>
          <p className="text-muted-foreground">
            Kelola piutang penjualan produk ke pelanggan
          </p>
        </div>
        <Button onClick={() => setIsAddReceivableOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Tambah Piutang
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Ringkasan Piutang</CardTitle>
          <CardDescription>Ikhtisar piutang penjualan ke pelanggan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-background p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground">Total Piutang</p>
              <p className="text-2xl font-bold">{formatRupiah(getTotalReceivable())}</p>
            </div>
            <div className="bg-background p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground">Jumlah Piutang</p>
              <p className="text-2xl font-bold">{receivables.filter(r => r.status !== 'paid').length} Piutang</p>
            </div>
            <div className="bg-background p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground">Piutang Jatuh Tempo</p>
              <p className="text-2xl font-bold text-red-600">{getOverdueReceivables()} Piutang</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Daftar Piutang</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari piutang..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter Status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={null}>Semua Status</SelectItem>
                {statusOptions.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Status</TableHead>
                  <TableHead>No. Faktur</TableHead>
                  <TableHead>Pelanggan</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Jatuh Tempo</TableHead>
                  <TableHead className="text-right">Jumlah</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReceivables.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6">
                      Tidak ada data piutang yang sesuai
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReceivables.map((receivable) => (
                    <TableRow key={receivable.id}>
                      <TableCell>
                        <Checkbox
                          checked={receivable.is_received}
                          onCheckedChange={() => toggleReceivableStatus(receivable.id)}
                        />
                      </TableCell>
                      <TableCell>{receivable.invoice_number}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{receivable.customer_name}</p>
                          {receivable.contact_info && (
                            <p className="text-xs text-muted-foreground flex items-center mt-1">
                              <Phone className="h-3 w-3 mr-1" />
                              {receivable.contact_info}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{receivable.description}</TableCell>
                      <TableCell>
                        {new Date(receivable.due_date).toLocaleDateString('id-ID')}
                        {new Date(receivable.due_date) < new Date() && receivable.status !== 'paid' && (
                          <Badge variant="destructive" className="ml-2">Jatuh Tempo</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatRupiah(receivable.amount)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
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
          <p className="text-sm text-muted-foreground">Menampilkan {filteredReceivables.length} dari {receivables.length} piutang</p>
        </CardFooter>
      </Card>

      <Dialog open={isAddReceivableOpen} onOpenChange={setIsAddReceivableOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tambah Piutang Penjualan</DialogTitle>
            <DialogDescription>
              Masukkan detail piutang penjualan ke pelanggan.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="invoice_number" className="block mb-1">
                Nomor Faktur
              </Label>
              <div className="relative">
                <FileText className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="invoice_number"
                  placeholder="Nomor faktur penjualan"
                  className="pl-8"
                  value={newReceivable.invoice_number}
                  onChange={(e) => setNewReceivable({ ...newReceivable, invoice_number: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="issue_date" className="block mb-1">
                  Tanggal Faktur
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="issue_date"
                    type="date"
                    className="pl-8"
                    value={newReceivable.issue_date}
                    onChange={(e) => setNewReceivable({ ...newReceivable, issue_date: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="due_date" className="block mb-1">
                  Jatuh Tempo
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="due_date"
                    type="date"
                    className="pl-8"
                    value={newReceivable.due_date}
                    onChange={(e) => setNewReceivable({ ...newReceivable, due_date: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customer_name" className="block mb-1">
                  Nama Pelanggan
                </Label>
                <div className="relative">
                  <User className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="customer_name"
                    placeholder="Nama pelanggan"
                    className="pl-8"
                    value={newReceivable.customer_name}
                    onChange={(e) => setNewReceivable({ ...newReceivable, customer_name: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="contact_info" className="block mb-1">
                  Kontak (opsional)
                </Label>
                <div className="relative">
                  <Phone className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="contact_info"
                    placeholder="Nomor telepon"
                    className="pl-8"
                    value={newReceivable.contact_info}
                    onChange={(e) => setNewReceivable({ ...newReceivable, contact_info: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="block mb-1">
                Deskripsi
              </Label>
              <Input
                id="description"
                placeholder="Deskripsi penjualan"
                value={newReceivable.description}
                onChange={(e) => setNewReceivable({ ...newReceivable, description: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="amount" className="block mb-1">
                Jumlah
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="amount"
                  type="number"
                  placeholder="Jumlah piutang"
                  className="pl-8"
                  value={newReceivable.amount}
                  onChange={(e) => setNewReceivable({ ...newReceivable, amount: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="customer_id" className="block mb-1">
                Pelanggan
              </Label>
              <Select
                value={newReceivable.customer_id}
                onValueChange={(value) =>
                  setNewReceivable({ ...newReceivable, customer_id: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih pelanggan" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_received"
                checked={newReceivable.is_received}
                onCheckedChange={(checked) =>
                  setNewReceivable({
                    ...newReceivable,
                    is_received: checked as boolean
                  })
                }
              />
              <label
                htmlFor="is_received"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Sudah Dibayar
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddReceivableOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleAddReceivable}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Receivables;
