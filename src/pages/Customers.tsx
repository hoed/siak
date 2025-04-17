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

type Customer = Database['public']['Tables']['customers']['Row'];

const Customers: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [isEditCustomerOpen, setIsEditCustomerOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    status: 'active' as 'active' | 'inactive',
  });

  const canModify = user?.role === 'admin' || user?.role === 'manager';

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
      setNewCustomer({
        name: '',
        email: '',
        phone: '',
        address: '',
        status: 'active',
      });
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
        description: 'Hanya admin atau manajer yang dapat menghapus pelanggan',
        variant: 'destructive',
      });
      return;
    }
    deleteCustomerMutation.mutate(customerId);
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
          <p className="text-muted-foreground">
            Kelola data pelanggan perusahaan
          </p>
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
              <DialogDescription>
                Masukkan informasi pelanggan baru.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Nama Pelanggan
                </label>
                <Input
                  id="name"
                  value={newCustomer.name}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, name: e.target.value })
                  }
                  placeholder="Nama pelanggan atau perusahaan"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, email: e.target.value })
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
                  value={newCustomer.phone}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, phone: e.target.value })
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
                  value={newCustomer.address}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, address: e.target.value })
                  }
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
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-muted-foreground"
                    >
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

      <Dialog open={isEditCustomerOpen} onOpenChange={setIsEditCustomerOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Pelanggan</DialogTitle>
            <DialogDescription>
              Perbarui informasi pelanggan.
            </DialogDescription>
          </DialogHeader>
          {selectedCustomer && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label htmlFor="edit-name" className="text-sm font-medium">
                  Nama Pelanggan
                </label>
                <Input
                  id="edit-name"
                  value={selectedCustomer.name}
                  onChange={(e) =>
                    setSelectedCustomer({
                      ...selectedCustomer,
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
                  value={selectedCustomer.email}
                  onChange={(e) =>
                    setSelectedCustomer({
                      ...selectedCustomer,
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
                  value={selectedCustomer.phone}
                  onChange={(e) =>
                    setSelectedCustomer({
                      ...selectedCustomer,
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
                  value={selectedCustomer.address || ''}
                  onChange={(e) =>
                    setSelectedCustomer({
                      ...selectedCustomer,
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
    </MainLayout>
  );
};

export default Customers;