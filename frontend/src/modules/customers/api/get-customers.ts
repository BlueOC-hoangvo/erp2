import { api, unwrap } from "@/lib/api";
import type { Customer, Paged } from "../types";

export type GetCustomersQuery = {
  q?: string;
  page?: number;
  pageSize?: number;
};

export async function getCustomers(q: GetCustomersQuery) {
  const params = {
    q: q.q || undefined,
    page: q.page ?? 1,
    pageSize: q.pageSize ?? 20,
  };
  // backend thường trả {data:{items,total,page,pageSize}} hoặc {data:items, meta:{...}}
  const res = await unwrap<any>(api.get("/customers", { params }));

  // normalize:
  const data = res.data;
  if (data?.items && typeof data.total === "number") {
    return data as Paged<Customer>;
  }

  // fallback: nếu BE trả array + meta
  const items = Array.isArray(data) ? (data as Customer[]) : [];
  const meta = res.meta || {};
  return {
    items,
    page: meta.page ?? params.page,
    pageSize: meta.pageSize ?? params.pageSize,
    total: meta.total ?? items.length,
  } as Paged<Customer>;
}
