import { describe, it, expect } from "vitest";
import { formatMoney, formatDateTime } from "./format";

describe("formatMoney", () => {
  it("should format VND currency without decimals", () => {
    // vi-VN locale uses dot as thousand separator
    expect(formatMoney(1000000, "VND")).toBe("1.000.000 ₫");
    expect(formatMoney(50000, "VND")).toBe("50.000 ₫");
    expect(formatMoney(1000, "VND")).toBe("1.000 ₫");
  });

  it("should format VND as default currency when not specified", () => {
    expect(formatMoney(1000000)).toBe("1.000.000 ₫");
  });

  it("should format USD currency with 2 decimals", () => {
    expect(formatMoney(1234.56, "USD")).toBe("$1,234.56");
    expect(formatMoney(1000, "USD")).toBe("$1,000.00");
    expect(formatMoney(0.99, "USD")).toBe("$0.99");
  });

  it("should format EUR currency with 2 decimals", () => {
    expect(formatMoney(1234.56, "EUR")).toBe("€1,234.56");
    expect(formatMoney(1000, "EUR")).toBe("€1,000.00");
  });

  it("should format GBP currency with 2 decimals", () => {
    expect(formatMoney(1234.56, "GBP")).toBe("£1,234.56");
  });

  it("should format JPY currency with 2 decimals", () => {
    expect(formatMoney(1234.56, "JPY")).toBe("¥1,234.56");
  });

  it("should format unknown currency code as-is", () => {
    expect(formatMoney(1234.56, "CAD")).toBe("CAD1,234.56");
  });

  it("should format zero value", () => {
    expect(formatMoney(0, "VND")).toBe("0 ₫");
    expect(formatMoney(0, "USD")).toBe("$0.00");
  });

  it("should format large values", () => {
    expect(formatMoney(999999999, "VND")).toBe("999.999.999 ₫");
    expect(formatMoney(999999999.99, "USD")).toBe("$999,999,999.99");
  });
});

describe("formatDateTime", () => {
  it("should format valid ISO date string", () => {
    const dateStr = "2026-01-07T14:30:00Z";
    const formatted = formatDateTime(dateStr);
    expect(formatted).toMatch(/Jan/);
    expect(formatted).toMatch(/2026/);
    expect(formatted).toMatch(/7/);
  });

  it("should format valid ISO date string with time", () => {
    const dateStr = "2026-12-25T23:59:59Z";
    const formatted = formatDateTime(dateStr);
    expect(formatted).toMatch(/Dec/);
    expect(formatted).toMatch(/2026/);
    // Timezone conversion may change the day, so check for either 25 or 26
    expect(formatted).toMatch(/25|26/);
  });

  it('should return "-" for undefined', () => {
    expect(formatDateTime(undefined)).toBe("-");
  });

  it('should return "-" for null', () => {
    expect(formatDateTime(null)).toBe("-");
  });

  it('should return "-" for empty string', () => {
    expect(formatDateTime("")).toBe("-");
  });

  it('should return "-" for invalid date string', () => {
    expect(formatDateTime("invalid-date")).toBe("-");
    expect(formatDateTime("not-a-date")).toBe("-");
  });
});
