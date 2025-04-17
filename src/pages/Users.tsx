
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, UserPlus, MoreHorizontal, Edit, Trash2, UserCog, Shield, BadgeCheck } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  status: 'active' | 'inactive';
  profileImage?: string;
  lastActive: string;
}

const UsersPage: React.FC = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Mock user data
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Ahmad Syauqi',
      email: 'ahmad@example.com',
      role: 'admin',
      status: 'active',
      lastActive: '2025-04-15 08:30:22'
    },
    {
      id: '2',
      name: 'Budi Santoso',
      email: 'budi@example.com',
      role: 'manager',
      status: 'active',
      lastActive: '2025-04-16 14:45:10'
    },
    {
      id: '3',
      name: 'Citra Dewi',
      email: 'citra@example.com',
      role: 'user',
      status: 'inactive',
      lastActive: '2025-04-10 09:12:33'
    },
    {
      id: '4',
      name: 'Deni Cahyadi',
      email: 'deni@example.com',
      role: 'user',
      status: 'active',
      lastActive: '2025-04-16 11:20:45'
    },
    {
      id: '5',
      name: 'Eka Putri',
      email: 'eka@example.com',
      role: 'manager',
      status: 'active',
      lastActive: '2025-04-15 16:55:18'
    },
    {
      id: '6',
      name: 'Hudhoed',
      email: 'hudhoed@rumahost.com',
      role: 'admin',
      status: 'active',
      lastActive: '2025-04-17 10:30:00'
    }
  ]);
  
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'user' as const,
    password: '',
    confirmPassword: ''
  });
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast({
        title: "Data tidak lengkap",
        description: "Mohon lengkapi semua field yang diperlukan",
        variant: "destructive"
      });
      return;
    }
    
    if (newUser.password !== newUser.confirmPassword) {
      toast({
        title: "Kata sandi tidak sama",
        description: "Kata sandi dan konfirmasi kata sandi harus sama",
        variant: "destructive"
      });
      return;
    }
    
    const newId = (users.length + 1).toString();
    const currentDate = new Date().toISOString().replace('T', ' ').substring(0, 19);
    
    setUsers([...users, {
      id: newId,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: 'active',
      lastActive: currentDate
    }]);
    
    setNewUser({
      name: '',
      email: '',
      role: 'user',
      password: '',
      confirmPassword: ''
    });
    
    setIsAddUserOpen(false);
    
    toast({
      title: "Pengguna berhasil ditambahkan",
      description: `Pengguna baru ${newUser.name} telah berhasil ditambahkan`,
    });
  };
  
  const handleEditUser = () => {
    if (!selectedUser) return;
    
    setUsers(users.map(user => 
      user.id === selectedUser.id ? selectedUser : user
    ));
    
    setIsEditUserOpen(false);
    
    toast({
      title: "Pengguna berhasil diperbarui",
      description: `Data pengguna ${selectedUser.name} telah berhasil diperbarui`,
    });
  };
  
  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
    
    toast({
      title: "Pengguna berhasil dihapus",
      description: "Data pengguna telah berhasil dihapus dari sistem",
    });
  };
  
  const handleChangeStatus = (userId: string, newStatus: 'active' | 'inactive') => {
    setUsers(users.map(user => 
      user.id === userId ? {...user, status: newStatus} : user
    ));
    
    toast({
      title: `Status pengguna diubah menjadi ${newStatus === 'active' ? 'aktif' : 'tidak aktif'}`,
      description: "Status pengguna telah berhasil diperbarui",
    });
  };
  
  const handleChangeRole = (userId: string, newRole: 'admin' | 'manager' | 'user') => {
    setUsers(users.map(user => 
      user.id === userId ? {...user, role: newRole} : user
    ));
    
    toast({
      title: `Peran pengguna diubah`,
      description: `Peran pengguna telah diubah menjadi ${
        newRole === 'admin' ? 'Administrator' : 
        newRole === 'manager' ? 'Manajer' : 'Pengguna'
      }`,
    });
  };

  return (
    <MainLayout>
      <div className="pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Pengguna</h1>
          <p className="text-muted-foreground">
            Kelola pengguna dan hak akses sistem
          </p>
        </div>
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Tambah Pengguna
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Pengguna Baru</DialogTitle>
              <DialogDescription>
                Buat akun pengguna baru untuk SisKeu.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Nama Lengkap</label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  placeholder="Nama lengkap pengguna"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  placeholder="email@example.com"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="role" className="text-sm font-medium">Peran</label>
                <Select
                  value={newUser.role}
                  onValueChange={(value) => setNewUser({...newUser, role: value as any})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih peran pengguna" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Pengguna</SelectItem>
                    <SelectItem value="manager">Manajer</SelectItem>
                    <SelectItem value="admin">Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">Kata Sandi</label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  placeholder="Minimal 8 karakter"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">Konfirmasi Kata Sandi</label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={newUser.confirmPassword}
                  onChange={(e) => setNewUser({...newUser, confirmPassword: e.target.value})}
                  placeholder="Konfirmasi kata sandi"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleAddUser}>
                Tambah Pengguna
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Daftar Pengguna</CardTitle>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Cari pengguna..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Peran</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Terakhir Aktif</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Tidak ada pengguna yang ditemukan
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.profileImage} alt={user.name} />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {user.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant={user.role === 'admin' ? 'default' : user.role === 'manager' ? 'secondary' : 'outline'}
                      >
                        {user.role === 'admin' ? (
                          <Shield className="h-3 w-3 mr-1 inline" />
                        ) : user.role === 'manager' ? (
                          <UserCog className="h-3 w-3 mr-1 inline" />
                        ) : (
                          <BadgeCheck className="h-3 w-3 mr-1 inline" />
                        )}
                        {user.role === 'admin' ? 'Admin' : user.role === 'manager' ? 'Manajer' : 'Pengguna'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={user.status === 'active' ? 'outline' : 'secondary'}
                        className={user.status === 'active' ? 'bg-green-50 text-green-700 hover:bg-green-50' : 'bg-gray-100 text-gray-700 hover:bg-gray-100'}
                      >
                        {user.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.lastActive}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedUser(user);
                              setIsEditUserOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Pengguna
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleChangeStatus(user.id, user.status === 'active' ? 'inactive' : 'active')}
                          >
                            <BadgeCheck className="h-4 w-4 mr-2" />
                            {user.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel>Ubah Peran</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => handleChangeRole(user.id, 'admin')}
                            disabled={user.role === 'admin'}
                          >
                            <Shield className="h-4 w-4 mr-2" />
                            Administrator
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleChangeRole(user.id, 'manager')}
                            disabled={user.role === 'manager'}
                          >
                            <UserCog className="h-4 w-4 mr-2" />
                            Manajer
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleChangeRole(user.id, 'user')}
                            disabled={user.role === 'user'}
                          >
                            <BadgeCheck className="h-4 w-4 mr-2" />
                            Pengguna
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Hapus Pengguna
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Pengguna</DialogTitle>
            <DialogDescription>
              Perbarui informasi pengguna.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label htmlFor="edit-name" className="text-sm font-medium">Nama Lengkap</label>
                <Input
                  id="edit-name"
                  value={selectedUser.name}
                  onChange={(e) => setSelectedUser({...selectedUser, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-email" className="text-sm font-medium">Email</label>
                <Input
                  id="edit-email"
                  type="email"
                  value={selectedUser.email}
                  onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-role" className="text-sm font-medium">Peran</label>
                <Select
                  value={selectedUser.role}
                  onValueChange={(value) => setSelectedUser({...selectedUser, role: value as any})}
                >
                  <SelectTrigger id="edit-role">
                    <SelectValue placeholder="Pilih peran pengguna" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Pengguna</SelectItem>
                    <SelectItem value="manager">Manajer</SelectItem>
                    <SelectItem value="admin">Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-status" className="text-sm font-medium">Status</label>
                <Select
                  value={selectedUser.status}
                  onValueChange={(value) => setSelectedUser({...selectedUser, status: value as any})}
                >
                  <SelectTrigger id="edit-status">
                    <SelectValue placeholder="Pilih status pengguna" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Aktif</SelectItem>
                    <SelectItem value="inactive">Tidak Aktif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditUserOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleEditUser}>
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default UsersPage;
