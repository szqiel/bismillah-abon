// Centralized formatting utilities for complete rebrandability

export const CURRENCY_SYMBOL = "Rp";
export const CURRENCY_CODE = "IDR";

/**
 * Formats a numeric price into full currency format (e.g. 450000 -> "Rp 450.000")
 */
export function formatCurrency(amount: number): string {
  return `${CURRENCY_SYMBOL} ${amount.toLocaleString("id-ID")}`;
}

/**
 * Formats a numeric price into compact 'k' notation (e.g. 450000 -> "450k")
 */
export function formatCompactCurrency(amount: number): string {
  if (amount >= 1000) {
    return `${(amount / 1000).toLocaleString("id-ID")}k`;
  }
  return `${amount}`;
}

/**
 * Formats ISO date string to readable date (e.g. "2026-07-26T10:00:00Z" -> "26 Jul 2026")
 */
export function formatDate(isoString: string): string {
  if (!isoString) return "-";
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return isoString;
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Formats ISO date string to readable date & time (e.g. "26 Jul 2026, 10.00")
 */
export function formatDateTime(isoString: string): string {
  if (!isoString) return "-";
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return isoString;
  const dateStr = d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const timeStr = d.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${dateStr}, ${timeStr}`;
}

/**
 * Helper to compute days difference between two ISO strings
 */
export function calculateDaysBetween(startIso: string, endIso: string): number {
  const start = new Date(startIso).getTime();
  const end = new Date(endIso).getTime();
  if (isNaN(start) || isNaN(end)) return 1;
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays);
}
