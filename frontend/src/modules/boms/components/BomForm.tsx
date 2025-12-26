// BOM Form Component - Create/Edit BOM với validation đầy đủ
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { 
  PlusIcon, 
  TrashIcon, 
  ArrowLeftIcon,
  CheckIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { Modal } from '@/components/ui/Modal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { toast } from 'react-hot-toast';
import { useBom, useCreateBom, useUpdateBom } from '../hooks/useBoms';
import type { Bom, BomFormData, BomLineFormData } from '../types/bom.types';
import { urls } from '@/routes/urls';

// Zod validation schema
const bomLineSchema = z.object({
  itemId: z.string().min(1, 'Vui lòng chọn nguyên liệu'),
  uom: z.string().min(1, 'Vui lòng nhập đơn vị đo'),
  qtyPerUnit: z.number().min(0.01, 'Số lượng phải lớn hơn 0'),
  wastagePercent: z.number().min(0).max(100, 'Phần trăm hao hụt từ 0-100'),
  note: z.string().optional(),
  isOptional: z.boolean().default(false),
  leadTimeDays: z.number().min(0).default(0),
});

const bomFormSchema = z.object({
  code: z.string().min(1, 'Vui lòng nhập mã BOM').max(50, 'Mã BOM không quá 50 ký tự'),
  name: z.string().min(1, 'Vui lòng nhập tên BOM').max(200, 'Tên BOM không quá 200 ký tự'),
  productStyleId: z.string().min(1, 'Vui lòng chọn kiểu sản phẩm'),
  isActive: z.boolean().default(true),
  lines: z.array(bomLineSchema).min(1, 'BOM phải có ít nhất 1 nguyên liệu'),
});

type BomFormDataType = z.infer<typeof bomFormSchema>;

// Mock data - sẽ replace với API call thực
const mockItems = [
  { id: '1', code: 'FAB001', name: 'Vải Cotton', baseUom: 'm' },
  { id: '2', code: 'FAB002', name: 'Vải Polyester', baseUom: 'm' },
  { id: '3', code: 'THR001', name: 'Chỉ cotton', baseUom: 'cây' },
  { id: '4', code: 'BTN001', name: 'Nút áo', baseUom: 'cái' },
  { id: '5', code: 'ZIP001', name: 'Khoá kéo', baseUom: 'cái' },
];

const mockProductStyles = [
  { id: '1', code: 'TS001', name: 'Áo thun cổ tròn' },
  { id: '2', code: 'SH001', name: 'Áo sơ mi' },
  { id: '3', code: 'JD001', name: 'Quần jeans' },
  { id: '4', code: 'SK001', name: 'Váy' },
];

interface BomFormProps {
  mode?: 'create' | 'edit';
  initialData?: BomFormData;
  onSubmit?: (data: BomFormData) => void;
  onCancel?: () => void;
}

export const BomForm: React.FC<BomFormProps> = ({ 
  mode = 'create', 
  initialData,
  onSubmit,
  onCancel 
}) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Load existing BOM if editing
  const { data: existingBom, isLoading: isLoadingBom } = useBom(id || '');
  const createMutation = useCreateBom();
  const updateMutation = useUpdateBom();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty }
  } = useForm<BomFormDataType>({
    defaultValues: {
      code: '',
      name: '',
      productStyleId: '',
      isActive: true,
      lines: [
        {
          itemId: '',
          uom: 'pcs',
          qtyPerUnit: 1,
          wastagePercent: 0,
          note: '',
          isOptional: false,
          leadTimeDays: 0,
        }
      ],
    },
  });



  // Watch form changes to detect unsaved changes
  const watchedValues = watch();
  useEffect(() => {
    setUnsavedChanges(isDirty);
  }, [isDirty]);

  // Load existing BOM data if editing
  useEffect(() => {
    if (mode === 'edit' && existingBom) {
      const bomData = existingBom.data;
      reset({
        code: bomData.code || '',
        name: bomData.name,
        productStyleId: bomData.productStyleId,
        isActive: bomData.isActive,
        lines: bomData.lines?.map(line => ({
          itemId: line.itemId,
          uom: line.uom,
          qtyPerUnit: Number(line.qtyPerUnit),
          wastagePercent: Number(line.wastagePercent),
          note: line.note || '',
          isOptional: line.isOptional || false,
          leadTimeDays: line.leadTimeDays || 0,
        })) || [],
      });
    }
  }, [existingBom, mode, reset]);

  const handleFormSubmit = async (data: BomFormDataType) => {
    setIsSubmitting(true);
    try {
      const submitData = {
        code: data.code,
        name: data.name,
        productStyleId: data.productStyleId,
        isActive: data.isActive,
        lines: data.lines.map(line => ({
          itemId: line.itemId,
          uom: line.uom,
          qtyPerUnit: line.qtyPerUnit,
          wastagePercent: line.wastagePercent,
          note: line.note,
          isOptional: line.isOptional,
          leadTimeDays: line.leadTimeDays,
        })),
      };

      if (mode === 'create') {
        await createMutation.mutateAsync(submitData);
        toast.success('Tạo BOM thành công!');
        navigate(urls.BOMS);
      } else if (mode === 'edit' && id) {
        await updateMutation.mutateAsync({ id, data: submitData });
        toast.success('Cập nhật BOM thành công!');
        navigate(urls.BOMS_DETAIL(id));
      }

      if (onSubmit) {
        onSubmit(data);
      }
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (unsavedChanges) {
      setShowCancelModal(true);
    } else {
      handleNavigateBack();
    }
  };

  const handleNavigateBack = () => {
    if (mode === 'edit' && id) {
      navigate(urls.BOMS_DETAIL(id));
    } else {
      navigate(urls.BOMS);
    }
  };

  const addLine = () => {
    const newLines = [...(watchedValues.lines || []), {
      itemId: '',
      uom: 'pcs',
      qtyPerUnit: 1,
      wastagePercent: 0,
      note: '',
      isOptional: false,
      leadTimeDays: 0,
    }];
    setValue('lines', newLines);
  };

  const removeLine = (index: number) => {
    if ((watchedValues.lines?.length || 0) > 1) {
      const newLines = (watchedValues.lines || []).filter((_, i) => i !== index);
      setValue('lines', newLines);
    } else {
      toast.error('BOM phải có ít nhất 1 nguyên liệu');
    }
  };

  const calculateLineTotal = (line: BomLineFormData) => {
    const qty = line.qtyPerUnit;
    const wastage = (qty * line.wastagePercent) / 100;
    return qty + wastage;
  };

  const getItemName = (itemId: string) => {
    const item = mockItems.find(i => i.id === itemId);
    return item ? `${item.code} - ${item.name}` : '';
  };

  const getProductStyleName = (styleId: string) => {
    const style = mockProductStyles.find(s => s.id === styleId);
    return style ? `${style.code} - ${style.name}` : '';
  };

  if (mode === 'edit' && isLoadingBom) {
    return (
      <div className="p-6">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2">Đang tải thông tin BOM...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleCancel}
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {mode === 'create' ? 'Tạo BOM mới' : 'Chỉnh sửa BOM'}
            </h1>
            <p className="text-gray-600 mt-1">
              {mode === 'create' 
                ? 'Nhập thông tin để tạo công thức sản xuất mới'
                : 'Cập nhật thông tin công thức sản xuất'
              }
            </p>
          </div>
        </div>
        {unsavedChanges && (
          <div className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-md flex items-center">
            <InformationCircleIcon className="w-4 h-4 mr-1" />
            Chưa lưu
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* BOM Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin cơ bản</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* BOM Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mã BOM *
                </label>
                <Input
                  {...register('code')}
                  placeholder="VD: BOM-TSHIRT-001"
                  className={errors.code ? 'border-red-500' : ''}
                />
                {errors.code && (
                  <p className="text-red-500 text-sm mt-1">{errors.code.message}</p>
                )}
              </div>

              {/* BOM Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên BOM *
                </label>
                <Input
                  {...register('name')}
                  placeholder="VD: BOM Áo thun cổ tròn - Màu trắng"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              {/* Product Style */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kiểu sản phẩm *
                </label>
                <select
                  {...register('productStyleId')}
                  className={`w-full p-2 border rounded-md ${
                    errors.productStyleId ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Chọn kiểu sản phẩm</option>
                  {mockProductStyles.map(style => (
                    <option key={style.id} value={style.id}>
                      {style.code} - {style.name}
                    </option>
                  ))}
                </select>
                {errors.productStyleId && (
                  <p className="text-red-500 text-sm mt-1">{errors.productStyleId.message}</p>
                )}
              </div>

              {/* Active Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trạng thái
                </label>
                <div className="flex items-center space-x-2 pt-2">
                  <input
                    type="checkbox"
                    {...register('isActive')}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">
                    BOM đang hoạt động
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* BOM Line Items */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Nguyên liệu ({watchedValues.lines?.length || 0} dòng)</CardTitle>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={addLine}
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Thêm nguyên liệu
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {(watchedValues.lines?.length || 0) === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Chưa có nguyên liệu nào. Hãy thêm nguyên liệu đầu tiên.
              </div>
            ) : (
              <div className="space-y-4">
                {/* Header */}
                <div className="grid grid-cols-12 gap-2 text-sm font-medium text-gray-700 border-b pb-2">
                  <div className="col-span-2">Nguyên liệu</div>
                  <div className="col-span-1">Đơn vị</div>
                  <div className="col-span-1">Số lượng</div>
                  <div className="col-span-1">Hao hụt %</div>
                  <div className="col-span-2">Thực tế cần</div>
                  <div className="col-span-1">Lead time</div>
                  <div className="col-span-2">Ghi chú</div>
                  <div className="col-span-1">Tùy chọn</div>
                  <div className="col-span-1">Thao tác</div>
                </div>

                {/* Line Items */}
                {(watchedValues.lines || []).map((line: any, index: number) => {
                  const lineErrors = (errors as any).lines?.[index];
                  const currentLine = watchedValues.lines?.[index];

                  return (
                    <div key={index} className="grid grid-cols-12 gap-2 items-center border rounded-lg p-3">
                      {/* Item Selection */}
                      <div className="col-span-2">
                        <select
                          {...register(`lines.${index}.itemId`)}
                          className={`w-full p-2 border rounded-md text-sm ${
                            lineErrors?.itemId ? 'border-red-500' : 'border-gray-300'
                          }`}
                        >
                          <option value="">Chọn nguyên liệu</option>
                          {mockItems.map(item => (
                            <option key={item.id} value={item.id}>
                              {item.code} - {item.name}
                            </option>
                          ))}
                        </select>
                        {lineErrors?.itemId && (
                          <p className="text-red-500 text-xs mt-1">{lineErrors.itemId.message}</p>
                        )}
                      </div>

                      {/* UOM */}
                      <div className="col-span-1">
                        <Input
                          {...register(`lines.${index}.uom`)}
                          placeholder="pcs"
                          className="text-sm"
                        />
                      </div>

                      {/* Quantity */}
                      <div className="col-span-1">
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          {...register(`lines.${index}.qtyPerUnit`, { valueAsNumber: true })}
                          className="text-sm"
                        />
                      </div>

                      {/* Wastage Percent */}
                      <div className="col-span-1">
                        <Input
                          type="number"
                          step="0.1"
                          min="0"
                          max="100"
                          {...register(`lines.${index}.wastagePercent`, { valueAsNumber: true })}
                          className="text-sm"
                        />
                      </div>

                      {/* Effective Quantity */}
                      <div className="col-span-2">
                        <div className="text-sm font-medium">
                          {currentLine ? calculateLineTotal(currentLine).toFixed(2) : '0.00'} {currentLine?.uom || 'pcs'}
                        </div>
                        <div className="text-xs text-gray-500">
                          Base: {currentLine?.qtyPerUnit || 0} + Wastage: {((currentLine?.qtyPerUnit || 0) * (currentLine?.wastagePercent || 0) / 100).toFixed(2)}
                        </div>
                      </div>

                      {/* Lead Time */}
                      <div className="col-span-1">
                        <Input
                          type="number"
                          min="0"
                          {...register(`lines.${index}.leadTimeDays`, { valueAsNumber: true })}
                          placeholder="0"
                          className="text-sm"
                        />
                      </div>

                      {/* Note */}
                      <div className="col-span-2">
                        <Input
                          {...register(`lines.${index}.note`)}
                          placeholder="Ghi chú..."
                          className="text-sm"
                        />
                      </div>

                      {/* Optional */}
                      <div className="col-span-1">
                        <label className="flex items-center space-x-1">
                          <input
                            type="checkbox"
                            {...register(`lines.${index}.isOptional`)}
                            className="rounded"
                          />
                          <span className="text-xs">Tùy chọn</span>
                        </label>
                      </div>

                      {/* Actions */}
                      <div className="col-span-1">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeLine(index)}
                          disabled={(watchedValues.lines?.length || 0) === 1}
                        >
                          <TrashIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Summary */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{watchedValues.lines?.length || 0}</div>
                <div className="text-sm text-gray-600">Tổng nguyên liệu</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {watchedValues.lines?.filter(line => !line.isOptional).length || 0}
                </div>
                <div className="text-sm text-gray-600">Nguyên liệu bắt buộc</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {watchedValues.lines?.filter(line => line.isOptional).length || 0}
                </div>
                <div className="text-sm text-gray-600">Nguyên liệu tùy chọn</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="min-w-[120px]"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Đang lưu...
              </div>
            ) : (
              <div className="flex items-center">
                <CheckIcon className="w-4 h-4 mr-2" />
                {mode === 'create' ? 'Tạo BOM' : 'Cập nhật'}
              </div>
            )}
          </Button>
        </div>
      </form>

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Xác nhận hủy"
      >
        <div className="space-y-4">
          <Alert>
            <InformationCircleIcon className="h-4 w-4" />
            <AlertDescription>
              Bạn có thay đổi chưa lưu. Bạn có chắc chắn muốn hủy không?
            </AlertDescription>
          </Alert>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowCancelModal(false)}
            >
              Ở lại
            </Button>
            <Button
              variant="destructive"
              onClick={handleNavigateBack}
            >
              Hủy thay đổi
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
