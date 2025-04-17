
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from '@/components/ui/use-toast';
import { PlusCircle, Search, Trash2, Edit, Tag, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const dummyCategories = [
  {
    id: '1',
    name: 'Penjualan',
    type: 'income',
    icon: 'shopping-cart',
    color: 'green',
  },
  {
    id: '2',
    name: 'Jasa',
    type: 'income',
    icon: 'briefcase',
    color: 'blue',
  },
  {
    id: '3',
    name: 'Investasi',
    type: 'income',
    icon: 'trending-up',
    color: 'purple',
  },
  {
    id: '4',
    name: 'Aset',
    type: 'income',
    icon: 'home',
    color: 'orange',
  },
  {
    id: '5',
    name: 'Gaji',
    type: 'expense',
    icon: 'users',
    color: 'red',
  },
  {
    id: '6',
    name: 'Sewa',
    type: 'expense',
    icon: 'home',
    color: 'orange',
  },
  {
    id: '7',
    name: 'Perlengkapan',
    type: 'expense',
    icon: 'package',
    color: 'blue',
  },
  {
    id: '8',
    name: 'Utilitas',
    type: 'expense',
    icon: 'zap',
    color: 'yellow',
  },
  {
    id: '9',
    name: 'Transportasi',
    type: 'expense',
    icon: 'truck',
    color: 'gray',
  },
  {
    id: '10',
    name: 'Pemasaran',
    type: 'expense',
    icon: 'target',
    color: 'purple',
  },
];

const colorOptions = [
  { value: 'slate', label: 'Abu-abu' },
  { value: 'gray', label: 'Abu-abu Gelap' },
  { value: 'red', label: 'Merah' },
  { value: 'orange', label: 'Oranye' },
  { value: 'amber', label: 'Kuning Tua' },
  { value: 'yellow', label: 'Kuning' },
  { value: 'lime', label: 'Hijau Muda' },
  { value: 'green', label: 'Hijau' },
  { value: 'emerald', label: 'Hijau Zamrud' },
  { value: 'teal', label: 'Teal' },
  { value: 'cyan', label: 'Biru Muda' },
  { value: 'blue', label: 'Biru' },
  { value: 'indigo', label: 'Indigo' },
  { value: 'violet', label: 'Ungu' },
  { value: 'purple', label: 'Ungu Tua' },
  { value: 'pink', label: 'Merah Muda' },
];

const Categories: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [categories, setCategories] = useState(dummyCategories);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    type: 'expense',
    color: 'blue',
  });

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' ? true : category.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleAddCategory = () => {
    if (!newCategory.name || !newCategory.type || !newCategory.color) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Semua field harus diisi",
      });
      return;
    }

    const category = {
      id: Date.now().toString(),
      name: newCategory.name,
      type: newCategory.type,
      icon: newCategory.type === 'income' ? 'trending-up' : 'trending-down',
      color: newCategory.color,
    };

    setCategories([...categories, category]);
    setNewCategory({
      name: '',
      type: 'expense',
      color: 'blue',
    });
    setIsAddCategoryOpen(false);
    
    toast({
      title: "Berhasil!",
      description: "Kategori berhasil ditambahkan",
    });
  };

  const deleteCategory = (id: string) => {
    setCategories(categories.filter(category => category.id !== id));
    toast({
      title: "Berhasil!",
      description: "Kategori berhasil dihapus",
    });
  };

  const getCategoryBadgeClass = (type: string, color: string) => {
    const baseClass = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    
    if (type === 'income') {
      return `${baseClass} bg-${color}-100 text-${color}-800`;
    } else {
      return `${baseClass} bg-${color}-100 text-${color}-800`;
    }
  };

  const getColorPreview = (color: string) => {
    return <div className={`w-4 h-4 rounded-full bg-${color}-500`}></div>;
  };

  return (
    <MainLayout>
      <div className="pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Kategori</h1>
          <p className="text-muted-foreground">
            Kelola kategori untuk transaksi pemasukan dan pengeluaran
          </p>
        </div>
        <Button onClick={() => setIsAddCategoryOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Tambah Kategori
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Daftar Kategori</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari kategori..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <div className="flex items-center">
                  <Tag className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter Tipe" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Tipe</SelectItem>
                <SelectItem value="income">Pemasukan</SelectItem>
                <SelectItem value="expense">Pengeluaran</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Kategori</TableHead>
                  <TableHead>Tipe</TableHead>
                  <TableHead>Warna</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6">
                      Tidak ada data kategori yang sesuai
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCategories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell>
                        <Badge variant={category.type === 'income' ? 'default' : 'secondary'} className="flex items-center w-fit">
                          {category.type === 'income' ? (
                            <><ArrowUpCircle className="h-3 w-3 mr-1" /> Pemasukan</>
                          ) : (
                            <><ArrowDownCircle className="h-3 w-3 mr-1" /> Pengeluaran</>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <div className={`w-4 h-4 rounded-full bg-${category.color}-500`}></div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{colorOptions.find(c => c.value === category.color)?.label || category.color}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => deleteCategory(category.id)}
                          >
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
          <p className="text-sm text-muted-foreground">Menampilkan {filteredCategories.length} dari {categories.length} kategori</p>
        </CardFooter>
      </Card>

      <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Tambah Kategori Baru</DialogTitle>
            <DialogDescription>
              Masukkan detail kategori yang ingin ditambahkan.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">Nama Kategori</label>
              <Input
                id="name"
                placeholder="Nama kategori"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              />
            </div>
            
            <div>
              <label htmlFor="type" className="block text-sm font-medium mb-1">Tipe</label>
              <Select
                value={newCategory.type}
                onValueChange={(value) => setNewCategory({ ...newCategory, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tipe kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Pemasukan</SelectItem>
                  <SelectItem value="expense">Pengeluaran</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label htmlFor="color" className="block text-sm font-medium mb-1">Warna</label>
              <Select
                value={newCategory.color}
                onValueChange={(value) => setNewCategory({ ...newCategory, color: value })}
              >
                <SelectTrigger>
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full mr-2 bg-${newCategory.color}-500`}></div>
                    <SelectValue placeholder="Pilih warna" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded-full mr-2 bg-${color.value}-500`}></div>
                        <span>{color.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddCategoryOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleAddCategory}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Categories;
