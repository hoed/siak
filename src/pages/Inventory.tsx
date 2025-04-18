
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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Trash2, AlertTriangle, ShoppingCart, Plus, Package, FileText, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { InventoryItem, InventoryTransaction, InventorySummary } from '@/types/inventory';
import { getInventoryItems, getInventorySummary, createInventoryItem, updateInventoryItem, deleteInventoryItem, createInventoryTransaction } from '@/services/inventoryService';

const Inventory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isAddItemOpen, setIsAddItemOpen] = useState<boolean>(false);
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState<boolean>(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  const [itemForm, setItemForm] = useState({
    name: '',
    sku: '',
    description: '',
    category: '',
    quantity: 0,
    unitPrice: 0,
    costPrice: 0,
    minimumStock: 0,
    location: '',
    imageUrl: '',
    barcode: '',
    supplier_id: ''
  });

  const [transactionForm, setTransactionForm] = useState({
    itemId: '',
    type: 'purchase' as const,
    quantity: 0,
    unitPrice: 0,
    totalPrice: 0,
    reference: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const queryClient = useQueryClient();

  // Fetch inventory items
  const { data: inventoryItems = [], isLoading: isLoadingItems } = useQuery({
    queryKey: ['inventoryItems'],
    queryFn: getInventoryItems
  });

  // Fetch inventory summary
  const { data: inventorySummary, isLoading: isLoadingSummary } = useQuery({
    queryKey: ['inventorySummary'],
    queryFn: getInventorySummary
  });

  // Filter items by search term and category
  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Get unique categories for filter
  const categories = [...new Set(inventoryItems.map(item => item.category).filter(Boolean))];

  // Create item mutation
  const createItemMutation = useMutation({
    mutationFn: createInventoryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventoryItems'] });
      queryClient.invalidateQueries({ queryKey: ['inventorySummary'] });
      setIsAddItemOpen(false);
      resetItemForm();
      toast.success('Item added successfully');
    },
    onError: (error: any) => {
      toast.error(`Error adding item: ${error.message}`);
    }
  });

  // Update item mutation
  const updateItemMutation = useMutation({
    mutationFn: (item: InventoryItem) => updateInventoryItem(item.id, item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventoryItems'] });
      queryClient.invalidateQueries({ queryKey: ['inventorySummary'] });
      setIsAddItemOpen(false);
      setEditingItem(null);
      resetItemForm();
      toast.success('Item updated successfully');
    },
    onError: (error: any) => {
      toast.error(`Error updating item: ${error.message}`);
    }
  });

  // Delete item mutation
  const deleteItemMutation = useMutation({
    mutationFn: (id: string) => deleteInventoryItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventoryItems'] });
      queryClient.invalidateQueries({ queryKey: ['inventorySummary'] });
      setIsDeleteConfirmOpen(false);
      toast.success('Item deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Error deleting item: ${error.message}`);
    }
  });

  // Create transaction mutation
  const createTransactionMutation = useMutation({
    mutationFn: createInventoryTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventoryItems'] });
      queryClient.invalidateQueries({ queryKey: ['inventorySummary'] });
      setIsAddTransactionOpen(false);
      resetTransactionForm();
      toast.success('Transaction recorded successfully');
    },
    onError: (error: any) => {
      toast.error(`Error recording transaction: ${error.message}`);
    }
  });

  const resetItemForm = () => {
    setItemForm({
      name: '',
      sku: '',
      description: '',
      category: '',
      quantity: 0,
      unitPrice: 0,
      costPrice: 0,
      minimumStock: 0,
      location: '',
      imageUrl: '',
      barcode: '',
      supplier_id: ''
    });
  };

  const resetTransactionForm = () => {
    setTransactionForm({
      itemId: '',
      type: 'purchase',
      quantity: 0,
      unitPrice: 0,
      totalPrice: 0,
      reference: '',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });
  };

  const handleItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const itemData: Partial<InventoryItem> = {
      name: itemForm.name,
      sku: itemForm.sku,
      description: itemForm.description,
      category: itemForm.category,
      quantity: Number(itemForm.quantity),
      unitPrice: Number(itemForm.unitPrice),
      costPrice: Number(itemForm.costPrice),
      minimumStock: Number(itemForm.minimumStock),
      location: itemForm.location,
      imageUrl: itemForm.imageUrl,
      barcode: itemForm.barcode,
      supplier_id: itemForm.supplier_id || undefined
    };

    if (editingItem) {
      updateItemMutation.mutate({ ...editingItem, ...itemData });
    } else {
      createItemMutation.mutate(itemData);
    }
  };

  const handleTransactionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTransactionMutation.mutate({
      itemId: transactionForm.itemId,
      type: transactionForm.type,
      quantity: Number(transactionForm.quantity),
      unitPrice: Number(transactionForm.unitPrice),
      totalPrice: Number(transactionForm.totalPrice),
      reference: transactionForm.reference,
      date: transactionForm.date,
      notes: transactionForm.notes
    });
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setItemForm({
      name: item.name,
      sku: item.sku,
      description: item.description || '',
      category: item.category || '',
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      costPrice: item.costPrice,
      minimumStock: item.minimumStock || 0,
      location: item.location || '',
      imageUrl: item.imageUrl || '',
      barcode: item.barcode || '',
      supplier_id: item.supplier_id || ''
    });
    setIsAddItemOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteItemMutation.mutate(deleteId);
    }
  };

  const calculateTotalPrice = () => {
    const quantity = Number(transactionForm.quantity);
    const unitPrice = Number(transactionForm.unitPrice);
    const total = quantity * unitPrice;
    setTransactionForm({
      ...transactionForm,
      totalPrice: total
    });
  };

  useEffect(() => {
    calculateTotalPrice();
  }, [transactionForm.quantity, transactionForm.unitPrice]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <MainLayout>
      <div className="pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Inventory</h1>
          <p className="text-muted-foreground">
            Manage your stock, track inventory movements and transactions
          </p>
        </div>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => setIsAddTransactionOpen(true)}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Record Transaction
          </Button>
          <Button onClick={() => {
            resetItemForm();
            setEditingItem(null);
            setIsAddItemOpen(true);
          }}>
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>
      </div>

      {inventorySummary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inventorySummary.totalItems}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(inventorySummary.totalValue)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inventorySummary.lowStockItems.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inventorySummary.recentTransactions.length}</div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
          <CardDescription>
            View and manage your inventory items
          </CardDescription>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search items by name, SKU, or description..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingItems ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                      Loading inventory items...
                    </TableCell>
                  </TableRow>
                ) : filteredItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                      No inventory items found. Try a different search or add a new item.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.sku}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.category || '-'}</TableCell>
                      <TableCell className="text-right">
                        <span className={item.minimumStock && item.quantity <= item.minimumStock ? "text-red-500 font-bold" : ""}>
                          {item.quantity}
                        </span>
                        {item.minimumStock && item.quantity <= item.minimumStock && (
                          <AlertTriangle className="inline-block ml-2 h-4 w-4 text-red-500" />
                        )}
                      </TableCell>
                      <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.quantity * item.unitPrice)}</TableCell>
                      <TableCell>
                        <div className="flex justify-center space-x-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
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
          <div className="text-sm text-muted-foreground">
            Showing {filteredItems.length} of {inventoryItems.length} items
          </div>
        </CardFooter>
      </Card>

      {inventorySummary && inventorySummary.lowStockItems.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Low Stock Alert</CardTitle>
            <CardDescription>Items that need to be restocked</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-right">Current Quantity</TableHead>
                    <TableHead className="text-right">Minimum Stock</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventorySummary.lowStockItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.sku}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell className="text-right text-red-500 font-bold">{item.quantity}</TableCell>
                      <TableCell className="text-right">{item.minimumStock}</TableCell>
                      <TableCell className="text-center">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setTransactionForm({
                              ...transactionForm,
                              itemId: item.id,
                              type: 'purchase',
                              unitPrice: item.costPrice
                            });
                            setIsAddTransactionOpen(true);
                          }}
                        >
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          Restock
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {inventorySummary && inventorySummary.recentTransactions.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Last 5 inventory transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventorySummary.recentTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                      <TableCell>{transaction.itemName || transaction.itemId}</TableCell>
                      <TableCell>
                        <span className={`uppercase text-xs font-bold rounded-full px-2 py-1 ${
                          transaction.type === 'purchase' 
                            ? 'bg-green-100 text-green-800' 
                            : transaction.type === 'sale' 
                            ? 'bg-blue-100 text-blue-800'
                            : transaction.type === 'adjustment'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {transaction.type}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">{transaction.quantity}</TableCell>
                      <TableCell className="text-right">{formatCurrency(transaction.unitPrice)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(transaction.totalPrice)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      <Sheet open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{editingItem ? 'Edit Inventory Item' : 'Add New Inventory Item'}</SheetTitle>
            <SheetDescription>
              {editingItem 
                ? 'Update the details of an existing inventory item.' 
                : 'Fill in the details to add a new item to your inventory.'}
            </SheetDescription>
          </SheetHeader>
          <form onSubmit={handleItemSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Item Name *</Label>
              <Input 
                id="name" 
                value={itemForm.name} 
                onChange={(e) => setItemForm({...itemForm, name: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku">SKU *</Label>
              <Input 
                id="sku" 
                value={itemForm.sku} 
                onChange={(e) => setItemForm({...itemForm, sku: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                value={itemForm.description} 
                onChange={(e) => setItemForm({...itemForm, description: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input 
                id="category" 
                value={itemForm.category} 
                onChange={(e) => setItemForm({...itemForm, category: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity *</Label>
                <Input 
                  id="quantity" 
                  type="number" 
                  min="0" 
                  value={itemForm.quantity} 
                  onChange={(e) => setItemForm({...itemForm, quantity: Number(e.target.value)})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minimumStock">Minimum Stock</Label>
                <Input 
                  id="minimumStock" 
                  type="number" 
                  min="0" 
                  value={itemForm.minimumStock} 
                  onChange={(e) => setItemForm({...itemForm, minimumStock: Number(e.target.value)})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="unitPrice">Selling Price *</Label>
                <Input 
                  id="unitPrice" 
                  type="number" 
                  min="0" 
                  value={itemForm.unitPrice} 
                  onChange={(e) => setItemForm({...itemForm, unitPrice: Number(e.target.value)})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="costPrice">Cost Price *</Label>
                <Input 
                  id="costPrice" 
                  type="number" 
                  min="0" 
                  value={itemForm.costPrice} 
                  onChange={(e) => setItemForm({...itemForm, costPrice: Number(e.target.value)})}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Storage Location</Label>
              <Input 
                id="location" 
                value={itemForm.location} 
                onChange={(e) => setItemForm({...itemForm, location: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="barcode">Barcode</Label>
              <Input 
                id="barcode" 
                value={itemForm.barcode} 
                onChange={(e) => setItemForm({...itemForm, barcode: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input 
                id="imageUrl" 
                value={itemForm.imageUrl} 
                onChange={(e) => setItemForm({...itemForm, imageUrl: e.target.value})}
              />
            </div>
            <div className="pt-4 flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setEditingItem(null);
                  resetItemForm();
                  setIsAddItemOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingItem ? 'Update Item' : 'Add Item'}
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>

      <Sheet open={isAddTransactionOpen} onOpenChange={setIsAddTransactionOpen}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Record Inventory Transaction</SheetTitle>
            <SheetDescription>
              Record purchases, sales, adjustments, or returns
            </SheetDescription>
          </SheetHeader>
          <form onSubmit={handleTransactionSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="transaction-type">Transaction Type *</Label>
              <Select 
                value={transactionForm.type} 
                onValueChange={(value) => setTransactionForm({...transactionForm, type: value as any})}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select transaction type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="purchase">Purchase</SelectItem>
                  <SelectItem value="sale">Sale</SelectItem>
                  <SelectItem value="adjustment">Adjustment</SelectItem>
                  <SelectItem value="return">Return</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="item">Item *</Label>
              <Select 
                value={transactionForm.itemId} 
                onValueChange={(value) => setTransactionForm({...transactionForm, itemId: value})}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an item" />
                </SelectTrigger>
                <SelectContent>
                  {inventoryItems.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name} ({item.sku})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity *</Label>
                <Input 
                  id="quantity" 
                  type="number" 
                  min="1" 
                  value={transactionForm.quantity} 
                  onChange={(e) => setTransactionForm({...transactionForm, quantity: Number(e.target.value)})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unitPrice">Unit Price *</Label>
                <Input 
                  id="unitPrice" 
                  type="number" 
                  min="0" 
                  value={transactionForm.unitPrice} 
                  onChange={(e) => setTransactionForm({...transactionForm, unitPrice: Number(e.target.value)})}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalPrice">Total Price</Label>
              <Input 
                id="totalPrice" 
                type="number" 
                value={transactionForm.totalPrice} 
                readOnly
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input 
                id="date" 
                type="date" 
                value={transactionForm.date} 
                onChange={(e) => setTransactionForm({...transactionForm, date: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reference">Reference/Invoice Number</Label>
              <Input 
                id="reference" 
                value={transactionForm.reference} 
                onChange={(e) => setTransactionForm({...transactionForm, reference: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea 
                id="notes" 
                value={transactionForm.notes} 
                onChange={(e) => setTransactionForm({...transactionForm, notes: e.target.value})}
              />
            </div>
            <div className="pt-4 flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  resetTransactionForm();
                  setIsAddTransactionOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                Record Transaction
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>

      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this inventory item? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Inventory;
