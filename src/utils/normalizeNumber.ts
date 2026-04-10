// src/utils/normalizeNumber.ts
export const normalizeNumber = (value: number | string | null | undefined, defaultValue: number = 0): number => {
  if (value === null || value === undefined) return defaultValue;
  if (typeof value === 'number') return value;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
};