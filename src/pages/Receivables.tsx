
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { PlusCircle, Search, Filter, Trash2, Edit, Calendar, DollarSign, User, Phone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

const dummyReceivables = [
  {
    id: '1',
    personName: 'PT Maju Bersama',
    contactInfo: '081234567890',
    description: 'Pembayaran Invoice #INV-001',
    amount: 5000000,
    dueDate: '2025-05-15',
    isReceived: false,
    date: '2025-04-15',
  },
  {
    id: '2',
    personName: 'CV Abadi Jaya',
    contactInfo: '087654321098',
    description: 'Pembayaran Invoice #INV-002',
    amount: 3500000,
    dueDate: '2025-05-20',
    isReceived: false,
    date: '2025-04-12',
  },
  {
    id: '3',
    personName: 'Toko Sejahtera',
    contactInfo: '089876543210',
    description: 'Pembayaran Invoice #INV-003',
    amount: 2000000,
    dueDate: '2025-05-25',
    isReceived: false,
    date: '2025-04-10',
  },
  {
    id: '4',
    personName: 'PT Sukses Mandiri',
    contactInfo: '081122334455',
    description: 'Pembayaran Invoice #INV-004',
    amount: 7500000,
    dueDate: '2025-04-30',
    isReceived: true,
    date: '2025-04-05',
  },
  {
    id: '5',
    personName: 'CV Mitra Usaha',
    contactInfo: '082233445566',
    description: 'Pembayaran Invoice #INV-005',
    amount: 4250000,
    dueDate: '2025-04-25',
    isReceived: true,
    date: '2025-04-01',
  },
];

const statusOptions = [
  { value: 'pending', label: 'Belum Diterima' },
  { value: 'received', label: 'Sudah Diterima' },
];

const Receivables: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [receivables, setReceivables] = useState(dummyReceivables);
  const [isAddReceivableOpen, setIsAddReceivableOpen] = useState(false);
  const [newReceivable, setNewReceivable] = useState({
    date: '',
    personName: '',
    contactInfo: '',
    description: '',
    amount: '',
    dueDate: '',
    isReceived: false,
  });

  const filteredReceivables = receivables.filter(receivable => {
    const matchesSearch = 
      receivable.personName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receivable.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = 
      selectedStatus === '' ? true : 
      selectedStatus === 'pending' ? !receivable.isReceived : 
      receivable.isReceived;
    return matchesSearch && matchesStatus;
  });

  const handleAddReceivable = () => {
    if (!newReceivable.date || !newReceivable.personName || !newReceivable.description || !newReceivable.amount || !newReceivable.dueDate) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Semua field harus diisi",
      });
      return;
    }

    const receivable = {
      id: Date.now().toString(),
      date: newReceivable.date,
      personName: newReceivable.personName,
      contactInfo: newReceivable.contactInfo,
      description: newReceivable.description,
      amount: parseFloat(newReceivable.amount),
      dueDate: newReceivable.dueDate,
      isReceived: newReceivable.isReceived,
    };

    setReceivables([receivable, ...receivables]);
    setNewReceivable({
      date: '',
      personName: '',
      contactInfo: '',
      description: '',
      amount: '',
      dueDate: '',
      isReceived: false,
    });
    setIsAddReceivableOpen(false);
    
    toast({
      title: "Berhasil!",
      description: "Piutang berhasil ditambahkan",
    });
  };

  const toggleReceivableStatus = (id: string) => {
    setReceivables(prevReceivables => 
      prevReceivables.map(receivable => 
        receivable.id === id 
          ? { ...receivable, isReceived: !receivable.isReceived } 
          : receivable
      )
    );
    
    toast({
      title: "Status Diperbarui",
      description: "Status piutang berhasil diperbarui",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getTotalReceivable = () => {
    return receivables.reduce((total, receivable) => {
      if (!receivable.isReceived) {
        return total + receivable.amount;
      }
      return total;
    }, 0);
  };

  const getOverdueReceivables = () => {
    const today = new Date();
    return receivables.filter(receivable => {
      const dueDate = new Date(receivable.dueDate);
      return !receivable.isReceived && dueDate < today;
    }).length;
  };

  return (
    <MainLayout>
      <div className="pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Piutang</h1>
          <p className="text-muted-foreground">
            Kelola dan lihat semua data piutang perusahaan
          </p>
        </div>
        <Button onClick={() => setIsAddReceivableOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Tambah Piutang
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Ringkasan Piutang</CardTitle>
          <CardDescription>Ikhtisar piutang perusahaan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-background p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground">Total Piutang</p>
              <p className="text-2xl font-bold">{formatCurrency(getTotalReceivable())}</p>
            </div>
            <div className="bg-background p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground">Jumlah Piutang</p>
              <p className="text-2xl font-bold">{receivables.filter(r => !r.isReceived).length} Piutang</p>
            </div>
            <div className="bg-background p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground">Piutang Jatuh Tempo</p>
              <p className="text-2xl font-bold text-red-600">{getOverdueReceivables()} Piutang</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Daftar Piutang</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari piutang..."
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
                <SelectItem value="all">Semua Status</SelectItem>
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
                  <TableHead className="w-[50px]">Status</TableHead>
                  <TableHead>Pihak/Perusahaan</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Jatuh Tempo</TableHead>
                  <TableHead className="text-right">Jumlah</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReceivables.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      Tidak ada data piutang yang sesuai
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReceivables.map((receivable) => (
                    <TableRow key={receivable.id}>
                      <TableCell>
                        <Checkbox 
                          checked={receivable.isReceived}
                          onCheckedChange={() => toggleReceivableStatus(receivable.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{receivable.personName}</p>
                          {receivable.contactInfo && (
                            <p className="text-xs text-muted-foreground flex items-center mt-1">
                              <Phone className="h-3 w-3 mr-1" />
                              {receivable.contactInfo}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{receivable.description}</TableCell>
                      <TableCell>
                        {new Date(receivable.dueDate).toLocaleDateString('id-ID')}
                        {new Date(receivable.dueDate) < new Date() && !receivable.isReceived && (
                          <Badge variant="destructive" className="ml-2">Jatuh Tempo</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(receivable.amount)}
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
          <p className="text-sm text-muted-foreground">Menampilkan {filteredReceivables.length} dari {receivables.length} piutang</p>
        </CardFooter>
      </Card>

      <Dialog open={isAddReceivableOpen} onOpenChange={setIsAddReceivableOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Tambah Piutang Baru</DialogTitle>
            <DialogDescription>
              Masukkan detail piutang yang ingin dicatat.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <label htmlFor="date" className="block text-sm font-medium mb-1">Tanggal</label>
                <div className="relative">
                  <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="date"
                    type="date"
                    className="pl-8"
                    value={newReceivable.date}
                    onChange={(e) => setNewReceivable({ ...newReceivable, date: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="relative">
                <label htmlFor="dueDate" className="block text-sm font-medium mb-1">Jatuh Tempo</label>
                <div className="relative">
                  <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="dueDate"
                    type="date"
                    className="pl-8"
                    value={newReceivable.dueDate}
                    onChange={(e) => setNewReceivable({ ...newReceivable, dueDate: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="personName" className="block text-sm font-medium mb-1">Nama Pihak/Perusahaan</label>
                <div className="relative">
                  <User className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="personName"
                    placeholder="Nama pihak/perusahaan"
                    className="pl-8"
                    value={newReceivable.personName}
                    onChange={(e) => setNewReceivable({ ...newReceivable, personName: e.target.value })}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="contactInfo" className="block text-sm font-medium mb-1">Kontak (opsional)</label>
                <div className="relative">
                  <Phone className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="contactInfo"
                    placeholder="Nomor telepon"
                    className="pl-8"
                    value={newReceivable.contactInfo}
                    onChange={(e) => setNewReceivable({ ...newReceivable, contactInfo: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">Deskripsi</label>
              <Input
                id="description"
                placeholder="Deskripsi piutang"
                value={newReceivable.description}
                onChange={(e) => setNewReceivable({ ...newReceivable, description: e.target.value })}
              />
            </div>
            
            <div>
              <label htmlFor="amount" className="block text-sm font-medium mb-1">Jumlah</label>
              <div className="relative">
                <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="amount"
                  type="number"
                  placeholder="Jumlah piutang"
                  className="pl-8"
                  value={newReceivable.amount}
                  onChange={(e) => setNewReceivable({ ...newReceivable, amount: e.target.value })}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="isReceived" 
                checked={newReceivable.isReceived}
                onCheckedChange={(checked) => 
                  setNewReceivable({ 
                    ...newReceivable, 
                    isReceived: checked as boolean 
                  })
                }
              />
              <label
                htmlFor="isReceived"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Sudah Diterima
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddReceivableOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleAddReceivable}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Receivables;
