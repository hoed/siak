
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Lock, Building, Bell, Moon, Sun, Languages, CreditCard } from 'lucide-react';
import { useAuth } from '@/contexts/auth/AuthContext';

const Settings: React.FC = () => {
  const { toast } = useToast();
  const { user, updateUser } = useAuth();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(true);
  
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '081234567890',
    bio: 'Akun Pengguna SisKeu',
    profileImage: user?.profileImage || ''
  });
  
  const [company, setCompany] = useState({
    name: 'PT Contoh Usaha',
    address: 'Jl. Contoh No. 123, Jakarta Selatan',
    phone: '021-1234567',
    email: 'info@contohusaha.com',
    website: 'www.contohusaha.com',
    taxId: '123456789012345'
  });
  
  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const handleSaveProfile = () => {
    // In a real app, you would send a request to update the profile
    updateUser({
      name: profile.name,
      profileImage: profile.profileImage
    });
    
    toast({
      title: 'Profil diperbarui',
      description: 'Informasi profil Anda telah diperbarui',
    });
  };
  
  const handleSaveCompany = () => {
    toast({
      title: 'Profil perusahaan diperbarui',
      description: 'Informasi perusahaan Anda telah diperbarui',
    });
  };
  
  const handleChangePassword = () => {
    if (password.new !== password.confirm) {
      toast({
        variant: 'destructive',
        title: 'Perubahan kata sandi gagal',
        description: 'Kata sandi baru dan konfirmasi kata sandi tidak sama',
      });
      return;
    }
    
    if (password.new.length < 8) {
      toast({
        variant: 'destructive',
        title: 'Perubahan kata sandi gagal',
        description: 'Kata sandi baru harus memiliki minimal 8 karakter',
      });
      return;
    }
    
    toast({
      title: 'Kata sandi diperbarui',
      description: 'Kata sandi Anda telah berhasil diperbarui',
    });
    
    setPassword({
      current: '',
      new: '',
      confirm: ''
    });
  };
  
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
    
    toast({
      title: `Mode ${isDarkMode ? 'Terang' : 'Gelap'} diaktifkan`,
      description: `Tampilan aplikasi telah diubah ke mode ${isDarkMode ? 'terang' : 'gelap'}`,
    });
  };

  return (
    <MainLayout>
      <div className="pb-4">
        <h1 className="text-2xl font-bold">Pengaturan</h1>
        <p className="text-muted-foreground">
          Kelola pengaturan akun dan aplikasi
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 w-full">
          <TabsTrigger value="profile" className="flex items-center">
            <User className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Profil</span>
          </TabsTrigger>
          <TabsTrigger value="company" className="flex items-center">
            <Building className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Perusahaan</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center">
            <Lock className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Keamanan</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center">
            <Bell className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Notifikasi</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center">
            <Sun className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Tampilan</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profil Pengguna</CardTitle>
              <CardDescription>
                Kelola informasi profil Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center justify-center mb-6">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={user?.profileImage || ''} alt={user?.name || ''} />
                  <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                    {user?.name?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm">
                  Unggah Foto
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">Nama Lengkap</label>
                  <Input 
                    id="name" 
                    value={profile.name} 
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={profile.email} 
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                    disabled
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">Nomor Telepon</label>
                  <Input 
                    id="phone" 
                    value={profile.phone} 
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="role" className="text-sm font-medium">Peran</label>
                  <Input 
                    id="role" 
                    value={user?.role === 'admin' ? 'Administrator' : user?.role === 'manager' ? 'Manajer' : 'Pengguna'} 
                    disabled
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="bio" className="text-sm font-medium">Bio</label>
                  <Textarea 
                    id="bio" 
                    value={profile.bio} 
                    onChange={(e) => setProfile({...profile, bio: e.target.value})}
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Reset</Button>
              <Button onClick={handleSaveProfile}>Simpan Perubahan</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Company Tab */}
        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>Profil Perusahaan</CardTitle>
              <CardDescription>
                Kelola informasi perusahaan Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="companyName" className="text-sm font-medium">Nama Perusahaan</label>
                  <Input 
                    id="companyName" 
                    value={company.name} 
                    onChange={(e) => setCompany({...company, name: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="taxId" className="text-sm font-medium">NPWP</label>
                  <Input 
                    id="taxId" 
                    value={company.taxId} 
                    onChange={(e) => setCompany({...company, taxId: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="address" className="text-sm font-medium">Alamat</label>
                  <Textarea 
                    id="address" 
                    value={company.address} 
                    onChange={(e) => setCompany({...company, address: e.target.value})}
                    rows={2}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="companyPhone" className="text-sm font-medium">Telepon</label>
                  <Input 
                    id="companyPhone" 
                    value={company.phone} 
                    onChange={(e) => setCompany({...company, phone: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="companyEmail" className="text-sm font-medium">Email</label>
                  <Input 
                    id="companyEmail" 
                    type="email"
                    value={company.email} 
                    onChange={(e) => setCompany({...company, email: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="website" className="text-sm font-medium">Website</label>
                  <Input 
                    id="website" 
                    value={company.website} 
                    onChange={(e) => setCompany({...company, website: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="currency" className="text-sm font-medium">Mata Uang</label>
                  <Select defaultValue="IDR">
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih mata uang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IDR">Rupiah (IDR)</SelectItem>
                      <SelectItem value="USD">Dollar AS (USD)</SelectItem>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                      <SelectItem value="SGD">Dollar Singapura (SGD)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Reset</Button>
              <Button onClick={handleSaveCompany}>Simpan Perubahan</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Security Tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Keamanan</CardTitle>
              <CardDescription>
                Kelola setelan keamanan akun Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Ubah Kata Sandi</h3>
                <Separator />
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="currentPassword" className="text-sm font-medium">Kata Sandi Saat Ini</label>
                    <Input 
                      id="currentPassword" 
                      type="password"
                      value={password.current} 
                      onChange={(e) => setPassword({...password, current: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="newPassword" className="text-sm font-medium">Kata Sandi Baru</label>
                    <Input 
                      id="newPassword" 
                      type="password"
                      value={password.new} 
                      onChange={(e) => setPassword({...password, new: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-sm font-medium">Konfirmasi Kata Sandi Baru</label>
                    <Input 
                      id="confirmPassword" 
                      type="password"
                      value={password.confirm} 
                      onChange={(e) => setPassword({...password, confirm: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 mt-6">
                <h3 className="text-lg font-medium">Sesi Masuk</h3>
                <Separator />
                
                <div className="bg-background rounded-lg p-4 border">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Sesi Saat Ini</p>
                      <p className="text-sm text-muted-foreground">Jakarta, Indonesia • Chrome • Windows</p>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700">Aktif</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleChangePassword}>Ubah Kata Sandi</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notifikasi</CardTitle>
              <CardDescription>
                Atur preferensi notifikasi Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notifikasi Aplikasi</h3>
                <Separator />
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label htmlFor="app-notifications" className="text-sm font-medium">Notifikasi Aplikasi</label>
                      <p className="text-sm text-muted-foreground">
                        Aktifkan notifikasi dalam aplikasi
                      </p>
                    </div>
                    <Switch 
                      id="app-notifications" 
                      checked={notificationsEnabled}
                      onCheckedChange={setNotificationsEnabled}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label htmlFor="transaction-notifications" className="text-sm font-medium">Notifikasi Transaksi</label>
                      <p className="text-sm text-muted-foreground">
                        Dapatkan pemberitahuan untuk transaksi baru
                      </p>
                    </div>
                    <Switch id="transaction-notifications" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label htmlFor="reminder-notifications" className="text-sm font-medium">Pengingat</label>
                      <p className="text-sm text-muted-foreground">
                        Dapatkan pengingat untuk hutang dan piutang yang akan jatuh tempo
                      </p>
                    </div>
                    <Switch id="reminder-notifications" defaultChecked />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 mt-6">
                <h3 className="text-lg font-medium">Notifikasi Email</h3>
                <Separator />
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label htmlFor="email-notifications" className="text-sm font-medium">Notifikasi Email</label>
                      <p className="text-sm text-muted-foreground">
                        Aktifkan notifikasi melalui email
                      </p>
                    </div>
                    <Switch 
                      id="email-notifications" 
                      checked={emailNotificationsEnabled}
                      onCheckedChange={setEmailNotificationsEnabled}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label htmlFor="summary-email" className="text-sm font-medium">Ringkasan Mingguan</label>
                      <p className="text-sm text-muted-foreground">
                        Dapatkan ringkasan laporan mingguan melalui email
                      </p>
                    </div>
                    <Switch id="summary-email" defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Simpan Preferensi</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Appearance Tab */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Tampilan</CardTitle>
              <CardDescription>
                Sesuaikan tampilan aplikasi
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Tema</h3>
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label htmlFor="dark-mode" className="text-sm font-medium">Mode Gelap</label>
                    <p className="text-sm text-muted-foreground">
                      Beralih antara mode terang dan gelap
                    </p>
                  </div>
                  <div className="flex items-center">
                    <Sun className="h-4 w-4 mr-2" />
                    <Switch 
                      id="dark-mode" 
                      checked={isDarkMode}
                      onCheckedChange={toggleDarkMode}
                    />
                    <Moon className="h-4 w-4 ml-2" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 mt-6">
                <h3 className="text-lg font-medium">Bahasa</h3>
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label htmlFor="language" className="text-sm font-medium">Bahasa Aplikasi</label>
                    <p className="text-sm text-muted-foreground">
                      Pilih bahasa yang digunakan dalam aplikasi
                    </p>
                  </div>
                  <div className="w-[180px]">
                    <Select defaultValue="id">
                      <SelectTrigger>
                        <div className="flex items-center">
                          <Languages className="h-4 w-4 mr-2" />
                          <SelectValue placeholder="Pilih bahasa" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="id">Bahasa Indonesia</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Simpan Preferensi</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default Settings;
