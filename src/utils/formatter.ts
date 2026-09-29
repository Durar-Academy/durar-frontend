import { format } from "date-fns";

// The academy bills in NGN and USD. Unknown codes fall back to a readable
// code prefix rather than throwing out of `Intl`.
const CURRENCY_FORMATS: Record<string, { symbol: string; locale: string }> = {
  NGN: { symbol: "₦", locale: "en-NG" },
  USD: { symbol: "US$", locale: "en-US" },
};

function resolveCurrency(currency?: string) {
  const code = (currency ?? "NGN").toUpperCase();

  return CURRENCY_FORMATS[code] ?? { symbol: `${code} `, locale: "en-NG" };
}

export function formatAmount(amount: number, currency?: string) {
  const { symbol, locale } = resolveCurrency(currency);

  const formatNumber = (value: number) =>
    `${symbol}${value.toLocaleString(locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;

  if (amount >= 1_000_000) {
    return `${symbol}${(amount / 1_000_000).toFixed(1)}M`;
  }

  if (amount >= 100_000) {
    return `${symbol}${(amount / 1_000).toFixed(1)}k`;
  }

  return formatNumber(amount);
}

export function formatDateAndTime(isoDateString: Date) {
  const date = new Date(isoDateString);
  const formattedDate = date.toISOString().split("T")[0];

  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  const formattedTime = `${formattedHours}:${minutes.toString().padStart(2, "0")} ${ampm}`;

  return {
    date: formattedDate,
    time: formattedTime,
  };
}

export function formatOptionalDate(
  value: Date | string | null | undefined,
  formatString = "PP",
  placeholder = "—",
) {
  if (!value) return placeholder;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? placeholder : format(date, formatString);
}

export function formatToReadableId(id: string, prefix: string): string {
  const numbers = id.replace(/[^0-9]/g, "");
  const lastFiveDigits = numbers.slice(-5).padStart(5, "0");
  return `${prefix}-${lastFiveDigits}`;
}

export function formatUserName(user?: User) {
  if (!user) return { initials: "U", fullName: "Unknown", firstName: "Unknown" };

  const role = user.role?.toLowerCase();

  if (role === "admin") {
    return { initials: "AA", fullName: "Admin", firstName: "Admin" };
  }

  const firstInitial = user.firstName ? user.firstName[0].toUpperCase() : "";
  const lastInitial = user.lastName ? user.lastName[0].toUpperCase() : "";
  const fullName = `${user.firstName || "Unknown"} ${user.lastName || ""}`.trim();
  const firstName = user.firstName || "Unknown";

  return { initials: `${firstInitial}${lastInitial}`.trim(), fullName, firstName };
}
