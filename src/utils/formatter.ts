
import { formatRupiah } from './currency';

/**
 * Format a date to Indonesian locale format
 * @param date - Date to format
 * @returns Formatted date string
 */
export const formatDate = (date: Date | string): string => {
  if (!date) return '-';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

/**
 * Format a date to shorter Indonesian locale format
 * @param date - Date to format
 * @returns Formatted date string (DD/MM/YYYY)
 */
export const formatShortDate = (date: Date | string): string => {
  if (!date) return '-';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

/**
 * Format a number with thousands separator
 * @param value - Number to format
 * @returns Formatted number string
 */
export const formatNumber = (value: number): string => {
  return value.toLocaleString('id-ID');
};

/**
 * Format a monetary value as Rupiah
 * @param value - Value to format
 * @param showDecimal - Whether to show decimal places
 * @returns Formatted Rupiah string
 */
export const formatCurrency = (value: number, showDecimal = false): string => {
  return formatRupiah(value, { decimal: showDecimal });
};

/**
 * Format a percentage value
 * @param value - Percentage value
 * @param decimals - Number of decimal places
 * @returns Formatted percentage string
 */
export const formatPercentage = (value: number, decimals = 2): string => {
  return `${value.toLocaleString('id-ID', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })}%`;
};
