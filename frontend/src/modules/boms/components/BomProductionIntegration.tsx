// BOM Production Integration Component - Kết nối BOM với Production Orders
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  CogIcon,
  PlayIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { Badge } from '@/components/ui/Badge';
import { toast } from 'react-hot-toast';
import { 
  useBomDetail, 
  useBomExplosion, 
  useBomCost,
  useBomLeadTime 
} from '../hooks/useBoms';
import { urls } from '@/routes/urls';

interface BomProductionIntegrationProps {
  bomId?: string;
}

export const BomProductionIntegration: React.FC<BomProductionIntegrationProps> = ({ 
  bomId: propBomId 
}) => {
  const { id: urlBomId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const bomId = propBomId || urlBomId || '';
  
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [productionMode, setProductionMode] = useState<'create' | 'existing'>('create');
  const [existingOrderId, setExistingOrderId] = useState('');
  const [notes, setNotes] = useState('');
  const [generateModal, setGenerateModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // BOM data
  const { 
    bom: bomData, 
    isLoading: bomLoading 
  } = useBomDetail(bomId);
  
  const { data: explosionData } = useBomExplosion(bomId, selectedQuantity);
  const { data: costData } = useBomCost(bomId, selectedQuantity);
  const { data: leadTimeData } = useBomLeadTime(bomId);

  const handleItemToggle = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === explosionData?.items?.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(explosionData?.items?.map(item => item.itemId) || []);
    }
  };

  const handleGenerateMaterials = async () => {
    if (!bomId || selectedItems.length === 0) {
      toast.error('Vui lòng chọn ít nhất một nguyên liệu');
      return;
    }

    setIsGenerating(true);
    try {
      // Call production order API to generate materials from BOM
      const response = await fetch(`/api/production-orders/${existingOrderId}/generate-materials-from-bom`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mode: 'replace',
          selectedItems,
          quantity: selectedQuantity,
          notes
        })
      });

      if (response.ok) {
        await response.json();
        toast.success('Tạo nguyên liệu từ BOM thành công!');
        setGenerateModal(false);
        
        // Navigate to production order detail
        if (existingOrderId) {
          navigate(urls.PRODUCTION_ORDER_DETAIL(existingOrderId));
        }
      } else {
        throw new Error('Failed to generate materials');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tạo nguyên liệu');
      console.error('Generate materials error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateProductionOrder = () => {
    navigate(`${urls.PRODUCTION_ORDERS}/create?bomId=${bomId}&quantity=${selectedQuantity}`);
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
            onClick={() => navigate(urls.BOMS_DETAIL(bomId))}
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Quay lại BOM
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Tích hợp BOM với Production
            </h1>
            <p className="text-gray-600 mt-1">
              Tạo nguyên liệu sản xuất từ BOM: {bomData.name}
            </p>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleCreateProductionOrder}>
            <PlayIcon className="w-4 h-4 mr-2" />
            Tạo Production Order mới
          </Button>
          <Button onClick={() => setGenerateModal(true)}>
            <CogIcon className="w-4 h-4 mr-2" />
            Tạo nguyên liệu
          </Button>
        </div>
      </div>

      {/* BOM Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
            <CardTitle>Phân tích chi phí</CardTitle>
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
                    .format((costData.totalMaterialCost || 0) / selectedQuantity) : 
                  'Chưa tính'
                }
              </div>
              <div className="text-sm text-gray-600">Chi phí/đơn vị</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thông tin sản xuất</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <span className="text-sm text-gray-600">Lead time tối đa:</span>
              <p className="font-medium">
                {leadTimeData?.maxLeadTime || 0} ngày
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Số lượng cần:</span>
              <div className="flex items-center space-x-2 mt-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
                >
                  -
                </Button>
                <Input
                  type="number"
                  min="1"
                  value={selectedQuantity}
                  onChange={(e) => setSelectedQuantity(Math.max(1, Number(e.target.value)))}
                  className="text-center w-20"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedQuantity(selectedQuantity + 1)}
                >
                  +
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Materials Selection */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Chọn nguyên liệu cần tạo</CardTitle>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedItems.length === explosionData?.items?.length}
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-sm">Chọn tất cả</span>
              </label>
              <Badge variant="outline">
                {selectedItems.length} / {explosionData?.items?.length || 0} items
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {explosionData?.items && explosionData.items.length > 0 ? (
            <div className="space-y-2">
              {explosionData.items.map((item, index) => (
                <div 
                  key={item.itemId}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={selectedItems.includes(item.itemId)}
                      onCheckedChange={() => handleItemToggle(item.itemId)}
                    />
                    <div>
                      <p className="font-medium">{item.itemName}</p>
                      <p className="text-sm text-gray-600">
                        SKU: {item.sku || 'N/A'} | Đơn vị: {item.uom}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-blue-600">
                      {item.qtyRequired.toFixed(3)} {item.uom}
                    </p>
                    <p className="text-sm text-gray-600">
                      Level {item.level || 0}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Không có nguyên liệu nào trong BOM này.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Generate Materials Modal */}
      <Modal
        isOpen={generateModal}
        onClose={() => setGenerateModal(false)}
        title="Tạo nguyên liệu từ BOM"
      >
        <div className="space-y-4">
          <Alert>
            <CogIcon className="h-4 w-4" />
            <AlertDescription>
              Hệ thống sẽ tạo nguyên liệu sản xuất từ BOM đã chọn. 
              Bạn có thể chọn tạo mới hoặc cập nhật Production Order có sẵn.
            </AlertDescription>
          </Alert>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chế độ tạo
            </label>
            <Select
              value={productionMode}
              onChange={(e) => setProductionMode(e.target.value as 'create' | 'existing')}
            >
              <option value="create">Tạo Production Order mới</option>
              <option value="existing">Cập nhật Production Order có sẵn</option>
            </Select>
          </div>

          {productionMode === 'existing' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID Production Order
              </label>
              <Input
                type="text"
                value={existingOrderId}
                onChange={(e) => setExistingOrderId(e.target.value)}
                placeholder="Nhập ID Production Order"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ghi chú (tùy chọn)
            </label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Thêm ghi chú về việc tạo nguyên liệu..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setGenerateModal(false)}
            >
              Hủy
            </Button>
            <Button
              onClick={handleGenerateMaterials}
              disabled={isGenerating || selectedItems.length === 0}
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang tạo...
                </>
              ) : (
                <>
                  <CheckIcon className="w-4 h-4 mr-2" />
                  Tạo nguyên liệu
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
