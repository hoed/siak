
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TaxReportType } from '@/types/food-manufacturing';

interface ReportTypeFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const ReportTypeFilter: React.FC<ReportTypeFilterProps> = ({ value, onChange }) => {
  return (
    <div className="flex-1">
      <label className="text-sm font-medium mb-1 block">Jenis Pajak</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Pilih jenis pajak" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Jenis</SelectItem>
          <SelectItem value="vat">PPN</SelectItem>
          <SelectItem value="income">PPh Badan</SelectItem>
          <SelectItem value="withholding">PPh 21/23/26</SelectItem>
          <SelectItem value="monthly-return">SPT Masa</SelectItem>
          <SelectItem value="annual-return">SPT Tahunan</SelectItem>
          <SelectItem value="other">Lainnya</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ReportTypeFilter;
