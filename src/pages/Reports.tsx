
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Calendar, Download, FileText, BarChart, PieChart, TrendingUp, Filter, FileSpreadsheet } from 'lucide-react';
import { AreaChart, Area, BarChart as RechartsBarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Sector } from 'recharts';
import { useToast } from '@/components/ui/use-toast';

// Dummy data for charts
const monthlyData = [
  { name: 'Jan', income: 12500000, expenses: 8700000 },
  { name: 'Feb', income: 14200000, expenses: 9200000 },
  { name: 'Mar', income: 15800000, expenses: 10500000 },
  { name: 'Apr', income: 16500000, expenses: 9800000 },
  { name: 'May', income: 18200000, expenses: 12300000 },
  { name: 'Jun', income: 17500000, expenses: 11500000 },
];

const categoryData = [
  { name: 'Penjualan', value: 45 },
  { name: 'Layanan', value: 25 },
  { name: 'Konsultasi', value: 20 },
  { name: 'Bunga', value: 10 },
];

const expenseCategoryData = [
  { name: 'Gaji', value: 40 },
  { name: 'Sewa', value: 20 },
  { name: 'Utilitas', value: 15 },
  { name: 'Pemasaran', value: 15 },
  { name: 'Lainnya', value: 10 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const Reports: React.FC = () => {
  const { toast } = useToast();
  const [reportType, setReportType] = useState('income-expense');
  const [startDate, setStartDate] = useState('2025-01-01');
  const [endDate, setEndDate] = useState('2025-06-30');
  const [reportPeriod, setReportPeriod] = useState('monthly');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleGenerateReport = () => {
    // This would normally generate the report based on the selected parameters
    console.log('Generating report with:', { reportType, startDate, endDate, reportPeriod });
    toast({
      title: "Laporan berhasil dibuat",
      description: `Laporan ${reportType} untuk periode ${startDate} hingga ${endDate} telah dibuat`
    });
  };

  const downloadReport = (format: 'csv' | 'excel') => {
    // In a real app, this would generate and download the file
    toast({
      title: `Mengunduh laporan dalam format ${format === 'csv' ? 'CSV' : 'Excel'}`,
      description: "File akan diunduh secara otomatis dalam beberapa saat"
    });
    
    // Simulate download delay
    setTimeout(() => {
      toast({
        title: "Unduhan berhasil",
        description: `Laporan dalam format ${format === 'csv' ? 'CSV' : 'Excel'} telah berhasil diunduh`,
        variant: "success"
      });
    }, 2000);
  };

  return (
    <MainLayout>
      <div className="pb-4">
        <h1 className="text-2xl font-bold">Laporan</h1>
        <p className="text-muted-foreground">
          Buat dan lihat laporan keuangan perusahaan
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Parameter Laporan</CardTitle>
          <CardDescription>Pilih jenis dan periode laporan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="report-type">Jenis Laporan</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger id="report-type">
                  <SelectValue placeholder="Pilih jenis laporan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income-expense">Pendapatan & Pengeluaran</SelectItem>
                  <SelectItem value="balance-sheet">Neraca Keuangan</SelectItem>
                  <SelectItem value="cash-flow">Arus Kas</SelectItem>
                  <SelectItem value="profit-loss">Laba Rugi</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="report-period">Periode Laporan</Label>
              <Select value={reportPeriod} onValueChange={setReportPeriod}>
                <SelectTrigger id="report-period">
                  <SelectValue placeholder="Pilih periode laporan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Harian</SelectItem>
                  <SelectItem value="weekly">Mingguan</SelectItem>
                  <SelectItem value="monthly">Bulanan</SelectItem>
                  <SelectItem value="quarterly">Kuartalan</SelectItem>
                  <SelectItem value="yearly">Tahunan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="start-date">Tanggal Mulai</Label>
                <Label htmlFor="end-date">Tanggal Akhir</Label>
              </div>
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="start-date"
                    type="date"
                    className="pl-8"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="relative flex-1">
                  <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="end-date"
                    type="date"
                    className="pl-8"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-between">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Unduh Laporan
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => downloadReport('csv')}>
                  <FileText className="mr-2 h-4 w-4" />
                  <span>CSV (.csv)</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => downloadReport('excel')}>
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  <span>Excel (.xlsx)</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={handleGenerateReport}>
              <FileText className="mr-2 h-4 w-4" />
              Buat Laporan
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="summary" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            <span>Ringkasan</span>
          </TabsTrigger>
          <TabsTrigger value="charts" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            <span>Grafik</span>
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span>Tren</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Ringkasan Pendapatan</CardTitle>
                <CardDescription>Januari - Juni 2025</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm font-medium">Total Pendapatan</span>
                    <span className="font-bold">{formatCurrency(94700000)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm font-medium">Rata-rata Bulanan</span>
                    <span className="font-medium">{formatCurrency(15783333)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm font-medium">Pendapatan Tertinggi</span>
                    <span className="font-medium">{formatCurrency(18200000)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm font-medium">Pendapatan Terendah</span>
                    <span className="font-medium">{formatCurrency(12500000)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm font-medium">Total Transaksi</span>
                    <span className="font-medium">58</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Unduh
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => downloadReport('csv')}>
                      <FileText className="mr-2 h-4 w-4" />
                      <span>CSV (.csv)</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => downloadReport('excel')}>
                      <FileSpreadsheet className="mr-2 h-4 w-4" />
                      <span>Excel (.xlsx)</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ringkasan Pengeluaran</CardTitle>
                <CardDescription>Januari - Juni 2025</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm font-medium">Total Pengeluaran</span>
                    <span className="font-bold">{formatCurrency(62000000)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm font-medium">Rata-rata Bulanan</span>
                    <span className="font-medium">{formatCurrency(10333333)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm font-medium">Pengeluaran Tertinggi</span>
                    <span className="font-medium">{formatCurrency(12300000)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm font-medium">Pengeluaran Terendah</span>
                    <span className="font-medium">{formatCurrency(8700000)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm font-medium">Total Transaksi</span>
                    <span className="font-medium">87</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Unduh
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => downloadReport('csv')}>
                      <FileText className="mr-2 h-4 w-4" />
                      <span>CSV (.csv)</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => downloadReport('excel')}>
                      <FileSpreadsheet className="mr-2 h-4 w-4" />
                      <span>Excel (.xlsx)</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="charts">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Perbandingan Pendapatan dan Pengeluaran</CardTitle>
                  <CardDescription>Januari - Juni 2025</CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Unduh Grafik
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => downloadReport('csv')}>
                      <FileText className="mr-2 h-4 w-4" />
                      <span>CSV (.csv)</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => downloadReport('excel')}>
                      <FileSpreadsheet className="mr-2 h-4 w-4" />
                      <span>Excel (.xlsx)</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={monthlyData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value: number) => formatCurrency(value)} 
                        labelFormatter={(label) => `Bulan: ${label}`}
                      />
                      <Legend />
                      <Bar dataKey="income" name="Pendapatan" fill="#4F46E5" />
                      <Bar dataKey="expenses" name="Pengeluaran" fill="#F43F5E" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Distribusi Pendapatan</CardTitle>
                    <CardDescription>Berdasarkan Kategori</CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Unduh
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => downloadReport('csv')}>
                        <FileText className="mr-2 h-4 w-4" />
                        <span>CSV (.csv)</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => downloadReport('excel')}>
                        <FileSpreadsheet className="mr-2 h-4 w-4" />
                        <span>Excel (.xlsx)</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => `${value}%`} />
                        <Legend />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Distribusi Pengeluaran</CardTitle>
                    <CardDescription>Berdasarkan Kategori</CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Unduh
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => downloadReport('csv')}>
                        <FileText className="mr-2 h-4 w-4" />
                        <span>CSV (.csv)</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => downloadReport('excel')}>
                        <FileSpreadsheet className="mr-2 h-4 w-4" />
                        <span>Excel (.xlsx)</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={expenseCategoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {expenseCategoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => `${value}%`} />
                        <Legend />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="trends">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Tren Keuangan</CardTitle>
                <CardDescription>Januari - Juni 2025</CardDescription>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Unduh Laporan Tren
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => downloadReport('csv')}>
                    <FileText className="mr-2 h-4 w-4" />
                    <span>CSV (.csv)</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => downloadReport('excel')}>
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    <span>Excel (.xlsx)</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={monthlyData}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => formatCurrency(value)} 
                      labelFormatter={(label) => `Bulan: ${label}`}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="income" name="Pendapatan" stroke="#4F46E5" fill="#818CF8" />
                    <Area type="monotone" dataKey="expenses" name="Pengeluaran" stroke="#F43F5E" fill="#FDA4AF" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-background p-4 rounded-lg border">
                  <p className="text-sm text-muted-foreground">Profit Rata-rata</p>
                  <p className="text-xl font-bold">{formatCurrency(5450000)}</p>
                </div>
                <div className="bg-background p-4 rounded-lg border">
                  <p className="text-sm text-muted-foreground">Pertumbuhan Pendapatan</p>
                  <p className="text-xl font-bold text-green-600">+8.2%</p>
                </div>
                <div className="bg-background p-4 rounded-lg border">
                  <p className="text-sm text-muted-foreground">Pertumbuhan Pengeluaran</p>
                  <p className="text-xl font-bold text-red-600">+7.1%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default Reports;
