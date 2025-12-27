// BOM Detail Component - Hiển thị chi tiết BOM với đầy đủ tính năng
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  CogIcon,
  ChartBarIcon,
  ClockIcon,
  DocumentArrowDownIcon,
  EyeIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/DropdownMenu';
import { Modal } from '@/components/ui/Modal';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { toast } from 'react-hot-toast';
import { 
  useBomDetail, 
  useDeleteBom,
  useBomCost,
  useBomLeadTime
} from '../hooks/useBoms';
import { urls } from '@/routes/urls';

interface BomDetailProps {
  bomId?: string;
}

export const BomDetail: React.FC<BomDetailProps> = ({ bomId: propBomId }) => {
  const { id: urlBomId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const bomId = propBomId || urlBomId || '';
  
  const [activeTab, setActiveTab] = useState<'overview' | 'lines' | 'versions' | 'cost'>('overview');
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  // Data hooks
  const { 
    bom: bomData, 
    currentVersion, 
    isLoading, 
    error
  } = useBomDetail(bomId);
  
  const { data: costData } = useBomCost(bomId, selectedQuantity);
  const { data: leadTimeData } = useBomLeadTime(bomId);
  const deleteMutation = useDeleteBom();

  const handleEdit = () => {
    navigate(urls.BOMS_EDIT(bomId));
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(bomId);
      toast.success('Xóa BOM thành công!');
      navigate(urls.BOMS);
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xóa BOM');
    }
  };

  const handleDuplicate = () => {
    navigate(`${urls.BOMS_CREATE}?copy=${bomId}`);
  };

  const handleExplosion = () => {
    navigate(`${urls.BOMS_DETAIL(bomId)}/explosion`);
  };

  const handleCostAnalysis = () => {
    navigate(`${urls.BOMS_DETAIL(bomId)}/cost`);
  };

  const handleVersionManagement = () => {
    navigate(`${urls.BOMS_VERSIONS(bomId)}`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    toast.success('Chức năng xuất file sẽ được phát triển');
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2">Đang tải thông tin BOM...</span>
        </div>
      </div>
    );
  }

  if (error || !bomData) {
    return (
      <div className="p-6">
        <Alert>
          <AlertDescription>
            Không thể tải thông tin BOM. {error?.message}
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={() => navigate(urls.BOMS)}>
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Quay lại danh sách
          </Button>
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
            onClick={() => navigate(urls.BOMS)}
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{bomData.name}</h1>
            <div className="flex items-center space-x-4 mt-1">
              <span className="text-gray-600">Mã: {bomData.code || 'N/A'}</span>
              <Badge variant={bomData.isActive ? 'success' : 'secondary'}>
                {bomData.isActive ? 'Hoạt động' : 'Không hoạt động'}
              </Badge>
              {currentVersion && (
                <Badge variant="outline">
                  Version {currentVersion.versionNo || 'N/A'}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              Thao tác
              <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleEdit}>
              <PencilIcon className="w-4 h-4 mr-2" />
              Chỉnh sửa
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDuplicate}>
              <DocumentDuplicateIcon className="w-4 h-4 mr-2" />
              Sao chép BOM
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExplosion}>
              <CogIcon className="w-4 h-4 mr-2" />
              BOM Explosion
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleCostAnalysis}>
              <ChartBarIcon className="w-4 h-4 mr-2" />
              Phân tích chi phí
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleVersionManagement}>
              <ClockIcon className="w-4 h-4 mr-2" />
              Quản lý phiên bản
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate(urls.BOMS_PRODUCTION_INTEGRATION(bomId))}>
              <CogIcon className="w-4 h-4 mr-2" />
              Tích hợp Production
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate(urls.PRODUCTION_ORDER_FROM_BOM + `?bomId=${bomId}&quantity=1`)}>
              <PlusIcon className="w-4 h-4 mr-2" />
              Tạo Production Order
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExport}>
              <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
              Xuất file
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handlePrint}>
              <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
              In
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDeleteModal(true)}>
              <span className="text-red-600">
                <TrashIcon className="w-4 h-4 mr-2" />
                Xóa BOM
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'overview', label: 'Tổng quan', icon: EyeIcon },
            { key: 'lines', label: 'Nguyên liệu', icon: CogIcon },
            { key: 'versions', label: 'Phiên bản', icon: ClockIcon },
            { key: 'cost', label: 'Chi phí', icon: ChartBarIcon },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* BOM Information */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin BOM</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Mã BOM</label>
                      <p className="mt-1 text-sm text-gray-900">{bomData.code || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Tên BOM</label>
                      <p className="mt-1 text-sm text-gray-900">{bomData.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Kiểu sản phẩm</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {bomData.productStyle ? 
                          `${bomData.productStyle.code} - ${bomData.productStyle.name}` : 
                          'N/A'
                        }
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Trạng thái</label>
                      <p className="mt-1">
                        <Badge variant={bomData.isActive ? 'success' : 'secondary'}>
                          {bomData.isActive ? 'Hoạt động' : 'Không hoạt động'}
                        </Badge>
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Ngày tạo</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {bomData.createdAt ? new Date(bomData.createdAt).toLocaleString('vi-VN') : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Cập nhật lần cuối</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {bomData.updatedAt ? new Date(bomData.updatedAt).toLocaleString('vi-VN') : 'N/A'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Thống kê nhanh</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {bomData.lines?.length ?? 0}
                    </div>
                    <div className="text-sm text-gray-600">Nguyên liệu</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {bomData.lines?.filter(l => !l.isOptional).length ?? 0}
                    </div>
                    <div className="text-sm text-gray-600">Bắt buộc</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {bomData.lines?.filter(l => l.isOptional).length ?? 0}
                    </div>
                    <div className="text-sm text-gray-600">Tùy chọn</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Phân tích nhanh</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Chi phí ước tính:</span>
                    <span className="font-medium">
                      {costData ? 
                        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
                          .format(costData.totalMaterialCost || 0) : 
                        'Chưa tính'
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Lead time:</span>
                    <span className="font-medium">
                      {leadTimeData ? 
                        `${leadTimeData.maxLeadTime || 0} ngày` : 
                        'Chưa tính'
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Phiên bản hiện tại:</span>
                    <span className="font-medium">
                      {currentVersion ? `v${currentVersion.versionNo || 'N/A'}` : 'Chưa có'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'lines' && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Danh sách nguyên liệu</CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Thêm nguyên liệu
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setSelectedQuantity(prev => prev + 1)}>
                    Tính cho {selectedQuantity} sản phẩm
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {bomData.lines && bomData.lines.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>STT</TableHead>
                      <TableHead>Nguyên liệu</TableHead>
                      <TableHead>Mã</TableHead>
                      <TableHead>Đơn vị</TableHead>
                      <TableHead>Số lượng/đơn vị</TableHead>
                      <TableHead>Hao hụt %</TableHead>
                      <TableHead>Thực tế cần</TableHead>
                      <TableHead>Lead time</TableHead>
                      <TableHead>Ghi chú</TableHead>
                      <TableHead>Tùy chọn</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bomData.lines.map((line, index) => {
                      const qtyPerUnit = Number(line.qtyPerUnit) || 0;
                      const wastagePercent = Number(line.wastagePercent) || 0;
                      const effectiveQty = qtyPerUnit * (1 + (wastagePercent / 100));
                      const requiredQty = effectiveQty * selectedQuantity;
                      
                      return (
                        <TableRow key={line.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell className="font-medium">
                            {line.item?.name || 'N/A'}
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {line.item?.sku || line.item?.code || 'N/A'}
                          </TableCell>
                          <TableCell>{line.uom}</TableCell>
                          <TableCell>{line.qtyPerUnit}</TableCell>
                          <TableCell>{line.wastagePercent}%</TableCell>
                          <TableCell className="font-medium">
                            {requiredQty.toFixed(2)} {line.uom}
                          </TableCell>
                          <TableCell>{line.leadTimeDays || 0} ngày</TableCell>
                          <TableCell className="max-w-xs truncate">
                            {line.note || '-'}
                          </TableCell>
                          <TableCell>
                            {line.isOptional && (
                              <Badge variant="outline" className="text-xs">
                                Tùy chọn
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Chưa có nguyên liệu nào trong BOM này.
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'versions' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Phiên bản BOM</CardTitle>
                  <Button variant="outline" size="sm">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Tạo phiên bản mới
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {currentVersion ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div>
                        <h3 className="font-medium text-green-800">
                          Phiên bản hiện tại: v{currentVersion.versionNo}
                        </h3>
                        <p className="text-sm text-green-600">
                          {currentVersion.description || 'Không có mô tả'}
                        </p>
                        <p className="text-xs text-green-600 mt-1">
                          Ngày tạo: {new Date(currentVersion.createdAt || '').toLocaleString('vi-VN')}
                        </p>
                      </div>
                      <Badge variant="success">Đang sử dụng</Badge>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Chưa có phiên bản nào cho BOM này.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'cost' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Phân tích chi phí</CardTitle>
              </CardHeader>
              <CardContent>
                {costData ? (
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
                          .format(costData.totalMaterialCost || 0)}
                      </div>
                      <div className="text-sm text-blue-600">Tổng chi phí vật liệu</div>
                      <div className="text-xs text-blue-500 mt-1">
                        Cho {selectedQuantity} sản phẩm
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Chi phí/đơn vị:</span>
                        <span className="font-medium">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
                            .format((costData.totalMaterialCost || 0) / selectedQuantity)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Số nguyên liệu:</span>
                        <span className="font-medium">
                          {costData.materialCosts?.length || 0} loại
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Chưa có dữ liệu chi phí.
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lead time</CardTitle>
              </CardHeader>
              <CardContent>
                {leadTimeData ? (
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="text-3xl font-bold text-orange-600">
                        {leadTimeData.maxLeadTime || 0}
                      </div>
                      <div className="text-sm text-orange-600">Ngày tối đa</div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Lead time tổng:</span>
                        <span className="font-medium">
                          {leadTimeData.totalLeadTime || 0} ngày
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Ước tính:</span>
                        <span className="font-medium">
                          {leadTimeData.estimatedDays || 0} ngày
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Chưa có dữ liệu lead time.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Xác nhận xóa BOM"
      >
        <div className="space-y-4">
          <Alert>
            <AlertDescription>
              Bạn có chắc chắn muốn xóa BOM <strong>{bomData.name}</strong> không?
            </AlertDescription>
          </Alert>
          <p className="text-sm text-red-600">
            Hành động này không thể hoàn tác và sẽ xóa tất cả các phiên bản BOM liên quan.
          </p>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setDeleteModal(false)}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Đang xóa...' : 'Xóa'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
