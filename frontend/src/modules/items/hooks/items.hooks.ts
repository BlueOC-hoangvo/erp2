import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  type Item,
  type ItemCreate,
  type ItemUpdate,
  type ItemQuery,
} from "../api/items.api";

// Query Keys
export const ITEMS_QUERY_KEY = "items";

// Hook for listing items with pagination and search
export const useItems = (query: ItemQuery = {}) => {
  return useQuery({
    queryKey: [ITEMS_QUERY_KEY, query],
    queryFn: async () => {
      const response = await getItems(query);
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for single item
export const useItem = (id: number) => {
  return useQuery({
    queryKey: [ITEMS_QUERY_KEY, id],
    queryFn: async () => {
      const response = await getItemById(id);
      return response;
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook for creating item
export const useCreateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ItemCreate) => createItem(data),
    onSuccess: () => {
      // Invalidate items list to refresh
      queryClient.invalidateQueries({ queryKey: [ITEMS_QUERY_KEY] });
    },
    onError: (error: any) => {
      console.error("Failed to create item:", error);
    },
  });
};

// Hook for updating item
export const useUpdateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ItemUpdate }) =>
      updateItem(id, data),
    onSuccess: (response, variables) => {
      // Update the specific item in cache
      queryClient.setQueryData(
        [ITEMS_QUERY_KEY, variables.id],
        response
      );
      // Invalidate items list
      queryClient.invalidateQueries({ queryKey: [ITEMS_QUERY_KEY] });
    },
    onError: (error: any) => {
      console.error("Failed to update item:", error);
    },
  });
};

// Hook for deleting item
export const useDeleteItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteItem(id),
    onSuccess: (response, id) => {
      // Remove the specific item from cache
      queryClient.removeQueries({ queryKey: [ITEMS_QUERY_KEY, id] });
      // Invalidate items list
      queryClient.invalidateQueries({ queryKey: [ITEMS_QUERY_KEY] });
    },
    onError: (error: any) => {
      console.error("Failed to delete item:", error);
    },
  });
};

// Hook for getting items by type (for dropdowns)
export const useItemsByType = (itemType?: string) => {
  return useQuery({
    queryKey: [ITEMS_QUERY_KEY, "byType", itemType],
    queryFn: async () => {
      if (!itemType) return { data: [], meta: null };
      const response = await getItems({ itemType: itemType as any, pageSize: 100 });
      return response;
    },
    enabled: !!itemType,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

