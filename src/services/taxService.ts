
import { supabase } from '@/integrations/supabase/client';
import { TaxReport, TaxReportType, TaxReportStatus } from '@/types/food-manufacturing';
import { toast } from 'sonner';

export interface TaxReportFilter {
  reportType?: TaxReportType;
  status?: TaxReportStatus;
  dateRange?: {
    start?: string;
    end?: string;
  };
  searchQuery?: string;
}

// Get tax reports
export const getTaxReports = async (filter?: TaxReportFilter): Promise<TaxReport[]> => {
  try {
    // Mock tax reports (temporary until database tables are set up)
    const mockTaxReports: TaxReport[] = [
      {
        id: '1',
        reportType: 'vat',
        periodStart: '2025-01-01',
        periodEnd: '2025-01-31',
        dueDate: '2025-02-15',
        status: 'submitted',
        totalTaxAmount: 2500000,
        referenceNumber: 'PPN-2025-01',
        taxOffice: 'KPP Pratama Jakarta Tebet',
        taxFormNumber: 'SPT Masa PPN 1111',
        taxpayerIdNumber: '01.234.567.8-123.000',
        notes: 'Laporan PPN Januari 2025',
        createdAt: '2025-02-01T08:00:00Z',
        updatedAt: '2025-02-01T08:00:00Z'
      },
      {
        id: '2',
        reportType: 'income',
        periodStart: '2025-01-01',
        periodEnd: '2025-03-31',
        dueDate: '2025-04-30',
        status: 'draft',
        totalTaxAmount: 5750000,
        referenceNumber: 'PPH-Q1-2025',
        taxOffice: 'KPP Pratama Jakarta Tebet',
        taxFormNumber: 'SPT Tahunan PPh Badan',
        taxpayerIdNumber: '01.234.567.8-123.000',
        notes: 'Laporan PPH Q1 2025',
        createdAt: '2025-04-01T10:30:00Z',
        updatedAt: '2025-04-01T10:30:00Z'
      },
      {
        id: '3',
        reportType: 'withholding',
        periodStart: '2024-12-01',
        periodEnd: '2024-12-31',
        dueDate: '2025-01-15',
        status: 'paid',
        totalTaxAmount: 1850000,
        referenceNumber: 'PPH21-2024-12',
        taxOffice: 'KPP Pratama Jakarta Tebet',
        taxFormNumber: 'SPT Masa PPh 21',
        taxpayerIdNumber: '01.234.567.8-123.000',
        notes: 'Laporan PPh 21 Desember 2024',
        createdAt: '2025-01-05T14:20:00Z',
        updatedAt: '2025-01-20T09:45:00Z'
      },
      {
        id: '4',
        reportType: 'monthly-return',
        periodStart: '2024-12-01',
        periodEnd: '2024-12-31',
        dueDate: '2025-01-15',
        status: 'paid',
        totalTaxAmount: 2100000,
        referenceNumber: 'SPT-MASA-2024-12',
        taxOffice: 'KPP Pratama Jakarta Tebet',
        taxFormNumber: 'SPT Masa',
        taxpayerIdNumber: '01.234.567.8-123.000',
        notes: 'SPT Masa Desember 2024',
        createdAt: '2025-01-05T15:10:00Z',
        updatedAt: '2025-01-20T09:45:00Z'
      },
      {
        id: '5',
        reportType: 'annual-return',
        periodStart: '2024-01-01',
        periodEnd: '2024-12-31',
        dueDate: '2025-04-30',
        status: 'draft',
        totalTaxAmount: 12950000,
        referenceNumber: 'SPT-TAHUNAN-2024',
        taxOffice: 'KPP Pratama Jakarta Tebet',
        taxFormNumber: 'SPT Tahunan PPh Badan',
        taxpayerIdNumber: '01.234.567.8-123.000',
        notes: 'SPT Tahunan 2024',
        createdAt: '2025-03-10T11:25:00Z',
        updatedAt: '2025-03-10T11:25:00Z'
      }
    ];

    // Apply filters
    let filteredReports = [...mockTaxReports];

    if (filter) {
      if (filter.reportType) {
        filteredReports = filteredReports.filter(report => report.reportType === filter.reportType);
      }

      if (filter.status) {
        filteredReports = filteredReports.filter(report => report.status === filter.status);
      }

      if (filter.dateRange) {
        if (filter.dateRange.start) {
          filteredReports = filteredReports.filter(
            report => new Date(report.periodEnd) >= new Date(filter.dateRange!.start!)
          );
        }
        if (filter.dateRange.end) {
          filteredReports = filteredReports.filter(
            report => new Date(report.periodStart) <= new Date(filter.dateRange!.end!)
          );
        }
      }

      if (filter.searchQuery) {
        const searchLower = filter.searchQuery.toLowerCase();
        filteredReports = filteredReports.filter(
          report =>
            report.referenceNumber?.toLowerCase().includes(searchLower) ||
            report.notes?.toLowerCase().includes(searchLower) ||
            report.taxFormNumber?.toLowerCase().includes(searchLower) ||
            report.taxpayerIdNumber?.toLowerCase().includes(searchLower)
        );
      }
    }

    // Sort by date (most recent first)
    filteredReports.sort((a, b) => new Date(b.periodEnd).getTime() - new Date(a.periodEnd).getTime());

    return filteredReports;

    // When database is ready, uncomment and use this code instead
    /*
    let query = supabase
      .from('tax_reports')
      .select('*')
      .order('period_end', { ascending: false });

    if (filter) {
      if (filter.reportType) {
        query = query.eq('report_type', filter.reportType);
      }

      if (filter.status) {
        query = query.eq('status', filter.status);
      }

      if (filter.dateRange) {
        if (filter.dateRange.start) {
          query = query.gte('period_end', filter.dateRange.start);
        }
        if (filter.dateRange.end) {
          query = query.lte('period_start', filter.dateRange.end);
        }
      }

      if (filter.searchQuery) {
        query = query.or(`reference_number.ilike.%${filter.searchQuery}%,notes.ilike.%${filter.searchQuery}%,tax_form_number.ilike.%${filter.searchQuery}%,taxpayer_id_number.ilike.%${filter.searchQuery}%`);
      }
    }

    const { data, error } = await query;

    if (error) throw error;

    return (data || []).map(item => ({
      id: item.id,
      reportType: item.report_type,
      periodStart: item.period_start,
      periodEnd: item.period_end,
      dueDate: item.due_date,
      status: item.status,
      totalTaxAmount: item.total_tax_amount,
      referenceNumber: item.reference_number,
      taxOffice: item.tax_office,
      taxFormNumber: item.tax_form_number,
      taxpayerIdNumber: item.taxpayer_id_number,
      notes: item.notes,
      attachments: item.attachments,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }));
    */
  } catch (error: any) {
    toast.error(`Error fetching tax reports: ${error.message}`);
    console.error('Error fetching tax reports:', error);
    return [];
  }
};

// Create tax report
export const createTaxReport = async (report: Omit<TaxReport, 'id' | 'createdAt' | 'updatedAt'>): Promise<TaxReport | null> => {
  try {
    // Mock creating a tax report (temporary until database tables are set up)
    const newReport: TaxReport = {
      id: `${Date.now()}`,
      ...report,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    toast.success('Laporan pajak berhasil dibuat');
    return newReport;

    // When database is ready, uncomment and use this code instead
    /*
    const { data, error } = await supabase
      .from('tax_reports')
      .insert({
        report_type: report.reportType,
        period_start: report.periodStart,
        period_end: report.periodEnd,
        due_date: report.dueDate,
        status: report.status,
        total_tax_amount: report.totalTaxAmount,
        reference_number: report.referenceNumber,
        tax_office: report.taxOffice,
        tax_form_number: report.taxFormNumber,
        taxpayer_id_number: report.taxpayerIdNumber,
        notes: report.notes,
        attachments: report.attachments
      })
      .select()
      .single();

    if (error) throw error;
    
    toast.success('Laporan pajak berhasil dibuat');
    
    return {
      id: data.id,
      reportType: data.report_type,
      periodStart: data.period_start,
      periodEnd: data.period_end,
      dueDate: data.due_date,
      status: data.status,
      totalTaxAmount: data.total_tax_amount,
      referenceNumber: data.reference_number,
      taxOffice: data.tax_office,
      taxFormNumber: data.tax_form_number,
      taxpayerIdNumber: data.taxpayer_id_number,
      notes: data.notes,
      attachments: data.attachments,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
    */
  } catch (error: any) {
    toast.error(`Error creating tax report: ${error.message}`);
    console.error('Error creating tax report:', error);
    return null;
  }
};

// Update tax report
export const updateTaxReport = async (id: string, report: Partial<TaxReport>): Promise<boolean> => {
  try {
    // Mock updating a tax report (temporary until database tables are set up)
    toast.success('Laporan pajak berhasil diperbarui');
    return true;

    // When database is ready, uncomment and use this code instead
    /*
    const updatePayload: any = {};
    
    if (report.reportType) updatePayload.report_type = report.reportType;
    if (report.periodStart) updatePayload.period_start = report.periodStart;
    if (report.periodEnd) updatePayload.period_end = report.periodEnd;
    if (report.dueDate) updatePayload.due_date = report.dueDate;
    if (report.status) updatePayload.status = report.status;
    if (report.totalTaxAmount) updatePayload.total_tax_amount = report.totalTaxAmount;
    if (report.referenceNumber) updatePayload.reference_number = report.referenceNumber;
    if (report.taxOffice) updatePayload.tax_office = report.taxOffice;
    if (report.taxFormNumber) updatePayload.tax_form_number = report.taxFormNumber;
    if (report.taxpayerIdNumber) updatePayload.taxpayer_id_number = report.taxpayerIdNumber;
    if (report.notes !== undefined) updatePayload.notes = report.notes;
    if (report.attachments !== undefined) updatePayload.attachments = report.attachments;

    const { error } = await supabase
      .from('tax_reports')
      .update(updatePayload)
      .eq('id', id);

    if (error) throw error;
    
    toast.success('Laporan pajak berhasil diperbarui');
    return true;
    */
  } catch (error: any) {
    toast.error(`Error updating tax report: ${error.message}`);
    console.error('Error updating tax report:', error);
    return false;
  }
};

// Delete tax report
export const deleteTaxReport = async (id: string): Promise<boolean> => {
  try {
    // Mock deleting a tax report (temporary until database tables are set up)
    toast.success('Laporan pajak berhasil dihapus');
    return true;

    // When database is ready, uncomment and use this code instead
    /*
    const { error } = await supabase
      .from('tax_reports')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    toast.success('Laporan pajak berhasil dihapus');
    return true;
    */
  } catch (error: any) {
    toast.error(`Error deleting tax report: ${error.message}`);
    console.error('Error deleting tax report:', error);
    return false;
  }
};
