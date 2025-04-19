
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CalendarIcon, Download, FileText, Plus, Printer, Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getTaxReports } from '@/services/taxService';
import { toast } from 'sonner';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { TaxReport } from '@/types/food-manufacturing';

const TaxReports: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReportType, setSelectedReportType] = useState<string>('');
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth() - 3, 1),
    to: new Date(),
  });
  const [isNewReportDialogOpen, setIsNewReportDialogOpen] = useState(false);

  // Fetch tax reports
  const {
    data: taxReports = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['taxReports', selectedReportType, date],
    queryFn: () =>
      getTaxReports({
        reportType: selectedReportType || undefined,
        dateRange: date
          ? {
              start: date.from ? format(date.from, 'yyyy-MM-dd') : undefined,
              end: date.to ? format(date.to, 'yyyy-MM-dd') : undefined,
            }
          : undefined,
        searchQuery: searchQuery || undefined,
      }),
  });

  if (error) {
    toast.error('Gagal memuat data laporan pajak');
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const filteredReports = taxReports.filter(
    (report) =>
      report.referenceNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reportType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.notes?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return (
          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
            Draft
          </span>
        );
      case 'submitted':
        return (
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
            Terkirim
          </span>
        );
      case 'paid':
        return (
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
            Terbayar
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
            {status}
          </span>
        );
    }
  };

  const getReportTypeName = (type: string) => {
    switch (type) {
      case 'sales':
        return 'Pajak Penjualan';
      case 'income':
        return 'Pajak Penghasilan';
      case 'vat':
        return 'PPN';
      default:
        return 'Lainnya';
    }
  };

  return (
    <MainLayout>
      <div className="pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Laporan Pajak</h1>
          <p className="text-muted-foreground">
            Kelola dan pantau pelaporan pajak perusahaan
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Cetak Laporan
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Ekspor Excel
          </Button>
          <Button onClick={() => setIsNewReportDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Buat Laporan Baru
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filter Laporan</CardTitle>
          <CardDescription>Pilih jenis dan periode untuk melihat laporan pajak</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">Jenis Pajak</label>
              <Select value={selectedReportType} onValueChange={setSelectedReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis pajak" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Semua Jenis</SelectItem>
                  <SelectItem value="sales">Pajak Penjualan</SelectItem>
                  <SelectItem value="income">Pajak Penghasilan</SelectItem>
                  <SelectItem value="vat">PPN</SelectItem>
                  <SelectItem value="other">Lainnya</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">Periode</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, 'dd MMMM yyyy', { locale: id })} -{' '}
                          {format(date.to, 'dd MMMM yyyy', { locale: id })}
                        </>
                      ) : (
                        format(date.from, 'dd MMMM yyyy', { locale: id })
                      )
                    ) : (
                      <span>Pilih tanggal</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    locale={id}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">Cari</label>
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari berdasarkan nomor referensi atau catatan"
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Laporan Pajak</CardTitle>
          <CardDescription>
            Menampilkan laporan pajak yang sudah diproses dan yang tertunda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nomor Referensi</TableHead>
                  <TableHead>Jenis Pajak</TableHead>
                  <TableHead>Periode</TableHead>
                  <TableHead>Jatuh Tempo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Jumlah Pajak</TableHead>
                  <TableHead className="text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6">
                      Memuat data...
                    </TableCell>
                  </TableRow>
                ) : filteredReports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6">
                      Tidak ditemukan data laporan pajak. Ubah filter atau periode untuk melihat data.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReports.map((report: TaxReport) => (
                    <TableRow key={report.id}>
                      <TableCell>
                        {report.referenceNumber || '-'}
                      </TableCell>
                      <TableCell>{getReportTypeName(report.reportType)}</TableCell>
                      <TableCell>
                        {format(new Date(report.periodStart), 'dd MMM yyyy', { locale: id })} -{' '}
                        {format(new Date(report.periodEnd), 'dd MMM yyyy', { locale: id })}
                      </TableCell>
                      <TableCell>
                        {format(new Date(report.dueDate), 'dd MMM yyyy', { locale: id })}
                      </TableCell>
                      <TableCell>{getStatusBadge(report.status)}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(report.totalTaxAmount)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button variant="ghost" size="icon">
                          <FileText className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            Menampilkan {filteredReports.length} laporan pajak
          </p>
        </CardFooter>
      </Card>

      <Dialog open={isNewReportDialogOpen} onOpenChange={setIsNewReportDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Buat Laporan Pajak Baru</DialogTitle>
            <DialogDescription>
              Isi semua informasi yang diperlukan untuk membuat laporan pajak baru.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Jenis Pajak</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis pajak" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales">Pajak Penjualan</SelectItem>
                    <SelectItem value="income">Pajak Penghasilan</SelectItem>
                    <SelectItem value="vat">PPN</SelectItem>
                    <SelectItem value="other">Lainnya</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Nomor Referensi</label>
                <Input placeholder="Masukkan nomor referensi" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Periode Mulai</label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Periode Selesai</label>
                <Input type="date" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tanggal Jatuh Tempo</label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Jumlah Pajak</label>
                <Input type="number" placeholder="0" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Catatan</label>
              <Input placeholder="Catatan tambahan tentang laporan pajak ini" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewReportDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={() => setIsNewReportDialogOpen(false)}>
              Buat Laporan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default TaxReports;
