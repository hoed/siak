
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { PlusCircle, Search, Filter, Trash2, Edit, Calendar, DollarSign, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const dummyTransactions = [
  {
    id: '1',
    date: '2025-04-15',
    description: 'Penjualan produk',
    category: 'Penjualan',
    amount: 2500000,
    type: 'income',
    account: 'Kas Utama',
  },
  {
    id: '2',
    date: '2025-04-15',
    description: 'Pembayaran gaji karyawan',
    category: 'Gaji',
    amount: 5000000,
    type: 'expense',
    account: 'Bank BCA',
  },
  {
    id: '3',
    date: '2025-04-12',
    description: 'Pembayaran sewa kantor',
    category: 'Sewa',
    amount: 3500000,
    type: 'expense',
    account: 'Bank Mandiri',
  },
  {
    id: '4',
    date: '2025-04-11',
    description: 'Pendapatan jasa konsultasi',
    category: 'Jasa',
    amount: 4500000,
    type: 'income',
    account: 'Bank BNI',
  },
  {
    id: '5',
    date: '2025-04-10',
    description: 'Pembelian alat tulis kantor',
    category: 'Perlengkapan',
    amount: 450000,
    type: 'expense',
    account: 'Kas Kecil',
  },
  {
    id: '6',
    date: '2025-04-09',
    description: 'Pendapatan dari investasi',
    category: 'Investasi',
    amount: 1200000,
    type: 'income',
    account: 'Bank BCA',
  },
  {
    id: '7',
    date: '2025-04-08',
    description: 'Pembayaran tagihan listrik',
    category: 'Utilitas',
    amount: 750000,
    type: 'expense',
    account: 'Kas Utama',
  },
  {
    id: '8',
    date: '2025-04-07',
    description: 'Penjualan aset',
    category: 'Aset',
    amount: 15000000,
    type: 'income',
    account: 'Bank Mandiri',
  },
];

const categoryOptions = [
  'Penjualan',
  'Jasa',
  'Investasi',
  'Aset',
  'Gaji',
  'Sewa',
  'Perlengkapan',
  'Utilitas',
  'Transportasi',
  'Pemasaran',
  'Lainnya',
];

const accountOptions = [
  'Kas Utama',
  'Kas Kecil',
  'Bank BCA',
  'Bank Mandiri',
  'Bank BNI',
  'Bank BRI',
];

const Transactions: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [transactions, setTransactions] = useState(dummyTransactions);
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    date: '',
    description: '',
    category: '',
    amount: '',
    type: 'expense',
    account: '',
  });

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? transaction.category === selectedCategory : true;
    const matchesType = selectedType === 'all' ? true : transaction.type === selectedType;
    return matchesSearch && matchesCategory && matchesType;
  });

  const handleAddTransaction = () => {
    if (!newTransaction.date || !newTransaction.description || !newTransaction.category || !newTransaction.amount || !newTransaction.account) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Semua field harus diisi",
      });
      return;
    }

    const transaction = {
      id: Date.now().toString(),
      date: newTransaction.date,
      description: newTransaction.description,
      category: newTransaction.category,
      amount: parseFloat(newTransaction.amount),
      type: newTransaction.type,
      account: newTransaction.account,
    };

    setTransactions([transaction, ...transactions]);
    setNewTransaction({
      date: '',
      description: '',
      category: '',
      amount: '',
      type: 'expense',
      account: '',
    });
    setIsAddTransactionOpen(false);
    
    toast({
      title: "Berhasil!",
      description: "Transaksi berhasil ditambahkan",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <MainLayout>
      <div className="pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Transaksi</h1>
          <p className="text-muted-foreground">
            Kelola dan lihat semua data transaksi perusahaan
          </p>
        </div>
        <Button onClick={() => setIsAddTransactionOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Tambah Transaksi
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Ringkasan Transaksi</CardTitle>
          <CardDescription>Ikhtisar transaksi bulanan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-background p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground">Total Pemasukan</p>
              <p className="text-2xl font-bold text-green-600">Rp 23.200.000</p>
            </div>
            <div className="bg-background p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground">Total Pengeluaran</p>
              <p className="text-2xl font-bold text-red-600">Rp 9.700.000</p>
            </div>
            <div className="bg-background p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground">Saldo</p>
              <p className="text-2xl font-bold">Rp 13.500.000</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Daftar Transaksi</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari transaksi..."
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
          <Tabs defaultValue="all" value={selectedType} onValueChange={setSelectedType}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">Semua</TabsTrigger>
              <TabsTrigger value="income">Pemasukan</TabsTrigger>
              <TabsTrigger value="expense">Pengeluaran</TabsTrigger>
            </TabsList>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Deskripsi</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Akun</TableHead>
                    <TableHead className="text-right">Jumlah</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6">
                        Tidak ada data transaksi yang sesuai
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{new Date(transaction.date).toLocaleDateString('id-ID')}</TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                            {transaction.category}
                          </span>
                        </TableCell>
                        <TableCell>{transaction.account}</TableCell>
                        <TableCell className="text-right font-medium">
                          <div className={`flex items-center justify-end ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                            {transaction.type === 'income' ? <ArrowUpRight className="mr-1 h-4 w-4" /> : <ArrowDownLeft className="mr-1 h-4 w-4" />}
                            {formatCurrency(transaction.amount)}
                          </div>
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
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">Menampilkan {filteredTransactions.length} dari {transactions.length} transaksi</p>
        </CardFooter>
      </Card>

      <Dialog open={isAddTransactionOpen} onOpenChange={setIsAddTransactionOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Tambah Transaksi Baru</DialogTitle>
            <DialogDescription>
              Masukkan detail transaksi yang ingin dicatat.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Tabs defaultValue="expense" value={newTransaction.type} onValueChange={(value) => setNewTransaction({ ...newTransaction, type: value })}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="expense">Pengeluaran</TabsTrigger>
                <TabsTrigger value="income">Pemasukan</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <label htmlFor="date" className="block text-sm font-medium mb-1">Tanggal</label>
                <div className="relative">
                  <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="date"
                    type="date"
                    className="pl-8"
                    value={newTransaction.date}
                    onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="account" className="block text-sm font-medium mb-1">Akun</label>
                <Select
                  value={newTransaction.account}
                  onValueChange={(value) => setNewTransaction({ ...newTransaction, account: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih akun" />
                  </SelectTrigger>
                  <SelectContent>
                    {accountOptions.map((account) => (
                      <SelectItem key={account} value={account}>
                        {account}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">Deskripsi</label>
              <Input
                id="description"
                placeholder="Deskripsi transaksi"
                value={newTransaction.description}
                onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium mb-1">Kategori</label>
                <Select
                  value={newTransaction.category}
                  onValueChange={(value) => setNewTransaction({ ...newTransaction, category: value })}
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
              
              <div>
                <label htmlFor="amount" className="block text-sm font-medium mb-1">Jumlah</label>
                <div className="relative">
                  <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Jumlah transaksi"
                    className="pl-8"
                    value={newTransaction.amount}
                    onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddTransactionOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleAddTransaction}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Transactions;
