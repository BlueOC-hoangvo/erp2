import { api, unwrap } from "@/lib/api";

export type Customer = {
  id: number;
  code?: string;
  name: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  address?: string;
  taxCode?: string;
  creditLimit?: number;
  paymentTerms?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CustomerCreate = {
  code?: string;
  name: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  address?: string;
  taxCode?: string;
  creditLimit?: number;
  paymentTerms?: number;
  isActive?: boolean;
};

export type CustomerUpdate = Partial<CustomerCreate>;

export type CustomerQuery = {
  page?: number;
  limit?: number;
  q?: string;
  name?: string;
  phone?: string;
  email?: string;
  isActive?: boolean;
};

export async function getCustomers(query: CustomerQuery = {}) {
  return unwrap<Customer[]>(api.get("/customers", { params: query }));
}

export async function getCustomerById(id: number) {
  return unwrap<Customer>(api.get(`/customers/${id}`));
}

export async function createCustomer(data: CustomerCreate) {
  return unwrap<Customer>(api.post("/customers", data));
}

export async function updateCustomer(id: number, data: CustomerUpdate) {
  return unwrap<Customer>(api.put(`/customers/${id}`, data));
}

export async function deleteCustomer(id: number) {
  return unwrap<{ ok: boolean }>(api.delete(`/customers/${id}`));
}

// Helper function to get customer status options
export function getCustomerStatusOptions() {
  return [
    { value: true, label: "Hoạt động" },
    { value: false, label: "Ngừng hoạt động" },
  ];
}

// Helper function to get payment terms options
export function getPaymentTermsOptions() {
  return [
    { value: 0, label: "Thanh toán ngay" },
    { value: 15, label: "15 ngày" },
    { value: 30, label: "30 ngày" },
    { value: 45, label: "45 ngày" },
    { value: 60, label: "60 ngày" },
    { value: 90, label: "90 ngày" },
  ];
}

