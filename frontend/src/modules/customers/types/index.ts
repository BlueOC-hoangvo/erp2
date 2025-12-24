export type Customer = {
  id: string; // BigInt -> string
  code?: string | null;
  name: string;
  taxCode?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  note?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type CustomerNote = {
  id: string;
  customerId: string;
  userId?: string | null;
  content: string;
  createdAt: string;
  user?: { id: string; fullName?: string; email?: string } | null;
};

export type PageMeta = {
  page?: number;
  pageSize?: number;
  total?: number;
};

export type Paged<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
};
