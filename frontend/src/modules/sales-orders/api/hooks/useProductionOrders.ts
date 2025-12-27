import { useMutation } from '@tanstack/react-query';
import { createProductionOrderFromSalesOrder } from '../sales-orders.api';

export function useCreateProductionOrderFromSalesOrder() {
  return useMutation({
    mutationFn: (salesOrderId: string) => createProductionOrderFromSalesOrder(salesOrderId),
    onSuccess: (data: any) => {
      // Redirect to production order detail
      const productionOrderId = data.data?.id;
      if (productionOrderId) {
        window.location.href = `/production/orders/${productionOrderId}`;
      }
    },
    onError: (error: any) => {
      console.error('Error creating production order from sales order:', error);
    },
  });
}
