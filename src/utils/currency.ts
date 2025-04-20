
/**
 * Format a number as Indonesian Rupiah currency
 * @param value - The number value to format
 * @param options - Formatting options
 * @returns Formatted Rupiah string
 */
export const formatRupiah = (value: number, options: { decimal?: boolean } = {}): string => {
  try {
    const formatter = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: options.decimal ? 2 : 0,
      maximumFractionDigits: options.decimal ? 2 : 0,
    });
    
    return formatter.format(value);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return `Rp ${value.toLocaleString('id-ID')}`;
  }
};

/**
 * Parse a Rupiah formatted string back to a number
 * @param rupiahString - The formatted Rupiah string
 * @returns Numeric value
 */
export const parseRupiah = (rupiahString: string): number => {
  // Remove currency symbol, dots, and replace comma with dot for decimal
  const cleaned = rupiahString
    .replace(/[^\d,]/g, '')
    .replace(',', '.');
  
  return parseFloat(cleaned) || 0;
};
