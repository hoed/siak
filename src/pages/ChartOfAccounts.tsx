
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,

  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  PlusCircle, 
  Edit, 
  Trash2, 
  FileText, 
  ChevronRight, 
  ChevronDown 
} from 'lucide-react';
import { toast } from 'sonner';
import { AccountType, ChartOfAccount, ChartOfAccountNode } from '@/types/accounting';
import { 
  getChartOfAccounts, 
  createChartOfAccount, 
  updateChartOfAccount, 
  deleteChartOfAccount,
  buildAccountTree
} from '@/services/accountingService';

const ChartOfAccounts: React.FC = () => {
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<ChartOfAccount | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [expandedAccounts, setExpandedAccounts] = useState<Set<string>>(new Set());
  const [accountForm, setAccountForm] = useState<{
    code: string;
    name: string;
    type: AccountType;
    description: string;
    parentId: string;
  }>({
    code: '',
    name: '',
    type: 'asset',
    description: '',
    parentId: '',
  });

  const queryClient = useQueryClient();

  // Fetch chart of accounts
  const { data: accounts = [], isLoading } = useQuery({
    queryKey: ['chartOfAccounts'],
    queryFn: getChartOfAccounts
  });

  // Account tree for hierarchical display
  const accountTree = React.useMemo(() => buildAccountTree(accounts), [accounts]);

  // Create account mutation
  const createAccountMutation = useMutation({
    mutationFn: createChartOfAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chartOfAccounts'] });
      resetForm();
      setIsAddAccountOpen(false);
    }
  });

  // Update account mutation
  const updateAccountMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ChartOfAccount> }) => 
      updateChartOfAccount(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chartOfAccounts'] });
      resetForm();
      setEditingAccount(null);
    }
  });

  // Delete account mutation
  const deleteAccountMutation = useMutation({
    mutationFn: deleteChartOfAccount,
    onSuccess: (success) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: ['chartOfAccounts'] });
        setIsDeleteConfirmOpen(false);
      }
    }
  });

  // Reset form
  const resetForm = () => {
    setAccountForm({
      code: '',
      name: '',
      type: 'asset',
      description: '',
      parentId: '',
    });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const accountData = {
      ...accountForm,
      isActive: true
    };
    
    if (editingAccount) {
      updateAccountMutation.mutate({
        id: editingAccount.id,
        data: accountData
      });
    } else {
      createAccountMutation.mutate(accountData);
    }
  };

  // Initialize edit form
  const handleEdit = (account: ChartOfAccount) => {
    setEditingAccount(account);
    setAccountForm({
      code: account.code,
      name: account.name,
      type: account.type,
      description: account.description || '',
      parentId: account.parentId || '',
    });
    setIsAddAccountOpen(true);
  };

  // Handle delete confirmation
  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setIsDeleteConfirmOpen(true);
  };

  // Handle delete confirmation
  const confirmDelete = () => {
    if (deleteId) {
      deleteAccountMutation.mutate(deleteId);
    }
  };

  // Toggle expanded account
  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedAccounts);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedAccounts(newExpanded);
  };

  // Get account type label in Indonesian
  const getAccountTypeLabel = (type: AccountType): string => {
    const types = {
      asset: 'Aset',
      liability: 'Kewajiban',
      equity: 'Ekuitas',
      revenue: 'Pendapatan',
      expense: 'Beban'
    };
    return types[type];
  };

  // Render account rows recursively
  const renderAccountRows = (accounts: ChartOfAccountNode[], parentExpanded = true) => {
    return accounts.flatMap(account => {
      const hasChildren = account.children && account.children.length > 0;
      const isExpanded = expandedAccounts.has(account.id);
      const isVisible = parentExpanded;
      
      if (!isVisible) return [];
      
      const indentation = account.level * 20; // 20px per level
      
      const rows = [
        <TableRow key={account.id}>
          <TableCell className="font-medium">
            <div className="flex items-center">
              <div style={{ width: `${indentation}px` }}></div>
              {hasChildren ? (
                <button
                  onClick={() => toggleExpand(account.id)}
                  className="mr-2 p-1 rounded-sm hover:bg-accent"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
              ) : (
                <div className="w-6 mr-2"></div>
              )}
              {account.code}
            </div>
          </TableCell>
          <TableCell>{account.name}</TableCell>
          <TableCell>{getAccountTypeLabel(account.type)}</TableCell>
          <TableCell>{account.description || '-'}</TableCell>
          <TableCell>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleEdit(account)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteClick(account.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
      ];
      
      // Add children if expanded
      if (hasChildren && isExpanded) {
        rows.push(...renderAccountRows(account.children!, isExpanded));
      }
      
      return rows;
    });
  };

  return (
    <MainLayout>
      <div className="pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Bagan Akun</h1>
          <p className="text-muted-foreground">
            Kelola struktur akun untuk pencatatan keuangan
          </p>
        </div>
        <Button onClick={() => {
          resetForm();
          setEditingAccount(null);
          setIsAddAccountOpen(true);
        }}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Tambah Akun
        </Button>
      </div>

      {/* Chart of Accounts Table */}
      <div className="bg-card rounded-md border shadow-sm">
        <div className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kode</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Tipe</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Memuat data...
                  </TableCell>
                </TableRow>
              ) : accountTree.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Belum ada data akun. Klik "Tambah Akun" untuk membuat akun baru.
                  </TableCell>
                </TableRow>
              ) : (
                renderAccountRows(accountTree)
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add/Edit Account Sheet */}
      <Sheet open={isAddAccountOpen} onOpenChange={setIsAddAccountOpen}>
        <SheetContent side="right" className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>
              {editingAccount ? 'Edit Akun' : 'Tambah Akun Baru'}
            </SheetTitle>
          </SheetHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="code">Kode Akun</Label>
              <Input
                id="code"
                value={accountForm.code}
                onChange={(e) => setAccountForm({ ...accountForm, code: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Nama Akun</Label>
              <Input
                id="name"
                value={accountForm.name}
                onChange={(e) => setAccountForm({ ...accountForm, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Tipe Akun</Label>
              <Select
                value={accountForm.type}
                onValueChange={(value) => setAccountForm({ ...accountForm, type: value as AccountType })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tipe akun" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asset">Aset</SelectItem>
                  <SelectItem value="liability">Kewajiban</SelectItem>
                  <SelectItem value="equity">Ekuitas</SelectItem>
                  <SelectItem value="revenue">Pendapatan</SelectItem>
                  <SelectItem value="expense">Beban</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="parent">Akun Induk</Label>
              <Select
                value={accountForm.parentId}
                onValueChange={(value) => setAccountForm({ ...accountForm, parentId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih akun induk (opsional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">-- Tidak Ada --</SelectItem>
                  {accounts.map((account) => (
                    <SelectItem 
                      key={account.id} 
                      value={account.id}
                      disabled={editingAccount?.id === account.id}
                    >
                      {account.code} - {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Input
                id="description"
                value={accountForm.description}
                onChange={(e) => setAccountForm({ ...accountForm, description: e.target.value })}
              />
            </div>
            <div className="pt-4 space-x-2 flex justify-end">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  resetForm();
                  setIsAddAccountOpen(false);
                }}
              >
                Batal
              </Button>
              <Button type="submit">
                {editingAccount ? 'Update' : 'Simpan'}
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
            <DialogDescription>
              Anda yakin ingin menghapus akun ini? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteConfirmOpen(false)}
            >
              Batal
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
            >
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default ChartOfAccounts;
