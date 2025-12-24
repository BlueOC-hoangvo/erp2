import { api } from "@/lib/api";
import type { Quotation } from "../types";

const USE_MOCK = true;

// ---- MOCK DATA (temporary) ----
const mockQuotations: Quotation[] = [
  {
    id: "q1",
    code: "Q-2025-0001",
    customerId: "1",
    customerName: "Công ty ABC",
    validUntil: new Date(Date.now() + 7 * 86400000).toISOString(),
    status: "draft",
    subtotal: 12000000,
    discountAmount: 2000000,
    total: 10000000,
    createdAt: new Date().toISOString(),
    items: [
      {
        id: "qi1",
        productId: "p1",
        productSku: "SKU-001",
        productName: "Sản phẩm A",
        qty: 10,
        unitPrice: 1200000,
        lineTotal: 12000000,
      },
    ],
  },
  {
    id: "q2",
    code: "Q-2025-0002",
    customerId: "2",
    customerName: "Công ty XYZ",
    status: "sent",
    subtotal: 5000000,
    discountAmount: 0,
    total: 5000000,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    items: [
      {
        id: "qi2",
        productId: "p2",
        productSku: "SKU-002",
        productName: "Sản phẩm B",
        qty: 5,
        unitPrice: 1000000,
        lineTotal: 5000000,
      },
    ],
  },
];

export async function getQuotations(): Promise<Quotation[]> {
  if (USE_MOCK) return mockQuotations;
  const res = await api.get("/quotations");
  return res.data?.data ?? res.data;
}

export async function getQuotationById(id: string): Promise<Quotation> {
  if (USE_MOCK) {
    const q = mockQuotations.find((x) => x.id === id);
    if (!q) throw new Error("Quotation not found");
    return q;
  }
  const res = await api.get(`/quotations/${id}`);
  return res.data?.data ?? res.data;
}

export type UpsertQuotationInput = Omit<
  Quotation,
  "id" | "createdAt" | "customerName"
> & {
  id?: string;
  customerName?: string; // optional for mock
};

export async function upsertQuotation(
  input: UpsertQuotationInput
): Promise<Quotation> {
  if (USE_MOCK) {
    const now = new Date().toISOString();
    if (input.id) {
      const idx = mockQuotations.findIndex((x) => x.id === input.id);
      if (idx < 0) throw new Error("Quotation not found");
      mockQuotations[idx] = {
        ...mockQuotations[idx],
        ...input,
        customerName: input.customerName ?? mockQuotations[idx].customerName,
      };
      return mockQuotations[idx];
    }
    const newQ: Quotation = {
      id: `q_${Math.random().toString(16).slice(2)}`,
      code: input.code,
      customerId: input.customerId,
      customerName: input.customerName ?? "Khách hàng (mock)",
      validUntil: input.validUntil,
      status: input.status,
      subtotal: input.subtotal,
      discountAmount: input.discountAmount,
      total: input.total,
      createdAt: now,
      items: input.items ?? [],
    };
    mockQuotations.unshift(newQ);
    return newQ;
  }

  if (input.id) {
    const res = await api.put(`/quotations/${input.id}`, input);
    return res.data?.data ?? res.data;
  }
  const res = await api.post(`/quotations`, input);
  return res.data?.data ?? res.data;
}
