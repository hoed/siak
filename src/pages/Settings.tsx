
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

const Settings: React.FC = () => {
  const { toast } = useToast();
  const [companySettings, setCompanySettings] = useState({
    name: 'PT Sejahtera Bersama',
    address: 'Jl. Raya Utama No. 123',
    city: 'Jakarta',
    postalCode: '12345',
    phone: '021-12345678',
    email: 'info@sejahterabersama.co.id',
    website: 'www.sejahterabersama.co.id',
    taxId: '01.234.567.8-901.000',
  });

  const [userSettings, setUserSettings] = useState({
    language: 'id',
    theme: 'light',
    currency: 'IDR',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    notification: true,
  });

  const [systemSettings, setSystemSettings] = useState({
    backupFrequency: 'daily',
    retentionPeriod: '30',
    dataExport: 'csv',
    autoLogout: '30',
  });

  const handleCompanySettingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompanySettings({
      ...companySettings,
      [e.target.name]: e.target.value,
    });
  };

  const handleUserSettingChange = (field: string, value: string | boolean) => {
    setUserSettings({
      ...userSettings,
      [field]: value,
    });
  };

  const handleSystemSettingChange = (field: string, value: string) => {
    setSystemSettings({
      ...systemSettings,
      [field]: value,
    });
  };

  const saveSettings = (type: 'company' | 'user' | 'system') => {
    // In a real app, this would save to a database
    toast({
      title: "Berhasil",
      description: `Pengaturan ${type === 'company' ? 'perusahaan' : type === 'user' ? 'pengguna' : 'sistem'} telah disimpan.`,
    });
  };

  return (
    <MainLayout>
      <div className="pb-4">
        <h1 className="text-2xl font-bold">Pengaturan</h1>
        <p className="text-muted-foreground">
          Konfigurasi aplikasi dan preferensi pengguna
        </p>
      </div>

      <Tabs defaultValue="company" className="space-y-4">
        <TabsList>
          <TabsTrigger value="company">Perusahaan</TabsTrigger>
          <TabsTrigger value="user">Pengguna</TabsTrigger>
          <TabsTrigger value="system">Sistem</TabsTrigger>
        </TabsList>
        
        {/* Company Settings */}
        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Perusahaan</CardTitle>
              <CardDescription>
                Informasi dasar tentang perusahaan Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Nama Perusahaan</Label>
                    <Input
                      id="companyName"
                      name="name"
                      value={companySettings.name}
                      onChange={handleCompanySettingChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taxId">NPWP</Label>
                    <Input
                      id="taxId"
                      name="taxId"
                      value={companySettings.taxId}
                      onChange={handleCompanySettingChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Alamat</Label>
                  <Input
                    id="address"
                    name="address"
                    value={companySettings.address}
                    onChange={handleCompanySettingChange}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Kota</Label>
                    <Input
                      id="city"
                      name="city"
                      value={companySettings.city}
                      onChange={handleCompanySettingChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Kode Pos</Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      value={companySettings.postalCode}
                      onChange={handleCompanySettingChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telepon</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={companySettings.phone}
                      onChange={handleCompanySettingChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={companySettings.email}
                      onChange={handleCompanySettingChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    name="website"
                    value={companySettings.website}
                    onChange={handleCompanySettingChange}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => saveSettings('company')}>Simpan Perubahan</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* User Settings */}
        <TabsContent value="user">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Pengguna</CardTitle>
              <CardDescription>
                Preferensi pengguna untuk tampilan dan penggunaan aplikasi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Bahasa</Label>
                    <Select
                      value={userSettings.language}
                      onValueChange={(value) => handleUserSettingChange('language', value)}
                    >
                      <SelectTrigger id="language">
                        <SelectValue placeholder="Pilih bahasa" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="id">Bahasa Indonesia</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="theme">Tema</Label>
                    <Select
                      value={userSettings.theme}
                      onValueChange={(value) => handleUserSettingChange('theme', value)}
                    >
                      <SelectTrigger id="theme">
                        <SelectValue placeholder="Pilih tema" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Terang</SelectItem>
                        <SelectItem value="dark">Gelap</SelectItem>
                        <SelectItem value="system">Sistem</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currency">Mata Uang</Label>
                    <Select
                      value={userSettings.currency}
                      onValueChange={(value) => handleUserSettingChange('currency', value)}
                    >
                      <SelectTrigger id="currency">
                        <SelectValue placeholder="Pilih mata uang" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IDR">Rupiah (IDR)</SelectItem>
                        <SelectItem value="USD">US Dollar (USD)</SelectItem>
                        <SelectItem value="EUR">Euro (EUR)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateFormat">Format Tanggal</Label>
                    <Select
                      value={userSettings.dateFormat}
                      onValueChange={(value) => handleUserSettingChange('dateFormat', value)}
                    >
                      <SelectTrigger id="dateFormat">
                        <SelectValue placeholder="Pilih format tanggal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="timeFormat">Format Waktu</Label>
                    <Select
                      value={userSettings.timeFormat}
                      onValueChange={(value) => handleUserSettingChange('timeFormat', value)}
                    >
                      <SelectTrigger id="timeFormat">
                        <SelectValue placeholder="Pilih format waktu" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12h">12 jam (AM/PM)</SelectItem>
                        <SelectItem value="24h">24 jam</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => saveSettings('user')}>Simpan Perubahan</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* System Settings */}
        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Sistem</CardTitle>
              <CardDescription>
                Konfigurasi teknis dan keamanan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="backupFrequency">Frekuensi Backup</Label>
                    <Select
                      value={systemSettings.backupFrequency}
                      onValueChange={(value) => handleSystemSettingChange('backupFrequency', value)}
                    >
                      <SelectTrigger id="backupFrequency">
                        <SelectValue placeholder="Pilih frekuensi" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Per Jam</SelectItem>
                        <SelectItem value="daily">Harian</SelectItem>
                        <SelectItem value="weekly">Mingguan</SelectItem>
                        <SelectItem value="monthly">Bulanan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="retentionPeriod">Periode Retensi (hari)</Label>
                    <Input
                      id="retentionPeriod"
                      type="number"
                      value={systemSettings.retentionPeriod}
                      onChange={(e) => handleSystemSettingChange('retentionPeriod', e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dataExport">Format Ekspor Data</Label>
                    <Select
                      value={systemSettings.dataExport}
                      onValueChange={(value) => handleSystemSettingChange('dataExport', value)}
                    >
                      <SelectTrigger id="dataExport">
                        <SelectValue placeholder="Pilih format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                        <SelectItem value="pdf">PDF</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="autoLogout">Otomatis Logout (menit)</Label>
                    <Input
                      id="autoLogout"
                      type="number"
                      value={systemSettings.autoLogout}
                      onChange={(e) => handleSystemSettingChange('autoLogout', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => saveSettings('system')}>Simpan Perubahan</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default Settings;
