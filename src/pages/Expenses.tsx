
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

const dummyExpenses = [
  {
    id: '1',
    date: '2025-04-15',
    description: 'Pembayaran gaji karyawan',
    category: 'Gaji',
    amount: 5000000,
    supplier: '',
    items: []
  },
  {
    id: '2',
    date: '2025-04-12',
    description: 'Pembayaran sewa kantor',
    category: 'Sewa',
    amount: 3500000,
    supplier: '',
    items: []
  },
  {
    id: '3',
    date: '2025-04-10',
    description: 'Pembelian alat tulis kantor',
    category: 'Perlengkapan',
    amount: 450000,
    supplier: 'PT Maju Stationery',
    items: [
      { name: 'Kertas HVS A4', quantity: 10, price: 45000 }
    ]
  },
  {
    id: '4',
    date: '2025-04-08',
    description: 'Pembayaran tagihan listrik',
    category: 'Utilitas',
    amount: 750000,
    supplier: 'PLN',
    items: []
  },
  {
    id: '5',
    date: '2025-04-05',
    description: 'Pembayaran tagihan internet',
    category: 'Utilitas',
    amount: 500000,
    supplier: 'PT Internet Cepat',
    items: []
  },
];

const categoryOptions = [
  'Gaji',
  'Sewa',
  'Perlengkapan',
  'Utilitas',
  'Transportasi',
  'Pemasaran',
  'Lainnya',
];

const supplierOptions = [
  'PT Maju Stationery',
  'PLN',
  'PT Internet Cepat',
  'PT Distribusi Prima',
  'CV Supplier Utama',
  'PT Logistik Cepat',
];

const inventoryItems = [
  { id: '1', name: 'Kertas HVS A4', price: 45000 },
  { id: '2', name: 'Tinta Printer', price: 85000 },
  { id: '3', name: 'Pulpen', price: 5000 },
  { id: '4', name: 'Amplop', price: 15000 },
  { id: '5', name: 'Map File', price: 20000 },
];

const Expenses: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [expenses, setExpenses] = useState(dummyExpenses);
  const [newExpense, setNewExpense] = useState({
    date: '',
    description: '',
    category: '',
    amount: '',
    supplier: '',
  });
  const [purchaseItems, setPurchaseItems] = useState<Array<{id: string, name: string, quantity: number, price: number}>>([]);

  const addItem = () => {
    setPurchaseItems([...purchaseItems, {
      id: '',
      name: '',
      quantity: 1,
      price: 0
    }]);
  };

  const removeItem = (index: number) => {
    const updatedItems = [...purchaseItems];
    updatedItems.splice(index, 1);
    setPurchaseItems(updatedItems);
  };

  const updateItem = (index: number, field: string, value: any) => {
    const updatedItems = [...purchaseItems];
    
    if (field === 'id' && value) {
      const selectedItem = inventoryItems.find(p => p.id === value);
      if (selectedItem) {
        updatedItems[index] = {
          ...updatedItems[index],
          id: selectedItem.id,
          name: selectedItem.name,
          price: selectedItem.price
        };
      }
    } else {
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: field === 'quantity' ? parseInt(value) || 0 : value
      };
    }
    
    setPurchaseItems(updatedItems);
    
    // Update total amount based on items
    const totalAmount = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setNewExpense({
      ...newExpense,
      amount: totalAmount.toString()
    });
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (expense.supplier && expense.supplier.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory ? expense.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const handleAddExpense = () => {
    if (!newExpense.date || !newExpense.description || !newExpense.category || !newExpense.amount) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Semua field harus diisi",
      });
      return;
    }

    const expense = {
      id: Date.now().toString(),
      date: newExpense.date,
      description: newExpense.description,
      category: newExpense.category,
      amount: parseFloat(newExpense.amount),
      supplier: newExpense.supplier || '',
      items: purchaseItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      }))
    };

    setExpenses([expense, ...expenses]);
    setNewExpense({
      date: '',
      description: '',
      category: '',
      amount: '',
      supplier: '',
    });
    setPurchaseItems([]);
    setIsAddExpenseOpen(false);
    
    toast({
      title: "Berhasil!",
      description: "Data pengeluaran berhasil ditambahkan",
    });
  };

  return (
    <MainLayout>
      <div className="pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Pengeluaran</h1>
          <p className="text-muted-foreground">
            Kelola dan lihat semua data pengeluaran perusahaan
          </p>
        </div>
        <Button onClick={() => setIsAddExpenseOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Tambah Pengeluaran
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Ringkasan Pengeluaran</CardTitle>
          <CardDescription>Ikhtisar pengeluaran bulanan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-background p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground">Total Bulan Ini</p>
              <p className="text-2xl font-bold">{formatRupiah(10200000)}</p>
            </div>
            <div className="bg-background p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground">Rata-rata per Hari</p>
              <p className="text-2xl font-bold">{formatRupiah(340000)}</p>
            </div>
            <div className="bg-background p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground">Pengeluaran Terbesar</p>
              <p className="text-2xl font-bold">{formatRupiah(5000000)}</p>
              <p className="text-xs text-muted-foreground">Kategori: Gaji</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Daftar Pengeluaran</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari pengeluaran..."
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
                  <TableHead>Kategori</TableHead>
                  <TableHead>Pemasok</TableHead>
                  <TableHead className="text-right">Jumlah</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExpenses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      Tidak ada data pengeluaran yang sesuai
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredExpenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>{new Date(expense.date).toLocaleDateString('id-ID')}</TableCell>
                      <TableCell>{expense.description}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                          {expense.category}
                        </span>
                      </TableCell>
                      <TableCell>{expense.supplier || '-'}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatRupiah(expense.amount)}
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
          <p className="text-sm text-muted-foreground">Menampilkan {filteredExpenses.length} dari {expenses.length} pengeluaran</p>
        </CardFooter>
      </Card>

      <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle>Tambah Pengeluaran Baru</DialogTitle>
            <DialogDescription>
              Masukkan detail pengeluaran yang ingin dicatat.
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
                    value={newExpense.date}
                    onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="supplier">Pemasok</Label>
                <Select
                  value={newExpense.supplier}
                  onValueChange={(value) => setNewExpense({ ...newExpense, supplier: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih pemasok (opsional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {supplierOptions.map((supplier) => (
                      <SelectItem key={supplier} value={supplier}>
                        {supplier}
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
                placeholder="Deskripsi pengeluaran"
                value={newExpense.description}
                onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Kategori</Label>
                <Select
                  value={newExpense.category}
                  onValueChange={(value) => setNewExpense({ ...newExpense, category: value })}
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
                    placeholder="Jumlah pengeluaran"
                    className="pl-8"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                    readOnly={purchaseItems.length > 0}
                  />
                </div>
                {purchaseItems.length > 0 && (
                  <p className="text-xs text-muted-foreground">Jumlah dihitung otomatis dari item</p>
                )}
              </div>
            </div>

            {/* Purchase Items section */}
            <div className="border p-4 rounded-md mt-2">
              <div className="flex justify-between items-center mb-4">
                <Label>Item Pembelian</Label>
                <Button type="button" size="sm" onClick={addItem} variant="outline">
                  <Plus className="h-4 w-4 mr-1" /> Tambah Item
                </Button>
              </div>

              {purchaseItems.length > 0 ? (
                <div className="space-y-4">
                  {purchaseItems.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-end">
                      <div className="col-span-5">
                        <Label htmlFor={`item-${index}`} className="text-xs">Item</Label>
                        <Select
                          value={item.id}
                          onValueChange={(value) => updateItem(index, 'id', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih item" />
                          </SelectTrigger>
                          <SelectContent>
                            {inventoryItems.map((invItem) => (
                              <SelectItem key={invItem.id} value={invItem.id}>
                                {invItem.name} - {formatRupiah(invItem.price)}
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
                    <p className="font-medium">Total: {formatRupiah(parseFloat(newExpense.amount) || 0)}</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-center text-muted-foreground py-6">
                  Belum ada item. Klik "Tambah Item" untuk menambahkan item yang dibeli.
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddExpenseOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleAddExpense}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Expenses;
