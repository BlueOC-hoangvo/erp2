// Sales Orders Custom Hooks
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getSalesOrders,
  getSalesOrderById,
  createSalesOrder,
  updateSalesOrder,
  deleteSalesOrder,
  confirmSalesOrder,
  cancelSalesOrder
} from "../sales-orders.api";
import type { 
  SalesOrderQuery,
  CreateSalesOrderRequest,
  UpdateSalesOrderRequest 
} from "../../types";

// Hook để lấy danh sách sales orders với pagination và filtering
export function useSalesOrders(query: SalesOrderQuery = {}) {
  return useQuery({
    queryKey: ["sales-orders", query],
    queryFn: () => getSalesOrders(query),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook để lấy chi tiết một sales order
export function useSalesOrder(id: string) {
  return useQuery({
    queryKey: ["sales-order", id],
    queryFn: () => getSalesOrderById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook để tạo sales order mới
export function useCreateSalesOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateSalesOrderRequest) => createSalesOrder(data),
    onSuccess: () => {
      // Invalidate và refetch sales-orders list
      queryClient.invalidateQueries({ queryKey: ["sales-orders"] });
    },
    onError: (error) => {
      console.error("Error creating sales order:", error);
    },
  });
}

// Hook để cập nhật sales order
export function useUpdateSalesOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSalesOrderRequest }) =>
      updateSalesOrder(id, data),
    onSuccess: (_, variables) => {
      // Update cache for the specific sales order
      queryClient.invalidateQueries({ queryKey: ["sales-order", variables.id] });
      // Invalidate list to refresh
      queryClient.invalidateQueries({ queryKey: ["sales-orders"] });
    },
    onError: (error) => {
      console.error("Error updating sales order:", error);
    },
  });
}

// Hook để xóa sales order
export function useDeleteSalesOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => deleteSalesOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales-orders"] });
    },
    onError: (error) => {
      console.error("Error deleting sales order:", error);
    },
  });
}

// Hook để xác nhận sales order
export function useConfirmSalesOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => confirmSalesOrder(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["sales-order", id] });
      queryClient.invalidateQueries({ queryKey: ["sales-orders"] });
    },
    onError: (error) => {
      console.error("Error confirming sales order:", error);
    },
  });
}

// Hook để hủy sales order
export function useCancelSalesOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => cancelSalesOrder(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["sales-order", id] });
      queryClient.invalidateQueries({ queryKey: ["sales-orders"] });
    },
    onError: (error) => {
      console.error("Error cancelling sales order:", error);
    },
  });
}

// Combined hook cho các actions
export function useSalesOrderActions() {
  const createMutation = useCreateSalesOrder();
  const updateMutation = useUpdateSalesOrder();
  const deleteMutation = useDeleteSalesOrder();
  const confirmMutation = useConfirmSalesOrder();
  const cancelMutation = useCancelSalesOrder();

  return {
    create: createMutation.mutateAsync,
    update: updateMutation.mutateAsync,
    delete: deleteMutation.mutateAsync,
    confirm: confirmMutation.mutateAsync,
    cancel: cancelMutation.mutateAsync,
    
    // Loading states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isConfirming: confirmMutation.isPending,
    isCancelling: cancelMutation.isPending,
    
    // Error states
    createError: createMutation.error,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error,
    confirmError: confirmMutation.error,
    cancelError: cancelMutation.error,
  };
}
