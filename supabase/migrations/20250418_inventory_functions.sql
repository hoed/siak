
-- 1. Get inventory items
CREATE OR REPLACE FUNCTION get_inventory_items()
RETURNS SETOF jsonb AS $$
BEGIN
    RETURN QUERY SELECT
        jsonb_build_object(
            'id', id,
            'name', name,
            'sku', sku,
            'description', description,
            'category', category,
            'quantity', quantity,
            'unit_price', unit_price,
            'cost_price', cost_price,
            'supplier_id', supplier_id,
            'minimum_stock', minimum_stock,
            'location', location,
            'image_url', image_url,
            'barcode', barcode,
            'created_at', created_at,
            'updated_at', updated_at
        )
    FROM inventory_items
    ORDER BY name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create inventory item
CREATE OR REPLACE FUNCTION create_inventory_item(
    p_name TEXT,
    p_sku TEXT,
    p_description TEXT DEFAULT NULL,
    p_category TEXT DEFAULT NULL,
    p_quantity INT DEFAULT 0,
    p_unit_price NUMERIC DEFAULT 0,
    p_cost_price NUMERIC DEFAULT 0,
    p_supplier_id TEXT DEFAULT NULL,
    p_minimum_stock INT DEFAULT 5,
    p_location TEXT DEFAULT NULL,
    p_image_url TEXT DEFAULT NULL,
    p_barcode TEXT DEFAULT NULL
)
RETURNS jsonb AS $$
DECLARE
    new_item jsonb;
BEGIN
    INSERT INTO inventory_items (
        name, sku, description, category, quantity, unit_price, 
        cost_price, supplier_id, minimum_stock, location, image_url, barcode
    ) VALUES (
        p_name, p_sku, p_description, p_category, p_quantity, p_unit_price,
        p_cost_price, p_supplier_id, p_minimum_stock, p_location, p_image_url, p_barcode
    )
    RETURNING jsonb_build_object(
        'id', id,
        'name', name,
        'sku', sku,
        'description', description,
        'category', category,
        'quantity', quantity,
        'unit_price', unit_price,
        'cost_price', cost_price,
        'supplier_id', supplier_id,
        'minimum_stock', minimum_stock,
        'location', location,
        'image_url', image_url,
        'barcode', barcode,
        'created_at', created_at,
        'updated_at', updated_at
    ) INTO new_item;
    
    RETURN new_item;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Update inventory item
CREATE OR REPLACE FUNCTION update_inventory_item(
    p_id TEXT,
    p_name TEXT,
    p_sku TEXT,
    p_description TEXT DEFAULT NULL,
    p_category TEXT DEFAULT NULL,
    p_quantity INT DEFAULT 0,
    p_unit_price NUMERIC DEFAULT 0,
    p_cost_price NUMERIC DEFAULT 0,
    p_supplier_id TEXT DEFAULT NULL,
    p_minimum_stock INT DEFAULT 5,
    p_location TEXT DEFAULT NULL,
    p_image_url TEXT DEFAULT NULL,
    p_barcode TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE inventory_items SET
        name = p_name,
        sku = p_sku,
        description = p_description,
        category = p_category,
        quantity = p_quantity,
        unit_price = p_unit_price,
        cost_price = p_cost_price,
        supplier_id = p_supplier_id,
        minimum_stock = p_minimum_stock,
        location = p_location,
        image_url = p_image_url,
        barcode = p_barcode,
        updated_at = now()
    WHERE id = p_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Delete inventory item
CREATE OR REPLACE FUNCTION delete_inventory_item(p_id TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    DELETE FROM inventory_items WHERE id = p_id;
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Get inventory transactions
CREATE OR REPLACE FUNCTION get_inventory_transactions()
RETURNS SETOF jsonb AS $$
BEGIN
    RETURN QUERY SELECT
        jsonb_build_object(
            'id', t.id,
            'item_id', t.item_id,
            'type', t.type,
            'quantity', t.quantity,
            'unit_price', t.unit_price,
            'total_price', t.total_price,
            'reference', t.reference,
            'date', t.date,
            'customer_id', t.customer_id,
            'supplier_id', t.supplier_id,
            'notes', t.notes,
            'created_at', t.created_at,
            'updated_at', t.updated_at,
            'item', jsonb_build_object(
                'id', i.id,
                'name', i.name,
                'sku', i.sku
            )
        )
    FROM inventory_transactions t
    JOIN inventory_items i ON t.item_id = i.id
    ORDER BY t.date DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Create inventory transaction
CREATE OR REPLACE FUNCTION create_inventory_transaction(
    p_item_id TEXT,
    p_type TEXT,
    p_quantity INT,
    p_unit_price NUMERIC,
    p_total_price NUMERIC,
    p_reference TEXT DEFAULT NULL,
    p_date TEXT,
    p_customer_id TEXT DEFAULT NULL,
    p_supplier_id TEXT DEFAULT NULL,
    p_notes TEXT DEFAULT NULL
)
RETURNS jsonb AS $$
DECLARE
    new_transaction jsonb;
    current_quantity INT;
    new_quantity INT;
BEGIN
    -- Get current quantity
    SELECT quantity INTO current_quantity FROM inventory_items WHERE id = p_item_id;
    
    -- Calculate new quantity based on transaction type
    CASE p_type
        WHEN 'purchase' THEN new_quantity := current_quantity + p_quantity;
        WHEN 'sale' THEN new_quantity := current_quantity - p_quantity;
        WHEN 'return' THEN new_quantity := current_quantity + p_quantity;
        WHEN 'adjustment' THEN new_quantity := current_quantity + p_quantity;
        ELSE new_quantity := current_quantity;
    END CASE;
    
    -- Update inventory item quantity
    UPDATE inventory_items SET quantity = new_quantity, updated_at = now() WHERE id = p_item_id;
    
    -- Create transaction record
    INSERT INTO inventory_transactions (
        item_id, type, quantity, unit_price, total_price, reference, date, 
        customer_id, supplier_id, notes
    ) VALUES (
        p_item_id, p_type, p_quantity, p_unit_price, p_total_price, p_reference, 
        p_date::DATE, p_customer_id, p_supplier_id, p_notes
    )
    RETURNING jsonb_build_object(
        'id', id,
        'item_id', item_id,
        'type', type,
        'quantity', quantity,
        'unit_price', unit_price,
        'total_price', total_price,
        'reference', reference,
        'date', date,
        'customer_id', customer_id,
        'supplier_id', supplier_id,
        'notes', notes,
        'created_at', created_at,
        'updated_at', updated_at
    ) INTO new_transaction;
    
    RETURN new_transaction;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Get inventory summary
CREATE OR REPLACE FUNCTION get_inventory_summary()
RETURNS jsonb AS $$
DECLARE
    total_items INT;
    total_value NUMERIC;
    low_stock_items jsonb;
    recent_transactions jsonb;
BEGIN
    -- Get total items count
    SELECT COUNT(*) INTO total_items FROM inventory_items;
    
    -- Get total inventory value
    SELECT COALESCE(SUM(quantity * unit_price), 0) INTO total_value FROM inventory_items;
    
    -- Get low stock items
    SELECT jsonb_agg(
        jsonb_build_object(
            'id', id,
            'name', name,
            'sku', sku,
            'description', description,
            'category', category,
            'quantity', quantity,
            'unit_price', unit_price,
            'cost_price', cost_price,
            'supplier_id', supplier_id,
            'minimum_stock', minimum_stock,
            'location', location,
            'image_url', image_url,
            'barcode', barcode,
            'created_at', created_at,
            'updated_at', updated_at
        )
    ) INTO low_stock_items
    FROM inventory_items
    WHERE quantity <= minimum_stock
    ORDER BY quantity;
    
    -- Get recent transactions
    SELECT jsonb_agg(
        jsonb_build_object(
            'id', t.id,
            'item_id', t.item_id,
            'type', t.type,
            'quantity', t.quantity,
            'unit_price', t.unit_price,
            'total_price', t.total_price,
            'reference', t.reference,
            'date', t.date,
            'customer_id', t.customer_id,
            'supplier_id', t.supplier_id,
            'notes', t.notes,
            'created_at', t.created_at,
            'updated_at', t.updated_at,
            'item', jsonb_build_object(
                'id', i.id,
                'name', i.name,
                'sku', i.sku
            )
        )
    ) INTO recent_transactions
    FROM inventory_transactions t
    JOIN inventory_items i ON t.item_id = i.id
    ORDER BY t.date DESC
    LIMIT 5;
    
    RETURN jsonb_build_object(
        'total_items', total_items,
        'total_value', total_value,
        'low_stock_items', COALESCE(low_stock_items, '[]'::jsonb),
        'recent_transactions', COALESCE(recent_transactions, '[]'::jsonb)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
