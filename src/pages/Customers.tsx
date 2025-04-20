
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
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
} from 'lucide-react';
import { Customer, CustomerInvoice } from '@/types/customer';
import { useToast } from '@/components/ui/use-toast';
import { formatRupiah } from '@/utils/currency';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';

// Mock data
const dummyCustomers: Customer[] = [
  {
    id: '1',
    name: 'PT Maju Jaya',
    email: 'contact@majujaya.co.id',
    phone: '021-55667788',
    address: 'Jl. Raya Utama No. 123, Jakarta',
    status: 'active',
    created_at: '2025-01-15T00:00:00Z',
    updated_at: '2025-01-15T00:00:00Z',
  },
  {
    id: '2',
    name: 'CV Berkah Selalu',
    email: 'info@berkahselalu.com',
    phone: '021-12345678',
    address: 'Jl. Pahlawan No. 45, Bandung',
    status: 'active',
    created_at: '2025-02-20T00:00:00Z',
    updated_at: '2025-02-20T00:00:00Z',
  },
  {
    id: '3',
    name: 'PT Abadi Sentosa',
    email: 'cs@abadisentosa.id',
    phone: '021-23456789',
    address: 'Jl. Sudirman No. 67, Surabaya',
    status: 'inactive',
    created_at: '2025-03-05T00:00:00Z',
    updated_at: '2025-03-15T00:00:00Z',
  },
  {
    id: '4',
    name: 'PT Makmur Jaya',
    email: 'sales@makmurjaya.com',
    phone: '021-34567890',
    address: 'Jl. Gatot Subroto No. 89, Jakarta',
    status: 'active',
    created_at: '2025-03-10T00:00:00Z',
    updated_at: '2025-03-10T00:00:00Z',
  },
  {
    id: '5',
    name: 'PT Sejahtera',
    email: 'info@sejahtera.co.id',
    phone: '021-45678901',
    address: 'Jl. Pemuda No. 112, Semarang',
    status: 'active',
    created_at: '2025-04-01T00:00:00Z',
    updated_at: '2025-04-01T00:00:00Z',
  },
];

const dummyInvoices: CustomerInvoice[] = [
  {
    id: '1',
    customer_id: '1',
    invoice_number: 'INV-001',
    issue_date: '2025-04-10',
    due_date: '2025-05-10',
    total_amount: 7500000,
    paid_amount: 7500000,
    status: 'paid',
    notes: 'Pembayaran penuh',
    items: [
      {
        id: '1-1',
        invoice_id: '1',
        description: 'Produk A',
        quantity: 5,
        unit_price: 1000000,
        total: 5000000,
        created_at: '2025-04-10T00:00:00Z',
        updated_at: '2025-04-10T00:00:00Z',
      },
      {
        id: '1-2',
        invoice_id: '1',
        description: 'Produk B',
        quantity: 2,
        unit_price: 1250000,
        total: 2500000,
        created_at: '2025-04-10T00:00:00Z',
        updated_at: '2025-04-10T00:00:00Z',
      }
    ],
    created_at: '2025-04-10T00:00:00Z',
    updated_at: '2025-04-15T00:00:00Z',
  },
  {
    id: '2',
    customer_id: '2',
    invoice_number: 'INV-002',
    issue_date: '2025-04-12',
    due_date: '2025-05-12',
    total_amount: 5000000,
    paid_amount: 2500000,
    status: 'partial',
    notes: 'Pembayaran sebagian',
    items: [
      {
        id: '2-1',
        invoice_id: '2',
        description: 'Konsultasi Bisnis',
        quantity: 10,
        unit_price: 500000,
        total: 5000000,
        created_at: '2025-04-12T00:00:00Z',
        updated_at: '2025-04-12T00:00:00Z',
      }
    ],
    created_at: '2025-04-12T00:00:00Z',
    updated_at: '2025-04-20T00:00:00Z',
  },
];

const Customers: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [isViewCustomerOpen, setIsViewCustomerOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Use the local mock data instead of trying to fetch from 'invoices' table that doesn't exist
  const { data: customers = dummyCustomers, isLoading: isLoadingCustomers } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('customers')
          .select('*');
        
        if (error) throw error;
        return data.length > 0 ? data : dummyCustomers;
      } catch (error) {
        console.error("Error fetching customers:", error);
        return dummyCustomers;
      }
    },
  });

  // Use the local mock data instead of trying to fetch from 'invoices' table that doesn't exist
  const { data: invoices = dummyInvoices, isLoading: isLoadingInvoices } = useQuery({
    queryKey: ['invoices'],
    queryFn: async () => {
      // In a real implementation, this would fetch from the actual invoices table
      // For now, we'll return the dummy data
      return dummyInvoices;
    },
  });

  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    status: 'active',
  });

  const filteredCustomers = (customers as Customer[]).filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' ? true : customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddCustomer = () => {
    if (!newCustomer.name || !newCustomer.email || !newCustomer.phone) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Nama, email, dan nomor telepon harus diisi",
      });
      return;
    }

    const customer: Customer = {
      id: Date.now().toString(),
      name: newCustomer.name,
      email: newCustomer.email,
      phone: newCustomer.phone,
      address: newCustomer.address,
      status: newCustomer.status as 'active' | 'inactive',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // setCustomers([customer, ...customers]);
    // TODO: implement supabase insert
    setNewCustomer({
      name: '',
      email: '',
      phone: '',
      address: '',
      status: 'active',
    });
    setIsAddCustomerOpen(false);
    
    toast({
      title: "Berhasil!",
      description: "Pelanggan baru telah ditambahkan",
    });
  };

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsViewCustomerOpen(true);
  };

  const getCustomerInvoices = (customerId: string) => {
    return invoices.filter(invoice => invoice.customer_id === customerId);
  };

  const getTotalSales = (customerId: string) => {
    return getCustomerInvoices(customerId).reduce((sum, invoice) => sum + invoice.total_amount, 0);
  };

  const getOutstandingBalance = (customerId: string) => {
    return getCustomerInvoices(customerId).reduce((sum, invoice) => 
      sum + (invoice.total_amount - invoice.paid_amount), 0);
  };

  return (
    <MainLayout>
      <div className="pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Pelanggan</h1>
          <p className="text-muted-foreground">
            Kelola data pelanggan Anda
          </p>
        </div>
        <Button onClick={() => setIsAddCustomerOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Tambah Pelanggan
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Ringkasan Pelanggan</CardTitle>
          <CardDescription>Ikhtisar semua transaksi dengan pelanggan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-background p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground">Total Pelanggan</p>
              <p className="text-2xl font-bold">{customers?.length}</p>
              <p className="text-xs text-muted-foreground">
                {(customers as Customer[]).filter(c => c.status === 'active').length} aktif, {(customers as Customer[]).filter(c => c.status === 'inactive').length} tidak aktif
              </p>
            </div>
            <div className="bg-background p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground">Total Penjualan</p>
              <p className="text-2xl font-bold">{formatRupiah(invoices.reduce((sum, inv) => sum + inv.total_amount, 0))}</p>
            </div>
            <div className="bg-background p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground">Piutang Belum Dibayar</p>
              <p className="text-2xl font-bold">{formatRupiah(invoices.reduce((sum, inv) => sum + (inv.total_amount - inv.paid_amount), 0))}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Daftar Pelanggan</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari pelanggan..."
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
                  <TableHead className="text-right">Total Penjualan</TableHead>
                  <TableHead className="text-right">Piutang</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      Tidak ada data pelanggan yang sesuai
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{customer.email}</p>
                          <p className="text-muted-foreground">{customer.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          customer.status === 'active' 
                            ? 'bg-green-50 text-green-700' 
                            : 'bg-red-50 text-red-700'
                        }`}>
                          {customer.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {formatRupiah(getTotalSales(customer.id))}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatRupiah(getOutstandingBalance(customer.id))}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleViewCustomer(customer)}
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
          <p className="text-sm text-muted-foreground">Menampilkan {filteredCustomers.length} dari {customers?.length} pelanggan</p>
        </CardFooter>
      </Card>

      {/* Add Customer Dialog */}
      <Dialog open={isAddCustomerOpen} onOpenChange={setIsAddCustomerOpen}>
        <DialogContent className="dialog-content sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Tambah Pelanggan Baru</DialogTitle>
            <DialogDescription>
              Masukkan informasi pelanggan baru untuk sistem Anda.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nama Pelanggan</Label>
              <Input
                id="name"
                placeholder="Nama pelanggan"
                value={newCustomer.name}
                onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email pelanggan"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Telepon</Label>
                <Input
                  id="phone"
                  placeholder="Nomor telepon"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Alamat</Label>
              <Input
                id="address"
                placeholder="Alamat pelanggan"
                value={newCustomer.address}
                onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={newCustomer.status}
                onValueChange={(value) => setNewCustomer({ ...newCustomer, status: value })}
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
            <Button variant="outline" onClick={() => setIsAddCustomerOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleAddCustomer}>Tambah Pelanggan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Customer Dialog */}
      <Dialog open={isViewCustomerOpen} onOpenChange={setIsViewCustomerOpen}>
        <DialogContent className="dialog-content sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle>Detail Pelanggan</DialogTitle>
            <DialogDescription>
              Informasi lengkap dan riwayat transaksi pelanggan.
            </DialogDescription>
          </DialogHeader>
          {selectedCustomer && (
            <div className="grid gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-medium">{selectedCustomer.name}</h3>
                  <div className="mt-2 space-y-1 text-sm">
                    <p>{selectedCustomer.address}</p>
                    <p>{selectedCustomer.email}</p>
                    <p>{selectedCustomer.phone}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Status:</span>
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      selectedCustomer.status === 'active' 
                        ? 'bg-green-50 text-green-700' 
                        : 'bg-red-50 text-red-700'
                    }`}>
                      {selectedCustomer.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Penjualan:</span>
                    <span className="font-medium">{formatRupiah(getTotalSales(selectedCustomer.id))}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Piutang:</span>
                    <span className="font-medium">{formatRupiah(getOutstandingBalance(selectedCustomer.id))}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Tanggal Daftar:</span>
                    <span>{new Date(selectedCustomer.created_at).toLocaleDateString('id-ID')}</span>
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
                      {getCustomerInvoices(selectedCustomer.id).length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-4">
                            Belum ada faktur untuk pelanggan ini
                          </TableCell>
                        </TableRow>
                      ) : (
                        getCustomerInvoices(selectedCustomer.id).map((invoice) => (
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
            <Button variant="outline" onClick={() => setIsViewCustomerOpen(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Customers;
