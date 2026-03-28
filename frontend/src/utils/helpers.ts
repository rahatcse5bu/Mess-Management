import { format, startOfMonth, endOfMonth, subMonths, addMonths } from 'date-fns';

export function formatDate(date: Date | string): string {
  return format(new Date(date), 'yyyy-MM-dd');
}

export function formatDisplayDate(date: Date | string): string {
  return format(new Date(date), 'MMM d, yyyy');
}

export function formatShortDate(date: Date | string): string {
  return format(new Date(date), 'MMM d');
}

export function getCurrentMonthRange(): { from: string; to: string } {
  const now = new Date();
  return {
    from: formatDate(startOfMonth(now)),
    to: formatDate(endOfMonth(now)),
  };
}

export function getMonthRange(year: number, month: number): { from: string; to: string } {
  const date = new Date(year, month - 1, 1);
  return {
    from: formatDate(startOfMonth(date)),
    to: formatDate(endOfMonth(date)),
  };
}

export function getPreviousMonth(year: number, month: number): { year: number; month: number } {
  const date = subMonths(new Date(year, month - 1, 1), 1);
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
  };
}

export function getNextMonth(year: number, month: number): { year: number; month: number } {
  const date = addMonths(new Date(year, month - 1, 1), 1);
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
  };
}

export function getMonthName(month: number): string {
  return format(new Date(2024, month - 1, 1), 'MMMM');
}

export function formatCurrency(amount: number): string {
  return `৳${amount.toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function classNames(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
