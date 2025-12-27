// BOM Production Integration Hooks
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { api } from '@/lib/api';

interface GenerateMaterialsRequest {
  mode: 'replace' | 'merge';
  selectedItems: string[];
  quantity: number;
  notes?: string;
}

interface CreateProductionOrderFromBomRequest {
  code: string;
  productStyleId: string;
  quantity: number;
  bomId: string;
  priority: 'low' | 'normal' | 'high';
  scheduledStartDate?: string;
  scheduledEndDate?: string;
  notes?: string;
  status?: string;
}

interface CreateProductionOrderFromBomResponse {
  id: string;
  success: boolean;
  message: string;
}

// Query Keys cho BOM-Production integration
export const bomProductionKeys = {
  all: ['bom-production'] as const,
  materials: (orderId: string) => [...bomProductionKeys.all, 'materials', orderId] as const,
  create: (bomId: string) => [...bomProductionKeys.all, 'create', bomId] as const,
} as const;

// Hook để tạo nguyên liệu từ BOM cho Production Order
export const useGenerateMaterialsFromBom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, data }: { orderId: string; data: GenerateMaterialsRequest }) =>
      api.post(`/production-orders/${orderId}/generate-materials-from-bom`, data),
    onSuccess: (_, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: bomProductionKeys.materials(orderId) });
      toast.success('Tạo nguyên liệu từ BOM thành công!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Có lỗi xảy ra khi tạo nguyên liệu');
    },
  });
};

// Hook để tạo Production Order từ BOM
export const useCreateProductionOrderFromBom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductionOrderFromBomRequest) =>
      api.post('/production-orders/create-from-bom', data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['production-orders'] });
      toast.success('Tạo Production Order từ BOM thành công!');
      return response;
    },
    onError: (error: any) => {
      toast.error(error.message || 'Có lỗi xảy ra khi tạo Production Order');
    },
  });
};

// Hook để lấy danh sách Production Orders có BOM
export const useProductionOrdersWithBom = () => {
  return api.get('/production-orders/with-bom');
};

// Hook để kiểm tra BOM compatibility với Production
export const useBomProductionCompatibility = (bomId: string) => {
  return api.get(`/boms/${bomId}/production-compatibility`);
};

// Hook để lấy material requirements từ BOM
export const useBomMaterialRequirements = (bomId: string, quantity: number = 1) => {
  return api.get(`/boms/${bomId}/material-requirements`, { 
    params: { quantity } 
  });
};

// Hook để tạo nhiều Production Orders từ BOM
export const useCreateMultipleProductionOrdersFromBom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orders: CreateProductionOrderFromBomRequest[]) =>
      api.post('/production-orders/create-multiple-from-bom', { orders }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['production-orders'] });
      toast.success('Tạo nhiều Production Orders thành công!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Có lỗi xảy ra khi tạo Production Orders');
    },
  });
};

// Hook để sync BOM changes với Production Orders
export const useSyncBomWithProduction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bomId: string) =>
      api.post(`/boms/${bomId}/sync-with-production`),
    onSuccess: (_, bomId) => {
      queryClient.invalidateQueries({ queryKey: ['production-orders'] });
      queryClient.invalidateQueries({ queryKey: bomProductionKeys.all });
      toast.success('Đồng bộ BOM với Production thành công!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Có lỗi xảy ra khi đồng bộ BOM');
    },
  });
};

// Utility functions
export const bomProductionUtils = {
  // Validate BOM cho production
  validateBomForProduction: (bom: any) => {
    const issues = [];
    
    if (!bom.lines || bom.lines.length === 0) {
      issues.push('BOM không có nguyên liệu nào');
    }
    
    if (!bom.isActive) {
      issues.push('BOM không ở trạng thái hoạt động');
    }
    
    // Kiểm tra từng line có đầy đủ thông tin không
    bom.lines?.forEach((line: any, index: number) => {
      if (!line.itemId) {
        issues.push(`Line ${index + 1}: Thiếu thông tin item`);
      }
      if (!line.uom) {
        issues.push(`Line ${index + 1}: Thiếu đơn vị đo`);
      }
      if (!line.qtyPerUnit || line.qtyPerUnit <= 0) {
        issues.push(`Line ${index + 1}: Số lượng không hợp lệ`);
      }
    });
    
    return {
      isValid: issues.length === 0,
      issues
    };
  },

  // Format production order từ BOM data
  formatProductionOrderFromBom: (bomData: any, quantity: number, options: {
    code?: string;
    priority?: 'low' | 'normal' | 'high';
    scheduledStartDate?: string;
    scheduledEndDate?: string;
    notes?: string;
  } = {}) => {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const timeStr = now.getTime().toString().slice(-4);
    const bomCode = bomData.code || 'BOM';
    
    return {
      code: options.code || `PO-${bomCode}-${dateStr}-${timeStr}`,
      productStyleId: bomData.productStyleId,
      quantity,
      bomId: bomData.id,
      priority: options.priority || 'normal',
      scheduledStartDate: options.scheduledStartDate,
      scheduledEndDate: options.scheduledEndDate,
      notes: options.notes || `Tạo từ BOM: ${bomData.name}`,
      status: 'PLANNED'
    };
  },

  // Tính toán material requirements
  calculateMaterialRequirements: (bomLines: any[], quantity: number) => {
    return bomLines.map(line => {
      const effectiveQty = line.qtyPerUnit * (1 + (line.wastagePercent || 0) / 100);
      const requiredQty = effectiveQty * quantity;
      
      return {
        itemId: line.itemId,
        itemName: line.item?.name,
        sku: line.item?.sku,
        uom: line.uom,
        qtyPerUnit: line.qtyPerUnit,
        wastagePercent: line.wastagePercent || 0,
        effectiveQty,
        requiredQty,
        isOptional: line.isOptional || false,
        leadTimeDays: line.leadTimeDays || 0,
        note: line.note
      };
    });
  },

  // Tạo summary cho production integration
  createProductionSummary: (bomData: any, quantity: number, materialRequirements: any[]) => {
    const totalItems = materialRequirements.length;
    const requiredItems = materialRequirements.filter(item => !item.isOptional).length;
    const optionalItems = materialRequirements.filter(item => item.isOptional).length;
    const maxLeadTime = Math.max(...materialRequirements.map(item => item.leadTimeDays));
    
    return {
      bomId: bomData.id,
      bomName: bomData.name,
      quantity,
      totalItems,
      requiredItems,
      optionalItems,
      maxLeadTime,
      hasValidBoms: !!bomData.isActive,
      materialRequirements
    };
  }
};
