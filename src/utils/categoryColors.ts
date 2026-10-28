/**
 * Shared category color palette (charts, breakdowns, dots).
 * Colors are fixed — independent of the user accent color.
 */
const CATEGORY_COLORS: Record<string, string> = {
  Food: "#10b981",
  Transportation: "#0ea5e9",
  Housing: "#f59e0b",
  Utilities: "#8b5cf6",
  Healthcare: "#ec4899",
  Entertainment: "#06b6d4",
  Shopping: "#ef4444",
  Education: "#84cc16",
  Personal: "#14b8a6",
  Other: "#64748b",
};

export const getCategoryColor = (category: string): string =>
  CATEGORY_COLORS[category] || "#64748b";
