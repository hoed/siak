
import React, { useState } from 'react';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { PlusCircle, Search, Filter, Trash2, Edit, Calendar, BadgeIndianRupee, Plus, Minus } from 'lucide-react';
import { formatRupiah } from '@/utils/currency';

const dummyIncomes = [
  {
    id: '1',
    date: '2025-04-17',
    description: 'Pembayaran Invoice #INV-001',
    category: 'Penjualan',
    amount: 7500000,
    customer: 'PT Maju Jaya',
    items: [
      { name: 'Produk A', quantity: 5, price: 1000000 },
      { name: 'Produk B', quantity: 2, price: 1250000 },
    ]
  },
  {
    id: '2',
    date: '2025-04-12',
    description: 'Pembayaran Invoice #INV-002',
    category: 'Konsultasi',
    amount: 5000000,
    customer: 'CV Berkah Selalu',
    items: []
  },
  {
    id: '3',
    date: '2025-04-10',
    description: 'Pendapatan bunga bank',
    category: 'Bunga',
    amount: 250000,
    customer: '-',
    items: []
  },
  {
    id: '4',
    date: '2025-04-05',
    description: 'Pembayaran Invoice #INV-003',
    category: 'Penjualan',
    amount: 4500000,
    customer: 'PT Abadi Sentosa',
    items: [
      { name: 'Produk C', quantity: 3, price: 1500000 },
    ]
  },
  {
    id: '5',
    date: '2025-04-01',
    description: 'Pembayaran Invoice #INV-004',
    category: 'Layanan',
    amount: 6250000,
    customer: 'PT Makmur Jaya',
    items: []
  },
];

const categoryOptions = [
  'Penjualan',
  'Konsultasi',
  'Layanan',
  'Bunga',
  'Investasi',
  'Lainnya',
];

const customerOptions = [
  'PT Maju Jaya',
  'CV Berkah Selalu',
  'PT Abadi Sentosa',
  'PT Makmur Jaya',
  'PT Sejahtera',
  'CV Sukses Mandiri',
];

const productOptions = [
  { id: '1', name: 'Produk A', price: 1000000 },
  { id: '2', name: 'Produk B', price: 1250000 },
  { id: '3', name: 'Produk C', price: 1500000 },
  { id: '4', name: 'Produk D', price: 800000 },
  { id: '5', name: 'Produk E', price: 2000000 },
];

const Income: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddIncomeOpen, setIsAddIncomeOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [incomes, setIncomes] = useState(dummyIncomes);
  const [newIncome, setNewIncome] = useState({
    date: '',
    description: '',
    category: '',
    amount: '',
    customer: '',
  });
  const [itemsList, setItemsList] = useState<Array<{id: string, name: string, quantity: number, price: number}>>([]);

  const addItem = () => {
    setItemsList([...itemsList, {
      id: '',
      name: '',
      quantity: 1,
      price: 0
    }]);
  };

  const removeItem = (index: number) => {
    const updatedItems = [...itemsList];
    updatedItems.splice(index, 1);
    setItemsList(updatedItems);
  };

  const updateItem = (index: number, field: string, value: any) => {
    const updatedItems = [...itemsList];
    
    if (field === 'id' && value) {
      const selectedProduct = productOptions.find(p => p.id === value);
      if (selectedProduct) {
        updatedItems[index] = {
          ...updatedItems[index],
          id: selectedProduct.id,
          name: selectedProduct.name,
          price: selectedProduct.price
        };
      }
    } else {
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: field === 'quantity' ? parseInt(value) || 0 : value
      };
    }
    
    setItemsList(updatedItems);
    
    // Update total amount based on items
    const totalAmount = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setNewIncome({
      ...newIncome,
      amount: totalAmount.toString()
    });
  };

  const filteredIncomes = incomes.filter(income => {
    const matchesSearch = income.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         income.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         income.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? income.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const handleAddIncome = () => {
    if (!newIncome.date || !newIncome.description || !newIncome.category || !newIncome.amount) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Semua field harus diisi",
      });
      return;
    }

    const income = {
      id: Date.now().toString(),
      date: newIncome.date,
      description: newIncome.description,
      category: newIncome.category,
      amount: parseFloat(newIncome.amount),
      customer: newIncome.customer || '-',
      items: itemsList.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      }))
    };

    setIncomes([income, ...incomes]);
    setNewIncome({
      date: '',
      description: '',
      category: '',
      amount: '',
      customer: '',
    });
    setItemsList([]);
    setIsAddIncomeOpen(false);
    
    toast({
      title: "Berhasil!",
      description: "Data pendapatan berhasil ditambahkan",
    });
  };

  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);

  return (
    <MainLayout>
      <div className="pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Pendapatan</h1>
          <p className="text-muted-foreground">
            Kelola dan lihat semua data pendapatan perusahaan
          </p>
        </div>
        <Button onClick={() => setIsAddIncomeOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Tambah Pendapatan
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Ringkasan Pendapatan</CardTitle>
          <CardDescription>Ikhtisar pendapatan bulanan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-background p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground">Total Bulan Ini</p>
              <p className="text-2xl font-bold">{formatRupiah(23500000)}</p>
            </div>
            <div className="bg-background p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground">Rata-rata per Transaksi</p>
              <p className="text-2xl font-bold">{formatRupiah(4700000)}</p>
            </div>
            <div className="bg-background p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground">Pendapatan Terbesar</p>
              <p className="text-2xl font-bold">{formatRupiah(7500000)}</p>
              <p className="text-xs text-muted-foreground">Kategori: Penjualan</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Daftar Pendapatan</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari pendapatan..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter Kategori" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                {categoryOptions.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
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
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Pelanggan</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead className="text-right">Jumlah</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIncomes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      Tidak ada data pendapatan yang sesuai
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredIncomes.map((income) => (
                    <TableRow key={income.id}>
                      <TableCell>{new Date(income.date).toLocaleDateString('id-ID')}</TableCell>
                      <TableCell>{income.description}</TableCell>
                      <TableCell>{income.customer}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                          {income.category}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatRupiah(income.amount)}
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
          <p className="text-sm text-muted-foreground">Menampilkan {filteredIncomes.length} dari {incomes.length} pendapatan</p>
          <p className="text-sm font-medium">Total: {formatRupiah(totalIncome)}</p>
        </CardFooter>
      </Card>

      <Dialog open={isAddIncomeOpen} onOpenChange={setIsAddIncomeOpen}>
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle>Tambah Pendapatan Baru</DialogTitle>
            <DialogDescription>
              Masukkan detail pendapatan yang ingin dicatat.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date">Tanggal</Label>
                <div className="relative">
                  <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="date"
                    type="date"
                    className="pl-8"
                    value={newIncome.date}
                    onChange={(e) => setNewIncome({ ...newIncome, date: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="customer">Pelanggan</Label>
                <Select
                  value={newIncome.customer}
                  onValueChange={(value) => setNewIncome({ ...newIncome, customer: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih pelanggan" />
                  </SelectTrigger>
                  <SelectContent>
                    {customerOptions.map((customer) => (
                      <SelectItem key={customer} value={customer}>
                        {customer}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Input
                id="description"
                placeholder="Deskripsi pendapatan"
                value={newIncome.description}
                onChange={(e) => setNewIncome({ ...newIncome, description: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Kategori</Label>
                <Select
                  value={newIncome.category}
                  onValueChange={(value) => setNewIncome({ ...newIncome, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="amount">Jumlah</Label>
                <div className="relative">
                  <BadgeIndianRupee className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Jumlah pendapatan"
                    className="pl-8"
                    value={newIncome.amount}
                    onChange={(e) => setNewIncome({ ...newIncome, amount: e.target.value })}
                    readOnly={itemsList.length > 0}
                  />
                </div>
                {itemsList.length > 0 && (
                  <p className="text-xs text-muted-foreground">Jumlah dihitung otomatis dari item</p>
                )}
              </div>
            </div>

            {/* Items section */}
            <div className="border p-4 rounded-md mt-2">
              <div className="flex justify-between items-center mb-4">
                <Label>Item Terjual</Label>
                <Button type="button" size="sm" onClick={addItem} variant="outline">
                  <Plus className="h-4 w-4 mr-1" /> Tambah Item
                </Button>
              </div>

              {itemsList.length > 0 ? (
                <div className="space-y-4">
                  {itemsList.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-end">
                      <div className="col-span-5">
                        <Label htmlFor={`item-${index}`} className="text-xs">Produk</Label>
                        <Select
                          value={item.id}
                          onValueChange={(value) => updateItem(index, 'id', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih produk" />
                          </SelectTrigger>
                          <SelectContent>
                            {productOptions.map((product) => (
                              <SelectItem key={product.id} value={product.id}>
                                {product.name} - {formatRupiah(product.price)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor={`quantity-${index}`} className="text-xs">Qty</Label>
                        <Input
                          id={`quantity-${index}`}
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                        />
                      </div>
                      <div className="col-span-4">
                        <Label htmlFor={`price-${index}`} className="text-xs">Harga</Label>
                        <div className="relative">
                          <BadgeIndianRupee className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            id={`price-${index}`}
                            type="number"
                            className="pl-8"
                            value={item.price}
                            onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value))}
                          />
                        </div>
                      </div>
                      <div className="col-span-1">
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => removeItem(index)}
                        >
                          <Minus className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div className="pt-2 border-t flex justify-end">
                    <p className="font-medium">Total: {formatRupiah(parseFloat(newIncome.amount) || 0)}</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-center text-muted-foreground py-6">
                  Belum ada item. Klik "Tambah Item" untuk menambahkan produk yang terjual.
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddIncomeOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleAddIncome}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Income;
