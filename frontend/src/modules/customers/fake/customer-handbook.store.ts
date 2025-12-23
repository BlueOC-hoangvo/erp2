export type CustomerHandbookEntity = {
  customerId: string;
  generalInfo?: any;
  persona?: any;
  carePolicy?: any;
  consultingHistory?: any;
  equipments?: any;
  updatedAt: string;
};

const KEY = "fake_customer_handbook_v1";

function readAll(): Record<string, CustomerHandbookEntity> {
  const raw = localStorage.getItem(KEY);
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as Record<string, CustomerHandbookEntity>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeAll(data: Record<string, CustomerHandbookEntity>) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function getHandbook(customerId: string): CustomerHandbookEntity | null {
  const all = readAll();
  return all[customerId] ?? null;
}

export function upsertHandbook(
  customerId: string,
  input: Omit<CustomerHandbookEntity, "customerId" | "updatedAt">
) {
  const all = readAll();
  const now = new Date().toISOString();
  all[customerId] = { customerId, updatedAt: now, ...input };
  writeAll(all);
  return all[customerId];
}
