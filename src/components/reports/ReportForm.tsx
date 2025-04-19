
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { TaxReportType } from '@/types/food-manufacturing';
import { toast } from 'sonner';

interface ReportFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReportForm: React.FC<ReportFormProps> = ({ isOpen, onClose }) => {
  const [reportType, setReportType] = useState<TaxReportType | null>(null);
  
  const handleSubmit = () => {
    if (!reportType) {
      toast.error('Silakan pilih jenis pajak');
      return;
    }
    
    toast.success('Laporan pajak berhasil dibuat');
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
              <Select value={reportType || 'select-type'} onValueChange={(value) => setReportType(value as TaxReportType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis pajak" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="select-type" disabled>Pilih jenis pajak</SelectItem>
                  <SelectItem value="vat">PPN</SelectItem>
                  <SelectItem value="income">PPh Badan</SelectItem>
                  <SelectItem value="withholding">PPh 21/23/26</SelectItem>
                  <SelectItem value="monthly-return">SPT Masa</SelectItem>
                  <SelectItem value="annual-return">SPT Tahunan</SelectItem>
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nomor Form Pajak</label>
              <Input placeholder="Contoh: SPT Masa PPN 1111" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">NPWP</label>
              <Input placeholder="Nomor Pokok Wajib Pajak" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">KPP Terdaftar</label>
            <Input placeholder="Contoh: KPP Pratama Jakarta Tebet" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Catatan</label>
            <Input placeholder="Catatan tambahan tentang laporan pajak ini" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button onClick={handleSubmit}>
            Buat Laporan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportForm;
