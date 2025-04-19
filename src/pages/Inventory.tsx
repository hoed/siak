
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  AlertCircle, ArrowDownUp, Download, Filter, Plus, Printer, 
  Search, RotateCcw, ShoppingCart, Package, Trash2, Edit, Info
} from 'lucide-react';
import { toast } from 'sonner';
import { getInventoryItems, updateInventoryItem, deleteInventoryItem, createInventoryItem } from '@/services/inventoryService';
import { BaseInventoryItem, InventoryItem, convertToFoodInventoryItem, convertFromFoodInventoryItem } from '@/types/common-inventory';
import { InventoryItemType as FoodInventoryItemType } from '@/types/food-manufacturing';

type InventoryItemType = 'all' | 'product' | 'ingredient' | 'asset';

const Inventory: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<InventoryItemType>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<BaseInventoryItem | null>(null);
  const [newItem, setNewItem] = useState<Partial<BaseInventoryItem>>({
    name: '',
    sku: '',
    description: '',
    category: '',
    quantity: 0,
    unitPrice: 0,
    costPrice: 0,
    minimumStock: 0,
    isActive: true
  });

  const queryClient = useQueryClient();

  const { data: itemsData = [], isLoading } = useQuery({
    queryKey: ['inventoryItems'],
    queryFn: getInventoryItems
  });

  const items: BaseInventoryItem[] = itemsData.map((item: any) => 
    'itemType' in item ? convertFromFoodInventoryItem(item as InventoryItem) : item
  );

  const createMutation = useMutation({
    mutationFn: (newItem: BaseInventoryItem) => {
      const convertedItem = convertToFoodInventoryItem(newItem);
      return createInventoryItem(convertedItem);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventoryItems'] });
      setIsAddDialogOpen(false);
      resetForm();
      toast.success('Produk berhasil ditambahkan');
    },
    onError: (error) => {
      console.error('Error creating item:', error);
      toast.error('Gagal menambahkan produk');
    }
  });

  const updateMutation = useMutation({
    mutationFn: (item: InventoryItem) => updateInventoryItem(item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventoryItems'] });
      setIsAddDialogOpen(false);
      setSelectedItem(null);
      toast.success('Produk berhasil diperbarui');
    },
    onError: (error) => {
      toast.error(`Gagal memperbarui produk: ${error.message}`);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteInventoryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventoryItems'] });
      setIsDeleteDialogOpen(false);
      toast.success('Produk berhasil dihapus');
    },
    onError: (error) => {
      toast.error(`Gagal menghapus produk: ${error.message}`);
    }
  });

  const filteredItems = items.filter((item: BaseInventoryItem) => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (activeTab === 'all') return matchesSearch;
    
    if (activeTab === 'product') {
      return matchesSearch && item.category === 'Produk';
    } else if (activeTab === 'ingredient') {
      return matchesSearch && item.category === 'Bahan Baku';
    } else if (activeTab === 'asset') {
      return matchesSearch && item.category === 'Aset';
    }
    
    return false;
  });

  const handleAddItem = () => {
    if (!newItem.name || !newItem.sku || !newItem.unitPrice) {
      toast.error('Harap isi semua bidang yang wajib');
      return;
    }

    const itemData: BaseInventoryItem = {
      id: selectedItem?.id || '',
      name: newItem.name || '',
      sku: newItem.sku || '',
      description: newItem.description || '',
      category: newItem.category || 'Produk', // Default to 'Produk' if category is not specified
      quantity: Number(newItem.quantity) || 0,
      unitPrice: Number(newItem.unitPrice) || 0,
      costPrice: Number(newItem.costPrice) || 0,
      minimumStock: Number(newItem.minimumStock) || 0,
      isActive: newItem.isActive !== undefined ? newItem.isActive : true,
      createdAt: selectedItem?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (selectedItem) {
      const convertedItem = convertToFoodInventoryItem(itemData);
      updateMutation.mutate(convertedItem);
    } else {
      createMutation.mutate(itemData);
    }
  };

  const handleEdit = (item: BaseInventoryItem) => {
    setSelectedItem(item);
    setNewItem({
      name: item.name,
      sku: item.sku,
      description: item.description || '',
      category: item.category || '',
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      costPrice: item.costPrice,
      minimumStock: item.minimumStock || 0,
      isActive: item.isActive
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = (item: BaseInventoryItem) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedItem) {
      deleteMutation.mutate(selectedItem.id);
    }
  };

  const resetForm = () => {
    setNewItem({
      name: '',
      sku: '',
      description: '',
      category: '',
      quantity: 0,
      unitPrice: 0,
      costPrice: 0,
      minimumStock: 0,
      isActive: true
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getCategoryIcon = (category?: string) => {
    if (category === 'Produk') return <ShoppingCart size={16} />;
    if (category === 'Bahan Baku') return <Package size={16} />;
    return <Info size={16} />;
  };

  const getLowStockItems = () => {
    return items.filter((item: BaseInventoryItem) => 
      item.minimumStock !== undefined && 
      item.quantity <= (item.minimumStock || 0)
    );
  };

  return (
    <MainLayout>
      <div className="pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Inventory</h1>
          <p className="text-muted-foreground">
            Kelola produk, bahan baku, dan aset
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Cetak
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Ekspor
          </Button>
          <Button onClick={() => {
            setSelectedItem(null);
            resetForm();
            setIsAddDialogOpen(true);
          }}>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Item
          </Button>
        </div>
      </div>

      {getLowStockItems().length > 0 && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Peringatan Stok Rendah</AlertTitle>
          <AlertDescription>
            {getLowStockItems().length} item memiliki stok di bawah batas minimum.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <CardTitle>Daftar Inventaris</CardTitle>
              <CardDescription>
                Kelola semua item dalam inventaris
              </CardDescription>
            </div>
            <div className="w-full md:w-auto mt-4 md:mt-0">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari item..."
                  className="pl-8 w-full md:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as InventoryItemType)}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">Semua Item</TabsTrigger>
              <TabsTrigger value="product">Produk</TabsTrigger>
              <TabsTrigger value="ingredient">Bahan Baku</TabsTrigger>
              <TabsTrigger value="asset">Aset</TabsTrigger>
            </TabsList>
            <TabsContent value={activeTab}>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Kategori</TableHead>
                      <TableHead className="text-right">Stok</TableHead>
                      <TableHead className="text-right">Harga Jual</TableHead>
                      <TableHead className="text-right">Harga Beli</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-center">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          Memuat data...
                        </TableCell>
                      </TableRow>
                    ) : filteredItems.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          Tidak ada data yang ditemukan.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredItems.map((item: BaseInventoryItem) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{item.sku}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getCategoryIcon(item.category)}
                              <span>{item.category || '-'}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <span className={
                              item.minimumStock !== undefined && 
                              item.quantity <= (item.minimumStock || 0) 
                                ? 'text-red-500 font-semibold' 
                                : ''
                            }>
                              {item.quantity}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.costPrice)}</TableCell>
                          <TableCell className="text-center">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              item.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {item.isActive ? 'Aktif' : 'Tidak Aktif'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-center space-x-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleEdit(item)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-red-500"
                                onClick={() => handleDelete(item)}
                              >
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
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Menampilkan {filteredItems.length} dari {items.length} item
          </div>
        </CardFooter>
      </Card>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{selectedItem ? 'Edit Item' : 'Tambah Item Baru'}</DialogTitle>
            <DialogDescription>
              {selectedItem 
                ? 'Edit detail item inventaris' 
                : 'Isi detail untuk menambahkan item baru ke inventaris'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nama Item*</Label>
                <Input
                  id="name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sku">SKU*</Label>
                <Input
                  id="sku"
                  value={newItem.sku}
                  onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Kategori</Label>
              <Select
                value={newItem.category}
                onValueChange={(value) => setNewItem({ ...newItem, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Produk">Produk</SelectItem>
                  <SelectItem value="Bahan Baku">Bahan Baku</SelectItem>
                  <SelectItem value="Aset">Aset</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="quantity">Stok</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="0"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="minimumStock">Stok Minimum</Label>
                <Input
                  id="minimumStock"
                  type="number"
                  min="0"
                  value={newItem.minimumStock}
                  onChange={(e) => setNewItem({ ...newItem, minimumStock: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="unitPrice">Harga Jual*</Label>
                <Input
                  id="unitPrice"
                  type="number"
                  min="0"
                  value={newItem.unitPrice}
                  onChange={(e) => setNewItem({ ...newItem, unitPrice: Number(e.target.value) })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="costPrice">Harga Beli</Label>
                <Input
                  id="costPrice"
                  type="number"
                  min="0"
                  value={newItem.costPrice}
                  onChange={(e) => setNewItem({ ...newItem, costPrice: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                checked={newItem.isActive}
                onCheckedChange={(checked) => 
                  setNewItem({ ...newItem, isActive: checked === true })
                }
              />
              <Label htmlFor="isActive">Item Aktif</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddDialogOpen(false);
                setSelectedItem(null);
                resetForm();
              }}
            >
              Batal
            </Button>
            <Button onClick={handleAddItem}>
              {selectedItem ? 'Simpan Perubahan' : 'Tambah Item'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus item "{selectedItem?.name}"? 
              Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Batal
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
            >
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Inventory;
