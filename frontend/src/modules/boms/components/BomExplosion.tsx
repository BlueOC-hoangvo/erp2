// BOM Explosion Component - Multi-level BOM breakdown visualization
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  AdjustmentsHorizontalIcon,
  DocumentArrowDownIcon,
  CalculatorIcon,
  InformationCircleIcon,
  PlusIcon,
  MinusIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { toast } from 'react-hot-toast';
import { useBomExplosion } from '../hooks/useBoms';
import { urls } from '@/routes/urls';
import type { BomExplosionItem } from '../types/bom.types';

// Types for explosion data
interface ExplosionItem extends BomExplosionItem {
  parentId?: string;
  isSubBom?: boolean;
  children?: ExplosionItem[];
  path?: string[];
}

export const BomExplosion: React.FC = () => {
  const { id: bomId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedLevel, setSelectedLevel] = useState<'all' | number>('all');
  const [showOptional, setShowOptional] = useState(true);
  const [groupByLevel, setGroupByLevel] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'qty' | 'level'>('name');
  const [exportFormat, setExportFormat] = useState<'excel' | 'pdf' | 'csv'>('excel');

  // API call
  const { data: explosionData, isLoading, error } = useBomExplosion(bomId || '', quantity);

  // Process explosion data for tree structure
  const processedData = useMemo(() => {
    if (!explosionData?.items) return [];
    const items = explosionData.items;
    
    // Group by level if requested
    if (groupByLevel) {
      const grouped = items.reduce((acc, item) => {
        const level = item.level || 0;
        if (!acc[level]) acc[level] = [];
        acc[level].push(item);
        return acc;
      }, {} as Record<number, ExplosionItem[]>);

      return Object.entries(grouped)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([level, levelItems]) => ({
          level: Number(level),
          items: levelItems.sort((a, b) => {
            switch (sortBy) {
              case 'qty':
                return b.qtyRequired - a.qtyRequired;
              case 'level':
                return (a.level || 0) - (b.level || 0);
              default:
                return a.itemName.localeCompare(b.itemName);
            }
          })
        }));
    }

    // Flat list with filtering
    let filteredItems = items;
    
    if (selectedLevel !== 'all') {
      filteredItems = items.filter(item => item.level === selectedLevel);
    }

    if (!showOptional) {
      filteredItems = filteredItems.filter(item => !item.isOptional);
    }

    // Sort items
    return [{
      level: 0,
      items: filteredItems.sort((a, b) => {
        switch (sortBy) {
          case 'qty':
            return b.qtyRequired - a.qtyRequired;
          case 'level':
            return (a.level || 0) - (b.level || 0);
          default:
            return a.itemName.localeCompare(b.itemName);
        }
      })
    }];
  }, [explosionData, selectedLevel, showOptional, groupByLevel, sortBy]);

  // Calculate totals
  const totals = useMemo(() => {
    if (!explosionData?.items) return { totalItems: 0, totalQty: 0, uniqueItems: 0 };

    const items = explosionData.items;
    const uniqueItems = new Set(items.map(item => item.itemId)).size;
    const totalQty = items.reduce((sum, item) => sum + item.qtyRequired, 0);

    return {
      totalItems: items.length,
      totalQty,
      uniqueItems
    };
  }, [explosionData]);

  const handleExport = () => {
    // TODO: Implement export functionality
    processedData.flatMap(level => level.items);
    
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

  const getLevelColor = (level: number) => {
    const colors = [
      'bg-blue-100 text-blue-800 border-blue-200',
      'bg-green-100 text-green-800 border-green-200',
      'bg-yellow-100 text-yellow-800 border-yellow-200',
      'bg-purple-100 text-purple-800 border-purple-200',
      'bg-pink-100 text-pink-800 border-pink-200',
      'bg-indigo-100 text-indigo-800 border-indigo-200',
    ];
    return colors[level % colors.length];
  };

  const getItemTypeIcon = (itemType?: string) => {
    switch (itemType?.toLowerCase()) {
      case 'raw material':
        return '🧱';
      case 'component':
        return '⚙️';
      case 'sub-assembly':
        return '🔧';
      case 'finished good':
        return '✅';
      default:
        return '📦';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2">Đang phân tích BOM...</span>
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
            Không thể phân tích BOM explosion. {error.message}
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={() => navigate(urls.BOMS_DETAIL(bomId || ''))}>
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
            onClick={() => navigate(urls.BOMS_DETAIL(bomId || ''))}
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Quay lại BOM
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">BOM Explosion</h1>
            <p className="text-gray-600 mt-1">
              Phân tích chi tiết các nguyên liệu cần thiết
            </p>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExport}>
            <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
            Xuất file
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            In
          </Button>
        </div>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AdjustmentsHorizontalIcon className="w-5 h-5" />
            <span>Cài đặt phân tích</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Quantity Input */}
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

            {/* Level Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hiển thị level
              </label>
              <Select
                value={selectedLevel.toString()}
                onChange={(e) => setSelectedLevel(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              >
                <option value="all">Tất cả levels</option>
                <option value="0">Level 0 (Chính)</option>
                <option value="1">Level 1</option>
                <option value="2">Level 2</option>
                <option value="3">Level 3</option>
                <option value="4">Level 4</option>
                <option value="5">Level 5</option>
              </Select>
            </div>

            {/* Sort Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sắp xếp theo
              </label>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
              >
                <option value="name">Tên</option>
                <option value="qty">Số lượng</option>
                <option value="level">Level</option>
              </Select>
            </div>

            {/* Grouping */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hiển thị
              </label>
              <Select
                value={groupByLevel ? 'grouped' : 'flat'}
                onChange={(e) => setGroupByLevel(e.target.value === 'grouped')}
              >
                <option value="flat">Danh sách phẳng</option>
                <option value="grouped">Theo nhóm level</option>
              </Select>
            </div>

            {/* Export Format */}
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
          </div>

          <div className="mt-4 flex items-center space-x-6">
            <label className="flex items-center space-x-2">
              <Checkbox
                checked={showOptional}
                onCheckedChange={setShowOptional}
              />
              <span className="text-sm text-gray-700">Hiển thị nguyên liệu tùy chọn</span>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{totals.totalItems}</div>
            <div className="text-sm text-gray-600">Tổng line items</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{totals.uniqueItems}</div>
            <div className="text-sm text-gray-600">Loại nguyên liệu</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">
              {totals.totalQty.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">Tổng số lượng</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{quantity}</div>
            <div className="text-sm text-gray-600">Sản phẩm cần</div>
          </CardContent>
        </Card>
      </div>

      {/* Explosion Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CalculatorIcon className="w-5 h-5" />
            <span>Kết quả phân tích</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {processedData.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Không có dữ liệu để hiển thị.
            </div>
          ) : (
            <div className="space-y-6">
              {processedData.map((levelData, levelIndex) => (
                <div key={levelIndex} className="space-y-4">
                  {groupByLevel && (
                    <div className="flex items-center space-x-3 pb-2 border-b">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Level {levelData.level}
                      </h3>
                      <Badge className={getLevelColor(levelData.level)}>
                        {levelData.items.length} items
                      </Badge>
                    </div>
                  )}
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>STT</TableHead>
                        <TableHead>Nguyên liệu</TableHead>
                        <TableHead>Mã SKU</TableHead>
                        <TableHead>Loại</TableHead>
                        <TableHead>Đơn vị</TableHead>
                        <TableHead>Số lượng cần</TableHead>
                        <TableHead>Level</TableHead>
                        <TableHead>Tùy chọn</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {levelData.items.map((item, index) => (
                        <TableRow key={`${item.itemId}-${index}`}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">{getItemTypeIcon(item.itemType)}</span>
                              <span className="font-medium">{item.itemName}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {item.sku || 'N/A'}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {item.itemType || 'Material'}
                            </Badge>
                          </TableCell>
                          <TableCell>{item.uom}</TableCell>
                          <TableCell className="font-bold text-blue-600">
                            {item.qtyRequired.toFixed(3)}
                          </TableCell>
                          <TableCell>
                            <Badge className={getLevelColor(item.level || 0)}>
                              L{item.level || 0}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {item.isOptional && (
                              <Badge variant="outline" className="text-orange-600">
                                Tùy chọn
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Ghi chú phân tích</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• BOM Explosion phân tích tất cả các nguyên liệu cần thiết để sản xuất số lượng sản phẩm đã chọn.</p>
            <p>• Các nguyên liệu được chia theo levels: Level 0 là sản phẩm chính, Level 1+ là các sub-components.</p>
            <p>• Số lượng đã bao gồm hao hụt (wastage) được tính trong BOM gốc.</p>
            <p>• Có thể lọc theo level và loại bỏ nguyên liệu tùy chọn để xem chỉ những gì bắt buộc.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
