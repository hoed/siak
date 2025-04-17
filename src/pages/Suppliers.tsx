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
import { Search, UserPlus, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Supplier = Database['public']['Tables']['suppliers']['Row'];

const Suppliers: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false);
  const [isEditSupplierOpen, setIsEditSupplierOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  const [newSupplier, setNewSupplier] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    status: 'active' as 'active' | 'inactive',
  });

  const canModify = user?.role === 'admin' || user?.role === 'manager';

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
      setNewSupplier({
        name: '',
        email: '',
        phone: '',
        address: '',
        status: 'active',
      });
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
        description: 'Hanya admin atau manajer yang dapat menghapus pemasok',
        variant: 'destructive',
      });
      return;
    }
    deleteSupplierMutation.mutate(supplierId);
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
          <p className="text-muted-foreground">
            Kelola data pemasok perusahaan
          </p>
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
              <DialogDescription>
                Masukkan informasi pemasok baru.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Nama Pemasok
                </label>
                <Input
                  id="name"
                  value={newSupplier.name}
                  onChange={(e) =>
                    setNewSupplier({ ...newSupplier, name: e.target.value })
                  }
                  placeholder="Nama pemasok atau perusahaan"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={newSupplier.email}
                  onChange={(e) =>
                    setNewSupplier({ ...newSupplier, email: e.target.value })
                  }
                  placeholder="email@example.com"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  Nomor Telepon
                </label>
                <Input
                  id="phone"
                  value={newSupplier.phone}
                  onChange={(e) =>
                    setNewSupplier({ ...newSupplier, phone: e.target.value })
                  }
                  placeholder="081234567890"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="address" className="text-sm font-medium">
                  Alamat
                </label>
                <Input
                  id="address"
                  value={newSupplier.address}
                  onChange={(e) =>
                    setNewSupplier({ ...newSupplier, address: e.target.value })
                  }
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
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-muted-foreground"
                    >
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

      <Dialog open={isEditSupplierOpen} onOpenChange={setIsEditSupplierOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Pemasok</DialogTitle>
            <DialogDescription>
              Perbarui informasi pemasok.
            </DialogDescription>
          </DialogHeader>
          {selectedSupplier && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label htmlFor="edit-name" className="text-sm font-medium">
                  Nama Pemasok
                </label>
                <Input
                  id="edit-name"
                  value={selectedSupplier.name}
                  onChange={(e) =>
                    setSelectedSupplier({
                      ...selectedSupplier,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="edit-email"
                  type="email"
                  value={selectedSupplier.email}
                  onChange={(e) =>
                    setSelectedSupplier({
                      ...selectedSupplier,
                      email: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-phone" className="text-sm font-medium">
                  Nomor Telepon
                </label>
                <Input
                  id="edit-phone"
                  value={selectedSupplier.phone}
                  onChange={(e) =>
                    setSelectedSupplier({
                      ...selectedSupplier,
                      phone: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-address" className="text-sm font-medium">
                  Alamat
                </label>
                <Input
                  id="edit-address"
                  value={selectedSupplier.address || ''}
                  onChange={(e) =>
                    setSelectedSupplier({
                      ...selectedSupplier,
                      address: e.target.value,
                    })
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
    </MainLayout>
  );
};

export default Suppliers;