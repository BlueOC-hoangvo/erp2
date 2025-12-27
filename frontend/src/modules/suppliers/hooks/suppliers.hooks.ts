import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  type Supplier,
  type SupplierCreate,
  type SupplierUpdate,
  type SupplierQuery,
} from "../api/suppliers.api";

// Query Keys
export const SUPPLIERS_QUERY_KEY = "suppliers";

// Hooks for listing suppliers with pagination and search
export const useSuppliers = (query: SupplierQuery = {}) => {
  return useQuery({
    queryKey: [SUPPLIERS_QUERY_KEY, query],
    queryFn: async () => {
      const response = await getSuppliers(query);
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for single supplier
export const useSupplier = (id: number) => {
  return useQuery({
    queryKey: [SUPPLIERS_QUERY_KEY, id],
    queryFn: async () => {
      const response = await getSupplierById(id);
      return response;
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook for creating supplier
export const useCreateSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SupplierCreate) => createSupplier(data),
    onSuccess: () => {
      // Invalidate suppliers list to refresh
      queryClient.invalidateQueries({ queryKey: [SUPPLIERS_QUERY_KEY] });
    },
    onError: (error: any) => {
      console.error("Failed to create supplier:", error);
    },
  });
};

// Hook for updating supplier
export const useUpdateSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: SupplierUpdate }) =>
      updateSupplier(id, data),
    onSuccess: (response, variables) => {
      // Update the specific supplier in cache
      queryClient.setQueryData(
        [SUPPLIERS_QUERY_KEY, variables.id],
        response
      );
      // Invalidate suppliers list
      queryClient.invalidateQueries({ queryKey: [SUPPLIERS_QUERY_KEY] });
    },
    onError: (error: any) => {
      console.error("Failed to update supplier:", error);
    },
  });
};

// Hook for deleting supplier
export const useDeleteSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteSupplier(id),
    onSuccess: (response, id) => {
      // Remove the specific supplier from cache
      queryClient.removeQueries({ queryKey: [SUPPLIERS_QUERY_KEY, id] });
      // Invalidate suppliers list
      queryClient.invalidateQueries({ queryKey: [SUPPLIERS_QUERY_KEY] });
    },
    onError: (error: any) => {
      console.error("Failed to delete supplier:", error);
    },
  });
};

