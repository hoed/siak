import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Search, UserPlus, MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

type Customer = Database['public']['Tables']['customers']['Row'];
type Receivable = Database['public']['Tables']['receivables']['Row'];
type Transaction = Database['public']['Tables']['transactions']['Row'];

const Customers: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [isEditCustomerOpen, setIsEditCustomerOpen] = useState(false);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [isAddReceivableOpen, setIsAddReceivableOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    status: 'active' as 'active' | 'inactive',
  });

  const [newReceivable, setNewReceivable] = useState({
    amount: '',
    description: '',
    due_date: '',
    invoice_number: `INV-CUST-${uuidv4().slice(0, 8)}`,
  });

  const canModify = user?.role === 'admin' || user?.role === 'manager' || user?.role === 'accountant';

  // Fetch customers
  const { data: customers = [], isLoading, error } = useQuery<Customer[], Error>({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return data;
    },
  });

  // Fetch receivables for selected customer
  const { data: receivables = [] } = useQuery<Receivable[], Error>({
    queryKey: ['receivables', selectedCustomer?.id],
    queryFn: async () => {
      if (!selectedCustomer) return [];
      const { data, error } = await supabase
        .from('receivables')
        .select('*')
        .eq('customer_id', selectedCustomer.id)
        .order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!selectedCustomer,
  });

  // Fetch transactions (payments) for selected customer
  const { data: transactions = [] } = useQuery<Transaction[], Error>({
    queryKey: ['transactions', selectedCustomer?.id],
    queryFn: async () => {
      if (!selectedCustomer) return [];
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('customer_id', selectedCustomer.id)
        .eq('type', 'income')
        .order('date', { ascending: false });
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!selectedCustomer,
  });

  // Fetch accounts for transaction insertion
  const { data: accounts = [] } = useQuery<Database['public']['Tables']['accounts']['Row'][], Error>({
    queryKey: ['accounts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('accounts')
        .select('*');
      if (error) throw new Error(error.message);
      return data;
    },
  });

  // Add customer mutation
  const addCustomerMutation = useMutation({
    mutationFn: async (customer: Database['public']['Tables']['customers']['Insert']) => {
      const { data, error } = await supabase
        .from('customers')
        .insert([customer])
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      setNewCustomer({ name: '', email: '', phone: '', address: '', status: 'active' });
      setIsAddCustomerOpen(false);
      toast({
        title: 'Pelanggan berhasil ditambahkan',
        description: `Pelanggan ${newCustomer.name} telah ditambahkan`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Gagal menambahkan pelanggan',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Update customer mutation
  const updateCustomerMutation = useMutation({
    mutationFn: async (customer: Database['public']['Tables']['customers']['Update']) => {
      const { data, error } = await supabase
        .from('customers')
        .update({
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          address: customer.address,
          status: customer.status,
        })
        .eq('id', customer.id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      setIsEditCustomerOpen(false);
      toast({
        title: 'Pelanggan berhasil diperbarui',
        description: `Data pelanggan ${selectedCustomer?.name} telah diperbarui`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Gagal memperbarui pelanggan',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Delete customer mutation
  const deleteCustomerMutation = useMutation({
    mutationFn: async (customerId: string) => {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', customerId);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast({
        title: 'Pelanggan berhasil dihapus',
        description: 'Data pelanggan telah dihapus dari sistem',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Gagal menghapus pelanggan',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Add receivable mutation
  const addReceivableMutation = useMutation({
    mutationFn: async (receivable: Database['public']['Tables']['receivables']['Insert']) => {
      const { data, error } = await supabase
        .from('receivables')
        .insert([receivable])
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receivables', selectedCustomer?.id] });
      setNewReceivable({
        amount: '',
        description: '',
        due_date: '',
        invoice_number: `INV-CUST-${uuidv4().slice(0, 8)}`,
      });
      setIsAddReceivableOpen(false);
      toast({
        title: 'Piutang berhasil ditambahkan',
        description: `Piutang untuk ${selectedCustomer?.name} telah ditambahkan`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Gagal menambahkan piutang',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddCustomer = () => {
    if (!newCustomer.name || !newCustomer.email || !newCustomer.phone) {
      toast({
        title: 'Data tidak lengkap',
        description: 'Mohon lengkapi nama, email, dan nomor telepon',
        variant: 'destructive',
      });
      return;
    }
    addCustomerMutation.mutate(newCustomer);
  };

  const handleEditCustomer = () => {
    if (!selectedCustomer || !canModify) return;
    updateCustomerMutation.mutate(selectedCustomer);
  };

  const handleDeleteCustomer = (customerId: string) => {
    if (!canModify) {
      toast({
        title: 'Aksi tidak diizinkan',
        description: 'Hanya admin, manajer, atau akuntan yang dapat menghapus pelanggan',
        variant: 'destructive',
      });
      return;
    }
    deleteCustomerMutation.mutate(customerId);
  };

  const handleAddReceivable = () => {
    if (!selectedCustomer || !newReceivable.amount || !newReceivable.due_date) {
      toast({
        title: 'Data tidak lengkap',
        description: 'Mohon lengkapi jumlah dan tanggal jatuh tempo',
        variant: 'destructive',
      });
      return;
    }
    addReceivableMutation.mutate({
      customer_id: selectedCustomer.id,
      amount: parseFloat(newReceivable.amount),
      description: newReceivable.description || 'Invoice',
      due_date: newReceivable.due_date,
      invoice_number: newReceivable.invoice_number,
      is_received: false,
      created_by: user?.id,
    });
  };

  if (error) {
    return (
      <MainLayout>
        <div className="text-red-500">Error: {error.message}</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Pelanggan</h1>
          <p className="text-muted-foreground">Kelola data pelanggan perusahaan</p>
        </div>
        <Dialog open={isAddCustomerOpen} onOpenChange={setIsAddCustomerOpen}>
          <DialogTrigger asChild>
            <Button disabled={addCustomerMutation.isPending}>
              <UserPlus className="mr-2 h-4 w-4" />
              Tambah Pelanggan
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Pelanggan Baru</DialogTitle>
              <DialogDescription>Masukkan informasi pelanggan baru.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Nama Pelanggan</label>
                <Input
                  id="name"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  placeholder="Nama pelanggan atau perusahaan"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input
                  id="email"
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  placeholder="email@example.com"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">Nomor Telepon</label>
                <Input
                  id="phone"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                  placeholder="081234567890"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="address" className="text-sm font-medium">Alamat</label>
                <Input
                  id="address"
                  value={newCustomer.address}
                  onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                  placeholder="Alamat pelanggan"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddCustomerOpen(false)}
                disabled={addCustomerMutation.isPending}
              >
                Batal
              </Button>
              <Button
                onClick={handleAddCustomer}
                disabled={addCustomerMutation.isPending}
              >
                {addCustomerMutation.isPending ? 'Menambahkan...' : 'Tambah Pelanggan'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Daftar Pelanggan</CardTitle>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Cari pelanggan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Memuat data pelanggan...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telepon</TableHead>
                  <TableHead>Alamat</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Tidak ada pelanggan yang ditemukan
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>{customer.name}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{customer.phone}</TableCell>
                      <TableCell>{customer.address || '-'}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            customer.status === 'active'
                              ? 'bg-green-50 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {customer.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedCustomer(customer);
                                setIsViewDetailsOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Lihat Detail
                            </DropdownMenuItem>
                            {canModify && (
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedCustomer(customer);
                                  setIsEditCustomerOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Pelanggan
                              </DropdownMenuItem>
                            )}
                            {canModify && (
                              <DropdownMenuItem
                                onClick={() => handleDeleteCustomer(customer.id)}
                                className="text-red-600 focus:text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Hapus Pelanggan
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Customer Dialog */}
      <Dialog open={isEditCustomerOpen} onOpenChange={setIsEditCustomerOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Pelanggan</DialogTitle>
            <DialogDescription>Perbarui informasi pelanggan.</DialogDescription>
          </DialogHeader>
          {selectedCustomer && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label htmlFor="edit-name" className="text-sm font-medium">Nama Pelanggan</label>
                <Input
                  id="edit-name"
                  value={selectedCustomer.name}
                  onChange={(e) =>
                    setSelectedCustomer({ ...selectedCustomer, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-email" className="text-sm font-medium">Email</label>
                <Input
                  id="edit-email"
                  type="email"
                  value={selectedCustomer.email}
                  onChange={(e) =>
                    setSelectedCustomer({ ...selectedCustomer, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-phone" className="text-sm font-medium">Nomor Telepon</label>
                <Input
                  id="edit-phone"
                  value={selectedCustomer.phone}
                  onChange={(e) =>
                    setSelectedCustomer({ ...selectedCustomer, phone: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-address" className="text-sm font-medium">Alamat</label>
                <Input
                  id="edit-address"
                  value={selectedCustomer.address || ''}
                  onChange={(e) =>
                    setSelectedCustomer({ ...selectedCustomer, address: e.target.value })
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditCustomerOpen(false)}
              disabled={updateCustomerMutation.isPending}
            >
              Batal
            </Button>
            <Button
              onClick={handleEditCustomer}
              disabled={updateCustomerMutation.isPending || !canModify}
            >
              {updateCustomerMutation.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Detail Pelanggan: {selectedCustomer?.name}</DialogTitle>
            <DialogDescription>Lihat pembayaran dan piutang pelanggan.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Pembayaran (Pendapatan)</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Deskripsi</TableHead>
                      <TableHead>Jumlah</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-4">
                          Tidak ada pembayaran ditemukan
                        </TableCell>
                      </TableRow>
                    ) : (
                      transactions.map((txn) => (
                        <TableRow key={txn.id}>
                          <TableCell>{format(new Date(txn.date), 'dd/MM/yyyy')}</TableCell>
                          <TableCell>{txn.description}</TableCell>
                          <TableCell>Rp {txn.amount.toLocaleString('id-ID')}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Piutang</CardTitle>
                  {canModify && (
                    <Button
                      onClick={() => setIsAddReceivableOpen(true)}
                      disabled={addReceivableMutation.isPending}
                    >
                      Tambah Piutang
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nomor Invoice</TableHead>
                      <TableHead>Deskripsi</TableHead>
                      <TableHead>Jumlah</TableHead>
                      <TableHead>Jatuh Tempo</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {receivables.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4">
                          Tidak ada piutang ditemukan
                        </TableCell>
                      </TableRow>
                    ) : (
                      receivables.map((rec) => (
                        <TableRow key={rec.id}>
                          <TableCell>{rec.invoice_number}</TableCell>
                          <TableCell>{rec.description}</TableCell>
                          <TableCell>Rp {rec.amount.toLocaleString('id-ID')}</TableCell>
                          <TableCell>{format(new Date(rec.due_date), 'dd/MM/yyyy')}</TableCell>
                          <TableCell>
                            {rec.is_received ? 'Diterima' : 'Belum Diterima'}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsViewDetailsOpen(false)}
            >
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Receivable Dialog */}
      <Dialog open={isAddReceivableOpen} onOpenChange={setIsAddReceivableOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Piutang</DialogTitle>
            <DialogDescription>Tambahkan piutang baru untuk {selectedCustomer?.name}.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="amount" className="text-sm font-medium">Jumlah</label>
              <Input
                id="amount"
                type="number"
                value={newReceivable.amount}
                onChange={(e) => setNewReceivable({ ...newReceivable, amount: e.target.value })}
                placeholder="5000000"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">Deskripsi</label>
              <Input
                id="description"
                value={newReceivable.description}
                onChange={(e) => setNewReceivable({ ...newReceivable, description: e.target.value })}
                placeholder="Invoice untuk layanan"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="due_date" className="text-sm font-medium">Jatuh Tempo</label>
              <Input
                id="due_date"
                type="date"
                value={newReceivable.due_date}
                onChange={(e) => setNewReceivable({ ...newReceivable, due_date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="invoice_number" className="text-sm font-medium">Nomor Invoice</label>
              <Input
                id="invoice_number"
                value={newReceivable.invoice_number}
                onChange={(e) => setNewReceivable({ ...newReceivable, invoice_number: e.target.value })}
                placeholder="INV-CUST-XXXX"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddReceivableOpen(false)}
              disabled={addReceivableMutation.isPending}
            >
              Batal
            </Button>
            <Button
              onClick={handleAddReceivable}
              disabled={addReceivableMutation.isPending}
            >
              {addReceivableMutation.isPending ? 'Menambahkan...' : 'Tambah Piutang'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Customers;