
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
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { PlusCircle, Search, Trash2, Edit, Building, CreditCard, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const dummyAccounts = [
  {
    id: '1',
    name: 'Kas Utama',
    accountNumber: '',
    bankName: '',
    balance: 15000000,
    description: 'Kas utama perusahaan',
    type: 'cash'
  },
  {
    id: '2',
    name: 'Kas Kecil',
    accountNumber: '',
    bankName: '',
    balance: 2500000,
    description: 'Kas untuk kebutuhan operasional sehari-hari',
    type: 'cash'
  },
  {
    id: '3',
    name: 'Bank BCA',
    accountNumber: '1234567890',
    bankName: 'Bank Central Asia',
    balance: 27500000,
    description: 'Rekening utama BCA',
    type: 'bank'
  },
  {
    id: '4',
    name: 'Bank Mandiri',
    accountNumber: '0987654321',
    bankName: 'Bank Mandiri',
    balance: 35000000,
    description: 'Rekening bisnis Mandiri',
    type: 'bank'
  },
  {
    id: '5',
    name: 'Bank BNI',
    accountNumber: '1122334455',
    bankName: 'Bank Negara Indonesia',
    balance: 18500000,
    description: 'Rekening operasional BNI',
    type: 'bank'
  }
];

const Accounts: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [accounts, setAccounts] = useState(dummyAccounts);
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const [newAccount, setNewAccount] = useState({
    name: '',
    accountNumber: '',
    bankName: '',
    balance: '',
    description: '',
    type: 'bank',
  });

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = 
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (account.bankName && account.bankName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === 'all' ? true : account.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleAddAccount = () => {
    if (!newAccount.name || !newAccount.balance) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Nama akun dan saldo harus diisi",
      });
      return;
    }

    const account = {
      id: Date.now().toString(),
      name: newAccount.name,
      accountNumber: newAccount.accountNumber,
      bankName: newAccount.type === 'bank' ? newAccount.bankName : '',
      balance: parseFloat(newAccount.balance),
      description: newAccount.description,
      type: newAccount.type,
    };

    setAccounts([...accounts, account]);
    setNewAccount({
      name: '',
      accountNumber: '',
      bankName: '',
      balance: '',
      description: '',
      type: 'bank',
    });
    setIsAddAccountOpen(false);
    
    toast({
      title: "Berhasil!",
      description: "Akun bank berhasil ditambahkan",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getTotalBalance = () => {
    return accounts.reduce((total, account) => total + account.balance, 0);
  };

  return (
    <MainLayout>
      <div className="pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Akun Bank & Kas</h1>
          <p className="text-muted-foreground">
            Kelola akun bank dan kas perusahaan
          </p>
        </div>
        <Button onClick={() => setIsAddAccountOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Tambah Akun
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Ringkasan Keuangan</CardTitle>
          <CardDescription>Ikhtisar saldo perusahaan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-background p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground">Total Saldo</p>
              <p className="text-2xl font-bold">{formatCurrency(getTotalBalance())}</p>
            </div>
            <div className="bg-background p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground">Kas</p>
              <p className="text-2xl font-bold">
                {formatCurrency(accounts.filter(a => a.type === 'cash').reduce((total, account) => total + account.balance, 0))}
              </p>
            </div>
            <div className="bg-background p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground">Bank</p>
              <p className="text-2xl font-bold">
                {formatCurrency(accounts.filter(a => a.type === 'bank').reduce((total, account) => total + account.balance, 0))}
              </p>
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
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={selectedType} onValueChange={setSelectedType}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">Semua</TabsTrigger>
              <TabsTrigger value="bank">Bank</TabsTrigger>
              <TabsTrigger value="cash">Kas</TabsTrigger>
            </TabsList>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Akun</TableHead>
                    <TableHead>Jenis</TableHead>
                    <TableHead>Detail</TableHead>
                    <TableHead className="text-right">Saldo</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAccounts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6">
                        Tidak ada data akun yang sesuai
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAccounts.map((account) => (
                      <TableRow key={account.id}>
                        <TableCell>
                          <div className="font-medium">{account.name}</div>
                          {account.description && (
                            <div className="text-xs text-muted-foreground mt-1">{account.description}</div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={account.type === 'bank' ? 'default' : 'secondary'}>
                            {account.type === 'bank' ? 'Bank' : 'Kas'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {account.type === 'bank' && (
                            <div>
                              <div className="text-sm">{account.bankName}</div>
                              {account.accountNumber && (
                                <div className="text-xs text-muted-foreground flex items-center mt-1">
                                  <CreditCard className="h-3 w-3 mr-1" />
                                  {account.accountNumber}
                                </div>
                              )}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(account.balance)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <FileText className="h-4 w-4" />
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
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">Menampilkan {filteredAccounts.length} dari {accounts.length} akun</p>
        </CardFooter>
      </Card>

      <Dialog open={isAddAccountOpen} onOpenChange={setIsAddAccountOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Tambah Akun Baru</DialogTitle>
            <DialogDescription>
              Masukkan detail akun yang ingin ditambahkan.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Tabs defaultValue="bank" value={newAccount.type} onValueChange={(value) => setNewAccount({ ...newAccount, type: value })}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="bank">Bank</TabsTrigger>
                <TabsTrigger value="cash">Kas</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">Nama Akun</label>
              <Input
                id="name"
                placeholder="Nama akun"
                value={newAccount.name}
                onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
              />
            </div>
            
            {newAccount.type === 'bank' && (
              <>
                <div>
                  <label htmlFor="bankName" className="block text-sm font-medium mb-1">Nama Bank</label>
                  <div className="relative">
                    <Building className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="bankName"
                      placeholder="Nama bank"
                      className="pl-8"
                      value={newAccount.bankName}
                      onChange={(e) => setNewAccount({ ...newAccount, bankName: e.target.value })}
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="accountNumber" className="block text-sm font-medium mb-1">Nomor Rekening</label>
                  <div className="relative">
                    <CreditCard className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="accountNumber"
                      placeholder="Nomor rekening"
                      className="pl-8"
                      value={newAccount.accountNumber}
                      onChange={(e) => setNewAccount({ ...newAccount, accountNumber: e.target.value })}
                    />
                  </div>
                </div>
              </>
            )}
            
            <div>
              <label htmlFor="balance" className="block text-sm font-medium mb-1">Saldo Awal</label>
              <Input
                id="balance"
                type="number"
                placeholder="Saldo awal"
                value={newAccount.balance}
                onChange={(e) => setNewAccount({ ...newAccount, balance: e.target.value })}
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">Deskripsi (opsional)</label>
              <Input
                id="description"
                placeholder="Deskripsi akun"
                value={newAccount.description}
                onChange={(e) => setNewAccount({ ...newAccount, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddAccountOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleAddAccount}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Accounts;
