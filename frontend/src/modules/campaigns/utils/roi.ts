/**
 * Calculate ROI (Return on Investment) percentage
 * @param cost - Investment cost
 * @param revenue - Generated revenue
 * @returns ROI percentage, 0 if cost is 0 or invalid
 */
export function calculateROI(cost: number, revenue: number): number {
  // Validate inputs
  if (
    typeof cost !== "number" ||
    typeof revenue !== "number" ||
    Number.isNaN(cost) ||
    Number.isNaN(revenue) ||
    cost < 0 ||
    revenue < 0
  ) {
    return 0;
  }

  // Handle division by zero
  if (cost === 0) {
    return 0; // Cannot calculate ROI when cost is 0
  }

  // Calculate ROI percentage
  return ((revenue - cost) / cost) * 100;
}

/**
 * Calculate profit
 * @param cost - Investment cost
 * @param revenue - Generated revenue
 * @returns Profit amount, 0 if inputs are invalid
 */
export function calculateProfit(cost: number, revenue: number): number {
  // Validate inputs
  if (
    typeof cost !== "number" ||
    typeof revenue !== "number" ||
    Number.isNaN(cost) ||
    Number.isNaN(revenue)
  ) {
    return 0;
  }

  return revenue - cost;
}

/**
 * Format ROI for display
 * @param roi - ROI percentage
 * @returns Formatted ROI string with 1 decimal place
 */
export function formatROI(roi: number): string {
  if (typeof roi !== "number" || Number.isNaN(roi)) {
    return "0.0%";
  }

  return `${roi.toFixed(1)}%`;
}

/**
 * Format money for Vietnamese locale
 * @param amount - Money amount
 * @returns Formatted money string
 */
export function formatMoney(amount: number): string {
  if (typeof amount !== "number" || Number.isNaN(amount)) {
    return "0";
  }

  return Math.abs(amount).toLocaleString("vi-VN");
}
