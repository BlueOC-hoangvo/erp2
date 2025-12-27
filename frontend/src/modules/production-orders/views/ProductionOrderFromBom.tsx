// Production Order từ BOM Component - Tạo Production Order dựa trên BOM
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { Modal } from '@/components/ui/Modal';
import { toast } from 'react-hot-toast';
import { useBom, useBomExplosion, useBomCost } from '../../boms/hooks/useBoms';
// import { bomApi } from '../../boms/api/bom.api';
import { urls } from '@/routes/urls';

interface ProductionOrderFromBomProps {
  // Có thể nhận bomId từ props hoặc từ URL params
}

export const ProductionOrderFromBom: React.FC<ProductionOrderFromBomProps> = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Get BOM ID từ URL params
  const bomId = searchParams.get('bomId');
  const suggestedQuantity = Number(searchParams.get('quantity') || '1');

  // Form state
  const [orderCode, setOrderCode] = useState('');
  const [quantity, setQuantity] = useState(suggestedQuantity);
  const [priority, setPriority] = useState<'low' | 'normal' | 'high'>('normal');
  const [scheduledStartDate, setScheduledStartDate] = useState('');
  const [scheduledEndDate, setScheduledEndDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // BOM data
  const { data: bomData, isLoading: bomLoading } = useBom(bomId || '');
  const { data: explosionData } = useBomExplosion(bomId || '', quantity);
  const { data: costData } = useBomCost(bomId || '', quantity);

  // Generate order code tự động
  useEffect(() => {
    if (bomData && !orderCode) {
      const now = new Date();
      const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
      const timeStr = now.getTime().toString().slice(-4);
      const bomCode = bomData.code || 'BOM';
      setOrderCode(`PO-${bomCode}-${dateStr}-${timeStr}`);
    }
  }, [bomData, orderCode]);

  const handleCreateProductionOrder = async () => {
    if (!bomId || !bomData) {
      toast.error('Không có thông tin BOM');
      return;
    }

    if (!orderCode.trim()) {
      toast.error('Vui lòng nhập mã Production Order');
      return;
    }

    if (quantity <= 0) {
      toast.error('Số lượng phải lớn hơn 0');
      return;
    }

    setIsCreating(true);
    try {
      // Tạo production order
      const response = await fetch('/api/production-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: orderCode,
          productStyleId: bomData.productStyleId,
          quantity,
          bomId,
          priority,
          scheduledStartDate: scheduledStartDate || null,
          scheduledEndDate: scheduledEndDate || null,
          notes,
          status: 'PLANNED'
        })
      });

      if (response.ok) {
        const result = await response.json();
        const newOrderId = result.data.id;
        
        toast.success('Tạo Production Order thành công!');
        
        // Navigate to production order detail
        navigate(urls.PRODUCTION_ORDER_DETAIL(newOrderId));
      } else {
        throw new Error('Failed to create production order');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tạo Production Order');
      console.error('Create production order error:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleGenerateFromBom = async () => {
    if (!bomId) {
      toast.error('Không có thông tin BOM');
      return;
    }

    try {
      // Đầu tiên tạo production order
      await handleCreateProductionOrder();
    } catch (error) {
      // Error đã được handle trong handleCreateProductionOrder
    }
  };

  if (bomLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2">Đang tải thông tin BOM...</span>
        </div>
      </div>
    );
  }

  if (!bomData) {
    return (
      <div className="p-6">
        <Alert>
          <AlertDescription>
            Không tìm thấy thông tin BOM. 
            <Button 
              variant="link" 
              onClick={() => navigate(urls.BOMS)}
              className="ml-2 p-0 h-auto"
            >
              Quay lại danh sách BOM
            </Button>
          </AlertDescription>
        </Alert>
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
            onClick={() => navigate(urls.PRODUCTION_ORDERS)}
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Tạo Production Order từ BOM
            </h1>
            <p className="text-gray-600 mt-1">
              Tạo đơn hàng sản xuất dựa trên BOM: {bomData.name}
            </p>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => navigate(urls.BOMS_DETAIL(bomId || ''))}>
            Xem BOM
          </Button>
          <Button onClick={handleGenerateFromBom} disabled={isCreating}>
            {isCreating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Đang tạo...
              </>
            ) : (
              <>
                <PlusIcon className="w-4 h-4 mr-2" />
                Tạo Production Order
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form thông tin Production Order */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin Production Order</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mã Production Order *
                  </label>
                  <Input
                    type="text"
                    value={orderCode}
                    onChange={(e) => setOrderCode(e.target.value)}
                    placeholder="Nhập mã Production Order"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số lượng sản phẩm *
                  </label>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      -
                    </Button>
                    <Input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                      className="text-center"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ưu tiên
                  </label>
                  <Select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as 'low' | 'normal' | 'high')}
                  >
                    <option value="low">Thấp</option>
                    <option value="normal">Bình thường</option>
                    <option value="high">Cao</option>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày bắt đầu dự kiến
                  </label>
                  <Input
                    type="date"
                    value={scheduledStartDate}
                    onChange={(e) => setScheduledStartDate(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày kết thúc dự kiến
                  </label>
                  <Input
                    type="date"
                    value={scheduledEndDate}
                    onChange={(e) => setScheduledEndDate(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ghi chú
                </label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Thêm ghi chú về Production Order này..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* BOM Materials Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Nguyên liệu sẽ được tạo</CardTitle>
            </CardHeader>
            <CardContent>
              {explosionData?.items && explosionData.items.length > 0 ? (
                <div className="space-y-2">
                  {explosionData.items.slice(0, 5).map((item: any, index: number) => (
                    <div key={item.itemId} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium">{item.itemName}</p>
                        <p className="text-sm text-gray-600">
                          SKU: {item.sku || 'N/A'} | Level {item.level || 0}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-blue-600">
                          {item.qtyRequired.toFixed(3)} {item.uom}
                        </p>
                      </div>
                    </div>
                  ))}
                  {explosionData.items.length > 5 && (
                    <div className="text-center text-sm text-gray-500">
                      ... và {explosionData.items.length - 5} nguyên liệu khác
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  Không có nguyên liệu nào trong BOM
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar thông tin tổng quan */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin BOM</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="text-sm text-gray-600">Mã BOM:</span>
                <p className="font-medium">{bomData.code || 'N/A'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Tên BOM:</span>
                <p className="font-medium">{bomData.name}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Trạng thái:</span>
                <Badge variant={bomData.isActive ? 'success' : 'secondary'}>
                  {bomData.isActive ? 'Hoạt động' : 'Không hoạt động'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Chi phí ước tính</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {costData ? 
                    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
                      .format(costData.totalMaterialCost || 0) : 
                    'Chưa tính'
                  }
                </div>
                <div className="text-sm text-gray-600">Tổng chi phí vật liệu</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-medium text-green-600">
                  {costData ? 
                    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
                      .format((costData.totalMaterialCost || 0) / quantity) : 
                    'Chưa tính'
                  }
                </div>
                <div className="text-sm text-gray-600">Chi phí/đơn vị</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Thống kê</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Số lượng:</span>
                <span className="font-medium">{quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Nguyên liệu:</span>
                <span className="font-medium">{explosionData?.items?.length || 0} loại</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Ưu tiên:</span>
                <Badge variant={priority === 'high' ? 'destructive' : priority === 'normal' ? 'default' : 'secondary'}>
                  {priority === 'high' ? 'Cao' : priority === 'normal' ? 'Bình thường' : 'Thấp'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Button 
            className="w-full" 
            onClick={handleGenerateFromBom} 
            disabled={isCreating}
          >
            {isCreating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Đang tạo...
              </>
            ) : (
              <>
                <PlusIcon className="w-4 h-4 mr-2" />
                Tạo Production Order
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
