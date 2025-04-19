
import { inventoryClient } from '@/integrations/supabase/inventory-client';
import { toast } from 'sonner';
import { InventoryItem, Product, Ingredient, Asset } from '@/types/food-manufacturing';

// Get inventory items
export const getInventoryItems = async (): Promise<InventoryItem[]> => {
  try {
    // Mock data until database is fully implemented with the new schema
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Roti Tawar',
        sku: 'RT-001',
        description: 'Roti tawar putih reguler 400g',
        category: 'Roti',
        unitPrice: 15000,
        costPrice: 8000,
        quantity: 50,
        minimumStock: 20,
        isActive: true,
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-04-15T00:00:00Z'
      },
      {
        id: '2',
        name: 'Roti Gandum',
        sku: 'RG-001',
        description: 'Roti tawar gandum 400g',
        category: 'Roti',
        unitPrice: 18000,
        costPrice: 10000,
        quantity: 35,
        minimumStock: 15,
        isActive: true,
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-04-15T00:00:00Z'
      },
      {
        id: '3',
        name: 'Kue Lapis',
        sku: 'KL-001',
        description: 'Kue lapis legit premium 250g',
        category: 'Kue',
        unitPrice: 45000,
        costPrice: 25000,
        quantity: 20,
        minimumStock: 10,
        isActive: true,
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-04-15T00:00:00Z'
      },
      {
        id: '4',
        name: 'Donat Coklat',
        sku: 'DC-001',
        description: 'Donat dengan topping coklat 60g',
        category: 'Donat',
        unitPrice: 7500,
        costPrice: 3500,
        quantity: 40,
        minimumStock: 20,
        isActive: true,
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-04-15T00:00:00Z'
      },
      {
        id: '5',
        name: 'Cake Keju',
        sku: 'CK-001',
        description: 'Cake dengan topping keju 500g',
        category: 'Cake',
        unitPrice: 55000,
        costPrice: 30000,
        quantity: 15,
        minimumStock: 8,
        isActive: true,
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-04-15T00:00:00Z'
      }
    ];

    const mockIngredients: Ingredient[] = [
      {
        id: '1',
        name: 'Tepung Terigu',
        sku: 'TT-001',
        description: 'Tepung terigu protein tinggi',
        unit: 'kg',
        unitPrice: 15000,
        quantity: 150,
        minimumStock: 50,
        isActive: true,
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-04-15T00:00:00Z'
      },
      {
        id: '2',
        name: 'Gula Pasir',
        sku: 'GP-001',
        description: 'Gula pasir putih',
        unit: 'kg',
        unitPrice: 16000,
        quantity: 100,
        minimumStock: 30,
        isActive: true,
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-04-15T00:00:00Z'
      },
      {
        id: '3',
        name: 'Mentega',
        sku: 'MT-001',
        description: 'Mentega untuk roti dan kue',
        unit: 'kg',
        unitPrice: 35000,
        quantity: 50,
        minimumStock: 15,
        isActive: true,
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-04-15T00:00:00Z'
      },
      {
        id: '4',
        name: 'Telur',
        sku: 'TL-001',
        description: 'Telur ayam segar',
        unit: 'kg',
        unitPrice: 25000,
        quantity: 80,
        minimumStock: 20,
        isActive: true,
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-04-15T00:00:00Z'
      },
      {
        id: '5',
        name: 'Coklat Bubuk',
        sku: 'CB-001',
        description: 'Coklat bubuk premium',
        unit: 'kg',
        unitPrice: 85000,
        quantity: 25,
        minimumStock: 10,
        isActive: true,
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-04-15T00:00:00Z'
      },
      {
        id: '6',
        name: 'Ragi',
        sku: 'RG-001',
        description: 'Ragi kering instan',
        unit: 'kg',
        unitPrice: 150000,
        quantity: 10,
        minimumStock: 5,
        isActive: true,
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-04-15T00:00:00Z'
      },
      {
        id: '7',
        name: 'Keju',
        sku: 'KJ-001',
        description: 'Keju cheddar',
        unit: 'kg',
        unitPrice: 120000,
        quantity: 15,
        minimumStock: 5,
        isActive: true,
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-04-15T00:00:00Z'
      }
    ];

    const mockAssets: Asset[] = [
      {
        id: '1',
        name: 'Mixer Besar',
        category: 'fixed',
        purchaseDate: '2024-01-10',
        purchasePrice: 15000000,
        currentValue: 14000000,
        depreciationRate: 10,
        serialNumber: 'MX-2024-001',
        location: 'Dapur Produksi',
        notes: 'Mixer kapasitas 50kg',
        status: 'active',
        createdAt: '2024-01-10T00:00:00Z',
        updatedAt: '2025-04-15T00:00:00Z'
      },
      {
        id: '2',
        name: 'Oven Industri',
        category: 'fixed',
        purchaseDate: '2024-01-10',
        purchasePrice: 25000000,
        currentValue: 23000000,
        depreciationRate: 10,
        serialNumber: 'OV-2024-001',
        location: 'Dapur Produksi',
        notes: 'Oven 3 tingkat kapasitas tinggi',
        status: 'active',
        createdAt: '2024-01-10T00:00:00Z',
        updatedAt: '2025-04-15T00:00:00Z'
      },
      {
        id: '3',
        name: 'Kulkas Bahan',
        category: 'fixed',
        purchaseDate: '2024-01-15',
        purchasePrice: 8000000,
        currentValue: 7500000,
        depreciationRate: 10,
        serialNumber: 'RF-2024-001',
        location: 'Gudang Bahan',
        notes: 'Kulkas penyimpanan bahan 500L',
        status: 'active',
        createdAt: '2024-01-15T00:00:00Z',
        updatedAt: '2025-04-15T00:00:00Z'
      },
      {
        id: '4',
        name: 'Loyang Roti',
        category: 'non-fixed',
        purchaseDate: '2024-02-01',
        purchasePrice: 1500000,
        currentValue: 1500000,
        location: 'Dapur Produksi',
        notes: '20 set loyang roti standar',
        status: 'active',
        createdAt: '2024-02-01T00:00:00Z',
        updatedAt: '2025-04-15T00:00:00Z'
      },
      {
        id: '5',
        name: 'Cetakan Kue',
        category: 'non-fixed',
        purchaseDate: '2024-02-01',
        purchasePrice: 2000000,
        currentValue: 2000000,
        location: 'Dapur Produksi',
        notes: 'Berbagai cetakan kue',
        status: 'active',
        createdAt: '2024-02-01T00:00:00Z',
        updatedAt: '2025-04-15T00:00:00Z'
      }
    ];

    // Convert to inventory items
    const productItems: InventoryItem[] = mockProducts.map(product => ({
      id: product.id,
      itemType: 'product',
      itemId: product.id,
      name: product.name,
      sku: product.sku,
      category: product.category,
      quantity: product.quantity,
      minimumStock: product.minimumStock,
      unitPrice: product.unitPrice,
      isActive: product.isActive
    }));

    const ingredientItems: InventoryItem[] = mockIngredients.map(ingredient => ({
      id: ingredient.id,
      itemType: 'ingredient',
      itemId: ingredient.id,
      name: ingredient.name,
      sku: ingredient.sku,
      category: 'Bahan Baku',
      quantity: ingredient.quantity,
      minimumStock: ingredient.minimumStock,
      unitPrice: ingredient.unitPrice,
      isActive: ingredient.isActive
    }));

    const assetItems: InventoryItem[] = mockAssets.map(asset => ({
      id: asset.id,
      itemType: 'asset',
      itemId: asset.id,
      name: asset.name,
      sku: asset.serialNumber || asset.id,
      category: asset.category === 'fixed' ? 'Aset Tetap' : 'Aset Tidak Tetap',
      quantity: 1,
      minimumStock: 0,
      unitPrice: asset.currentValue,
      isActive: asset.status === 'active'
    }));

    return [...productItems, ...ingredientItems, ...assetItems];

    // When DB ready, uncomment this
    /*
    const { data, error } = await inventoryClient
      .from('inventory_items')
      .select(`
        *,
        products:product_id (*),
        ingredients:ingredient_id (*),
        assets:asset_id (*)
      `)
      .order('name');

    if (error) throw error;

    return (data || []).map(item => {
      let name = '';
      let sku = '';
      let category = '';
      let unitPrice = 0;

      if (item.item_type === 'product' && item.products) {
        name = item.products.name;
        sku = item.products.sku;
        category = item.products.category || '';
        unitPrice = item.products.unit_price;
      } else if (item.item_type === 'ingredient' && item.ingredients) {
        name = item.ingredients.name;
        sku = item.ingredients.sku;
        category = 'Bahan Baku';
        unitPrice = item.ingredients.unit_price;
      } else if (item.item_type === 'asset' && item.assets) {
        name = item.assets.name;
        sku = item.assets.serial_number || item.assets.id;
        category = item.assets.category === 'fixed' ? 'Aset Tetap' : 'Aset Tidak Tetap';
        unitPrice = item.assets.current_value;
      }

      return {
        id: item.id,
        itemType: item.item_type,
        itemId: item.item_id,
        name,
        sku,
        category,
        quantity: item.quantity,
        minimumStock: item.minimum_stock,
        unitPrice,
        isActive: item.is_active
      };
    });
    */
  } catch (error: any) {
    toast.error(`Error fetching inventory items: ${error.message}`);
    console.error('Error fetching inventory items:', error);
    return [];
  }
};

// Get inventory summary
export const getInventorySummary = async () => {
  try {
    const items = await getInventoryItems();
    
    const totalItems = items.length;
    const totalValue = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const lowStockItems = items
      .filter(item => item.quantity <= item.minimumStock && item.minimumStock > 0)
      .sort((a, b) => (a.quantity / a.minimumStock) - (b.quantity / b.minimumStock));

    // Mock recent transactions
    const recentTransactions = [
      {
        id: '1',
        itemId: '1',  // Tepung Terigu
        itemName: 'Tepung Terigu',
        type: 'purchase',
        quantity: 50,
        unitPrice: 15000,
        totalPrice: 750000,
        date: '2025-04-15',
        reference: 'PO-2025-04-001'
      },
      {
        id: '2',
        itemId: '4',  // Roti Tawar
        itemName: 'Roti Tawar',
        type: 'sale',
        quantity: 25,
        unitPrice: 15000,
        totalPrice: 375000,
        date: '2025-04-15',
        reference: 'SO-2025-04-001'
      },
      {
        id: '3',
        itemId: '3',  // Mentega
        itemName: 'Mentega',
        type: 'purchase',
        quantity: 20,
        unitPrice: 35000,
        totalPrice: 700000,
        date: '2025-04-14',
        reference: 'PO-2025-04-002'
      },
      {
        id: '4',
        itemId: '2',  // Roti Gandum
        itemName: 'Roti Gandum',
        type: 'sale',
        quantity: 15,
        unitPrice: 18000,
        totalPrice: 270000,
        date: '2025-04-14',
        reference: 'SO-2025-04-002'
      },
      {
        id: '5',
        itemId: '5',  // Cake Keju
        itemName: 'Cake Keju',
        type: 'sale',
        quantity: 5,
        unitPrice: 55000,
        totalPrice: 275000,
        date: '2025-04-13',
        reference: 'SO-2025-04-003'
      }
    ];

    return {
      totalItems,
      totalValue,
      lowStockItems,
      recentTransactions
    };
  } catch (error: any) {
    toast.error(`Error fetching inventory summary: ${error.message}`);
    console.error('Error fetching inventory summary:', error);
    return {
      totalItems: 0,
      totalValue: 0,
      lowStockItems: [],
      recentTransactions: []
    };
  }
};

// Create inventory item - Simplified for now, would need to be expanded for different item types
export const createInventoryItem = async (item: any): Promise<InventoryItem | null> => {
  try {
    // Mock creating item - would be replaced with actual database operations
    toast.success('Item inventaris berhasil ditambahkan');
    
    return {
      id: `${Date.now()}`,
      itemType: 'product',
      itemId: `${Date.now()}`,
      name: item.name,
      sku: item.sku,
      category: item.category,
      quantity: item.quantity,
      minimumStock: item.minimumStock,
      unitPrice: item.unitPrice,
      isActive: true
    };
  } catch (error: any) {
    toast.error(`Error creating inventory item: ${error.message}`);
    console.error('Error creating inventory item:', error);
    return null;
  }
};

// Update inventory item
export const updateInventoryItem = async (item: InventoryItem): Promise<boolean> => {
  try {
    // Mock updating item - would be replaced with actual database operations
    toast.success('Item inventaris berhasil diperbarui');
    return true;
  } catch (error: any) {
    toast.error(`Error updating inventory item: ${error.message}`);
    console.error('Error updating inventory item:', error);
    return false;
  }
};

// Delete inventory item
export const deleteInventoryItem = async (id: string): Promise<boolean> => {
  try {
    // Mock deleting item - would be replaced with actual database operations
    toast.success('Item inventaris berhasil dihapus');
    return true;
  } catch (error: any) {
    toast.error(`Error deleting inventory item: ${error.message}`);
    console.error('Error deleting inventory item:', error);
    return false;
  }
};

// Create inventory transaction
export const createInventoryTransaction = async (transaction: any): Promise<boolean> => {
  try {
    // Mock creating transaction - would be replaced with actual database operations
    toast.success('Transaksi inventaris berhasil dicatat');
    return true;
  } catch (error: any) {
    toast.error(`Error creating inventory transaction: ${error.message}`);
    console.error('Error creating inventory transaction:', error);
    return false;
  }
};
