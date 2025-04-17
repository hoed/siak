
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
import { PlusCircle, Search, Filter, Trash2, Edit, Calendar, DollarSign } from 'lucide-react';

const dummyIncomes = [
  {
    id: '1',
    date: '2025-04-17',
    description: 'Pembayaran Invoice #INV-001',
    category: 'Penjualan',
    amount: 7500000,
  },
  {
    id: '2',
    date: '2025-04-12',
    description: 'Pembayaran Invoice #INV-002',
    category: 'Konsultasi',
    amount: 5000000,
  },
  {
    id: '3',
    date: '2025-04-10',
    description: 'Pendapatan bunga bank',
    category: 'Bunga',
    amount: 250000,
  },
  {
    id: '4',
    date: '2025-04-05',
    description: 'Pembayaran Invoice #INV-003',
    category: 'Penjualan',
    amount: 4500000,
  },
  {
    id: '5',
    date: '2025-04-01',
    description: 'Pembayaran Invoice #INV-004',
    category: 'Layanan',
    amount: 6250000,
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

const Income: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddIncomeOpen, setIsAddIncomeOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [incomes, setIncomes] = useState(dummyIncomes);
  const [newIncome, setNewIncome] = useState({
    date: '',
    description: '',
    category: '',
    amount: '',
  });

  const filteredIncomes = incomes.filter(income => {
    const matchesSearch = income.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         income.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? income.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const handleAddIncome = () => {
    if (!newIncome.date || !newIncome.description || !newIncome.category || !newIncome.amount) {
      alert('Semua field harus diisi');
      return;
    }

    const income = {
      id: Date.now().toString(),
      date: newIncome.date,
      description: newIncome.description,
      category: newIncome.category,
      amount: parseFloat(newIncome.amount),
    };

    setIncomes([income, ...incomes]);
    setNewIncome({
      date: '',
      description: '',
      category: '',
      amount: '',
    });
    setIsAddIncomeOpen(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
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
              <p className="text-2xl font-bold">Rp 23.500.000</p>
            </div>
            <div className="bg-background p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground">Rata-rata per Transaksi</p>
              <p className="text-2xl font-bold">Rp 4.700.000</p>
            </div>
            <div className="bg-background p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground">Pendapatan Terbesar</p>
              <p className="text-2xl font-bold">Rp 7.500.000</p>
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
                <SelectItem value="">Semua Kategori</SelectItem>
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
                  <TableHead className="text-right">Jumlah</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIncomes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6">
                      Tidak ada data pendapatan yang sesuai
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredIncomes.map((income) => (
                    <TableRow key={income.id}>
                      <TableCell>{new Date(income.date).toLocaleDateString('id-ID')}</TableCell>
                      <TableCell>{income.description}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                          {income.category}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(income.amount)}
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
          <p className="text-sm font-medium">Total: {formatCurrency(totalIncome)}</p>
        </CardFooter>
      </Card>

      <Dialog open={isAddIncomeOpen} onOpenChange={setIsAddIncomeOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Tambah Pendapatan Baru</DialogTitle>
            <DialogDescription>
              Masukkan detail pendapatan yang ingin dicatat.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Tanggal
              </Label>
              <div className="col-span-3 relative">
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Deskripsi
              </Label>
              <Input
                id="description"
                placeholder="Deskripsi pendapatan"
                className="col-span-3"
                value={newIncome.description}
                onChange={(e) => setNewIncome({ ...newIncome, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Kategori
              </Label>
              <Select
                value={newIncome.category}
                onValueChange={(value) => setNewIncome({ ...newIncome, category: value })}
              >
                <SelectTrigger className="col-span-3">
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Jumlah
              </Label>
              <div className="col-span-3 relative">
                <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="amount"
                  type="number"
                  placeholder="Jumlah pendapatan"
                  className="pl-8"
                  value={newIncome.amount}
                  onChange={(e) => setNewIncome({ ...newIncome, amount: e.target.value })}
                />
              </div>
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
