
-- Create journal entries table
CREATE TABLE IF NOT EXISTS public.journal_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  description TEXT NOT NULL,
  entry_number TEXT NOT NULL,
  is_posted BOOLEAN NOT NULL DEFAULT FALSE,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create journal entry lines table
CREATE TABLE IF NOT EXISTS public.journal_entry_lines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  journal_entry_id UUID NOT NULL REFERENCES public.journal_entries(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES public.chart_of_accounts(id),
  description TEXT,
  debit NUMERIC(15, 2) NOT NULL DEFAULT 0,
  credit NUMERIC(15, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT debit_credit_check CHECK (
    (debit = 0 AND credit > 0) OR
    (credit = 0 AND debit > 0)
  )
);

-- Create RLS policies for journal_entries
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can view journal entries
CREATE POLICY "Everyone can view journal entries"
  ON public.journal_entries
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policy: Only admins and staff can create journal entries
CREATE POLICY "Only admins and staff can create journal entries"
  ON public.journal_entries
  FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM public.profiles 
      WHERE role IN ('admin', 'staff')
    )
  );

-- Policy: Only admins and staff can update journal entries
CREATE POLICY "Only admins and staff can update journal entries"
  ON public.journal_entries
  FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM public.profiles 
      WHERE role IN ('admin', 'staff')
    )
  );

-- Policy: Only admins can delete journal entries
CREATE POLICY "Only admins can delete journal entries"
  ON public.journal_entries
  FOR DELETE
  USING (
    auth.uid() IN (
      SELECT id FROM public.profiles 
      WHERE role = 'admin'
    )
  );

-- Create RLS policies for journal_entry_lines
ALTER TABLE public.journal_entry_lines ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can view journal entry lines
CREATE POLICY "Everyone can view journal entry lines"
  ON public.journal_entry_lines
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policy: Only admins and staff can create journal entry lines
CREATE POLICY "Only admins and staff can create journal entry lines"
  ON public.journal_entry_lines
  FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM public.profiles 
      WHERE role IN ('admin', 'staff')
    )
  );

-- Policy: Only admins and staff can update journal entry lines
CREATE POLICY "Only admins and staff can update journal entry lines"
  ON public.journal_entry_lines
  FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM public.profiles 
      WHERE role IN ('admin', 'staff')
    )
  );

-- Policy: Only admins can delete journal entry lines
CREATE POLICY "Only admins can delete journal entry lines"
  ON public.journal_entry_lines
  FOR DELETE
  USING (
    auth.uid() IN (
      SELECT id FROM public.profiles 
      WHERE role = 'admin'
    )
  );

-- Add trigger for updated_at
CREATE TRIGGER update_journal_entries_timestamp
BEFORE UPDATE ON public.journal_entries
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_journal_entry_lines_timestamp
BEFORE UPDATE ON public.journal_entry_lines
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();
