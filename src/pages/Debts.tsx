
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
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PlusCircle, Search, Filter, Edit, Trash2, Calendar, DollarSign, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const dummyDebts = [
  {
    id: '1',
    date: '2025-04-10',
    dueDate: '2025-05-10',
    description: 'Pinjaman modal usaha',
    creditor: 'Bank ABC',
    amount: 50000000,
    remainingAmount: 45000000,
    status: 'ongoing',
  },
  {
    id: '2',
    date: '2025-03-15',
    dueDate: '2025-06-15',
    description: 'Pinjaman pembelian peralatan',
    creditor: 'PT Supplier',
    amount: 15000000,
    remainingAmount: 10000000,
    status: 'ongoing',
  },
  {
    id: '3',
    date: '2025-02-20',
    dueDate: '2025-04-20',
    description: 'Pinjaman renovasi kantor',
    creditor: 'Bank XYZ',
    amount: 25000000,
    remainingAmount: 0,
    status: 'paid',
  },
  {
    id: '4',
    date: '2025-01-05',
    dueDate: '2025-04-05',
    description: 'Pinjaman operasional',
    creditor: 'PT Finance',
    amount: 10000000,
    remainingAmount: 2500000,
    status: 'ongoing',
  },
  {
    id: '5',
    date: '2024-12-10',
    dueDate: '2025-04-19',
    description: 'Pinjaman pajak',
    creditor: 'Bank DEF',
    amount: 7500000,
    remainingAmount: 0,
    status: 'paid',
  },
];

const creditorOptions = [
  'Bank ABC',
  'Bank XYZ',
  'Bank DEF',
  'PT Supplier',
  'PT Finance',
  'Lainnya',
];

const statusOptions = [
  { value: 'ongoing', label: 'Belum Lunas' },
  { value: 'paid', label: 'Lunas' },
  { value: 'overdue', label: 'Terlambat' },
];

const Debts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDebtOpen, setIsAddDebtOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [debts, setDebts] = useState(dummyDebts);
  const [newDebt, setNewDebt] = useState({
    date: '',
    dueDate: '',
    description: '',
    creditor: '',
    amount: '',
  });

  const filteredDebts = debts.filter(debt => {
    const matchesSearch = debt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         debt.creditor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus ? debt.status === selectedStatus : true;
    return matchesSearch && matchesStatus;
  });

  const handleAddDebt = () => {
    if (!newDebt.date || !newDebt.dueDate || !newDebt.description || !newDebt.creditor || !newDebt.amount) {
      alert('Semua field harus diisi');
      return;
    }

    const debt = {
      id: Date.now().toString(),
      date: newDebt.date,
      dueDate: newDebt.dueDate,
      description: newDebt.description,
      creditor: newDebt.creditor,
      amount: parseFloat(newDebt.amount),
      remainingAmount: parseFloat(newDebt.amount),
      status: 'ongoing',
    };

    setDebts([debt, ...debts]);
    setNewDebt({
      date: '',
      dueDate: '',
      description: '',
      creditor: '',
      amount: '',
    });
    setIsAddDebtOpen(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    if (status === 'ongoing') {
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Belum Lunas</Badge>;
    } else if (status === 'paid') {
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Lunas</Badge>;
    } else if (status === 'overdue') {
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Terlambat</Badge>;
    }
    return null;
  };

  const totalDebt = debts.reduce((sum, debt) => sum + debt.remainingAmount, 0);
  const ongoingDebts = debts.filter(debt => debt.status === 'ongoing').length;

  return (
    <MainLayout>
      <div className="pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Hutang</h1>
          <p className="text-muted-foreground">
            Kelola dan pantau semua hutang perusahaan
          </p>
        </div>
        <Button onClick={() => setIsAddDebtOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Tambah Hutang
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Ringkasan Hutang</CardTitle>
          <CardDescription>Ikhtisar hutang perusahaan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-background p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground">Total Hutang Aktif</p>
              <p className="text-2xl font-bold">{formatCurrency(totalDebt)}</p>
            </div>
            <div className="bg-background p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground">Jumlah Hutang Aktif</p>
              <p className="text-2xl font-bold">{ongoingDebts}</p>
            </div>
            <div className="bg-background p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground">Hutang Terbesar</p>
              <p className="text-2xl font-bold">Rp 45.000.000</p>
              <p className="text-xs text-muted-foreground">Kreditor: Bank ABC</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Daftar Hutang</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari hutang..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter Status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Semua Status</SelectItem>
                {statusOptions.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
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
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Kreditor</TableHead>
                  <TableHead>Tanggal Jatuh Tempo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Jumlah</TableHead>
                  <TableHead className="text-right">Sisa</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDebts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6">
                      Tidak ada data hutang yang sesuai
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDebts.map((debt) => (
                    <TableRow key={debt.id}>
                      <TableCell>{debt.description}</TableCell>
                      <TableCell>{debt.creditor}</TableCell>
                      <TableCell>{new Date(debt.dueDate).toLocaleDateString('id-ID')}</TableCell>
                      <TableCell>{getStatusBadge(debt.status)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(debt.amount)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(debt.remainingAmount)}</TableCell>
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
          <p className="text-sm text-muted-foreground">Menampilkan {filteredDebts.length} dari {debts.length} hutang</p>
        </CardFooter>
      </Card>

      <Dialog open={isAddDebtOpen} onOpenChange={setIsAddDebtOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Tambah Hutang Baru</DialogTitle>
            <DialogDescription>
              Masukkan detail hutang yang ingin dicatat.
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
                  value={newDebt.date}
                  onChange={(e) => setNewDebt({ ...newDebt, date: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dueDate" className="text-right">
                Jatuh Tempo
              </Label>
              <div className="col-span-3 relative">
                <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="dueDate"
                  type="date"
                  className="pl-8"
                  value={newDebt.dueDate}
                  onChange={(e) => setNewDebt({ ...newDebt, dueDate: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Deskripsi
              </Label>
              <Input
                id="description"
                placeholder="Deskripsi hutang"
                className="col-span-3"
                value={newDebt.description}
                onChange={(e) => setNewDebt({ ...newDebt, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="creditor" className="text-right">
                Kreditor
              </Label>
              <Select
                value={newDebt.creditor}
                onValueChange={(value) => setNewDebt({ ...newDebt, creditor: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Pilih kreditor" />
                </SelectTrigger>
                <SelectContent>
                  {creditorOptions.map((creditor) => (
                    <SelectItem key={creditor} value={creditor}>
                      {creditor}
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
                  placeholder="Jumlah hutang"
                  className="pl-8"
                  value={newDebt.amount}
                  onChange={(e) => setNewDebt({ ...newDebt, amount: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDebtOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleAddDebt}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Debts;
