
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
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
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
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Trash2, AlertTriangle, ShoppingCart, Plus, Package, FileText, Edit, CopyCheck } from 'lucide-react';
import { toast } from 'sonner';
import { JournalEntry, JournalEntryLine, JournalSummary, JournalViewPeriod, JournalFilter } from '@/types/ledger';
import { getJournalEntries, getJournalSummary, createJournalEntry, deleteJournalEntry, createJournalEntryLine } from '@/services/ledgerService';
import { format } from 'date-fns';

const Journals: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [viewPeriod, setViewPeriod] = useState<JournalViewPeriod>('daily');
  const [isAddEntryOpen, setIsAddEntryOpen] = useState<boolean>(false);
  const [isAddEntryLineOpen, setIsAddEntryLineOpen] = useState<boolean>(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState<boolean>(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
    
  const [entryForm, setEntryForm] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    entryNumber: '',
    isPosted: false
  });

  const [entryLineForm, setEntryLineForm] = useState({
    journalEntryId: '',
    accountId: '',
    description: '',
    debit: 0,
    credit: 0
  });

  const queryClient = useQueryClient();

  // Get the date range for filtering journals
  const getDateFilter = () => {
    if (!selectedDate) return undefined;
    
    return {
      dateRange: {
        start: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : new Date().toISOString().split('T')[0],
        end: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : new Date().toISOString().split('T')[0]
      }
    };
  };

  // Fetch journal entries
  const { data: journalEntries = [], isLoading: isLoadingEntries } = useQuery({
    queryKey: ['journalEntries', selectedDate?.toISOString()],
    queryFn: () => getJournalEntries(getDateFilter())
  });

  // Fetch journal summary
  const { data: journalSummary, isLoading: isLoadingSummary } = useQuery({
    queryKey: ['journalSummary'],
    queryFn: getJournalSummary
  });

  // Filter entries by search term
  const filteredEntries = journalEntries.filter(entry => {
    const matchesSearch = 
      entry.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
      entry.entryNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  // Create journal entry mutation
  const createEntryMutation = useMutation({
    mutationFn: createJournalEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journalEntries'] });
      queryClient.invalidateQueries({ queryKey: ['journalSummary'] });
      setIsAddEntryOpen(false);
      resetEntryForm();
      toast.success('Journal entry added successfully');
    },
    onError: (error: any) => {
      toast.error(`Error adding journal entry: ${error.message}`);
    }
  });

  // Delete entry mutation
  const deleteEntryMutation = useMutation({
    mutationFn: deleteJournalEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journalEntries'] });
      queryClient.invalidateQueries({ queryKey: ['journalSummary'] });
      setIsDeleteConfirmOpen(false);
      toast.success('Journal entry deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Error deleting journal entry: ${error.message}`);
    }
  });

  // Create journal entry line mutation
  const createEntryLineMutation = useMutation({
    mutationFn: createJournalEntryLine,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journalEntries'] });
      queryClient.invalidateQueries({ queryKey: ['journalSummary'] });
      setIsAddEntryLineOpen(false);
      resetEntryLineForm();
      toast.success('Journal entry line recorded successfully');
    },
    onError: (error: any) => {
      toast.error(`Error recording journal entry line: ${error.message}`);
    }
  });

  const resetEntryForm = () => {
    setEntryForm({
      date: new Date().toISOString().split('T')[0],
      description: '',
      entryNumber: '',
      isPosted: false
    });
  };

  const resetEntryLineForm = () => {
    setEntryLineForm({
      journalEntryId: '',
      accountId: '',
      description: '',
      debit: 0,
      credit: 0
    });
  };

  const handleEntrySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Make sure required fields are present
    if (!entryForm.date || !entryForm.description || !entryForm.entryNumber) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const entryData = {
      date: entryForm.date,
      description: entryForm.description,
      entryNumber: entryForm.entryNumber,
      isPosted: entryForm.isPosted
    };

    createEntryMutation.mutate(entryData);
  };

  const handleEntryLineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Make sure required fields are present
    if (!entryLineForm.journalEntryId || !entryLineForm.accountId) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    createEntryLineMutation.mutate({
      journalEntryId: entryLineForm.journalEntryId,
      accountId: entryLineForm.accountId,
      description: entryLineForm.description,
      debit: Number(entryLineForm.debit),
      credit: Number(entryLineForm.credit)
    });
  };

  const handleEdit = (item: JournalEntry) => {
    setEditingEntry(item);
    setEntryForm({
      date: item.date,
      description: item.description,
      entryNumber: item.entryNumber,
      isPosted: item.isPosted
    });
    setIsAddEntryOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteEntryMutation.mutate(deleteId);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  return (
    <MainLayout>
      <div className="pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Journals</h1>
          <p className="text-muted-foreground">
            View and manage journal entries
          </p>
        </div>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => setIsAddEntryLineOpen(true)}>
            <CopyCheck className="mr-2 h-4 w-4" />
            Record Entry Line
          </Button>
          <Button onClick={() => {
            resetEntryForm();
            setEditingEntry(null);
            setIsAddEntryOpen(true);
          }}>
            <Plus className="mr-2 h-4 w-4" />
            Add Entry
          </Button>
        </div>
      </div>

      {journalSummary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{journalSummary.totalEntries}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Debits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(journalSummary.totalDebits)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(journalSummary.totalCredits)}</div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Journal Entries</CardTitle>
          <CardDescription>
            View and manage your journal entries
          </CardDescription>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search entries by description or entry number..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateChange}
                  className="rounded-md border"
                  disabled={(date) => date > new Date() || date < new Date("2022-01-01")}
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Entry Number</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingEntries ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                      Loading journal entries...
                    </TableCell>
                  </TableRow>
                ) : filteredEntries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                      No journal entries found. Try a different search or add a new entry.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEntries.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.date}</TableCell>
                      <TableCell>{item.entryNumber}</TableCell>
                      <TableCell>{item.description}</TableCell>
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
            Showing {filteredEntries.length} of {journalEntries.length} entries
          </div>
        </CardFooter>
      </Card>

      <Sheet open={isAddEntryOpen} onOpenChange={setIsAddEntryOpen}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{editingEntry ? 'Edit Journal Entry' : 'Add New Journal Entry'}</SheetTitle>
            <SheetDescription>
              {editingEntry 
                ? 'Update the details of an existing journal entry.' 
                : 'Fill in the details to add a new journal entry.'}
            </SheetDescription>
          </SheetHeader>
          <form onSubmit={handleEntrySubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={entryForm.date}
                  onChange={(e) => setEntryForm({ ...entryForm, date: e.target.value })}
                  required
                />
            </div>
            <div className="space-y-2">
              <Label htmlFor="entryNumber">Entry Number *</Label>
              <Input 
                id="entryNumber" 
                value={entryForm.entryNumber} 
                onChange={(e) => setEntryForm({...entryForm, entryNumber: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                value={entryForm.description} 
                onChange={(e) => setEntryForm({...entryForm, description: e.target.value})}
                required
              />
            </div>
            <div className="pt-4 flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setEditingEntry(null);
                  resetEntryForm();
                  setIsAddEntryOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingEntry ? 'Update Entry' : 'Add Entry'}
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>

      <Sheet open={isAddEntryLineOpen} onOpenChange={setIsAddEntryLineOpen}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Record Journal Entry Line</SheetTitle>
            <SheetDescription>
              Record debits and credits for a journal entry
            </SheetDescription>
          </SheetHeader>
          <form onSubmit={handleEntryLineSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="journalEntryId">Journal Entry *</Label>
              <Select 
                value={entryLineForm.journalEntryId} 
                onValueChange={(value) => setEntryLineForm({...entryLineForm, journalEntryId: value})}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a journal entry" />
                </SelectTrigger>
                <SelectContent>
                  {journalEntries.map((entry) => (
                    <SelectItem key={entry.id} value={entry.id}>
                      {entry.description} ({entry.entryNumber})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountId">Account *</Label>
              <Input 
                id="accountId" 
                type="text"
                value={entryLineForm.accountId} 
                onChange={(e) => setEntryLineForm({...entryLineForm, accountId: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                value={entryLineForm.description} 
                onChange={(e) => setEntryLineForm({...entryLineForm, description: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="debit">Debit *</Label>
                <Input 
                  id="debit" 
                  type="number" 
                  min="0" 
                  value={entryLineForm.debit} 
                  onChange={(e) => setEntryLineForm({...entryLineForm, debit: Number(e.target.value)})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="credit">Credit *</Label>
                <Input 
                  id="credit" 
                  type="number" 
                  min="0" 
                  value={entryLineForm.credit} 
                  onChange={(e) => setEntryLineForm({...entryLineForm, credit: Number(e.target.value)})}
                  required
                />
              </div>
            </div>
            <div className="pt-4 flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  resetEntryLineForm();
                  setIsAddEntryLineOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                Record Entry Line
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
              Are you sure you want to delete this journal entry? This action cannot be undone.
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

export default Journals;
