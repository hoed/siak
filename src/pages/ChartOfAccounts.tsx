import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from '@/components/ui/sheet';
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { 
  PlusCircle, Edit, Trash2, ChevronRight, ChevronDown 
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { ExtendedDatabase } from '@/integrations/supabase/chart-of-accounts-types';

type ChartOfAccount = ExtendedDatabase['public']['Tables']['chart_of_accounts']['Row'];

interface ChartOfAccountNode extends ChartOfAccount {
  children?: ChartOfAccountNode[];
  level: number;
}

const ChartOfAccounts: React.FC = () => {
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<ChartOfAccount | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [expandedAccounts, setExpandedAccounts] = useState<Set<string>>(new Set());
  const [accountForm, setAccountForm] = useState({
    code: '',
    name: '',
    type: '',
    description: '',
    parent_id: '',
    is_active: true,
  });
  const [error, setError] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const { data: accounts = [], isLoading, error: fetchError } = useQuery({
    queryKey: ['chartOfAccounts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chart_of_accounts')
        .select('*');
      if (error) throw new Error(error.message || 'Failed to fetch chart of accounts');
      return data as ChartOfAccount[];
    }
  });

  const buildAccountTree = (accounts: ChartOfAccount[]): ChartOfAccountNode[] => {
    const map: { [key: string]: ChartOfAccountNode } = {};
    const tree: ChartOfAccountNode[] = [];

    accounts.forEach(account => {
      map[account.id] = { ...account, children: [], level: 0 };
    });

    accounts.forEach(account => {
      const node = map[account.id];
      if (account.parent_id) {
        const parent = accounts.find(a => a.id === account.parent_id);
        if (parent) {
          node.level = 1;
          map[parent.id].children!.push(node);
        } else {
          node.level = 0;
          tree.push(node);
        }
      } else {
        node.level = 0;
        tree.push(node);
      }
    });

    return tree;
  };

  const accountTree = React.useMemo(() => buildAccountTree(accounts), [accounts]);

  const createAccountMutation = useMutation({
    mutationFn: async (data: Omit<ChartOfAccount, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
      const { error } = await supabase
        .from('chart_of_accounts')
        .insert([data]);
      if (error) throw new Error(error.message || 'Failed to create account');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chartOfAccounts'] });
      resetForm();
      setIsAddAccountOpen(false);
    },
    onError: (err: any) => {
      setError(err.message || 'Failed to create account');
    }
  });

  const updateAccountMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ChartOfAccount> }) => {
      const { error } = await supabase
        .from('chart_of_accounts')
        .update(data)
        .eq('id', id);
      if (error) throw new Error(error.message || 'Failed to update account');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chartOfAccounts'] });
      resetForm();
      setEditingAccount(null);
    },
    onError: (err: any) => {
      setError(err.message || 'Failed to update account');
    }
  });

  const deleteAccountMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('chart_of_accounts')
        .delete()
        .eq('id', id);
      if (error) throw new Error(error.message || 'Failed to delete account');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chartOfAccounts'] });
      setIsDeleteConfirmOpen(false);
    },
    onError: (err: any) => {
      setError(err.message || 'Failed to delete account');
    }
  });

  const resetForm = () => {
    setAccountForm({
      code: '',
      name: '',
      type: '',
      description: '',
      parent_id: '',
      is_active: true,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const accountData = {
      code: accountForm.code,
      name: accountForm.name,
      type: accountForm.type,
      description: accountForm.description || null,
      parent_id: accountForm.parent_id || null,
      is_active: accountForm.is_active,
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

  const handleEdit = (account: ChartOfAccount) => {
    setEditingAccount(account);
    setAccountForm({
      code: account.code,
      name: account.name,
      type: account.type,
      description: account.description || '',
      parent_id: account.parent_id || '',
      is_active: account.is_active,
    });
    setIsAddAccountOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteAccountMutation.mutate(deleteId);
    }
  };

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedAccounts);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedAccounts(newExpanded);
  };

  const renderAccountRows = (accounts: ChartOfAccountNode[], parentExpanded = true) => {
    return accounts.flatMap(account => {
      const hasChildren = account.children && account.children.length > 0;
      const isExpanded = expandedAccounts.has(account.id);
      const isVisible = parentExpanded;
      
      if (!isVisible) return [];
      
      const indentation = account.level * 20;
      
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
          <TableCell>{account.type}</TableCell>
          <TableCell>{account.description || '-'}</TableCell>
          <TableCell>{account.is_active ? 'Yes' : 'No'}</TableCell>
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
      
      if (hasChildren && isExpanded) {
        rows.push(...renderAccountRows(account.children!, isExpanded));
      }
      
      return rows;
    });
  };

  if (error || fetchError) {
    return (
      <MainLayout>
        <div className="p-4 bg-red-100 text-red-700 rounded">
          Error: {error || fetchError?.message || 'Failed to load chart of accounts'}
        </div>
      </MainLayout>
    );
  }

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

      <div className="bg-card rounded-md border shadow-sm">
        <div className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kode</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Tipe</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead>Aktif</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Memuat data...
                  </TableCell>
                </TableRow>
              ) : accountTree.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
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
              <Label htmlFor="type">Tipe</Label>
              <Select
                value={accountForm.type}
                onValueChange={(value) => setAccountForm({ ...accountForm, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tipe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Asset">Aset</SelectItem>
                  <SelectItem value="Liability">Kewajiban</SelectItem>
                  <SelectItem value="Equity">Ekuitas</SelectItem>
                  <SelectItem value="Revenue">Pendapatan</SelectItem>
                  <SelectItem value="Expense">Beban</SelectItem>
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
            <div className="space-y-2">
              <Label htmlFor="parent_id">Akun Induk</Label>
              <Select
                value={accountForm.parent_id}
                onValueChange={(value) => setAccountForm({ ...accountForm, parent_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih akun induk" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tidak ada</SelectItem>
                  {accounts.map(account => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.code} - {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="is_active">Aktif</Label>
              <Select
                value={accountForm.is_active ? 'true' : 'false'}
                onValueChange={(value) => setAccountForm({ ...accountForm, is_active: value === 'true' })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Ya</SelectItem>
                  <SelectItem value="false">Tidak</SelectItem>
                </SelectContent>
              </Select>
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