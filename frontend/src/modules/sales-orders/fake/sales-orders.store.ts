export type SalesOrderStatus =
  | "draft"
  | "confirmed"
  | "processing"
  | "shipped"
  | "completed"
  | "cancelled";

export type SalesOrderItem = {
  id: string;
  productId: string;
  productSku?: string;
  productName: string;
  qty: number;
  unitPrice: number;
  lineTotal: number;
};

export type SalesOrderEntity = {
  id: string;
  code: string;

  customerId: string;
  customerName: string;

  quotationId?: string;
  quotationCode?: string;

  status: SalesOrderStatus;

  subtotal: number;
  discountAmount: number;
  total: number;

  items: SalesOrderItem[];

  createdAt: string;
  updatedAt: string;
};

const KEY = "fake_sales_orders_v1";

function uid(prefix = "so") {
  return `${prefix}_${Math.random().toString(16).slice(2)}`;
}

function nowIso() {
  return new Date().toISOString();
}

function readAll(): SalesOrderEntity[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

function writeAll(data: SalesOrderEntity[]) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function listSalesOrders() {
  return readAll().sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function getSalesOrder(id: string) {
  return readAll().find((x) => x.id === id) ?? null;
}

export function createSalesOrderFromQuotation(q: {
  id: string;
  code: string;
  customerId: string;
  customerName: string;
  subtotal: number;
  discountAmount: number;
  total: number;
  items: SalesOrderItem[];
}) {
  const all = readAll();

  const order: SalesOrderEntity = {
    id: uid(),
    code: `SO-${new Date().getFullYear()}-${String(all.length + 1).padStart(4, "0")}`,

    customerId: q.customerId,
    customerName: q.customerName,

    quotationId: q.id,
    quotationCode: q.code,

    status: "draft",

    subtotal: q.subtotal,
    discountAmount: q.discountAmount,
    total: q.total,

    items: q.items.map((it) => ({
      ...it,
      id: uid("soi"),
    })),

    createdAt: nowIso(),
    updatedAt: nowIso(),
  };

  all.unshift(order);
  writeAll(all);
  return order;
}
