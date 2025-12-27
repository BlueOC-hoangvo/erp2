import { api, unwrap } from "@/lib/api";

export type ItemType = "FABRIC" | "ACCESSORY" | "PACKING" | "OTHER";

export type Item = {
  id: number;
  sku?: string;
  name: string;
  itemType: ItemType;
  baseUom: string;
  isActive: boolean;
  note?: string;
  createdAt: string;
  updatedAt: string;
};

export type ItemCreate = {
  sku?: string;
  name: string;
  itemType: ItemType;
  baseUom?: string;
  isActive?: boolean;
  note?: string;
};

export type ItemUpdate = Partial<ItemCreate>;

export type ItemQuery = {
  q?: string;
  itemType?: ItemType;
  isActive?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: "createdAt" | "updatedAt" | "name";
  sortOrder?: "asc" | "desc";
};

export async function getItems(query: ItemQuery = {}) {
  return unwrap<Item[]>(api.get("/items", { params: query }));
}

export async function getItemById(id: number) {
  return unwrap<Item>(api.get(`/items/${id}`));
}

export async function createItem(data: ItemCreate) {
  return unwrap<Item>(api.post("/items", data));
}

export async function updateItem(id: number, data: ItemUpdate) {
  return unwrap<Item>(api.put(`/items/${id}`, data));
}

export async function deleteItem(id: number) {
  return unwrap<{ ok: boolean }>(api.delete(`/items/${id}`));
}

// Helper function to get item type options
export function getItemTypeOptions() {
  return [
    { value: "FABRIC" as ItemType, label: "Vải" },
    { value: "ACCESSORY" as ItemType, label: "Phụ kiện" },
    { value: "PACKING" as ItemType, label: "Bao gói" },
    { value: "OTHER" as ItemType, label: "Khác" },
  ];
}

// Helper function to get UOM options
export function getUomOptions() {
  return [
    { value: "pcs", label: "Cái" },
    { value: "m", label: "Mét" },
    { value: "kg", label: "Kilogram" },
    { value: "meter", label: "Mét" },
    { value: "yard", label: "Yard" },
    { value: "roll", label: "Cuộn" },
    { value: "box", label: "Hộp" },
    { value: "pack", label: "Gói" },
  ];
}

