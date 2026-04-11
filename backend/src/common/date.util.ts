export const normalizeDate = (input: Date | string): Date => {
  const date = new Date(input);
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
};

export const dateKey = (input: Date | string): string =>
  normalizeDate(input).toISOString().slice(0, 10);

export const addDays = (input: Date, days: number): Date => {
  const date = new Date(input);
  date.setUTCDate(date.getUTCDate() + days);
  return date;
};

export const dayDiff = (from: Date, to: Date): number => {
  const ms = normalizeDate(to).getTime() - normalizeDate(from).getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
};
