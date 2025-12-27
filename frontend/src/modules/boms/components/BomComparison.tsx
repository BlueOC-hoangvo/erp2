// BOM Comparison Component - So sánh các phiên bản BOM
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  ArrowsRightLeftIcon,
  DocumentArrowDownIcon,
  PlusIcon,
  MinusIcon,
  CheckIcon,
  XMarkIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { Select } from '@/components/ui/Select';
import { toast } from 'react-hot-toast';
import { useCompareVersions } from '../hooks/useBoms';
import type { BomVersionComparison, BomDifference } from '../types/bom.types';

export const BomComparison: React.FC = () => {
  const { versionId1, versionId2 } = useParams<{ versionId1: string; versionId2: string }>();
  const navigate = useNavigate();
  
  const [selectedVersion1, setSelectedVersion1] = useState(versionId1 || '');
  const [selectedVersion2, setSelectedVersion2] = useState(versionId2 || '');
  const [viewMode, setViewMode] = useState<'detailed' | 'summary'>('detailed');
  const [filterChanges, setFilterChanges] = useState<'all' | 'ADDED' | 'REMOVED' | 'MODIFIED'>('all');

  // Mock versions data - Replace with actual API calls
  const mockVersions = [
    { id: '1', versionNo: 'v1.0', status: 'APPROVED', createdAt: '2024-01-15T10:00:00Z' },
    { id: '2', versionNo: 'v1.1', status: 'APPROVED', createdAt: '2024-01-20T09:15:00Z' },
    { id: '3', versionNo: 'v2.0', status: 'DRAFT', createdAt: '2024-01-25T11:30:00Z' },
  ];

  // API call for comparison
  const { data: comparisonData, isLoading, error } = useCompareVersions(
    selectedVersion1, 
    selectedVersion2
  );

  // Process comparison data
  const comparison = useMemo(() => {
    if (!comparisonData || !selectedVersion1 || !selectedVersion2 || selectedVersion1 === selectedVersion2) {
      return null;
    }

    return comparisonData;
  }, [comparisonData, selectedVersion1, selectedVersion2]);

  // Filter differences based on selected filter
  const filteredDifferences = useMemo(() => {
    if (!comparison?.differences) return [];
    
    if (filterChanges === 'all') {
      return comparison.differences;
    }
    
    return comparison.differences.filter(diff => diff.type === filterChanges);
  }, [comparison, filterChanges]);

  const handleVersionChange = (versionId: string, position: '1' | '2') => {
    if (position === '1') {
      setSelectedVersion1(versionId);
    } else {
      setSelectedVersion2(versionId);
    }
  };

  const handleExport = () => {
    if (!comparison) {
      toast.error('Vui lòng chọn 2 phiên bản để so sánh');
      return;
    }
    
    toast.success('Chức năng xuất file sẽ được phát triển');
  };

  const handlePrint = () => {
    window.print();
  };

  const getDifferenceIcon = (type: string) => {
    switch (type) {
      case 'ADDED':
        return <PlusIcon className="w-4 h-4 text-green-600" />;
      case 'REMOVED':
        return <MinusIcon className="w-4 h-4 text-red-600" />;
      case 'MODIFIED':
        return <ArrowsRightLeftIcon className="w-4 h-4 text-blue-600" />;
      default:
        return <InformationCircleIcon className="w-4 h-4 text-gray-600" />;
    }
  };

  const getDifferenceBadge = (type: string) => {
    const variants = {
      'ADDED': 'success' as const,
      'REMOVED': 'destructive' as const,
      'MODIFIED': 'outline' as const
    };

    const labels = {
      'ADDED': 'Đã thêm',
      'REMOVED': 'Đã xóa',
      'MODIFIED': 'Đã sửa'
    };

    return (
      <Badge variant={variants[type as keyof typeof variants] || 'secondary'}>
        {labels[type as keyof typeof labels] || type}
      </Badge>
    );
  };

  const getChangeColor = (type: string) => {
    switch (type) {
      case 'ADDED': return 'bg-green-50 border-green-200';
      case 'REMOVED': return 'bg-red-50 border-red-200';
      case 'MODIFIED': return 'bg-blue-50 border-blue-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const calculateSummary = () => {
    if (!comparison?.differences) return { added: 0, removed: 0, modified: 0, total: 0 };
    
    const added = comparison.differences.filter(d => d.type === 'ADDED').length;
    const removed = comparison.differences.filter(d => d.type === 'REMOVED').length;
    const modified = comparison.differences.filter(d => d.type === 'MODIFIED').length;
    
    return { added, removed, modified, total: added + removed + modified };
  };

  const summary = calculateSummary();

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2">Đang so sánh các phiên bản...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert>
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertDescription>
            Không thể so sánh các phiên bản. {error.message}
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={() => navigate(-1)}>
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Quay lại
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
            onClick={() => navigate(-1)}
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">So sánh phiên bản BOM</h1>
            <p className="text-gray-600 mt-1">
              Phân tích sự khác biệt giữa các phiên bản BOM
            </p>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExport}>
            <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
            Xuất báo cáo
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            In báo cáo
          </Button>
        </div>
      </div>

      {/* Version Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Chọn phiên bản để so sánh</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Version 1 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phiên bản thứ nhất
              </label>
              <Select
                value={selectedVersion1}
                onChange={(e) => handleVersionChange(e.target.value, '1')}
              >
                <option value="">Chọn phiên bản...</option>
                {mockVersions.map(version => (
                  <option key={version.id} value={version.id}>
                    {version.versionNo} ({version.status}) - {new Date(version.createdAt).toLocaleDateString('vi-VN')}
                  </option>
                ))}
              </Select>
            </div>

            {/* Version 2 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phiên bản thứ hai
              </label>
              <Select
                value={selectedVersion2}
                onChange={(e) => handleVersionChange(e.target.value, '2')}
              >
                <option value="">Chọn phiên bản...</option>
                {mockVersions.map(version => (
                  <option key={version.id} value={version.id}>
                    {version.versionNo} ({version.status}) - {new Date(version.createdAt).toLocaleDateString('vi-VN')}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-4 flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Chế độ xem:</label>
              <Select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value as any)}
              >
                <option value="detailed">Chi tiết</option>
                <option value="summary">Tóm tắt</option>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Lọc thay đổi:</label>
              <Select
                value={filterChanges}
                onChange={(e) => setFilterChanges(e.target.value as any)}
              >
                <option value="all">Tất cả</option>
                <option value="ADDED">Đã thêm</option>
                <option value="REMOVED">Đã xóa</option>
                <option value="MODIFIED">Đã sửa</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comparison Results */}
      {comparison ? (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600">{summary.total}</div>
                <div className="text-sm text-gray-600">Tổng thay đổi</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">{summary.added}</div>
                <div className="text-sm text-gray-600">Đã thêm</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-red-600">{summary.removed}</div>
                <div className="text-sm text-gray-600">Đã xóa</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-orange-600">{summary.modified}</div>
                <div className="text-sm text-gray-600">Đã sửa</div>
              </CardContent>
            </Card>
          </div>

          {/* Version Info */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border-r pr-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Phiên bản 1: {comparison.version1?.versionNo}
                  </h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>Trạng thái: {comparison.version1?.status}</div>
                    <div>ID: {comparison.version1?.id}</div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Phiên bản 2: {comparison.version2?.versionNo}
                  </h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>Trạng thái: {comparison.version2?.status}</div>
                    <div>ID: {comparison.version2?.id}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Changes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ArrowsRightLeftIcon className="w-5 h-5" />
                <span>Chi tiết thay đổi</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredDifferences.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Không có thay đổi nào để hiển thị với bộ lọc đã chọn.
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredDifferences.map((difference, index) => (
                    <div 
                      key={index} 
                      className={`p-4 border rounded-lg ${getChangeColor(difference.type)}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          {getDifferenceIcon(difference.type)}
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              {getDifferenceBadge(difference.type)}
                              <span className="font-medium">{difference.field || 'Không xác định'}</span>
                            </div>
                            
                            <div className="text-sm text-gray-700 mb-2">
                              {difference.description}
                            </div>

                            {difference.type === 'MODIFIED' && (
                              <div className="flex items-center space-x-4 text-sm">
                                <div className="flex items-center space-x-1">
                                  <span className="text-red-600 font-medium">Cũ:</span>
                                  <span>{difference.oldValue?.toString()}</span>
                                </div>
                                <ArrowsRightLeftIcon className="w-4 h-4 text-gray-400" />
                                <div className="flex items-center space-x-1">
                                  <span className="text-green-600 font-medium">Mới:</span>
                                  <span>{difference.newValue?.toString()}</span>
                                </div>
                              </div>
                            )}

                            {difference.type === 'ADDED' && (
                              <div className="text-sm text-green-600">
                                <CheckIcon className="w-4 h-4 inline mr-1" />
                                Nguyên liệu mới được thêm vào BOM
                              </div>
                            )}

                            {difference.type === 'REMOVED' && (
                              <div className="text-sm text-red-600">
                                <XMarkIcon className="w-4 h-4 inline mr-1" />
                                Nguyên liệu đã được loại khỏi BOM
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Impact Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Phân tích tác động</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Tác động tích cực</h4>
                  <ul className="space-y-2 text-sm text-green-600">
                    <li>• {summary.added} nguyên liệu mới được thêm vào</li>
                    <li>• {summary.modified} thay đổi tối ưu hóa BOM</li>
                    <li>• Cải thiện độ chính xác trong tính toán</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Cần chú ý</h4>
                  <ul className="space-y-2 text-sm text-orange-600">
                    <li>• {summary.removed} nguyên liệu đã bị loại bỏ</li>
                    <li>• Cần cập nhật quy trình sản xuất</li>
                    <li>• Kiểm tra tồn kho nguyên liệu mới</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="p-8">
            <div className="text-center">
              <ArrowsRightLeftIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Chọn phiên bản để so sánh
              </h3>
              <p className="text-gray-600">
                Vui lòng chọn 2 phiên bản BOM khác nhau để xem sự khác biệt giữa chúng.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
