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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Package, MoreHorizontal, Edit, Trash2, Plus, Truck, Users, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  getInventoryItems, 
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  getInventoryTransactions,
  createInventoryTransaction
} from '@/services/inventoryService';
import { InventoryItem, InventoryTransaction } from '@/types/inventory';
import { useToast } from '@/hooks/use-toast';

const Inventory: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('items');
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [isEditItemOpen, setIsEditItemOpen] = useState(false);
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const [newItem, setNewItem] = useState<Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    sku: '',
    description: '',
    category: '',
    quantity: 0,
    unitPrice: 0,
    costPrice: 0,
    minimumStock: 5,
    location: '',
  });

  const [newTransaction, setNewTransaction] = useState<Omit<InventoryTransaction, 'id' | 'createdAt' | 'updatedAt'>>({
    itemId: '',
    type: 'purchase',
    quantity: 1,
    unitPrice: 0,
    totalPrice: 0,
    date: new Date().toISOString().split('T')[0],
    reference: '',
    notes: '',
  });

  const canModify = user?.role === 'admin' || user?.role === 'manager';

  // Fetch inventory items
  const { 
    data: inventoryItems = [], 
    isLoading: itemsLoading, 
    error: itemsError 
  } = useQuery({
    queryKey: ['inventoryItems'],
    queryFn: getInventoryItems,
  });

  // Fetch inventory transactions
  const { 
    data: inventoryTransactions = [], 
    isLoading: transactionsLoading, 
    error: transactionsError 
  } = useQuery({
    queryKey: ['inventoryTransactions'],
    queryFn: getInventoryTransactions,
  });

  // Add inventory item mutation
  const addItemMutation = useMutation({
    mutationFn: createInventoryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventoryItems'] });
      setNewItem({
        name: '',
        sku: '',
        description: '',
        category: '',
        quantity: 0,
        unitPrice: 0,
        costPrice: 0,
        minimumStock: 5,
        location: '',
      });
      setIsAddItemOpen(false);
      toast({
        title: 'Item berhasil ditambahkan',
        description: `Item ${newItem.name} telah ditambahkan ke inventaris`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Gagal menambahkan item',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Update inventory item mutation
  const updateItemMutation = useMutation({
    mutationFn: updateInventoryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventoryItems'] });
      setIsEditItemOpen(false);
      toast({
        title: 'Item berhasil diperbarui',
        description: `Data item ${selectedItem?.name} telah diperbarui`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Gagal memperbarui item',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Delete inventory item mutation
  const deleteItemMutation = useMutation({
    mutationFn: deleteInventoryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventoryItems'] });
      toast({
        title: 'Item berhasil dihapus',
        description: 'Data item telah dihapus dari inventaris',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Gagal menghapus item',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Add inventory transaction mutation
  const addTransactionMutation = useMutation({
    mutationFn: createInventoryTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventoryTransactions'] });
      queryClient.invalidateQueries({ queryKey: ['inventoryItems'] });
      setNewTransaction({
        itemId: '',
        type: 'purchase',
        quantity: 1,
        unitPrice: 0,
        totalPrice: 0,
        date: new Date().toISOString().split('T')[0],
        reference: '',
        notes: '',
      });
      setIsAddTransactionOpen(false);
      toast({
        title: 'Transaksi berhasil ditambahkan',
        description: 'Transaksi inventaris telah dicatat',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Gagal menambahkan transaksi',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const filteredItems = inventoryItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredTransactions = inventoryTransactions.filter(
    (transaction) =>
      transaction.reference?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddItem = () => {
    if (!newItem.name || !newItem.sku) {
      toast({
        title: 'Data tidak lengkap',
        description: 'Mohon lengkapi nama dan SKU item',
        variant: 'destructive',
      });
      return;
    }

    addItemMutation.mutate(newItem);
  };

  const handleEditItem = () => {
    if (!selectedItem || !canModify) return;
    updateItemMutation.mutate(selectedItem);
  };

  const handleDeleteItem = (itemId: string) => {
    if (!canModify) {
      toast({
        title: 'Aksi tidak diizinkan',
        description: 'Hanya admin atau manajer yang dapat menghapus item',
        variant: 'destructive',
      });
      return;
    }
    deleteItemMutation.mutate(itemId);
  };

  const handleAddTransaction = () => {
    if (!newTransaction.itemId || newTransaction.quantity <= 0) {
      toast({
        title: 'Data tidak lengkap',
        description: 'Mohon pilih item dan masukkan jumlah yang valid',
        variant: 'destructive',
      });
      return;
    }

    // Calculate total price if not set
    if (newTransaction.totalPrice <= 0) {
      newTransaction.totalPrice = newTransaction.quantity * newTransaction.unitPrice;
    }

    addTransactionMutation.mutate(newTransaction);
  };

  const updateTotalPrice = () => {
    setNewTransaction({
      ...newTransaction,
      totalPrice: newTransaction.quantity * newTransaction.unitPrice
    });
  };

  const getTransactionTypeDisplayName = (type: string) => {
    switch (type) {
      case 'purchase': return 'Pembelian';
      case 'sale': return 'Penjualan';
      case 'adjustment': return 'Penyesuaian';
      case 'return': return 'Pengembalian';
      default: return type;
    }
  };

  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case 'purchase': return <Truck className="h-4 w-4 text-blue-500" />;
      case 'sale': return <ShoppingCart className="h-4 w-4 text-green-500" />;
      case 'adjustment': return <Edit className="h-4 w-4 text-amber-500" />;
      case 'return': return <Package className="h-4 w-4 text-red-500" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  if (itemsError || transactionsError) {
    return (
      <MainLayout>
        <div className="text-red-500">
          Error: {(itemsError as Error)?.message || (transactionsError as Error)?.message}
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Inventaris</h1>
          <p className="text-muted-foreground">
            Kelola inventaris dan stok barang
          </p>
        </div>
        <div className="flex gap-2">
          {activeTab === 'items' ? (
            <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
              <DialogTrigger asChild>
                <Button disabled={addItemMutation.isPending || !canModify}>
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Item
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Tambah Item Baru</DialogTitle>
                  <DialogDescription>
                    Masukkan informasi item inventaris baru.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Nama Item *
                      </label>
                      <Input
                        id="name"
                        value={newItem.name}
                        onChange={(e) =>
                          setNewItem({ ...newItem, name: e.target.value })
                        }
                        placeholder="Nama item"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="sku" className="text-sm font-medium">
                        SKU *
                      </label>
                      <Input
                        id="sku"
                        value={newItem.sku}
                        onChange={(e) =>
                          setNewItem({ ...newItem, sku: e.target.value })
                        }
                        placeholder="SKU-001"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium">
                      Deskripsi
                    </label>
                    <Input
                      id="description"
                      value={newItem.description || ''}
                      onChange={(e) =>
                        setNewItem({ ...newItem, description: e.target.value })
                      }
                      placeholder="Deskripsi item"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="category" className="text-sm font-medium">
                        Kategori
                      </label>
                      <Input
                        id="category"
                        value={newItem.category || ''}
                        onChange={(e) =>
                          setNewItem({ ...newItem, category: e.target.value })
                        }
                        placeholder="Kategori"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="location" className="text-sm font-medium">
                        Lokasi
                      </label>
                      <Input
                        id="location"
                        value={newItem.location || ''}
                        onChange={(e) =>
                          setNewItem({ ...newItem, location: e.target.value })
                        }
                        placeholder="Lokasi penyimpanan"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="quantity" className="text-sm font-medium">
                        Jumlah Awal
                      </label>
                      <Input
                        id="quantity"
                        type="number"
                        value={newItem.quantity}
                        onChange={(e) =>
                          setNewItem({ ...newItem, quantity: Number(e.target.value) })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="minimumStock" className="text-sm font-medium">
                        Stok Minimum
                      </label>
                      <Input
                        id="minimumStock"
                        type="number"
                        value={newItem.minimumStock || 0}
                        onChange={(e) =>
                          setNewItem({ ...newItem, minimumStock: Number(e.target.value) })
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="costPrice" className="text-sm font-medium">
                        Harga Modal
                      </label>
                      <Input
                        id="costPrice"
                        type="number"
                        value={newItem.costPrice}
                        onChange={(e) =>
                          setNewItem({ ...newItem, costPrice: Number(e.target.value) })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="unitPrice" className="text-sm font-medium">
                        Harga Jual
                      </label>
                      <Input
                        id="unitPrice"
                        type="number"
                        value={newItem.unitPrice}
                        onChange={(e) =>
                          setNewItem({ ...newItem, unitPrice: Number(e.target.value) })
                        }
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddItemOpen(false)}
                    disabled={addItemMutation.isPending}
                  >
                    Batal
                  </Button>
                  <Button
                    onClick={handleAddItem}
                    disabled={addItemMutation.isPending}
                  >
                    {addItemMutation.isPending ? 'Menambahkan...' : 'Tambah Item'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ) : (
            <Dialog open={isAddTransactionOpen} onOpenChange={setIsAddTransactionOpen}>
              <DialogTrigger asChild>
                <Button disabled={addTransactionMutation.isPending || !canModify}>
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Transaksi
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Tambah Transaksi Baru</DialogTitle>
                  <DialogDescription>
                    Catat transaksi inventaris baru.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <label htmlFor="itemId" className="text-sm font-medium">
                      Item *
                    </label>
                    <select
                      id="itemId"
                      className="w-full px-3 py-2 border rounded-md"
                      value={newTransaction.itemId}
                      onChange={(e) => {
                        const selectedItem = inventoryItems.find(item => item.id === e.target.value);
                        setNewTransaction({ 
                          ...newTransaction, 
                          itemId: e.target.value,
                          unitPrice: selectedItem ? selectedItem.unitPrice : 0
                        });
                        setTimeout(() => updateTotalPrice(), 0);
                      }}
                    >
                      <option value="">Pilih Item</option>
                      {inventoryItems.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name} ({item.sku})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="type" className="text-sm font-medium">
                      Tipe Transaksi *
                    </label>
                    <select
                      id="type"
                      className="w-full px-3 py-2 border rounded-md"
                      value={newTransaction.type}
                      onChange={(e) => 
                        setNewTransaction({ 
                          ...newTransaction, 
                          type: e.target.value as any
                        })
                      }
                    >
                      <option value="purchase">Pembelian</option>
                      <option value="sale">Penjualan</option>
                      <option value="adjustment">Penyesuaian</option>
                      <option value="return">Pengembalian</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="quantity" className="text-sm font-medium">
                        Jumlah *
                      </label>
                      <Input
                        id="quantity"
                        type="number"
                        value={newTransaction.quantity}
                        onChange={(e) => {
                          setNewTransaction({ 
                            ...newTransaction, 
                            quantity: Number(e.target.value) 
                          });
                          setTimeout(() => updateTotalPrice(), 0);
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="unitPrice" className="text-sm font-medium">
                        Harga Satuan *
                      </label>
                      <Input
                        id="unitPrice"
                        type="number"
                        value={newTransaction.unitPrice}
                        onChange={(e) => {
                          setNewTransaction({ 
                            ...newTransaction, 
                            unitPrice: Number(e.target.value) 
                          });
                          setTimeout(() => updateTotalPrice(), 0);
                        }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="totalPrice" className="text-sm font-medium">
                      Total Harga
                    </label>
                    <Input
                      id="totalPrice"
                      type="number"
                      value={newTransaction.totalPrice}
                      onChange={(e) =>
                        setNewTransaction({ ...newTransaction, totalPrice: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="date" className="text-sm font-medium">
                      Tanggal *
                    </label>
                    <Input
                      id="date"
                      type="date"
                      value={newTransaction.date}
                      onChange={(e) =>
                        setNewTransaction({ ...newTransaction, date: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="reference" className="text-sm font-medium">
                      Referensi
                    </label>
                    <Input
                      id="reference"
                      value={newTransaction.reference || ''}
                      onChange={(e) =>
                        setNewTransaction({ ...newTransaction, reference: e.target.value })
                      }
                      placeholder="No. Referensi/Faktur"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="notes" className="text-sm font-medium">
                      Catatan
                    </label>
                    <Input
                      id="notes"
                      value={newTransaction.notes || ''}
                      onChange={(e) =>
                        setNewTransaction({ ...newTransaction, notes: e.target.value })
                      }
                      placeholder="Catatan tambahan"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddTransactionOpen(false)}
                    disabled={addTransactionMutation.isPending}
                  >
                    Batal
                  </Button>
                  <Button
                    onClick={handleAddTransaction}
                    disabled={addTransactionMutation.isPending}
                  >
                    {addTransactionMutation.isPending ? 'Menyimpan...' : 'Simpan Transaksi'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Tabs 
              defaultValue="items" 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="items" className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    <span>Daftar Item</span>
                  </TabsTrigger>
                  <TabsTrigger value="transactions" className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    <span>Transaksi</span>
                  </TabsTrigger>
                </TabsList>
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder={
                      activeTab === 'items' 
                        ? "Cari item inventaris..." 
                        : "Cari transaksi..."
                    }
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>

              <TabsContent value="items" className="space-y-4">
                {itemsLoading ? (
                  <div className="text-center py-8">Memuat data inventaris...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nama Item</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Kategori</TableHead>
                        <TableHead>Stok</TableHead>
                        <TableHead>Harga Modal</TableHead>
                        <TableHead>Harga Jual</TableHead>
                        <TableHead>Lokasi</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredItems.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={8}
                            className="text-center py-8 text-muted-foreground"
                          >
                            Tidak ada item inventaris yang ditemukan
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.sku}</TableCell>
                            <TableCell>{item.category || '-'}</TableCell>
                            <TableCell>
                              <span
                                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                  (item.minimumStock && item.quantity <= item.minimumStock)
                                    ? 'bg-red-50 text-red-700'
                                    : 'bg-green-50 text-green-700'
                                }`}
                              >
                                {item.quantity}
                              </span>
                            </TableCell>
                            <TableCell>{new Intl.NumberFormat('id-ID').format(item.costPrice)}</TableCell>
                            <TableCell>{new Intl.NumberFormat('id-ID').format(item.unitPrice)}</TableCell>
                            <TableCell>{item.location || '-'}</TableCell>
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
                                        setSelectedItem(item);
                                        setIsEditItemOpen(true);
                                      }}
                                    >
                                      <Edit className="h-4 w-4 mr-2" />
                                      Edit Item
                                    </DropdownMenuItem>
                                  )}
                                  {canModify && (
                                    <DropdownMenuItem
                                      onClick={() => handleDeleteItem(item.id)}
                                      className="text-red-600 focus:text-red-600"
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Hapus Item
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
              </TabsContent>

              <TabsContent value="transactions" className="space-y-4">
                {transactionsLoading ? (
                  <div className="text-center py-8">Memuat data transaksi...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Tipe</TableHead>
                        <TableHead>Item</TableHead>
                        <TableHead>Jumlah</TableHead>
                        <TableHead>Harga Satuan</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Referensi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={7}
                            className="text-center py-8 text-muted-foreground"
                          >
                            Tidak ada transaksi yang ditemukan
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredTransactions.map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell>
                              {new Date(transaction.date).toLocaleDateString('id-ID')}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {getTransactionTypeIcon(transaction.type)}
                                <span>{getTransactionTypeDisplayName(transaction.type)}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {inventoryItems.find(item => item.id === transaction.itemId)?.name || transaction.itemId}
                            </TableCell>
                            <TableCell>{transaction.quantity}</TableCell>
                            <TableCell>{new Intl.NumberFormat('id-ID').format(transaction.unitPrice)}</TableCell>
                            <TableCell>{new Intl.NumberFormat('id-ID').format(transaction.totalPrice)}</TableCell>
                            <TableCell>{transaction.reference || '-'}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </CardHeader>
      </Card>

      <Dialog open={isEditItemOpen} onOpenChange={setIsEditItemOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
            <DialogDescription>
              Perbarui informasi item inventaris.
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="edit-name" className="text-sm font-medium">
                    Nama Item
                  </label>
                  <Input
                    id="edit-name"
                    value={selectedItem.name}
                    onChange={(e) =>
                      setSelectedItem({
                        ...selectedItem,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-sku" className="text-sm font-medium">
                    SKU
                  </label>
                  <Input
                    id="edit-sku"
                    value={selectedItem.sku}
                    onChange={(e) =>
                      setSelectedItem({
                        ...selectedItem,
                        sku: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-description" className="text-sm font-medium">
                  Deskripsi
                </label>
                <Input
                  id="edit-description"
                  value={selectedItem.description || ''}
                  onChange={(e) =>
                    setSelectedItem({
                      ...selectedItem,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="edit-category" className="text-sm font-medium">
                    Kategori
                  </label>
                  <Input
                    id="edit-category"
                    value={selectedItem.category || ''}
                    onChange={(e) =>
                      setSelectedItem({
                        ...selectedItem,
                        category: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-location" className="text-sm font-medium">
                    Lokasi
                  </label>
                  <Input
                    id="edit-location"
                    value={selectedItem.location || ''}
                    onChange={(e) =>
                      setSelectedItem({
                        ...selectedItem,
                        location: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="edit-quantity" className="text-sm font-medium">
                    Jumlah
                  </label>
                  <Input
                    id="edit-quantity"
                    type="number"
                    value={selectedItem.quantity}
                    onChange={(e) =>
                      setSelectedItem({
                        ...selectedItem,
                        quantity: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-minimumStock" className="text-sm font-medium">
                    Stok Minimum
                  </label>
                  <Input
                    id="edit-minimumStock"
                    type="number"
                    value={selectedItem.minimumStock || 0}
                    onChange={(e) =>
                      setSelectedItem({
                        ...selectedItem,
                        minimumStock: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="edit-costPrice" className="text-sm font-medium">
                    Harga Modal
                  </label>
                  <Input
                    id="edit-costPrice"
                    type="number"
                    value={selectedItem.costPrice}
                    onChange={(e) =>
                      setSelectedItem({
                        ...selectedItem,
                        costPrice: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-unitPrice" className="text-sm font-medium">
                    Harga Jual
                  </label>
                  <Input
                    id="edit-unitPrice"
                    type="number"
                    value={selectedItem.unitPrice}
                    onChange={(e) =>
                      setSelectedItem({
                        ...selectedItem,
                        unitPrice: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditItemOpen(false)}
              disabled={updateItemMutation.isPending}
            >
              Batal
            </Button>
            <Button
              onClick={handleEditItem}
              disabled={updateItemMutation.isPending}
            >
              {updateItemMutation.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Inventory;
