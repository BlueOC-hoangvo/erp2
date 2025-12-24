export function formatDateTime(input?: string | Date | null) {
  if (!input) return "-";
  const d = typeof input === "string" ? new Date(input) : input;
  return d.toLocaleString("vi-VN");
}

export function formatDate(input?: string | Date | null) {
  if (!input) return "-";
  const d = typeof input === "string" ? new Date(input) : input;
  return d.toLocaleDateString("vi-VN");
}
