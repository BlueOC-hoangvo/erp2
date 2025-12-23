import { api, unwrap } from "@/lib/api";
import type { SalesOrder, SalesOrderFilters, SalesOrderStats } from "../types";

type GetSalesOrdersResponse = {
  data: SalesOrder[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

type GetSalesOrderStatsResponse = {
  data: SalesOrderStats;
};

export async function getSalesOrders(params?: SalesOrderFilters) {
  const queryParams = new URLSearchParams();
  
  if (params?.status?.length) {
    queryParams.append('status', params.status.join(','));
  }
  if (params?.orderType?.length) {
    queryParams.append('orderType', params.orderType.join(','));
  }
  if (params?.customerId) {
    queryParams.append('customerId', params.customerId);
  }
  if (params?.dateFrom) {
    queryParams.append('dateFrom', params.dateFrom);
  }
  if (params?.dateTo) {
    queryParams.append('dateTo', params.dateTo);
  }
  if (params?.search) {
    queryParams.append('search', params.search);
  }
  if (params?.page) {
    queryParams.append('page', params.page.toString());
  }
  if (params?.limit) {
    queryParams.append('limit', params.limit.toString());
  }
  if (params?.sortBy) {
    queryParams.append('sortBy', params.sortBy);
  }
  if (params?.sortOrder) {
    queryParams.append('sortOrder', params.sortOrder);
  }

  const queryString = queryParams.toString();
  const url = `/sales-orders${queryString ? `?${queryString}` : ''}`;
  
  return unwrap<GetSalesOrdersResponse>(api.get(url));
}

export async function getSalesOrderById(id: string) {
  return unwrap<{ data: SalesOrder }>(api.get(`/sales-orders/${id}`));
}

export async function getSalesOrderStats(params?: { 
  dateFrom?: string; 
  dateTo?: string; 
}) {
  const queryParams = new URLSearchParams();
  if (params?.dateFrom) queryParams.append('dateFrom', params.dateFrom);
  if (params?.dateTo) queryParams.append('dateTo', params.dateTo);
  
  const queryString = queryParams.toString();
  const url = `/sales-orders/stats${queryString ? `?${queryString}` : ''}`;
  
  return unwrap<GetSalesOrderStatsResponse>(api.get(url));
}
