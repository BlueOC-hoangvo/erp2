// BOM React Hooks
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { bomApi, bomUtils } from '../api/bom.api';
import type {
  Bom,
  BomListParams,
  CreateBomRequest,
  UpdateBomRequest,
  CreateBomVersionRequest,
  SubmitForApprovalRequest,
  ApproveRejectRequest,
  CreateBomTemplateRequest,
  CreateBomFromTemplateRequest
} from '../types/bom.types';

// Query Keys
export const bomKeys = {
  all: ['boms'] as const,
  lists: () => [...bomKeys.all, 'list'] as const,
  list: (params: BomListParams) => [...bomKeys.lists(), params] as const,
  details: () => [...bomKeys.all, 'detail'] as const,
  detail: (id: string) => [...bomKeys.details(), id] as const,
  explosion: (id: string, quantity?: number, versionId?: string) => 
    [...bomKeys.all, 'explosion', id, quantity, versionId] as const,
  cost: (id: string, quantity?: number, versionId?: string) => 
    [...bomKeys.all, 'cost', id, quantity, versionId] as const,
  leadTime: (id: string, versionId?: string) => 
    [...bomKeys.all, 'leadTime', id, versionId] as const,
  versions: () => [...bomKeys.all, 'versions'] as const,
  version: (id: string) => [...bomKeys.versions(), id] as const,
  currentVersion: (bomId: string) => [...bomKeys.all, 'currentVersion', bomId] as const,
  templates: () => [...bomKeys.all, 'templates'] as const,
  template: (id: string) => [...bomKeys.templates(), id] as const,
  comparison: (versionId1: string, versionId2: string) => 
    [...bomKeys.all, 'comparison', versionId1, versionId2] as const,
};

// Basic BOM hooks
export const useBoms = (params: BomListParams = {}) => {
  return useQuery({
    queryKey: bomKeys.list(params),
    queryFn: () => bomApi.list(params),
  });
};

export const useBom = (id: string) => {
  return useQuery({
    queryKey: bomKeys.detail(id),
    queryFn: () => bomApi.get(id),
    enabled: !!id,
  });
};

// BOM CRUD mutations
export const useCreateBom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBomRequest) => bomApi.create(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: bomKeys.lists() });
      toast.success('Tạo BOM thành công!');
      return response;
    },
    onError: (error: any) => {
      toast.error(error.message || 'Có lỗi xảy ra khi tạo BOM');
    },
  });
};

export const useUpdateBom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBomRequest }) =>
      bomApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: bomKeys.lists() });
      queryClient.invalidateQueries({ queryKey: bomKeys.detail(id) });
      toast.success('Cập nhật BOM thành công!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Có lỗi xảy ra khi cập nhật BOM');
    },
  });
};

export const useDeleteBom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => bomApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bomKeys.lists() });
      toast.success('Xóa BOM thành công!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Có lỗi xảy ra khi xóa BOM');
    },
  });
};

// Enhanced BOM features hooks
export const useBomExplosion = (
  id: string, 
  quantity: number = 1, 
  bomVersionId?: string
) => {
  return useQuery({
    queryKey: bomKeys.explosion(id, quantity, bomVersionId),
    queryFn: () => bomApi.explodeBom(id, quantity, bomVersionId),
    enabled: !!id,
  });
};

export const useBomCost = (
  id: string, 
  quantity: number = 1, 
  bomVersionId?: string
) => {
  return useQuery({
    queryKey: bomKeys.cost(id, quantity, bomVersionId),
    queryFn: () => bomApi.calculateCost(id, quantity, bomVersionId),
    enabled: !!id,
  });
};

export const useBomLeadTime = (id: string, bomVersionId?: string) => {
  return useQuery({
    queryKey: bomKeys.leadTime(id, bomVersionId),
    queryFn: () => bomApi.calculateLeadTime(id, bomVersionId),
    enabled: !!id,
  });
};

// BOM Versioning hooks
export const useCreateBomVersion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bomId, data }: { bomId: string; data: CreateBomVersionRequest }) =>
      bomApi.createVersion(bomId, data),
    onSuccess: (_, { bomId }) => {
      queryClient.invalidateQueries({ queryKey: bomKeys.detail(bomId) });
      queryClient.invalidateQueries({ queryKey: bomKeys.currentVersion(bomId) });
      toast.success('Tạo phiên bản BOM thành công!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Có lỗi xảy ra khi tạo phiên bản BOM');
    },
  });
};

export const useSubmitForApproval = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ versionId, data }: { versionId: string; data: SubmitForApprovalRequest }) =>
      bomApi.submitForApproval(versionId, data),
    onSuccess: (_, { versionId }) => {
      queryClient.invalidateQueries({ queryKey: bomKeys.version(versionId) });
      toast.success('Gửi phê duyệt thành công!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Có lỗi xảy ra khi gửi phê duyệt');
    },
  });
};

export const useApproveVersion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ versionId, data }: { versionId: string; data: ApproveRejectRequest }) =>
      bomApi.approveVersion(versionId, data),
    onSuccess: (_, { versionId }) => {
      queryClient.invalidateQueries({ queryKey: bomKeys.version(versionId) });
      toast.success('Phê duyệt thành công!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Có lỗi xảy ra khi phê duyệt');
    },
  });
};

export const useRejectVersion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ versionId, data }: { versionId: string; data: ApproveRejectRequest }) =>
      bomApi.rejectVersion(versionId, data),
    onSuccess: (_, { versionId }) => {
      queryClient.invalidateQueries({ queryKey: bomKeys.version(versionId) });
      toast.success('Từ chối thành công!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Có lỗi xảy ra khi từ chối');
    },
  });
};

export const useCurrentBomVersion = (bomId: string) => {
  return useQuery({
    queryKey: bomKeys.currentVersion(bomId),
    queryFn: () => bomApi.getCurrentVersion(bomId),
    enabled: !!bomId,
  });
};

export const useCompareVersions = (versionId1: string, versionId2: string) => {
  return useQuery({
    queryKey: bomKeys.comparison(versionId1, versionId2),
    queryFn: () => bomApi.compareVersions(versionId1, versionId2),
    enabled: !!versionId1 && !!versionId2 && versionId1 !== versionId2,
  });
};

// BOM Template hooks
export const useBomTemplates = () => {
  return useQuery({
    queryKey: bomKeys.templates(),
    queryFn: () => bomApi.listTemplates(),
  });
};

export const useCreateBomTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBomTemplateRequest) => bomApi.createTemplate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bomKeys.templates() });
      toast.success('Tạo template BOM thành công!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Có lỗi xảy ra khi tạo template');
    },
  });
};

export const useBomTemplate = (templateId: string) => {
  return useQuery({
    queryKey: bomKeys.template(templateId),
    queryFn: () => bomApi.getTemplate(templateId),
    enabled: !!templateId,
  });
};

export const useCreateBomFromTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ templateId, data }: { templateId: string; data: CreateBomFromTemplateRequest }) =>
      bomApi.createBomFromTemplate(templateId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bomKeys.lists() });
      toast.success('Tạo BOM từ template thành công!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Có lỗi xảy ra khi tạo BOM từ template');
    },
  });
};

// Utility hooks
export const useBomForm = () => {
  const createMutation = useCreateBom();
  const updateMutation = useUpdateBom();

  const handleSubmit = async (data: any, bomId?: string) => {
    const formattedData = bomUtils.formatBomForApi(data);
    
    if (bomId) {
      return updateMutation.mutateAsync({ id: bomId, data: formattedData });
    } else {
      return createMutation.mutateAsync(formattedData);
    }
  };

  return {
    submit: handleSubmit,
    isLoading: createMutation.isPending || updateMutation.isPending,
    error: createMutation.error || updateMutation.error,
  };
};

// Combined BOM data hook for detail view
export const useBomDetail = (bomId: string) => {
  const bomQuery = useBom(bomId);
  const currentVersionQuery = useCurrentBomVersion(bomId);
  const costQuery = useBomCost(bomId);
  const leadTimeQuery = useBomLeadTime(bomId);

  return {
    bom: bomQuery.data?.data,
    currentVersion: currentVersionQuery.data?.data,
    costAnalysis: costQuery.data?.data,
    leadTime: leadTimeQuery.data?.data,
    isLoading: bomQuery.isLoading || currentVersionQuery.isLoading,
    error: bomQuery.error || currentVersionQuery.error || costQuery.error || leadTimeQuery.error,
    refetch: () => {
      bomQuery.refetch();
      currentVersionQuery.refetch();
      costQuery.refetch();
      leadTimeQuery.refetch();
    },
  };
};
