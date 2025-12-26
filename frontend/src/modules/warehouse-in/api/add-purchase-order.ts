import { api, unwrap } from "@/lib/api";

export type PurchaseOrderLineCreate = {
  lineNo: number;
  itemId: string;        // bigint → gửi string
  uom?: string;
  qty: string;           // decimal string
  unitPrice: string;     // decimal string
};

export type PurchaseOrderCreateBody = {
  poNo: string;
  supplierId: string;    // bigint → gửi string
  orderDate?: string;    // ISO string
  status?: "DRAFT" | "CONFIRMED" | "RECEIVING" | "RECEIVED" | "CANCELLED";
  note?: string;
  lines: PurchaseOrderLineCreate[];
};

export type PurchaseOrderCreateResult = {
  id: string;
};

export async function createPurchaseOrder(body: PurchaseOrderCreateBody) {
  return unwrap<PurchaseOrderCreateResult>(
    api.post("/purchase-orders", {
      ...body,
      supplierId: String(body.supplierId),
      lines: body.lines.map((l) => ({
        ...l,
        itemId: String(l.itemId),
        uom: l.uom ?? "pcs",
        qty: String(l.qty),
        unitPrice: String(l.unitPrice),
      })),
      ...(body.orderDate
        ? { orderDate: new Date(body.orderDate).toISOString() }
        : {}),
    })
  );
}
