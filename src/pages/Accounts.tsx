
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PlusCircle, Search, Filter, Edit, Trash2, Eye, BadgeIndianRupee } from 'lucide-react';
import { formatRupiah } from '@/utils/currency';
import { useToast } from '@/components/ui/use-toast';

// Mock data
const dummyAccounts = [
  {
    id: '1',
    code: '1-1000',
    name: 'Kas',
    type: 'Aset',
    balance: 25000000,
    description: 'Kas untuk operasional harian',
    isActive: true,
    lastTransaction: '2025-04-15',
  },
  {
    id: '2',
    code: '1-2000',
    name: 'Bank BCA',
    type: 'Aset',
    balance: 150000000,
    description: 'Rekening utama BCA',
    isActive: true,
    lastTransaction: '2025-04-18',
  },
  {
    id: '3',
    code: '1-3000',
    name: 'Bank Mandiri',
    type: 'Aset',
    balance: 75000000,
    description: 'Rekening operasional Mandiri',
    isActive: true,
    lastTransaction: '2025-04-10',
  },
  {
    id: '4',
    code: '2-1000',
    name: 'Utang Usaha',
    type: 'Kewajiban',
    balance: 35000000,
    description: 'Utang kepada pemasok',
    isActive: true,
    lastTransaction: '2025-04-05',
  },
  {
    id: '5',
    code: '3-1000',
    name: 'Modal',
    type: 'Ekuitas',
    balance: 200000000,
    description: 'Modal awal perusahaan',
    isActive: true,
    lastTransaction: '2025-01-01',
  },
];

const accountTypes = [
  'Aset',
  'Kewajiban',
  'Ekuitas',
  'Pendapatan',
  'Beban',
];

const Accounts: React.FC = () => {
  const { toast } = useToast();
  const [accounts, setAccounts] = useState(dummyAccounts);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [isViewAccountOpen, setIsViewAccountOpen] = useState(false);
  
  const [newAccount, setNewAccount] = useState({
    code: '',
    name: '',
    type: '',
    description: '',
    balance: '',
  });

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = 
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter ? account.type === typeFilter : true;
    return matchesSearch && matchesType;
  });

  const handleAddAccount = () => {
    if (!newAccount.code || !newAccount.name || !newAccount.type) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Kode, nama, dan tipe akun harus diisi",
      });
      return;
    }

    const account = {
      id: Date.now().toString(),
      code: newAccount.code,
      name: newAccount.name,
      type: newAccount.type,
      description: newAccount.description,
      balance: parseFloat(newAccount.balance) || 0,
      isActive: true,
      lastTransaction: new Date().toISOString().split('T')[0],
    };

    setAccounts([...accounts, account]);
    setNewAccount({
      code: '',
      name: '',
      type: '',
      description: '',
      balance: '',
    });
    setIsAddAccountOpen(false);
    
    toast({
      title: "Berhasil!",
      description: "Akun baru telah ditambahkan",
    });
  };

  const handleViewAccount = (account: any) => {
    setSelectedAccount(account);
    setIsViewAccountOpen(true);
  };

  const getTotalBalance = () => {
    return accounts.reduce((sum, account) => {
      if (account.type === 'Aset') {
        return sum + account.balance;
      } else if (account.type === 'Kewajiban') {
        return sum - account.balance;
      }
      return sum;
    }, 0);
  };

  return (
    <MainLayout>
      <div className="pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Akun</h1>
          <p className="text-muted-foreground">
            Kelola akun perbankan Anda
          </p>
        </div>
        <Button onClick={() => setIsAddAccountOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Tambah Akun
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Ringkasan Akun</CardTitle>
          <CardDescription>Ikhtisar saldo dan aktivitas akun</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-background p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground">Total Aset</p>
              <p className="text-2xl font-bold">{formatRupiah(accounts.filter(a => a.type === 'Aset').reduce((sum, a) => sum + a.balance, 0))}</p>
            </div>
            <div className="bg-background p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground">Total Kewajiban</p>
              <p className="text-2xl font-bold">{formatRupiah(accounts.filter(a => a.type === 'Kewajiban').reduce((sum, a) => sum + a.balance, 0))}</p>
            </div>
            <div className="bg-background p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground">Posisi Bersih</p>
              <p className="text-2xl font-bold">{formatRupiah(getTotalBalance())}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Daftar Akun</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari akun..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter Tipe" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Semua Tipe</SelectItem>
                {accountTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
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
                  <TableHead>Kode</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Tipe</TableHead>
                  <TableHead className="text-right">Saldo</TableHead>
                  <TableHead>Transaksi Terakhir</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAccounts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      Tidak ada data akun yang sesuai
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAccounts.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell>{account.code}</TableCell>
                      <TableCell className="font-medium">{account.name}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          account.type === 'Aset' 
                            ? 'bg-green-50 text-green-700' 
                            : account.type === 'Kewajiban'
                            ? 'bg-red-50 text-red-700'
                            : 'bg-blue-50 text-blue-700'
                        }`}>
                          {account.type}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {formatRupiah(account.balance)}
                      </TableCell>
                      <TableCell>
                        {new Date(account.lastTransaction).toLocaleDateString('id-ID')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleViewAccount(account)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
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
        <CardFooter>
          <p className="text-sm text-muted-foreground">Menampilkan {filteredAccounts.length} dari {accounts.length} akun</p>
        </CardFooter>
      </Card>

      {/* Add Account Dialog */}
      <Dialog open={isAddAccountOpen} onOpenChange={setIsAddAccountOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Tambah Akun Baru</DialogTitle>
            <DialogDescription>
              Masukkan informasi akun perbankan atau buku besar baru.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="code">Kode Akun</Label>
                <Input
                  id="code"
                  placeholder="Contoh: 1-1000"
                  value={newAccount.code}
                  onChange={(e) => setNewAccount({ ...newAccount, code: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Tipe Akun</Label>
                <Select
                  value={newAccount.type}
                  onValueChange={(value) => setNewAccount({ ...newAccount, type: value })}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Pilih tipe akun" />
                  </SelectTrigger>
                  <SelectContent>
                    {accountTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Nama Akun</Label>
              <Input
                id="name"
                placeholder="Nama akun"
                value={newAccount.name}
                onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Input
                id="description"
                placeholder="Deskripsi singkat"
                value={newAccount.description}
                onChange={(e) => setNewAccount({ ...newAccount, description: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="balance">Saldo Awal</Label>
              <div className="relative">
                <BadgeIndianRupee className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="balance"
                  type="number"
                  placeholder="Saldo awal"
                  className="pl-8"
                  value={newAccount.balance}
                  onChange={(e) => setNewAccount({ ...newAccount, balance: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddAccountOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleAddAccount}>Tambah Akun</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Account Dialog */}
      <Dialog open={isViewAccountOpen} onOpenChange={setIsViewAccountOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Detail Akun</DialogTitle>
            <DialogDescription>
              Informasi lengkap tentang akun ini.
            </DialogDescription>
          </DialogHeader>
          {selectedAccount && (
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Kode Akun</p>
                  <p className="font-medium">{selectedAccount.code}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tipe</p>
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    selectedAccount.type === 'Aset' 
                      ? 'bg-green-50 text-green-700' 
                      : selectedAccount.type === 'Kewajiban'
                      ? 'bg-red-50 text-red-700'
                      : 'bg-blue-50 text-blue-700'
                  }`}>
                    {selectedAccount.type}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Nama Akun</p>
                <p className="font-medium">{selectedAccount.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Deskripsi</p>
                <p>{selectedAccount.description || '-'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Saldo</p>
                  <p className="text-xl font-semibold">{formatRupiah(selectedAccount.balance)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Transaksi Terakhir</p>
                  <p>{new Date(selectedAccount.lastTransaction).toLocaleDateString('id-ID')}</p>
                </div>
              </div>
              <div className="border-t pt-4 mt-2">
                <h4 className="font-medium mb-2">Aktivitas Terbaru</h4>
                <p className="text-sm text-muted-foreground text-center py-3">Data aktivitas akan ditampilkan di sini.</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewAccountOpen(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Accounts;
