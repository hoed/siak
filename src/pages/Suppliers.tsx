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

type Supplier = Database['public']['Tables']['suppliers']['Row'];
type Debt = Database['public']['Tables']['debts']['Row'];
type Transaction = Database['public']['Tables']['transactions']['Row'];

const Suppliers: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false);
  const [isEditSupplierOpen, setIsEditSupplierOpen] = useState(false);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [isAddDebtOpen, setIsAddDebtOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  const [newSupplier, setNewSupplier] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    status: 'active' as 'active' | 'inactive',
  });

  const [newDebt, setNewDebt] = useState({
    amount: '',
    description: '',
    due_date: '',
    invoice_number: `INV-SUPP-${uuidv4().slice(0, 8)}`,
  });

  const canModify = user?.role === 'admin' || user?.role === 'manager' || user?.role === 'accountant';

  // Fetch suppliers
  const { data: suppliers = [], isLoading, error } = useQuery<Supplier[], Error>({
    queryKey: ['suppliers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return data;
    },
  });

  // Fetch debts for selected supplier
  const { data: debts = [] } = useQuery<Debt[], Error>({
    queryKey: ['debts', selectedSupplier?.id],
    queryFn: async () => {
      if (!selectedSupplier) return [];
      const { data, error } = await supabase
        .from('debts')
        .select('*')
        .eq('supplier_id', selectedSupplier.id)
        .order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!selectedSupplier,
  });

  // Fetch transactions (payments) for selected supplier
  const { data: transactions = [] } = useQuery<Transaction[], Error>({
    queryKey: ['transactions', selectedSupplier?.id],
    queryFn: async () => {
      if (!selectedSupplier) return [];
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('supplier_id', selectedSupplier.id)
        .eq('type', 'expense')
        .order('date', { ascending: false });
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!selectedSupplier,
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

  // Add supplier mutation
  const addSupplierMutation = useMutation({
    mutationFn: async (supplier: Database['public']['Tables']['suppliers']['Insert']) => {
      const { data, error } = await supabase
        .from('suppliers')
        .insert([supplier])
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      setNewSupplier({ name: '', email: '', phone: '', address: '', status: 'active' });
      setIsAddSupplierOpen(false);
      toast({
        title: 'Pemasok berhasil ditambahkan',
        description: `Pemasok ${newSupplier.name} telah ditambahkan`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Gagal menambahkan pemasok',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Update supplier mutation
  const updateSupplierMutation = useMutation({
    mutationFn: async (supplier: Database['public']['Tables']['suppliers']['Update']) => {
      const { data, error } = await supabase
        .from('suppliers')
        .update({
          name: supplier.name,
          email: supplier.email,
          phone: supplier.phone,
          address: supplier.address,
          status: supplier.status,
        })
        .eq('id', supplier.id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      setIsEditSupplierOpen(false);
      toast({
        title: 'Pemasok berhasil diperbarui',
        description: `Data pemasok ${selectedSupplier?.name} telah diperbarui`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Gagal memperbarui pemasok',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Delete supplier mutation
  const deleteSupplierMutation = useMutation({
    mutationFn: async (supplierId: string) => {
      const { error } = await supabase
        .from('suppliers')
        .delete()
        .eq('id', supplierId);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast({
        title: 'Pemasok berhasil dihapus',
        description: 'Data pemasok telah dihapus dari sistem',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Gagal menghapus pemasok',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Add debt mutation
  const addDebtMutation = useMutation({
    mutationFn: async (debt: Database['public']['Tables']['debts']['Insert']) => {
      const { data, error } = await supabase
        .from('debts')
        .insert([debt])
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts', selectedSupplier?.id] });
      setNewDebt({
        amount: '',
        description: '',
        due_date: '',
        invoice_number: `INV-SUPP-${uuidv4().slice(0, 8)}`,
      });
      setIsAddDebtOpen(false);
      toast({
        title: 'Utang berhasil ditambahkan',
        description: `Utang untuk ${selectedSupplier?.name} telah ditambahkan`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Gagal menambahkan utang',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddSupplier = () => {
    if (!newSupplier.name || !newSupplier.email || !newSupplier.phone) {
      toast({
        title: 'Data tidak lengkap',
        description: 'Mohon lengkapi nama, email, dan nomor telepon',
        variant: 'destructive',
      });
      return;
    }
    addSupplierMutation.mutate(newSupplier);
  };

  const handleEditSupplier = () => {
    if (!selectedSupplier || !canModify) return;
    updateSupplierMutation.mutate(selectedSupplier);
  };

  const handleDeleteSupplier = (supplierId: string) => {
    if (!canModify) {
      toast({
        title: 'Aksi tidak diizinkan',
        description: 'Hanya admin, manajer, atau akuntan yang dapat menghapus pemasok',
        variant: 'destructive',
      });
      return;
    }
    deleteSupplierMutation.mutate(supplierId);
  };

  const handleAddDebt = () => {
    if (!selectedSupplier || !newDebt.amount || !newDebt.due_date) {
      toast({
        title: 'Data tidak lengkap',
        description: 'Mohon lengkapi jumlah dan tanggal jatuh tempo',
        variant: 'destructive',
      });
      return;
    }
    addDebtMutation.mutate({
      supplier_id: selectedSupplier.id,
      amount: parseFloat(newDebt.amount),
      description: newDebt.description || 'Invoice',
      due_date: newDebt.due_date,
      invoice_number: newDebt.invoice_number,
      is_paid: false,
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
          <h1 className="text-2xl font-bold">Pemasok</h1>
          <p className="text-muted-foreground">Kelola data pemasok perusahaan</p>
        </div>
        <Dialog open={isAddSupplierOpen} onOpenChange={setIsAddSupplierOpen}>
          <DialogTrigger asChild>
            <Button disabled={addSupplierMutation.isPending}>
              <UserPlus className="mr-2 h-4 w-4" />
              Tambah Pemasok
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Pemasok Baru</DialogTitle>
              <DialogDescription>Masukkan informasi pemasok baru.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Nama Pemasok</label>
                <Input
                  id="name"
                  value={newSupplier.name}
                  onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                  placeholder="Nama pemasok atau perusahaan"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input
                  id="email"
                  type="email"
                  value={newSupplier.email}
                  onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
                  placeholder="email@example.com"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">Nomor Telepon</label>
                <Input
                  id="phone"
                  value={newSupplier.phone}
                  onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                  placeholder="081234567890"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="address" className="text-sm font-medium">Alamat</label>
                <Input
                  id="address"
                  value={newSupplier.address}
                  onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })}
                  placeholder="Alamat pemasok"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddSupplierOpen(false)}
                disabled={addSupplierMutation.isPending}
              >
                Batal
              </Button>
              <Button
                onClick={handleAddSupplier}
                disabled={addSupplierMutation.isPending}
              >
                {addSupplierMutation.isPending ? 'Menambahkan...' : 'Tambah Pemasok'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Daftar Pemasok</CardTitle>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Cari pemasok..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Memuat data pemasok...</div>
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
                {filteredSuppliers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Tidak ada pemasok yang ditemukan
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSuppliers.map((supplier) => (
                    <TableRow key={supplier.id}>
                      <TableCell>{supplier.name}</TableCell>
                      <TableCell>{supplier.email}</TableCell>
                      <TableCell>{supplier.phone}</TableCell>
                      <TableCell>{supplier.address || '-'}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            supplier.status === 'active'
                              ? 'bg-green-50 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {supplier.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
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
                                setSelectedSupplier(supplier);
                                setIsViewDetailsOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Lihat Detail
                            </DropdownMenuItem>
                            {canModify && (
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedSupplier(supplier);
                                  setIsEditSupplierOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Pemasok
                              </DropdownMenuItem>
                            )}
                            {canModify && (
                              <DropdownMenuItem
                                onClick={() => handleDeleteSupplier(supplier.id)}
                                className="text-red-600 focus:text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Hapus Pemasok
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

      {/* Edit Supplier Dialog */}
      <Dialog open={isEditSupplierOpen} onOpenChange={setIsEditSupplierOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Pemasok</DialogTitle>
            <DialogDescription>Perbarui informasi pemasok.</DialogDescription>
          </DialogHeader>
          {selectedSupplier && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label htmlFor="edit-name" className="text-sm font-medium">Nama Pemasok</label>
                <Input
                  id="edit-name"
                  value={selectedSupplier.name}
                  onChange={(e) =>
                    setSelectedSupplier({ ...selectedSupplier, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-email" className="text-sm font-medium">Email</label>
                <Input
                  id="edit-email"
                  type="email"
                  value={selectedSupplier.email}
                  onChange={(e) =>
                    setSelectedSupplier({ ...selectedSupplier, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-phone" className="text-sm font-medium">Nomor Telepon</label>
                <Input
                  id="edit-phone"
                  value={selectedSupplier.phone}
                  onChange={(e) =>
                    setSelectedSupplier({ ...selectedSupplier, phone: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-address" className="text-sm font-medium">Alamat</label>
                <Input
                  id="edit-address"
                  value={selectedSupplier.address || ''}
                  onChange={(e) =>
                    setSelectedSupplier({ ...selectedSupplier, address: e.target.value })
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditSupplierOpen(false)}
              disabled={updateSupplierMutation.isPending}
            >
              Batal
            </Button>
            <Button
              onClick={handleEditSupplier}
              disabled={updateSupplierMutation.isPending || !canModify}
            >
              {updateSupplierMutation.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Detail Pemasok: {selectedSupplier?.name}</DialogTitle>
            <DialogDescription>Lihat pembayaran dan utang pemasok.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Pembayaran (Pengeluaran)</CardTitle>
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
                  <CardTitle>Utang</CardTitle>
                  {canModify && (
                    <Button
                      onClick={() => setIsAddDebtOpen(true)}
                      disabled={addDebtMutation.isPending}
                    >
                      Tambah Utang
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
                    {debts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4">
                          Tidak ada utang ditemukan
                        </TableCell>
                      </TableRow>
                    ) : (
                      debts.map((debt) => (
                        <TableRow key={debt.id}>
                          <TableCell>{debt.invoice_number}</TableCell>
                          <TableCell>{debt.description}</TableCell>
                          <TableCell>Rp {debt.amount.toLocaleString('id-ID')}</TableCell>
                          <TableCell>{format(new Date(debt.due_date), 'dd/MM/yyyy')}</TableCell>
                          <TableCell>{debt.is_paid ? 'Lunas' : 'Belum Lunas'}</TableCell>
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

      {/* Add Debt Dialog */}
      <Dialog open={isAddDebtOpen} onOpenChange={setIsAddDebtOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Utang</DialogTitle>
            <DialogDescription>Tambahkan utang baru untuk {selectedSupplier?.name}.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="amount" className="text-sm font-medium">Jumlah</label>
              <Input
                id="amount"
                type="number"
                value={newDebt.amount}
                onChange={(e) => setNewDebt({ ...newDebt, amount: e.target.value })}
                placeholder="3000000"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">Deskripsi</label>
              <Input
                id="description"
                value={newDebt.description}
                onChange={(e) => setNewDebt({ ...newDebt, description: e.target.value })}
                placeholder="Invoice untuk barang"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="due_date" className="text-sm font-medium">Jatuh Tempo</label>
              <Input
                id="due_date"
                type="date"
                value={newDebt.due_date}
                onChange={(e) => setNewDebt({ ...newDebt, due_date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="invoice_number" className="text-sm font-medium">Nomor Invoice</label>
              <Input
                id="invoice_number"
                value={newDebt.invoice_number}
                onChange={(e) => setNewDebt({ ...newDebt, invoice_number: e.target.value })}
                placeholder="INV-SUPP-XXXX"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddDebtOpen(false)}
              disabled={addDebtMutation.isPending}
            >
              Batal
            </Button>
            <Button
              onClick={handleAddDebt}
              disabled={addDebtMutation.isPending}
            >
              {addDebtMutation.isPending ? 'Menambahkan...' : 'Tambah Utang'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Suppliers;