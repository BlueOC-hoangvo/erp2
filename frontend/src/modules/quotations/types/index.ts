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

export type Quotation = {
  id: string;
  code: string;
  customerId: string;
  customerName: string;
  validUntil?: string; // ISO
  status: QuotationStatus;
  subtotal: number;
  discountAmount: number;
  total: number;
  createdAt: string; // ISO
  items?: QuotationItem[];
};
