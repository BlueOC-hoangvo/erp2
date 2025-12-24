export type SalesOrderStatus =
  | "DRAFT"
  | "CONFIRMED"
  | "IN_PRODUCTION"
  | "DONE"
  | "CANCELLED";

export type SoBreakdown = {
  id: string;
  productVariantId: string;
  sizeCode: string;
  colorCode: string;
  qty: number;
};

export type SalesOrderItem = {
  id: string;
  lineNo: number;
  productStyleId: string;
  productStyleCode?: string;
  itemName: string;
  uom: string; // "pcs"
  qtyTotal: number;
  unitPrice: number;
  amount: number;
  note?: string;

  breakdowns: SoBreakdown[];
};

export type SalesOrderEntity = {
  id: string;
  orderNo: string;

  customerId: string;
  customerName: string;

  status: SalesOrderStatus;
  orderDate: string;
  dueDate?: string;
  note?: string;
  isInternal: boolean;

  // FE-only: trace từ quotation
  quotationId?: string;
  quotationCode?: string;

  items: SalesOrderItem[];

  createdAt: string;
  updatedAt: string;
};

const KEY = "fake_sales_orders_v2";

function uid(prefix = "so") {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Math.random()
    .toString(16)
    .slice(2)}`;
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

/**
 * Create SO from Quotation (FE-only).
 * Map quotation items => SalesOrderItem (productStyle level)
 */
export function createSalesOrderFromQuotation(q: {
  id: string;
  code: string;
  customerId: string;
  customerName: string;
  items: Array<{
    productId: string; // dùng tạm làm productStyleId
    productSku?: string;
    productName: string;
    qty: number;
    unitPrice: number;
    lineTotal: number;
  }>;
}) {
  const all = readAll();

  const orderNo = `SO-${new Date().getFullYear()}-${String(
    all.length + 1
  ).padStart(4, "0")}`;

  const items: SalesOrderItem[] = q.items.map((it, idx) => {
    const qtyTotal = Number(it.qty) || 0;
    const unitPrice = Number(it.unitPrice) || 0;
    const amount = qtyTotal * unitPrice;

    return {
      id: uid("soi"),
      lineNo: idx + 1,
      productStyleId: it.productId || `style_${idx + 1}`,
      productStyleCode: it.productSku,
      itemName: it.productName,
      uom: "pcs",
      qtyTotal,
      unitPrice,
      amount,
      breakdowns: [
        // breakdown demo (size/color) để bạn xem UI
        {
          id: uid("bd"),
          productVariantId: `variant_${idx + 1}_S_BLACK`,
          sizeCode: "S",
          colorCode: "BLACK",
          qty: qtyTotal,
        },
      ],
    };
  });

  const so: SalesOrderEntity = {
    id: uid("so"),
    orderNo,
    customerId: q.customerId,
    customerName: q.customerName,
    status: "DRAFT",
    orderDate: nowIso(),
    isInternal: false,

    quotationId: q.id,
    quotationCode: q.code,

    items,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };

  all.unshift(so);
  writeAll(all);
  return so;
}

export function updateSalesOrderStatus(id: string, status: SalesOrderStatus) {
  const all = readAll();
  const idx = all.findIndex((x) => x.id === id);
  if (idx < 0) return null;
  all[idx] = { ...all[idx], status, updatedAt: nowIso() };
  writeAll(all);
  return all[idx];
}

/**
 * Initialize demo data if no data exists
 */
export function initializeDemoData() {
  const existing = readAll();
  if (existing.length > 0) return;

  const demoData: SalesOrderEntity[] = [
    {
      id: uid("so"),
      orderNo: "SO-2024-0001",
      customerId: "CUST_001",
      customerName: "Công ty ABC",
      status: "CONFIRMED",
      orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      isInternal: false,
      items: [
        {
          id: uid("soi"),
          lineNo: 1,
          productStyleId: "STYLE_001",
          productStyleCode: "TSH001",
          itemName: "Áo thun basic",
          uom: "pcs",
          qtyTotal: 100,
          unitPrice: 50000,
          amount: 5000000,
          breakdowns: [
            {
              id: uid("bd"),
              productVariantId: "M_BLACK",
              sizeCode: "M",
              colorCode: "BLACK",
              qty: 50,
            },
            {
              id: uid("bd"),
              productVariantId: "L_WHITE",
              sizeCode: "L",
              colorCode: "WHITE",
              qty: 50,
            },
          ],
        },
      ],
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: uid("so"),
      orderNo: "SO-2024-0002",
      customerId: "CUST_002",
      customerName: "Công ty XYZ",
      status: "DRAFT",
      orderDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      isInternal: false,
      items: [
        {
          id: uid("soi"),
          lineNo: 1,
          productStyleId: "STYLE_002",
          productStyleCode: "POLO002",
          itemName: "Áo polo",
          uom: "pcs",
          qtyTotal: 50,
          unitPrice: 120000,
          amount: 6000000,
          breakdowns: [
            {
              id: uid("bd"),
              productVariantId: "L_BLUE",
              sizeCode: "L",
              colorCode: "BLUE",
              qty: 30,
            },
            {
              id: uid("bd"),
              productVariantId: "XL_RED",
              sizeCode: "XL",
              colorCode: "RED",
              qty: 20,
            },
          ],
        },
      ],
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: uid("so"),
      orderNo: "SO-2024-0003",
      customerId: "CUST_003",
      customerName: "Cửa hàng DEF",
      status: "IN_PRODUCTION",
      orderDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      isInternal: false,
      items: [
        {
          id: uid("soi"),
          lineNo: 1,
          productStyleId: "STYLE_003",
          productStyleCode: "HOOD003",
          itemName: "Áo hoodie",
          uom: "pcs",
          qtyTotal: 75,
          unitPrice: 180000,
          amount: 13500000,
          breakdowns: [
            {
              id: uid("bd"),
              productVariantId: "M_GRAY",
              sizeCode: "M",
              colorCode: "GRAY",
              qty: 25,
            },
            {
              id: uid("bd"),
              productVariantId: "L_GRAY",
              sizeCode: "L",
              colorCode: "GRAY",
              qty: 25,
            },
            {
              id: uid("bd"),
              productVariantId: "XL_BLACK",
              sizeCode: "XL",
              colorCode: "BLACK",
              qty: 25,
            },
          ],
        },
      ],
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  writeAll(demoData);
}
