
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
import { 
  PlusCircle, 
  Search, 
  Filter, 
  Trash2, 
  Edit, 
  Eye,
  BadgeIndianRupee
} from 'lucide-react';
import { Supplier, SupplierInvoice } from '@/types/supplier';
import { useToast } from '@/components/ui/use-toast';
import { formatRupiah } from '@/utils/currency';
import { Label } from '@/components/ui/label';

// Mock data
const dummySuppliers: Supplier[] = [
  {
    id: '1',
    name: 'PT Distributor Utama',
    email: 'contact@distributorutama.co.id',
    phone: '021-88776655',
    address: 'Jl. Raya Industri No. 123, Jakarta',
    status: 'active',
    created_at: '2025-01-15T00:00:00Z',
    updated_at: '2025-01-15T00:00:00Z',
  },
  {
    id: '2',
    name: 'CV Maju Jaya Supplier',
    email: 'sales@majujaya.com',
    phone: '021-12345678',
    address: 'Jl. Pahlawan No. 45, Bandung',
    status: 'active',
    created_at: '2025-02-20T00:00:00Z',
    updated_at: '2025-02-20T00:00:00Z',
  },
  {
    id: '3',
    name: 'PT Aneka Barang',
    email: 'info@anekabarang.id',
    phone: '021-23456789',
    address: 'Jl. Sudirman No. 67, Surabaya',
    status: 'inactive',
    created_at: '2025-03-05T00:00:00Z',
    updated_at: '2025-03-15T00:00:00Z',
  },
  {
    id: '4',
    name: 'CV Sumber Makmur',
    email: 'contact@sumbermakmur.com',
    phone: '021-34567890',
    address: 'Jl. Gatot Subroto No. 89, Jakarta',
    status: 'active',
    created_at: '2025-03-10T00:00:00Z',
    updated_at: '2025-03-10T00:00:00Z',
  },
  {
    id: '5',
    name: 'PT Sejahtera Supply',
    email: 'cs@sejahterasupply.co.id',
    phone: '021-45678901',
    address: 'Jl. Pemuda No. 112, Semarang',
    status: 'active',
    created_at: '2025-04-01T00:00:00Z',
    updated_at: '2025-04-01T00:00:00Z',
  },
];

const dummyInvoices: SupplierInvoice[] = [
  {
    id: '1',
    supplier_id: '1',
    invoice_number: 'INV-S001',
    issue_date: '2025-04-10',
    due_date: '2025-05-10',
    total_amount: 12500000,
    paid_amount: 12500000,
    status: 'paid',
    notes: 'Pembayaran penuh',
    items: [
      {
        id: '1-1',
        invoice_id: '1',
        description: 'Bahan Baku A',
        quantity: 100,
        unit_price: 125000,
        total: 12500000,
        created_at: '2025-04-10T00:00:00Z',
        updated_at: '2025-04-10T00:00:00Z',
      }
    ],
    created_at: '2025-04-10T00:00:00Z',
    updated_at: '2025-04-15T00:00:00Z',
  },
  {
    id: '2',
    supplier_id: '2',
    invoice_number: 'INV-S002',
    issue_date: '2025-04-12',
    due_date: '2025-05-12',
    total_amount: 8750000,
    paid_amount: 4000000,
    status: 'partial',
    notes: 'Pembayaran sebagian',
    items: [
      {
        id: '2-1',
        invoice_id: '2',
        description: 'Komponen B',
        quantity: 50,
        unit_price: 175000,
        total: 8750000,
        created_at: '2025-04-12T00:00:00Z',
        updated_at: '2025-04-12T00:00:00Z',
      }
    ],
    created_at: '2025-04-12T00:00:00Z',
    updated_at: '2025-04-20T00:00:00Z',
  },
];

const Suppliers: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [suppliers, setSuppliers] = useState<Supplier[]>(dummySuppliers);
  const [invoices, setInvoices] = useState<SupplierInvoice[]>(dummyInvoices);
  
  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false);
  const [isViewSupplierOpen, setIsViewSupplierOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    status: 'active',
  });

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = 
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' ? true : supplier.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddSupplier = () => {
    if (!newSupplier.name || !newSupplier.email || !newSupplier.phone) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Nama, email, dan nomor telepon harus diisi",
      });
      return;
    }

    const supplier: Supplier = {
      id: Date.now().toString(),
      name: newSupplier.name,
      email: newSupplier.email,
      phone: newSupplier.phone,
      address: newSupplier.address,
      status: newSupplier.status as 'active' | 'inactive',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setSuppliers([supplier, ...suppliers]);
    setNewSupplier({
      name: '',
      email: '',
      phone: '',
      address: '',
      status: 'active',
    });
    setIsAddSupplierOpen(false);
    
    toast({
      title: "Berhasil!",
      description: "Pemasok baru telah ditambahkan",
    });
  };

  const handleViewSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsViewSupplierOpen(true);
  };

  const getSupplierInvoices = (supplierId: string) => {
    return invoices.filter(invoice => invoice.supplier_id === supplierId);
  };

  const getTotalPurchases = (supplierId: string) => {
    return getSupplierInvoices(supplierId).reduce((sum, invoice) => sum + invoice.total_amount, 0);
  };

  const getOutstandingBalance = (supplierId: string) => {
    return getSupplierInvoices(supplierId).reduce((sum, invoice) => 
      sum + (invoice.total_amount - invoice.paid_amount), 0);
  };

  return (
    <MainLayout>
      <div className="pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Pemasok</h1>
          <p className="text-muted-foreground">
            Kelola data pemasok Anda
          </p>
        </div>
        <Button onClick={() => setIsAddSupplierOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Tambah Pemasok
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Ringkasan Pemasok</CardTitle>
          <CardDescription>Ikhtisar semua transaksi dengan pemasok</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-background p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground">Total Pemasok</p>
              <p className="text-2xl font-bold">{suppliers.length}</p>
              <p className="text-xs text-muted-foreground">
                {suppliers.filter(s => s.status === 'active').length} aktif, {suppliers.filter(s => s.status === 'inactive').length} tidak aktif
              </p>
            </div>
            <div className="bg-background p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground">Total Pembelian</p>
              <p className="text-2xl font-bold">{formatRupiah(invoices.reduce((sum, inv) => sum + inv.total_amount, 0))}</p>
            </div>
            <div className="bg-background p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground">Saldo Terutang</p>
              <p className="text-2xl font-bold">{formatRupiah(invoices.reduce((sum, inv) => sum + (inv.total_amount - inv.paid_amount), 0))}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Daftar Pemasok</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari pemasok..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter Status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="inactive">Tidak Aktif</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Kontak</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total Pembelian</TableHead>
                  <TableHead className="text-right">Saldo Terutang</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSuppliers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      Tidak ada data pemasok yang sesuai
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSuppliers.map((supplier) => (
                    <TableRow key={supplier.id}>
                      <TableCell className="font-medium">{supplier.name}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{supplier.email}</p>
                          <p className="text-muted-foreground">{supplier.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          supplier.status === 'active' 
                            ? 'bg-green-50 text-green-700' 
                            : 'bg-red-50 text-red-700'
                        }`}>
                          {supplier.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {formatRupiah(getTotalPurchases(supplier.id))}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatRupiah(getOutstandingBalance(supplier.id))}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleViewSupplier(supplier)}
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
          <p className="text-sm text-muted-foreground">Menampilkan {filteredSuppliers.length} dari {suppliers.length} pemasok</p>
        </CardFooter>
      </Card>

      {/* Add Supplier Dialog */}
      <Dialog open={isAddSupplierOpen} onOpenChange={setIsAddSupplierOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Tambah Pemasok Baru</DialogTitle>
            <DialogDescription>
              Masukkan informasi pemasok baru untuk sistem Anda.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nama Pemasok</Label>
              <Input
                id="name"
                placeholder="Nama pemasok"
                value={newSupplier.name}
                onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email pemasok"
                  value={newSupplier.email}
                  onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Telepon</Label>
                <Input
                  id="phone"
                  placeholder="Nomor telepon"
                  value={newSupplier.phone}
                  onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Alamat</Label>
              <Input
                id="address"
                placeholder="Alamat pemasok"
                value={newSupplier.address}
                onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={newSupplier.status}
                onValueChange={(value) => setNewSupplier({ ...newSupplier, status: value })}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="inactive">Tidak Aktif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddSupplierOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleAddSupplier}>Tambah Pemasok</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Supplier Dialog */}
      <Dialog open={isViewSupplierOpen} onOpenChange={setIsViewSupplierOpen}>
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle>Detail Pemasok</DialogTitle>
            <DialogDescription>
              Informasi lengkap dan riwayat transaksi pemasok.
            </DialogDescription>
          </DialogHeader>
          {selectedSupplier && (
            <div className="grid gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-medium">{selectedSupplier.name}</h3>
                  <div className="mt-2 space-y-1 text-sm">
                    <p>{selectedSupplier.address}</p>
                    <p>{selectedSupplier.email}</p>
                    <p>{selectedSupplier.phone}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Status:</span>
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      selectedSupplier.status === 'active' 
                        ? 'bg-green-50 text-green-700' 
                        : 'bg-red-50 text-red-700'
                    }`}>
                      {selectedSupplier.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Pembelian:</span>
                    <span className="font-medium">{formatRupiah(getTotalPurchases(selectedSupplier.id))}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Saldo Terutang:</span>
                    <span className="font-medium">{formatRupiah(getOutstandingBalance(selectedSupplier.id))}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Tanggal Daftar:</span>
                    <span>{new Date(selectedSupplier.created_at).toLocaleDateString('id-ID')}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="font-medium mb-2">Riwayat Faktur</h4>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>No. Faktur</TableHead>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getSupplierInvoices(selectedSupplier.id).length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-4">
                            Belum ada faktur dari pemasok ini
                          </TableCell>
                        </TableRow>
                      ) : (
                        getSupplierInvoices(selectedSupplier.id).map((invoice) => (
                          <TableRow key={invoice.id}>
                            <TableCell>{invoice.invoice_number}</TableCell>
                            <TableCell>{new Date(invoice.issue_date).toLocaleDateString('id-ID')}</TableCell>
                            <TableCell>{formatRupiah(invoice.total_amount)}</TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                invoice.status === 'paid' 
                                  ? 'bg-green-50 text-green-700' 
                                  : invoice.status === 'partial'
                                  ? 'bg-yellow-50 text-yellow-700'
                                  : 'bg-red-50 text-red-700'
                              }`}>
                                {invoice.status === 'paid' 
                                  ? 'Lunas' 
                                  : invoice.status === 'partial'
                                  ? 'Sebagian'
                                  : 'Belum Dibayar'}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewSupplierOpen(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Suppliers;
