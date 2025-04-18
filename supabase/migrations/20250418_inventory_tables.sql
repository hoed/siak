
-- Create inventory_items table
CREATE TABLE IF NOT EXISTS inventory_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    sku TEXT NOT NULL UNIQUE,
    description TEXT,
    category TEXT,
    quantity INT NOT NULL DEFAULT 0,
    unit_price NUMERIC NOT NULL DEFAULT 0,
    cost_price NUMERIC NOT NULL DEFAULT 0,
    supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
    minimum_stock INT DEFAULT 5,
    location TEXT,
    image_url TEXT,
    barcode TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create inventory_transactions table
CREATE TABLE IF NOT EXISTS inventory_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('purchase', 'sale', 'adjustment', 'return')),
    quantity INT NOT NULL,
    unit_price NUMERIC NOT NULL,
    total_price NUMERIC NOT NULL,
    reference TEXT,
    date DATE NOT NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_inventory_items_name ON inventory_items(name);
CREATE INDEX idx_inventory_items_sku ON inventory_items(sku);
CREATE INDEX idx_inventory_items_category ON inventory_items(category);
CREATE INDEX idx_inventory_items_supplier_id ON inventory_items(supplier_id);
CREATE INDEX idx_inventory_transactions_item_id ON inventory_transactions(item_id);
CREATE INDEX idx_inventory_transactions_type ON inventory_transactions(type);
CREATE INDEX idx_inventory_transactions_date ON inventory_transactions(date);
CREATE INDEX idx_inventory_transactions_customer_id ON inventory_transactions(customer_id);
CREATE INDEX idx_inventory_transactions_supplier_id ON inventory_transactions(supplier_id);

-- Enable RLS on tables
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for inventory_items
CREATE POLICY "Allow read access to inventory_items for all authenticated users"
ON inventory_items FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow insert access to inventory_items for admin and manager"
ON inventory_items FOR INSERT
TO authenticated
USING (auth.jwt() ->> 'role' IN ('admin', 'manager'));

CREATE POLICY "Allow update access to inventory_items for admin and manager"
ON inventory_items FOR UPDATE
TO authenticated
USING (auth.jwt() ->> 'role' IN ('admin', 'manager'));

CREATE POLICY "Allow delete access to inventory_items for admin and manager"
ON inventory_items FOR DELETE
TO authenticated
USING (auth.jwt() ->> 'role' IN ('admin', 'manager'));

-- Create RLS policies for inventory_transactions
CREATE POLICY "Allow read access to inventory_transactions for all authenticated users"
ON inventory_transactions FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow insert access to inventory_transactions for admin and manager"
ON inventory_transactions FOR INSERT
TO authenticated
USING (auth.jwt() ->> 'role' IN ('admin', 'manager'));

CREATE POLICY "Allow update access to inventory_transactions for admin and manager"
ON inventory_transactions FOR UPDATE
TO authenticated
USING (auth.jwt() ->> 'role' IN ('admin', 'manager'));

CREATE POLICY "Allow delete access to inventory_transactions for admin and manager"
ON inventory_transactions FOR DELETE
TO authenticated
USING (auth.jwt() ->> 'role' IN ('admin', 'manager'));
