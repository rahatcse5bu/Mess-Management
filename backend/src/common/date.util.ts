export function normalizeDate(input: Date | string): Date {
  const d = new Date(input);
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
}

export function dateKey(input: Date | string): string {
  return normalizeDate(input).toISOString().slice(0, 10);
}

export function addDays(input: Date | string, days: number): Date {
  const d = normalizeDate(input);
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

export function dayDiff(from: Date | string, to: Date | string): number {
  const f = normalizeDate(from);
  const t = normalizeDate(to);
  return Math.floor((t.getTime() - f.getTime()) / (1000 * 60 * 60 * 24));
}

export function getMonthRange(year: number, month: number): { start: Date; end: Date } {
  const start = new Date(Date.UTC(year, month - 1, 1));
  const end = new Date(Date.UTC(year, month, 0));
  return { start, end };
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
