import { api, unwrap } from "@/lib/api";

export type BomLine = {
  id: number;
  itemId: number;
  uom: string;
  qtyPerUnit: number;
  wastagePercent: number;
  item?: {
    id: number;
    name: string;
    sku?: string;
  };
};

export type Bom = {
  id: number;
  code?: string;
  productStyleId: number;
  productStyle?: {
    id: number;
    name: string;
    code: string;
  };
  name?: string;
  isActive: boolean;
  lines: BomLine[];
  createdAt: string;
  updatedAt: string;
};

export type BomCreate = {
  code?: string;
  productStyleId: number;
  name?: string;
  isActive?: boolean;
  lines?: Array<{
    itemId: number;
    uom?: string;
    qtyPerUnit: number;
    wastagePercent?: number;
  }>;
};

export type BomUpdate = Partial<BomCreate> & {
  productStyleId?: number;
  lines?: Array<{
    itemId: number;
    uom?: string;
    qtyPerUnit: number;
    wastagePercent?: number;
  }>;
};

export type BomQuery = {
  q?: string;
  productStyleId?: number;
  isActive?: boolean;
  page?: number;
  pageSize?: number;
};

export async function getBoms(query: BomQuery = {}) {
  return unwrap<Bom[]>(api.get("/boms", { params: query }));
}

export async function getBomById(id: number) {
  return unwrap<Bom>(api.get(`/boms/${id}`));
}

export async function createBom(data: BomCreate) {
  return unwrap<Bom>(api.post("/boms", data));
}

export async function updateBom(id: number, data: BomUpdate) {
  return unwrap<Bom>(api.put(`/boms/${id}`, data));
}

export async function deleteBom(id: number) {
  return unwrap<{ ok: boolean }>(api.delete(`/boms/${id}`));
}
