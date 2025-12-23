export type QuotationStatus =
  | "draft"
  | "sent"
  | "accepted"
  | "rejected"
  | "expired";

export type QuotationItem = {
  id: string;
  productId: string;
  productSku?: string;
  productName: string;
  qty: number;
  unitPrice: number;
  lineTotal: number;
};

export type QuotationEntity = {
  id: string;
  code: string;
  customerId: string;
  customerName: string;
  validUntil?: string;
  status: QuotationStatus;

  subtotal: number;
  discountAmount: number;
  total: number;

  items: QuotationItem[];

  createdAt: string;
  updatedAt: string;
};

const KEY = "fake_quotations_v1";

function uid(prefix = "q") {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Math.random().toString(16).slice(2)}`;
}

function nowIso() {
  return new Date().toISOString();
}

function readAll(): QuotationEntity[] {
  const raw = localStorage.getItem(KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as QuotationEntity[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(data: QuotationEntity[]) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function seedQuotationsIfEmpty() {
  const all = readAll();
  if (all.length) return;

  const demo: QuotationEntity[] = [
    {
      id: uid(),
      code: "Q-2025-0001",
      customerId: "1",
      customerName: "Công ty ABC",
      validUntil: new Date(Date.now() + 7 * 86400000).toISOString(),
      status: "draft",
      subtotal: 1200000,
      discountAmount: 100000,
      total: 1100000,
      items: [
        {
          id: uid("qi"),
          productId: "p1",
          productSku: "SKU-001",
          productName: "Sản phẩm demo 1",
          qty: 2,
          unitPrice: 500000,
          lineTotal: 1000000,
        },
        {
          id: uid("qi"),
          productId: "p2",
          productSku: "SKU-002",
          productName: "Sản phẩm demo 2",
          qty: 1,
          unitPrice: 200000,
          lineTotal: 200000,
        },
      ],
      createdAt: nowIso(),
      updatedAt: nowIso(),
    },
  ];

  writeAll(demo);
}

export function listQuotations() {
  seedQuotationsIfEmpty();
  return readAll().sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function getQuotation(id: string) {
  seedQuotationsIfEmpty();
  return readAll().find((x) => x.id === id) ?? null;
}

export function upsertQuotation(
  input: Omit<QuotationEntity, "createdAt" | "updatedAt"> & {
    createdAt?: string;
  }
) {
  const all = readAll();
  const now = nowIso();

  const idx = all.findIndex((x) => x.id === input.id);
  if (idx >= 0) {
    all[idx] = { ...all[idx], ...input, updatedAt: now };
    writeAll(all);
    return all[idx];
  }

  const created: QuotationEntity = {
    ...input,
    createdAt: input.createdAt ?? now,
    updatedAt: now,
  };

  all.unshift(created);
  writeAll(all);
  return created;
}

export function deleteQuotation(id: string) {
  const all = readAll().filter((x) => x.id !== id);
  writeAll(all);
  return true;
}
