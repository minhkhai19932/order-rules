/**
 * Formats a monetary value with currency symbol.
 * Handles VND (no decimals) and other currencies (with decimals).
 *
 * @param amount - The amount to format
 * @param currency - Currency code (default: "VND")
 * @returns Formatted string like "1,000,000 ₫" or "$1,234.56"
 */
export function formatMoney(amount: number, currency: string = "VND"): string {
  if (currency === "VND") {
    // VND: no decimals, use comma separators, ₫ symbol
    return `${amount.toLocaleString("vi-VN")} ₫`;
  }

  // Other currencies: 2 decimals, use locale formatting
  const currencySymbols: Record<string, string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
  };

  const symbol = currencySymbols[currency] || currency;
  return `${symbol}${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Formats a date-time string into a readable format.
 * Handles undefined/null safely by returning a placeholder.
 *
 * @param dateTime - ISO date string or undefined/null
 * @returns Formatted string like "Jan 5, 2026, 2:30 PM" or "-" if invalid
 */
export function formatDateTime(dateTime: string | undefined | null): string {
  if (!dateTime) {
    return "-";
  }

  try {
    const date = new Date(dateTime);
    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return "-";
  }
}

/**
 * Formats an order status value into a human-readable label.
 * Falls back to "Unknown" for undefined or unexpected values.
 */
export function formatOrderStatusLabel(
  status: import("../types/order").OrderStatus | null | undefined
): string {
  if (!status) {
    return "Unknown";
  }

  const labels: Record<import("../types/order").OrderStatus, string> = {
    PENDING: "Pending",
    IN_TRANSIT: "In transit",
    OUT_FOR_DELIVERY: "Out for delivery",
    DELIVERED: "Delivered",
    RETURNED: "Returned",
    CANCELLED: "Cancelled",
  };

  return labels[status] ?? "Unknown";
}

/**
 * Formats a shipping status value into a distinct human-readable label
 * so it can be clearly differentiated from order status.
 * Falls back to "Unknown" for undefined or unexpected values.
 */
export function formatShippingStatusLabel(
  status: string | null | undefined
): string {
  if (!status) {
    return "Unknown";
  }

  switch (status) {
    case "PENDING":
      return "Awaiting Pickup";
    case "IN_TRANSIT":
      return "On the Way";
    case "OUT_FOR_DELIVERY":
      return "Courier Out";
    case "DELIVERED":
      return "Shipment Received";
    case "RETURNED":
      return "Returned to Sender";
    case "CANCELLED":
      return "Shipment Cancelled";
    default:
      return "Unknown";
  }
}