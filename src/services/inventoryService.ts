
// Update the updateInventoryItem function to accept a single parameter:
export const updateInventoryItem = async (item: InventoryItem): Promise<boolean> => {
  try {
    const { error } = await inventoryClient
      .from('inventory_items')
      .update({
        name: item.name,
        sku: item.sku,
        description: item.description,
        category: item.category,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        cost_price: item.costPrice,
        supplier_id: item.supplier_id,
        minimum_stock: item.minimumStock,
        location: item.location,
        image_url: item.imageUrl,
        barcode: item.barcode
      })
      .eq('id', item.id);
      
    if (error) throw error;
    
    return true;
  } catch (error: any) {
    toast.error(`Error updating inventory item: ${error.message}`);
    return false;
  }
};
