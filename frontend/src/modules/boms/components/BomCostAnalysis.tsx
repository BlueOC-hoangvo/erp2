// BOM Cost Analysis Component - Chi phí phân tích và visualization
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  CalculatorIcon,
  DocumentArrowDownIcon,
  AdjustmentsHorizontalIcon,
  InformationCircleIcon,
  PlusIcon,
  MinusIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { Select } from '@/components/ui/Select';
import { Progress } from '@/components/ui/Progress';
import { toast } from 'react-hot-toast';
import { useBomCost } from '../hooks/useBoms';
// import { urls } from '@/routes/urls';


export const BomCostAnalysis: React.FC = () => {
  const { id: bomId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedCurrency, setSelectedCurrency] = useState('VND');
  const [includeWastage, setIncludeWastage] = useState(true);
  const [sortBy, setSortBy] = useState<'name' | 'cost' | 'percentage'>('cost');
  const [groupBy, setGroupBy] = useState<'none' | 'type' | 'category'>('none');
  const [exportFormat, setExportFormat] = useState<'excel' | 'pdf' | 'csv'>('excel');

  // API call
  const { data: costData, isLoading, error } = useBomCost(bomId || '', quantity);

  // Process cost data for analysis
  const processedData = useMemo(() => {
    if (!costData?.materialCosts) return { items: [], total: 0, summary: {} };

    const items = costData.materialCosts;
    let filteredItems = [...items];

    // Sort items
    filteredItems.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.itemName || '').localeCompare(b.itemName || '');
        case 'cost':
          return (b.totalCost || 0) - (a.totalCost || 0);
        case 'percentage':
          const aPercent = ((a.totalCost || 0) / costData.totalMaterialCost) * 100;
          const bPercent = ((b.totalCost || 0) / costData.totalMaterialCost) * 100;
          return bPercent - aPercent;
        default:
          return 0;
      }
    });

    // Group items if requested
    if (groupBy !== 'none') {
      const grouped = filteredItems.reduce((acc, item) => {
        const key = item.itemType || 'Other';
        if (!acc[key]) {
          acc[key] = { items: [], total: 0, count: 0 };
        }
        acc[key].items.push(item);
        acc[key].total += item.totalCost || 0;
        acc[key].count += 1;
        return acc;
      }, {} as Record<string, { items: any[], total: number, count: number }>);

      return {
        items: Object.entries(grouped).map(([type, data]) => ({
          type,
          ...data,
          percentage: (data.total / costData.totalMaterialCost) * 100
        })),
        total: costData.totalMaterialCost,
        summary: {
          totalItems: items.length,
          totalQuantity: quantity,
          averageCost: costData.totalMaterialCost / quantity,
          costPerUnit: costData.totalMaterialCost / quantity,
          materialTypes: Object.keys(grouped).length
        }
      };
    }

    return {
      items: filteredItems,
      total: costData.totalMaterialCost,
      summary: {
        totalItems: items.length,
        totalQuantity: quantity,
        averageCost: costData.totalMaterialCost / quantity,
        costPerUnit: costData.totalMaterialCost / quantity,
        materialTypes: new Set(items.map(item => item.itemType)).size
      }
    };
  }, [costData, quantity, sortBy, groupBy]);

  // Calculate cost distribution for visualization
  const costDistribution = useMemo(() => {
    if (!costData?.materialCosts) return [];

    const items = costData.materialCosts
      .sort((a, b) => (b.totalCost || 0) - (a.totalCost || 0))
      .slice(0, 10); // Top 10 most expensive items

    return items.map(item => ({
      name: item.itemName || 'Unknown',
      cost: item.totalCost || 0,
      percentage: ((item.totalCost || 0) / costData.totalMaterialCost) * 100,
      quantity: item.qtyRequired
    }));
  }, [costData]);

  const handleExport = () => {
    // TODO: Implement export functionality
    switch (exportFormat) {
      case 'excel':
        toast.success('Xuất Excel sẽ được phát triển');
        break;
      case 'pdf':
        toast.success('Xuất PDF sẽ được phát triển');
        break;
      case 'csv':
        toast.success('Xuất CSV sẽ được phát triển');
        break;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: selectedCurrency
    }).format(amount);
  };

  const getCostStatusColor = (cost: number, total: number) => {
    const percentage = (cost / total) * 100;
    if (percentage > 30) return 'text-red-600 bg-red-100';
    if (percentage > 10) return 'text-orange-600 bg-orange-100';
    if (percentage > 5) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2">Đang tính toán chi phí...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert>
          <InformationCircleIcon className="h-4 w-4" />
          <AlertDescription>
            Không thể tính toán chi phí BOM. {error.message}
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={() => navigate(-1)}>
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Quay lại BOM
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
            Quay lại BOM
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Phân tích chi phí BOM</h1>
            <p className="text-gray-600 mt-1">
              Chi tiết chi phí nguyên liệu và phân tích tài chính
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

      {/* Cost Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AdjustmentsHorizontalIcon className="w-5 h-5" />
            <span>Cài đặt phân tích</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số lượng sản phẩm
              </label>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <MinusIcon className="w-4 h-4" />
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
                  <PlusIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Currency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Đơn vị tiền tệ
              </label>
              <Select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
              >
                <option value="VND">VND (Việt Nam)</option>
                <option value="USD">USD (US Dollar)</option>
                <option value="EUR">EUR (Euro)</option>
                <option value="JPY">JPY (Japanese Yen)</option>
              </Select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sắp xếp theo
              </label>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
              >
                <option value="cost">Chi phí</option>
                <option value="name">Tên nguyên liệu</option>
                <option value="percentage">Phần trăm</option>
              </Select>
            </div>

            {/* Group by */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nhóm theo
              </label>
              <Select
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value as any)}
              >
                <option value="none">Không nhóm</option>
                <option value="type">Theo loại</option>
                <option value="category">Theo danh mục</option>
              </Select>
            </div>

            {/* Export format */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Định dạng xuất
              </label>
              <Select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value as any)}
              >
                <option value="excel">Excel (.xlsx)</option>
                <option value="pdf">PDF (.pdf)</option>
                <option value="csv">CSV (.csv)</option>
              </Select>
            </div>

            {/* Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tùy chọn
              </label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={includeWastage}
                    onChange={(e) => setIncludeWastage(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Bao gồm hao hụt</span>
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cost Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(processedData.total)}
                </div>
                <div className="text-sm text-gray-600">Tổng chi phí</div>
                <div className="text-xs text-gray-500">cho {quantity} sản phẩm</div>
              </div>
              <CurrencyDollarIcon className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(processedData.summary.costPerUnit || 0)}
                </div>
                <div className="text-sm text-gray-600">Chi phí/đơn vị</div>
                <div className="text-xs text-gray-500">1 sản phẩm</div>
              </div>
              <CalculatorIcon className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {processedData.summary.totalItems}
                </div>
                <div className="text-sm text-gray-600">Loại nguyên liệu</div>
                <div className="text-xs text-gray-500">{processedData.summary.materialTypes} categories</div>
              </div>
              <ChartBarIcon className="w-8 h-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {processedData.summary.totalQuantity}
                </div>
                <div className="text-sm text-gray-600">Tổng số lượng</div>
                <div className="text-xs text-gray-500">đơn vị nguyên liệu</div>
              </div>
              <ArrowTrendingUpIcon className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cost Breakdown Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ChartBarIcon className="w-5 h-5" />
            <span>Chi tiết chi phí</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {groupBy === 'none' ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>STT</TableHead>
                  <TableHead>Nguyên liệu</TableHead>
                  <TableHead>Mã SKU</TableHead>
                  <TableHead>Đơn vị</TableHead>
                  <TableHead>Số lượng</TableHead>
                  <TableHead>Đơn giá</TableHead>
                  <TableHead>Thành tiền</TableHead>
                  <TableHead>% Tổng chi phí</TableHead>
                  <TableHead>Biểu đồ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {processedData.items.map((item: any, index) => {
                  const percentage = ((item.totalCost || 0) / processedData.total) * 100;
                  const costStatusClass = getCostStatusColor(item.totalCost || 0, processedData.total);
                  
                  return (
                    <TableRow key={item.itemId || index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium">
                        {item.itemName || 'N/A'}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {item.sku || 'N/A'}
                      </TableCell>
                      <TableCell>{item.uom || 'pcs'}</TableCell>
                      <TableCell>
                        {item.qtyRequired?.toFixed(2) || '0.00'}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(item.unitCost || 0)}
                      </TableCell>
                      <TableCell>
                        <span className={`font-bold ${costStatusClass.split(' ')[0]}`}>
                          {formatCurrency(item.totalCost || 0)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">
                            {percentage.toFixed(1)}%
                          </span>
                          <div className="w-16">
                            <Progress value={percentage} className="h-2" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={`w-4 h-4 rounded-full ${costStatusClass.split(' ')[1]}`} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nhóm</TableHead>
                  <TableHead>Số loại</TableHead>
                  <TableHead>Tổng chi phí</TableHead>
                  <TableHead>% Tổng chi phí</TableHead>
                  <TableHead>Chi phí trung bình</TableHead>
                  <TableHead>Biểu đồ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {processedData.items.map((group: any) => (
                  <TableRow key={group.type}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{group.type}</span>
                        <Badge variant="outline">{group.count} items</Badge>
                      </div>
                    </TableCell>
                    <TableCell>{group.count}</TableCell>
                    <TableCell className="font-bold text-blue-600">
                      {formatCurrency(group.total)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">
                          {group.percentage.toFixed(1)}%
                        </span>
                        <div className="w-20">
                          <Progress value={group.percentage} className="h-2" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatCurrency(group.total / group.count)}
                    </TableCell>
                    <TableCell>
                      <div className={`w-4 h-4 rounded-full bg-blue-100`} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Cost Distribution Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Phân bố chi phí (Top 10)</CardTitle>
        </CardHeader>
        <CardContent>
          {costDistribution.length > 0 ? (
            <div className="space-y-3">
              {costDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-sm text-gray-600">
                        {item.percentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Progress value={item.percentage} className="flex-1 h-2" />
                      <span className="text-sm font-medium text-blue-600">
                        {formatCurrency(item.cost)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Chưa có dữ liệu để hiển thị biểu đồ.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Phân tích & Khuyến nghị</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <InformationCircleIcon className="h-4 w-4" />
              <AlertDescription>
                <strong>Tổng chi phí nguyên liệu:</strong> {formatCurrency(processedData.total)} cho {quantity} sản phẩm
                ({formatCurrency(processedData.summary.costPerUnit || 0)}/đơn vị)
              </AlertDescription>
            </Alert>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Điểm nổi bật</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• {processedData.summary.totalItems} loại nguyên liệu khác nhau</li>
                  <li>• Chi phí trung bình: {formatCurrency(processedData.summary.averageCost || 0)}</li>
                  <li>• {processedData.summary.materialTypes} nhóm nguyên liệu</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Khuyến nghị</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Xem xét tối ưu hóa các nguyên liệu có chi phí cao</li>
                  <li>• Đàm phán giá với nhà cung cấp cho đơn hàng lớn</li>
                  <li>• Theo dõi biến động giá nguyên liệu định kỳ</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
