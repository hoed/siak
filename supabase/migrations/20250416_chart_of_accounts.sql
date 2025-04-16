
-- Create chart of accounts table
CREATE TABLE IF NOT EXISTS public.chart_of_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('asset', 'liability', 'equity', 'revenue', 'expense')),
  description TEXT,
  parent_id UUID REFERENCES public.chart_of_accounts(id),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES public.profiles(id)
);

-- Create RLS policies for chart_of_accounts
ALTER TABLE public.chart_of_accounts ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can view chart of accounts
CREATE POLICY "Everyone can view chart of accounts"
  ON public.chart_of_accounts
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policy: Only admins can create chart of accounts
CREATE POLICY "Only admins can create chart of accounts"
  ON public.chart_of_accounts
  FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM public.profiles 
      WHERE role = 'admin'
    )
  );

-- Policy: Only admins can update chart of accounts
CREATE POLICY "Only admins can update chart of accounts"
  ON public.chart_of_accounts
  FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM public.profiles 
      WHERE role = 'admin'
    )
  );

-- Policy: Only admins can delete chart of accounts
CREATE POLICY "Only admins can delete chart of accounts"
  ON public.chart_of_accounts
  FOR DELETE
  USING (
    auth.uid() IN (
      SELECT id FROM public.profiles 
      WHERE role = 'admin'
    )
  );

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_chart_of_accounts_timestamp
BEFORE UPDATE ON public.chart_of_accounts
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Seed default chart of accounts
INSERT INTO public.chart_of_accounts (code, name, type, description) VALUES
  ('1000', 'Aset', 'asset', 'Akun induk untuk semua aset'),
  ('1100', 'Kas dan Setara Kas', 'asset', 'Akun induk untuk kas dan setara kas'),
  ('1101', 'Kas', 'asset', 'Uang tunai'),
  ('1102', 'Bank', 'asset', 'Saldo rekening bank'),
  ('1200', 'Piutang', 'asset', 'Akun induk untuk piutang'),
  ('1201', 'Piutang Usaha', 'asset', 'Piutang dari aktivitas utama perusahaan'),
  ('1300', 'Aset Tetap', 'asset', 'Akun induk untuk aset tetap'),
  ('1301', 'Tanah', 'asset', 'Nilai tanah'),
  ('1302', 'Bangunan', 'asset', 'Nilai bangunan'),
  ('1303', 'Kendaraan', 'asset', 'Nilai kendaraan'),
  ('1304', 'Peralatan Kantor', 'asset', 'Nilai peralatan kantor'),
  
  ('2000', 'Kewajiban', 'liability', 'Akun induk untuk semua kewajiban'),
  ('2100', 'Hutang Jangka Pendek', 'liability', 'Akun induk untuk hutang jangka pendek'),
  ('2101', 'Hutang Usaha', 'liability', 'Hutang dari aktivitas utama perusahaan'),
  ('2102', 'Hutang Pajak', 'liability', 'Hutang pajak'),
  ('2200', 'Hutang Jangka Panjang', 'liability', 'Akun induk untuk hutang jangka panjang'),
  ('2201', 'Hutang Bank', 'liability', 'Hutang ke bank'),
  
  ('3000', 'Ekuitas', 'equity', 'Akun induk untuk semua ekuitas'),
  ('3100', 'Modal Disetor', 'equity', 'Modal yang disetor oleh pemilik'),
  ('3200', 'Laba Ditahan', 'equity', 'Laba yang belum dibagikan'),
  
  ('4000', 'Pendapatan', 'revenue', 'Akun induk untuk semua pendapatan'),
  ('4100', 'Pendapatan Usaha', 'revenue', 'Pendapatan dari aktivitas utama perusahaan'),
  ('4200', 'Pendapatan Lain-lain', 'revenue', 'Pendapatan dari aktivitas non-utama'),
  
  ('5000', 'Beban', 'expense', 'Akun induk untuk semua beban'),
  ('5100', 'Beban Operasional', 'expense', 'Beban untuk aktivitas operasional'),
  ('5101', 'Beban Gaji', 'expense', 'Beban gaji karyawan'),
  ('5102', 'Beban Sewa', 'expense', 'Beban sewa kantor/gedung'),
  ('5103', 'Beban Utilitas', 'expense', 'Beban listrik, air, internet, dll'),
  ('5104', 'Beban Transportasi', 'expense', 'Beban transportasi'),
  ('5200', 'Beban Non-Operasional', 'expense', 'Beban di luar aktivitas operasional'),
  ('5201', 'Beban Bunga', 'expense', 'Beban bunga pinjaman');

-- Update parent_id
UPDATE public.chart_of_accounts SET parent_id = (SELECT id FROM public.chart_of_accounts WHERE code = '1000') WHERE code LIKE '1_00' AND code != '1000';
UPDATE public.chart_of_accounts SET parent_id = (SELECT id FROM public.chart_of_accounts WHERE code = '1100') WHERE code LIKE '110_' AND code != '1100';
UPDATE public.chart_of_accounts SET parent_id = (SELECT id FROM public.chart_of_accounts WHERE code = '1200') WHERE code LIKE '120_' AND code != '1200';
UPDATE public.chart_of_accounts SET parent_id = (SELECT id FROM public.chart_of_accounts WHERE code = '1300') WHERE code LIKE '130_' AND code != '1300';

UPDATE public.chart_of_accounts SET parent_id = (SELECT id FROM public.chart_of_accounts WHERE code = '2000') WHERE code LIKE '2_00' AND code != '2000';
UPDATE public.chart_of_accounts SET parent_id = (SELECT id FROM public.chart_of_accounts WHERE code = '2100') WHERE code LIKE '210_' AND code != '2100';
UPDATE public.chart_of_accounts SET parent_id = (SELECT id FROM public.chart_of_accounts WHERE code = '2200') WHERE code LIKE '220_' AND code != '2200';

UPDATE public.chart_of_accounts SET parent_id = (SELECT id FROM public.chart_of_accounts WHERE code = '3000') WHERE code LIKE '3_00' AND code != '3000';

UPDATE public.chart_of_accounts SET parent_id = (SELECT id FROM public.chart_of_accounts WHERE code = '4000') WHERE code LIKE '4_00' AND code != '4000';

UPDATE public.chart_of_accounts SET parent_id = (SELECT id FROM public.chart_of_accounts WHERE code = '5000') WHERE code LIKE '5_00' AND code != '5000';
UPDATE public.chart_of_accounts SET parent_id = (SELECT id FROM public.chart_of_accounts WHERE code = '5100') WHERE code LIKE '510_' AND code != '5100';
UPDATE public.chart_of_accounts SET parent_id = (SELECT id FROM public.chart_of_accounts WHERE code = '5200') WHERE code LIKE '520_' AND code != '5200';
